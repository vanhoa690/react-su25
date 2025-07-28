import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, message, Spin } from "antd";
import axios from "axios";
import Header from "./Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

// Định nghĩa interface cho form data
interface FormValues {
  name: string;
  price: string; // Input trả về string, sẽ chuyển sang number khi gửi API
}

function ProductEdit() {
  const [form] = Form.useForm();
  const { id } = useParams(); // Lấy giá trị của :id từ URL
  const nav = useNavigate();
  // Hàm gọi API để lấy thông tin sản phẩm
  const fetchProduct = async (id: number | string): Promise<Product> => {
    const response = await axios.get(`http://localhost:3001/products/${id}`);
    return response.data;
  };

  const { data } = useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => {
      if (!id) throw new Error("No ID provided");
      return fetchProduct(id);
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        price: Number(data.price),
      });
    }
  }, [data, form]);

  const updateProduct = async (values: FormValues) => {
    return await axios.put(`http://localhost:3001/products/${id}`, values);
  };

  const { mutate } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      message.success("Thanh cong");
      // nav("/products");
    },
  });

  return (
    <div className=" mt-6 max-w-[1200px] mx-auto px-6">
      <Header />
      <h1 className="text-3xl font-bold  text-center">Product Edit</h1>
      <Form form={form} layout="vertical" onFinish={mutate}>
        <Form.Item
          label="Product Name *"
          name="name"
          rules={[
            { required: true, message: "ten truong bat buoc" },
            {
              min: 3,
              message: "gia tri lon hon 3",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Product Price *"
          name="price"
          rules={[
            { required: true, message: "ten truong bat buoc" },
            {
              min: 3,
              type: "number",
              message: "gia tri lon hon 3",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item label="Image" name="image">
          <Input type="text" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ProductEdit;
