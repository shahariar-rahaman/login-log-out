import React, { useEffect } from "react";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import { useState } from "react";
import {
  Form,
  Button,
  Modal,
  ProgressBar,
  Card,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import {
  getStorage,
  ref as refer,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import moment from "moment";
const Middle = () => {
  let auth = getAuth();
  let usedata = useSelector((items) => items.activeuser.id);
  // console.log(usedata);
  let [message, upMessage] = useState("");
  let [auto, upAuto] = useState(false);
  let [message2, upMessage2] = useState([]);
  let [pic, upPic] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [file, changeFile] = useState("");
  let [progress, upProgress] = useState("");

  let haldleSms = () => {
    // upCondation(false);
    // console.log("j message dice", auth.currentUser.uid);
    // console.log("j message pace", usedata);
    let time = moment().format("LLL");
    const db = getDatabase();
    set(push(ref(db, "message/")), {
      message: message,
      sender: auth.currentUser.uid,
      reciver: usedata,
      name: auth.currentUser.displayName,
      photo: pic,
      time: time,
    });
    upMessage("");
    upAuto(!auto);
  };
  let handleFile = (event) => {
    changeFile(event.target.files[0]);
  };
  let inpuText = (event) => {
    upMessage(event.target.value);
  };
  let handleUpload = () => {
    const storage = getStorage();
    const storageRef = refer(storage, `images/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        upProgress(progress);
        // console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            // console.log("Upload is paused");
            break;
          case "running":
            // console.log("Upload is running");
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // upUrl(downloadURL);
          let time = moment().format("LLL");
          const db = getDatabase();
          set(push(ref(db, "message/")), {
            image: downloadURL,
            sender: auth.currentUser.uid,
            reciver: usedata,
            name: auth.currentUser.displayName,
            photo: pic,
            time: time,
          });
        });
      }
    );
  };

  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, "message/");
    onValue(starCountRef, (snapshot) => {
      let megarr = [];
      snapshot.forEach((items) => {
        megarr.push(items.val());
      });
      upMessage2(megarr);
      // console.log(megarr);
    });
  }, [auto]);

  let picArr = [];
  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      snapshot.forEach((items) => {
        if (items.key == auth.currentUser.uid) {
          picArr.push(items.val().photo);
        }
      });
      upPic(picArr[0]);
      // console.log(picArr[0]);
    });
  }, [auto]);
  return (
    <>
      <div className="middle">
        {message2.map((items,i) =>
          items.reciver == usedata || items.sender == usedata ? (
            <Card key={i}
              className="mt-5 round"
              style={items.sender == auth.currentUser.uid ? sender : reciver}
            >
              <Row>
                <Col xs={6} md={2}>
                  <Card.Img variant="top" className="image" src={items.photo} />
                </Col>
                <Col xs={12} md={10}>
                  <Card.Title className="text text-justify">
                    {items.name}
                  </Card.Title>
                  <p>{items.time}</p>
                </Col>
              </Row>
              <Card.Body className="brder">
                <Card.Text>
                    <img className="w-25" src={items.image}></img>
                    <span>{items.message}</span>
                </Card.Text>
              </Card.Body>
            </Card>
          ) : (
            ""
          )
        )}
      </div>
      <Form.Control onChange={inpuText} type="email" value={message} />
      <Button className="w-50" onClick={haldleSms}>
        Send
      </Button>
      <Button className="w-50" variant="primary" onClick={handleShow}>
        File
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body onChange={handleFile}>
          <Form.Control type="file" />
        </Modal.Body>
        {progress ? <ProgressBar now={progress} label={`${progress}%`} /> : ""}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
let sender = {
  background: "dimgray",
  width: "400px",
  color: "black",
  marginRight: "auto",
};
let reciver = {
  background: "pink",
  width: "400px",
  color: "black",
  marginLeft: "auto",
};

export default Middle;
