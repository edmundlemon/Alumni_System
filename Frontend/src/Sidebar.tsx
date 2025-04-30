import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FiHome,
  FiDatabase,
  FiCompass,
  FiCpu,
  FiBook,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";

export default function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Genesis");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

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
      sessionStorage.setItem("logoutInitiated", "true");
      navigate("/adminLogin");
    })
    .catch((error) => {
      console.error("Logout error:", error);
      Cookies.remove("adminToken");
      navigate("/adminLogin");
    });
  };

  const mainMenuItems = [
    {
      section: "",
      items: [
        { name: "Genesis", icon: <FiDatabase /> },
        { name: "Explorer", icon: <FiCompass /> },
        { name: "Quantum", icon: <FiCpu /> },
      ],
    },
    {
      section: "Documentation",
      items: [
        { name: "Introduction", icon: <FiBook /> },
        { name: "Get Started", icon: <FiHome /> },
      ],
    },
  ];

  const profileMenuItems = [
    { name: "Account", icon: <FiUser /> },
    { name: "Add Admin", icon: <GrUserAdmin /> },
    { name: "Log out", icon: <FiLogOut /> },
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!collapsed && (
          <h1 className="text-lg font-semibold tracking-wide">MMU ALUMNI</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {collapsed ? (
            <FiChevronRight size={18} />
          ) : (
            <FiChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto">
        {mainMenuItems.map((section, index) => (
          <div key={index} className="mt-4">
            {!collapsed && section.section && (
              <h2 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {section.section}
              </h2>
            )}
            <ul className="space-y-1">
              {section.items.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => setActiveItem(item.name)}
                    className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-all ${
                      activeItem === item.name
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Profile Section */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={toggleProfileMenu}
          className={`flex items-center w-full rounded-lg p-2 hover:bg-gray-800 transition-all ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              S
            </div>
            {!collapsed && (
              <div className="ml-3 text-left">
                <p className="text-sm font-medium">shadcn</p>
                <p className="text-xs text-gray-400">m@example.com</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <span className="text-gray-400">
              {showProfileMenu ? <FiChevronUp /> : <FiChevronDown />}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        {showProfileMenu && !collapsed && (
          <ul className="mt-2 space-y-1">
            {profileMenuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-md transition-colors ${
                    activeItem === item.name
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
