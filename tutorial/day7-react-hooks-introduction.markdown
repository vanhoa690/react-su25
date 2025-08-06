# Giới thiệu về React Hooks và Ứng dụng Custom Hook `useList` trong Page List

## React Hooks là gì?

React Hooks là các hàm đặc biệt được giới thiệu từ React 16.8, cho phép sử dụng state và các tính năng React khác trong function components mà không cần viết class. Hooks giúp code dễ đọc, tái sử dụng logic và quản lý state hiệu quả hơn.

### Một số Hook cơ bản
- **`useState`**: Quản lý state trong function component.
- **`useEffect`**: Xử lý side effects (gọi API, cập nhật DOM, v.v.).
- **`useContext`**: Truy cập context trong component.
- **`useQuery`** (từ thư viện `@tanstack/react-query`): Quản lý dữ liệu bất đồng bộ, như gọi API.

### Custom Hook là gì?
Custom Hook là hàm tự định nghĩa, bắt đầu bằng tiền tố `use`, kết hợp các Hook có sẵn để tái sử dụng logic. Custom Hook giúp tách logic phức tạp ra khỏi component, làm code gọn gàng và dễ bảo trì.

---

## Custom Hook: `useList`

Dưới đây là custom Hook `useList` để lấy danh sách dữ liệu từ các API (products, categories, users, brands) sử dụng `@tanstack/react-query`.

### Cài đặt
Đảm bảo đã cài đặt `@tanstack/react-query`:
```bash
npm install @tanstack/react-query
```

### Code Custom Hook: `useList`

```javascript
import { useQuery } from '@tanstack/react-query';

const API_ENDPOINTS = {
  products: 'http://localhost:3001/products',
  categories: 'http://localhost:3001/categories',
  users: 'http://localhost:3001/users',
  brands: 'http://localhost:3001/brands',
};

const useList = (resource) => {
  const fetchData = async () => {
    const res = await fetch(API_ENDPOINTS[resource]);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${resource}`);
    }
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [resource],
    queryFn: fetchData,
  });

  return { data, isLoading, error };
};

export default useList;
```

### Ứng dụng `useList` trong Page List

Dưới đây là cách áp dụng `useList` trong một page hiển thị danh sách dữ liệu (ví dụ: danh sách categories và products) với giao diện sử dụng Tailwind CSS.

#### Cấu hình React Query
Đảm bảo ứng dụng được bọc trong `QueryClientProvider` trong file root (`index.js` hoặc `App.js`):

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById('root')
);
```

#### Code Page List

```javascript
import React from 'react';
import useList from './useList';

const ListPage = () => {
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useList('categories');
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useList('products');

  if (isLoadingCategories || isLoadingProducts) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  if (categoriesError || productsError) {
    return (
      <div className="text-center mt-10 text-red-500">
        Lỗi: {categoriesError?.message || productsError?.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách Categories</h2>
      <ul className="list-disc pl-5 mb-8">
        {categories?.map((category) => (
          <li key={category.id} className="mb-2">{category.name}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold mb-4">Danh sách Products</h2>
      <ul className="list-disc pl-5">
        {products?.map((product) => (
          <li key={product.id} className="mb-2">{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListPage;
```

### Giải thích
1. **Custom Hook `useList`**:
   - Nhận tham số `resource` (products, categories, users, brands) để xác định endpoint API.
   - Sử dụng `useQuery` để gọi API và quản lý trạng thái (`data`, `isLoading`, `error`).
   - Trả về object chứa `data`, `isLoading`, và `error` để component sử dụng.

2. **API Endpoints**:
   - Object `API_ENDPOINTS` lưu trữ các URL API, dễ dàng mở rộng hoặc thay đổi.

3. **Page List**:
   - Sử dụng `useList` để lấy dữ liệu từ hai API (`categories` và `products`).
   - Xử lý trạng thái `isLoading` và `error` để hiển thị thông báo phù hợp.
   - Sử dụng Tailwind CSS để tạo giao diện danh sách đơn giản, responsive.

4. **Tailwind CSS**:
   - Được sử dụng để style giao diện (container, margin, font, v.v.).
   - Cần thêm Tailwind vào dự án qua CDN hoặc cài đặt qua npm:
     ```html
     <script src="https://cdn.tailwindcss.com"></script>
     ```

### Lợi ích của `useList` trong Page List
- **Tái sử dụng**: Có thể dùng cho bất kỳ resource nào trong `API_ENDPOINTS`.
- **Quản lý trạng thái**: Tận dụng `react-query` để xử lý caching, refetching, và trạng thái loading/error.
- **Giao diện rõ ràng**: Tách logic gọi API và giao diện hiển thị, giúp code dễ bảo trì.

### Lưu ý
- Đảm bảo server API (http://localhost:3001) đang chạy.
- Cấu hình Tailwind CSS nếu chưa tích hợp.
- Có thể mở rộng `useList` để hỗ trợ thêm tham số (ví dụ: query params) nếu cần.