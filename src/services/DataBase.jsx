import api from "./Axios";
import { API_ENDPOINTS } from "./apiEndpoints";

//Function That return adress of the user
export const getDeliveredAdress = async (calback_func, state_checker) => {

    state_checker(true)

    try {
        const res = await api.get(API_ENDPOINTS.DELIVERY.ADDRESS);

        calback_func(res.data);

    } catch {

    }finally {

        state_checker(false)
    }

};
