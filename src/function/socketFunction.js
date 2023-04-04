const db = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
var users = db.users;
var chat = db.chat;
var video_call = db.video_calls;
var video_call_manage = db.video_call_manage
// var onlineUser = db.onlineUser;
// var blockedUser = db.blockedUser

const SocketUser = db.socket_users;
const chatrooms = db.chatrooms;
const chats = db.chats;
const User = db.users;

var path = require("path");
var uuid = require("uuid");
const fs = require("fs");
const { DefaultDeserializer } = require("v8");
const database = require("../db/db.js");

//const fun2 =require('./function/fun.js');
//const functions =require('./function/function.js');
// const functions = require('./function/api_fun.js');
module.exports = {
  create_time_stamp: async function () {
    var current_time=new Date(Date.now() - 4 * (60 * 60 * 1000) );
    return current_time;
  },
  check_socket_id: async function (connect_listener, socket_id) {
    let check_user = await SocketUser.findOne({
      where: {
        userId: connect_listener.userId,
      },
      raw:true
    });
    if (check_user) {
      create_socket_user = await db.socket_users.update(
        {
          socket_id: socket_id,
          updated_at:new Date(Date.now() - 4 * (60 * 60 * 1000) ),
          is_online:1
        },
        {
          where: {
            userId: connect_listener.userId,
          },
        }
      );
      let finduser = await SocketUser.findOne({
        where: {
          userId: connect_listener.userId,
        },
        raw: true,
      });
      return finduser;
    } else {
      create_socket_user = await SocketUser.create({
        userId: connect_listener.userId,
        socket_id: socket_id,
        updated_at:new Date(Date.now() - 4 * (60 * 60 * 1000) ),
        is_online:1
      });
      let finduser = await SocketUser.findOne({
        where: {
          userId: connect_listener.userId,
        },
        raw: true,
      });
      return finduser;
    }
  },
  data_to_send: async function (get_data) {
    final_array = [];
    final_array = {
      senderId: get_data.senderId,
      receiverId: get_data.receiverId,
      messageType: get_data.messageType,
      message: get_data.message,
      senderName: get_data.senderName,
      senderProfileImage: get_data.senderProfileImage,
      receiverName: get_data.receiverName,
      RecieverProfileImage: get_data.RecieverProfileImage,
      created: await this.create_time_stamp(),
    };
    return final_array;
  },
  get_group_messages: async function (get_data) {
    console.log(get_data, "get_data-----------------------");
    get_messages_data = await Message.findAll({
      attributes: [
        `id`,
        `senderId`,
        `receiverId`,
        `group_id`,
        `message`,
        `chatConstantId`,
        `type`,
        `messageType`,
        `chatDeletedUser`,
        `created_at`,
        `read_status`,
        [
          sequelize.literal(
            "(SELECT id FROM users WHERE users.id  = messages.senderId)"
          ),
          "SenderID",
        ],
        [
          sequelize.literal(
            "(SELECT profile_pic FROM users WHERE users.id  = messages.senderId)"
          ),
          "SenderImage",
        ],
        [
          sequelize.literal(
            "(SELECT name FROM users WHERE users.id  =  messages.receiverId)"
          ),
          "ReceiverName",
        ],
        [
          sequelize.literal(
            "(SELECT id FROM users WHERE users.id  = messages.receiverId)"
          ),
          "ReceiverId",
        ],
        [
          sequelize.literal(
            "(SELECT profile_pic FROM users WHERE users.id  = messages.receiverId)"
          ),
          "ReceiverImage",
        ],
      ],
      where: {
        group_id: get_data.group_id,
        receiverId: 0,
      },
    });
    // console.log(get_data.group_id, "group_id-----------------------");
    let allMessages = [];

    if (get_messages_data.length > 0) {
      // console.log(get_messages_data,"---message.dataValues.deleted_id------");
      get_messages_data = get_messages_data.map((message) => {
        if (message.dataValues.chatDeletedUser == 0) {
          console.log("----22-----");
          message.dataValues.ReceiverName = "";
          message.dataValues.ReceiverImage = "";

          allMessages.push(message.toJSON());
        }
      });
      console.log(allMessages, "-----allMessages=================----");
      return allMessages;
    } else {
      return allMessages;
    }
  },
  GetChat: async function (msg) {
    var constant_check = await chats.findOne({
      where: {
        [Op.or]: [
          { sender_id: msg.userId, reciever_id: msg.user2Id },
          { sender_id: msg.user2Id, reciever_id: msg.userId },
        ],
      },
    });
    if (constant_check) {
      constant_check = constant_check.toJSON();
      var chatroom = await chatrooms.findOne({
        where: {
          [Op.or]: [
            { sender_id: msg.userId, reciever_id: msg.user2Id },
            { sender_id: msg.user2Id, reciever_id: msg.userId },
          ],
        },
      });
      var get_message = await chats.findAll({
        where: {
          [Op.or]: [
            { sender_id: msg.userId, reciever_id: msg.user2Id },
            { sender_id: msg.user2Id, reciever_id: msg.userId },
          ],
        },
        attributes: [
          "id",
          "message",
          "is_view",
          "message_type",
          "created_at",
          [
            sequelize.literal(
              "(SELECT name FROM users WHERE users.id  = chats.sender_id)"
            ),
            "SenderName",
          ],
          [
            sequelize.literal(
              "(SELECT id FROM users WHERE users.id  = chats.sender_id)"
            ),
            "SenderId",
          ],
          [
            sequelize.literal(
              "(SELECT profile_pic FROM users WHERE users.id  = chats.sender_id)"
            ),
            "SenderImage",
          ],
       
          [
            sequelize.literal(
              "(SELECT name FROM users WHERE users.id  =  chats.reciever_id)"
            ),
            "ReceiverName",
          ],
          [
            sequelize.literal(
              "(SELECT id FROM users WHERE users.id  = chats.reciever_id)"
            ),
            "ReceiverId",
          ],
          [
            sequelize.literal(
              "(SELECT profile_pic FROM users WHERE users.id  = chats.reciever_id)"
            ),
            "ReceiverImage",
          ],
        
          [
            sequelize.literal(
              "IFNULL((SELECT is_online FROM socket_users WHERE socket_users.user_id  = chats.reciever_id),0)"
            ),
            "Receiver_is_online",
          ],
          [
            sequelize.literal(
              "IFNULL((SELECT updated_at FROM socket_users WHERE socket_users.user_id  = chats.reciever_id),0)"
            ),
            "Receiver_updated_at",
          ],
          [
            sequelize.literal(
              "IFNULL((SELECT updated_at FROM socket_users WHERE socket_users.user_id  = chats.sender_id),0)"
            ),
            "Sender_updated_at",
          ],

          [
            sequelize.literal(
              "IFNULL((SELECT is_online FROM socket_users WHERE socket_users.user_id  = chats.sender_id),0)"
            ),
            "Sender_is_online",
          ],
          [
            sequelize.literal(
              `IFNULL((SELECT is_online FROM socket_users WHERE socket_users.user_id  =  ${msg.user2Id}),0)`
            ),
            "is_onliness",
          ],
          [
            sequelize.literal(
              `IFNULL((SELECT updated_at FROM socket_users WHERE socket_users.user_id  =  ${msg.user2Id}),0)`
            ),
            "last_online",
          ],
        
        ],
      });
      if (get_message) {
        get_message = get_message.map((val) => {
          var data = val.toJSON();
          data.room_id = chatroom.id;
          return data;
        });
        return get_message;
      }
    } else {
      return [];
    }
  },
  get_userchat_list: async function (get_chat_data) {
    var get_message = await database.query(
      `select *,(select Count(*) from messages where (receiverId=${get_chat_data.userId} and senderId=userdetail_id) and (read_status=0) ) as unreadcount  from (SELECT *,CASE WHEN userOne = ${get_chat_data.userId} THEN userTwo WHEN userTwo = ${get_chat_data.userId} THEN userOne  END AS userdetail_id,(SELECT message FROM messages where id=lastMessageId and chatDeletedUser!=${get_chat_data.userId}) as lastMessage ,(SELECT name from users where id=userdetail_id) as userName,IFNULL((select cn.status  from chat_mutenotifications as cn where cn.user_by = ${get_chat_data.userId} and  cn.user_to = userdetail_id order by id desc limit 1),1)  as notification_status, ifnull((SELECT profile_pic from users where id=userdetail_id),'') as userImage, ifnull((SELECT email from users where id=userdetail_id),'') as userEmail,(SELECT  created_at  FROM messages where id=lastMessageId) as created_ats ,(SELECT messageType FROM messages where id=lastMessageId) as messageType from chatrooms where (userOne=${get_chat_data.userId} or userTwo=${get_chat_data.userId}) and deletedbyuserId!=${get_chat_data.userId} ORDER BY created_at DESC )tt ORDER BY updated_at DESC `,
      {
        model: Message,
        model: ChatConstant,
        mapToModel: true,
        type: database.QueryTypes.SELECT,
      }
    );
    return get_message;
  },
  get_typing_list: async function (msg) {
    let cconstant_msg = await constant.update(
      {
        typing: msg.status,
      },
      {
        where: {
          [Op.or]: [
            { userid: msg.userid, user2Id: msg.user2Id },
            { userid: msg.user2Id, user2Id: msg.userid },
          ],
        },
      }
    );
    return cconstant_msg;
  },
  socket_disconnect: async function (socket_id) {
    /* console.log(socket_id,"socket_id") */
    let disconnect_socket_user = await onlineUser.update(
      {
        status: 0,
        // updated: await this.create_time_stamp()
      },
      {
        where: {
          socketId: socket_id,
        },
      }
    );
    return disconnect_socket_user;
  },
  get_chat_list: async function (get_chat_data) {
    var get_message = await chatrooms.findAll({
      where: {
        [Op.or]: [
          { sender_id: get_chat_data.userId },
          {
            reciever_id: get_chat_data.userId,
          },
        ],
      },
      attributes: [
        "id",
        "message",
        "sender_id",
        "reciever_id",
        "updated_at",
        [
          sequelize.literal(
            `IFNULL((SELECT name FROM users WHERE users.id  = chatrooms.sender_id and chatrooms.sender_id != ${get_chat_data.userId}), (SELECT name FROM users WHERE users.id  = chatrooms.reciever_id and chatrooms.reciever_id != ${get_chat_data.userId}))`
          ),
          "userName",
        ],
        [
          sequelize.literal(
            `IFNULL((SELECT is_online FROM socket_users WHERE socket_users.user_id  = chatrooms.sender_id and chatrooms.sender_id != ${get_chat_data.userId}), (SELECT is_online FROM socket_users WHERE socket_users.user_id  = chatrooms.reciever_id and chatrooms.reciever_id != ${get_chat_data.userId}))`
          ),
          "is_online",
        ],
        [
          sequelize.literal(
            `IFNULL((SELECT profile_pic FROM users WHERE users.id  = chatrooms.sender_id and chatrooms.sender_id != ${get_chat_data.userId}), (SELECT profile_pic FROM users WHERE users.id  = chatrooms.reciever_id and chatrooms.reciever_id != ${get_chat_data.userId}))`
          ),
          "userImage",
        ],
        [
          sequelize.literal(
            `IFNULL((SELECT updated_at FROM socket_users WHERE socket_users.user_id  = chatrooms.sender_id and chatrooms.sender_id != ${get_chat_data.userId}), (SELECT updated_at FROM socket_users WHERE socket_users.user_id  = chatrooms.reciever_id and chatrooms.reciever_id != ${get_chat_data.userId}))`
          ),
          "useronline",
        ],
        
      ],
      order: [["updated_at", "DESC"]],
      raw: true,
    });

for(let i in get_message){
  var is_view = await chats.count({where:{
    chatroom_id:get_message[i].id,
    reciever_id:get_chat_data.userId,
    is_view:0
  }
});
get_message[i].is_view = is_view
}

    return get_message;
  },
  get_total_user: async function (data) {
    var usersData = video_call_manage.count({
      where: {
        room_id: data,
      },
      raw: true,
    });
    return usersData;
  },
  get_call_data: async function (data,fullUrl) {
    var link = fullUrl+'/'+data;
    var usersData = video_call.findOne({
      where: {
        link: link,
      },
      raw: true,
    });
    return usersData;
  },
  time: async function () {
    var today = new Date(+new Date() + 20000);
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
       return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
    // return today
  },
  new_time: async function () {
    var todays = new Date().setMinutes(new Date().getMinutes() + 30);
    var today = new Date(+todays + 20000);
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

       return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;

  },
  new_time5: async function () {
    var todays = new Date().setMinutes(new Date().getMinutes() + 25);
    var today = new Date(+todays + 20000);
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

       return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;

  },
  new_time_hour: async function () {
    var todays = new Date().setMinutes(new Date().getMinutes() + 60);
    var today = new Date(+todays + 20000);
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

       return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;

  },
  new_time_hour5: async function () {
    var todays = new Date().setMinutes(new Date().getMinutes() + 55);
    var today = new Date(+todays + 20000);
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
       return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;

  },
  new_time_second20: async function () {
    var todays = new Date().setSeconds(new Date().getSeconds() + 23);
    var today = new Date(+todays + 20000);
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;

  },
};
