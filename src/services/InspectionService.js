import { apiRequest , objectToFormData } from "./BaseService";
import {  API_BASE_URL}  from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";
const controller = "Inspection";
const endpoints =  {
  UPLOAD_INSPECTION : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/UploadInspectionTemplate`},
  DOWNLOAD_INSPECTION : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/DownloadInspectionTemplate`},
  GET_INSPECTION_DATA : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetInspectionData`},
  START_INSPECTION : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/StartInspection`},
  START_RE_INSPECTION : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/StartReInspection`},
  PAYINVOICE : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/PayInvoice`},
  APPROVEINSPECTION : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/ApproveInspection`}
}

export async function UploadInspection(form) {
  let endpoint = endpoints.UPLOAD_INSPECTION;
  let formData = objectToFormData(form);
  return apiRequest(endpoint.url, endpoint.type, formData, false, true);
}

export async function downloadInspectionTemplate() {
    try {
        let endpoint = endpoints.DOWNLOAD_INSPECTION;
        const response = await apiRequest(endpoint.url, endpoint.type, null, false);
    
        if (!response) {
            message.error("Failed to download the template.");
            return;
        }
  
        const contentDisposition = response.headers.get("Content-Disposition");
        let fileName = "Ship_Inspection_Template.xlsx";
    
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+?)"/);
            if (match && match[1]) {
            fileName = match[1];
            }
        }
        const blob = await response.blob();
        saveAs(blob, fileName);
        message.success("Template downloaded successfully.");
    } catch (error) {
        console.error("Download error:", error);
        message.error("Failed to download the template.");
    }
  }
  export const GetInspectionData = async (TransactionId)=>{
    let endpoint = endpoints.GET_INSPECTION_DATA;
    return apiRequest(`${endpoint.url}?TransactionId=${TransactionId}`, endpoint.type);
  };
  //StartInspection

  export const StartInspection = async (data)=>{
    let endpoint = endpoints.START_INSPECTION;
    return apiRequest(`${endpoint.url}`, endpoint.type ,data);
  };
  //StartReInspection
  export const StartReInspection = async (data)=>{
    let endpoint = endpoints.START_RE_INSPECTION;
    return apiRequest(`${endpoint.url}`, endpoint.type ,data);
  };

   export const PayInvoice = async (data)=>{
    let endpoint = endpoints.PAYINVOICE;
    return apiRequest(`${endpoint.url}`, endpoint.type ,data);
  };

export const ApproveInspection = async (data)=>{
    let endpoint = endpoints.APPROVEINSPECTION;
    return apiRequest(`${endpoint.url}`, endpoint.type ,data);
};