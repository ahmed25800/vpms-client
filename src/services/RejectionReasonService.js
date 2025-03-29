import { apiRequest } from "./BaseService";
import {API_BASE_URL}  from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";
const controller = "RejectionReason";
const endpoints =  {
  GET_ALL_REJECTIONS_DROPDOWN : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetRejectionReasons`},
}
export async function GetRejectionReasons() {
  const endpoint = endpoints.GET_ALL_REJECTIONS_DROPDOWN;
  return apiRequest(`${endpoint.url}`, endpoint.type);
}
