import { useState, useEffect } from "react";
import { CheckCircle, Calendar, ArrowLeft, Download } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode"; // ✅ Import QRCode package
import "../styles/success.css";

function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const [animate, setAnimate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Access data from location.state
  const { event, formData, ticketCount, totals, bookingId } = location.state || {};

  // Set paymentInfo dynamically
  const [paymentInfo, setPaymentInfo] = useState({
    transactionId: bookingId || "TXN" + Math.floor(Math.random() * 10000000),
    date: new Date().toLocaleDateString(),
    amount: totals?.total || "₹2,500.00",
    event: {
      name: event?.title || "Event Name",
      date: event?.date ? new Date(event.date).toLocaleDateString() : new Date().toLocaleDateString(),
      time: "7:00 PM",
      venue: event?.venue || "Venue Name",
      city: event?.city || "City Name",
    },
    tickets: ticketCount || 1,
  });

  useEffect(() => {
    setTimeout(() => setAnimate(true), 300);
    setTimeout(() => setShowDetails(true), 1500);

    if (!location.state) {
      alert("No booking details found. Redirecting to homepage...");
      navigate("/");
    }
  }, [location.state, navigate]);

  const handleBackToHome = () => {
    navigate("/");
  };

  // 📜 Generate and Download PDF Receipt
  const handleDownloadReceipt = async () => {
    if (!event || !formData || !totals || !bookingId) {
      alert("Missing receipt details!");
      return;
    }

    const doc = new jsPDF();

    // 🎨 Stylish Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 30, "F");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("Booking Receipt", 20, 20);

    // 🏢 Business Info
    const businessLogo = "https://res.cloudinary.com/dc54r1zx9/image/upload/v1740076446/pmqj5o7rrpthhlcgcdft.png";
    doc.addImage(businessLogo, "PNG", 160, 5, 35, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Eventure", 15, 45);
    doc.text("B Block, ABC Tower, Kochi, Kerala", 15, 50);
    doc.text("Phone: 999xxxxxxx870 | Email: Eventure@gmail.com", 15, 55);
    doc.text("TAX ID: 1234567890", 15, 60);

    // 📅 Event Details
    doc.setFillColor(52, 152, 219);
    doc.rect(10, 70, 190, 10, "F");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("Event Information", 15, 77);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Event: ${paymentInfo.event.name}`, 15, 87);
    doc.text(`Date: ${paymentInfo.event.date}`, 15, 94);
    doc.text(`Time: ${paymentInfo.event.time}`, 15, 101);
    doc.text(`Venue: ${paymentInfo.event.venue}`, 15, 108);
    doc.text(`City: ${paymentInfo.event.city}`, 15, 115);
    doc.text(`Tickets: ${paymentInfo.tickets}`, 15, 122);

    // 💰 Transaction Details
    doc.setFillColor(46, 204, 113);
    doc.rect(10, 130, 190, 10, "F");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("Transaction Details", 15, 137);
    
    autoTable(doc, {
      startY: 145,
      theme: "grid",
      styles: { fillColor: [255, 255, 255] },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      body: [
        ["Receipt Number", `REC-${paymentInfo.transactionId}`],
        ["Transaction Date", paymentInfo.date],
        ["Transaction ID", paymentInfo.transactionId],
        ["Total Amount Paid", `${totals?.total || "0.00"}`],
        ["Number of Tickets", paymentInfo.tickets],
      ],
    });

    // 🔗 Generate QR Code with Transaction Details
    const transactionDetails = `Transaction ID: ${paymentInfo.transactionId}\nAmount: ₹${totals?.total}\nEvent: ${paymentInfo.event.name}\nTickets: ${paymentInfo.tickets}`;
    
    try {
      const qrDataUrl = await QRCode.toDataURL(transactionDetails);
      doc.addImage(qrDataUrl, "PNG", 80, doc.lastAutoTable.finalY + 10, 50, 50);
    } catch (error) {
      console.error("QR Code Generation Failed:", error);
    }

    // 📜 Save PDF
    doc.save(`Receipt_${paymentInfo.transactionId}.pdf`);
  };

  return (
    <div className="success-page">
      <div className="success-container">
        <div className={`success-check-container ${animate ? 'animate' : ''}`}>
          <div className="success-check-background"></div>
          <CheckCircle className="success-check-icon" />
        </div>

        <h1 className={`success-title ${showDetails ? 'show' : ''}`}>Payment Successful!</h1>
        <div className={`success-message ${showDetails ? 'show' : ''}`}>
          Thank you for your payment. Your booking has been confirmed.
        </div>

        <div className={`success-details ${showDetails ? 'show' : ''}`}>
          <div className="success-detail-item"><span>Transaction ID</span><strong>{paymentInfo.transactionId}</strong></div>
          <div className="success-detail-item"><span>Date</span><strong>{paymentInfo.date}</strong></div>
          <div className="success-detail-item"><span>Amount Paid</span><strong>{paymentInfo.amount}</strong></div>
        </div>

        <div className={`success-actions ${showDetails ? 'show' : ''}`}>
          <button className="success-primary-button" onClick={handleDownloadReceipt}>
            <Download size={16} /> Download Receipt
          </button>
          <button className="success-secondary-button" onClick={handleBackToHome}>
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;
