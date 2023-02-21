import React, { useEffect, useState } from "react";
import { ListGroup,Button,Row,Col } from "react-bootstrap";
import moment from "moment";
import { getDatabase, ref, onValue,set,push, remove } from "firebase/database";
import { getAuth} from "firebase/auth";
const Right = (props) => {
  let [req,upreq] = useState([])
  let auth = getAuth();
  let [pic, upPic] = useState([]);
  let [reqCondation,upReqCondation]=useState(true)
  // console.log(auth)
  let [userName, upUserName] = useState([]);
  let [auto, upAuto] = useState(false);

  let userArr = [];
  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      snapshot.forEach((items) => {
      if(props.id !== items.key){
        userArr.push(items.val());
      }
     
      });
      upUserName(userArr)
      
    });
    // console.log(currentUser)
    // console.logg(userName)
  }, [props.id]);

  
  let handleReq = (id,photo)=>{
    // if(id !== )
    console.log(id)
    console.log(photo)
      const db = getDatabase();
      set(ref(db, 'request/'+auth.currentUser.uid), {
      username: auth.currentUser.displayName,
      Jakpataice: id,
      Jpathaice:auth.currentUser.uid,
      photo:pic,
      JAcceptKorseTarPhoto:photo
    });
    upAuto(!auto)
  }
  
  let reqArr = []
  useEffect(()=>{
    const db = getDatabase();
    const starCountRef = ref(db, 'request/');
    onValue(starCountRef, (snapshot) => {
      snapshot.forEach((items)=>{
      // console.log(items)
      // console.log(props.id)
      // console.log(items.val())
        if(props.id !== items.key){
          reqArr.push(items.val());
        }
      })
      upreq(reqArr)
    });
  },[props.id])

  let picArr = []
  useEffect(()=>{
    const db = getDatabase();
    const starCountRef = ref(db, 'users/');
    onValue(starCountRef, (snapshot) => {
     snapshot.forEach((items)=>{
      if(items.key == auth.currentUser.uid)
      {
        picArr.push(items.val().photo)
      }
     
     })
      upPic(picArr[0])
      // console.log(picArr[0])
    })
  
  },[auto])
  
  let currentPic = []
  let handleAccept =(name,id,photo)=>{
    upReqCondation(false)
  // console.log(name)
  // console.log(id)
  // console.log(photo)
  // console.log(auth.currentUser.uid)
  const db = getDatabase();
    const starCountRef = ref(db, 'users/');
    onValue(starCountRef, (snapshot) => {
     snapshot.forEach((items)=>{
      if(items.key == auth.currentUser.uid)
      {
        currentPic.push(items.val().photo)
      }
     
     })
      set(ref(db, 'friends/'+auth.currentUser.uid), {
      JAcceptKorsePic:currentPic[0],
      JReqDiseTarName: name,
      JReqAcceptKorseTarName:auth.currentUser.displayName,
      JReqDise: id,
      JReqAcceptKorse:auth.currentUser.uid,
      photo:photo,
      
    });
    remove(ref(db, 'request/'+ id))
  })
  
  }
  
  return (
    <div className="right">
      <h3>Acount Info</h3>
      <ListGroup>
        <ListGroup.Item>{moment(props.time).fromNow()}</ListGroup.Item>
        <h1 className="mt-5 mb-5">peoples</h1>
        {userName.map((items,i)=>(<ListGroup.Item key={i}><Row><Col md={2}><img className="w-100" src={items.photo}></img>
        </Col><Col md={8}><h4>{items.name}</h4><Button onClick={()=>handleReq(items.id,items.photo)}>Add Friend</Button></Col></Row></ListGroup.Item>))}
      </ListGroup>
      <h1 className="mt-5 mb-5">Request</h1>
      {req.map((items,i)=>(<ListGroup key={i}>
      {items.Jakpataice == auth.currentUser.uid 
      ? 
      <ListGroup.Item>
      <Row>
      <Col md={2}>
      {req.map((items)=>(<img className="image" src={items.photo}></img>))}
      </Col>
      <Col  md={8}>
      <h4>{items.username}<Button onClick={()=>handleAccept(items.username,items.Jpathaice,items.photo)}>Accept</Button></h4>
      </Col>
      </Row>
      </ListGroup.Item>
      :
      ""
      }
      </ListGroup>))}
    </div>
  );
};

export default Right;
