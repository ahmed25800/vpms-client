import { apiRequest } from "./BaseService";
import {  API_BASE_URL}  from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";
const controller = "Documents";
const endpoints =  {
  GETDOCUMENT : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/file`},

}
export const GetDocumentUrl = (documentId)=> {
  let endpoint = endpoints.GETDOCUMENT;
  return `${endpoint.url}/${documentId}`;
};
