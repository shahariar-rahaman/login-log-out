import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../firebaseConfig";
import { getAuth, signOut,onAuthStateChanged } from "firebase/auth";
import { Container,Alert } from "react-bootstrap";

const Home = () => {
  let navigate = useNavigate();
  let [value, uValue] = useState(true);
  let { state } = useLocation();
  const auth = getAuth();
  let [verify,verifyValue]=useState(false)
  const notify = () => toast("Log Out Sccuessfully");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if(user.emailVerified){
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
  setTimeout(() => {
    uValue(false);
  }, 2000);
  return (
    <Container>
      {value ? (
        <Alert variant="primary" className="text-center mt-5">
          <h1>{state}</h1>
        </Alert>
      ) : (
        ""
      )}
      {verify
      
      ?
      <button onClick={handleOut}>Log Out</button>
      :
      <>
      <button onClick={handleOut}>Log Out</button>
      <button >Please Verify</button>
      </>
      } 
    </Container>
  );
};

export default Home;
