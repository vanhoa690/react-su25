import { Button, Form, Input, InputNumber } from "antd";
import Header from "./Header";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useOne } from "../hooks/useOne";
import { useUpdate } from "../hooks/useUpdate";

function ProductUpdate() {
  const [form] = Form.useForm();
  const { id } = useParams();

  const { data: product } = useOne("products", id);

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [product, form]);

  const updateMutaion = useUpdate(id);

  const handleSubmit = (values: any) => {
    updateMutaion.mutate(values);
  };
  return (
    <div>
      <Header />
      <div className=" mt-6 max-w-[1200px] mx-auto px-6">
        <h1 className="text-3xl font-bold  text-center">Product Edit</h1>
        <Form
          form={form}
          layout="vertical"
          className="container px-4"
          onFinish={handleSubmit}
        >
          <Form.Item label="Product Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Product Image" name="image">
            <Input />
          </Form.Item>
          <Form.Item label="Product Price" name="price">
            <InputNumber />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ProductUpdate;
