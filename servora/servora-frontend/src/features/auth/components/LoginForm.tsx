import { Button, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { loginUserApiCall } from "../services/login";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();

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
    const toastId = toast.loading("login...");

    try {
      const response = await loginUserApiCall(formData);
      toast.dismiss(toastId);
      toast.success(response.message);
      navigate("/");
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

        <div className=" flex flex-col mb-6">
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

          <Link to={"/forgot-password"} className="self-end text-blue-700">
            Forgot password?
          </Link>
        </div>

        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          size="large"
          sx={{ textTransform: "none" }}
        >
          Log In
        </Button>
      </form>

      <div className="flex flex-row items-center gap-1">
        <p>Don't have an account?</p>
        <Link to={"/signup"} className="text-blue-700">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
