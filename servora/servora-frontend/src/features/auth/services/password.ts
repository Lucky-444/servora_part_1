import { forgotPasswordApi, forgotPasswordOtpVerify, resetPasswordApi } from "../../../api/auth";
import type { forgotPasswordOtpVerifyPaylod, forgotPasswordPalylod, resetPasswordPayload } from "../../../types/auth";

export const forgotPasswordApiCall = async (data : forgotPasswordPalylod) => {

    const response = await forgotPasswordApi(data);

    if(!response?.data?.success){
        throw new Error("Error occur during forgot password api call");
    }

    return response.data;

}

export const forgotPasswordOtpVerifyCall = async (data : forgotPasswordOtpVerifyPaylod) => {

    const response = await forgotPasswordOtpVerify(data);

    if(!response?.data?.success){
        throw new Error("Error occur during forgot password verify otp api call");
    }

    return response.data;

}

export const resetPasswordApiCall = async (data : resetPasswordPayload) => {

    const response = await resetPasswordApi(data);

    if(!response?.data?.success){
        throw new Error("Error occur during reset password api call");
    }

    return response.data;

}

