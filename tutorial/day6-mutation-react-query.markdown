# Giới thiệu về `useMutation` trong React Query và Demo Chỉnh sửa Sản phẩm (TypeScript)

## Tổng quan về `useMutation`

`useMutation` là một hook của **React Query** (TanStack Query) dùng để xử lý các thao tác thay đổi dữ liệu như tạo, cập nhật, xóa trên server. Khác với `useQuery` dùng để lấy dữ liệu, `useMutation` được thiết kế cho các thao tác thay đổi trạng thái server.

### Các tính năng chính của `useMutation`

- **Hàm mutate**: Kích hoạt thao tác thay đổi (POST, PUT, DELETE).
- **Quản lý trạng thái**: Theo dõi trạng thái mutation (`idle`, `loading`, `error`, `success`).
- **Tự động làm mới dữ liệu**: Hỗ trợ làm mới query liên quan sau khi mutation hoàn tất.
- **Xử lý lỗi**: Dễ dàng quản lý và hiển thị thông báo lỗi.
- **Tùy chỉnh linh hoạt**: Hỗ trợ các callback như `onSuccess`, `onError`, `onSettled`.

## Demo: Chỉnh sửa sản phẩm với `useMutation` (TypeScript)

Trong ví dụ này, chúng ta xây dựng một form chỉnh sửa sản phẩm dựa trên ID, sử dụng `useMutation` để gửi yêu cầu PUT đến JSON Server, chỉ truyền `values` từ form data vào `mutation.mutate({ id: productId, ...values })`, tích hợp với Ant Design Form.

### Yêu cầu

- **JSON Server**: API giả lập để quản lý sản phẩm.
- **React Query**: Quản lý trạng thái và gọi API.
- **Ant Design**: Cung cấp giao diện Form.
- **TypeScript**: Đảm bảo an toàn kiểu dữ liệu.

### Thiết lập môi trường

1. **Cài đặt JSON Server**:

   ```bash
   npm install -g json-server
   ```

   Tạo tệp `db.json`:

   ```json
   {
     "products": [
       { "id": 1, "name": "Sản phẩm 1", "price": 100 },
       { "id": 2, "name": "Sản phẩm 2", "price": 200 }
     ]
   }
   ```

   Chạy JSON Server:

   ```bash
   json-server --watch db.json --port 3001
   ```

2. **Cài đặt dự án React với TypeScript**:

   ```bash
   npx create-react-app product-edit-demo --template typescript
   cd product-edit-demo
   npm install @tanstack/react-query antd axios
   ```

3. **Cấu hình React Query**:
   Trong `index.tsx`, thiết lập QueryClient:

   ```tsx
   import React from "react";
   import ReactDOM from "react-dom/client";
   import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
   import App from "./App";
   import "antd/dist/reset.css";

   const queryClient = new QueryClient();

   const root = ReactDOM.createRoot(
     document.getElementById("root") as HTMLElement
   );
   root.render(
     <QueryClientProvider client={queryClient}>
       <App />
     </QueryClientProvider>
   );
   ```

### Ví dụ code: Chỉnh sửa sản phẩm (TypeScript)

Tạo file `ProductEditForm.tsx` để chỉnh sửa sản phẩm dựa trên ID, sử dụng `useMutation` và truyền `values` từ form.

```tsx
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
// Định nghĩa interface cho sản phẩm
interface ProductForm {
  name: string;
  price: number;
}

// Định nghĩa interface cho form data
interface FormValues {
  name: string;
  price: string; // Input trả về string, sẽ chuyển sang number khi gửi API
}

interface ProductEditFormProps {
  productId: number;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ productId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { id } = useParams();

  const fetchProduct = async (id: number | string): Promise<Product> => {
    const response = await axios.get(`http://localhost:3001/products/${id}`);
    return response.data;
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        price: Number(data.price),
      });
    }
  }, [data, form]);

  // Hàm gọi API để cập nhật sản phẩm
  const updateProduct = async (id: string | number, values: ProductForm) => {
    const response = await axios.put(
      `http://localhost:3001/products/${id}`,
      product
    );
    return response.data;
  };

  // Sử dụng useMutation với TypeScript
  const mutation = useMutation<Product, Error, Product>({
    mutationFn: updateProduct,
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      message.error(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
    },
  });

  // Hàm submit form
  const onFinish = (values: FormValues) => {
    // Chuyển price từ string sang number và thêm productId
    mutation.mutate({
      name: values.name,
      price: Number(values.price),
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Chỉnh sửa sản phẩm</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: "", price: "" }}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductEditForm;
```

### Cách sử dụng trong ứng dụng

Trong `App.tsx`, tích hợp `ProductEditForm`:

```tsx
import React from "react";
import ProductEditForm from "./ProductEditForm";

const App: React.FC = () => {
  return (
    <div>
      <h1>Ứng dụng quản lý sản phẩm</h1>
      <ProductEditForm productId={1} />
    </div>
  );
};

export default App;
```

### Giải thích code

1. **TypeScript**:
   - Định nghĩa `interface Product` để mô tả cấu trúc dữ liệu sản phẩm.
   - Định nghĩa `interface FormValues` cho dữ liệu từ form (price là string do Input trả về).
   - `useMutation` được khai báo với kiểu `<Product, Error, Product>` để đảm bảo an toàn kiểu dữ liệu.
2. **API Call**: Hàm `updateProduct` gửi yêu cầu PUT đến JSON Server để cập nhật sản phẩm.
3. **useMutation**:
   - `mutationFn`: Hàm `updateProduct` xử lý API call.
   - `onSuccess`: Hiển thị thông báo thành công và làm mới danh sách sản phẩm.
   - `onError`: Hiển thị thông báo lỗi.
   - `mutation.mutate({ id: productId, ...values })`: Truyền trực tiếp `id` và `values` từ form, với `price` được chuyển sang number.
4. **Ant Design Form**: Cung cấp giao diện nhập liệu với xác thực (required).
5. **Trạng thái**: Sử dụng `mutation.isPending` để hiển thị trạng thái loading trên nút.

### Kết quả

- Người dùng nhập tên và giá sản phẩm vào form.
- Khi nhấn "Cập nhật", `useMutation` gửi yêu cầu PUT đến `http://localhost:3001/products/:id` với dữ liệu `{ name, price }`.
- Nếu thành công, hiển thị thông báo "Cập nhật sản phẩm thành công!" và làm mới danh sách sản phẩm.
- Nếu lỗi, hiển thị thông báo lỗi.

### Lợi ích của `useMutation` với TypeScript

- **An toàn kiểu dữ liệu**: TypeScript đảm bảo dữ liệu gửi và nhận đúng định dạng.
- **Quản lý trạng thái**: Không cần tự quản lý loading hay lỗi.
- **Tích hợp query**: Dễ dàng làm mới dữ liệu sau mutation.
- **Giao diện mượt mà**: Ant Design Form giúp tạo form nhanh chóng và chuyên nghiệp.

### Hướng dẫn chạy demo

1. Chạy JSON Server: `json-server --watch db.json --port 3001`.
2. Chạy ứng dụng React: `npm start`.
3. Truy cập `http://localhost:3000` để xem form chỉnh sửa sản phẩm.

Nếu bạn cần thêm tính năng (như lấy dữ liệu sản phẩm để điền sẵn form) hoặc giải thích chi tiết hơn, hãy cho tôi biết!
