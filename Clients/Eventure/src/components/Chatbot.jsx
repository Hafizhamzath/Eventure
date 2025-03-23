import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, RotateCcw } from 'lucide-react';
import '../styles/Chatbot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage = {
          text: "Welcome to Eventure! How can I help you today?",
          sender: "bot",
          options: [
            { id: 1, text: "Book Event" },
            { id: 2, text: "Host Event" },
            { id: 3, text: "Contact Info" },
            { id: 4, text: "Refund Policy" },
            { id: 5, text: "Payment Options" }
          ]
        };
        setMessages([welcomeMessage]);
      }, 500);
    }
  }, [messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const generateResponse = (userMessage) => {
    setLoading(true);
    
    setTimeout(() => {
      let botResponse = {
        text: "",
        sender: "bot",
        options: []
      };

      switch (userMessage.toLowerCase()) {
        case "book event":
          botResponse.text = "To book an event, follow these steps:";
          botResponse.steps = [
            "Browse available events",
            "Select your preferred event",
            "Choose number of tickets",
            "Complete payment",
            "Receive confirmation email"
          ];
          break;
        case "host event":
          botResponse.text = "To host an event with us:";
          botResponse.steps = [
            "Create an organizer account",
            "Fill in event details",
            "Set ticket prices",
            "Submit",
            "Start promoting!"
          ];
          break;
        case "contact info":
          botResponse.text = "You can reach us at:\nEmail: support@eventure.com\nPhone: (+91): 999xxxxxxx870\nHours: Mon-Fri 9AM-6PM IST";
          break;
        case "refund policy":
          botResponse.text = `Our refund policy:
            • Full refund up to 7 days before the event.
            • 50% refund between 2-7 days before the event.
            • No refund within 48 hours of the event.
            For further assistance, please contact the organizers of your respective event using the email address associated with your registration. We recommend including your booking details for a quicker resolution.`;
          break;
        case "payment options":
          botResponse.text = "We accept the following payment methods:";
          botResponse.steps = [
            "All major Credit/Debit cards",
            "UPI",
            "Net Banking"
          ];
          break;
        default:
          botResponse.text = "I'm here to help! Please select an option:";
          botResponse.options = [
            { id: 1, text: "Book Event" },
            { id: 2, text: "Host Event" },
            { id: 3, text: "Contact Info" },
            { id: 4, text: "Refund Policy" },
            { id: 5, text: "Payment Options" }
          ];
      }

      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
    }, 1000);
  };

  const handleUserMessage = (message) => {
    const userMessage = {
      text: message,
      sender: "user"
    };
    
    setMessages(prev => [...prev, userMessage]);
    generateResponse(message);
  };

  const handleOptionClick = (option) => {
    handleUserMessage(option.text);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const resetChat = () => {
    setMessages([]);
  };

  return (
    <div className="chatbot">
      <button className="chatbot-toggle" onClick={toggleChat}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="chatbot-avatar">E</div>
              <div>
                <h3>Eventure Assistant</h3>
                <span className="status">Online</span>
              </div>
            </div>
            <button className="reset-button" onClick={resetChat} title="Reset conversation">
              <RotateCcw size={18} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === "bot" && (
                  <div className="message-avatar">E</div>
                )}
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  
                  {msg.steps && (
                    <ul className="message-steps">
                      {msg.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ul>
                  )}
                  
                  {msg.options && (
                    <div className="message-options">
                      {msg.options.map(option => (
                        <button 
                          key={option.id}
                          onClick={() => handleOptionClick(option)}
                          className="option-button"
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message bot">
                <div className="message-avatar">E</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-footer">
            <p>Powered by Eventure</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;