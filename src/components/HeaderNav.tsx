import React from "react";
import { Menu } from "antd";
import { HomeOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const HeaderNav: React.FC = () => {
  return (
    <Menu mode="horizontal" theme="light">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="products" icon={<AppstoreOutlined />}>
        <Link to="/products">Products</Link>
      </Menu.Item>
    </Menu>
  );
};

export default HeaderNav;
