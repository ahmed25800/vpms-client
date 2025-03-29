import { useEffect, useState } from "react";
import { Menu, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import ISMALOGO from "../assets/ISMA LOGO WH3.png";
import { FaShip, FaUsers, FaAnchor, FaWallet } from "react-icons/fa";
import { LiaCertificateSolid } from "react-icons/lia";
import { PERMISSIONS } from "../constants/Permissions";
import { GetCurrentUser } from "../services/UsersService";
import { ROLES } from '../constants/Roles';
import { useTranslation } from "react-i18next";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [logoSrc, setLogoSrc] = useState(ISMALOGO);
  const { t } = useTranslation();

  const MENU_ITEMS_WITH_PERMISSIONS = [
    {
      key: "/dashboard",
      icon: <LiaCertificateSolid style={{ fontSize: "22px", color: "#fff" }} />,
      label: t("Dashboard"),
      permission: PERMISSIONS.DASHBOARD.SCREEN,
    },
    {
      key: "/agent-certificates",
      icon: <LiaCertificateSolid style={{ fontSize: "22px", color: "#fff" }} />,
      label: t("agentCertificates"),
      permission: PERMISSIONS.AGENTS.SCREEN_AGENTS_CERTIFICATES,
    },
    {
      key: "/users-management",
      icon: <FaUsers style={{ fontSize: "22px", color: "#fff" }} />,
      label: t("users"),
      permission: PERMISSIONS.USERS.SCREEN,
    },
    {
      key: "/agent-vessels",
      icon: <FaShip style={{ fontSize: "22px", color: "#fff" }} />,
      label: t("vessels"),
      permission: PERMISSIONS.VESSELS.SCREEN,
    },
    {
      key: "/port-call-transactions",
      icon: <FaAnchor style={{ fontSize: "22px", color: "#fff" }} />,
      label: t("portCall"),
      permission: PERMISSIONS.PORT_CALL.SCREEN,
    },
    {
      key: "/agents-approval",
      icon: <FaUsers style={{ fontSize: "22px", color: "#fff" }} />,
      label: t("agentsApprove"),
      permission: PERMISSIONS.AGENTS.SCREEN_AGENTS_APPROVAL,
    },
    {
      key: "/agents-predeposit-requests",
      icon: <FaUsers style={{ fontSize: "22px", color: "#fff" }} />,
      label: t("PreDepositRequests"),
      permission: PERMISSIONS.AGENTS.SCREEN_AGENTS_PREDEPOSITREQUESTS
    },
    {
      key: "/agents-predeposit-requests-approval",
      icon: <FaUsers style={{ fontSize: "22px", color: "#fff" }} />,
      label: t("PreDepositRequestsApproval"),
      permission: PERMISSIONS.AGENTS.SCREEN_AGENTS_PREDEPOSITREQUESTS_APPROVAL
    },
    {
      key: "/agent-balance-tracking",
      icon: <FaWallet style={{ fontSize: "22px", color: "#fff" }} />,
      label: t("balanceTrackingReport"),
      permission: PERMISSIONS.AGENTS.VIEW_AGENT_BALANCETRANSACTIONSREPORT
    }
  ];

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await GetCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      const filteredItems = MENU_ITEMS_WITH_PERMISSIONS.filter(
        (item) =>
          user?.role === ROLES.SUPER_ADMIN ||
          user?.permissions?.includes(item.permission)
      );
      setMenuItems(filteredItems);
    }
  }, [user]);

  const handleImageError = () => {
    setTimeout(() => {
      setLogoSrc(`${ISMALOGO}?t=${new Date().getTime()}`);
    }, 2000);
  };

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
    <div style={{ height: "100vh", backgroundColor: "#1e3c72", color: "#FFF" }}>
      <div
        style={{
          height: collapsed ? 40 : 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 16,
          borderRadius: 8,
        }}
      >
        <img
          src={logoSrc}
          alt="Logo"
          style={{ height: collapsed ? 40 : 160 }}
          onError={handleImageError}
        />
      </div>
      <Menu
        style={{ backgroundColor: "#1e3c72", color: "#FFF", fontSize: "13px" }}
        theme="Light"
        mode="inline"
        onClick={({ key }) => navigate(key)}
        items={menuItems}
      />
    </div>
  );
};

export default Sidebar;

