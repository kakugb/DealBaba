import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddDeal() {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  
  const MAX_FILE_SIZE = 5 * 1024 * 1024; 

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setUserId(user.id); 
    } else {
      console.log('No user found in localStorage');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const formData = new FormData(); 

    formData.append('shopName', e.target.shopName.value);
    formData.append('dealName', e.target.dealName.value);
    formData.append('discount', e.target.discount.value);
    formData.append('description', e.target.description.value);


    const imageFile = e.target.image.files[0];
    if (imageFile) {
      if (imageFile.size > MAX_FILE_SIZE) {
        alert('File is too large. Maximum size is 5MB.');
        return; 
      }
      formData.append('image', imageFile);
    }

    formData.append('userId', userId);

    try {

      const response = await axios.post('http://localhost:5000/api/deals/add-deal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      // Handle success
      console.log('Deal created successfully:', response.data);
      navigate('/shopowner/dealPage');
    } catch (error) {
      // Handle error
      console.error('Error creating deal:', error.response?.data || error.message);
      alert('Failed to create deal.');
    }
  };

  return (
    <div>
      <div className="pt-20 flex items-center justify-center">
        {/* Bottom Buttons */}
        <div className="fixed top-20 left-4 flex justify-between px-4">
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="bg-rose-700 p-3 text-white py-2 rounded-md hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </div>
        <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-md shadow-slate-700">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create a New Deal</h2>
          <form id="dealForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter shop name"
                required
              />
            </div>

            <div>
              <label htmlFor="dealName" className="block text-sm font-medium text-gray-700">Deal Name</label>
              <input
                type="text"
                id="dealName"
                name="dealName"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter deal name"
                required
              />
            </div>

            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                type="number"
                id="discount"
                name="discount"
                min="1"
                max="100"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter discount percentage"
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 
                file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a brief description"
                required
              ></textarea>
            </div>

            <div>
              <button type="submit" className="w-full bg-red-700 hover:bg-red-500 text-white font-semibold py-2 rounded-md">
                Create Deal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDeal;
