const database = require('../config/database');
const { DataTypes } = require('sequelize');

const Tarefa = database.define(
  'tarefa',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_edicao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'tarefas',
    timestamps: false,
  }
);

Tarefa.sync({ alter: true });

module.exports = Tarefa;
