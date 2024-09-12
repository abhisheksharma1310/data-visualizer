import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    key: "0",
    path: "/",
    label: "Home",
    icon: <PieChartOutlined />,
  },
  {
    key: "1",
    path: "/dashboard",
    label: "Dashboard",
    icon: <DesktopOutlined />,
  },
  {
    key: "2",
    path: "/data-source",
    label: "Data Source",
    icon: <FileOutlined />,
  },
  {
    key: "3",
    path: "/test-data-source",
    label: "Test Data Source",
    icon: <DesktopOutlined />,
    children: [
      {
        key: "4",
        path: "/serial-data",
        label: "Serial Data",
        icon: <DesktopOutlined />,
      },
    ],
  },
];

const flatMenuItems = [];

function createMenuItems(items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].children) {
      flatMenuItems.push(items[i]);
      createMenuItems(items[i].children);
    } else {
      flatMenuItems.push(items[i]);
    }
  }
}

createMenuItems(menuItems);

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentHeader, setCurrentHeader] = useState("Home");
  const navigate = useNavigate();

  const onMenuItemClick = (eventObj) => {
    const { key } = eventObj;
    const path = flatMenuItems[key].path;
    navigate(path);
    setCurrentHeader(flatMenuItems[key].label);
  };

  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimaryText },
  } = theme.useToken();
  const primaryStyle = {
    background: "#001529",
    color: colorPrimaryText,
  };
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["0"]}
          mode="inline"
          items={menuItems}
          onClick={onMenuItemClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            textAlign: "center",
            height: "80px",
            ...primaryStyle,
          }}
        >
          <h1>{currentHeader}</h1>
        </Header>
        <Content
          style={{
            margin: "16px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: "100%",
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            height: "50px",
            textAlign: "center",
            ...primaryStyle,
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
