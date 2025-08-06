# Giới thiệu về Lifecycle trong React 19 và useEffect

Trong React 19, khái niệm **Lifecycle** của một component được quản lý chủ yếu thông qua các **Hooks**, đặc biệt là `useEffect`, thay thế cho các phương thức lifecycle truyền thống như `componentDidMount`, `componentDidUpdate`, và `componentWillUnmount` trong class components. `useEffect` là một hook mạnh mẽ, cho phép thực hiện các tác vụ liên quan đến vòng đời của component như gọi API, cập nhật DOM, hoặc dọn dẹp tài nguyên.

## Tổng quan về useEffect

`useEffect` là một Hook trong React dùng để xử lý các **side effects** (hiệu ứng phụ) trong functional components. Side effects bao gồm các tác vụ như gọi API, đăng ký sự kiện, thao tác DOM, hoặc quản lý tài nguyên.

Cú pháp cơ bản:
```javascript
import { useEffect } from 'react';

useEffect(() => {
  // Logic side effect
  return () => {
    // Cleanup logic (optional)
  };
}, [dependencies]);
```

- **Callback function**: Chứa logic side effect, chạy sau khi component render.
- **Cleanup function** (optional): Được trả về từ callback, chạy trước khi effect chạy lại hoặc khi component unmount.
- **Dependency array**: Điều khiển khi nào effect được gọi. Nếu để trống `[]`, effect chỉ chạy một lần sau khi mount.

## Tại sao gọi API trong useEffect?

- **Thời điểm phù hợp**: `useEffect` chạy sau khi component render, đảm bảo DOM đã sẵn sàng và tránh chặn quá trình render ban đầu, giúp giao diện hiển thị nhanh hơn.
- **Kiểm soát vòng đời**: `useEffect` cho phép gọi API khi component mount hoặc khi các dependency thay đổi, giúp quản lý dữ liệu một cách hiệu quả.
- **Tránh re-render không cần thiết**: Đặt logic gọi API trong `useEffect` với dependency array giúp tránh gọi API nhiều lần không mong muốn.
- **Ví dụ**:
  ```javascript
  import { useState, useEffect } from 'react';

  function MyComponent() {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => setData(data));
    }, []); // Chỉ chạy một lần khi mount

    return <div>{data ? data.name : 'Loading...'}</div>;
  }
  ```

## Các trường hợp sử dụng useEffect trong dự án React

1. **Gọi API hoặc lấy dữ liệu**:
   - Sử dụng để fetch dữ liệu từ server khi component mount hoặc khi dependency thay đổi.
   - Ví dụ: Gọi API khi người dùng thay đổi bộ lọc (filter state).

2. **Đăng ký và hủy đăng ký sự kiện**:
   - Đăng ký các sự kiện như `window.addEventListener` trong callback và hủy trong cleanup function.
   - Ví dụ:
     ```javascript
     useEffect(() => {
       window.addEventListener('resize', handleResize);
       return () => window.removeEventListener('resize', handleResize);
     }, []);
     ```

3. **Cập nhật DOM trực tiếp**:
   - Thao tác với DOM (ví dụ: focus input, scroll) sau khi component render.
   - Ví dụ: Tự động focus input khi component mount.

4. **Quản lý tài nguyên**:
   - Dọn dẹp các tài nguyên như subscription, interval, hoặc timeout để tránh memory leak.
   - Ví dụ:
     ```javascript
     useEffect(() => {
       const timer = setInterval(() => console.log('Tick'), 1000);
       return () => clearInterval(timer);
     }, []);
     ```

## Các lưu ý quan trọng khi sử dụng useEffect

1. **Quản lý Dependency Array**:
   - Luôn khai báo tất cả các biến/state/props được sử dụng trong callback vào dependency array để tránh lỗi logic hoặc stale data.
   - Nếu không có dependency (`[]`), effect chỉ chạy một lần khi mount, tương tự `componentDidMount`.
   - Nếu bỏ trống dependency array (không truyền), effect chạy sau mỗi render, có thể gây hiệu suất kém.

2. **Tránh infinite loop**:
   - Nếu setState trong `useEffect` mà không kiểm soát dependency, có thể dẫn đến vòng lặp vô hạn.
   - Ví dụ sai:
     ```javascript
     useEffect(() => {
       setCount(count + 1); // Gây infinite loop
     });
     ```
   - Cách sửa: Thêm điều kiện hoặc kiểm soát dependency.

3. **Cleanup để tránh memory leak**:
   - Luôn trả về cleanup function khi sử dụng subscription, interval, hoặc listener để dọn dẹp tài nguyên khi component unmount.
   - Ví dụ:
     ```javascript
     useEffect(() => {
       const subscription = someObservable.subscribe();
       return () => subscription.unsubscribe();
     }, []);
     ```

4. **Tối ưu hiệu suất**:
   - Tránh đặt logic phức tạp trong `useEffect` nếu không cần thiết, vì nó có thể làm chậm render.
   - Sử dụng `useMemo` hoặc `useCallback` để tối ưu dependency nếu cần.

5. **Xử lý lỗi khi gọi API**:
   - Sử dụng try-catch hoặc `.catch()` khi gọi API để xử lý lỗi.
   - Ví dụ:
     ```javascript
     useEffect(() => {
       fetch('https://api.example.com/data')
         .then(response => response.json())
         .then(data => setData(data))
         .catch(error => console.error('Error:', error));
     }, []);
     ```

6. **React 19 và Concurrent Rendering**:
   - Trong React 19, với các tính năng như Concurrent Rendering, `useEffect` có thể chạy bất đồng bộ. Đảm bảo logic trong `useEffect` không phụ thuộc vào thứ tự thực thi nghiêm ngặt.
   - Sử dụng `useSyncExternalStore` (nếu cần) để xử lý dữ liệu bên ngoài trong các trường hợp phức tạp.

## Các trường hợp cần biết khi code dự án React

- **Gọi API có điều kiện**:
  - Sử dụng điều kiện trong `useEffect` để chỉ gọi API khi cần (ví dụ: khi người dùng nhập query tìm kiếm).
  - Ví dụ:
    ```javascript
    useEffect(() => {
      if (query) {
        fetch(`https://api.example.com/search?q=${query}`)
          .then(response => response.json())
          .then(data => setResults(data));
      }
    }, [query]);
    ```

- **Chạy effect khi cập nhật state/props**:
  - Thêm state/props vào dependency array để chạy lại effect khi chúng thay đổi.
  - Ví dụ: Cập nhật dữ liệu khi người dùng đổi trang (page).

- **Tích hợp thư viện bên thứ ba**:
  - Khởi tạo và dọn dẹp các thư viện như Chart.js, Socket.io trong `useEffect`.
  - Ví dụ:
    ```javascript
    useEffect(() => {
      const chart = new Chart(ctx, options);
      return () => chart.destroy();
    }, []);
    ```

- **Xử lý unmount trước khi API hoàn thành**:
  - Sử dụng biến cờ (flag) để kiểm tra component còn mount hay không trước khi cập nhật state.
  - Ví dụ:
    ```javascript
    useEffect(() => {
      let isMounted = true;
      fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => {
          if (isMounted) setData(data);
        });
      return () => {
        isMounted = false;
      };
    }, []);
    ```

## Kết luận

Trong React 19, `useEffect` là công cụ chính để quản lý vòng đời của component, thay thế các phương thức lifecycle truyền thống. Gọi API trong `useEffect` là lựa chọn lý tưởng vì nó đảm bảo thời điểm thực thi hợp lý và kiểm soát được side effects. Tuy nhiên, cần chú ý đến dependency array, cleanup function, và tối ưu hiệu suất để tránh các vấn đề như infinite loop hoặc memory leak. Hiểu rõ các trường hợp sử dụng `useEffect` sẽ giúp lập trình viên xây dựng ứng dụng React hiệu quả và dễ bảo trì hơn.