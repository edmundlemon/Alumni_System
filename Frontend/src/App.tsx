import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Login from "./Login";
import AdminLogin from "./AdminLogin";
import UserProfile from "./UserProfile";
import Sidebar from "./Sidebar";

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
