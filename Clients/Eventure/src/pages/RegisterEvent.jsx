import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import API from '../services/api';
import '../styles/RegisterEvent.css';

const RegisterEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    category: '',
    price: '',
    city: '',
    email: '',
    image: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleImageUpload = (file) => {
    setFormData({ ...formData, image: file });
    if (errors.image) setErrors({ ...errors, image: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.price || Number(formData.price) < 0) newErrors.price = 'Invalid price';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.image) newErrors.image = 'Event image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    const formDataToSend = new FormData();
  
    // Append only non-empty values
    Object.keys(formData).forEach((key) => {
      if (key === "image" && formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    try {
      const response = await API.post("/events", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            title: "",
            description: "",
            date: "",
            venue: "",
            category: "",
            price: "",
            city: "",
            email: "",
            image: null,
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Event Registration Failed:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="register-event-container">
      <h1>Register New Event</h1>
      {isSubmitted ? (
        <div className="success-message">
          <h2>Success!</h2>
          <p>Your event has been registered successfully.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={errors.title ? 'error' : ''} />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={errors.description ? 'error' : ''}></textarea>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={errors.date ? 'error' : ''} />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="venue">Venue *</label>
            <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleChange} className={errors.venue ? 'error' : ''} />
            {errors.venue && <span className="error-message">{errors.venue}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} className={errors.category ? 'error' : ''} />
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className={errors.price ? 'error' : ''} />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'error' : ''} />
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Event Image *</label>
            <ImageUpload onImageUpload={handleImageUpload} currentImage={formData.image} />
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className={`submit-button ${isSubmitting ? 'submitting' : ''}`} disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Event'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterEvent;
