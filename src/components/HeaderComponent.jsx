// HeaderComponent.js
import React from 'react';
import { Button, Dropdown, Avatar, Input } from 'antd';
import Breadcrumbs from './Breadcrumbs';
import { useTranslation } from 'react-i18next';
import ISMALOGO from '../assets/ISMALOGO.png';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { FaGlobe } from "react-icons/fa";
const HeaderComponent = ({ setCollapsed, collapsed, logout }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update the document direction (affects overall layout)
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };
  const { Search } = Input;

  // Navbar container with three sections: left, center, right
  const navbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    padding: '0 16px',
    // backgroundColor: '#001529',
    color: '#fff',
  };

  // Left section: language buttons (aligned to left)
  const leftSectionStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  // Center section: logo (centered)
  const centerSectionStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  // Right section: breadcrumbs (aligned to right)
  const rightSectionStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  };
  const languageContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    direction: 'ltr', // Force LTR so textAlign works as expected
    marginRight: '16px'
  };
  const userMenuItems = [
    {
      key: 'profile',
      label: <a href="/profile">Profile</a>,
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: <a href="/settings">Settings</a>,
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];
  return (
    <div style={navbarStyle}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{ fontSize: '21px' }}
      />
      <div style={leftSectionStyle}>

        <Breadcrumbs />
        {/* Language buttons can be conditionally rendered here if needed */}

      </div>
      <div style={centerSectionStyle}>
      <Search   style={{ width: 250 ,margin:150 }} placeholder="input search text" onSearch={onSearch} enterButton />
     
      </div>
      <div style={rightSectionStyle}> 

        <div style={languageContainerStyle}>
     

          <Button icon={<FaGlobe style={{ fontSize: '20px', color: '#1890ff' }} />} onClick={() => changeLanguage('en')}>En </Button>
          <Button icon={<FaGlobe style={{ fontSize: '20px', color: '#1890ff' }} />}onClick={() => changeLanguage('ar')}>العربية</Button>
        </div>
        <Dropdown menu={{ items: userMenuItems }}>
          <Avatar
      style={{
        backgroundColor: '#fde3cf',
        color: '#f56a00',
      }}
    >
      U
    </Avatar>
        </Dropdown>
      </div>
    </div>
  );
};

export default HeaderComponent;
