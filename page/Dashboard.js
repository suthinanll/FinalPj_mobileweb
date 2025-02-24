import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassrooms = async () => {
      const querySnapshot = await getDocs(collection(db, "classroom"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClassrooms(data);
    };

    fetchClassrooms();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📚 รายวิชาในห้องเรียน</h2>
      <div className="row">
        {classrooms.map((classroom) => (
          <div key={classroom.id} className="col-md-4">
            <div className="card shadow-sm mb-4">
              <img src={classroom.image} className="card-img-top" alt={classroom.name} />
              <div className="card-body">
                <h5 className="card-title">{classroom.name}</h5>
                <p className="card-text">รหัสวิชา: {classroom.id}</p>
                <button className="btn btn-primary me-2" onClick={() => navigate(`/classroom/${classroom.id}`)}>
                  🏫 จัดการห้องเรียน
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedQR(classroom.id)}>
                  📌 แสดง QR Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedQR && (
        <div className="text-center mt-4">
          <h5>🔗 QR Code สำหรับ {selectedQR}</h5>
          <QRCode value={`https://yourapp.com/register/${selectedQR}`} size={150} />
          <br />
          <button className="btn btn-danger mt-2" onClick={() => setSelectedQR(null)}>
            ❌ ปิด
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
