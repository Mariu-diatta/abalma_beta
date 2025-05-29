import api from "./Axios";

export const apiCreateProduct = async (credentials) => {

    const reponse = api.post('/produits/', credentials)

    return reponse.data

 
}