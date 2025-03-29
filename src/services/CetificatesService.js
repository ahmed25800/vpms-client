import { apiRequest } from "./BaseService";
import {  API_BASE_URL}  from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";
const controller = "Certificate";
const endpoints =  {
  GETTYPES : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetCertificateTypes`},

}
export const GetCertificateTypes = (certificateType)=> {
  let endpoint = endpoints.GETTYPES;
  return apiRequest(`${endpoint.url}?CertificateType=${certificateType}` , endpoint.type);
};
