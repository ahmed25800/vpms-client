import { apiRequest, apiRequestAnonymous } from "./BaseService";
import { API_BASE_URL } from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";


export async function GetCurrentAgentCertificates() {
  const url = `${API_BASE_URL}/Agent/Current/Certificates`;
  return apiRequest(url, ApiType.GET);
}

export async function setAgentCertificate(formData) {
  return apiRequest(`${API_BASE_URL}/Certificate/SetAgentCertificate`, ApiType.POST, formData, false, true);
}

export async function changeAgentCertificateStatus(CertificateId, CertificateStatus, AgentId) {
  const body = {
    CertificateId,
    CertificateStatus,
    AgentId
  };

  return apiRequest(`${API_BASE_URL}/Certificate/ChangeAgentCertificateStatus`, ApiType.PUT, body);
}

export async function getResources() {
  return apiRequest(`${API_BASE_URL}/resources`, ApiType.GET, null, false);
}

export async function RegisterAgent(body) {
  const url = `${API_BASE_URL}/Agent/register`;
  debugger;
  var result = await apiRequestAnonymous(url, ApiType.POST, body);
  return result;
}

export async function GetAllByStatus(status) {
  const url = `${API_BASE_URL}/Agent?status=${status}`;
  return apiRequest(url, ApiType.GET);
}

export async function SetAgentStatus(id, status) {
  const url = `${API_BASE_URL}/Agent/${id}/Status`;
  const body = {
    status,
  };

  return apiRequest(url, ApiType.PUT, body);
}

export async function GetAgentByUserId(userId) {
  const url = `${API_BASE_URL}/Agent/${userId}`;

  return apiRequest(url, ApiType.GET);
}

export async function GetCurrentAgentStatistics() {
  const url = `${API_BASE_URL}/Agent/current/statistics`;

  return apiRequest(url, ApiType.GET);
}

export async function GetCurrentAgentPreDepositRequests() {
  
  const url = `${API_BASE_URL}/Agent/current/preDepositRequests`;

  return apiRequest(url, ApiType.GET);
}