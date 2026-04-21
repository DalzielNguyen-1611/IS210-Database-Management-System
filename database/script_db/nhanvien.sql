DECLARE
    v_macuahang NUMBER;
    v_manhanvien NUMBER;
BEGIN
    -- 1. Tạm thời tắt ràng buộc để tránh vòng lặp (Nếu cần)
    -- Ở đây chúng ta sẽ lách bằng cách insert Cửa hàng với quản lý tạm thời là 0
    
    -- Bước 1: Tạo Cửa hàng gốc (Tạm để QUANLY = 0 vì chưa có nhân viên)
    INSERT INTO CUA_HANG (TENCUAHANG, DIACHI, SODIENTHOAI, QUANLY) 
    VALUES ('Lumiere Main Store', '702 Nguyen Van Linh, District 7', '0123456789', 0)
    RETURNING MACUAHANG INTO v_macuahang;

    -- Bước 2: Tạo Nhân viên gốc thuộc Cửa hàng vừa tạo
    INSERT INTO NHANVIEN (MACUAHANG, HOTEN, SDT, EMAIL, NGAYVAOLAM, TRANGTHAI) 
    VALUES (v_macuahang, 'Admin Quan Tri', '0987654321', 'admin@lumiere.com', SYSDATE, 'Active')
    RETURNING MANHANVIEN INTO v_manhanvien;

    -- Bước 3: Cập nhật lại Quản lý thực sự cho Cửa hàng
    UPDATE CUA_HANG SET QUANLY = v_manhanvien WHERE MACUAHANG = v_macuahang;

    -- Bước 4: Tạo Tài khoản với mật khẩu '123456'
    INSERT INTO TAI_KHOAN_NHAN_VIEN 
        (MANHANVIEN, USERNAME, PASSWORDHASH, PASSWORDHASHHISTORY, NGAYTAO, LAST_LOGIN, TRANG_THAI)
    VALUES (
        v_manhanvien,
        'admin',
        '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q', 
        '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q',
        SYSDATE,
        SYSTIMESTAMP,
        1
    );

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('🎉 Chuc mung Hieu! Tai khoan admin (123456) da san sang.');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('❌ Loi: ' || SQLERRM);
END;
/

DECLARE
    v_macuahang NUMBER;
    v_manhanvien_new NUMBER;
    v_hash_pass VARCHAR2(255) := '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q';
BEGIN
    -- 1. Lấy MACUAHANG của cửa hàng 'Lumiere Main Store'
    SELECT MAX(MACUAHANG) INTO v_macuahang 
    FROM CUA_HANG 
    WHERE TENCUAHANG = 'Lumiere Main Store';

    IF v_macuahang IS NULL THEN
        DBMS_OUTPUT.PUT_LINE('❌ Khong tim thay cua hang!');
        RETURN;
    END IF;

    -- 2. THÊM NHÂN VIÊN SALES
    INSERT INTO NHANVIEN (MACUAHANG, HOTEN, SDT, EMAIL, NGAYVAOLAM, TRANGTHAI) 
    VALUES (v_macuahang, 'Nguyen Van Sales', '0911222333', 'sales@lumiere.com', SYSDATE, 'Active')
    RETURNING MANHANVIEN INTO v_manhanvien_new;

    INSERT INTO TAI_KHOAN_NHAN_VIEN (MANHANVIEN, USERNAME, PASSWORDHASH, PASSWORDHASHHISTORY, NGAYTAO, TRANG_THAI)
    VALUES (v_manhanvien_new, 'sales01', v_hash_pass, v_hash_pass, SYSDATE, 1);

    -- 3. THÊM NHÂN VIÊN KHO
    INSERT INTO NHANVIEN (MACUAHANG, HOTEN, SDT, EMAIL, NGAYVAOLAM, TRANGTHAI) 
    VALUES (v_macuahang, 'Tran Van Kho', '0944555666', 'kho@lumiere.com', SYSDATE, 'Active')
    RETURNING MANHANVIEN INTO v_manhanvien_new;

    INSERT INTO TAI_KHOAN_NHAN_VIEN (MANHANVIEN, USERNAME, PASSWORDHASH, PASSWORDHASHHISTORY, NGAYTAO, TRANG_THAI)
    VALUES (v_manhanvien_new, 'kho01', v_hash_pass, v_hash_pass, SYSDATE, 1);

    -- 4. THÊM NHÂN VIÊN KẾ TOÁN
    INSERT INTO NHANVIEN (MACUAHANG, HOTEN, SDT, EMAIL, NGAYVAOLAM, TRANGTHAI) 
    VALUES (v_macuahang, 'Le Thi Ke Toan', '0977888999', 'ketoan@lumiere.com', SYSDATE, 'Active')
    RETURNING MANHANVIEN INTO v_manhanvien_new;

    INSERT INTO TAI_KHOAN_NHAN_VIEN (MANHANVIEN, USERNAME, PASSWORDHASH, PASSWORDHASHHISTORY, NGAYTAO, TRANG_THAI)
    VALUES (v_manhanvien_new, 'ketoan01', v_hash_pass, v_hash_pass, SYSDATE, 1);

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('✅ Thanh cong! Da tao Sales, Kho, Ke toan voi PasswordHistory day du.');

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('❌ Loi: ' || SQLERRM);
END;
/

SELECT MACUAHANG, TENCUAHANG FROM CUA_HANG;
SELECT MANHANVIEN, HOTEN FROM NHANVIEN;

commit;

-- A. Thêm vào bảng NHANVIEN
INSERT INTO NHANVIEN (MACUAHANG, HOTEN, SDT, EMAIL, NGAYVAOLAM, TRANGTHAI) 
VALUES (1, 'Nguyen Van Sales', '0911222333', 'sales@lumiere.com', SYSDATE, 'Active');

-- B. Thêm tài khoản (Sử dụng ID vừa sinh ra)
INSERT INTO TAI_KHOAN_NHAN_VIEN (MANHANVIEN, USERNAME, PASSWORDHASH, PASSWORDHASHHISTORY, NGAYTAO, LAST_LOGIN, TRANG_THAI)
VALUES (PROJECT_IS_210.ISEQ$$_81086.currval, 'sales01', '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q', '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q', SYSDATE, SYSTIMESTAMP, 1);

-- C. Gán vai trò (Giả sử mã vai trò Sales là 2)
INSERT INTO NHANVIEN_VAITRO (MAVAITRO, MANHANVIEN, NGAYGAN)
VALUES (2, PROJECT_IS_210.ISEQ$$_81086.currval, SYSDATE);

COMMIT;

-- Thêm vai trò Admin
INSERT INTO VAI_TRO (TENVAITRO, QUYENHAN) 
VALUES ('Admin', 'Toàn quyền quản trị hệ thống: quản lý cửa hàng, nhân viên, vai trò và báo cáo.');

-- Thêm vai trò Sales
INSERT INTO VAI_TRO (TENVAITRO, QUYENHAN) 
VALUES ('Sales', 'Quyền bán hàng: tạo đơn hàng, xem danh sách sản phẩm, quản lý thông tin khách hàng.');

-- Thêm vai trò Kho
INSERT INTO VAI_TRO (TENVAITRO, QUYENHAN) 
VALUES ('Kho', 'Quyền kho: nhập hàng, xuất hàng, kiểm kê tồn kho và cập nhật vị trí hàng hóa.');

-- Thêm vai trò Kế toán
INSERT INTO VAI_TRO (TENVAITRO, QUYENHAN) 
VALUES ('Ke Toan', 'Quyền kế toán: xem doanh thu, quản lý phiếu chi, duyệt hóa đơn và kết xuất báo cáo tài chính.');

COMMIT;

-- Thêm thông tin cá nhân
INSERT INTO NHANVIEN (MACUAHANG, HOTEN, SDT, EMAIL, NGAYVAOLAM, TRANGTHAI) 
VALUES (1, 'Nguyen Van Sales', '0911222333', 'sales@lumiere.com', SYSDATE, 'Active');

-- Thêm tài khoản đăng nhập
INSERT INTO TAI_KHOAN_NHAN_VIEN (MANHANVIEN, USERNAME, PASSWORDHASH, PASSWORDHASHHISTORY, NGAYTAO, LAST_LOGIN, TRANG_THAI)
VALUES (PROJECT_IS_210.ISEQ$$_81086.currval, 'sales01', '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q', '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q', SYSDATE, SYSTIMESTAMP, 1);

-- Gán vai trò Sales (Mã 2)
INSERT INTO NHANVIEN_VAITRO (MAVAITRO, MANHANVIEN, NGAYGAN)
VALUES (2, PROJECT_IS_210.ISEQ$$_81086.currval, SYSDATE);

COMMIT;

select * from nhanvien;

INSERT INTO NHANVIEN (MACUAHANG, HOTEN, SDT, EMAIL, NGAYVAOLAM, TRANGTHAI) 
VALUES (1, 'Tran Van Kho', '0944555666', 'kho@lumiere.com', SYSDATE, 'Active');

INSERT INTO TAI_KHOAN_NHAN_VIEN (MANHANVIEN, USERNAME, PASSWORDHASH, PASSWORDHASHHISTORY, NGAYTAO, LAST_LOGIN, TRANG_THAI)
VALUES (PROJECT_IS_210.ISEQ$$_81086.currval, 'kho01', '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q', '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q', SYSDATE, SYSTIMESTAMP, 1);

INSERT INTO NHANVIEN (MACUAHANG, HOTEN, SDT, EMAIL, NGAYVAOLAM, TRANGTHAI) 
VALUES (1, 'Le Thi Ke Toan', '0977888999', 'ketoan@lumiere.com', SYSDATE, 'Active');

INSERT INTO TAI_KHOAN_NHAN_VIEN (MANHANVIEN, USERNAME, PASSWORDHASH, PASSWORDHASHHISTORY, NGAYTAO, LAST_LOGIN, TRANG_THAI)
VALUES (PROJECT_IS_210.ISEQ$$_81086.currval, 'ketoan01', '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q', '$2b$10$ZQ0Da.LWUp3yN9F8diBf7.B6Xdq8Yvp/uY5LSCLMXZYjpHp1BAM7q', SYSDATE, SYSTIMESTAMP, 1);

select * from tai_khoan_nhan_vien;

SELECT USERNAME, PASSWORDHASH, TRANG_THAI FROM TAI_KHOAN_NHAN_VIEN;

SELECT * FROM TAI_KHOAN_NHAN_VIEN;

UPDATE TAI_KHOAN_NHAN_VIEN 
SET PASSWORDHASH = (SELECT PASSWORDHASH FROM TAI_KHOAN_NHAN_VIEN WHERE MANHANVIEN = 1),
    PASSWORDHASHHISTORY = (SELECT PASSWORDHASH FROM TAI_KHOAN_NHAN_VIEN WHERE MANHANVIEN = 1)
WHERE MANHANVIEN IN (24, 25, 26);
COMMIT;

select * from PHAN_QUYEN_NHAN_VIEN;

-- Gán quyền Admin (Mã 1) cho Admin (ID 1)
INSERT INTO PHAN_QUYEN_NHAN_VIEN (MAVAITRO, MANHANVIEN, NGAYGAN)
VALUES (1, 1, SYSDATE);

-- Gán quyền Sales (Mã 2) cho Nguyen Van Sales (ID 24)
INSERT INTO PHAN_QUYEN_NHAN_VIEN (MAVAITRO, MANHANVIEN, NGAYGAN)
VALUES (2, 24, SYSDATE);

-- Gán quyền Kho (Mã 3) cho Tran Van Kho (ID 25)
INSERT INTO PHAN_QUYEN_NHAN_VIEN (MAVAITRO, MANHANVIEN, NGAYGAN)
VALUES (3, 25, SYSDATE);

-- Gán quyền Kế toán (Mã 4) cho Le Thi Ke Toan (ID 26)
INSERT INTO PHAN_QUYEN_NHAN_VIEN (MAVAITRO, MANHANVIEN, NGAYGAN)
VALUES (4, 26, SYSDATE);

-- Lưu lại dữ liệu
COMMIT;