import { Button, TextField, Typography } from "@mui/material";
import LogoAnimation from "../components/LogoAnimation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { forgotPasswordApiCall } from "../services/password";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async(e : React.FormEvent) => {

     e.preventDefault();

     if(!email) {
        toast.error("Please fill the email input field");
        return;
     }

   const toastId =   toast.loading("Checking and processing...");

     try {
        setLoading(true);
        const response = await forgotPasswordApiCall({email});
        console.log(response);
        toast.dismiss(toastId);
        toast.success(response.message);
        navigate("/forgot-password-otp-verify",{state:{email:email}})
        setLoading(false);    
     } catch (error) {
       setLoading(false);
      toast.dismiss(toastId);
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
     }

  }

  return (
    <div className="w-[80%] mx-auto mt-1 flex flex-row">
      {/* signup form */}
      <div className="flex flex-col gap-3 w-[50%]">
        <div>
          <Typography variant="h3" sx={{ fontWeight: 600 }} gutterBottom>
            <span>Forgot</span>{" "}
            <span className="text-yellow-400">Password</span>
          </Typography>
          <p className="text-gray-100 ">
            Enter your email and we'll send you a otp to reset your password
          </p>
        </div>

        {/* forgot password form  */}
        <form onSubmit={submitHandler} className="w-full mt-28 bg-white rounded-md px-2 py-6 text-black flex flex-col items-center justify-center gap-4">
          <TextField
            type="email"
            fullWidth
            required
            variant="filled"
            placeholder="Email"
            size="medium"
            value={email}
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ textTransform: "none" }}
          >
            Submit
          </Button>
        </form>
      </div>

      {/* signup animation */}
      <div className="w-[50%] flex items-center justify-center mt-44">
        <LogoAnimation />
      </div>
    </div>
  );
};

export default ForgotPassword;
