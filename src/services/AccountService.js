import { apiRequestAnonymous } from "./BaseService";
import { API_BASE_URL } from "../constants/APIsUrls";
import { ApiType } from "../constants/enums";


export async function Confirm(body) {

    const url = `${API_BASE_URL}/Account/Confirm`;

    var result = await apiRequestAnonymous(url, ApiType.POST, body);

    return result;
}