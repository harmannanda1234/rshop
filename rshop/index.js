const express = require("express")
const http = require("http");                      
const { Server } = require("socket.io");

const cors = require('cors')
const arouter = require("./routes/authrouter")
const {verify, auction_verify} = require("./middlewares/verifytoken")
const kycr = require("./routes/kycr")
const listing = require("./routes/auclisting");
const { socketinit } = require("./controllers/socket");
const app = express()
require("dotenv").config()

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json())
app.use (express.urlencoded({extended:true}))


const PORT= process.env.Port


const server = http.createServer(app);             
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

socketinit(io)

app.use("/user",arouter)
app.use("/user/profile",verify,kycr)
app.use("/auction",verify,listing)
// auction_verify,

server.listen(PORT, () => {
    console.log(`Server up and running at port ${PORT}`);
});