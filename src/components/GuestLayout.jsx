import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { sendOAuthRequest } from '../services/AuthService';
import ISMALOGO from '../assets/ISMA LOGO WH3.png';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const GuestLayout = ({ children }) => {
  const isLandingPage = !children;

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'row' }}>
      {/* Left Section with Logo */}


      {/* Right Section with Content */}
      <div style={{
        flex: 1,
        background: '#2a5298',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px',
        color: '#fff'
      }}>
        {isLandingPage ? (
          <div style={{ maxWidth: '800px' }}>
            <Title level={2} style={{ color: '#fff', fontWeight: 'bold' }}>
              بوابة تصاريح الدخول والتفتيش على السفن للمياه الإقليمية العراقية
            </Title>
            <Paragraph style={{ fontSize: '15px', opacity: 0.9, color: '#fff', }}>
              منصة إلكترونية متكاملة لإدارة عمليات التصاريح والتفتيش على السفن القادمة والمغادرة في المياه الإقليمية العراقية.
            </Paragraph>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <Link to="/login">
                <Button type="primary" onClick={sendOAuthRequest} size="large" style={{ minWidth: '160px' }}>
                  تسجيل الدخول
                </Button>
              </Link>
              <Link to="/agent-admin-registeration">
                <Button type="default" size="large" style={{ minWidth: '160px', background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: 'none' }}>
                  تسجيل وكيل
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>{children}</div>
        )}
      </div>
      <div style={{
        flex: 1,
        background: '#1e3c72',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <img src={ISMALOGO} alt="Logo" style={{ height: '350px' }} />
      </div>
    </Layout>
  );
};

export default GuestLayout;
