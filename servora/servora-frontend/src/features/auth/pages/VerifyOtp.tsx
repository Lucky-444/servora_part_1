import { useLocation, useNavigate } from "react-router-dom";
import LogoAnimation from "../components/LogoAnimation";
import OtpInput from "react-otp-input";
import { useState } from "react";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import { signUpApiCall, signUpMailSendApiCall } from "../services/signup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../authSlice";

const VerifyOtp = () => {
  const location = useLocation();
  const data = location.state;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const signUpHandler = async () => {
    if (!otp) {
      toast.error("Please fill the otp");
      return;
    }

    if (otp.length < 4) {
      toast.error("Please fill the otp");
      return;
    }

    const signupData = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
      confirmPassword: data.confirmPassword,
      otp: otp,
    };

    const toastId = toast.loading("Verifying otp...");

    try {
      setLoading(true);
      const response = await signUpApiCall(signupData);
      dispatch(setToken(response?.data?.accessToken));
      toast.dismiss(toastId);

      toast.success(response?.message);
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      setLoading(false);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const resendOptHandler = async () => {
    const toastId = toast.loading("Sending otp...");

    try {
      const response = await signUpMailSendApiCall(data);
      toast.dismiss(toastId);
      toast.success(response.message);
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      toast.dismiss(toastId);
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="w-[80%] mx-auto mt-1 flex flex-row h-[calc(100vh-60px)] items-center justify-center">
      {/* otp */}
      <div className="w-[50%] flex flex-col gap-4">
        <div className="flex flex-col justify-center items-center">
          <p className="font-semibold text-2xl mb-2">We sent you a code</p>
          <p className="font-semibold">
            Please enter it below to verify your email
          </p>
          <p className="text-blue-700">{data.email}</p>
        </div>

        <div className="flex flex-col gap-1 justify-center items-center ">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span>-</span>}
            renderInput={(props) => (
              <input
                {...props}
                className="w-20 h-12 text-4xl text-center bg-gray-600 boder border-gray-400 rounded-md"
              />
            )}
          />

          <Button
            variant="contained"
            sx={{ marginTop: "32px", width: "400px", textTransform: "none" }}
            size="large"
            onClick={signUpHandler}
            disabled={loading}
          >
            Verify Otp
          </Button>
        </div>

        <div className="flex flex-row gap-1 justify-center items-center ">
          <p>Don't get the code?</p>
          <p className="underline cursor-pointer" onClick={resendOptHandler}>
            Resend code
          </p>
        </div>
      </div>

      {/* signup animation */}
      <div className="w-[50%] flex items-center justify-center ">
        <LogoAnimation />
      </div>
    </div>
  );
};

export default VerifyOtp;
