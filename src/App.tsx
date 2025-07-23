import ProductList from "./components/ProductList";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CategoryList from "./components/CategoryList";
import ProductDetail from "./components/ProductDetail";
import UserList from "./components/UserList";
import ProductCreate from "./components/ProductCreate";

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
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
