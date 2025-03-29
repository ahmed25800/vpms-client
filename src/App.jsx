import { useEffect, useState } from 'react';
import { getUser, logout } from './services/AuthService';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import { getResources as getResourse } from './services/AgentService';
import OAuthCallback from './pages/oauth-callback.page';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import AgentCertificates from './pages/AgentCertificates';
import UserManagement from './pages/UserManagement';
// Import layouts
import AuthLayout from './components/AuthLayout';
import GuestLayout from './components/GuestLayout';
import VesselsManagement from './pages/VesselsManagement';
import PermissionsManagement from './pages/PermissionsManagement';
import RegisterAgentAdmin from './pages/RegisterAgentAdmin';
import AgentsApproval from './pages/AgentsApproval';
import PCTransactions from './pages/PCTransactions';
import PcTransactionDetails from './pages/PcTransactionDetails';
import { ConfigProvider } from 'antd';
import EmailConfirmation from './pages/EmailConfirmation';
import ResetPassword from './pages/ResetPassword';
import UnauthorizedAccess from './pages/UnauthorizedAccess'
import PreDepositRequestsManagement from './pages/PreDepositRequestsManagement'
import PreDepositRequestsApproval from './pages/PreDepositRequestsApproval'
import PreDepositBalanceTrackingReport from './pages/PreDepositBalanceTrackingReport';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    const user = await getUser();
    const accessToken = user?.access_token;

    setUser(user);

    if (accessToken) {
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: 'rgb(30, 60, 114)', componentSize: 'small' } }}>

      <BrowserRouter>
        <Routes>
          {/* Guest Layout for Unauthenticated Users (Landing Page) */}
          <Route path='/' element={<GuestLayout />} />

          {/* Login Page */}
          <Route path='/login' element={
            <GuestLayout>
              {/* <UnAuthenticated authenticated={isAuthenticated} /> */}
            </GuestLayout>
          } />

          {/* OAuth Callback Route */}
          <Route path='/oauth/callback' element={<OAuthCallback setIsAuthenticated={setIsAuthenticated} />} />

          {/* Authenticated Layout with Nested Routes */}
          <Route
            path='/'
            element={
              <ProtectedRoute authenticated={isAuthenticated} redirectPath='/'>
                <AuthLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested Pages Under AuthLayout */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="agent-certificates" element={<AgentCertificates />} />
            <Route path="users-management" element={<UserManagement />} />
            <Route path="permissions-management" element={<PermissionsManagement />} />
            <Route path="agent-vessels" element={<VesselsManagement  />} />
            <Route path="port-call-transactions" element={<PCTransactions />} />
            <Route path="port-call-transaction/:transactionId" element={<PcTransactionDetails />} />
            <Route path="agents-approval" element={<AgentsApproval />} />
            <Route path="agents-predeposit-requests" element={<PreDepositRequestsManagement />} />
            <Route path="agents-predeposit-requests-approval" element={<PreDepositRequestsApproval />} /> 
            <Route path="agent-balance-tracking" element={<PreDepositBalanceTrackingReport />} /> 
          </Route>

          <Route path="agent-admin-registeration" element={<RegisterAgentAdmin />} />
          <Route path="/confirm-email" element={<EmailConfirmation />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<UnauthorizedAccess />} />

        </Routes >
      </BrowserRouter >
    </ConfigProvider>
  );
}

export default App;
