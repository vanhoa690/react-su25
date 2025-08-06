import { Button, Form, Input } from "antd";
import Header from "./Header";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const authMutation = useAuth("login");
  const onSubmit = (values: any) => {
    authMutation.mutate(values);
  };
  return (
    <div>
      <Header />
      <h1 className="text-center text-2xl my-4">Login</h1>
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
export default LoginPage;
