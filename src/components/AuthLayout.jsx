import { Layout, theme, Spin } from "antd";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import HeaderComponent from "./HeaderComponent";
import { logout } from "../services/AuthService";
import { GetCurrentUser } from "../services/UsersService";
import { Outlet, useNavigate } from "react-router-dom";
import { ROLES } from "../constants/Roles"
import { AgentStatus } from "../constants/enums"
import { useAuth } from "../context/AuthContext";

const AuthLayout = () => {
  const { Header, Content, Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { setUser: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await GetCurrentUser();
        setUser(userData);
        setAuthUser(userData);

        if (userData.role === ROLES.AGENT_ADMIN && userData.currentAgent?.status !== AgentStatus.APPROVED) {
          navigate("/agent-certificates");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate, setAuthUser]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      {/* SIDEBAR */}
      <Sider style={{ backgroundColor: "#1e3c72" }} trigger={null} collapsible collapsed={collapsed} theme="light">
        <Sidebar logout={logout} collapsed={collapsed} isAgentActive={true} />
      </Sider>

      {/* MAIN LAYOUT */}
      <Layout>
        {/* TOP NAVIGATION (Header) */}
        <Header style={{ background: colorBgContainer }}>
          <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} logout={logout} />
        </Header>

        {/* MAIN CONTENT */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AuthLayout;
