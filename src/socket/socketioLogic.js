import { io } from 'socket.io-client';
import store from '../state/store';

// const ENDPOINT = "no"
const ENDPOINT = process.env.REACT_APP_BASE_URL

// var socket = io(ENDPOINT);
var socket = io.connect(ENDPOINT);

var userInfoString = store.getState().userInfo.newUser
console.log(JSON.parse(userInfoString))

export const socketOpen = (user) => {
    try {
        // let user = JSON.parse(userInfoString);
        socket.emit("setup", user);
        socket.on("connected", () => {
          console.log(user);
          console.log("connected to server");
        //   setSocketConnected(true);
        });
        return true
        
    } catch (err) {
        console.log(err);
        return false
        
    }

}

export default socket