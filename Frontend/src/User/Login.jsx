import { useState } from "react";
import MMULOGO from "../assets/MMULogo.png";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [currentForm, setCurrentForm] = useState("login");
  const [formError, setFormError] = useState({ id: "", password: "" });
  const [loginPost, setLoginPost] = useState({ email: "", password: "" });
  const [resetPassPost, setResetPassPost] = useState({
    email: "",
    token: "",
    password: "",
    password_confirmation: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    if (currentForm === "login") {
      setLoginPost({ ...loginPost, [name]: value });
    } else {
      setResetPassPost({ ...resetPassPost, [name]: value });
    }
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    let inputError = { id: "", password: "" };

    if (!loginPost.id) {
      inputError.id = "* Student ID is required";
    }

    if (!loginPost.password) {
      inputError.password = "* Password is required";
    }

    // if (!loginPost.password) {
    //   inputError.password = "* Password is required";
    // } else if (loginPost.password.length < 6) {
    //   inputError.password = "* Password must be at least 6 characters";
    // } else if (!/[A-Z]/.test(loginPost.password)) {
    //   inputError.password = "* Password must contain at least one uppercase letter";
    // } else if (!/[0-9]/.test(loginPost.password)) {
    //   inputError.password = "* Password must contain at least one number";
    // } else if (!/[!@#$%^&*]/.test(loginPost.password)) {
    //   inputError.password = "* Password must contain at least one special character";
    // } else if (!/[a-z]/.test(loginPost.password)) {
    //   inputError.password = "* Password must contain at least one lowercase letter";
    // }

    if (inputError.id || inputError.password) {
      setFormError(inputError);
      return;
    }

    setFormError({ id: "", password: "" });

    axios
      .post("http://localhost:8000/api/user_login", loginPost)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        Cookies.set("token", token);
        console.log(token);
        navigate("/SearchJob");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          setFormError({
            email: "Invalid email or password",
            password: "Invalid email or password",
          });
        }
      });
  };

  const handleResetSubmit = (event) => {
    event.preventDefault();

    if (!resetPassPost.email) {
      alert("Email is required to send OTP");
      return;
    }
    axios
      .post("http://localhost:8000/api/forgot_password", {
        email: resetPassPost.email,
      })
      .then((response) => {
        console.log("Response:", response.data);
        setMessage("OTP sent to your email.");
        setCurrentForm("resetPassword");
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        if (error.response && error.response.status === 422) {
          console.error("Validation errors:", error.response.data.errors);
      } else {
          console.error("There was an error adding the user!", error);
      }
      });
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="flex max-w-4xl shadow-lg overflow-hidden">
        {/* Left Panel - Branding */}
        <div className="w-[430px] p-8 flex flex-col justify-center items-center border-r-2 border-r-custom-medium text-center bg-slate-100">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-4">
              <img className="h-[75px] w-auto" src={MMULOGO} alt="MMU Logo" />
              <div className="bg-gradient-to-b from-gray-200 to-gray-300 w-px h-16"></div>
              <div className="text-center transform hover:scale-105 transition-transform duration-200">
                <p className="text-2xl font-semibold">MMU</p>
                <p className="text-2xl font-semibold text-gray-800 tracking-wider">
                  ALUMNI
                </p>
              </div>
            </div>
            <p>
              Reconnect with your alma mater and fellow alumni through MMU
              Alumni Portal.
            </p>
          </div>
        </div>

        {/* Right Panel - Login or Forgot Password Form */}
        {currentForm === "login" && (
          <div className="w-[320px] p-10 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
              <p className="text-gray-600">
                Welcome back! Please enter your details
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label
                  htmlFor="id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  id
                </label>
                <input
                  name="id"
                  type="id"
                  placeholder="Enter id address"
                  value={loginPost.id}
                  onChange={handleInput}
                  className="h-11 w-full px-4 py-3 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  style={{ border: formError.id ? "1px solid red" : "" }}
                />
                <p className="text-red-600 text-xs">{formError.id}</p>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPost.password}
                    onChange={handleInput}
                    className="h-11 w-full px-4 py-3 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
                    style={{
                      border: formError.password ? "1px solid red" : "",
                    }}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
                  </span>
                </div>
                {formError.password && (
                  <p className="text-red-600 text-xs mt-1">
                    {formError.password}
                  </p>
                )}
                <p
                  className="text-xs text-blue-600 hover:underline ml-auto mt-2 cursor-pointer"
                  onClick={() => setCurrentForm("forgotPassword")}
                >
                  Forgot password?
                </p>
              </div>

              <button
                type="submit"
                className="h-11 w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition duration-200 transform hover:scale-[1.01]"
              >
                Sign In
              </button>
            </form>
          </div>
        )}

        {currentForm === "forgotPassword" && (
          <div className="w-[320px] p-10 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600">
                Enter your email to receive an OTP
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleResetSubmit}>
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={resetPassPost.email}
                  onChange={handleInput}
                  className="h-11 w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
                <div
                  className="text-xs text-blue-600 hover:underline ml-auto mt-4 cursor-pointer"
                  onClick={() => setCurrentForm("login")}
                >
                  Back to Login
                </div>
              </div>
              <button
                type="submit"
                className="h-11 w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition duration-200 transform hover:scale-[1.01]"
              >
                Request OTP
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
