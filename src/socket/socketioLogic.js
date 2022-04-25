import { io } from 'socket.io-client';
import store from '../state/store';

const ENDPOINT = "https://diskgod.herokuapp.com/"

var socket = io.connect(ENDPOINT);

var userInfoString = store.getState().userInfo.newUser

export const socketOpen = () => {
    try {
        let user = JSON.parse(userInfoString);
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