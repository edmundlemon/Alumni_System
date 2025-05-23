// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./User/Header";
import Login from "./User/Login";
import AdminLogin from "./Admin/AdminLogin";
import UserProfile from "./Admin/UserProfileTable";
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
import AlumniMainPage from "./User/Alumni/AlumniMainPage";
import AddEvent from "./User/Event/AddEvent";
import DonateNow from "./User/Donation/DonateNow";
import Footer from "./User/Footer";
import TermAndCondition from "./User/footer/TermOfUse";
import ContactUs from "./User/footer/ContactUs";
import Policy from "./User/footer/Policy";
import ViewProfile from "./User/Alumni/ViewProfile";
import UpdateProfile from "./User/UpdateProfile";
import EventTable from "./Admin/EventTable";
import ForumTable from "./Admin/ForumTable";
import DonationTable from "./Admin/DonationTable";
import MajorTable from "./Admin/MajorTable";
import CommentTable from "./Admin/CommentTable";

function AppRoutes() {
  const location = useLocation();

  // Only show header on these paths:
  const hideHeader = [
    "/userTable",
    "/eventTable",
    "/forumTable",
    "/donationTable",
    "/adminLogin",
    "/commentTable",
    "/majorTable",
    "/403",
  ].includes(location.pathname);
  const hideFooter = [
    "/userTable",
    "/eventTable",
    "/forumTable",
    "/donationTable",
    "/adminLogin",
    "/forumMainPage",
    "/commentTable",
    "/majorTable",
    "/403"
  ].includes(location.pathname);
  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/userLogin" replace />} />
        <Route path="/userLogin" element={<Login />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/userManageTable" element={<UserManageTable />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route
          path="/reset-password"
          element={<Login initialForm="resetPassword" />}
        />
        <Route path="/viewEvent" element={<ViewEvent />} />
        <Route path="/eventMainPage" element={<EventMainPage />} />
        <Route path="/viewEventDetails" element={<ViewEventDetails />} />
        <Route path="/forumMainPage" element={<ForumMainPage />} />
        <Route path="/donationMainPage" element={<DonationMainPage />} />
        <Route path="/razorpay" element={<RazorPay />} />
        <Route path="/viewDonateDetails" element={<ViewDonateDetails />} />
        <Route path="/alumniMainPage" element={<AlumniMainPage />} />
        <Route path="/viewProfile" element={<ViewProfile />} />
        <Route path="/addEvent" element={<AddEvent />} />
        <Route path="/donateNow" element={<DonateNow />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/termAndCondition" element={<TermAndCondition />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route element={<Sidebar />}>
          <Route path="/userTable" element={<UserManageTable />} />
          <Route path="/eventTable" element={<EventTable />} />
          <Route path="/forumTable" element={<ForumTable />} />
          <Route path="/donationTable" element={<DonationTable />} />
          <Route path="/majorTable" element={<MajorTable />} />
          <Route path="/commentTable" element={<CommentTable />} />
        </Route>
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
      {!hideFooter && <Footer />}
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
