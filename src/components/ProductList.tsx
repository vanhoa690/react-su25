import { useQuery } from "@tanstack/react-query";
import { Spin, Table } from "antd";

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
    },
    {
      title: "Image",
      dataIndex: "image",
    },
    {
      title: "Description",
    },
  ];
  return (
    <div>
      {isLoading && <Spin />}
      {error && <p>Error: {error.message}</p>}
      {/* {data?.map((item: Product) => (
        <p key={item.id}>{item.name}</p>
      ))} */}
      <Table dataSource={data} columns={columns} rowKey={"id"} />
    </div>
  );
}

export default ProductList;
