import { apiRequest } from "./BaseService";
import { API_BASE_URL } from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";

export async function GetAllBySubject(subject) {

  const url = `${API_BASE_URL}/Permissions/${subject}`;

  return apiRequest(url, ApiType.GET);
}

export async function GetAllRolePermissions() {

  const url = `${API_BASE_URL}/Role-Permission`;

  return apiRequest(url, ApiType.GET);
}

export async function AssignPermissionsToRole(body) {

  const url = `${API_BASE_URL}/Roles/${body.roleId}/Permissions`;

  return apiRequest(url, ApiType.POST, body);
}

export async function DeletelRolePermission(id) {

  const url = `${API_BASE_URL}/Role-Permission/${id}`;

  return apiRequest(url, ApiType.DELETE);
}

export async function getCurrentUserPermissions() {
  const url = `${API_BASE_URL}/Users/current/permissions`;

  return apiRequest(url, ApiType.GET);
}
