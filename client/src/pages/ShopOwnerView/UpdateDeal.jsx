import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateDeal() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [deal, setDeal] = useState({
    shopName: '',
    dealName: '',
    discount: '',
    image: null,
    description: '',
  });
  const [loading, setLoading] = useState(true); // New loading state

  // Fetch deal details based on the dealId from the URL on the first visit
  useEffect(() => {
    console.log(id);
    axios
      .get(`http://localhost:5000/api/deals/getById/${id}`)  // Fetch the deal by ID
      .then((response) => {
        console.log(response.data);
        setDeal(response.data.deal); // Assuming the response contains the deal object
        setLoading(false); // Set loading to false when the data is fetched
      })
      .catch((error) => {
        console.error('Error fetching deal details:', error);
        setLoading(false); 
      });
  }, [id]);  


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setDeal((prevDeal) => ({
        ...prevDeal,
        [name]: files[0], 
      }));
    } else {
      setDeal((prevDeal) => ({
        ...prevDeal,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('shopName', deal.shopName);
    formData.append('dealName', deal.dealName);
    formData.append('discount', deal.discount);
    formData.append('description', deal.description);
    if (deal.image) {
      formData.append('image', deal.image); 
    }

    axios
      .put(`http://localhost:5000/api/deals/update/${deal.id}`, formData)
      .then((response) => {
        console.log('Deal updated successfully:', response.data);
        navigate('/shopowner/dealPage')
      })
      .catch((error) => {
        console.error('Error updating deal:', error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;  // Show loading text or spinner
  }

  return (
    <div className=" flex items-center justify-center pt-24">
            {/* Bottom Buttons */}
            <div className="fixed top-20 left-4 flex justify-between px-4">
        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className=" bg-rose-700 p-3 text-white py-2 rounded-md hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
           Go Back
        </button>

       
      </div>
      <div className="bg-white  rounded-lg p-4 w-full max-w-md shadow-md shadow-slate-700">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Update Deal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shop Name */}
          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
              Shop Name
            </label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={deal.shopName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter shop name"
              required
            />
          </div>

          {/* Deal Name */}
          <div>
            <label htmlFor="dealName" className="block text-sm font-medium text-gray-700">
              Deal Name
            </label>
            <input
              type="text"
              id="dealName"
              name="dealName"
              value={deal.dealName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter deal name"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              min="1"
              max="100"
              value={deal.discount}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter discount percentage"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={deal.description}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a brief description"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-500 text-white font-semibold py-2 rounded-md"
            >
              Update Deal
            </button>
          </div>
        </form>
      </div>
    
    </div>
  );
}

export default UpdateDeal;
