// import React, { useState } from "react";
// import { db } from "../firebase";
// import { doc, updateDoc, setDoc, collection, getDocs } from "firebase/firestore";
// import QRCode from "qrcode.react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const CheckinButton = ({ cid, cno }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showQRCode, setShowQRCode] = useState(false);
//   const checkinRef = doc(db, `classroom/${cid}/checkin/${cno}`);

//   const handleOpenCheckin = async () => {
//     await setDoc(checkinRef, { status: 1 }, { merge: true });
//     setIsOpen(true);
//   };

//   const handleCloseCheckin = async () => {
//     await updateDoc(checkinRef, { status: 0 });
//     setIsOpen(false);
//   };

//   const handleSaveCheckin = async () => {
//     const studentsRef = collection(db, `classroom/${cid}/checkin/${cno}/students`);
//     const scoresRef = collection(db, `classroom/${cid}/checkin/${cno}/scores`);

//     const snapshot = await getDocs(studentsRef);
//     snapshot.forEach(async (doc) => {
//       await setDoc(doc.ref.parent.parent.collection("scores").doc(doc.id), {
//         ...doc.data(),
//         status: 1,
//       });
//     });

//     alert("บันทึกการเช็คชื่อเรียบร้อยแล้ว!");
//   };

//   return (
//     <div className="container text-center my-3">
//       <button className="btn btn-success m-2" onClick={handleOpenCheckin} disabled={isOpen}>
//         🟢 เปิดเช็คชื่อ
//       </button>
//       <button className="btn btn-danger m-2" onClick={handleCloseCheckin} disabled={!isOpen}>
//         🔴 ปิดเช็คชื่อ
//       </button>
//       <button className="btn btn-primary m-2" onClick={handleSaveCheckin}>
//         💾 บันทึกการเช็คชื่อ
//       </button>
//       <button className="btn btn-warning m-2" onClick={() => setShowQRCode(!showQRCode)}>
//         📌 แสดง QR Code
//       </button>

//       {showQRCode && (
//         <div className="mt-3">
//           <QRCode value={`https://yourapp.com/checkin/${cid}/${cno}`} size={150} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckinButton;

import React, { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, setDoc, collection, getDocs } from "firebase/firestore";
import QRCode from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";

const CheckinButton = ({ cid, cno }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const checkinRef = doc(db, `classroom/${cid}/checkin/${cno}`);

  const handleOpenCheckin = async () => {
    await setDoc(checkinRef, { status: 1 }, { merge: true });
    setIsOpen(true);
  };

  const handleCloseCheckin = async () => {
    await updateDoc(checkinRef, { status: 0 });
    setIsOpen(false);
  };

  const handleSaveCheckin = async () => {
    const studentsRef = collection(db, `classroom/${cid}/checkin/${cno}/students`);
    const scoresRef = collection(db, `classroom/${cid}/checkin/${cno}/scores`);

    const snapshot = await getDocs(studentsRef);
    snapshot.forEach(async (doc) => {
      await setDoc(doc.ref.parent.parent.collection("scores").doc(doc.id), {
        ...doc.data(),
        status: 1,
      });
    });

    alert("บันทึกการเช็คชื่อเรียบร้อยแล้ว!");
  };

  return (
    <div className="container text-center my-3">
      <button className="btn btn-success m-2" onClick={handleOpenCheckin} disabled={isOpen}>
        🟢 เปิดเช็คชื่อ
      </button>
      <button className="btn btn-danger m-2" onClick={handleCloseCheckin} disabled={!isOpen}>
        🔴 ปิดเช็คชื่อ
      </button>
      <button className="btn btn-primary m-2" onClick={handleSaveCheckin}>
        💾 บันทึกการเช็คชื่อ
      </button>
      <button className="btn btn-warning m-2" onClick={() => setShowQRCode(!showQRCode)}>
        📌 แสดง QR Code
      </button>
      {showQRCode && <QRCode value={`https://yourapp.com/checkin/${cid}/${cno}`} size={150} />}
    </div>
  );
};

export default CheckinButton;