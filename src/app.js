let express = require("express");
let app = express();
const fs = require("fs");
const fun = require("./function/socketFunction");

const options = {
    key: fs.readFileSync("/var/www/ssl/privkey.pem"),
    cert: fs.readFileSync("/var/www/ssl/fullchain.pem")
};
let server = require("https").Server(options,app);
const ios = require("socket.io");
const url = require("url");
const db = require("./models");
const callManage = db.video_call_manage;
const schedule = require("node-schedule");

const io = new ios.Server(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});
let stream = require("./ws/stream");
let path = require("path");
let favicon = require("serve-favicon");
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.get("/", async (req, res) => {
  const reee = req.url;
  const data = new URL("https://odoco.com.sg:3000" + reee);
  const search_params = data.searchParams;
  const id = search_params.get("room");
  const message = isFinite(id);
  if (message == true) {
    var time = await fun.time();
    var new_time = await fun.new_time();
    var new_time5 = await fun.new_time5();
    var new_time_sec20 = await fun.new_time_second20();
  } else {
    var time = await fun.time();
    var new_time = await fun.new_time_hour();
    var new_time5 = await fun.new_time_hour5();
    var new_time_sec20 = await fun.new_time_second20();
  }
  const call = await callManage.findOne({
    where: {
      room_id: id,
    },
    raw: true,
  });
  var obj = {
    room_id: id,
    user_id: id,
    status: 1,
    start_time: time,
    five_mint: new_time5,
    end_time: new_time,
    sender_id: 0,
    reciever_id: id,
    socket_id: new_time_sec20,
  };
  const cret = await callManage.create(obj);
  const all_new = await callManage.count({
    where: {
      room_id: id,
    },
    raw: true,
  });
  // if (all_new <= 2) {
    res.sendFile(__dirname + "/index.html");
  // }else{
    // res.sendFile(__dirname + "/index.html");
  // }
});
app.get("/get_detail/:id", async (req, res) => {
  const allcall = await callManage.findOne({
    where: {
      room_id: req.params.id,
    }, order: [
      ['id', 'ASC'],
  ],raw:true
  });
  var todays = new Date().setMinutes(new Date().getMinutes() + 30);
  var today = new Date(+todays + 20000);
  var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();
  var h = today.getHours();
  var m = today.getMinutes();
  const date = year + "-" + month + "-" + day + " " + h + ":" + m;
  if (allcall  && allcall.five_mint == date) {
    res.json(1);
  }else if(allcall && allcall.end_time == date){
    res.json(2);
  }else{
   res.json(0);
  }
});
app.get("/get_details/:id", async (req, res) => {
  const total = await callManage.count({
    where: {
      room_id: req.params.id,
    }, order: [
      ['id', 'ASC'],
  ],raw:true
  });
  if(total == 0){
    res.json(2);
  }
});
app.get("/get_count/:id", async (req, res) => {
  const allcall = await callManage.findOne({
    where: {
      room_id: req.params.id,
    }, order: [
      ['id', 'ASC'],
  ],raw:true
  });
  var today = new Date(+new Date() + 20000);
  var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  const date = year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
  if(allcall && date >= allcall.socket_id){
    const total = await callManage.count({
      where: {
        room_id: req.params.id,
      },
      raw:true
    });
    return res.json(total);
  }else{
    return res.json(2);
  }
 
});
io.of("/stream").on("connection", stream);
require("./socket")(io);

server.listen(3000);
