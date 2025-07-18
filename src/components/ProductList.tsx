import { useQuery } from "@tanstack/react-query";
import { Image, Spin, Table } from "antd";

interface Product {
  id: string;
  name: string;
  price: number;
}
function ProductList() {
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3001/products");
    return res.json();
  };
  // state data, isLoading, error
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  console.log(data, isLoading, error);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
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
      render: (src: string, recourd: Product, index: number) => {
        return <Image src={src} width={300} alt={recourd.name} />;
      },
    },
    {
      title: "Description",
    },
  ];
  return (
    <div>
      {/* {isLoading && <Spin />} */}
      {error && <p>Error: {error.message}</p>}
      {/* {data?.map((item: Product) => (
        <p key={item.id}>{item.name}</p>
      ))} */}
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
