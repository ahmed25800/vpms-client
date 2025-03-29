import { apiRequest } from "./BaseService";
import { API_BASE_URL } from "../constants/APIsUrls";
import { ApiType, CertificateStatus } from "../constants/enums";


export async function SetCertificateStatus(id, status, rejectionReason) {
    const url = `${API_BASE_URL}/AgentCertificates/${id}/Status`;
    const body = {
        status,
        rejectionReason,
    };

    return apiRequest(url, ApiType.PUT, body);
}