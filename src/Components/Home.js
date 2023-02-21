import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../firebaseConfig";
import Left from "./Left";
import Middle from "./Middle";
import Right from "./Right";
import { getAuth, signOut,onAuthStateChanged } from "firebase/auth";
import { Container,Alert, Row,Col } from "react-bootstrap";
import {
  Button
} from "react-bootstrap";

const Home = () => {
  let [userName,updateUser]=useState("")
  let navigate = useNavigate();
  let [time,updateTime] = useState("")
  let [img,upImg] = useState("");
  let [userId, upUserId] = useState("");
  let [email,upEmail]=useState("")
  let { state } = useLocation();
  const auth = getAuth();
  let [verify,verifyValue]=useState(true) 
  const notify = () => toast("Log Out Sccuessfully");
  const notify2 = () => toast(state)
  // let loadPage=()=>{
  //   notify2()
  // }
  onAuthStateChanged(auth, (user) => {
    if (user) {
    // console.log(user)
      upUserId(user.uid)
      updateTime(user.metadata.creationTime)
      updateUser(user.displayName)
      upImg(user.photoURL)
      upEmail(user.email)
      // console.log(user.photoURL)
    // console.log(user)
      if(user.emailVerified == true){   
        verifyValue(true)
      }
      const uid = user.uid;
    } else {

    }
  });
  
  let handleOut = () => {

    signOut(auth)
      .then(() => {
        notify()
        navigate("/login");
      })
      .catch((error) => {
      });
  };

  return (
  <>
    <Container fluid>
    <Row><Col>
      {verify
      
      ?
      <Row onPlay={notify2}>
       {/* <ToastContainer /> */}
        <Col lg={3}><Left username={userName} img={img} id={userId} email={email} time={time}/></Col>
        <Col lg={6}><Middle/></Col>
        <Col lg={3}><Right time={time} id={userId} img={img}/></Col>
      </Row>
      :
      <>
      <Button onClick={handleOut}>Log Out</Button>
      <Button >Please Verify</Button>
      </>
      } 
    </Col>
    </Row>
    </Container>
    </>
      
  );
};

export default Home;
