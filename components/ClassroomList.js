import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();

  // โหลดข้อมูลห้องเรียนจาก Firestore (อัปเดตแบบ Real-time)
  useEffect(() => {
    const classroomsRef = collection(db, "classroom");
    const unsubscribe = onSnapshot(classroomsRef, (snapshot) => {
      setClassrooms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mt-4">
      <h2>📚 รายวิชาทั้งหมด</h2>

      {/* ตารางรายวิชา */}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>รหัสวิชา</th>
            <th>ชื่อวิชา</th>
            <th>รูปภาพ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((classroom) => (
            <tr key={classroom.id}>
              <td>{classroom.id}</td>
              <td>{classroom.name}</td>
              <td>
                {classroom.image ? (
                  <img src={classroom.image} alt="Classroom" width="100" height="60" />
                ) : (
                  "ไม่มีภาพ"
                )}
              </td>
              <td>
                <button className="btn btn-primary me-2" onClick={() => navigate(`/classroom/${classroom.id}`)}>
                  ดูรายละเอียด
                </button>
                <button className="btn btn-dark" onClick={() => alert(`QR Code สำหรับ ${classroom.id}`)}>
                  แสดง QR Code
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassroomList;
