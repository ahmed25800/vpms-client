import { getUser } from "./AuthService";
import { ApiType } from "../constants/enums";
import { message } from "antd";

export async function getToken() {
  const user = await getUser();
  return user?.access_token || null;
}

async function sendRequest(endpoint, method, body, useJsonParser, formData, useAuth) {
  const headers = formData ? {} : { "Content-Type": "application/json" };

  if (useAuth) {
    const token = await getToken();
    if (!token) {
      //  message.error("No authentication token found.");
      return;
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = formData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        //  message.error(errorData.detail || `Unexpected error: ${response.statusText}`);
      } catch {
        //   message.error(`Unexpected error: ${response.statusText}`);
      }
      throw errorData;
    }
    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return null;
    }
    return useJsonParser ? await response.json() : await response.text();

  } catch (error) {
    if (error && typeof error === "object") throw error;
    //  message.error("Network error occurred. Please try again.");
    console.error("API request error:", error.message);
  }
}

export function apiRequest(endpoint, method = ApiType.GET, body = null, useJsonParser = true, formData = false) {
  return sendRequest(endpoint, method, body, useJsonParser, formData, true);
}

export function apiRequestAnonymous(endpoint, method = ApiType.GET, body = null, useJsonParser = true, formData = false) {
  return sendRequest(endpoint, method, body, useJsonParser, formData, false);
}


export const objectToFormData = (obj, formData = new FormData(), parentKey = '') => {
  Object.entries(obj).forEach(([key, value]) => {
    const formKey = parentKey ? `${parentKey}.${key}` : key;

    if (value instanceof File || value instanceof Blob) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        objectToFormData(item, formData, `${formKey}[${index}]`);
      });
    } else if (value !== null && typeof value === 'object') {
      objectToFormData(value, formData, formKey);
    } else {
      formData.append(formKey, value);
    }
  });

  return formData;
};