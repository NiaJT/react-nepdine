import { BrowserRouter, Routes, Route } from "react-router-dom";

// Guest Pages
// import Home from "@/pages/guest/Home";
// import About from "@/pages/guest/About";
// import Contact from "@/pages/guest/Contact";
// import Features from "@/pages/guest/Features";
// import FindAccount from "@/pages/guest/FindAccount";
// import ForgotPassword from "@/pages/guest/ForgotPassword";
import LoginPage from "@/pages/guest/Login";
// import Otp from "@/pages/guest/Otp";
// import Pricing from "@/pages/guest/Pricing";
// import Register from "@/pages/guest/Register";

// // Auth Pages
// import Demo from "@/pages/auth/Demo";
// import Groups from "@/pages/auth/Groups";
// import GroupDetails from "@/pages/auth/GroupDetails";
// import CreateRestaurant from "@/pages/auth/CreateRestaurant";
// import MenuWaiters from "@/pages/auth/Menu_waiters";
// import Restaurants from "@/pages/auth/Restaurants";
// import Tables from "@/pages/auth/Tables";
// import TableDetail from "@/pages/auth/TableDetail";

// // Manager Pages
// import Dashboard from "@/pages/manager/Dashboard";
// import Balance from "@/pages/manager/Balance";
// import Menu from "@/pages/manager/Menu";
// import Waiters from "@/pages/manager/Waiters";
// import WaiterDetails from "@/pages/manager/WaiterDetails";

// // Admin Pages
// import Users from "@/pages/admin/Users";

// // SuperAdmin Pages
// import AddSuperAdmin from "@/pages/superadmin/AddSuperAdmin";
// import Applications from "@/pages/superadmin/Applications";
// import Faqs from "@/pages/superadmin/Faqs";
// import SuperFeatures from "@/pages/superadmin/Features";
// import Feedbacks from "@/pages/superadmin/Feedbacks";
// import RestaurantDetails from "@/pages/superadmin/RestaurantDetails";
// import RestaurantsSuper from "@/pages/superadmin/Restaurants";
// import Subscriptions from "@/pages/superadmin/Subscriptions";
// import TenantDetails from "@/pages/superadmin/TenantDetails";
// import Tenants from "@/pages/superadmin/Tenants";

// // Shared
// import ChangePassword from "@/pages/shared/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GUEST */}

        <Route path="/" element={<h1>Home PAGE</h1>} />
        {
          /* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/features" element={<Features />} />
        <Route path="/find-account" element={<FindAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />*/
          <Route path="/login" element={<LoginPage />} />
          /*<Route path="/otp" element={<Otp />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/register" element={<Register />} />

        {/* AUTH */
        }

        {/* <Route path="/demo" element={<Demo />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:id" element={<GroupDetails />} />
        <Route path="/create-restaurant" element={<CreateRestaurant />} />
        <Route path="/menu-waiters" element={<MenuWaiters />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/tables/:id" element={<TableDetail />} /> */}

        {/* MANAGER */}

        {/* <Route path="/manager/dashboard" element={<Dashboard />} />
        <Route path="/manager/balance" element={<Balance />} />
        <Route path="/manager/menu" element={<Menu />} />
        <Route path="/manager/waiters" element={<Waiters />} />
        <Route path="/manager/waiters/:id" element={<WaiterDetails />} />

        <Route path="/manager/admin/users" element={<Users />} />

        {/* SHARED */}
        {/* <Route path="/change-password" element={<ChangePassword />} />  */}

        {/* SUPERADMIN */}

        {/* <Route path="/superadmin/add" element={<AddSuperAdmin />} />
        <Route path="/superadmin/applications" element={<Applications />} />
        <Route path="/superadmin/faqs" element={<Faqs />} />
        <Route path="/superadmin/features" element={<SuperFeatures />} />
        <Route path="/superadmin/feedbacks" element={<Feedbacks />} />
        <Route
          path="/superadmin/restaurant-details"
          element={<RestaurantDetails />}
        />
        <Route path="/superadmin/restaurants" element={<RestaurantsSuper />} />
        <Route path="/superadmin/subscriptions" element={<Subscriptions />} />
        <Route path="/superadmin/tenant-details" element={<TenantDetails />} />
        <Route path="/superadmin/tenants" element={<Tenants />} />  */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
