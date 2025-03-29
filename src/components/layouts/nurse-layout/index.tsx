import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu, message, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
import { SlCalender } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "../../atoms/button/Button";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "../../../redux/features/userSlice";
import { FaChartPie } from "react-icons/fa";
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link to={`/nurse/${key}`}> {label} </Link>,
  } as MenuItem;
}
const items: MenuItem[] = [
  getItem("Dashboard", "dashboard", <FaChartPie />),
  getItem("Quản lí người dùng", "users", <SlCalender />),
  getItem("Quản lí thanh toán", "orders", <SlCalender />),
  getItem("Quản lí cuộc hẹn", "appointments", <SlCalender />),
];

const NurseLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    message.success("Đăng xuất thành công");
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}

      >
        <div className="demo-logo-vertical" />
        <Menu
          className="menu-sidebar"
          style={{
            height: "100%",
          }}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
        <div className="w-full menu-sidebar flex justify-center">
          <Button
            onClick={handleLogout}
            styleClass="h-[51px] w-[51px]  mb-12 text-white flex justify-center items-center bg-gradient-to-b from-[#504C51] to-[#323033]"
          >
            <LogoutOutlined className="text-[18px] stroke-white stroke-[10px]" />
          </Button>
        </div>
      </Sider>
      <Layout
        style={{
          overflowY: "auto",
        }}
      >
        <Content style={{ margin: "10px 16px" }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          NestCare ©{new Date().getFullYear()} Created by Minh
        </Footer>
      </Layout>
    </Layout>
  );
};

export default NurseLayout;
