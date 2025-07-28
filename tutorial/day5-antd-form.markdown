# Hướng dẫn sử dụng Form trong Ant Design (AntD) với React

## 1. Giới thiệu

Ant Design (AntD) là một thư viện UI phổ biến cho React, cung cấp các component form hiệu quả, hỗ trợ quản lý dữ liệu, validation và xử lý sự kiện. Hướng dẫn này sẽ giúp bạn hiểu cách sử dụng AntD Form, xử lý sự kiện, ràng buộc dữ liệu, và thực hành validation.

## 2. Hiểu cách xử lý sự kiện trong React

### 2.1. Giới thiệu

Trong React, sự kiện (event) được xử lý thông qua các hàm xử lý (event handlers) được gắn vào các phần tử JSX. Các sự kiện phổ biến bao gồm `onClick`, `onChange`, `onSubmit`, v.v.

### 2.2. OnClick và hàm truyền tham số

Sự kiện `onClick` được sử dụng để xử lý hành động khi người dùng nhấp chuột.

#### Ví dụ:

```jsx
// ButtonComponent.jsx
import React from "react";

const ButtonComponent = () => {
  const handleClick = (param) => {
    console.log("Button clicked with param:", param);
  };

  return <button onClick={() => handleClick("Hello")}>Click me</button>;
};

export default ButtonComponent;
```

#### Giải thích:

- Hàm `handleClick` nhận tham số `param` để xử lý dữ liệu động.
- Sử dụng arrow function `() => handleClick('Hello')` để truyền tham số khi sự kiện được kích hoạt.

### 2.3. Sử dụng State để quản lý Event

React sử dụng state để quản lý dữ liệu động và cập nhật giao diện khi có thay đổi.

#### Ví dụ:

```jsx
// CounterComponent.jsx
import React, { useState } from "react";

const CounterComponent = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export default CounterComponent;
```

```css
/* counter.component.css */
button {
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
}
p {
  font-size: 16px;
}
```

#### Giải thích:

- `useState` tạo state `count` và hàm `setCount` để cập nhật.
- Sự kiện `onClick` gọi `handleIncrement` để tăng giá trị `count`, giao diện tự động cập nhật.

## 4. AntD Form

### 4.1. Giới thiệu

AntD Form là một component mạnh mẽ giúp quản lý dữ liệu form, validation, và xử lý sự kiện một cách hiệu quả. Sử dụng `Form.useForm()` để tạo instance form và quản lý trạng thái.

### 4.2. Validate form cơ bản

AntD Form hỗ trợ validation thông qua thuộc tính `rules` trong `Form.Item`.

#### Ví dụ:

```jsx
// BasicForm.jsx
import React from "react";
import { Form, Input, Button } from "antd";

const BasicForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BasicForm;
```

```css
/* basic-form.css */
form {
  max-width: 400px;
  margin: 20px;
}
```

#### Giải thích:

- `Form.useForm()` tạo instance `form` để quản lý trạng thái.
- `rules` trong `Form.Item` định nghĩa các quy tắc validation.
- `onFinish` được gọi khi form hợp lệ, `onFinishFailed` khi có lỗi.

### 4.3. Validate nhiều trường dữ liệu

AntD Form hỗ trợ validation phức tạp cho nhiều trường dữ liệu.

#### Ví dụ:

```jsx
// ComplexForm.jsx
import React from "react";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

const ComplexForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <Form form={form} name="complex" layout="vertical" onFinish={onFinish}>
      <Form.Item
        GROK
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "The input is not a valid email!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Age"
        name="age"
        rules={[
          { required: true, message: "Please input your age!" },
          {
            type: "number",
            min: 0,
            max: 99,
            message: "Age must be between 0 and 99!",
          },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Gender"
        name="gender"
        rules={[{ required: true, message: "Please select your gender!" }]}
      >
        <Select>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ComplexForm;
```

```css
/* complex-form.css */
form {
  max-width: 400px;
  margin: 20px;
}
```

#### Giải thích:

- Validation được áp dụng cho nhiều trường với các quy tắc khác nhau (`required`, `type`, v.v.).
- AntD tự động hiển thị thông báo lỗi khi validation thất bại.

### 4.4. reset()

Phương thức `resetFields()` của AntD Form dùng để reset giá trị các trường về giá trị ban đầu hoặc rỗng.

#### Ví dụ:

```jsx
// ResetForm.jsx
import React from "react";
import { Form, Input, Button } from "antd";

const ResetForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
    form.resetFields();
  };

  return (
    <Form form={form} name="reset" layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResetForm;
```

```css
/* reset-form.css */
form {
  max-width: 400px;
  margin: 20px;
}
button {
  margin-right: 8px;
}
```

#### Giải thích:

- `form.resetFields()` reset tất cả các trường về giá trị `initialValues` hoặc rỗng.
- Có thể gọi `resetFields(['fieldName'])` để reset một trường cụ thể.

## 5. Thực hành AntD Form với Input Fields, Validation, Event Handling

### Ví dụ tổng hợp:

```jsx
// AdvancedForm.jsx
import React from "react";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

const AdvancedForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onValuesChange = (changedValues, allValues) => {
    console.log("Changed:", changedValues, "All:", allValues);
  };

  return (
    <Form
      form={form}
      name="advanced"
      layout="vertical"
      initialValues={{ gender: "male" }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onValuesChange}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input onChange={(e) => console.log("Name changed:", e.target.value)} />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "The input is not a valid email!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Gender"
        name="gender"
        rules={[{ required: true, message: "Please select your gender!" }]}
      >
        <Select>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdvancedForm;
```

```css
/* advanced-form.css */
form {
  max-width: 400px;
  margin: 20px;
}
button {
  margin-right: 8px;
}
```

#### Giải thích:

- `onValuesChange` theo dõi mọi thay đổi trong form.
- `onChange` trên `Input` cho phép xử lý sự kiện cụ thể của trường.
- Validation được áp dụng cho nhiều trường với các quy tắc khác nhau.
- `resetFields()` được gọi sau khi submit để xóa dữ liệu form.
- `initialValues` thiết lập giá trị mặc định cho form.

## 6. Ràng buộc dữ liệu giữa Form và State

AntD Form quản lý dữ liệu thông qua instance `form` từ `Form.useForm()`. Dữ liệu form được đồng bộ với state thông qua các sự kiện như `onValuesChange` hoặc các phương thức như `form.getFieldsValue()`.

### Ví dụ:

```jsx
// StateSyncForm.jsx
import React, { useState } from "react";
import { Form, Input, Button } from "antd";

const StateSyncForm = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});

  const onFinish = (values) => {
    setFormData(values);
    console.log("Form data:", values);
  };

  return (
    <div>
      <Form
        form={form}
        name="state-sync"
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={(changedValues, allValues) => setFormData(allValues)}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <p>Form Data: {JSON.stringify(formData)}</p>
    </div>
  );
};

export default StateSyncForm;
```

```css
/* state-sync-form.css */
form {
  max-width: 400px;
  margin: 20px;
}
p {
  font-size: 14px;
  margin-top: 20px;
}
```

#### Giải thích:

- `onValuesChange` cập nhật state `formData` mỗi khi giá trị form thay đổi.
- `formData` được hiển thị để kiểm tra sự đồng bộ giữa form và state.

## 7. Thành thạo các sự kiện Form

- **onChange**: Xử lý thay đổi giá trị của từng trường (thường dùng với `onValuesChange` trong AntD Form).
- **onSubmit**: Xử lý sự kiện submit thông qua `onFinish` và `onFinishFailed`.
- **onValuesChange**: Theo dõi mọi thay đổi trong form.
- **form.resetFields()**: Reset giá trị form.
- **form.getFieldsValue()**: Lấy tất cả giá trị của form.

## 8. Kết luận

AntD Form cung cấp một giải pháp mạnh mẽ để quản lý form trong React, từ validation, xử lý sự kiện, đến đồng bộ dữ liệu với state. Kết hợp với các kỹ thuật như `useForm`, `Watch`, và các sự kiện như `onChange`, `onSubmit`, bạn có thể xây dựng các form phức tạp một cách hiệu quả và dễ bảo trì.
