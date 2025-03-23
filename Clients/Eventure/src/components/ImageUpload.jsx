// src/components/ImageUpload.jsx
import  { useState } from "react";

const ImageUpload = ({ onImageUpload, currentImage }) => {
  const [preview, setPreview] = useState(currentImage ? URL.createObjectURL(currentImage) : null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };

  return (
    <div className="image-upload">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="image-preview" />}
    </div>
  );
};

export default ImageUpload;
