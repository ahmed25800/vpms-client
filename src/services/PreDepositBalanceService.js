import { apiRequest } from "./BaseService";
import {  API_BASE_URL}  from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";
const controller = "PreDepositBalance";
const endpoints =  {
  GET_TRANSACTIONS_REPORT : {type : ApiType.GET , url : `${API_BASE_URL}/${controller}/GetTransactionsReport`},
};
export const GetTransactionsReport = async (AgentId)=>{
    let endpoint = endpoints.GET_TRANSACTIONS_REPORT;
    var url = AgentId?`${endpoint.url}?AgentId=${AgentId}`:`${endpoint.url}?AgentId=`;
    return apiRequest(`${endpoint.url}`, endpoint.type);
};