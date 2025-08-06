import ProductList from "./components/ProductList";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CategoryList from "./components/CategoryList";
import ProductDetail from "./components/ProductDetail";
import UserList from "./components/UserList";
import ProductCreate from "./components/ProductCreate";
import "@ant-design/v5-patch-for-react-19";
import ProductEdit from "./components/ProductEdit";
import { App as AntdApp } from "antd";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProductList />,
    },
    {
      path: "/products",
      element: <ProductList />,
    },
    {
      path: "/products/create",
      element: <ProductCreate />,
    },
    {
      path: "/product/detail/:productId",
      element: <ProductDetail />,
    },
    {
      path: "/product/edit/:id",
      element: <ProductEdit />,
    },
    {
      path: "/categories",
      element: <CategoryList />,
    },
    {
      path: "/orders",
      element: <CategoryList />,
    },
    {
      path: "/users",
      element: <UserList />,
    },
    {
      path: "/brands",
      element: <CategoryList />,
    },
  ]);
  return (
    <div className="max-w-[1200px] mx-auto">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
