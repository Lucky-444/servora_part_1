import { loginUserApi } from "../../../api/auth";
import type { loginPayload } from "../../../types/auth";


export const loginUserApiCall = async (data : loginPayload) => {

    const response = await loginUserApi(data);

    if(!response?.data?.success){
        throw new Error("Error occur during login api call");
    }

    return response.data;

}