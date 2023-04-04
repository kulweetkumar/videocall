/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('chats', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		sender_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'sender_id'
		},
		reciever_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'reciever_id'
		},
		chatroom_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'chatroom_id'
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'message'
		},
		messageType: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			field: 'message_type'
		},
	
		is_view: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue:0,
			field: 'is_view'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue:sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue:sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated_at'
		}
	}, {
		tableName: 'chats'
	});
};
