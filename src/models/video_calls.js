/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('video_calls', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		event_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'event_id'
		},
		call_status: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue:0,
			field: 'call_status'
        },
        link: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue:"",
			field: 'link'
        },
		totaltime: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue:"",
			field: 'totaltime'
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
		tableName: 'video_calls'
	});
};
