const Tarefa = require('../models/tarefa');
const UserController = require('./user_controller');

const VALID_STATUS = ['CRIADO', 'EM_DESENVOLVIMENTO', 'CONCLUIDO'];

class TarefaController {
  static async ensureAuth(req, res, next) {
    const header = req.headers.authorization || req.headers.authenticate;
    const token = header ? header.replace(/^Bearer\s+/i, '') : null;
    const userId = await UserController.resolveSession(token);

    if (!userId) {
      return res.status(401).json({ error: 'não autorizado' });
    }

    req.userId = userId;
    next();
  }

  static async create(req, res) {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'nome da tarefa é obrigatório' });
    }

    const now = new Date();
    const tarefa = await Tarefa.create({
      nome,
      status: 'CRIADO',
      data_criacao: now,
      data_edicao: now,
      usuarioId: req.userId,
    });

    return res.status(201).json(tarefa);
  }

  static async list(req, res) {
    const tarefas = await Tarefa.findAll({ where: { usuarioId: req.userId } });
    return res.status(200).json(tarefas);
  }

  static async get(req, res) {
    const { id } = req.params;
    const tarefa = await Tarefa.findOne({ where: { id, usuarioId: req.userId } });
    if (!tarefa) {
      return res.status(404).json({ error: 'tarefa não encontrada' });
    }
    return res.status(200).json(tarefa);
  }

  static async updateName(req, res) {
    const { id } = req.params;
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'nome da tarefa é obrigatório' });
    }

    const tarefa = await Tarefa.findOne({ where: { id, usuarioId: req.userId } });
    if (!tarefa) {
      return res.status(404).json({ error: 'tarefa não encontrada' });
    }

    tarefa.nome = nome;
    tarefa.data_edicao = new Date();
    await tarefa.save();

    return res.status(200).json(tarefa);
  }

  static async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !VALID_STATUS.includes(status)) {
      return res.status(400).json({ error: 'status inválido' });
    }

    const tarefa = await Tarefa.findOne({ where: { id, usuarioId: req.userId } });
    if (!tarefa) {
      return res.status(404).json({ error: 'tarefa não encontrada' });
    }

    const current = tarefa.status;
    if (current === 'CONCLUIDO') {
      return res.status(400).json({ error: 'tarefa concluída não pode ser alterada' });
    }

    const validProgression =
      (current === 'CRIADO' && status === 'EM_DESENVOLVIMENTO') ||
      (current === 'EM_DESENVOLVIMENTO' && status === 'CONCLUIDO');

    if (!validProgression) {
      return res.status(400).json({ error: 'transição de status inválida' });
    }

    tarefa.status = status;
    tarefa.data_edicao = new Date();
    await tarefa.save();

    return res.status(200).json(tarefa);
  }

  static async remove(req, res) {
    const { id } = req.params;
    const tarefa = await Tarefa.findOne({ where: { id, usuarioId: req.userId } });
    if (!tarefa) {
      return res.status(404).json({ error: 'tarefa não encontrada' });
    }

    await tarefa.destroy();
    return res.status(200).json({ success: true });
  }
}

module.exports = TarefaController;
