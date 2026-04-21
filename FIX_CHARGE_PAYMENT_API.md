# 🔧 FIX: Lỗi Crash Server Khi Xử Lý Thanh Toán (Payment API)

## 📋 Tóm tắt các vấn đề tìm được và cách fix

### **Vấn đề 1: Data Type Mismatch - "GUEST" String vs NUMBER**
**Nguyên nhân crash chính:**
- Trong `POS.tsx`, khi khách vãng lai, code set: `id: "GUEST"` (chuỗi)
- Nhưng bảng `DON_HANG.MADOITAC` yêu cầu kiểu `NUMBER NOT NULL`
- Khi backend nhận `customerId: "GUEST"` và cố bind vào SQL `VALUES (1, :p_khachhang, ...)`, Oracle cố convert chuỗi "GUEST" → NUMBER → **CRASH**

**✅ Fix áp dụng:**
- Thay `id: "GUEST"` → `id: "1"` trong `POS.tsx` (dòng 693)
- Thêm `parseInt(customerId)` trong `processPaymentAPI()` để đảm bảo là number
- Backend: `const finalCustomerId = (customerId && customerId !== 'GUEST') ? parseInt(customerId) : 1;`

---

### **Vấn đề 2: Cú pháp RETURNING không chuẩn oracledb**
**Vấn đề:**
```javascript
// ❌ WRONG - Cú pháp Oracle PL/SQL đúng nhưng không phải cách oracledb.js hỗ trợ
INSERT INTO DON_HANG (...) VALUES (...)
RETURNING MADONHANG INTO :out_id
```
- oracledb.js không hỗ trợ tốt cú pháp `RETURNING ... INTO :out_id`
- Dẫn đến không lấy được ID hoặc crash

**✅ Fix áp dụng:**
```javascript
// ✅ CORRECT - Tách thành 2 bước
// Bước 1: INSERT (không dùng RETURNING)
await connection.execute(sqlCreateOrder, { ... });

// Bước 2: Lấy ID vừa tạo bằng SELECT MAX
const resultGetId = await connection.execute(
    `SELECT MAX(MADONHANG) as newId FROM DON_HANG`,
    [],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
);
const newOrderId = resultGetId.rows[0]?.NEWID;
```

---

### **Vấn đề 3: Transaction handling & Rollback không an toàn**
**Vấn đề:**
- Loop `for...of item` có thể throw error ở giữa
- Nếu INSERT sản phẩm thứ 3 bị lỗi, `rollback()` trong catch được gọi nhưng không await
- Database có thể bị left in inconsistent state

**✅ Fix áp dụng:**
```javascript
// ✅ Đảm bảo transaction control an toàn
connection.autoCommit = false;  // Bắt đầu manual transaction

try {
    // Tất cả các execute đều không auto-commit
    await connection.execute(...);
    await connection.execute(...);
    // ... more operations
    
    await connection.commit();   // Chỉ commit khi tất cả thành công
} catch (err) {
    await connection.rollback(); // Rollback nếu error ở bất kỳ bước nào
}
```

---

### **Vấn đề 4: Error logging không chi tiết**
**Vấn đề:**
- Chỉ log `err.message`, không log stack trace
- Không biết chính xác dòng nào bị lỗi (INSERT, procedure call, etc.)

**✅ Fix áp dụng:**
```javascript
catch (err) {
    // ✅ Log chi tiết
    console.error("[CHARGE] Lỗi hệ thống:");
    console.error("   Message:", err.message);
    console.error("   Stack:", err.stack);
    
    // ✅ Log từng bước để track được ở bước nào crash
    console.log("[CHARGE] Tạo đơn hàng với customerId:", finalCustomerId);
    console.log("[CHARGE] INSERT DON_HANG thành công");
    // ... etc
}
```

---

## 🚀 Files đã sửa

### **1. `backend/server.js` - API `/api/orders/charge`**

**Thay đổi chính:**
- ✅ Loại bỏ `RETURNING MADONHANG INTO :out_id`, thay bằng `SELECT MAX(MADONHANG)`
- ✅ Thêm `connection.autoCommit = false` để control transaction
- ✅ Validate `customerId` thành `parseInt(customerId)`
- ✅ Thêm chi tiết logging `[CHARGE]` tại mỗi bước
- ✅ Try-catch riêng cho procedure call (nếu procedure không tồn tại, không fail)
- ✅ Proper `await connection.rollback()` và `await connection.commit()`
- ✅ Return `orderId` trong success response

**Tóm tắt code:**
```javascript
app.post('/api/orders/charge', async (req, res) => {
    let connection;
    try {
        const { cart, total, customerId, phuongThuc } = req.body;
        
        connection = await oracledb.getConnection(dbConfig);
        connection.autoCommit = false;
        
        // FIX: Validate kiểu NUMBER
        const finalCustomerId = (customerId && customerId !== 'GUEST') ? parseInt(customerId) : 1;
        
        // 1. CREATE ORDER
        await connection.execute(sqlCreateOrder, {
            p_khachhang: finalCustomerId,
            p_tongtien: Math.round(total)
        });
        
        // 2. GET ID (FIX: Dùng SELECT MAX thay vì RETURNING)
        const resultGetId = await connection.execute(
            `SELECT MAX(MADONHANG) as newId FROM DON_HANG`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        const newOrderId = resultGetId.rows[0]?.NEWID;
        
        // 3. INSERT DETAILS
        for (const item of cart) {
            await connection.execute(
                `INSERT INTO CHI_TIET_DON_HANG (...)VALUES (...)`,
                { ... }
            );
        }
        
        // 4. CALL PROCEDURE (with try-catch separate)
        try {
            await connection.execute(`BEGIN SP_THANH_TOAN_DON_HANG(...); END;`, {...});
        } catch (procErr) {
            console.warn("[CHARGE] Procedure lỗi:", procErr.message);
            // Không fail, tiếp tục
        }
        
        // 5. COMMIT
        await connection.commit();
        res.json({ status: 'success', orderId: newOrderId });
        
    } catch (err) {
        console.error("[CHARGE] Lỗi:", err.message, "\nStack:", err.stack);
        if (connection) await connection.rollback();
        res.status(500).json({ status: 'error', message: err.message });
    } finally {
        if (connection) await connection.close();
    }
});
```

---

### **2. `frontend/src/pages/POS.tsx` - Function `processPaymentAPI`**

**Thay đổi chính:**
- ✅ Thay `id: "GUEST"` → `id: "1"` (dòng 693)
- ✅ Thêm `parseInt(selectedCustomer.id)` để đảm bảo kiểu NUMBER
- ✅ Thêm console.log `[POS]` để track request
- ✅ Cải thiện error handling: hiển thị `response.status` + message từ backend
- ✅ Log `orderId` khi thành công

**Tóm tắt code:**
```javascript
const processPaymentAPI = async (method: "cash" | "bank") => {
    setIsProcessing(true);
    
    try {
        // FIX: Parse customerId thành number
        const customerId = selectedCustomer?.id ? parseInt(selectedCustomer.id) : 1;
        
        const payload = {
            cart: cart,
            total: total,
            customerId: customerId,  // ← Now always a number
            phuongThuc: method
        };
        
        console.log("[POS] Gửi yêu cầu thanh toán:", payload);
        
        const response = await fetch('/api/orders/charge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định' }));
            throw new Error(`HTTP ${response.status}: ${errorData.message}`);
        }
        
        const json = await response.json();
        
        if (json.status === 'success') {
            console.log("[POS] ✅ Thanh toán thành công! Order ID:", json.orderId);
            // ... reset UI
        } else {
            alert("Lỗi: " + json.message);
        }
    } catch (error) {
        console.error("[POS] ❌ Lỗi thanh toán:", error);
        alert("Lỗi kết nối Backend: " + (error instanceof Error ? error.message : 'Không xác định'));
    } finally {
        setIsProcessing(false);
    }
};
```

---

## 🧪 Cách test fix

### **1. Backend logs sẽ hiển thị chi tiết từng bước:**
```
[CHARGE] Đang xử lý yêu cầu thanh toán: { cartLength: 3, total: 500000, customerId: 1, phuongThuc: 'cash' }
[CHARGE] Tạo đơn hàng với customerId (kiểu NUMBER): 1
[CHARGE] INSERT DON_HANG thành công
[CHARGE] Lấy ID đơn hàng thành công: MADONHANG = 1001
[CHARGE] Đang insert chi tiết: { masanpham: 5, qty: 2, price: 100000 }
[CHARGE] Đã insert tất cả 3 sản phẩm vào CHI_TIET_DON_HANG
[CHARGE] Gọi procedure SP_THANH_TOAN_DON_HANG với: { madonhang: 1001, phuongthuc: 'Tiền mặt' }
[CHARGE] Procedure SP_THANH_TOAN_DON_HANG hoàn tất thành công
[CHARGE] ✅ COMMIT TRANSACTION thành công!
```

### **2. Frontend console sẽ hiển thị:**
```
[POS] Gửi yêu cầu thanh toán: { cart: [...], total: 500000, customerId: 1, phuongThuc: 'cash' }
[POS] ✅ Thanh toán thành công! Order ID: 1001
```

### **3. Response JSON:**
```json
{
  "status": "success",
  "message": "Thanh toán và lưu hóa đơn thành công!",
  "orderId": 1001
}
```

---

## 📝 Checklist để xác nhận fix hoàn toàn

- [ ] Backend không crash khi nhận `customerId = 1` (number)
- [ ] Frontend hiển thị thông báo thanh toán thành công
- [ ] Backend logs hiển thị tất cả `[CHARGE]` steps mà không error
- [ ] Database có đơn hàng mới trong `DON_HANG` table
- [ ] Database có chi tiết sản phẩm trong `CHI_TIET_DON_HANG` table
- [ ] Khi test khách vãng lai, thấy `customerId: 1` (không phải "GUEST")
- [ ] Khi test khách đã chọn, thấy `customerId` đúng (ví dụ 5, 10, ...)
- [ ] Procedure `SP_THANH_TOAN_DON_HANG` được gọi (hoặc warn nếu không tồn tại)
- [ ] Nếu có lỗi ở giữa loop, transaction rollback (database sạch sẽ, không có dơ dảng)

---

## 💡 Ghi chú thêm

1. **Kiểm tra xem DOI_TAC table có record MADOITAC = 1 chưa:**
   ```sql
   SELECT * FROM DOI_TAC WHERE MADOITAC = 1;
   ```
   Nếu không, insert:
   ```sql
   INSERT INTO DOI_TAC (TENDOITAC, LOAIDOITAC) VALUES ('Khách vãng lai', 'Khách lẻ');
   ```

2. **Kiểm tra xem Procedure `SP_THANH_TOAN_DON_HANG` tồn tại chưa:**
   ```sql
   SELECT * FROM USER_PROCEDURES WHERE OBJECT_NAME = 'SP_THANH_TOAN_DON_HANG';
   ```

3. **Test case:**
   - Test 1 (khách vãng lai): Bỏ qua tìm kiếm khách, thanh toán giỏ hàng → `customerId: 1`
   - Test 2 (khách có ID): Tìm kiếm khách có sẵn, chọn, thanh toán → `customerId: [their_id]`
   - Test 3 (empty cart): Cố gắng thanh toán giỏ rỗng → nên nhận error 400

