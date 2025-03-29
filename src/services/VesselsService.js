import { apiRequest  , objectToFormData} from "./BaseService";
import { API_BASE_URL  as  API_BASE_URL}  from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";

const endpoints =  {
  CREATE : {type : ApiType.POST , url : `${API_BASE_URL}/Vessels/CreateVessel`},
  UPDATE : {type : ApiType.PUT , url : `${API_BASE_URL}/Vessels/UpdateVessel`},
  DELETE : {type : ApiType.DELETE , url : `${API_BASE_URL}/Vessels/DeleteVessel`},
  GET_ALL : {type : ApiType.GET , url : `${API_BASE_URL}/Vessels`},
  GET_BY_Id : {type : ApiType.GET , url : `${API_BASE_URL}/Vessels/GetVesselById`},
  GET_BY_AGENT_ID : {type : ApiType.GET , url : `${API_BASE_URL}/Vessels/GetAgentVessels`},
  GET_AGENT_VESSELS_DROPDOWN : {type : ApiType.GET , url : `${API_BASE_URL}/Vessels/GetAgentVesselsDropDown`},
  GET_VESSEL_CERTIFICATES : {type : ApiType.GET , url : `${API_BASE_URL}/Certificate/GetCertificates`},
  SAVE_VESSEL_CERTIFICATE : {type : ApiType.POST , url : `${API_BASE_URL}/Certificate/SaveVesselCertificate`},
  DELETE_VESSEL_CERTIFICATE : {type : ApiType.DELETE , url : `${API_BASE_URL}/Certificate/DeleteVesselCertificate`},
}

export async function SaveVessel(vesselForm) {
  let endpoint = vesselForm.id ? endpoints.UPDATE : endpoints.CREATE;
  let formData = objectToFormData(vesselForm);
  return apiRequest(endpoint.url, endpoint.type, formData, false, true);
}
export async function Delete(id) {
  const endpoint = endpoints.DELETE;
  return apiRequest(`${endpoint.url}?Id=${id}`, endpoint.type);
}

export async function GetVesselsByAgentId() {
  const endpoint = endpoints.GET_BY_AGENT_ID;
  return apiRequest(`${endpoint.url}`, endpoint.type);
}
export async function GetCertificates(certificatesParams) {
  const endpoint = endpoints.GET_VESSEL_CERTIFICATES;
  const queryParams = new URLSearchParams(certificatesParams).toString();
  return apiRequest(`${endpoint.url}?${queryParams}`, endpoint.type);
}

export async function SaveVesselCertificate(formData) {
  const endpoint = endpoints.SAVE_VESSEL_CERTIFICATE;
  return apiRequest(endpoint.url, endpoint.type, formData, false, true);
}
export async function DeleteVesselCertificate(deleteObject) {
  let endpoint = endpoints.DELETE_VESSEL_CERTIFICATE;
  const queryParams = new URLSearchParams(deleteObject).toString();
  return apiRequest(`${endpoint.url}?${queryParams}`, endpoint.type);
}

export async function GetAgentVesselDropDown(AgentId){
  const endpoint = endpoints.GET_AGENT_VESSELS_DROPDOWN;
  return apiRequest(`${endpoint.url}?AgentId=${AgentId}`, endpoint.type);
}
