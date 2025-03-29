import { apiRequest  } from "./BaseService";
import {  API_BASE_URL}  from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";
const controller = "Payment";
const endpoints =  {

    GET_INVOICE : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetInvoice`},
    GET_RECEIPT : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetReceipt`},
  
}

export async function GetInvoice(Id) {
  const endpoint = endpoints.GET_INVOICE;
  return apiRequest(`${endpoint.url}/${Id}`, endpoint.type);
}

export async function GetReciept(Id) {
  const endpoint = endpoints.GET_RECEIPT;
  return apiRequest(`${endpoint.url}?TransactionDetailId=${Id}`, endpoint.type);
}