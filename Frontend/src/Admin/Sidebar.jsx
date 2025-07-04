import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiOutlineLogout, HiOutlineCog } from "react-icons/hi";
import {
  MdOutlineDashboard,
  MdOutlineMessage,
  MdStorage,
} from "react-icons/md";
import { BiDonateHeart } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import axios from "axios";
import Cookies from "js-cookie";
import { ImSpinner2 } from "react-icons/im";
import { TbBrandDatabricks } from "react-icons/tb";
import { IoMdBrowsers } from "react-icons/io";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const token = Cookies.get("adminToken");
  const userToken = Cookies.get("token");

  useEffect(() => {
    if (!open) {
      setShowProfileMenu(false);
    }
  }, [open]);

  const menus = [
    { name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard },
    { name: "User Manage", link: "/userTable", icon: LuUsers },
    { name: "Event", link: "/eventTable", icon: FaRegCalendarAlt },
    { name: "Donation", link: "/donationTable", icon: BiDonateHeart },
    { name: "Forum", link: "/forumTable", icon: MdOutlineMessage },
    { name: "Major", link: "/majorTable", icon: MdStorage },
    { name: "Faculty", link: "/facultyTable", icon: TbBrandDatabricks },
    {
      name: "User Portal",
      link: userToken ? "/forumMainPage" : "/userLogin",
      icon: IoMdBrowsers,
    },
  ];

  // Find the menu whose link matches the current path
  const currentMenu =
    menus.find((menu) => location.pathname.startsWith(menu.link))?.name ||
    "Dashboard";

  const handleLogout = () => {
    setLoggingOut(true); // Start loading
    axios
      .post("http://localhost:8000/api/admin_logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        console.error("Logout error:", error);
        Cookies.remove("adminToken");
        navigate("/adminLogin");
        if (error.response && error.response.status === 401) {
          console.warn("Token invalid or already logged out.");
        } else {
          alert("Logout failed, please try again.");
          return; // Don't proceed to navigate
        }
      })
      .finally(() => {
        setLoggingOut(false); // Stop loading
      });
    Cookies.remove("adminToken");
    navigate("/adminLogin");
  };

  const profileMenus = [
    { name: "Settings", link: "/settings", icon: HiOutlineCog },
    { name: "Log Out", action: handleLogout, icon: HiOutlineLogout },
  ];

  // Update activeMenu when the path changes
  useEffect(() => {
    setActiveMenu(currentMenu);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <div
        className={`bg-gray-200 flex flex-col justify-between transition-all duration-200 ease-linear ${
          open ? "w-64" : "w-16"
        } text-gray-800 my-3 ml-3 rounded-xl border border-gray-200`}
      >
        <div>
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-gray-400">
            {open && (
              <h1 className="text-xl font-bold text-gray-800">MMU ALUMNI</h1>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="cursor-pointer hover:text-gray-500 transition-colors"
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              <HiMenuAlt3 size={24} />
            </button>
          </div>

          {/* Main Menu */}
          <nav className="mt-4 px-2 space-y-1">
            {menus.map((menu, index) => (
              <Link
                to={menu.link}
                key={index}
                onClick={() => setActiveMenu(menu.name)}
                onMouseEnter={() => setHoveredMenu(menu.name)}
                onMouseLeave={() => setHoveredMenu(null)}
                className={`relative group flex items-center p-3 rounded-lg transition-all duration-200 ease-linear ${
                  activeMenu === menu.name
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="text-xl pl-[2px]">
                  {React.createElement(menu.icon, { "aria-hidden": true })}
                </span>

                <span
                  className={`ml-3 whitespace-nowrap transition-all duration-200 ease-linear ${
                    open ? "opacity-100" : "opacity-0 w-0"
                  }`}
                >
                  {menu.name}
                </span>

                {/* Tooltip */}
                {!open && hoveredMenu === menu.name && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50">
                    <div className="px-3 py-1 text-sm bg-white text-gray-900 rounded shadow-lg border border-gray-300 whitespace-nowrap">
                      {menu.name}
                      <div className="absolute right-full top-1/2 -mt-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent"></div>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Profile Section */}
        <div className="p-3 border-t border-gray-400">
          <div
            onClick={() => open && setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-linear ${
              open ? "justify-between" : "justify-center"
            }`}
          >
            <div
              className={`flex items-center ${open ? "" : "justify-center"}`}
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium border border-gray-400">
                A
              </div>
              {open && (
                <div className="ml-3 transition-all duration-200 ease-linear overflow-hidden">
                  <p className="text-sm font-medium whitespace-nowrap">Admin</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    admin@example.com
                  </p>
                </div>
              )}
            </div>
            {open && (
              <span className="text-gray-400 transition-transform">
                {showProfileMenu ? "↑" : "↓"}
              </span>
            )}
          </div>

          {/* Profile Dropdown */}
          <div
            className={`overflow-hidden transition-all duration-200 ease-linear ${
              showProfileMenu && open
                ? "max-h-40 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-2 pl-6 border-l border-gray-400 space-y-1">
              {profileMenus.map((menu, index) =>
                menu.action ? (
                  <button
                    key={index}
                    onClick={menu.action}
                    disabled={loggingOut}
                    className={`flex items-center w-full p-2 text-sm rounded-lg transition-colors text-gray-700 ${
                      loggingOut
                        ? "bg-gray-100 cursor-not-allowed opacity-70"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">
                      {React.createElement(menu.icon, { "aria-hidden": true })}
                    </span>
                    <span className="ml-3 flex items-center">
                      {loggingOut ? (
                        <>
                          <ImSpinner2 className="animate-spin mr-2" />
                          Logging out...
                        </>
                      ) : (
                        menu.name
                      )}
                    </span>
                  </button>
                ) : (
                  <Link
                    to={menu.link}
                    key={index}
                    className="flex items-center p-2 text-sm rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                  >
                    <span className="text-lg">
                      {React.createElement(menu.icon, { "aria-hidden": true })}
                    </span>
                    <span className="ml-3">{menu.name}</span>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 m-4 rounded-md ">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
