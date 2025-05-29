import { useState } from "react";
import MMULOGO from "../assets/MMULogo.png";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";


export default function LoginPage({ initialForm = "login" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentForm, setCurrentForm] = useState(initialForm);
  const [formError, setFormError] = useState({ id: "", password: "" });
  const [loginPost, setLoginPost] = useState({ id: "", password: "" });
  const [formResetError, setFormResetError] = useState({ password: "" , password_confirmation: ""});
  const [resetPassPost, setResetPassPost] = useState({
    email: "",
    token: "",
    password: "",
    password_confirmation: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [resetPassVisible, setResetPassVisible] = useState(false);
  const [resetPassConfirmVisible, setResetPassConfirmVisible] = useState(false);


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleResetPassVisibility = () => {
    setResetPassVisible(!resetPassVisible);
};

const toggleResetPassConfirmVisibility = () => {
    setResetPassConfirmVisible(!resetPassConfirmVisible);
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

    if (inputError.id || inputError.password) {
      setFormError(inputError);
      return;
    }

    setFormError({ id: "", password: "" });
    
    axios
      .post("http://localhost:8000/api/user_login", loginPost)
      .then((response) => {
        const token = response.data.token;
        const userId = response.data.user.id;
        const userRole = response.data.user.role;
        Cookies.set("token", token);
        Cookies.set("userId", userId);
        Cookies.set("email", response.data.user.email);
        if( response.data.photo === null){
          Cookies.set("name", response.data.user.name);
           Cookies.set("photo", null);
        }
        else{
          Cookies.set("photo", response.data.user.image);
        }
        console.log("User Image:", response.data.user.image);
        Cookies.set("userRole", userRole);
        console.log("Login successful:", response.data);
        if(response.data.user.first_login===1){
          navigate("/updateProfile");
        }
        else{
          navigate("/forumMainPage");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          setFormError({
            id: "Invalid email or password",
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
        console.error("Validation errors:", error.response.data.errors);
      });
  };

  const handleResetPasswordSubmit = (event) => {
    event.preventDefault();
    let inputError = { password: "", password_confirmation: "" };
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");
    console.log("Token:", token);
    console.log("Email:", email);
  
    if (!resetPassPost.password) {
      inputError.password = "* Password is required";
    }
  
    if (!resetPassPost.password_confirmation) {
      inputError.password_confirmation = "* Confirm Password is required";
    }
  
    if (
      resetPassPost.password &&
      resetPassPost.password_confirmation &&
      resetPassPost.password !== resetPassPost.password_confirmation
    ) {
      inputError.password = "* Passwords do not match";
      inputError.password_confirmation = "* Passwords do not match";
    }
  
    // If there are any errors, show them and stop submission
    if (inputError.password || inputError.password_confirmation) {
      setFormResetError(inputError);
      return;
    }
  
    // Clear previous errors
    setFormResetError({ password: "", password_confirmation: "" });
    setIsSubmitting(true);

    // Make the API call to reset the password
    axios
      .post("http://localhost:8000/api/reset_password", {
        email: email,
        token: token,
        password: resetPassPost.password,
        password_confirmation: resetPassPost.password_confirmation,
      })
      .then((response) => {
        console.log("Password reset response:", response.data);
        alert("Password reset successfully");
        navigate("/forumMainPage");
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        if (error.response && error.response.status === 422) {
          console.error("Validation errors:", error.response.data.errors);
          setFormResetError(error.response.data.errors);
        } else {
          console.error("There was an error resetting the password!", error);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  
    
  };
  

  return (
    <div className="relative min-h-screen">
      <div className="h-72 w-full bg-blue-900"></div>
      {currentForm === "resetPassword" ?(
        <div className="absolute top-7 left-20 text-white text-5xl font-extrabold">Reset Password</div>
      ):(
        <div className="absolute top-7 left-20 text-white text-5xl font-extrabold">Login Page</div>
      )

      }
    <div className="flex justify-center my-10 absolute top-72 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
          <div className="w-[320px] p-10 flex flex-col justify-center bg-white">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
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
                  User Id
                </label>
                <input
                  name="id"
                  type="id"
                  placeholder="Enter your user Id"
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
                Login
              </button>
            </form>
          </div>
        )}

        {currentForm === "forgotPassword" && (
          <div className="w-[320px] p-10 flex flex-col justify-center bg-white">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Request Link
              </h1>
              <p className="text-gray-600">
                Enter your email to receive a link reset password
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
                Request OTP Link
              </button>
            </form>
          </div>
        )}

{currentForm === "resetPassword" && (
  <div className="w-[320px] p-10 flex flex-col justify-center bg-white">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Reset Password
      </h1>
      <p className="text-gray-600">Enter your new password</p>
    </div>

    <form className="space-y-6" onSubmit={handleResetPasswordSubmit}>
      {/* New Password Field */}
      <div className="flex flex-col">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          New Password
        </label>
        <div className="relative">
          <input
            name="password"
            type={resetPassVisible ? "text" : "password"}
            placeholder="Enter new password"
            value={resetPassPost.password}
            onChange={handleInput}
            className={`h-11 w-full px-4 py-3 border text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10 ${
              formResetError.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span
            onClick={toggleResetPassVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
          >
            {resetPassVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        {formResetError.password && (
          <p className="text-red-600 text-xs mt-1">
            {formResetError.password}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="flex flex-col">
        <label
          htmlFor="password_confirmation"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            name="password_confirmation"
            type={resetPassConfirmVisible ? "text" : "password"}
            placeholder="Confirm new password"
            value={resetPassPost.password_confirmation}
            onChange={handleInput}
            className={`h-11 w-full px-4 py-3 border text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10 ${
              formResetError.password_confirmation ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span
            onClick={toggleResetPassConfirmVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
          >
            {resetPassConfirmVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        {formResetError.password_confirmation && (
          <p className="text-red-600 text-xs mt-1">
            {formResetError.password_confirmation}
          </p>
        )}
      </div>

      <button
  type="submit"
  disabled={isSubmitting}
  className={`h-11 w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition duration-200 transform hover:scale-[1.01] ${
    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  {isSubmitting ? "Processing..." : "Reset Password"}
</button>
    </form>
  </div>
)}
      </div>
    </div>
    </div>
  );
}
