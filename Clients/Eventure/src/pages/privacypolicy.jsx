import React from 'react';
import '../styles/Legalpages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-container">
      <header className="legal-header">
        <h1>Privacy Policy</h1>
        <div className="header-underline"></div>
        <p className="last-updated">Last Updated: March 16, 2025</p>
      </header>

      <section className="legal-section">
        <h2>1. Introduction</h2>
        <p>
          Welcome to Eventure ("we," "our," or "us"). At Eventure, we value your privacy and are committed 
          to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, 
          and safeguard your information when you use our event management platform and related services.
        </p>
        <p>
          By accessing or using Eventure, you agree to this Privacy Policy. If you do not agree with our policies 
          and practices, please do not use our services.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Information We Collect</h2>
        <h3>2.1 Personal Information</h3>
        <p>We may collect the following types of personal information:</p>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, phone number, and billing information when you register for an account.</li>
          <li><strong>Profile Information:</strong> Professional details, company information, and profile pictures that you choose to provide.</li>
          <li><strong>Event Information:</strong> Details about events you organize or attend, including preferences and special requirements.</li>
          <li><strong>Transaction Information:</strong> Payment details, purchase history, and billing addresses.</li>
          <li><strong>Communications:</strong> Information you provide when contacting our customer support team.</li>
        </ul>

        <h3>2.2 Usage Information</h3>
        <p>We automatically collect certain information about your device and how you interact with our platform:</p>
        <ul>
          <li><strong>Log Data:</strong> IP address, browser type, pages visited, time spent, and other statistics.</li>
          <li><strong>Device Information:</strong> Device type, operating system, and unique device identifiers.</li>
          <li><strong>Location Data:</strong> General location information derived from your IP address.</li>
          <li><strong>Cookies and Similar Technologies:</strong> Information collected through cookies, web beacons, and similar technologies.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. How We Use Your Information</h2>
        <p>We use your information for various purposes, including to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Create and manage your account</li>
          <li>Communicate with you about our services, updates, and promotions</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Monitor and analyze usage patterns and trends</li>
          <li>Detect, prevent, and address technical issues and fraudulent activities</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Information Sharing and Disclosure</h2>
        <p>We may share your information in the following situations:</p>
        <ul>
          <li><strong>Service Providers:</strong> With third-party vendors who provide services on our behalf (payment processing, data analysis, email delivery, hosting services).</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
          <li><strong>Legal Requirements:</strong> To comply with applicable laws, regulations, legal processes, or governmental requests.</li>
          <li><strong>Protection of Rights:</strong> To enforce our terms and policies and protect our rights, privacy, safety, or property.</li>
          <li><strong>With Your Consent:</strong> In other ways with your consent or at your direction.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information from unauthorized access, 
          alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
          storage is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Your Rights and Choices</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information:</p>
        <ul>
          <li>Access, update, or delete your information</li>
          <li>Object to or restrict processing of your information</li>
          <li>Data portability</li>
          <li>Withdraw consent (where applicable)</li>
        </ul>
        <p>
          To exercise these rights, please contact us at Eventure@gmail.com. Please note that some of these rights 
          may be subject to limitations and exceptions under applicable law.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
          operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
          updated Privacy Policy on this page and updating the "Last Updated" date.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
        </p>
        <div className="contact-details">
          <p>Eventure</p>
          <p>B Block, ABC Tower, Kochi, Kerala</p>
          <p>Phone: 999xxxxxxx870</p>
          <p>Email: Eventure@gmail.com</p>
        </div>
      </section>

    </div>
  );
};

export default PrivacyPolicy;