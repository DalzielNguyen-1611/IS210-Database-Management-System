CREATE OR REPLACE PROCEDURE SP_THANH_TOAN_DON_HANG (
    p_MADONHANG IN NUMBER,
    p_PHUONGTHUCTHANHTHOAN IN NVARCHAR2
) AS
    v_MADOITAC NUMBER;
    v_MACUAHANG NUMBER;
    v_MANHANVIEN NUMBER;
    v_TONGTIENTAMTINH NUMBER;
    v_DIEMMUONDUNG NUMBER;
    v_DIEMTICHDUOC NUMBER;
    v_MAHOADON NUMBER;
    v_MATAIKHOAN NUMBER;
    v_MAKHO NUMBER;
    v_SOPHIEUXUAT NVARCHAR2(100);
BEGIN
    -- 1) Lấy thông tin đơn hàng
    SELECT MADOITAC, MACUAHANG, MANHANVIEN, TONGTIENTAMTINH, DIEMMUONDUNG
    INTO v_MADOITAC, v_MACUAHANG, v_MANHANVIEN, v_TONGTIENTAMTINH, v_DIEMMUONDUNG
    FROM DON_HANG
    WHERE MADONHANG = p_MADONHANG;

    -- 2) Tính điểm
    v_DIEMTICHDUOC := TRUNC(NVL(v_TONGTIENTAMTINH,0));

    -- 3) Xác định tài khoản thu tiền
    IF p_PHUONGTHUCTHANHTHOAN = N'Tiền mặt' THEN
        v_MATAIKHOAN := 1;
    ELSE
        v_MATAIKHOAN := 2;
    END IF;

    -- 4) Lấy MAKHO tương ứng với MACUAHANG (chọn first match)
    BEGIN
        SELECT MAKHO
        INTO v_MAKHO
        FROM (
            SELECT MAKHO FROM KHO WHERE MACUAHANG = v_MACUAHANG AND MAKHO IS NOT NULL
        )
        WHERE ROWNUM = 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20001, 'Lỗi hệ thống: Cửa hàng ' || v_MACUAHANG || ' chưa cấu hình kho xuất hàng.');
    END;

    -- 5) Tạo hóa đơn bán hàng và lấy MAHOADON (PL/SQL hỗ trợ RETURNING INTO)
    INSERT INTO HOA_DON_BAN_HANG (
        MADOITAC, MADONHANG, MACUAHANG, NGAYBAN, TONGTIEN,
        DIEMTICHDUOC, DIEMSUDUNG, PHUONGTHUCTHANHTHOAN, MANHANVIEN
    ) VALUES (
        v_MADOITAC, p_MADONHANG, v_MACUAHANG, SYSTIMESTAMP, v_TONGTIENTAMTINH,
        v_DIEMTICHDUOC, v_DIEMMUONDUNG, p_PHUONGTHUCTHANHTHOAN, v_MANHANVIEN
    ) RETURNING MAHOADON INTO v_MAHOADON;

    -- 6) Chép chi tiết hóa đơn
    INSERT INTO CHI_TIET_HOA_DON_BAN_HANG (
        MASANPHAM, MAHOADON, SOLUONG, DONGIA, THANHTIEN
    )
    SELECT MASANPHAM, v_MAHOADON, SOLUONG, DONGIA, THANHTIEN
    FROM CHI_TIET_DON_HANG
    WHERE MADONHANG = p_MADONHANG;

    -- 7) Tạo SOPHIEU xuất kho
    v_SOPHIEUXUAT := 'PXK-' || TO_CHAR(SYSTIMESTAMP, 'YYYYMMDDHH24MI') || '-' || v_MAHOADON;

    INSERT INTO PHIEU_KHO (
        SOPHIEU, LOAIPHIEU, MAHOADON, NGAYLAP, NGAYTHUCPHE, 
        KHODI, KHODEN, DOITAC, TONGGIATRIPHIEU, NGUOIPHUTRACH, TRANGTHAI
    ) VALUES (
        v_SOPHIEUXUAT, N'Xuất kho bán hàng', v_MAHOADON, SYSTIMESTAMP, SYSTIMESTAMP,
        v_MAKHO, NULL, v_MADOITAC, v_TONGTIENTAMTINH, v_MANHANVIEN, N'Đã xuất'
    );

    -- 8) Lặp qua chi tiết đơn hàng: tạo chi tiết phiếu và trừ tồn kho, bắt lỗi nếu không có record TON_KHO tương ứng
    FOR rec IN (
        SELECT MASANPHAM, SOLUONG, DONGIA, THANHTIEN
        FROM CHI_TIET_DON_HANG
        WHERE MADONHANG = p_MADONHANG
    ) LOOP
        -- 8.a Ghi chi tiết phiếu
        INSERT INTO CHI_TIET_PHIEU (
            SOPHIEU, MASANPHAM, SOLUONG, DONGIA, THANHTIEN
        ) VALUES (
            v_SOPHIEUXUAT, rec.MASANPHAM, rec.SOLUONG, rec.DONGIA, rec.THANHTIEN
        );

        -- 8.b Trừ tồn kho theo (MASANPHAM, MAKHO)
        UPDATE TON_KHO
        SET SOLUONGTON = SOLUONGTON - rec.SOLUONG,
            NGAYCAPNHAP = SYSTIMESTAMP
        WHERE MASANPHAM = rec.MASANPHAM
          AND MAKHO = v_MAKHO;

        -- 8.c Nếu không trừ được (không tồn tại hàng trong kho), raise để rollback toàn bộ
        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20002, 'Lỗi hệ thống: Sản phẩm mã ' || rec.MASANPHAM || ' không tồn tại trong kho ' || v_MAKHO || '. Vui lòng kiểm tra dữ liệu tồn kho.');
        END IF;

        -- 8.d (Tùy chọn) Không cho SOLUONGTON âm. Nếu âm, đặt = 0 và cũng raise (tùy policy)
        -- Bạn có thể bật đoạn sau nếu không muốn tồn âm:
        -- UPDATE TON_KHO SET SOLUONGTON = 0 WHERE MASANPHAM = rec.MASANPHAM AND MAKHO = v_MAKHO AND SOLUONGTON < 0;
    END LOOP;

    -- 9) Cập nhật trạng thái đơn hàng
    UPDATE DON_HANG
    SET TRANGTHAI = N'Đã thanh toán'
    WHERE MADONHANG = p_MADONHANG;

    -- 10) Cộng điểm khách hàng
    UPDATE KHACH_HANG
    SET DIEMTICHLUY = NVL(DIEMTICHLUY,0) + v_DIEMTICHDUOC - NVL(v_DIEMMUONDUNG,0)
    WHERE MADOITAC = v_MADOITAC;

    -- 11) Ghi nhận giao dịch tiền
    INSERT INTO GIAO_DICH_TIEN (
        MACUAHANG, MATAIKHOAN, LOAIGIAODICH, SOTIEN, NGAYGIAODICH, MAHOADONBAN, GHICHU
    ) VALUES (
        v_MACUAHANG, v_MATAIKHOAN, N'Thu tiền bán hàng', v_TONGTIENTAMTINH, SYSTIMESTAMP, v_MAHOADON, N'Thanh toán POS cho Đơn hàng #' || TO_CHAR(p_MADONHANG)
    );

    -- 12) Cập nhật số dư tài khoản kế toán
    UPDATE TAI_KHOAN
    SET SODUHIENTAI = SODUHIENTAI + v_TONGTIENTAMTINH
    WHERE MATAIKHOAN = v_MATAIKHOAN;

    -- 13) Commit toàn bộ nếu không có lỗi
    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        -- đảm bảo rollback và trả lỗi rõ ràng lên caller
        ROLLBACK;
        RAISE;
END SP_THANH_TOAN_DON_HANG;

commit