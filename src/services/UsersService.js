import { apiRequest, apiRequestAnonymous } from "../services/BaseService";  
import { API_BASE_URL } from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";

export async function GetAll() {

  const url = `${API_BASE_URL}/Users`; 

  return apiRequest(url, ApiType.GET);
}

export async function Create(fullName, email, phoneNumber, roleId) {

  const url = `${API_BASE_URL}/Users`;

  const body = {
    fullName,
    email,
    phoneNumber,
    roleId
  };

  var result = await apiRequest(url, ApiType.POST, body);
  return result;
}

export async function GetById(id) {


  const url = `${API_BASE_URL}/Users/${id}`;

 

  return apiRequest(url, ApiType.GET);
}

export async function Update(id, fullName, email, phoneNumber, roleId) {

  const url = `${API_BASE_URL}/Users/${id}`;



  const body = {
    id,
    fullName,
    email,
    phoneNumber,
    roleId
  };

  return apiRequest(url, ApiType.PUT, body);
}

export async function Delete(id) {

  const url = `${API_BASE_URL}/Users/${id}`;


  return apiRequest(url, ApiType.DELETE);
}

export async function GetCurrentUser() {

  const url = `${API_BASE_URL}/Users/current`;

  return apiRequest(url, ApiType.GET);
}

export async function ResetUserPassword(body) {
  debugger;
  const url = `${API_BASE_URL}/Users/Password/Reset`;
  var result = await apiRequestAnonymous(url, ApiType.POST, body);
  return result;
}