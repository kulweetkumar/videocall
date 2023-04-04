/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('chatrooms', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		sender_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'sender_id'
		},
		reciever_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue:0,
			field: 'reciever_id'
		},
		message: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'message'
		},
		message_type: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'message_type'
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
		tableName: 'chatrooms'
	});
};
