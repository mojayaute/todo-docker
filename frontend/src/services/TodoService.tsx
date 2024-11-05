import HttpService from "../HttpService";
import type { Todo } from "../interfaces/types";

const saveTodo = async (description: string): Promise<Todo> => {
  const todo = { description, status: false };
  const response = await HttpService.post<Todo>("/todos", todo);
  return response.data;
};

const getAllTodos = async (): Promise<Todo[]> => {
  const response = await HttpService.get<Todo[]>("/todos");
  return response.data;
};

const completeTodo = async (id: number): Promise<void> => {
  await HttpService.patch(`/todos/${id}`, { status: true });
};

const deleteTodo = async (id: number): Promise<void> => {
  await HttpService.delete(`/todos/${id}`);
};

const TodoService = {
  saveTodo,
  getAllTodos,
  completeTodo,
  deleteTodo,
};

export default TodoService;
