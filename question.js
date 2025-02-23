// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3fKnhvyVNEWgE6lmgRtVsBZFSBjJdOOA",
    authDomain: "project-finalmbw.firebaseapp.com",
    projectId: "project-finalmbw",
    storageBucket: "project-finalmbw.firebasestorage.app",
    messagingSenderId: "742173296191",
    appId: "1:742173296191:web:91474e78e2c39275725a8a",
    measurementId: "G-MNXL2CMT5S"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function QuestionForm() {
    const [questions, setQuestions] = React.useState([]);
    const [newQuestionNo, setNewQuestionNo] = React.useState("");
    const [newQuestionText, setNewQuestionText] = React.useState("");

    //สมมติ
    const cid = "class1";  
    const cno = "checkin1"; 

    // ดึงคำถามจาก Firestore
    React.useEffect(() => {
        const unsubscribe = db.collection("classroom").doc(cid)
            .collection("checkin").doc(cno)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    setQuestions(data.questions || []);
                }
            });

        return () => unsubscribe();
    }, []);

    // เพิ่มคำถามใหม่
    const addQuestion = async () => {
        if (!newQuestionNo || !newQuestionText.trim()) {
            alert("⚠️ กรุณากรอกข้อมูลให้ครบถ้วน!");
            return;
        }

        const updatedQuestions = [...questions, {
            question_no: newQuestionNo,
            question_text: newQuestionText,
            question_show: true
        }];

        await db.collection("classroom").doc(cid)
            .collection("checkin").doc(cno)
            .set({ questions: updatedQuestions }, { merge: true });

        setNewQuestionNo("");
        setNewQuestionText("");
    };

    // ปิดคำถาม
    const hideQuestion = async (qno) => {
        const updatedQuestions = questions.map(q =>
            q.question_no === qno ? { ...q, question_show: false } : q
        );

        await db.collection("classroom").doc(cid)
            .collection("checkin").doc(cno)
            .set({ questions: updatedQuestions }, { merge: true });
    };

    return (
        <div className="card shadow p-4" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-center text-primary">📚 ตั้งคำถามในห้องเรียน</h2>

            {/* ฟอร์มเพิ่มคำถาม */}
            <div className="mb-3">
                <label className="form-label">ข้อที่</label>
                <input
                    type="number"
                    className="form-control"
                    value={newQuestionNo}
                    onChange={(e) => setNewQuestionNo(e.target.value)}
                    placeholder="ใส่หมายเลขคำถาม"
                    min="1"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">ข้อความคำถาม</label>
                <textarea
                    className="form-control"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="ใส่ข้อความคำถาม"
                    rows="3"
                ></textarea>
            </div>

            <button className="btn btn-success w-100 mb-3" onClick={addQuestion}>✅ เพิ่มคำถาม</button>

            {/* รายการคำถาม */}
            {questions.map((q, index) => (
                <div key={index} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">📌 คำถาม: {q.question_no}. {q.question_text}</h5>
                        {q.question_show ? (
                            <button className="btn btn-danger w-100" onClick={() => hideQuestion(q.question_no)}>
                                ❌ ปิดคำถาม
                            </button>
                        ) : (
                            <span className="badge bg-secondary">คำถามถูกปิดแล้ว</span>
                        )}
                        <StudentAnswers qno={q.question_no} />
                    </div>
                </div>
            ))}
        </div>
    );
}

// แสดงคำตอบแบบเรียลไทม์
function StudentAnswers({ qno }) {
    const [answers, setAnswers] = React.useState([]);

    React.useEffect(() => {
        const unsubscribe = db.collection("classroom").doc("class1")
            .collection("checkin").doc("checkin1")
            .collection("answers").doc(qno.toString())
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data().students || {};
                    const formattedAnswers = Object.keys(data).map(stdid => ({
                        id: stdid,
                        text: data[stdid].text,
                        time: data[stdid].time
                    }));
                    setAnswers(formattedAnswers);
                }
            });

        return () => unsubscribe();
    }, [qno]);

    return (
        <div className="mt-3">
            <h6 className="text-secondary">คำตอบของนักเรียน (ข้อ {qno})</h6>
            <ul className="list-group">
                {answers.length > 0 ? answers.map(ans => (
                    <li key={ans.id} className="list-group-item">
                        <p className="m-0">💬 {ans.text}</p>
                        <small className="text-muted">⏰ {ans.time}</small>
                    </li>
                )) : <p className="text-muted">ยังไม่มีคำตอบ</p>}
            </ul>
        </div>
    );
}

ReactDOM.render(<QuestionForm />, document.getElementById("root"));