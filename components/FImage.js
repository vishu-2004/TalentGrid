"use client";

import React, { useState } from 'react';

export default function FImage() {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="border-gray-200 border-2 h-[300px] rounded-xl flex flex-col items-center justify-center p-4">
      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
      {image && (
        <img
          src={image}
          alt="Uploaded"
          width={128}
          height={128}
          className="bg-cover rounded-lg"
        />
      )}
    </div>
  );
}
