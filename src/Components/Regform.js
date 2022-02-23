import React from "react";
import { Button, Alert, Container, Form, Spinner } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
const Regform = () => {
  let navigate = useNavigate();
  let [username, updateusername] = useState("");
  let [errusername, errupdateusername] = useState("");
  let [email, updateEmail] = useState("");
  let [erremail, errupdateemail] = useState("");
  let [password, updatePassword] = useState("");
  let [errpassword, errupdatepassword] = useState("");
  let [cpassword, updatecpassword] = useState("");
  let [errcpassword, errupdatecpassword] = useState("");
  let [mpassword, match] = useState("");
  let [loding, setLoding] = useState(false);
  let [error,setError]=useState("")

  function handleUserName(event) {
    updateusername(event.target.value);
  }
  function handleemail(event) {
    updateEmail(event.target.value);
  }
  function handlepassword(event) {
    updatePassword(event.target.value);
  }
  function handlecpassword(event) {
    updatecpassword(event.target.value);
  }
  function handelclick(event) {
    event.preventDefault();
    if (username == "") {
      errupdateusername("Please Write User Name");
    } else if (email == "") {
      errupdateemail("Please Write Email");
    } else if (password == "") {
      errupdatepassword("Please Write Password");
    } else if (cpassword == "") {
      errupdatecpassword("Please Write Confirm Password");
    } else if (password != cpassword) {
      match("Password Not Match!");
    } else {
      setLoding(true);
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          console.log(user);
          updateusername("");
          errupdateusername("");
          updateEmail("");
          errupdateemail("");
          updatePassword("");
          errupdatepassword("");
          updatecpassword("");
          errupdatecpassword("");
          sendEmailVerification(auth.currentUser).then(() => {
         console.log("Mail Sent")
          });
          setLoding(false);
          navigate("/login", { state: "Account Created Successfully" });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if(errorCode.includes("email")){
          setError("Email Already Used")
          setLoding(false)
          }
          
        });
    }
  }
  return (
    <Container>
      <Alert variant="primary" className="text-center mt-5">
        <h1>Registration</h1>
      </Alert>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            onChange={handleUserName}
            type="email"
            placeholder="Enter User Name"
            value={username}
          />
          {errusername ? (
            <Form.Text className="text-muted err">{errusername}</Form.Text>
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={handleemail}
            type="email"
            placeholder="Enter email"
            value={email}
          />
          {erremail ? 
          (
            <Form.Text className="text-muted err">{erremail}</Form.Text>
          ) : 
          (
            ""
          )
          }
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={handlepassword}
            type="password"
            placeholder="Password"
            value={password}
          />
          {errpassword ? (
            <Form.Text className="text-muted err">{errpassword}</Form.Text>
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            onChange={handlecpassword}
            type="password"
            placeholder="Confirm Password"
            value={cpassword}
          />
          {errcpassword ? (
            <Form.Text className="text-muted err">{errcpassword}</Form.Text>
          ) : (
            ""
          )}
          {mpassword ? (
            <Form.Text className="text-muted err">{mpassword}</Form.Text>
          ) : (
            ""
          )}
          {error
          ?
          <Form.Text className="text-muted err">{error}</Form.Text>
          :
          ""
          }
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
            "Submit"
          )}
        </Button>
        <div className="text-center mt-3">
          <Form.Text id="passwordHelpBlock" muted>
            Already Have An Account? <Link to="/Login">Login</Link>
          </Form.Text>
        </div>
      </Form>
    </Container>
  );
};

export default Regform;
