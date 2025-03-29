import React from "react";
import { Result, Typography } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const NoPermission = ({ titleKey = "permissionDenied" }) => {
  const { t } = useTranslation();

  return (
    <Result
      icon={<WarningOutlined style={{ color: "#ffc53d" }} />}
      title={<Title level={3}>{t(titleKey)}</Title>}
      subTitle={t("noPermissionMessage")}
    />
  );
};

export default NoPermission;