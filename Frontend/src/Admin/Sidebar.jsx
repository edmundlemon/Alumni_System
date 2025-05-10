import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiMenuAlt3,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCog,
} from "react-icons/hi";
import {
  MdOutlineDashboard,
  MdOutlineMessage,
  MdStorage,
  MdOutlineBusiness,
} from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import axios from "axios";
import Cookies from "js-cookie";
import UserManageTable from "./UserManageTable";

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowProfileMenu(false);
    }
  }, [open]);

  const menus = [
    { name: "Dashboard", link: "/AdminDashboard", icon: MdOutlineDashboard },
    { name: "User Manage", link: "/jobSeekerTable", icon: HiOutlineUser },
    { name: "Event", link: "/employerTable", icon: MdOutlineBusiness },
    { name: "Donation", link: "/adminTable", icon: TbReportAnalytics },
    { name: "Forum", link: "/categoryTable", icon: MdStorage },
    { name: "Review", link: "/reviewTable", icon: MdOutlineMessage },
  ];

  const handleLogout = () => {
    const token = Cookies.get("adminToken");
  
    axios.post("http://localhost:8000/api/admin_logout", null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      console.log(response.data);
      Cookies.remove("adminToken");
      navigate("/adminLogin");
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
  };

  const profileMenus = [
    { name: "Settings", link: "/settings", icon: HiOutlineCog },
    { name: "Log Out", action: handleLogout, icon: HiOutlineLogout },
  ];

  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
        <div
            className={`bg-[#212F3C] flex flex-col justify-between transition-all duration-200 ease-linear ${
              open ? "w-64" : "w-16"
            } text-gray-100 my-3 rounded-tr-xl rounded-br-xl shadow-xl overflow-hidden`}
            aria-label="Main navigation"
          >

        <div>
          {/* Header */}
          <div className="p-4 flex justify-between items-center ">
            {open && (
              <h1 className="text-xl font-bold text-white" aria-label="MMUJOB Logo">
                MMU ALUMNI
              </h1>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="cursor-pointer hover:text-gray-300 transition-colors"
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              <HiMenuAlt3 size={24} className="ml-1" />
            </button>
          </div>

          {/* Main Menu */}
          <nav className="mt-4 px-2 space-y-1" aria-label="Primary navigation">
          {menus.map((menu, index) => (
          <Link
            to={menu.link}
            key={index}
            onClick={() => setActiveMenu(menu.name)}
            className={`relative group flex items-center p-3 rounded-lg transition-all duration-200 ease-linear ${
              activeMenu === menu.name
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <span className="text-xl pl-[2px]">
                    {React.createElement(menu.icon, {
                      "aria-hidden": true,
                    })}
                  </span>
                  {/* Menu text when expanded */}
                  <span
                    className={`ml-3 whitespace-nowrap transition-all duration-200 ease-linear ${
                      open ? "opacity-100" : "opacity-0 w-0"
                    }`}
                  >
                    {menu.name}
                  </span>

                  {/* Tooltip on hover when collapsed */}
                  {!open && (
                    <span
                      className="absolute left-full ml-2 px-3 py-1 text-sm bg-white text-gray-900 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 whitespace-nowrap z-50"
                      role="tooltip"
                    >
                      {menu.name}
                    </span>
                  )}
                </Link>
              ))}

          </nav>
        </div>

        {/* Profile Section */}
        <div className="p-3 border-t border-gray-700">
          <div
            onClick={() => open && setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-all duration-200 ease-linear ${
              open ? "justify-between" : "justify-center"
            } `}
            aria-expanded={showProfileMenu}
            aria-controls="profile-menu"
          >
           <div
              className={`flex items-center ${
                open ? "" : "justify-center "
              }`}
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium border border-gray-500">
                A
              </div>
              {open && (
                <div className="ml-3 transition-all duration-200 ease-linear overflow-hidden">
                  <p className="text-sm font-medium whitespace-nowrap">Admin</p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
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
            id="profile-menu"
            className={`overflow-hidden transition-all duration-200 ease-linear ${
              showProfileMenu && open
                ? "max-h-40 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-2 pl-6 border-l border-gray-600 space-y-1">
              {profileMenus.map((menu, index) =>
                menu.action ? (
                  <button
                    key={index}
                    onClick={menu.action}
                    className="flex items-center w-full p-2 text-sm rounded-lg hover:bg-gray-800 transition-colors "
                  >
                    <span className="text-lg">
                      {React.createElement(menu.icon, {
                        "aria-hidden": true,
                      })}
                    </span>
                    <span className="ml-3">{menu.name}</span>
                  </button>
                ) : (
                  <Link
                    to={menu.link}
                    key={index}
                    className="flex items-center p-2 text-sm rounded-lg hover:bg-gray-800 transition-colors "
                  >
                    <span className="text-lg">
                      {React.createElement(menu.icon, {
                        "aria-hidden": true,
                      })}
                    </span>
                    <span className="ml-3">{menu.name}</span>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 m-4 ">
        <UserManageTable></UserManageTable>
      </div>
    </div>
  );
};

export default Sidebar;