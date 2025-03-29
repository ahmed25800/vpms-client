import React from "react";
import { Empty, Button } from "antd";
import { useTranslation } from "react-i18next";

const NoData = ({ message = null, onReload }) => {
  const {t} = useTranslation();
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Empty description={message? message : t("noDataAvailable")} />
      {onReload && (
        <Button type="primary" style={{ marginTop: "10px" }} onClick={onReload}>
          Reload
        </Button>
      )}
    </div>
  );
};

export default NoData;