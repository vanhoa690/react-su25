# Hướng dẫn sử dụng React Hooks: useContext và useReducer

## 1. Hook useContext

### Tổng quan

`useContext` là một React Hook cho phép bạn truy cập và sử dụng dữ liệu từ React Context mà không cần phải truyền props qua nhiều tầng component. Nó giúp quản lý trạng thái toàn cục (global state) một cách hiệu quả, đặc biệt trong các ứng dụng lớn.

### Cách hoạt động

- **Tạo Context**: Sử dụng `React.createContext` để tạo một context.
- **Cung cấp giá trị (Provider)**: Bao bọc các component con trong `Context.Provider` và truyền giá trị cần chia sẻ.
- **Tiêu thụ giá trị**: Sử dụng `useContext` trong các component con để truy cập giá trị từ context.

```jsx
import React, { createContext, useContext } from "react";

// Tạo Context
const ThemeContext = createContext(null);

// Component cung cấp context
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <MyComponent />
    </ThemeContext.Provider>
  );
}

// Component tiêu thụ context
function MyComponent() {
  const theme = useContext(ThemeContext);
  return <div>Chủ đề hiện tại: {theme}</div>;
}
```

### Kết hợp useContext và useState

`useContext` thường được sử dụng cùng với `useState` để quản lý trạng thái toàn cục và cập nhật nó.

```jsx
import React, { createContext, useContext, useState } from "react";

// Tạo Context
const ThemeContext = createContext(null);

// Component cung cấp context
function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MyComponent />
    </ThemeContext.Provider>
  );
}

// Component tiêu thụ context
function MyComponent() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div>
      Chủ đề: {theme}
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Đổi chủ đề
      </button>
    </div>
  );
}
```

## 2. Hook useReducer

### Tổng quan

`useReducer` là một Hook thay thế cho `useState`, phù hợp để quản lý trạng thái phức tạp với nhiều giá trị hoặc logic cập nhật phức tạp. Nó dựa trên mô hình reducer, tương tự Redux.

### Cách hoạt động

- **Cú pháp**: `const [state, dispatch] = useReducer(reducer, initialState);`
  - `reducer`: Hàm xử lý logic cập nhật trạng thái, nhận vào `state` hiện tại và `action`, trả về trạng thái mới.
  - `initialState`: Trạng thái ban đầu.
  - `dispatch`: Hàm để gửi action tới reducer.
- **Reducer**: Hàm dạng `(state, action) => newState`.

```jsx
import React, { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      Đếm: {state.count}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}
```

### Kết hợp useReducer và useContext

Kết hợp `useReducer` và `useContext` để quản lý trạng thái toàn cục phức tạp và chia sẻ nó giữa các component.

```jsx
import React, { createContext, useContext, useReducer } from "react";

// Tạo Context
const CounterContext = createContext(null);

// Reducer
const initialState = { count: 0 };
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// Component cung cấp context
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Counter />
    </CounterContext.Provider>
  );
}

// Component tiêu thụ context
function Counter() {
  const { state, dispatch } = useContext(CounterContext);
  return (
    <div>
      Đếm: {state.count}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}
```

### API call với useReducer

Để xử lý các hành động bất đồng bộ (async actions), bạn có thể sử dụng `useReducer` kết hợp với các thư viện như `react-query` để gọi API.

```tsx
import React, { createContext, useContext, useReducer } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Button, Spin } from "antd";
import "antd/dist/reset.css";
import "./index.css"; // Tailwind CSS

// Tạo Context
interface AuthState {
  user: { id: string; name: string } | null;
  status: "idle" | "loading" | "error" | "success";
  error: string | null;
}

type AuthAction =
  | { type: "FETCH_USER_REQUEST" }
  | { type: "FETCH_USER_SUCCESS"; payload: { id: string; name: string } }
  | { type: "FETCH_USER_ERROR"; payload: string }
  | { type: "LOGOUT" };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

// Reducer
const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "FETCH_USER_REQUEST":
      return { ...state, status: "loading", error: null };
    case "FETCH_USER_SUCCESS":
      return { ...state, status: "success", user: action.payload };
    case "FETCH_USER_ERROR":
      return { ...state, status: "error", error: action.payload };
    case "LOGOUT":
      return { user: null, status: "idle", error: null };
    default:
      return state;
  }
}

// Component cung cấp context và react-query
const queryClient = new QueryClient();

function App() {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ state, dispatch }}>
        <AuthComponent />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

// Component tiêu thụ context và gọi API
function AuthComponent() {
  const { state, dispatch } = useContext(AuthContext)!;

  const { refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      dispatch({ type: "FETCH_USER_REQUEST" });
      try {
        const response = await fetch("https:/localhost:3001/user");
        const data = await response.json();
        dispatch({ type: "FETCH_USER_SUCCESS", payload: data });
        return data;
      } catch (error) {
        dispatch({ type: "FETCH_USER_ERROR", payload: "Lỗi khi tải dữ liệu" });
        throw error;
      }
    },
    enabled: false, // Không tự động gọi API khi mount
  });

  return (
    <div className="p-4">
      {state.status === "loading" && <Spin />}
      {state.status === "error" && (
        <p className="text-red-500">{state.error}</p>
      )}
      {state.user && (
        <div>
          <p>Xin chào, {state.user.name}</p>
          <Button
            type="primary"
            className="bg-blue-500"
            onClick={() => dispatch({ type: "LOGOUT" })}
          >
            Đăng xuất
          </Button>
        </div>
      )}
      {!state.user && state.status !== "loading" && (
        <Button
          type="primary"
          className="bg-blue-500"
          onClick={() => refetch()}
        >
          Đăng nhập
        </Button>
      )}
    </div>
  );
}
```

### Tailwind CSS (index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3. Giải quyết vấn đề quản lý trạng thái phức tạp

- **useContext**: Loại bỏ "prop drilling", giúp chia sẻ trạng thái toàn cục dễ dàng.
- **useReducer**: Quản lý trạng thái phức tạp với logic tập trung trong reducer, dễ kiểm tra và bảo trì.
- **Kết hợp với react-query**: Xử lý các tác vụ bất đồng bộ như gọi API, quản lý trạng thái tải, lỗi và thành công một cách hiệu quả.

## 4. Demo Auth Context

Ví dụ trên sử dụng:

- **Ant Design**: Cung cấp các thành phần giao diện như `Button` và `Spin`.
- **Tailwind CSS**: Định dạng giao diện nhanh chóng và linh hoạt.
- **React Query**: Quản lý trạng thái API, bao gồm tải dữ liệu, xử lý lỗi, và lưu trữ cache.
- **TypeScript (TSX)**: Đảm bảo kiểu dữ liệu an toàn và mã dễ bảo trì.
