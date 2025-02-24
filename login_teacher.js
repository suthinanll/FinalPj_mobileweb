const RB = ReactBootstrap;
const { Alert, Card, Button, Image, Modal, Form } = ReactBootstrap;

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

class AddClassroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      className: '',
      group: '',
      subject: '',
      room: '',
      imageUrl: '',
      error: '',
      loading: false
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: '' });

    const { className, group, subject, room, imageUrl } = this.state;

    try {
      
      const docRef = await firebase.firestore().collection("classroom").add({
        className,
        group,
        subject,
        room,
        imageUrl,
        createdAt: new Date()
      });
      this.props.onClassroomAdded();
      this.props.handleClose();
      this.setState({ className: '', group: '', subject: '', room: '', imageUrl: '' });
    } catch (error) {
      this.setState({ error: 'เกิดข้อผิดพลาดในการเพิ่มห้องเรียน: ' + error.message });
    }
    this.setState({ loading: false });
  };

  render() {
    const { show, handleClose } = this.props;
    const { className, group, subject, room, imageUrl, error, loading } = this.state;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มวิชา</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ชื่อห้องเรียน</Form.Label>
              <Form.Control
                type="text"
                name="className"
                value={className}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>กลุ่มเรียน</Form.Label>
              <Form.Control
                type="text"
                name="group"
                value={group}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>วิชา</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={subject}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ห้อง</Form.Label>
              <Form.Control
                type="text"
                name="room"
                value={room}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL รูปภาพ</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={imageUrl}
                onChange={this.handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

class App extends React.Component {
  state = {
    user: null,
    showAddClassroomModal: false
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
        window.location.href = "dashboard.html";
      })
      .catch((error) => console.error("Login Error:", error));
  }

  logout() {
    const confirmLogout = window.confirm("คุณต้องการออกจากระบบหรือไม่?");
    if (confirmLogout) {
      firebase.auth().signOut()
        .then(() => this.setState({ user: null }))
        .catch((error) => console.error("Logout Error:", error));
    }
  }

  toggleAddClassroomModal = () => {
    this.setState((prevState) => ({
      showAddClassroomModal: !prevState.showAddClassroomModal
    }));
  };

  handleClassroomAdded = () => {
    console.log('Classroom added');
  };

  render() {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow p-5 bg-white rounded" style={{ width: '400px' }}>
          <Card.Header className="text-center">
            <Alert variant="info">
              <b className="fs-3">Login RoomClass</b>
            </Alert>
          </Card.Header>
          <Card.Body>
            {this.state.user ? (
              <div className="text-center">
                <Image src={this.state.user.photoURL} roundedCircle style={{ width: '100px', height: '100px' }} />
                <p>{this.state.user.displayName}</p>
                <Button variant="danger" onClick={() => this.logout()} className="w-100">Logout</Button>
                <Button variant="primary" onClick={this.toggleAddClassroomModal} className="mt-3 w-100">
                  เพิ่มห้องเรียน
                </Button>
              </div>
            ) : (
              <Button
                variant="light"
                onClick={() => this.login()}
                className="w-100 shadow-sm"
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
        <AddClassroom
          show={this.state.showAddClassroomModal}
          handleClose={this.toggleAddClassroomModal}
          onClassroomAdded={this.handleClassroomAdded}
        />
      </div>
    );
  }
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);




