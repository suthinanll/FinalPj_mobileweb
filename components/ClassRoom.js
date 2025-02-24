// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Sample Classroom Data (Replace with dynamic data as needed)
const classId = "CS101";
const className = "Computer Science 101";
document.getElementById("class-id").textContent = classId;
document.getElementById("class-name").textContent = className;

// Generate QR Code
const generateQRCode = () => {
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
        text: classId,
        width: 128,
        height: 128
    });
};

document.getElementById("generate-qrcode").addEventListener("click", generateQRCode);

// Show Student List (Fetching from Firestore)
document.getElementById("show-student-list").addEventListener("click", async () => {
    const studentList = await db.collection(`classroom/${classId}/students`).get();
    console.log("Student List:", studentList.docs.map(doc => doc.data()));
});

// Add Check-in
let checkinCount = 1;
document.getElementById("add-checkin").addEventListener("click", async () => {
    const checkinRef = db.collection(`classroom/${classId}/checkin`).doc(`checkin${checkinCount}`);
    const studentsRef = db.collection(`classroom/${classId}/students`).get();
    
    const students = (await studentsRef).docs.map(doc => ({ id: doc.id, ...doc.data(), status: 0 }));
    await checkinRef.set({ date: new Date().toISOString(), students });
    checkinCount++;
    alert("เพิ่มการเช็คชื่อเรียบร้อยแล้ว!");
    loadCheckinHistory();
});

// Load Check-in History
const loadCheckinHistory = async () => {
    const checkins = await db.collection(`classroom/${classId}/checkin`).get();
    const checkinHistory = document.getElementById("checkin-history");
    checkinHistory.innerHTML = "";
    checkins.docs.forEach((doc, index) => {
        const data = doc.data();
        const row = `<tr>
            <td>${index + 1}</td>
            <td>${new Date(data.date).toLocaleString()}</td>
            <td>${data.students.length}</td>
            <td>กำลังเรียน</td>
            <td><button onclick="viewCheckin('${doc.id}')">[เช็คชื่อ]</button></td>
        </tr>`;
        checkinHistory.innerHTML += row;
    });
};

document.addEventListener("DOMContentLoaded", loadCheckinHistory);
