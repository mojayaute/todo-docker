import { Router } from 'express';
import { listTodos, createTodo, completeTodo, deleteTodo } from '../controllers/TodoController';

const router = Router();

router.get('/todos', listTodos);
router.post('/todos', createTodo);
router.patch('/todos/:id', completeTodo); 
router.delete('/todos/:id', deleteTodo); 

export default router;
