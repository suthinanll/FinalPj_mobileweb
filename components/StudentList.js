import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentList = ({ cid }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const q = query(collection(db, `classroom/YOUR_CID/students`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(studentData);
    });

    return () => unsubscribe();
  }, [cid]);

  const handleDelete = async (studentId) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายชื่อนี้?")) {
      await deleteDoc(doc(db, `classroom/${cid}/students`, studentId));
    }
  };

  return (
    <div className="container">
      <h3 className="text-center my-3">📜 รายชื่อนักเรียน</h3>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ลำดับ</th>
            <th>รหัส</th>
            <th>ชื่อ</th>
            <th>รูปภาพ</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>
                  <img src={student.photoUrl} alt="profile" width="50" height="50" className="rounded-circle" />
                </td>
                <td>{student.status ? "✔ เข้าเรียน" : "❌ ไม่เข้าเรียน"}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)}>
                    🗑 ลบ
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">ไม่มีข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
