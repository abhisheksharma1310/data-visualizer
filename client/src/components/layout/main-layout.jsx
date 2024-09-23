import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setNavDetail } from "../../features/navDetail/navDetailSlice";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
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
    path: "/data-source",
    label: "Data Source",
    icon: <FileOutlined />,
  },
  {
    key: "2",
    path: "/test-data-source",
    label: "Test Data Source",
    icon: <DesktopOutlined />,
    children: [
      {
        key: "3",
        path: "/serial-data",
        label: "Serial Data",
        icon: <DesktopOutlined />,
      },
      {
        key: "4",
        path: "/http-data",
        label: "HTTP Data",
        icon: <DesktopOutlined />,
      },
      {
        key: "5",
        path: "/mqtt-data",
        label: "MQTT Data",
        icon: <DesktopOutlined />,
      },
      {
        key: "6",
        path: "/webSocket-data",
        label: "WebSocket Data",
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
  const location = useLocation();
  const navigate = useNavigate();

  const { key, header, path } = useSelector((state) => state.navDetail);

  if (path !== location.pathname) {
    navigate(path);
  }

  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();

  const onMenuItemClick = (eventObj) => {
    const { key } = eventObj;
    const path = flatMenuItems[key].path;
    const header = flatMenuItems[key].label;
    dispatch(setNavDetail({ key, header, path }));
    //navigate(path);
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
        overflow: "hidden",
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
          defaultSelectedKeys={[key]}
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
          <h1>{header}</h1>
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
