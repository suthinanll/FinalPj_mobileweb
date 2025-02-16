const RB = ReactBootstrap;
const { Alert, Card, Button, Image } = ReactBootstrap;

const firebaseConfig = {
    apiKey: "AIzaSyD3fKnhvyVNEWgE6lmgRtVsBZFSBjJdOOA",
    authDomain: "project-finalmbw.firebaseapp.com",
    projectId: "project-finalmbw",
    storageBucket: "project-finalmbw.firebasestorage.app",
    messagingSenderId: "742173296191",
    appId: "1:742173296191:web:91474e78e2c39275725a8a",
    measurementId: "G-MNXL2CMT5S"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

class App extends React.Component {
    state = {
        user: null,
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({ user });
        });
    }

    login() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                this.setState({ user: result.user });
                // เปลี่ยนไปยังหน้าว่างหลังจากล็อกอิน
                window.location.href = "blank.html"; // ชื่อไฟล์ HTML ที่ต้องการไป
            })
            .catch((error) => console.error("Login Error:", error));
    }

    logout() {
        // ใช้ confirm เพื่อถามการยืนยัน
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            firebase.auth().signOut()
                .then(() => this.setState({ user: null }))
                .catch((error) => console.error("Logout Error:", error));
        }
    }

    render() {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Card className="shadow p-5 bg-white rounded" style={{ width: '400px' }}>
                    <Card.Header className="text-center">
                        <Alert variant="info">
                            <b className="fs-3">Login Page</b>
                        </Alert>
                    </Card.Header>
                    <Card.Body>
                        {this.state.user ? (
                            <div className="text-center">
                                <Image src={this.state.user.photoURL} roundedCircle style={{ width: '100px', height: '100px' }} />
                                <p>{this.state.user.displayName}</p>
                                <Button variant="danger" onClick={() => this.logout()} className="w-100">Logout</Button>
                            </div>
                        ) : (
                            <Button
                                variant="light"
                                onClick={() => this.login()}
                                className="w-100 shadow-sm"  // class สำหรับเงา
                                style={{
                                    backgroundColor: 'white',
                                    borderColor: '#ccc',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <img
                                    src="./image/Google__G__logo.svg.png"
                                    alt="Google Logo"
                                    style={{ width: '20px', marginRight: '10px' }}
                                />
                                Login with Google
                            </Button>
                        )}
                    </Card.Body>
                    <Card.Footer className="text-center">
                        <small>Khon Kaen University</small>
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);
