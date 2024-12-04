import React, { useRef, useEffect } from "react";
import QrScanner from "qr-scanner"; // Assuming you are using the `qr-scanner` package

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const qrScanner = new QrScanner(videoRef.current, (result) => {
      onScan(result); // Pass scanned data to the parent component
    });

    qrScanner.start(); // Start scanning

    return () => {
      qrScanner.stop(); // Clean up when component unmounts
    };
  }, [onScan]);

  return <video ref={videoRef} style={{ width: "100%" }} />;
};

export default QRScanner;
