import React, { useRef, useEffect } from "react";
import QrScanner from "qr-scanner"; 

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const qrScanner = new QrScanner(videoRef.current, (result) => {
      onScan(result); 
    });

    qrScanner.start();

    return () => {
      qrScanner.stop(); 
    };
  }, [onScan]);

  return <video ref={videoRef} style={{ width: "100%" }} />;
};

export default QRScanner;
