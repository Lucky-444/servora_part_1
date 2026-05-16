import type { forgotPasswordOtpVerifyPaylod, forgotPasswordPalylod, loginPayload, resetPasswordPayload, signUpPayload } from "../types/auth"
import api from "./axios"


export const signUpMailSendApi = (data : signUpPayload) => {
    return api.post("/auth/send-mail-auth",data)
}

export const registerUser = (data : signUpPayload) => {
    return api.post("/auth/signUp",data)
}

export const loginUserApi = (data : loginPayload) => {
    return api.post("/auth/login",data);
}

export const forgotPasswordApi = (data : forgotPasswordPalylod) => {
    return api.post("/auth/forgot-password",data);
}

export const forgotPasswordOtpVerify = (data : forgotPasswordOtpVerifyPaylod) => {
    return api.put("/auth/forgot-password-verify-otp",data);
}

export const resetPasswordApi = (data : resetPasswordPayload) => {
    return api.put("/auth/reset-password",data);
}