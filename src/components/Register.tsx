import { Button, Form, Input } from "antd";
import { useAuth } from "../hooks/useAuth";
import Header from "./Header";

function RegisterPage() {
  const authMutation = useAuth("register");
  const onSubmit = (values: any) => {
    authMutation.mutate(values);
  };
  return (
    <div>
      <Header />
      <h1 className="text-center text-2xl my-4">Register</h1>
      <Form onFinish={onSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }, { min: 6 }]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
export default RegisterPage;
