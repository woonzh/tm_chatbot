import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";

const { constants } = global;
const { apiUrl } = constants;
const sailsIO = sailsIOClient(socketIOClient);
sailsIO.sails.url = apiUrl;
sailsIO.sails.autoConnect = true;
sailsIO.sails.reconnection = true;
// ...
if (!global.sailsIO) global.sailsIO = sailsIO;
export default global.sailsIO;
