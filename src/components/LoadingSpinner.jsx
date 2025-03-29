import React from "react";
import { Row, Col, Spin } from "antd";

const LoadingSpinner = ({ loading, marginTop = 20, size = "large" }) => {
  if (!loading) return null;

  return (
    <Row justify="center" style={{ marginTop }}>
      <Col>
        <Spin size={size} />
      </Col>
    </Row>
  );
};

export default LoadingSpinner;