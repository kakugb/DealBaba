import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_DEALBABA_URL;
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
  const [loading, setLoading] = useState(true); 

 
  useEffect(() => {
    console.log(id);
    axios
      .get(`${BASE_URL}/deals/getById/${id}`)  
      .then((response) => {
        console.log(response.data);
        setDeal(response.data.deal); 
        setLoading(false); 
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
      .put(`${BASE_URL}/deals/update/${deal.id}`, formData)
      .then((response) => {
        console.log('Deal updated successfully:', response.data);
        navigate('/shopowner/dealPage')
      })
      .catch((error) => {
        console.error('Error updating deal:', error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;  
  }

  return (
    <div className="h-screen flex items-center justify-center pt-24 bg-rose-700">
          
            <div className="fixed top-20 left-4 flex justify-between px-4">
        
        <button
          onClick={() => navigate(-1)}
          className=" bg-white p-3 text-black py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500  hover:-translate-x-2 transform transition-all duration-300"
        >
           Go Back
        </button>

       
      </div>
      <div className="bg-white  rounded-lg p-4 w-full max-w-md shadow-md shadow-slate-700">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Update Deal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        
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
