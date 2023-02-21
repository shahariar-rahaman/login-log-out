import React, { useEffect, useState } from "react";
import {
  DropdownButton,
  Dropdown,
  ButtonGroup,
  ListGroup,
  Form,
  Button,
  Modal,
  ProgressBar,
  Row,Col
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, set,remove } from "firebase/database";
import {
  getStorage,
  ref as refer,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useDispatch } from "react-redux";


const Left = (props) => {
  let activ = useDispatch()
  // console.log(props)
  let [frndData,upFrndData] = useState([])
  let [progress, upProgress] = useState("");
  let [pic, upPic] = useState("");
  let [file, changeFile] = useState("");
  let [active, upActive] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [arr, upArr] = useState([]);
  const auth = getAuth();
  // console.log(auth.currentUser.uid)
  let navigate = useNavigate();
  const notify = () => toast("Log Out Sccuessfully");
  let handleActive = (itemsid) => {
    upActive(itemsid);
    activ({type: "ACTIVE_USER",payload:itemsid})
  };

  let handleOut = () => {
    signOut(auth)
      .then(() => {
        notify();
        navigate("/login");
      })
      .catch((error) => {});
  };
  // let handlePic = (event) => {
  //   console.log(event);
  // };
  // let arry = [];
  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      // console.log(snapshot);
      snapshot.forEach((items) => {
        // console.log(items.key)
        // console.log(props.id)
        if (props.id == items.key) {
          upPic(items.val().photo)
        }
        // else{
        //   upPic(items.val().photo)
        // }
      });
      // upArr(arry);
      // console.log(arry)
    });
  }, [props.id]);
  
  let frnd = [] 
  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, "friends/");
    onValue(userRef, (snapshot) => {
      snapshot.forEach((items) => {
        frnd.push(items.val())
        });
        upFrndData(frnd) 
        console.log(frnd)
    });
    
  }, []);
 
 
  let handleFile = (event) => {
    changeFile(event.target.files[0]);
  };
  let handleUpload = () => {
    const storage = getStorage();
    const storageRef = refer(storage, `images/${auth.currentUser.uid}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        upProgress(progress);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          const db = getDatabase();
          set(ref(db, "users/" + auth.currentUser.uid ), {
            photo: downloadURL,
            name:props.username,
            email:props.email,
            id:props.id,
            time:props.time
          });
        });
      }
    );
  };
  let handleDelete = (id)=>{
        console.log(id)
    const db = getDatabase();
    remove(ref(db, 'friends/'+ id))
  
  }
  return (
    <div className="left">
      <img className="img" src={pic} />
      <br />
      <DropdownButton
        as={ButtonGroup}
        id={`dropdown-variants-waning`}
        variant="warning"
        title={props.username}
        className="down"
      >
        <Dropdown.Item eventKey="1">Action</Dropdown.Item>
        <Dropdown.Item
          className="w-100"
          variant="primary"
          onClick={handleShow}
        >
          Change Profiel Picture
        </Dropdown.Item>
        <Dropdown.Item eventKey="3" active>
          Active Item
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item eventKey="4" onClick={handleOut}>
          Log Out
        </Dropdown.Item>
      </DropdownButton>
      <h3 className="mt-5">Friends</h3>
      {frndData.map((items,i) => (
        <ListGroup key={i}>
        {items.JReqAcceptKorse == auth.currentUser.uid
        ?
        <ListGroup.Item style={active == items.JReqDise ? act : noAct} onClick={() => handleActive(items.JReqDise)}>
        <Row><Col md={4}>
        <img className="w-50" src={items.photo}></img>
        </Col>
        <Col  md={8}>
          <Row>
          <Col md={4}>
          <h4>{items.JReqDiseTarName}</h4>
          </Col>
          <Col md={8}>
          <Button onClick={()=>handleDelete(items.JReqAcceptKorse)}>Delete</Button>
          </Col>
          </Row>
        </Col>
        </Row>
        </ListGroup.Item> 
        :
        items.JReqDise == auth.currentUser.uid
        ? 
        <ListGroup.Item style={active == items.JReqAcceptKorse ? act : noAct} onClick={() => handleActive(items.JReqAcceptKorse)}>
        <Row><Col md={4}>
        <img className="w-50" src={items.JAcceptKorsePic}></img>
        </Col>
       <Col md={8}>
       <Row><Col md={4}>
       <h4>{items.JReqAcceptKorseTarName}</h4>
       </Col>
       <Col md={8}>
       <Button onClick={()=>handleDelete(items.JReqDise)}>Delete</Button>
       </Col>
       </Row>
        
        </Col>
        </Row>
        </ListGroup.Item> 
        :
        ""
        }
        </ListGroup>
      ))}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body onChange={handleFile}>
          <Form.Control type="file"/>
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
    </div>
  );
};
let act = {
  color: "red"
}
let noAct = {
  color: "#000"
}

export default Left;
