// import React, { useState, useEffect } from "react";
// import { db } from "../firebase";
// import { collection, query, onSnapshot } from "firebase/firestore";
// import "bootstrap/dist/css/bootstrap.min.css";

// const CheckinHistory = ({ cid }) => {
//   const [checkins, setCheckins] = useState([]);

//   useEffect(() => {
//     const q = query(collection(db, `classroom/${cid}/checkin`));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const checkinData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setCheckins(checkinData);
//     });

//     return () => unsubscribe();
//   }, [cid]);

//   return (
//     <div className="container">
//       <h3 className="text-center my-3">📌 ประวัติการเช็คชื่อ</h3>
//       <table className="table table-bordered">
//         <thead className="table-dark">
//           <tr>
//             <th>ลำดับ</th>
//             <th>วัน-เวลา</th>
//             <th>จำนวนนักเรียน</th>
//             <th>สถานะ</th>
//             <th>จัดการ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {checkins.length > 0 ? (
//             checkins.map((checkin, index) => (
//               <tr key={checkin.id}>
//                 <td>{index + 1}</td>
//                 <td>{checkin.timestamp}</td>
//                 <td>{checkin.totalStudents || 0}</td>
//                 <td>{checkin.status === 1 ? "✅ เสร็จสิ้น" : "⏳ กำลังเรียน"}</td>
//                 <td>
//                   <button className="btn btn-primary btn-sm">🔍 เช็คชื่อ</button>
//                   <button className="btn btn-success btn-sm ms-2">➕ เพิ่ม</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center">ไม่มีข้อมูล</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CheckinHistory;


import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

const CheckinHistory = ({ cid }) => {
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    const q = query(collection(db, `classroom/${cid}/checkin`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCheckins(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [cid]);

  return (
    <div className="container">
      <h3 className="text-center my-3">📌 ประวัติการเช็คชื่อ</h3>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ลำดับ</th>
            <th>วัน-เวลา</th>
            <th>จำนวนคนเข้าเรียน</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {checkins.map((checkin, index) => (
            <tr key={checkin.id}>
              <td>{index + 1}</td>
              <td>{checkin.timestamp}</td>
              <td>{checkin.totalStudents || 0}</td>
              <td>{checkin.status === 1 ? "✅ เสร็จสิ้น" : "⏳ กำลังเรียน"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckinHistory;