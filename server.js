const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const multer = require("multer");

const path = require("path");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

/* STATIC */

app.use(express.static("public"));

/* MULTER STORAGE */

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(null,"public/uploads");

    },

    filename:(req,file,cb)=>{

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

const upload = multer({ storage });

/* IMAGE UPLOAD ROUTE */

app.post("/upload", upload.single("image"), (req,res)=>{

    res.json({

        imageUrl:"/uploads/" + req.file.filename

    });

});

/* ONLINE USERS */

let users = [];

/* SOCKET */

io.on("connection",(socket)=>{

    console.log("User connected");

    /* JOIN */

    socket.on("user joined",(username)=>{

        socket.username = username;

        users.push(username);

        io.emit("online users",users);

    });

    /* TEXT MESSAGE */

    socket.on("chat message",(data)=>{

        io.emit("chat message",data);

    });

    /* IMAGE MESSAGE */

    socket.on("image message",(data)=>{

        io.emit("image message",data);

    });

    /* DISCONNECT */

    socket.on("disconnect",()=>{

        users = users.filter(
            (user)=>user !== socket.username
        );

        io.emit("online users",users);

    });

});

/* SERVER */

server.listen(3000,"0.0.0.0",()=>{

    console.log("Server running");

});