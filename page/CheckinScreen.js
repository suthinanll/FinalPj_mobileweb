// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../firebase";
// import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
// import QRCode from "qrcode.react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const CheckinScreen = () => {
//   const { cid, cno } = useParams();
//   const navigate = useNavigate();
//   const [students, setStudents] = useState([]);
//   const [scores, setScores] = useState([]);
//   const [isCheckinOpen, setIsCheckinOpen] = useState(false);

//   // โหลดข้อมูลนักเรียนแบบ Real-time
//   useEffect(() => {
//     const studentsRef = collection(db, `classroom/${cid}/checkin/${cno}/students`);
//     const scoresRef = collection(db, `classroom/${cid}/checkin/${cno}/scores`);

//     const unsubscribeStudents = onSnapshot(studentsRef, (snapshot) => {
//       setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     });

//     const unsubscribeScores = onSnapshot(scoresRef, (snapshot) => {
//       setScores(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     });

//     return () => {
//       unsubscribeStudents();
//       unsubscribeScores();
//     };
//   }, [cid, cno]);

//   // เปิดเช็คชื่อ
//   const handleOpenCheckin = async () => {
//     setIsCheckinOpen(true);
//     alert("เปิดเช็คชื่อเรียบร้อย!");
//   };

//   // ปิดเช็คชื่อ
//   const handleCloseCheckin = async () => {
//     setIsCheckinOpen(false);
//     alert("ปิดเช็คชื่อเรียบร้อย!");
//   };

//   // บันทึกการเช็คชื่อ
//   const handleSaveCheckin = async () => {
//     const scoresRef = collection(db, `classroom/${cid}/checkin/${cno}/scores`);

//     try {
//       for (let student of students) {
//         await setDoc(doc(scoresRef, student.id), {
//           ...student,
//           status: 1,
//           score: 0,
//           remark: "",
//           timestamp: new Date().toISOString(),
//         });
//       }
//       alert("บันทึกการเช็คชื่อสำเร็จ!");
//     } catch (error) {
//       console.error("Error saving checkin:", error);
//     }
//   };

//   // ลบรายชื่อนักเรียนจากการเช็คชื่อ
//   const handleDeleteStudent = async (id) => {
//     if (window.confirm("คุณต้องการลบรายชื่อนี้หรือไม่?")) {
//       await deleteDoc(doc(db, `classroom/${cid}/checkin/${cno}/students`, id));
//     }
//   };

//   // อัปเดตคะแนนหรือหมายเหตุ
//   const handleUpdateScore = async (id, field, value) => {
//     await setDoc(doc(db, `classroom/${cid}/checkin/${cno}/scores`, id), { [field]: value }, { merge: true });
//   };

//   return (
//     <div className="container mt-4">
//       <h2>เช็คชื่อ วิชา: {cid} | เช็คชื่อครั้งที่ {cno}</h2>

//       {/* ปุ่มจัดการเช็คชื่อ */}
//       <div className="mb-3">
//         <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>ออก</button>
//         <button className="btn btn-success me-2" onClick={handleOpenCheckin}>เปิดเช็คชื่อ</button>
//         <button className="btn btn-warning me-2" onClick={handleCloseCheckin}>ปิดเช็คชื่อ</button>
//         <button className="btn btn-primary me-2" onClick={handleSaveCheckin}>บันทึกการเช็คชื่อ</button>
//         <button className="btn btn-info me-2">แสดงรหัสเช็คชื่อ</button>
//         <button className="btn btn-dark me-2">ถาม-ตอบ</button>
//       </div>

//       {/* QR Code วิชา */}
//       <div className="text-center mb-4">
//         <QRCode value={cid} size={200} />
//         <p className="mt-2">สแกนเพื่อเข้าร่วมวิชา</p>
//       </div>

//       {/* รายชื่อนักเรียนที่เช็คชื่อ */}
//       <h3>รายชื่อนักเรียน</h3>
//       <table className="table table-bordered">
//         <thead>
//           <tr>
//             <th>ลำดับ</th>
//             <th>รหัส</th>
//             <th>ชื่อ</th>
//             <th>หมายเหตุ</th>
//             <th>วันเวลา</th>
//             <th>จัดการ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student, index) => (
//             <tr key={student.id}>
//               <td>{index + 1}</td>
//               <td>{student.studentId}</td>
//               <td>{student.name}</td>
//               <td>{student.remark || "-"}</td>
//               <td>{new Date().toLocaleString()}</td>
//               <td>
//                 <button className="btn btn-danger btn-sm" onClick={() => handleDeleteStudent(student.id)}>ลบ</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ปุ่มแสดงคะแนน */}
//       <button className="btn btn-secondary my-3" data-bs-toggle="collapse" data-bs-target="#scoreTable">แสดงคะแนน</button>

//       {/* ตารางคะแนน */}
//       <div className="collapse" id="scoreTable">
//         <h3>คะแนนการเช็คชื่อ</h3>
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>ลำดับ</th>
//               <th>รหัส</th>
//               <th>ชื่อ</th>
//               <th>หมายเหตุ</th>
//               <th>วันเวลา</th>
//               <th>คะแนน</th>
//               <th>สถานะ</th>
//             </tr>
//           </thead>
//           <tbody>
//             {scores.map((student, index) => (
//               <tr key={student.id}>
//                 <td>{index + 1}</td>
//                 <td>{student.studentId}</td>
//                 <td>{student.name}</td>
//                 <td>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={student.remark || ""}
//                     onChange={(e) => handleUpdateScore(student.id, "remark", e.target.value)}
//                   />
//                 </td>
//                 <td>{new Date(student.timestamp).toLocaleString()}</td>
//                 <td>
//                   <input
//                     type="number"
//                     className="form-control"
//                     value={student.score || 0}
//                     onChange={(e) => handleUpdateScore(student.id, "score", parseInt(e.target.value))}
//                   />
//                 </td>
//                 <td>
//                   <select className="form-control" value={student.status} onChange={(e) => handleUpdateScore(student.id, "status", e.target.value)}>
//                     <option value="1">เช็คชื่อแล้ว</option>
//                     <option value="0">ยังไม่เช็คชื่อ</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* ปุ่มบันทึกข้อมูล */}
//         <button className="btn btn-primary" onClick={() => alert("บันทึกข้อมูลสำเร็จ!")}>บันทึกข้อมูล</button>
//       </div>
//     </div>
//   );
// };

// export default CheckinScreen;


document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const cid = urlParams.get("cid"); // รับค่า cid จาก URL

  if (!cid) {
      alert("ไม่มีรหัสวิชา!");
      return;
  }

  const checkinList = document.getElementById("checkin-list");
  const addCheckinButton = document.getElementById("add-checkin");

  // โหลดประวัติการเช็คชื่อ
  function loadCheckins() {
      checkinList.innerHTML = ""; // ล้างข้อมูลเก่า
      db.collection("classroom").doc(cid).collection("checkin")
          .orderBy("timestamp", "desc")
          .get()
          .then(snapshot => {
              snapshot.forEach(doc => {
                  const checkinData = doc.data();
                  const cno = doc.id;
                  const checkinDate = new Date(checkinData.timestamp?.toDate()).toLocaleString();

                  const row = document.createElement("tr");
                  row.innerHTML = `
                      <td>${cno}</td>
                      <td>${checkinDate}</td>
                      <td>
                          <a href="checkin_detail.html?cid=${cid}&cno=${cno}" class="btn btn-primary btn-sm">
                              ดูรายละเอียด
                          </a>
                      </td>
                  `;
                  checkinList.appendChild(row);
              });
          })
          .catch(error => console.error("Error loading checkins:", error));
  }

  // เพิ่มการเช็คชื่อใหม่
  addCheckinButton.addEventListener("click", function () {
      const checkinRef = db.collection("classroom").doc(cid).collection("checkin");
      checkinRef.get().then(snapshot => {
          const newCno = snapshot.size + 1; // เลขเช็คอินใหม่
          const newCheckin = {
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
          };

          checkinRef.doc(newCno.toString()).set(newCheckin)
              .then(() => {
                  // คัดลอกรายชื่อนักเรียนไปยัง checkin/{cno}/scores
                  const studentsRef = db.collection("classroom").doc(cid).collection("students");
                  studentsRef.get().then(studentSnapshot => {
                      studentSnapshot.forEach(studentDoc => {
                          const studentData = studentDoc.data();
                          db.collection("classroom").doc(cid).collection("checkin")
                              .doc(newCno.toString()).collection("scores")
                              .doc(studentDoc.id)
                              .set({ name: studentData.name, status: 0 });
                      });
                      loadCheckins(); // โหลดข้อมูลใหม่
                  });
              })
              .catch(error => console.error("Error creating checkin:", error));
      });
  });

  // โหลดข้อมูลเช็คชื่อเมื่อหน้าเว็บโหลด
  loadCheckins();
});