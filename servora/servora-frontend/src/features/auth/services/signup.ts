import { registerUser, signUpMailSendApi } from "../../../api/auth";
import type { signUpPayload } from "../../../types/auth";


export const signUpMailSendApiCall = async (data : signUpPayload) => {

    const response = await signUpMailSendApi(data);

    if(!response?.data?.success){
        throw new Error("Error occur during signup mail send api call");
    }

    return response.data;

}

export const signUpApiCall = async (data : signUpPayload) => {

    const response = await registerUser(data);

    if(!response?.data?.success){
        throw new Error("Error occur during opt verify api call");
    }

    return response.data;

}