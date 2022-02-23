import React from "react";
import {
  Button,
  Alert,
  Container,
  Form,
  Spinner,
  Modal,
} from "react-bootstrap";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  let navigate = useNavigate();
  let [currrntEmail, updateEmail] = useState("");
  let [errCurrrntEmail, errUpdateEmail] = useState("");
  let [currentPassword, updatePassword] = useState("");
  let [errCurrentPassword, errUpdatePassword] = useState("");
  let [value, updatevalue] = useState(true);
  let [loding, setLoding] = useState(false);
  let [reset,resetMail]=useState("")
  let [errreset,errresetMail]=useState("")
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { state } = useLocation();
  const notify = () => toast(state);
  const notify2 = () => toast("Mail Snet In Your Mail");
  if (value) {
    if (state) {
      notify();
      updatevalue(false);
    }
  }
 
  function handleemail(event) {
    updateEmail(event.target.value);
  }
  function handlepassword(event) {
    updatePassword(event.target.value);
  }
  const auth = getAuth();
  function handelclick(event) {
    event.preventDefault();
    if (currrntEmail == "") {
      errUpdateEmail("Please Write Email");
    } else if (currentPassword == "") {
      errUpdatePassword("Please Write Password");
    } else {
      setLoding(true);
      signInWithEmailAndPassword(auth, currrntEmail, currentPassword)
        .then((user) => {
          updateEmail("");
          updatePassword("");
          navigate("/", { state: "Login Successfully" });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
  }
  function handlereset(event) {
    resetMail(event.target.value);
  }
  function handleRestEmail(){
   if(reset == "")
   {
    errresetMail("Please Provide A Mail")
   }
    sendPasswordResetEmail(auth, reset)
    .then(() => {
      resetMail("")
      setShow(false)
      notify2()
      console.log(reset)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  }

  return (
    <Container>
      <ToastContainer />
      <Alert variant="primary" className="text-center mt-5">
        <h1>Login</h1>
      </Alert>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={handleemail}
            type="email"
            placeholder="Enter email"
            value={currrntEmail}
          />
          {errCurrrntEmail ? (
            <Form.Text className="text-muted err">{errCurrrntEmail}</Form.Text>
          ) : (
            ""
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={handlepassword}
            type="password"
            placeholder="Password"
            value={currentPassword}
          />
          {errCurrentPassword ? (
            <Form.Text className="text-muted err">
              {errCurrentPassword}
            </Form.Text>
          ) : (
            ""
          )}
        </Form.Group>
        <Button
          onClick={handelclick}
          className="w-100"
          variant="primary"
          type="submit"
        >
          {loding ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            "Login"
          )}
        </Button>
        <div className="text-center mt-3">
          <Form.Text id="passwordHelpBlock" muted>
            Already Have An Account?{" "}
            <Link to="/registration">Create A New Account</Link>
          </Form.Text>
        </div>
        <div className="text-center">
          <Form.Text id="passwordHelpBlock" muted>
            Forget Password?
            <Button variant="primary" onClick={handleShow}>
              Reset
            </Button>
          </Form.Text>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control onChange={handlereset} type="email" placeholder="Enter email" value={reset}/>
                {errreset
                
                ?
                <Form.Text className="text-muted err">{errreset}</Form.Text>
                :
                ""
                }
                
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose,handleRestEmail}>
               Reset
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
