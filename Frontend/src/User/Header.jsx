import { useNavigate, Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import MMULOGO from "../assets/MMULOGO.png";
import { useRef } from "react";

function Header() {
  const menuRef = useRef();
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = Cookies.get("token");
  const [logInOut, setLogInOut] = useState("Login");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedMobileItem, setClickedMobileItem] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const userRole = Cookies.get("userRole");
  const getInitial = (name = "") => name.charAt(0).toUpperCase();
  const [showRequestOTP, setShowRequestOTP] = useState(false);
  const [resetPassPost, setResetPassPost] = useState({ email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const userEmail = Cookies.get("email");
  const userId = Cookies.get("userId");
  const [userProfile, setUserProfile] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);

  const navItems = [
    { name: "Home", path: "/mainPage" },
    { name: "Donation", path: "/donationMainPage" },
    {
      name: "Events",
      path: "/eventMainPage",
      dropdown: [
        { name: "Register Events", path: "/viewEvent" },
        ...(userRole === "alumni"
          ? [{ name: "Create New Events", path: "/addEvent" },{ name: "View Create Events", path: "/viewCreateEvent" }]
          : []),
      ],
    },
    { name: "Forum", path: "/forumMainPage" },
    {
      name: "Alumni",
      path: "/alumniMainPage",
      dropdown: [{ name: "Connect Status", path: "/connectStatus" }],
    },
  ];


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    setLogInOut(token ? "Log Out" : "Login");
    if (token) {
      setProfileLoading(true);
      axios
        .get(`http://localhost:8000/api/view_user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((response) => {
          setUserProfile(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        })
        .finally(() => setProfileLoading(false));
    } else {
      setProfileLoading(false);
    }
  }, [token]);

  const handleLoginLogout = () => {
    if (token) {
      axios
        .post("http://localhost:8000/api/user_logout", null, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then(() => {
          Cookies.remove("token");
          navigate("/userLogin");
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    }
    Cookies.remove("token");
    navigate("/userLogin");
  };

  const handleResetSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!resetPassPost.email) {
      setError("Email is required.");
      return;
    }

    if (resetPassPost.email !== userEmail) {
      setError("Email does not match with registered email.");
      return;
    }
    axios
      .post("http://localhost:8000/api/forgot_password", {
        email: resetPassPost.email,
      })
      .then((response) => {
        setMessage("OTP sent to your email.");
        setError("");
        setResetPassPost({ email: "" });
      })
      .catch((error) => {
        const apiError =
          error.response?.data?.errors?.email?.[0] || "Failed to send OTP.";
        setError(apiError);
        setMessage("");
      });
  };

  return (
    <>
      <nav className="bg-gray-100 backdrop-blur-md shadow-md sticky top-0 z-50 px-4 lg:px-20">
        <div className="flex items-center justify-between py-3">
          {/* Logo Section */}
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              className="h-[65px] w-[65px] hover:shadow-lg rounded-full transition duration-300"
              src={MMULOGO}
              alt="MMU Logo"
            />
            <div className="bg-gray-300 w-px h-14"></div>
            <div className="text-center transform hover:scale-105 transition-transform duration-200">
              <p className="text-2xl font-semibold leading-tight tracking-tight">
                MMU
              </p>
              <p className="text-2xl font-semibold tracking-wider">ALUMNI</p>
            </div>
          </div>

          {/* Hamburger Toggle */}
          <button
            className="lg:hidden text-gray-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className="relative"
                  onMouseEnter={() =>
                    item.dropdown && setHoveredItem(item.name)
                  }
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => navigate(item.path)}
                      className={`relative flex items-center gap-1 font-medium text-lg transition-colors duration-200
                                            ${
                                              location.pathname.startsWith(
                                                item.path
                                              )
                                                ? "text-blue-900 after:w-full"
                                                : "hover:text-blue-900 text-gray-800"
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-900 
                                            after:transition-all after:duration-300 hover:after:w-full`}
                    >
                      {item.name}
                      {item.dropdown && (
                        <FiChevronDown
                          className={`transition-transform duration-200 ${
                            hoveredItem === item.name
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {item.dropdown && hoveredItem === item.name && (
                      <div
                        className="absolute top-full left-0 pt-2"
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <ul className="bg-white shadow-lg rounded-md py-1 w-48 animate-fade-in">
                          {item.dropdown.map((drop) => (
                            <li key={drop.name}>
                              <Link
                                to={drop.path}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => setHoveredItem(null)}
                              >
                                {drop.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {token ? (
              // Profile Avatar Dropdown
              <div className="relative">
                <button
                  ref={buttonRef}
                  className="flex items-center focus:outline-none"
                  onMouseEnter={() => setProfileMenuOpen(true)}
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                >
                  {profileLoading ? (
                    <div className="w-11 h-11 rounded-full bg-blue-900 flex items-center justify-center" />
                  ) : userProfile.image === null ? (
                    <div className="w-11 h-11 rounded-full bg-blue-900 flex items-center justify-center text-white text-2xl font-semibold">
                      {getInitial(userProfile.name)}
                    </div>
                  ) : (
                    <img
                      src={userProfile.image}
                      alt="Profile"
                      className="w-11 h-11 rounded-full border-2 border-blue-300 object-cover"
                    />
                  )}
                </button>

                {profileMenuOpen && (
                  <div
                    onMouseLeave={() => setProfileMenuOpen(false)}
                    className="absolute right-0 mt-4 w-48 border border-gray-200 bg-white rounded-md shadow-lg py-1 z-50"
                    ref={menuRef}
                  >
                    {/* Dropdown arrow */}
                    <div className="absolute -top-2 right-3 w-4 h-4 bg-white transform rotate-45"></div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate("/updateProfile");
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate("/updateProfile");
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      >
                        Update Profile
                      </button>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          setShowRequestOTP(true);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      >
                        Forgot Password
                      </button>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLoginLogout();
                      }}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  handleLoginLogout();
                  setMenuOpen(false);
                }}
                className="w-full px-6 py-2.5 bg-blue-900 text-lg text-white font-bold rounded-lg hover:bg-blue-800 transition duration-300 shadow-md"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden pb-4 animate-slide-down">
            <ul className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  {!item.dropdown ? (
                    <Link
                      to={item.path}
                      className="block px-3 py-2 text-gray-700 font-medium text-lg hover:bg-blue-50 rounded-lg"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          if (clickedMobileItem === item.name) {
                            navigate(item.path);
                            setClickedMobileItem(null);
                            setMenuOpen(false);
                          } else {
                            setClickedMobileItem(item.name);
                          }
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 text-gray-700 font-medium text-lg hover:bg-blue-50 rounded-lg"
                      >
                        <span>{item.name}</span>
                        <FiChevronDown
                          className={`transition-transform duration-200 ${
                            clickedMobileItem === item.name
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {clickedMobileItem === item.name && (
                        <ul className="ml-4 space-y-1">
                          {item.dropdown.map((drop) => (
                            <li key={drop.name}>
                              <Link
                                to={drop.path}
                                className="block px-3 py-2 text-gray-600 hover:bg-blue-50 rounded-lg"
                                onClick={() => {
                                  setMenuOpen(false);
                                  setClickedMobileItem(null);
                                }}
                              >
                                {drop.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    handleLoginLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300 shadow-md"
                >
                  {logInOut}
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
      {showRequestOTP && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60">
          <form
            onSubmit={handleResetSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h2 className="text-xl font-semibold mb-2">
              Request Reset Password Link
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Enter your email to receive a reset link.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={resetPassPost.email}
              onChange={(e) =>
                setResetPassPost({ ...resetPassPost, email: e.target.value })
              }
              className={`w-full p-2 border rounded mb-1 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {message && (
              <p className="text-green-600 text-sm mb-2">{message}</p>
            )}

            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowRequestOTP(false);
                  setError("");
                  setMessage("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
              >
                Send Link
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Header;
