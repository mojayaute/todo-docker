import { Request, Response } from 'express';
import { Todo } from '../models/models';

export const listTodos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const allTodos: Todo[] = await Todo.findAll();
    return res.status(200).json(allTodos);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<Response> => {
  const { description, status } = req.body;
  try {
    const newTodo: Todo = await Todo.create({ description, status });
    return res.status(201).json(newTodo);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const completeTodo = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    todo.status = true;
    await todo.save();
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    await todo.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
