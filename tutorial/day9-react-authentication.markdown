# Hướng dẫn Authentication trong React với json-server-auth, Ant Design và React Query (TypeScript)

## 1. Hiểu về Authentication trong React

Authentication (xác thực) là quá trình xác minh danh tính người dùng, đảm bảo chỉ những người dùng được phép mới truy cập vào các tài nguyên hoặc tính năng nhất định. Trong React, authentication thường bao gồm:

- **Đăng ký (Register)**: Tạo tài khoản mới với email và mật khẩu.
- **Đăng nhập (Login)**: Xác thực thông tin đăng nhập để cấp quyền truy cập, thường sử dụng token (JWT).
- **Đăng xuất (Logout)**: Kết thúc phiên làm việc, xóa token hoặc thông tin xác thực.
- **Bảo vệ Route (Protected Routes)**: Hạn chế truy cập vào các trang chỉ dành cho người dùng đã đăng nhập.

Trong hướng dẫn này, chúng ta sẽ xây dựng hệ thống xác thực sử dụng **TypeScript**, **Ant Design** cho giao diện, **json-server-auth** cho API giả lập, và **React Query** với `useMutation` để gọi API, không sử dụng Context API.

---

## 2. Hiểu về json-server-auth

`json-server-auth` là một middleware của `json-server`, cung cấp các tính năng xác thực như đăng ký, đăng nhập và quản lý token JWT. Các tính năng chính:

- **Endpoint đăng ký**: `POST /register` để tạo người dùng mới.
- **Endpoint đăng nhập**: `POST /login` để xác thực và nhận token JWT.
- **Bảo mật**: Hỗ trợ middleware để bảo vệ các route API bằng JWT.
- **Lưu trữ**: Dữ liệu người dùng được lưu trong file `db.json`.

---

## 3. Cài đặt và sử dụng json-server-auth

### Bước 1: Cài đặt json-server và json-server-auth

Chạy lệnh sau để cài đặt:

```bash
pnpm install json-server@0.17.0 json-server-auth
```

### Bước 2: Tạo file `db.json`

Tạo file `db.json` trong thư mục dự án với nội dung:

```json
{
  "users": []
}
```

File này lưu trữ thông tin người dùng (email, mật khẩu mã hóa, v.v.).

### Bước 3: Chạy json-server với json-server-auth

Chạy server với lệnh:

```bash
json-server db.json -m ./node_modules/json-server-auth
```

Server sẽ chạy trên `http://localhost:3000` với các endpoint:

- `POST /register`: Đăng ký người dùng mới.
- `POST /login`: Đăng nhập và nhận token JWT.
- `GET /users/me`: Lấy thông tin người dùng hiện tại (yêu cầu token).

---

## 4. Tạo hệ thống đăng ký/đăng nhập/đăng xuất cơ bản

### Bước 1: Cài đặt dự án React và các thư viện

Tạo dự án React với TypeScript:

```bash
npx create-react-app react-auth-example --template typescript
cd react-auth-example
npm install antd axios react-router-dom@6 @types/react-router-dom @tanstack/react-query
```

### Bước 2: Cấu hình React Query

Tạo file `src/index.tsx` để cấu hình React Query:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "antd/dist/reset.css";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

### Bước 3: Cấu trúc dự án

Tạo cấu trúc thư mục:

```
src/
  ├── components/
  │   ├── AuthForm.tsx
  │   ├── Header.tsx
  │   ├── PrivateRoute.tsx
  ├── pages/
  │   ├── Home.tsx
  │   ├── Login.tsx
  │   ├── Register.tsx
  │   ├── Dashboard.tsx
  │   ├── AccessDenied.tsx
  ├── App.tsx
  ├── index.tsx
```

### Bước 4: Code ứng dụng

#### File `src/App.tsx`

```tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
```

#### File `src/components/Header.tsx`

```tsx
import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        padding: "10px 20px",
        background: "#f0f2f5",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Link to="/">Home</Link>
      <div>
        {token ? (
          <Button onClick={handleLogout}>Đăng xuất</Button>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 10 }}>
              Đăng nhập
            </Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
```

#### File `src/components/AuthForm.tsx`

```tsx
import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface FormValues {
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthResponse {
  accessToken: string;
}

const AuthForm: React.FC<{ isRegister: boolean }> = ({ isRegister }) => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const authMutation = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const url = isRegister
        ? "http://localhost:3000/register"
        : "http://localhost:3000/login";
      const res = await axios.post<AuthResponse>(url, values);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.accessToken);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    },
  });

  const onFinish = (values: FormValues) => {
    setError(null);
    authMutation.mutate({ email: values.email, password: values.password });
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Form onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>
        {isRegister && (
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" />
          </Form.Item>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={authMutation.isPending}
            block
          >
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "center" }}>
        {isRegister ? (
          <span>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </span>
        ) : (
          <span>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
```

#### File `src/components/PrivateRoute.tsx`

```tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AccessDenied from "../pages/AccessDenied";

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <AccessDenied />;
};

export default PrivateRoute;
```

#### File `src/pages/Home.tsx`

```tsx
import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Home: React.FC = () => (
  <div style={{ textAlign: "center", marginTop: 50 }}>
    <h1>Chào mừng đến với ứng dụng</h1>
    <Link to="/dashboard">
      <Button type="primary">Vào Dashboard</Button>
    </Link>
  </div>
);

export default Home;
```

#### File `src/pages/Login.tsx`

```tsx
import React from "react";
import AuthForm from "../components/AuthForm";

const Login: React.FC = () => <AuthForm isRegister={false} />;

export default Login;
```

#### File `src/pages/Register.tsx`

```tsx
import React from "react";
import AuthForm from "../components/AuthForm";

const Register: React.FC = () => <AuthForm isRegister={true} />;

export default Register;
```

#### File `src/pages/Dashboard.tsx`

```tsx
import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  email: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axios.get<User>("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Dashboard</h1>
      <p>Xin chào, {user?.email}</p>
      <Button type="primary" onClick={handleLogout}>
        Đăng xuất
      </Button>
    </div>
  );
};

export default Dashboard;
```

#### File `src/pages/AccessDenied.tsx`

```tsx
import React from "react";
import { Link } from "react-router-dom";
import { Result, Button } from "antd";

const AccessDenied: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Bạn không có quyền truy cập trang này."
    extra={
      <Link to="/">
        <Button type="primary">Về trang chủ</Button>
      </Link>
    }
  />
);

export default AccessDenied;
```

---

## 5. Hạn chế truy cập vào các Route bảo mật

- **PrivateRoute**: Kiểm tra sự tồn tại của token trong `localStorage`. Nếu không có token, người dùng sẽ được chuyển hướng đến trang `AccessDenied`.
- **React Query**: Sử dụng `useMutation` trong `AuthForm` để xử lý API đăng ký/đăng nhập, và `useQuery` trong `Dashboard` để lấy thông tin người dùng, đảm bảo quản lý trạng thái hiệu quả và tự động xử lý lỗi.

---

## 6. Chạy ứng dụng

### Bước 1: Chạy JSON Server

```bash
json-server -m json-server-auth db.json
```

### Bước 2: Chạy ứng dụng React

```bash
npm start
```

Ứng dụng sẽ chạy trên `http://localhost:3000`.

---

## 7. Kết luận

Hướng dẫn này đã trình bày cách xây dựng hệ thống xác thực trong React với TypeScript, sử dụng `json-server-auth`, `Ant Design`, và `React Query`:

- **Đăng ký**: Bao gồm xác nhận mật khẩu với validate đầy đủ (email hợp lệ, mật khẩu tối thiểu 6 ký tự, xác nhận mật khẩu khớp).
- **Đăng nhập/Đăng xuất**: Quản lý token trong `localStorage` mà không sử dụng Context API.
- **React Query**: Sử dụng `useMutation` cho các API đăng ký/đăng nhập và `useQuery` để lấy thông tin người dùng, tối ưu hóa việc gọi API.
- **Bảo vệ Route**: Chỉ người dùng đã đăng nhập mới truy cập được `/dashboard`.
- **Giao diện**: Sử dụng Ant Design với form validate và thông báo lỗi.

Để mở rộng, bạn có thể:

- Thêm phân quyền dựa trên vai trò (admin, user).
- Tích hợp với backend thực tế.
- Làm mới token JWT khi hết hạn.
