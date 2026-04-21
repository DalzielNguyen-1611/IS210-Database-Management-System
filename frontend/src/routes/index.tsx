import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Login } from "../pages/Login";
import { POS } from "../pages/POS";

export const router = createBrowserRouter([
  // 1. CHẶN Ở CỬA CHÍNH: Gõ http://localhost:5173/ sẽ tự động nhảy sang /login
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  
  // 2. TRANG ĐĂNG NHẬP
  {
    path: "/login",
    element: <Login />,
  },
  
  // 3. KHU VỰC NỘI BỘ (Đã được bảo vệ bởi AuthLayout)
  {
    element: <AuthLayout />, 
    children: [
      {
        path: "/dashboard",
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-pink-600">Lumière Dashboard</h1>
            <p className="text-gray-500 mt-2">Hệ thống đã sẵn sàng!</p>
          </div>
        ),
      },
      {
        path: "/pos",
        element: <POS />, // CHỈ CẦN NGẮN GỌN THẾ NÀY THÔI
      },
      {
        path: "/inventory",
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Inventory</h1>
            <p className="text-gray-500 mt-2">Inventory module placeholder</p>
          </div>
        ),
      },
      {
        path: "/finance",
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Finance</h1>
            <p className="text-gray-500 mt-2">Finance module placeholder</p>
          </div>
        ),
      },
      {
        path: "/hrm",
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">HR & Payroll</h1>
            <p className="text-gray-500 mt-2">HRM module placeholder</p>
          </div>
        ),
      },
      {
        path: "/customers",
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Customers</h1>
          </div>
        ),
      },
      {
        path: "/orders",
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Orders</h1>
          </div>
        ),
      },
      {
        path: "/receiving",
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Receiving</h1>
          </div>
        ),
      },
      {
        path: "/reports",
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Reports</h1>
          </div>
        ),
      },
      {
        path: "/stores",
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Stores</h1>
          </div>
        ),
      },
    ],
  },
  
  // 4. BẮT LỖI GÕ BẬY: Gõ đường dẫn không tồn tại (vd: /linhtinh) cũng đẩy về /login
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  }
]);