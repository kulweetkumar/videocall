const sequelize = require('sequelize');
const db = require('./models');
const helpers = require('./config/helpers');
const SocketUser = db.socket_users;
const Chats = db.chats;
const User = db.users;
const chatrooms = db.chatrooms;
const user_groups = db.user_groups;
const chat_mutenotifications = db.chat_mutenotifications;
const Op = sequelize.Op;
const fun = require('./function/socketFunction');

User.hasOne(SocketUser);
chatrooms.belongsTo(User, { foreignKey: 'sender_id' })

module.exports = function (io) {
	io.on('connection', function (socket) {

		socket.on('connect_user', async function (connect_listener) {
			try {
				var socket_id = socket.id
				let check_socket_id = await fun.check_socket_id(connect_listener, socket_id);
				success_message = [];
				success_message = {
					'success_message': 'connected successfully',
				}
				socket.emit('connect_listener', success_message);
			} catch (error) {
				throw error
			}
		});
		socket.on('send_messages', async function (get_data) {
			try {
				if (get_data) {
					var user_thread_data = await chatrooms.findOne({
						where: {
							[Op.or]: [
								{ sender_id: get_data.userId, reciever_id: get_data.user2Id },
								{ sender_id: get_data.user2Id, reciever_id: get_data.userId }
							]
						},
						raw: true
					});
				}
				if (user_thread_data) {
					create_message = await Chats.create({
						sender_id: get_data.userId,
						reciever_id: get_data.user2Id,
						messageType: get_data.messageType,
						message: get_data.message,
						chatroom_id: user_thread_data.id,
						createdAt: new Date(),
						updatedAt: new Date()
					})
					if (get_data.messageType == 1) {
						message = get_data.message
					} else if (get_data.messageType == 2) {
						message = "Image"
					} else {
						message = "Video"
					}
					let createThread = await chatrooms.update({
						message: message,
						updatedAt: new Date(),
					},
						{
							where: {
								id: user_thread_data.id
							}
						})
					socket.emit("send_message_listner", create_message.dataValues);

				} else {
					if (get_data.messageType == 1) {
						message = get_data.message
					} else if (get_data.messageType == 2) {
						message = "Image"
					} else {
						message = "Video"
					}
					let createThread = await chatrooms.create({
						sender_id: get_data.userId,
						reciever_id: get_data.user2Id,
						messageType: get_data.messageType,
						message: message,
						createdAt: new Date(),
						updatedAt: new Date()
					});
					create_message = await Chats.create({
						sender_id: get_data.userId,
						reciever_id: get_data.user2Id,
						messageType: get_data.messageType,
						message: get_data.message,
						chatroom_id: createThread.dataValues.id,
						createdAt: new Date(),
						updatedAt: new Date()
					});
					socket.emit("send_message_listner", create_message.dataValues);
				}
				get_id = await SocketUser.findOne({
					where: {
						userId: get_data.user2Id
					},
					raw: true
				})
				if (get_id != null) {
					io.to(get_id.socket_id).emit('send_message_listner', get_data);
				}
			} catch (error) {
				throw error
			}
		});
		socket.on('get_chat', async function (data) {
			if (data) {
				var get_data_chat = await fun.GetChat(data);
				if (get_data_chat) {
					socket.emit('my_chat', get_data_chat);
				}
			}

		});
		socket.on('get_chat_list', async function (data) {
			try {
				console.log(data, 'here data')
				if (data) {
					var get_list = await fun.get_chat_list(data);
					if (get_list) {
						socket.emit('get_list', get_list);
					}
				}
			} catch (error) {
			}
		});
		socket.on('video_call', async function (get_data) {
			get_id = await SocketUser.findOne({
				where: {
					userId: get_data.user2_id
				},
				raw: true
			})
			console.log(get_data);
			socket.emit("video_call_listner", get_data);

			if (get_id != null) {	
				io.to(get_id.socket_id).emit('video_call_listner', get_data);
			}
		});
		socket.on('read_message', async function (data) {
			console.log(data,'==========read_message data here ')
			if (data) {
				var get_data_chat = await Chats.update({
					is_view:1,
				},{
					where:{
						reciever_id:data.userId,
						sender_id:data.user2Id,
					}
				});
				if (get_data_chat) {
					socket.emit('read_message', get_data_chat);
				}
			}

		});
		socket.on("disconnect", async function() {
			let check_user = await SocketUser.update({
				is_online:0
			},{
				where: {
				  socket_id: socket.id
				}
			  });
		});
	});
}