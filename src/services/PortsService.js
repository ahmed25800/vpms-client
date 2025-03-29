import { apiRequest } from "./BaseService";
import {API_BASE_URL}  from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";
const controller = "Ports";
const endpoints =  {
  GET_ALL_PORTS_DROPDOWN : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetAllPortsDropDown`},
}

export async function GetAllPortsDropDown() {
  const endpoint = endpoints.GET_ALL_PORTS_DROPDOWN;
  return apiRequest(`${endpoint.url}`, endpoint.type);
}
