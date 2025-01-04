import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import female from '../../assets/female.jpg'
import html2pdf from 'html2pdf.js'; 
import male from '../../assets/male.jpg';
const BASE_URL = import.meta.env.VITE_DEALBABA_URL;
function CustomerCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log("No token found");
          return;
        }
        const response = await axios.get(`${BASE_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load user data');
        setLoading(false);
        console.error('Error:', error);
      }
    };

    fetchUserData();
  }, []);


  const handleSharePDF = () => {
    const element = document.getElementById('user-card'); 
    const options = {
      margin: 1,
      filename: 'user-info.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().from(element).set(options).save();
     
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  } 
  return (
    <div id="user-card" className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
    <div className="bg-purple-200 p-6 rounded-lg shadow-md w-96">
      <h2 className="text-center text-2xl mb-4 uppercase text-rose-700 font-bold">{user.name} login card</h2>
      <div className="flex flex-col items-center">
        <div className="relative">
          {user.gender === 'male' ? (
            <img src={male} alt="Male" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <img src={female} alt="Female" className="w-20 h-20 rounded-full object-cover" />
          )}
          {/* <button className="absolute bottom-0 right-0  text-white p-1 rounded-full shadow-md hover:bg-purple-600">
            📷
          </button> */}
        </div>
        <h3 className="mt-4 text-xl font-bold">{user.name || ''}</h3>
      </div>
      <div className="my-4 border-t border-gray-300"></div>
      <div className="flex justify-center">
        <div className="bg-white p-2 rounded-lg shadow">
          <QRCode value={`name:${user.name || 'Loading...'} - email:${user.email || ''}`} size={128} />
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-xl">
          <span className="font-bold text-xl">Username:</span> {user.name || 'Loading...'}
        </p>
        <p className="text-xl">
          <span className="font-bold ">Email:</span> {user.email}
        </p>
      </div>
      <div className="flex justify-around mt-6">
        {/* <button className="px-4 pt-1 pb-2 bg-rose-700 text-white rounded-lg shadow hover:bg-rose-500">
          Email
        </button> */}
        <button
          className="px-4 pt-1 pb-2 bg-rose-700 text-white rounded-lg shadow hover:bg-rose-500"
          onClick={handleSharePDF}
        >
          Print
        </button>
      </div>
    </div>
  </div>
  
  );
}

export default CustomerCard;
