import React, { useRef, useState, useEffect } from "react";
import QrScanner from "qr-scanner";

const QrCodeScan = ({ handleVerification }) => {
  const [scanResult, setScanResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const handleScanSuccess = () => {

    handleVerification();
  };
  useEffect(() => {
    let qrScanner;

    if (isScanning && videoRef.current) {
      qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          setScanResult(result.data); 
          console.log("Scanned Data:", result.data);
        },
        {
          returnDetailedScanResult: true,
        }
      );

      qrScanner.start().catch((err) => {
        console.error("Failed to start QR Scanner:", err);
      });
    }

  
    return () => {
      if (qrScanner) qrScanner.stop();
    };
  }, [isScanning]); 
  const startScanning = () => {
    setIsScanning(true); 
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <h1 className="text-2xl font-bold mb-6">QR Code Scanner</h1>

     
      {isScanning && (
        <div className="relative w-72 h-72 border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
          />
        </div>
      )}

    
      {!isScanning && (
        <button
          onClick={startScanning}
          className="mt-6 px-6 py-2 bg-rose-600 hover:bg-red-500 text-white font-semibold rounded-md"
        >
          Start Scanning
        </button>
      )}
 
      <p className="mt-4 text-gray-600">
        Point your camera at a QR code to scan.
      </p>

      {scanResult && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          <p>Scanned Data:</p>
          <pre className="break-words">{scanResult}</pre>
        </div>
      )}

<button onClick={handleScanSuccess}>Simulate QR Code Scan</button>
    </div>
  );
};

export default QrCodeScan;
