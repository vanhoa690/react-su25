import { Button, Image, Popconfirm, Table } from "antd";
import Header from "./Header";
import { Link } from "react-router-dom";
import { useList } from "../hooks/useList";
import { useDelete } from "../hooks/useDelete";

interface Product {
  id: string;
  name: string;
  price: number;
}
function ProductList() {
  const { data, isLoading, error } = useList("products");
  const deleteMutaion = useDelete("products");

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => {
        return <Link to={`/product/update/${id}`}>Edit ID: {id}</Link>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (src: string, recourd: Product) => {
        return <Image src={src} width={300} alt={recourd.name} />;
      },
    },
    {
      title: "Actions",
      render: (product: Product) => (
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={() => deleteMutaion.mutate(product.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];
  return (
    <div>
      <Header />
      {error && <p>Error: {error.message}</p>}
      <Table
        dataSource={data}
        columns={columns}
        rowKey={"id"}
        loading={isLoading} // Hiển thị spinner khi đang tải
        pagination={{ pageSize: 5 }} // Phân trang, mỗi trang 5 bản ghi
      />
    </div>
  );
}

export default ProductList;
