# Hướng dẫn sử dụng React Query và Ant Design Table

## 1. Giới thiệu

### React Query
**React Query** là một thư viện mạnh mẽ để quản lý dữ liệu bất đồng bộ trong ứng dụng React. Nó giúp:
- **Tự động lấy dữ liệu**: Gọi API và lưu trữ dữ liệu vào cache.
- **Quản lý trạng thái**: Xử lý trạng thái loading, error, và success mà không cần tự quản lý state.
- **Làm mới dữ liệu**: Tự động hoặc thủ công làm mới dữ liệu khi cần.
- **Tối ưu hiệu suất**: Hỗ trợ caching, refetching, và quản lý truy vấn hiệu quả.

### Ant Design Table
**Ant Design (AntD)** là một thư viện UI phổ biến cho React, cung cấp component **Table** để hiển thị dữ liệu dạng bảng với các tính năng như:
- Sắp xếp cột (sorting).
- Lọc dữ liệu (filtering).
- Phân trang (pagination).
- Tùy chỉnh giao diện dễ dàng.

Trong hướng dẫn này, chúng ta sẽ xây dựng một ứng dụng đơn giản để hiển thị danh sách **sản phẩm (products)** từ một API giả lập, sử dụng **React Query** để lấy dữ liệu và **Ant Design Table** để hiển thị.

## 2. Thiết lập dự án

### Yêu cầu
- **Node.js**: Phiên bản 16 trở lên.
- **npm** hoặc **yarn**: Quản lý gói.
- **JSON Server**: Mô phỏng API backend.

### Cài đặt
1. Tạo dự án React mới:
   ```bash
   npx create-react-app react-query-antd-table
   cd react-query-antd-table
   ```

2. Cài đặt các thư viện:
   ```bash
   npm install @tanstack/react-query antd axios
   ```

3. Cài đặt **JSON Server** để tạo API giả lập:
   ```bash
   npm install -g json-server
   ```

4. Tạo file `db.json` trong thư mục gốc để mô phỏng dữ liệu:
   ```json
   {
     "products": [
       { "id": 1, "name": "Laptop", "price": 1000, "description": "High-end laptop" },
       { "id": 2, "name": "Phone", "price": 500, "description": "Smartphone" },
       { "id": 3, "name": "Tablet", "price": 300, "description": "Portable tablet" }
     ]
   }
   ```

5. Chạy JSON Server:
   ```bash
   json-server --watch db.json --port 3001
   ```

API sẽ chạy tại `http://localhost:3001/products`.

## 3. Cấu trúc dự án

Tạo cấu trúc thư mục như sau:
```
src/
  ├── components/
  │   ├── ProductTable.js
  ├── App.js
  ├── App.css
```

## 4. Tích hợp React Query và Ant Design

### Thiết lập React Query
Cập nhật file `src/index.js` để khởi tạo **React Query** và import CSS của **Ant Design**:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import 'antd/dist/reset.css'; // Import CSS của Ant Design

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

### Tạo Component ProductTable
Component này sử dụng **React Query** để lấy dữ liệu và **Ant Design Table** để hiển thị danh sách sản phẩm.

```jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Button, Spin, Alert } from 'antd';
import axios from 'axios';

// Hàm gọi API để lấy danh sách sản phẩm
const fetchProducts = async () => {
  const { data } = await axios.get('http://localhost:3001/products');
  return data;
};

const ProductTable = () => {
  // Sử dụng useQuery để lấy dữ liệu
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products'], // Khóa duy nhất cho truy vấn
    queryFn: fetchProducts, // Hàm lấy dữ liệu
  });

  // Cấu hình cột cho bảng AntD
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id, // Sắp xếp theo ID
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name), // Sắp xếp theo tên
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price, // Sắp xếp theo giá
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  // Xử lý lỗi
  if (error) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải dữ liệu. Vui lòng thử lại!"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <Button
        type="primary"
        onClick={() => refetch()}
        style={{ marginBottom: 16 }}
        disabled={isLoading}
      >
        Làm mới dữ liệu
      </Button>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        loading={isLoading} // Hiển thị spinner khi đang tải
        pagination={{ pageSize: 5 }} // Phân trang, mỗi trang 5 bản ghi
      />
    </div>
  );
};

export default ProductTable;
```

### Cập nhật App.js
Tích hợp component `ProductTable` vào file `src/App.js`:

```jsx
import React from 'react';
import ProductTable from './components/ProductTable';
import './App.css';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <ProductTable />
    </div>
  );
}

export default App;
```

### Thêm CSS (App.css)
Thêm CSS để cải thiện giao diện:

```css
body {
  background-color: #f0f2f5;
}

h2 {
  text-align: center;
  margin-bottom: 24px;
}
```

## 5. Giải thích chi tiết

### React Query
- **useQuery**:
  - `queryKey: ['products']`: Định danh duy nhất cho truy vấn. React Query sử dụng khóa này để cache dữ liệu.
  - `queryFn: fetchProducts`: Hàm bất đồng bộ để lấy dữ liệu từ API.
  - Trả về các trạng thái:
    - `data`: Dữ liệu trả về từ API (danh sách sản phẩm).
    - `isLoading`: Trạng thái đang tải dữ liệu.
    - `error`: Thông tin lỗi nếu API thất bại.
    - `refetch`: Hàm để làm mới dữ liệu thủ công.
- **Caching**: React Query tự động lưu trữ dữ liệu trong cache, giúp giảm số lần gọi API không cần thiết.
- **Refetching**: Nút "Làm mới dữ liệu" gọi hàm `refetch` để tải lại dữ liệu từ API.

### Ant Design Table
- **columns**: Định nghĩa các cột của bảng:
  - `title`: Tên hiển thị của cột.
  - `dataIndex`: Trường dữ liệu tương ứng trong object (ví dụ: `id`, `name`, `price`).
  - `key`: Khóa duy nhất cho cột.
  - `sorter`: Hàm để sắp xếp dữ liệu theo cột.
- **dataSource**: Dữ liệu đầu vào cho bảng (danh sách sản phẩm từ API).
- **rowKey**: Khóa duy nhất cho mỗi hàng (ở đây là `id`).
- **loading**: Hiển thị spinner khi `isLoading` là `true`.
- **pagination**: Kích hoạt phân trang với 5 bản ghi mỗi trang.

### Xử lý lỗi
- Nếu có lỗi (`error` từ `useQuery`), hiển thị component `Alert` của AntD để thông báo cho người dùng.

## 6. Chạy ứng dụng
1. Chạy JSON Server:
   ```bash
   json-server --watch db.json --port 3001
   ```
2. Chạy ứng dụng React:
   ```bash
   npm start
   ```

Truy cập `http://localhost:3000` để xem ứng dụng. Bạn sẽ thấy:
- Một bảng hiển thị danh sách sản phẩm.
- Nút "Làm mới dữ liệu" để tải lại dữ liệu.
- Tính năng sắp xếp khi nhấp vào tiêu đề cột.
- Phân trang với 5 bản ghi mỗi trang.

## 7. Mở rộng
Bạn có thể thêm các tính năng sau:
- **Lọc dữ liệu**: Thêm bộ lọc (filter) vào cột bằng thuộc tính `filters` của AntD Table.
- **Tìm kiếm**: Tích hợp ô tìm kiếm để lọc danh sách theo tên hoặc mô tả.
- **CRUD**: Thêm chức năng thêm, sửa, xóa bằng cách sử dụng `useMutation` của React Query (xem hướng dẫn CRUD trong tài liệu khác).
- **Tùy chỉnh giao diện**: Sử dụng các component khác của AntD như `Modal`, `Form` để cải thiện trải nghiệm người dùng.

## 8. Kết luận
**React Query** giúp đơn giản hóa việc quản lý dữ liệu từ API, trong khi **Ant Design Table** cung cấp giao diện bảng mạnh mẽ và dễ sử dụng. Kết hợp cả hai giúp sinh viên nhanh chóng xây dựng các ứng dụng hiển thị dữ liệu chuyên nghiệp.