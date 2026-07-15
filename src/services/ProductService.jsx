import api from "./Axios";
import { API_ENDPOINTS } from "./apiEndpoints";

export const apiCreateProduct = async (credentials) => {

    const reponse = api.post(API_ENDPOINTS.PRODUCTS.CREATE, credentials)

    return reponse.data

 
}