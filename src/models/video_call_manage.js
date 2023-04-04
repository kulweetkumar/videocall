
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('video_call_manage', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		room_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'room_id'
		},
		user_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue:0,
			field: 'user_id'
        },
		start_time: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue:"",
			field: 'start_time'
        },
        end_time: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue:"",
			field: 'end_time'
        },
		five_mint: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue:"",
			field: 'five_mint'
        },
        status: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue:0,
			field: 'status'
        },
		socket_id: {
			type: DataTypes.STRING(64),
			allowNull: false,
			field: 'socket_id'
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
		tableName: 'video_call_manage'
	});
};