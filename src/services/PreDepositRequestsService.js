import { apiRequest } from "../services/BaseService";
import { API_BASE_URL } from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";

export async function GetAll() {
    const url = `${API_BASE_URL}/PreDepositRequests`;
    return apiRequest(url, ApiType.GET);
}

export async function Create(formData) {
    return apiRequest(`${API_BASE_URL}/PreDepositRequests`, ApiType.POST, formData, false, true);
}

export async function ChangeStatus(id, body) {
    const url = `${API_BASE_URL}/PreDepositRequests/${id}/Status`;

    return apiRequest(url, ApiType.PUT, body);
}