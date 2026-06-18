const UserController = require('../controllers/user_controller');
const TarefaController = require('../controllers/tarefa_controller');

function routes(app) {
  app.post('/usuarios', UserController.register);
  app.post('/login', UserController.login);
  app.post('/tarefas', TarefaController.ensureAuth, TarefaController.create);

  app.get('/tarefas', TarefaController.ensureAuth, TarefaController.list);
  app.get('/tarefas/:id', TarefaController.ensureAuth, TarefaController.get);

  app.put('/tarefas/:id', TarefaController.ensureAuth, TarefaController.updateName);

  app.patch('/tarefas/:id/status', TarefaController.ensureAuth, TarefaController.updateStatus);

  app.delete('/tarefas/:id', TarefaController.ensureAuth, TarefaController.remove);
}

module.exports = routes;
