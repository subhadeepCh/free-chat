const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let rooms = [];

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", "./server/views");

app.get("/", (req, res) => {
  res.render("startup");
});

io.on("connection", (client) => {
  
  client.on("userJoined", res=>{
    client.join(res.room);
    client.to(res.room).emit("userJoined", res.name);
  });

  client.on("userLeft", res=>{
    client.join(res.room);
    client.to(res.room).emit("userLeft", res.name);
  });

  client.on('image', data => {
    const buffer = Buffer.from(data.bytes);
    const stringVariable = buffer.toString('base64');
    io.in(data.room).emit("image", {image:stringVariable,name:data.name});
});

  client.on("sendMsg", res =>{
    client.to(res.room).emit("sendMsg",res);
  });

  client.on("create", (res) => {
    if (!rooms.find((room) => room === res.room)) {
      rooms.push(res.room);
      client.join(res.room);
      client.to(res.room).emit("created", res);
    }
    else{
      client.emit("error",`${res.room} already exists`);
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("server started");
});
