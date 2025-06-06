// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import Cookies from "js-cookie";

// Components
import Header from "./User/Header";
import Footer from "./User/Footer";
import Login from "./User/Login";
import AdminLogin from "./Admin/AdminLogin";
import UserManageTable from "./Admin/UserManageTable";
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
import ViewCreateEvent from "./User/Event/ViewCreateEvent";
import EditEvent from "./User/Event/EditEvent";
import Sidebar from "./Admin/Sidebar";

// 🔒 Protected Routes
function ProtectedRoute({ children }) {
  const token = Cookies.get("token");
  if (!token) {
    return <Navigate to="/userLogin" replace />;
  }
  return children;
}

function ProtectedAdminRoute() {
  const adminToken = Cookies.get("adminToken");
  if (!adminToken) {
    return <Navigate to="/403" replace />;
  }
  return <Outlet />;
}

function AppRoutes() {
  const location = useLocation();

  const isErrorPage = ["/403", "/404"].includes(location.pathname);

  const hideHeader = [
    "/userTable", "/eventTable", "/forumTable", "/donationTable",
    "/adminLogin", "/commentTable", "/majorTable", "/dashboard"
  ].includes(location.pathname);

  const hideFooter = [
    "/userTable", "/eventTable", "/forumTable", "/donationTable",
    "/adminLogin", "/forumMainPage", "/commentTable", "/majorTable", "/dashboard"
  ].includes(location.pathname);

  return (
    <>
      {!hideHeader && !isErrorPage && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/mainPage" replace />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/userLogin" element={<Login />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/reset-password" element={<Login initialForm="resetPassword" />} />
        <Route path="/termAndCondition" element={<TermAndCondition />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/policy" element={<Policy />} />

        {/* Protected User Routes */}
        <Route path="/viewEvent" element={<ProtectedRoute><ViewEvent /></ProtectedRoute>} />
        <Route path="/eventMainPage" element={<ProtectedRoute><EventMainPage /></ProtectedRoute>} />
        <Route path="/viewEventDetails" element={<ProtectedRoute><ViewEventDetails /></ProtectedRoute>} />
        <Route path="/forumMainPage" element={<ProtectedRoute><ForumMainPage /></ProtectedRoute>} />
        <Route path="/donationMainPage" element={<ProtectedRoute><DonationMainPage /></ProtectedRoute>} />
        <Route path="/razorpay" element={<ProtectedRoute><RazorPay /></ProtectedRoute>} />
        <Route path="/viewDonateDetails" element={<ProtectedRoute><ViewDonateDetails /></ProtectedRoute>} />
        <Route path="/alumniMainPage" element={<ProtectedRoute><AlumniMainPage /></ProtectedRoute>} />
        <Route path="/viewProfile" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
        <Route path="/addEvent" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
        <Route path="/donateNow" element={<ProtectedRoute><DonateNow /></ProtectedRoute>} />
        <Route path="/updateProfile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route path="/connectStatus" element={<ProtectedRoute><ConnectStatus /></ProtectedRoute>} />
        <Route path="/viewCreateEvent" element={<ProtectedRoute><ViewCreateEvent /></ProtectedRoute>} />
        <Route path="/editEvent" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route element={<Sidebar />}>
            <Route path="/userTable" element={<UserManageTable />} />
            <Route path="/eventTable" element={<EventTable />} />
            <Route path="/forumTable" element={<ForumTable />} />
            <Route path="/donationTable" element={<DonationTable />} />
            <Route path="/majorTable" element={<MajorTable />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* 403 Page */}
        <Route
          path="/403"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="text-center px-6 py-12 bg-white shadow-lg rounded-xl max-w-md">
                <h1 className="text-6xl font-bold text-red-500">403</h1>
                <h2 className="text-2xl font-semibold mt-4">Access Denied</h2>
                <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
                <a href="/" className="inline-block mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">Go Home</a>
              </div>
            </div>
          }
        />

        {/* 404 Page */}
        <Route
          path="/404"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="text-center px-6 py-12 bg-white shadow-lg rounded-xl max-w-md">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
                <p className="mt-2 text-gray-600">Sorry, the page you’re looking for doesn’t exist.</p>
                <a href="/" className="inline-block mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">Return to Home</a>
              </div>
            </div>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/404" replace />} />
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
