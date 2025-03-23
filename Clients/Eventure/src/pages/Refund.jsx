import React from 'react';
import '../styles/Legalpages.css';

const RefundPolicy = () => {
  return (
    <div className="legal-container">
      <header className="legal-header">
        <h1>Refund Policy</h1>
        <div className="header-underline"></div>
        <p className="last-updated">Last Updated: March 16, 2025</p>
      </header>

      <section className="legal-section">
        <h2>1. Introduction</h2>
        <p>
          At Eventure, we aim to ensure that all our customers are satisfied with their purchases. This Refund Policy 
          outlines the conditions under which refunds are provided for our subscription services and for event tickets 
          purchased through our platform.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Subscription Refunds</h2>
        <h3>2.1 Refund Eligibility</h3>
        <p>
          If you are dissatisfied with your Eventure subscription, you may be eligible for a refund under the following conditions:
        </p>
        <ul>
          <li><strong>New Subscriptions:</strong> You may request a full refund within 14 days of your initial purchase if you have not created any events or sold any tickets during this period.</li>
          <li><strong>Subscription Renewals:</strong> Refunds for subscription renewals may be considered on a case-by-case basis and must be requested within 7 days of the renewal date.</li>
          <li><strong>Service Issues:</strong> If you experience significant service disruptions or technical issues that substantially impair your use of our platform, you may be eligible for a partial or full refund, depending on the circumstances.</li>
        </ul>

        <h3>2.2 Non-Refundable Situations</h3>
        <p>Subscription fees are non-refundable in the following cases:</p>
        <ul>
          <li>After the 14-day refund period has expired for new subscriptions</li>
          <li>If you have created events or sold tickets during the refund eligibility period</li>
          <li>For partial months of service if you cancel your subscription mid-billing cycle</li>
          <li>If your account has been suspended or terminated due to violations of our Terms of Service</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. Event Ticket Refunds</h2>
        <h3>3.1 Platform Policy</h3>
        <p>
          As a platform connecting event organizers with attendees, Eventure does not directly issue refunds for event tickets. 
          Refund policies for event tickets are set by individual event organizers.
        </p>
        
        <h3>3.2 Organizer Refund Policies</h3>
        <p>
          Event organizers are required to clearly state their refund policies at the time of ticket purchase. These policies 
          may vary depending on the event type, timing, and other factors determined by the organizer.
        </p>
        
        <h3>3.3 Canceled or Postponed Events</h3>
        <p>
          If an event is canceled by the organizer, attendees are typically eligible for a full refund. For postponed events, 
          refund eligibility will depend on the organizer's policy, which should be communicated to ticket holders.
        </p>
        
        <h3>3.4 Disputes</h3>
        <p>
          In the event of a dispute between an attendee and an event organizer regarding refunds, Eventure may facilitate 
          communication between the parties but reserves the right to make final decisions in accordance with our Terms of Service.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. Processing Refunds</h2>
        <h3>4.1 Refund Method</h3>
        <p>
          Refunds will be issued using the same payment method used for the original purchase. Processing times may vary 
          depending on your payment provider and typically take 5-10 business days to appear on your statement.
        </p>
        
        <h3>4.2 Processing Fees</h3>
        <p>
          Please note that certain payment processing fees and platform fees may be non-refundable, even when a refund is approved. 
          These non-refundable fees will be clearly communicated during the refund process.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. How to Request a Refund</h2>
        <p>To request a refund for your subscription or to inquire about an event ticket refund:</p>
        <ol>
          <li>Log in to your Eventure account</li>
          <li>Navigate to the Help Center</li>
          <li>Select "Request a Refund" from the options</li>
          <li>Fill out the refund request form with all required information</li>
          <li>Submit your request</li>
        </ol>
        <p>
          Alternatively, you can contact our customer support team directly at Eventure@gmail.com or call 999xxxxxxx870.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Changes to This Policy</h2>
        <p>
          We reserve the right to modify this Refund Policy at any time. Any changes will be effective immediately upon 
          posting the updated policy on our website. We encourage you to review this policy periodically to stay informed 
          about our refund practices.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions or concerns about our Refund Policy, please contact us at:
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

export default RefundPolicy;