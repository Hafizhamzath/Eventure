import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import NavbarComponent from "./components/NavbarComponents";
import FooterComponent from "./components/Footer";
import Events from "./pages/Events";
import EventDetails from "./pages/Eventdetails";
import Registration from "./pages/register";
import Login from "./pages/login";
import EventCheckout from "./pages/checkoutpage";
import Payment from "./pages/payment";
import Success from "./pages/success";
import CreationHome from "./pages/CreationHome";
import RegisterEvent from "./pages/RegisterEvent";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminDashboard from "./pages/adminDashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { ToastContainer } from "react-toastify";
import FAQPage from "./pages/FAQPage";
import AboutUs from "./pages/About";
import PrivacyPolicy from "./pages/privacypolicy";
import TermsOfService from "./pages/Termsofservice";
import RefundPolicy from "./pages/Refund";
import HelpCenter from "./pages/Helpcenter";
import ContactUs from "./pages/contactUs";
import Chatbot from "./components/Chatbot";
import ProfilePage from "./pages/Profilepage";

// Component to manage layout
const Layout = ({ children }) => {
  const location = useLocation();

  // Define paths where Navbar and Footer should be hidden
  const hiddenPaths = ["/login", "/register", "/admin-dashboard", "/payment", "/success"];

  const shouldHideNavbarAndFooter = hiddenPaths.includes(location.pathname);

  // Define paths where Chatbot should be displayed
  const chatbotPaths = ["/", "/events", "/events/:id"];
  const shouldDisplayChatbot = chatbotPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbarAndFooter && <NavbarComponent />}
      {children}
      {!shouldHideNavbarAndFooter && <FooterComponent />}
      {shouldDisplayChatbot && <Chatbot />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout/:eventId" element={<EventCheckout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/create-event" element={<CreationHome />} />
          <Route path="/register-event" element={<RegisterEvent />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/Faq" element={<FAQPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refunds" element={<RefundPolicy />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute allowedRoles={["admin"]} />}
          >
            <Route index element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<h2 className="text-center mt-5">404 - Page Not Found</h2>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;