import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./User/Header";
import Login from "./User/Login";
import AdminLogin from "./Admin/AdminLogin";
import UserProfile from "./Admin/UserProfile";
import Sidebar from "./Admin/Sidebar";
import UserManageTable from "./Admin/UserManageTable";
import AddUser from "./Admin/AddUser";
import MainPage from "./User/MainPage";

function AppRoutes() {
  const location = useLocation();
  const showHeader = ["/userLogin", "/mainPage"].includes(location.pathname);

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
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/403" element={
          <div className="flex justify-center items-center h-[100vh]">
            <h1 className="text-2xl">403 Forbidden</h1>
          </div>
        } />
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
