import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import LogoAnimation from "../components/LogoAnimation";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { resetPasswordApiCall } from "../services/password";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = location.state?.token;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    token: "",
  });

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill the input fields");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password is too short");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and confirmPassword not matched");
      return;
    }

    formData.token = token;

    const toastId = toast.loading("Reset password...");

    try {
      setLoading(false);
      const response = await resetPasswordApiCall(formData);
      console.log(response);
      toast.dismiss(toastId);
      toast.success(response.message);
      navigate("/login");
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
  };

  console.log("token", token);

  return (
    <div className="w-[80%] mx-auto mt-1 flex flex-row">
      {/* signup form */}
      <div className="flex flex-col gap-3 w-[50%]">
        <div>
          <Typography variant="h3" sx={{ fontWeight: 600 }} gutterBottom>
            <span>Change Your</span>{" "}
            <span className="text-yellow-400">Password</span>
          </Typography>
          <p className="text-gray-100 ">
            Enter a password below to change your password
          </p>
        </div>

        <div className="mt-28">
          <div className="w-full bg-white rounded-md p-2 text-black flex flex-col items-center justify-center gap-4">
            <form
              onSubmit={submitHandler}
              className=" flex flex-col gap-4 w-full"
            >
              <TextField
                type={showConfirmPassword ? "password" : "text"}
                fullWidth
                required
                variant="filled"
                placeholder="New password"
                size="medium"
                onChange={onChangeHandler}
                value={formData.password}
                name="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {showConfirmPassword ? (
                        <FaEyeSlash
                          size={25}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowConfirmPassword(false);
                          }}
                        />
                      ) : (
                        <FaEye
                          size={25}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowConfirmPassword(true);
                          }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                type={showPassword ? "password" : "text"}
                fullWidth
                required
                variant="filled"
                placeholder="Re-enter new password"
                size="medium"
                onChange={onChangeHandler}
                value={formData.confirmPassword}
                name="confirmPassword"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {showPassword ? (
                        <FaEyeSlash
                          size={25}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowPassword(false);
                          }}
                        />
                      ) : (
                        <FaEye
                          size={25}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowPassword(true);
                          }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                size="large"
                sx={{ textTransform: "none" }}
              >
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* signup animation */}
      <div className="w-[50%] flex items-center justify-center mt-44">
        <LogoAnimation />
      </div>
    </div>
  );
};

export default ResetPassword;
