export type signUpPayload = {
    fullName:string;
    role:string;
    email:string;
    password:string;
    confirmPassword:string;
    otp?:string
}

export type loginPayload = {
    email:string;
    password:string;
}

export type forgotPasswordPalylod = {
    email:string;
}

export type forgotPasswordOtpVerifyPaylod = {
    email:string;
    otp:string;
}

export type resetPasswordPayload = {
    token:string;
    password:string;
    confirmPassword:string;
}