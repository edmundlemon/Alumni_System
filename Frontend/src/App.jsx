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
import ConnectStatus from "./User/Alumni/ConnectStatus";
import Dashboard from "./Admin/Dashboard";

function AppRoutes() {
  const location = useLocation();

  // Only show header/footer on these paths:
  const hideHeader = [
    "/userTable",
    "/eventTable",
    "/forumTable",
    "/donationTable",
    "/adminLogin",
    "/commentTable",
    "/majorTable",
    "/403",
    "/404",
    "/dashboard"
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
    "/403",
    "/404",
    "/dashboard"
  ].includes(location.pathname);

  // Hide header/footer for 404 and 403 wildcard routes
  const isErrorPage =
    location.pathname === "/403" ||
    // If no route matches, react-router will render the "*" route
    // so we check if the rendered element is the 404 page
    // or you can use a state or context to indicate 404
    false;

  return (
    <>
      {!hideHeader && !isErrorPage && <Header />}
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
        <Route path="/connectStatus" element={<ConnectStatus />} />
        {/* Admin Routes */}
        <Route element={<Sidebar />}>
          <Route path="/userTable" element={<UserManageTable />} />
          <Route path="/eventTable" element={<EventTable />} />
          <Route path="/forumTable" element={<ForumTable />} />
          <Route path="/donationTable" element={<DonationTable />} />
          <Route path="/majorTable" element={<MajorTable />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        {/* 404 Not Found */}
        <Route
          path="/403"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="text-center px-6 py-12 bg-white shadow-lg rounded-xl max-w-md">
                <h1 className="text-6xl font-bold text-red-500">403</h1>
                <h2 className="text-2xl font-semibold mt-4">Access Denied</h2>
                <p className="mt-2 text-gray-600">
                  You do not have permission to view this page.
                </p>
                <a
                  href="/"
                  className="inline-block mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="text-center px-6 py-12 bg-white shadow-lg rounded-xl max-w-md">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
                <p className="mt-2 text-gray-600">
                  Sorry, the page you’re looking for doesn’t exist.
                </p>
                <a
                  href="/"
                  className="inline-block mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Return to Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
      {!hideFooter && !isErrorPage && <Footer />}
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
