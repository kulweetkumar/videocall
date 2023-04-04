/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true,
			autoIncreament: true,
			field: 'id'
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: true,
			defaultValue: '',
			field: 'name'
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'email'
		},
		profile_pic: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'profile_pic'
		},
		role: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '',
			field: 'role'
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
		tableName: 'users'
	});
};
