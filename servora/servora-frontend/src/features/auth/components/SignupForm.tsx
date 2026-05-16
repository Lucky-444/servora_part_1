import { Button, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { signUpMailSendApiCall } from "../services/signup";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const navigate = useNavigate();

  const setRoleHandler = (data: string) => {
    setFormData((prev) => {
      return {
        ...prev,
        role: data,
      };
    });
  };

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

    setLoading(true);

    if (formData.password.length < 8) {
      toast.error("Password is too short");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and confirmPassword not matched");
      return;
    }

    const toastId = toast.loading("Sending mail...");

    try {
      const response = await signUpMailSendApiCall(formData);
      toast.dismiss(toastId);
      toast.success(response.message);
      navigate("/verify-otp", { state: formData });
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
    <div className="w-full bg-white rounded-md p-2 text-black flex flex-col items-center justify-center gap-4">
      <form className=" flex flex-col gap-4 w-full" onSubmit={submitHandler}>
        <TextField
          type="text"
          fullWidth
          required
          variant="filled"
          placeholder="Full Name"
          size="medium"
          name="fullName"
          value={formData.fullName}
          onChange={onChangeHandler}
        />
        <TextField
          type="email"
          fullWidth
          required
          variant="filled"
          placeholder="Email"
          size="medium"
          value={formData.email}
          name="email"
          onChange={onChangeHandler}
        />
        <TextField
          type={showPassword ? "password" : "text"}
          fullWidth
          required
          variant="filled"
          placeholder="Password"
          size="medium"
          value={formData.password}
          name="password"
          onChange={onChangeHandler}
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
        <TextField
          type={showConfirmPassword ? "password" : "text"}
          fullWidth
          required
          variant="filled"
          placeholder="Confirm Password"
          size="medium"
          value={formData.confirmPassword}
          name="confirmPassword"
          onChange={onChangeHandler}
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
        <div className="bg-gray-600 flex flex-row gap-2 w-fit px-6 py-2 rounded-full">
          <p
            className={`${formData.role === "User" ? "bg-gray-100" : ""} px-6 py-2 rounded-full cursor-pointer`}
            onClick={() => {
              setRoleHandler("User");
            }}
          >
            User
          </p>
          <p
            className={`${formData.role === "Worker" ? "bg-gray-100" : ""} px-6 py-2 rounded-full cursor-pointer`}
            onClick={() => {
              setRoleHandler("Worker");
            }}
          >
            Worker
          </p>
        </div>

        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          size="large"
          sx={{ textTransform: "none" }}
        >
          Sign Up
        </Button>
      </form>

      <div className="flex flex-row items-center gap-1">
        <p>Allredy have an account?</p>
        <Link to={"/login"} className="text-blue-700">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
