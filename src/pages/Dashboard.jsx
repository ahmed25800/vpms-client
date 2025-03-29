import { useState, useEffect } from "react";
import { Card, Col, Row, Spin, Typography, message, Tooltip } from "antd";
import { DollarOutlined, EnvironmentOutlined, UserOutlined } from "@ant-design/icons";
import { FaShip, FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";
import { Column, Pie, Line } from "@ant-design/plots";
import { GetCurrentAgentStatistics } from "../services/AgentService";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const colorMapping = {
  Agents: "#6395f9",
  Vessels: "#6dda8f",
  Payments: "#ffc069",
  "Port Calls": "#ff7875",
  "Agent Balance": "#7356f0", // New color for agent balance
};

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await GetCurrentAgentStatistics();
        setStatistics(data);
        setLastUpdated(new Date().toLocaleString());
      } catch (error) {
        message.error("Error fetching statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
        <p style={{ marginLeft: "16px" }}>{t("Loading dashboard data...")}</p>
      </div>
    );
  }

  const renderCard = (title, value, icon, tooltipText, color) => (
    <Col xs={12} sm={8} md={6} lg={4}>
      <Card bordered={false} style={{ textAlign: "center", boxShadow: "0px 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "4px", minWidth: "120px" }}>
        <Tooltip title={tooltipText}>
          <Title level={5} style={{ marginBottom: 4, color: color || "#000", fontSize: "12px" }}>{t(title)}</Title>
        </Tooltip>
        {icon}
        <Title level={4} style={{ fontSize: "16px", marginBottom: 0 }}>{value}</Title>
      </Card>
    </Col>
  );

  const barChartData = [
    { type: t("Agents"), value: statistics?.agentsCount ?? 0 },
    { type: t("Vessels"), value: statistics?.vesselsCount ?? 0 },
    { type: t("Port Calls"), value: statistics?.portcallsCount ?? 0 },
    { type: t("Payments"), value: statistics?.paymentsCount ?? 0 },
    { type: t("Agent Balance"), value: statistics?.agentBalance ?? 0 },
  ];

  const barChartConfig = {
    data: barChartData,
    xField: "type",
    yField: "value",
    color: ({ type }) => colorMapping[type],
    height: 300,
    width: 400,
  };

  const pieChartConfig = {
    data: barChartData,
    angleField: "value",
    colorField: "type",
    color: ({ type }) => colorMapping[type],
    radius: 0.8,
    innerRadius: 0.6,
    height: 300,
    width: 400,
  };

  const lineChartConfig = {
    data: barChartData.map(item => ({ x: item.type, y: item.value })),
    xField: "x",
    yField: "y",
    color: ({ x }) => colorMapping[x],
    height: 300,
    width: 600,
  };

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <Row gutter={[8, 8]} justify="center" style={{ marginBottom: "24px" }}>
        {renderCard("AgentsCount", statistics?.agentsCount ?? 0, <UserOutlined style={{ fontSize: "20px", color: colorMapping["Agents"] }} />, t("Total number of agents currently available."), colorMapping["Agents"])}
        {renderCard("VesselsCount", statistics?.vesselsCount ?? 0, <FaShip size={20} color={colorMapping["Vessels"]} />, t("Total number of vessels managed."), colorMapping["Vessels"])}
        {renderCard("PaymentsCount", statistics?.paymentsCount ?? 0, <DollarOutlined style={{ fontSize: "20px", color: colorMapping["Payments"] }} />, t("Total number of payments processed."), colorMapping["Payments"])}
        {renderCard("PortCallsCount", statistics?.portcallsCount ?? 0, <EnvironmentOutlined style={{ fontSize: "20px", color: colorMapping["Port Calls"] }} />, t("Total number of port calls made."), colorMapping["Port Calls"])}
        {renderCard("Agent Balance", statistics?.agentBalance ?? 0, <FaWallet size={20} color={colorMapping["Agent Balance"]} />, t("Total balance of all agents."), colorMapping["Agent Balance"])}
      </Row>

      <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "24px" }}>
        <Col span={12}><Card title={t("StatisticsOverview")} bordered={false}><Column {...barChartConfig} /></Card></Col>
        <Col span={12}><Card title={t("DistributionOverview")} bordered={false}><Pie {...pieChartConfig} /></Card></Col>
      </Row>

      <Row justify="center">
        <Col span={24}><Card title={t("TrendAnalysis")} bordered={false}><Line {...lineChartConfig} /></Card></Col>
      </Row>

      <div style={{ marginTop: "20px", fontSize: "14px" }}>
        <span>{t("LastUpdatedAt")} {lastUpdated}</span>
      </div>
    </div>
  );
};

export default Dashboard;
