import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Spin } from "antd";

type Product = {
  id: number;
  name: string;
  price: number;
};

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:3001/products");
  return response.json();
}

function ProductList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page],
    queryFn: fetchProducts,
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price}`,
    },
  ];

  return (
    <div>
      {isLoading && <Spin />}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && (
        <>
          <Table
            dataSource={data}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            style={{ marginTop: "16px" }}
          >
            Load More
          </Button>
        </>
      )}
    </div>
  );
}

export default ProductList;
