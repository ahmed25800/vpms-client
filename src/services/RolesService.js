import { apiRequest } from "../services/BaseService";  
import { API_BASE_URL } from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";


export async function GetAll() {

    const url = `${API_BASE_URL}/Roles`;
    
    return apiRequest(url, ApiType.GET);
  }