import React from "react";
import QRCode from "qrcode.react";

const QRCodeGenerator = ({ text }) => {
  return (
    <div className="text-center">
      <h4>🔳 QR Code</h4>
      <QRCode value={text} size={200} />
    </div>
  );
};

export default QRCodeGenerator;
