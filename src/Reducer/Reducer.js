import { combineReducers } from "redux"

const initialState = {
    id:null

}
const usereducer = (state=initialState ,action)=>{
    // console.log("ami aseci")
    if(action.type == "ACTIVE_USER"){
        return{...state,id:action.payload}
    }
    else{
        return state
    }

}

const rootReducer = combineReducers ({
    activeuser: usereducer

})

export default rootReducer