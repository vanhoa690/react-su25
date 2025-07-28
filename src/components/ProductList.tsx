import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Table } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import Header from "./Header";

// Định nghĩa interface cho sản phẩm
interface Product {
  id: number;
  name: string;
  price: number;
}
function ProductList() {
  // query page, name
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name");

  const fetchProducts = async () => {
    const res = await fetch(
      `http://localhost:3001/products?name_like=${name || ""}`
    );
    return res.json();
  };
  // state data, isLoading, error
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => {
        return <Link to={`/product/edit/${id}`}>Edit ID: {id}</Link>; // Tạo liên kết đến chi tiết sản phẩm
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      // sorter: (a: Product, b: Product) => a.name.localeCompare(b.name), // Sắp xếp theo tên
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a: Product, b: Product) => a.price - b.price, // Sắp xếp theo giá
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
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
      <Header />
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
}

export default ProductList;
