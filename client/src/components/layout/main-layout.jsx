import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setNavDetail } from "../../features/navDetail/navDetailSlice";
import {
  HomeOutlined,
  ApiOutlined,
  UsbOutlined,
  GlobalOutlined,
  RobotOutlined,
  CloudSyncOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Scrollable from "../Scrollable";
const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    key: "0",
    path: "/home",
    label: "Home",
    icon: <HomeOutlined />,
  },
  {
    key: "1",
    path: "/data-source",
    label: "Data Source",
    icon: <ApiOutlined />,
    children: [
      {
        key: "2",
        path: "/serial-data",
        label: "Serial Data",
        icon: <UsbOutlined />,
      },
      {
        key: "3",
        path: "/http-data",
        label: "HTTP Data",
        icon: <GlobalOutlined />,
      },
      {
        key: "4",
        path: "/mqtt-data",
        label: "MQTT Data",
        icon: <RobotOutlined />,
      },
      {
        key: "5",
        path: "/websocket-data",
        label: "WebSocket Data",
        icon: <CloudSyncOutlined />,
      },
      {
        key: "6",
        path: "/socketio-data",
        label: "Socket.Io Data",
        icon: <CloudSyncOutlined />,
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
    token: { colorPrimaryText },
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
        breakpoint="md"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        zeroWidthTriggerStyle={{ top: "0px" }}
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
            fontSize: "12px",
            height: "50px",
            ...primaryStyle,
            padding: "0",
          }}
        >
          <h1>{header}</h1>
        </Header>
        <Content
          style={{
            margin: "0",
          }}
        >
          <div
            style={{
              padding: "25px 25px 0 25px",
              minWidth: "100%",
              minHeight: "100%",
            }}
          >
            <Scrollable height="150px">{children}</Scrollable>
          </div>
        </Content>
        <Footer
          style={{
            height: "30px",
            textAlign: "center",
            margin: "0",
            padding: "0",
            ...primaryStyle,
          }}
        >
          Data Visualizer ©{new Date().getFullYear()} Created by{" "}
          <a
            href="https://abhisheksharma1310.github.io"
            target="_blank"
            rel="noreferrer"
          >
            Abhishek Sharma
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
