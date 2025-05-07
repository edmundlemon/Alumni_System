import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./User/Header";
import Login from "./User/Login";
import AdminLogin from "./Admin/AdminLogin";
import UserProfile from "./Admin/UserProfile";
import Sidebar from "./Admin/Sidebar";
import UserManageTable from "./Admin/UserManageTable";

function AppRoutes() {
  const location = useLocation();

  const showHeader = location.pathname === "/userLogin"; 

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/userLogin" replace />} />
        <Route path="/userLogin" element={<Login />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/userManageTable" element={<UserManageTable />} />
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
