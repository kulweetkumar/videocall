/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('socket_users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'user_id'
		},
		socket_id: {
			type: DataTypes.STRING(64),
			allowNull: false,
			field: 'socket_id'
		},
		is_online: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			default:0,
			field: 'is_online'
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
		tableName: 'socket_users'
	});
};
