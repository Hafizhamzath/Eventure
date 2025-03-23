import React from 'react';
import '../styles/Legalpages.css';

const TermsOfService = () => {
  return (
    <div className="legal-container">
      <header className="legal-header">
        <h1>Terms of Service</h1>
        <div className="header-underline"></div>
        <p className="last-updated">Last Updated: March 16, 2025</p>
      </header>

      <section className="legal-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          Welcome to Eventure. These Terms of Service ("Terms") govern your access to and use of the Eventure platform, 
          including our website, mobile applications, and all related services (collectively, the "Services").
        </p>
        <p>
          By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, 
          you may not access or use the Services. Please read these Terms carefully before using our Services.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Account Registration and Requirements</h2>
        <h3>2.1 Account Creation</h3>
        <p>
          To use certain features of our Services, you may need to create an account. When you create an account, 
          you must provide accurate and complete information. You are responsible for maintaining the confidentiality 
          of your account credentials and for all activities that occur under your account.
        </p>
        
        <h3>2.2 Account Requirements</h3>
        <p>You must be at least 18 years old to create an account and use our Services. By creating an account, you represent and warrant that:</p>
        <ul>
          <li>You are at least 18 years of age</li>
          <li>You have the legal capacity to enter into these Terms</li>
          <li>You will comply with these Terms and all applicable laws</li>
          <li>The information you provide is accurate and complete</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. Services and Fees</h2>
        <h3>3.1 Services Description</h3>
        <p>
          Eventure provides event management tools and services that allow users to create, organize, promote, and 
          manage events, as well as sell and purchase tickets for events. The specific features and functionality 
          available to you may depend on your subscription plan.
        </p>

        <h3>3.2 Fees and Payment</h3>
        <p>
          We offer various subscription plans with different pricing and features. The fees for our Services are 
          listed on our website. All fees are in Indian Rupees unless otherwise stated.
        </p>
        <p>
          Payment for subscription plans must be made in advance. For event organizers, payment processing fees may apply 
          to ticket sales and will be clearly disclosed before checkout. We use third-party payment processors to process payments.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. User Content and Conduct</h2>
        <h3>4.1 User Content</h3>
        <p>
          You retain ownership of any content you submit, post, or display on or through our Services ("User Content"). 
          By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, 
          modify, adapt, publish, translate, and distribute your User Content in connection with providing and promoting our Services.
        </p>

        <h3>4.2 Prohibited Conduct</h3>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Services for any illegal purpose or in violation of any laws</li>
          <li>Post or transmit harmful, fraudulent, or deceptive content</li>
          <li>Impersonate any person or entity or misrepresent your affiliation</li>
          <li>Interfere with or disrupt the Services or servers connected to the Services</li>
          <li>Attempt to gain unauthorized access to any part of the Services</li>
          <li>Use the Services to collect or harvest user information</li>
          <li>Use the Services to send spam or unsolicited communications</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Intellectual Property Rights</h2>
        <p>
          The Services, including all content, features, and functionality, are owned by Eventure and are protected 
          by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, 
          or lease any part of our Services without our written permission.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Termination</h2>
        <p>
          We may suspend or terminate your access to the Services at any time for any reason, including if we believe 
          you have violated these Terms. You may also terminate your account at any time by following the instructions on our website.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Disclaimers and Limitations of Liability</h2>
        <h3>7.1 Disclaimer of Warranties</h3>
        <p>
          THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
          INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>

        <h3>7.2 Limitation of Liability</h3>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, EVENTURE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION 
          WITH THESE TERMS OR YOUR USE OF THE SERVICES.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Governing Law and Dispute Resolution</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising 
          out of or relating to these Terms or the Services shall be subject to the exclusive jurisdiction of the 
          courts in Kochi, Kerala, India.
        </p>
      </section>

      <section className="legal-section">
        <h2>9. Changes to Terms</h2>
        <p>
          We may revise these Terms from time to time. The most current version will always be posted on our website. 
          If we make changes that we believe are material, we will notify you by email or through the Services.
        </p>
      </section>

      <section className="legal-section">
        <h2>10. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
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

export default TermsOfService;