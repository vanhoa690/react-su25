# Hướng dẫn sử dụng React Router DOM trong React

## 1. Tổng quan về React Router

React Router là một thư viện định tuyến (routing) phổ biến trong React, cho phép quản lý điều hướng giữa các trang trong ứng dụng mà không cần tải lại toàn bộ trang web. Phiên bản `react-router-dom` được thiết kế dành riêng cho các ứng dụng web.

### Các thành phần chính:

- **Router**: Bao bọc ứng dụng để kích hoạt định tuyến dựa trên URL của trình duyệt. Trong phiên bản mới nhất, sử dụng `createBrowserRouter` và `RouterProvider` thay cho `<BrowserRouter>`.
- **Route**: Xác định các tuyến đường (routes) và ánh xạ chúng với các component, được định nghĩa thông qua một mảng routes trong `createBrowserRouter`.
- **Link**: Tạo liên kết điều hướng thay vì sử dụng thẻ `<a>` thông thường.
- **Hooks**: Các hook như `useNavigate`, `useParams`, `useSearchParams` hỗ trợ điều hướng và truy xuất tham số.

### Cài đặt:

```bash
pnpm add react-router-dom
```

## 2. Cấu trúc cơ bản của React Router DOM (Phiên bản mới nhất)

Trong phiên bản mới nhất của `react-router-dom` (tính đến năm 2025, phiên bản 6.x), cách tiếp cận sử dụng `createBrowserRouter` và `RouterProvider` được khuyến nghị thay cho `<BrowserRouter>` và `<Routes>`. Dưới đây là cấu trúc cơ bản:

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Trang chủ</h1>,
  },
  {
    path: "/products",
    element: <ProductList />,
  },
  {
    path: "/users",
    element: <UserList />,
  },
  {
    path: "/categories",
    element: <CategoryList />,
  },
  {
    path: "/brands",
    element: <BrandList />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
```

### Giải thích:

- `createBrowserRouter`: Tạo một router object với danh sách các tuyến đường được định nghĩa dưới dạng mảng.
- `RouterProvider`: Thay thế `<BrowserRouter>` để cung cấp router cho ứng dụng.
- Mỗi route trong mảng chỉ định `path` và `element` (component tương ứng).

## 3. Điều hướng với `useNavigate`

Hook `useNavigate` cho phép điều hướng bằng lập trình (programmatic navigation). Ví dụ:

```jsx
import { useNavigate } from "react-router-dom";

function ProductList() {
  const navigate = useNavigate();

  const goToProductDetail = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <button onClick={() => goToProductDetail(1)}>Xem sản phẩm 1</button>
    </div>
  );
}
```

### Giải thích:

- `navigate('/path')`: Điều hướng đến một URL cụ thể.
- `navigate(-1)` hoặc `navigate(1)`: Quay lại hoặc tiến tới trong lịch sử trình duyệt.

## 4. Truyền tham số trong Route với `useParams`

Tham số trong URL được định nghĩa bằng cú pháp `:paramName` trong `path`. Hook `useParams` được sử dụng để lấy giá trị của tham số.

### Ví dụ:

```jsx
// Định nghĩa route với tham số
const router = createBrowserRouter([
  {
    path: "/products/:id",
    element: <ProductDetail />,
  },
  // ... các route khác
]);

// Component ProductDetail
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams(); // Lấy giá trị của :id từ URL

  return <h1>Chi tiết sản phẩm {id}</h1>;
}
```

### Giải thích:

- `:id` trong `path: '/products/:id'` là một tham số động.
- `useParams` trả về một object chứa các tham số từ URL (ví dụ: `{ id: '123' }`).

## 5. Sử dụng `useSearchParams` để xử lý query string

Hook `useSearchParams` cho phép truy xuất và cập nhật các tham số query trong URL (ví dụ: `?category=electronics`).

### Ví dụ:

```jsx
import { useSearchParams } from "react-router-dom";

function CategoryList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category"); // Lấy giá trị của query 'category'

  const handleFilter = () => {
    setSearchParams({ category: "electronics" }); // Cập nhật query string
  };

  return (
    <div>
      <h1>Danh sách danh mục</h1>
      <p>Danh mục hiện tại: {category || "Không có"}</p>
      <button onClick={handleFilter}>Lọc theo Electronics</button>
    </div>
  );
}
```

### Giải thích:

- `searchParams.get('key')`: Lấy giá trị của tham số query.
- `setSearchParams`: Cập nhật query string trong URL.

## 6. Nested Routes

Nested Routes cho phép định nghĩa các tuyến đường con bên trong một tuyến đường cha, sử dụng thuộc tính `children` trong object route.

### Ví dụ:

```jsx
import { Outlet, Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="products">Sản phẩm</Link> |<Link to="users">Người dùng</Link>
      </nav>
      <Outlet /> {/* Nơi render các tuyến con */}
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "products",
        element: <ProductList />,
      },
      {
        path: "users",
        element: <UserList />,
      },
    ],
  },
  // ... các route khác
]);

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Trang chủ</Link> |<Link to="/dashboard">Dashboard</Link>
      </nav>
      <RouterProvider router={router} />
    </div>
  );
}
```

### Giải thích:

- `children`: Định nghĩa các tuyến con trong object route.
- `<Outlet>`: Là nơi các component con được render.
- URL `/dashboard/products` sẽ render `<ProductList />` bên trong `<Dashboard />`.

## 7. Ví dụ đầy đủ

Dưới đây là một ví dụ tích hợp tất cả các khái niệm trên với cách tiếp cận mới nhất:

```jsx
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Trang chủ</h1>,
  },
  {
    path: "/products",
    element: <ProductList />,
  },
  {
    path: "/products/:id",
    element: <ProductDetail />,
  },
  {
    path: "/categories",
    element: <CategoryList />,
  },
  {
    path: "/brands",
    element: <BrandList />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "products",
        element: <ProductList />,
      },
      {
        path: "users",
        element: <UserList />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Trang chủ</Link> |<Link to="/products">Sản phẩm</Link> |
        <Link to="/categories">Danh mục</Link> |
        <Link to="/brands">Thương hiệu</Link> |
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <RouterProvider router={router} />
    </div>
  );
}

function ProductList() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <button onClick={() => navigate("/products/123")}>
        Xem sản phẩm 123
      </button>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  return <h1>Chi tiết sản phẩm {id}</h1>;
}

function CategoryList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  return (
    <div>
      <h1>Danh sách danh mục</h1>
      <p>Danh mục: {category || "Không có"}</p>
      <button onClick={() => setSearchParams({ category: "electronics" })}>
        Lọc Electronics
      </button>
    </div>
  );
}

function BrandList() {
  return <h1>Danh sách thương hiệu</h1>;
}

function UserList() {
  return <h1>Danh sách người dùng</h1>;
}

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="products">Sản phẩm</Link> |<Link to="users">Người dùng</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
```

## 8. Lưu ý

- Sử dụng `createBrowserRouter` và `RouterProvider` thay cho `<BrowserRouter>` và `<Routes>` để tận dụng các tính năng mới nhất của React Router DOM.
- Luôn sử dụng `<Link>` thay cho `<a>` để tránh tải lại trang.
- Kiểm tra kỹ các đường dẫn trong object route để tránh lỗi 404.
- Sử dụng các hook như `useNavigate`, `useParams`, `useSearchParams` để xử lý điều hướng và tham số một cách linh hoạt.
- Nested Routes với `children` và `<Outlet>` giúp tổ chức giao diện tốt hơn, đặc biệt trong các ứng dụng có layout phức tạp.
