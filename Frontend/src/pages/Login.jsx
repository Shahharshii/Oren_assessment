import React from "react";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      toast.error("Please enter a valid email address", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setEmailError("");
    
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        formData
      );

      if (response.data.token) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        //await new Promise(resolve => setTimeout(resolve, 3000));
        
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(`${errorMessage}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-12 lg:p-28 w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative">
          {/* Left side - Welcome message */}
          <div className="flex-1 w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-2xl lg:text-4xl font-bold text-[#357588] mb-4 lg:mb-6">
              Welcome to Oren
            </h1>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
              We make sustainability simple and accessible to all businesses. At
              Oren, Sustainability means meeting the needs of today without
              compromising on the ability of the future generations to meet
              their needs.
            </p>
          </div>

          {/* Horizontal dotted line for small screens */}
          <div className="w-full lg:hidden">
            <div className="border-t border-gray-300 border-dashed"></div>
          </div>

          {/* Vertical dotted line separator - only visible on lg screens and up */}
          <div className="hidden lg:block absolute h-full w-px right-1/2 top-0">
            <div className="h-full border-l border-gray-300 border-dashed"></div>
          </div>

          {/* Right side - Login form */}
          <div className="flex-1 w-full lg:w-1/2 max-w-md">
            <div>
              <h2 className="mt-6 text-center text-xl lg:text-3xl font-bold text-gray-900">
                Login to your account
              </h2>
            </div>
            <form
              className="mt-6 lg:mt-8 space-y-4 lg:space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="space-y-4 lg:space-y-6">
                <div className="relative">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                      emailError ? "border-red-500" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-[#357588] focus:z-10 sm:text-sm`}
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  {emailError && (
                    <p className="mt-2 text-sm text-red-600">{emailError}</p>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-[#357588] focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#357588] hover:bg-[#2c6274] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#357588] disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
