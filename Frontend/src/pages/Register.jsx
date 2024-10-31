import React from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: "",
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
      return;
    }
    setEmailError("");
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error("Please enter a valid name", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        formData
      );

      if (response.data.success) {
        toast.success("Registration successful! Please login.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-12 lg:p-20 w-full max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative">
            {/* Left side - Welcome message */}
            <div className="flex-1 w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-2xl lg:text-4xl font-bold text-[#357588] mb-4 lg:mb-6">
                Welcome to Oren
              </h1>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                Start your sustainability journey with Oren. Create an account to access
                our comprehensive tools and resources designed to help your business
                achieve its sustainability goals.
              </p>
            </div>

            {/* Horizontal dotted line for small screens */}
            <div className="w-full lg:hidden">
              <div className="border-t border-gray-300 border-dashed"></div>
            </div>

            {/* Vertical dotted line separator */}
            <div className="hidden lg:block absolute h-full w-px right-1/2 top-0">
              <div className="h-full border-l border-gray-300 border-dashed"></div>
            </div>

            {/* Right side - Registration form */}
            <div className="flex-1 w-full lg:w-1/2 max-w-md">
              <div>
                <h2 className="mt-6 text-center text-xl lg:text-3xl font-bold text-gray-900">
                  Create your account
                </h2>
              </div>
              <form className="mt-6 lg:mt-8 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Name Input */}
                  <div className="relative">
                    <label htmlFor="name" className="sr-only">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-[#357588] focus:z-10 sm:text-sm"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Email Input */}
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

                  {/* Password Input */}
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
                      placeholder="Create a password"
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

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#357588] hover:bg-[#2c6274] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#357588] disabled:opacity-50"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="font-medium text-[#357588] hover:text-[#2c6274] focus:outline-none"
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
