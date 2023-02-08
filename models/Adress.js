const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const User = require('./Users')

const Address = db.define('Address' , {

    street: {
        type: DataTypes.STRING ,
        required: true
    },

    number: {
        type: DataTypes.STRING ,
        required: true
    },

    city: {
        type: DataTypes.STRING ,
        required: true
    },

})
User.hasMany(Address) // Um user pode ter vários endereços
Address.belongsTo(User) // um endereço pertence somente a um usuário -> Relacionamentos entre tabelas

module.exports = Address;