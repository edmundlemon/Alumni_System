import { useState } from "react";
import { useNavigate  } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

export default function AdminLogin() {
    const navigate = useNavigate ();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loginPost, setLoginPost] = useState({ id: "", password: "" });
    const [formError, setFormError] = useState({ id: "", password: "" });

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleInput = (event) => {
        setLoginPost({ ...loginPost, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let inputError = { id: "", password: "" };

        if (!loginPost.id) inputError.id = "* id is required";
        if (!loginPost.password) inputError.password = "* Password is required";
        // else if (loginPost.password.length < 6) inputError.password = "* Password must be at least 6 characters";
        // else if (!/[A-Z]/.test(loginPost.password)) inputError.password = "* Password must contain at least one uppercase letter";
        // else if (!/[0-9]/.test(loginPost.password)) inputError.password = "* Password must contain at least one number";
        // else if (!/[!@#$%^&*]/.test(loginPost.password)) inputError.password = "* Password must contain at least one special character";
        // else if (!/[a-z]/.test(loginPost.password)) inputError.password = "* Password must contain at least one lowercase letter";
        // else if (/\s/.test(loginPost.password)) {inputError.password = "* Password cannot contain spaces";}

        if (inputError.id || inputError.password) {
            setFormError(inputError);
            return;
        }

        setFormError({ id: "", password: "" });

        axios.post('http://localhost:8000/api/admin_login', loginPost)
        .then(response => {
            console.log(response);
            const token = response.data.token; 
                Cookies.set('adminToken', token); 
                console.log(token);
                navigate('/userTable');
        })
        .catch(error => {
            console.log(error);
            if (error.response.status === 401) {
                setFormError({ email: 'Invalid email or password', password: 'Invalid email or password' });
            }
        });
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-cyan-100">
            <div className="w-[350px] max-w-md bg-white shadow-xl rounded-xl p-8">
                <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                            Admin ID
                        </label>
                        <input
                            type="text"
                            name="id"
                            value={loginPost.id}
                            onChange={handleInput}
                            className={`w-full border ${
                                formError.id ? "border-red-500" : "border-gray-300"
                            } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
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
                                className={`w-full border ${
                                    formError.password ? "border-red-500" : "border-gray-300"
                                } rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
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
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-md transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </section>
    );
}
