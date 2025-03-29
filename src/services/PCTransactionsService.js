import { apiRequest , objectToFormData } from "./BaseService";
import {  API_BASE_URL}  from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";
const controller = "PortCallTransactions";
const endpoints =  {
  CREATE_PCTRANSACTION : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/AddPortCallTransaction`},
  READ_PCTRANSACTION : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetPCTransactions`},
  READ_DETAILS_STEPS : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetPcTransactionSteps`},
  READ_ENTRY_PERMIT : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/EntryPermit`},
  READ_ENTRY_PERMIT_PAYMENT : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/EntryPermitPayment`},
  UPLOADDETAILDOCUMENT : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/UploadPCTransactionDocument`},
  APPROVE_DETAIL_DOCUMENT : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/ApprovePCTransactionDocument`},
  APPROVE_ENTRY_PERMIT : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/ApproveEntryPermit`},
  APPROVE_ENTRY_PERMIT_PAYMENT : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/ApproveEntryPermitPayment`},
  READ_DETAILS_ATTACHED_DOCUMENTS : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetDetailAttachedDocuments`},
  CHECK_VESSEL_ARRIVAL : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/CheckVesselArrival`},
  SET_VESSEL_ARRIVAL : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/SetVesselArrival`},
  GET_ENTRY_PERMIT_REPORT : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetEntryPermitReport`},
  REJECT_DOCUMENT : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/RejectDetailDocument`},
  REJECT_DETAIL : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/RejectTransactionDetail`},
  REJECT_INSPECTION_PAYMENT : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/RejectInspectionPayment`},
  READ_EXIT_PERMIT : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetExitPermit`},
  CREATE_EXIT_PERMIT : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/CreateExitPermit`},
  APPROVE_EXIT_PERMIT : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/ApproveExitPermit`},
  CHECK_VESSEL_DEPARTURE : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/CheckVesselDeparture`},
  SET_VESSEL_DEPARTURE : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/SetVesselDeparture`},
  CREATE_PAYMENT_REFUND : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/CreateEntryPermitPaymentRefund`},
  APPROVE_PAYMENT_REFUND : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/ApproveEntryPermitPaymentRefund`},
  GET_PRE_PAYMENT_DATA : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetPrePaymentData`},
  SELECT_PAYMENT_METHOD : {type : ApiType.POST , url : `${API_BASE_URL}/${controller}/SelectPaymentMethod`},
  //SelectPaymentMethod
  //GET_PRE_PAYMENT_DATA
}
export async function SaveTransaction(obj) {
  let endpoint = endpoints.CREATE_PCTRANSACTION;
  return apiRequest(endpoint.url, endpoint.type , obj);
}
export async function GetPCTransactions(obj) {
  const endpoint = endpoints.READ_PCTRANSACTION;
  const queryParams = new URLSearchParams(obj).toString();
  return apiRequest(`${endpoint.url}?${queryParams}`, endpoint.type);
}
export async function GetPCTransactionSteps(Id) {
  const endpoint = endpoints.READ_DETAILS_STEPS;
  return apiRequest(`${endpoint.url}?TransactionId=${Id}`, endpoint.type);
}

export async function GetEntryPermit(Id) {
  const endpoint = endpoints.READ_ENTRY_PERMIT;
  return apiRequest(`${endpoint.url}?TransactionId=${Id}`, endpoint.type);
}

export async function UploadDetailDocument(form) {
  let endpoint = endpoints.UPLOADDETAILDOCUMENT;
  let formData = objectToFormData(form);
  return apiRequest(endpoint.url, endpoint.type, formData, false, true);
}

export async function ApproveDetailDocument(obj) {
  let endpoint = endpoints.APPROVE_DETAIL_DOCUMENT;
  return apiRequest(endpoint.url, endpoint.type , obj);
}


export async function ApproveEntryPermit(obj) {
  let endpoint = endpoints.APPROVE_ENTRY_PERMIT;
  return apiRequest(endpoint.url, endpoint.type , obj);
}
// /ApproveEntryPermitPayment
export async function ApproveEntryPermitPayment(obj) {
  let endpoint = endpoints.APPROVE_ENTRY_PERMIT_PAYMENT;
  return apiRequest(endpoint.url, endpoint.type , obj);
}
//GetEntryPermitPayment
export async function GetEntryPermitPayment(Id) {
  const endpoint = endpoints.READ_ENTRY_PERMIT_PAYMENT;
  return apiRequest(`${endpoint.url}?TransactionId=${Id}`, endpoint.type);
}
//GetDetailAttachedDocuments
export async function GetDetailAttachedDocuments(Id, documentTypeId) {
  const endpoint = endpoints.READ_DETAILS_ATTACHED_DOCUMENTS;
  return apiRequest(`${endpoint.url}?TransactionDetailId=${Id}&documentTypeId=${documentTypeId}`, endpoint.type);
}

export async function CheckVesselArrival(Id) {
  const endpoint = endpoints.CHECK_VESSEL_ARRIVAL;
  return apiRequest(`${endpoint.url}?transactionId=${Id}`, endpoint.type);
}

export async function SetVesselArrival(obj) {
  const endpoint = endpoints.SET_VESSEL_ARRIVAL;
  return apiRequest(endpoint.url, endpoint.type , obj);
}

export async function CheckVesselDeparture(Id) {
  const endpoint = endpoints.CHECK_VESSEL_DEPARTURE;
  return apiRequest(`${endpoint.url}?transactionId=${Id}`, endpoint.type);
}

export async function SetVesselDeparture(obj) {
  const endpoint = endpoints.SET_VESSEL_DEPARTURE;
  return apiRequest(endpoint.url, endpoint.type , obj);
}


export async function GetEntryPermitReport(Id) {
  const endpoint = endpoints.GET_ENTRY_PERMIT_REPORT;
  return apiRequest(`${endpoint.url}?TransactionDetailId=${Id}`, endpoint.type);
}
export async function RejectDetailDocument(obj) {
  let endpoint = endpoints.REJECT_DOCUMENT;
  return apiRequest(endpoint.url, endpoint.type , obj);
}
export async function RejectTransactionDetail(obj) {
  let endpoint = endpoints.REJECT_DETAIL;
  return apiRequest(endpoint.url, endpoint.type , obj);
}
export async function RejectInspectionPayment(obj) {
  let endpoint = endpoints.REJECT_INSPECTION_PAYMENT;
  return apiRequest(endpoint.url, endpoint.type , obj);
}
export async function GetExitPermit(Id) {
  const endpoint = endpoints.READ_EXIT_PERMIT;
  return apiRequest(`${endpoint.url}?TransactionId=${Id}`, endpoint.type);
}

export async function CreateExitPermit(form) {
  let endpoint = endpoints.CREATE_EXIT_PERMIT;
  let formData = objectToFormData(form);
  return apiRequest(endpoint.url, endpoint.type, formData, false, true);
}

export async function ApproveExitPermit(obj) {
  let endpoint = endpoints.APPROVE_EXIT_PERMIT;
  return apiRequest(endpoint.url, endpoint.type , obj);
}

export async function CreateEntryPermitPaymentRefund(obj){
  let endpoint = endpoints.CREATE_PAYMENT_REFUND;
  return apiRequest(endpoint.url, endpoint.type , obj);
}

export async function ApproveEntryPermitPaymentRefund(obj){
  let endpoint = endpoints.APPROVE_PAYMENT_REFUND;
  return apiRequest(endpoint.url, endpoint.type , obj);
}

export async function GetPrePaymentData(Id) {
  const endpoint = endpoints.GET_PRE_PAYMENT_DATA;
  return apiRequest(`${endpoint.url}?DetailId=${Id}`, endpoint.type);
}

export async function SelectPaymentMethod(obj) {
  const endpoint = endpoints.SELECT_PAYMENT_METHOD;
  return apiRequest(endpoint.url, endpoint.type , obj);
}