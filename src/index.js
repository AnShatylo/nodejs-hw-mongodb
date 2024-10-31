import {initMongoConnection} from './db/initMongoConnection.js'
import {startServer} from "../src/server.js";

const boostrap = async()=> {
    await initMongoConnection();
    startServer();
}

boostrap();