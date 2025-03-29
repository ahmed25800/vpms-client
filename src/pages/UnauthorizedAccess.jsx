import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const UnauthorizedAccess = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Title level={3}>Sorry, you are not authorized to access this page.</Title>
    </div>
  );
};

export default UnauthorizedAccess;
