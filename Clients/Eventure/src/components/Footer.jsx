
import { Facebook, Twitter, Instagram } from 'lucide-react';

const FooterComponent = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          {/* Branding */}
          <div className="col-md-3 text-center text-md-start mb-4 mb-md-0">
            <h5 className="fw-bold">Eventure</h5>
            <p className="">Discover and book the best events in your area.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5 className="fw-semibold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
              <li><a href="/privacy" className="text-light text-decoration-none">Privacy Policy</a></li>
              <li><a href="/terms" className="text-light text-decoration-none">Terms of Service</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3">
            <h5 className="fw-semibold">Support</h5>
            <ul className="list-unstyled">
              <li><a href="/faq" className="text-light text-decoration-none">FAQ</a></li>
              <li><a href="/help" className="text-light text-decoration-none">Help Center</a></li>
              <li><a href="/refunds" className="text-light text-decoration-none">Refund Policy</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-3 text-center text-md-start">
            <h5 className="fw-semibold">Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-light"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="text-light"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="text-light"><Instagram className="h-6 w-6" /></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-top mt-4 pt-3 text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} Eventure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;