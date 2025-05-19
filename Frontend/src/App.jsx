// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./User/Header";
import Login from "./User/Login";
import AdminLogin from "./Admin/AdminLogin";
import UserProfile from "./Admin/UserProfile";
import Sidebar from "./Admin/Sidebar";
import UserManageTable from "./Admin/UserManageTable";
import AddUser from "./Admin/AddUser";
import MainPage from "./User/MainPage";
import ViewEvent from "./User/Event/ViewRegisterEvent";
import EventMainPage from "./User/Event/EventMainPage";
import ViewEventDetails from "./User/Event/ViewEventDetails";
import ForumMainPage from "./User/Forum/ForumMainPage";
import DonationMainPage from "./User/Donation/DonationMainPage";
import RazorPay from "./User/Donation/RazorPay";
import ViewDonateDetails from "./User/Donation/viewDonateDetails";

function AppRoutes() {
  const location = useLocation();

  // Only show header on these paths:
  const showHeader = ["/userLogin", "/mainPage", "/eventMainPage","/viewEventDetails", 
    "/forumMainPage","/donationMainpage","/viewDonateDetails"].includes(location.pathname);

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
        <Route path="/reset-password" element={<Login initialForm="resetPassword" />} />
        <Route path="/viewEvent" element={<ViewEvent />} />
        <Route path="/eventMainPage" element={<EventMainPage />} />
        <Route path="/viewEventDetails" element={<ViewEventDetails />} />
        <Route path="/forumMainPage" element={<ForumMainPage />} />
        <Route path="/donationMainPage" element={<DonationMainPage />} />
        <Route path="/razorpay" element={<RazorPay />} />
        <Route path="/viewDonateDetails" element={<ViewDonateDetails />} />
        {/* 404 Not Found */}
        <Route
          path="/403"
          element={
            <div className="flex justify-center items-center h-[100vh]">
              <h1 className="text-2xl">403 Forbidden</h1>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
