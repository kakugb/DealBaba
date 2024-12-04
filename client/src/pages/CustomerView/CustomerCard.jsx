import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import female from '../../assets/female.jpg'
import html2pdf from 'html2pdf.js'; 
import male from '../../assets/male.jpg';
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
        const response = await axios.get('http://localhost:5000/api/auth/user', {
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
      margin:       1,
      filename:     'user-info.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-2xl flex flex-col md:flex-row" id="user-card">
        {/* Left Section: User Details */}
        <div className='bg-rose-700'>
          <div className="flex-1 p-6 text-white space-y-4">
            <div className="text-center">
              <p className="w-full">
                {user.gender === 'male' ? (
                  <img src={male} alt="Male" className="w-16 h-14 mr-2 rounded-full ml-40 md:ml-28" />
                ) : (
                  <img src={female} alt="Female" className="w-16 h-14 mr-2 rounded-full md:ml-28" />
                )}
              </p>
              <h2 className="text-2xl font-bold text-center mt-1">{user.role}</h2>
            </div>

            {/* User Info */}
            <div>
              <p className="text-lg">Name: <span className="font-semibold pl-16">{user.name || 'Loading...'}</span></p>
              <p className="text-lg">Phone No: <span className="font-semibold pl-7">{user.phoneNumber || 'Loading...'}</span></p>
              <p className="text-lg">Email Address: <span className="font-semibold pl-2">{user.email || 'Loading...'}</span></p>
            </div>
          </div>
        </div>
        
        {/* Right Section: QR Code */}
        <div className="flex justify-center items-center  p-6">
          <QRCode value={`name:${user.name || 'Loading...'} - email:${user.email || 'Loading...'}`} size={128} />
        </div>
      </div>

      {/* Share Button */}
      <div className="text-center mt-4 ml-4">
        <button
          onClick={handleSharePDF}
          className="bg-rose-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-rose-500"
        >
          Share as PDF
        </button>
      </div>
    </div>
  );
}

export default CustomerCard;
