import { Manager} from "socket.io-client";

export const connectToServer = ()=> {

    const manager = new Manager('https://claudposepr-nestjs.onrender.com/socket.io/socket.io.min.js');
    manager.socket('/');
    return manager;

}
