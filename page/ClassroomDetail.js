import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import QRCode from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";
import QRCodeGenerator from "../components/QRCodeGenerator";

const ClassroomDetail = () => {
  const { cid } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [checkins, setCheckins] = useState([]);

  // โหลดข้อมูลห้องเรียน
  useEffect(() => {
    const fetchClassroomData = async () => {
      const studentsRef = collection(db, `classroom/${cid}/students`);
      const checkinRef = collection(db, `classroom/${cid}/checkin`);

      try {
        const studentsSnap = await getDocs(studentsRef);
        setStudents(studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const checkinSnap = await getDocs(checkinRef);
        setCheckins(checkinSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching classroom data:", error);
      }
    };

    fetchClassroomData();
  }, [cid]);

  // สร้างการเช็คชื่อใหม่
  const handleAddCheckin = async () => {
    const checkinNumber = checkins.length + 1;
    const newCheckinRef = doc(db, `classroom/${cid}/checkin`, `checkin${checkinNumber}`);

    try {
      await setDoc(newCheckinRef, { datetime: new Date().toISOString(), studentCount: students.length, status: "กำลังเรียน" });

      // คัดลอกรายชื่อนักเรียนไปที่ checkin/{cno}/scores
      for (let student of students) {
        await setDoc(doc(db, `classroom/${cid}/checkin/checkin${checkinNumber}/scores`, student.id), {
          name: student.name,
          studentId: student.studentId,
          status: 0
        });
      }

      alert("เพิ่มการเช็คชื่อสำเร็จ!");
      setCheckins(prev => [...prev, { id: `checkin${checkinNumber}`, datetime: new Date().toISOString(), studentCount: students.length, status: "กำลังเรียน" }]);
    } catch (error) {
      console.error("Error adding checkin:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>รายละเอียดวิชา: {cid}</h2>

      {/* QR Code สำหรับลงทะเบียน */}
      <div className="mb-4 text-center">
        <QRCode value={cid} size={200} />
        <p className="mt-2">สแกนเพื่อเข้าร่วมวิชา</p>
      </div>
      {/* ปุ่มแสดง QR Code */}
      <button className="btn btn-dark" onClick={() => setShowQRCode(!showQRCode)}>
        {showQRCode ? "ซ่อน QR Code" : "แสดง QR Code"}
      </button>

      {/* แสดง QR Code เมื่อกดปุ่ม */}
      {showQRCode && <QRCodeGenerator text={`https://yourapp.com/register/${cid}`} />}
      
      {/* รายชื่อนักเรียน */}
      <h3>รายชื่อนักเรียน</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>รหัส</th>
            <th>ชื่อ</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>✓</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ปุ่มเพิ่มการเช็คชื่อ */}
      <button className="btn btn-success mb-3" onClick={handleAddCheckin}>เพิ่มการเช็คชื่อ</button>

      {/* แสดงประวัติการเช็คชื่อ */}
      <h3>ประวัติการเช็คชื่อ</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>วัน-เวลา</th>
            <th>จำนวนคนเข้าเรียน</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {checkins.map((checkin, index) => (
            <tr key={checkin.id}>
              <td>{index + 1}</td>
              <td>{new Date(checkin.datetime).toLocaleString()}</td>
              <td>{checkin.studentCount}</td>
              <td>{checkin.status}</td>
              <td>
                <button className="btn btn-primary btn-sm">[เช็คชื่อ]</button>
                <button className="btn btn-secondary btn-sm ms-2">[เพิ่ม]</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassroomDetail;
