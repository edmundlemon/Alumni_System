import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
import { ImSpinner2 } from "react-icons/im";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loginPost, setLoginPost] = useState({ id: "", password: "" });
    const [formError, setFormError] = useState({ id: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleInput = (event) => {
        setLoginPost({ ...loginPost, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
    event.preventDefault();

    let inputError = { id: "", password: "" };

    if (!loginPost.id) inputError.id = "* Admin ID is required";
    if (!loginPost.password) inputError.password = "* Password is required";

    if (inputError.id || inputError.password) {
        setFormError(inputError);
        return;
    }

    setFormError({ id: "", password: "" });
    setIsSubmitting(true); // Start loading

    axios
        .post("http://localhost:8000/api/admin_login", loginPost)
        .then((response) => {
            const token = response.data.token;
            Cookies.set("adminToken", token);
            navigate("/dashboard");
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                setFormError({
                    id: "Invalid ID or password",
                    password: "Invalid ID or password",
                });
            } else {
                console.error("Login error:", error);
            }
        })
        .finally(() => {
            setIsSubmitting(false); // End loading
        });
};


    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-cyan-100 via-blue-100 to-blue-200">
            <div className="w-full max-w-sm bg-white shadow-2xl rounded-2xl p-8 sm:p-10 animate-fade-in">
                <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-md">
                        <MdOutlineAdminPanelSettings    className="text-4xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-700 mt-4">Admin Login</h1>
                    <p className="text-base font-light text-gray-500">Welcome back! Please log in.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="id" className="block text-sm font-medium text-gray-600 mb-1">
                            Admin ID
                        </label>
                        <input
                            type="text"
                            name="id"
                            value={loginPost.id}
                            onChange={handleInput}
                            placeholder="Enter your admin ID"
                            className={`w-full border ${
                                formError.id ? "border-red-500" : "border-gray-300"
                            } rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                                formError.id ? "focus:ring-red-400" : "focus:ring-cyan-500"
                            }`}
                        />
                        {formError.id && <p className="text-red-500 text-xs mt-1">{formError.id}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                value={loginPost.password}
                                onChange={handleInput}
                                placeholder="Enter your password"
                                className={`w-full border ${
                                    formError.password ? "border-red-500" : "border-gray-300"
                                } rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 ${
                                    formError.password ? "focus:ring-red-400" : "focus:ring-cyan-500"
                                }`}
                            />
                            <span
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                            >
                                {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
                            </span>
                        </div>
                        {formError.password && <p className="text-red-500 text-xs mt-1">{formError.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 font-bold rounded-md transition duration-300 shadow-md flex justify-center items-center ${
                            isSubmitting
                                ? "bg-cyan-400 cursor-not-allowed"
                                : "bg-cyan-500 hover:bg-cyan-600 text-white"
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <ImSpinner2 className="animate-spin mr-2" />
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}
