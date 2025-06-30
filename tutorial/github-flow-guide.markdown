# Hướng dẫn GitHub Flow cho dự án Angular + JSON Server (Website bán hàng)

Dưới đây là hướng dẫn sử dụng **GitHub Flow** cho hai người làm việc trên dự án **Angular + JSON Server** để phát triển một website bán hàng. GitHub Flow là một quy trình quản lý branch đơn giản, phù hợp cho nhóm nhỏ và dự án có vòng đời phát triển nhanh. Hướng dẫn này giả định cả hai người đều đã quen cơ bản với Git và GitHub.

## 1. Tổng quan về GitHub Flow
GitHub Flow là một quy trình quản lý branch nhẹ, tập trung vào:
- **Branch `main`**: Chứa code ổn định, sẵn sàng deploy lên production.
- **Feature branches**: Mỗi tính năng hoặc nhiệm vụ được phát triển trên một branch riêng, tạo từ `main` và hợp nhất trở lại qua **Pull Request (PR)**.
- Quy trình: Tạo branch → Code → Push → Mở PR → Review → Merge → Deploy.

Trong dự án website bán hàng (Angular + JSON Server), hai người sẽ tạo các feature branch cho các tính năng như giao diện danh sách sản phẩm, giỏ hàng, hoặc API giả lập với JSON Server.

## 2. Thiết lập dự án và GitHub Flow

### Bước 1: Khởi tạo repository
1. **Tạo repository trên GitHub**:
   - Một người tạo repository (ví dụ: `ecommerce-website`) và mời người còn lại làm collaborator (thêm qua Settings > Collaborators).
   - Đảm bảo repository có file `.gitignore` phù hợp cho Angular (bỏ qua `node_modules`, `dist`, v.v.).

2. **Clone repository**:
   Cả hai người clone repository về máy:
   ```bash
   git clone https://github.com/username/ecommerce-website.git
   cd ecommerce-website
   ```

3. **Khởi tạo dự án Angular và JSON Server**:
   - **Angular**:
     ```bash
     npm install -g @angular/cli
     ng new frontend
     cd frontend
     ng serve
     ```
   - **JSON Server**:
     ```bash
     npm install -g json-server
     mkdir server
     cd server
     touch db.json
     ```
     Thêm dữ liệu mẫu vào `db.json` (ví dụ: danh sách sản phẩm):
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
     json-server --watch db.json
     ```

4. **Push mã ban đầu lên `main`**:
   - Thêm file `.gitignore`, commit và push:
     ```bash
     git add .
     git commit -m "Khởi tạo dự án Angular và JSON Server"
     git push origin main
     ```

## 3. Quy trình GitHub Flow

### Bước 2: Phân chia công việc
- **Người 1**: Phát triển giao diện (ví dụ: danh sách sản phẩm, giỏ hàng) bằng Angular.
- **Người 2**: Quản lý API giả lập (JSON Server) và tích hợp với frontend.
- Mỗi người tạo một feature branch cho nhiệm vụ của mình.

### Bước 3: Tạo feature branch
- **Người 1** (giao diện danh sách sản phẩm):
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feature/product-list
  ```
  - Code giao diện trong Angular (ví dụ: tạo component `product-list`).
  - Commit thay đổi:
    ```bash
    git add .
    git commit -m "Thêm giao diện danh sách sản phẩm"
    git push origin feature/product-list
    ```

- **Người 2** (API JSON Server):
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feature/json-server-api
  ```
  - Cập nhật `db.json` với API endpoint (ví dụ: `/products`).
  - Commit thay đổi:
    ```bash
    git add .
    git commit -m "Thêm API sản phẩm với JSON Server"
    git push origin feature/json-server-api
    ```

### Bước 4: Mở Pull Request (PR)
1. Truy cập GitHub, vào repository `ecommerce-website`.
2. Chọn branch `feature/product-list` hoặc `feature/json-server-api` và nhấn **Create Pull Request**.
3. Đặt tiêu đề và mô tả rõ ràng (ví dụ: "Thêm danh sách sản phẩm" hoặc "Cấu hình API JSON Server").
4. Gán người còn lại làm **reviewer** để kiểm tra code.

### Bước 5: Review và merge PR
- Người kia xem PR trên GitHub:
  - Kiểm tra code, chạy thử local nếu cần:
    ```bash
    git checkout feature/product-list
    npm install
    ng serve
    ```
  - Góp ý hoặc yêu cầu sửa đổi trong phần comment của PR.
- Nếu OK, nhấn **Merge Pull Request** để hợp nhất branch vào `main`.
- Xóa feature branch sau khi merge (GitHub tự động gợi ý).

### Bước 6: Cập nhật local repository
- Cả hai người pull code mới từ `main`:
  ```bash
  git checkout main
  git pull origin main
  ```

### Bước 7: Deploy (nếu có)
- Nếu website cần deploy (ví dụ: lên Vercel/Netlify), chạy:
  ```bash
  ng build
  ```
  - Deploy thư mục `dist` lên nền tảng hosting.
- JSON Server có thể deploy lên Heroku hoặc một server riêng.

## 4. Quy tắc làm việc nhóm
1. **Giao tiếp thường xuyên**:
   - Dùng Slack/Discord để phân chia nhiệm vụ và báo cáo tiến độ.
   - Ví dụ: Người 1 hoàn thành giao diện thì thông báo để Người 2 tích hợp API.

2. **Đặt tên branch rõ ràng**:
   - Dùng tiền tố `feature/` (ví dụ: `feature/cart`, `feature/checkout`).
   - Mô tả ngắn gọn, dễ hiểu.

3. **Commit thường xuyên, rõ ràng**:
   - Commit message nên cụ thể (ví dụ: "Thêm service gọi API sản phẩm" thay vì "Fix bug").
   - Commit nhỏ, tập trung vào một thay đổi cụ thể.

4. **Kéo code từ `main` thường xuyên**:
   - Tránh xung đột bằng cách luôn `git pull origin main` trước khi tạo branch mới.

5. **Xử lý xung đột (nếu có)**:
   - Nếu xảy ra xung đột khi merge PR, người tạo PR cần:
     ```bash
     git checkout main
     git pull origin main
     git checkout feature/your-branch
     git merge main
     ```
     - Sửa xung đột trong code, commit và push lại.

## 5. Ví dụ phân chia công việc
Dưới đây là các tính năng mẫu cho website bán hàng và cách phân chia:

| Tính năng                  | Người phụ trách | Branch                   |
|----------------------------|----------------|--------------------------|
| Giao diện danh sách sản phẩm | Người 1       | `feature/product-list`   |
| Giao diện giỏ hàng         | Người 1       | `feature/cart`           |
| API sản phẩm (JSON Server) | Người 2       | `feature/json-server-api`|
| Tích hợp API vào frontend  | Người 2       | `feature/api-integration`|

## 6. Lưu ý quan trọng
- **Kiểm tra trước khi merge**:
  - Chạy `ng test` để kiểm tra unit test (nếu có).
  - Đảm bảo JSON Server hoạt động đúng với các endpoint.
- **Backup db.json**:
  - Vì JSON Server lưu dữ liệu trong `db.json`, hãy commit file này thường xuyên.
- **Tài liệu**:
  - Thêm file `README.md` mô tả cách chạy dự án:
    ```markdown
    # Ecommerce Website
    ## Cài đặt
    1. Clone repository: `git clone ...`
    2. Cài Angular: `cd frontend && npm install`
    3. Chạy Angular: `ng serve`
    4. Cài JSON Server: `cd server && npm install json-server`
    5. Chạy JSON Server: `json-server --watch db.json`
    ```
- **Bảo mật**:
  - Không commit file chứa thông tin nhạy cảm (API key, mật khẩu).

## 7. Câu lệnh Git thường dùng
- Tạo branch: `git checkout -b feature/tên-branch`
- Commit: `git commit -m "Mô tả thay đổi"`
- Push: `git push origin feature/tên-branch`
- Pull: `git pull origin main`
- Xem trạng thái: `git status`

## 8. Kết luận
GitHub Flow đơn giản, hiệu quả cho nhóm hai người làm việc trên dự án Angular + JSON Server. Mỗi người tạo feature branch, đẩy code lên GitHub, mở PR và review lẫn nhau. Giao tiếp tốt và đặt tên branch/commit rõ ràng sẽ giúp dự án trơn tru.