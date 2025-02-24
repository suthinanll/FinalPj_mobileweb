import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./addstudent.css"; 

const firebaseConfig = {
    apiKey: "AIzaSyD3fKnhvyVNEWgE6lmgRtVsBZFSBjJdOOA",
    authDomain: "project-finalmbw.firebaseapp.com",
    projectId: "project-finalmbw",
    storageBucket: "project-finalmbw.firebasestorage.app",
    messagingSenderId: "742173296191",
    appId: "1:742173296191:web:91474e78e2c39275725a8a",
    measurementId: "G-MNXL2CMT5S"
};

// 🔥 ลบ `firebase.initializeApp(firebaseConfig);` ออก
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // 🔥 เพิ่มตัวแปรนี้

const AddStudent = () => {
    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [year, setYear] = useState("year1");
    const [branch, setBranch] = useState("it");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const collectionName = `${branch}${year}`;

        try {
            await addDoc(collection(db, collectionName), { name, studentId, year, branch });
            alert("เพิ่มนักศึกษาเรียบร้อยแล้ว!");
            setName("");
            setStudentId("");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <div className="container form-container">
            <h2 className="text-center">เพิ่มรายชื่อนักศึกษา</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">ชื่อ-นามสกุล</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">รหัสนักศึกษา</label>
                    <input type="text" className="form-control" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">เลือกชั้นปี</label>
                    <div>
                        <input type="radio" name="year" value="year1" checked={year === "year1"} onChange={() => setYear("year1")} /> ปี 1
                        <input type="radio" name="year" value="year2" checked={year === "year2"} onChange={() => setYear("year2")} /> ปี 2
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">เลือกสาขา</label>
                    <div>
                        <input type="radio" name="branch" value="it" checked={branch === "it"} onChange={() => setBranch("it")} /> IT
                        <input type="radio" name="branch" value="cs" checked={branch === "cs"} onChange={() => setBranch("cs")} /> CS
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">เพิ่มนักศึกษา</button>
            </form>
        </div>
    );
};

// 🔥 ตรวจสอบว่า `root` มีอยู่จริง
const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<AddStudent />);
} else {
    console.error("ไม่พบ #root ใน addstudent.html");
}

export default AddStudent;
