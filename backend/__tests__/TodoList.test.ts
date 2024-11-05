import { Request, Response } from 'express';
import { listTodos, createTodo, completeTodo, deleteTodo } from '../controllers/TodoController';
import { Todo } from '../models/models';

jest.mock('../models/models', () => {
  const mockTodo = {
    findAll: jest.fn() as any,
    create: jest.fn() as any,
    findByPk: jest.fn() as any,
    destroy: jest.fn() as any,
  };

  return {
    Todo: mockTodo,
  };
});

const createMockRequest = (overrides: Partial<Request> = {}): Request => {
  return {
    params: {},
    body: {},
    query: {},
    headers: {},
    ...overrides,
  } as Request;
};

describe('Todo Controller Tests', () => {
  describe('listTodos', () => {
    it('should return a list of todos', async () => {
      const mockTodos = [{ id: 1, description: 'Test todo', status: false }, { id: 2, description: 'Another todo', status: false }];
      (Todo.findAll as jest.Mock).mockResolvedValue(mockTodos);

      const mockRequest = createMockRequest();
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await listTodos(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodos);
    });

    it('should handle errors and return 500 status', async () => {
      (Todo.findAll as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

      const mockRequest = createMockRequest();
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await listTodos(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('createTodo', () => {
    it('should create a new todo and return it', async () => {
      const mockTodo = { id: 1, description: 'Test todo', status: false };
      (Todo.create as jest.Mock).mockResolvedValue(mockTodo);

      const mockRequest = createMockRequest({
        body: { description: 'Test todo', status: false },
      });
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await createTodo(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodo);
    });

    it('should handle errors and return 500 status', async () => {
      (Todo.create as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

      const mockRequest = createMockRequest({
        body: { description: 'Test todo', status: false },
      });
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await createTodo(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('completeTodo', () => {
    it('should mark a todo as completed', async () => {
      const mockTodo = { id: 1, description: 'Test todo', status: false, save: jest.fn() };
      (Todo.findByPk as jest.Mock).mockResolvedValue(mockTodo);

      const mockRequest = createMockRequest({
        params: { id: '1' },
      });
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await completeTodo(mockRequest, mockResponse);

      expect(mockTodo.status).toBe(true);
      expect(mockTodo.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodo);
    });

    it('should return 404 if todo is not found', async () => {
      (Todo.findByPk as jest.Mock).mockResolvedValue(null);

      const mockRequest = createMockRequest({
        params: { id: '1' },
      });
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await completeTodo(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Todo not found' });
    });

    it('should handle errors and return 500 status', async () => {
      (Todo.findByPk as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

      const mockRequest = createMockRequest({
        params: { id: '1' },
      });
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await completeTodo(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo and return 204', async () => {
      const mockTodo = { id: 1, description: 'Test todo', destroy: jest.fn() };
      (Todo.findByPk as jest.Mock).mockResolvedValue(mockTodo);

      const mockRequest = createMockRequest({
        params: { id: '1' },
      });
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await deleteTodo(mockRequest, mockResponse);

      expect(mockTodo.destroy).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 404 if todo is not found', async () => {
      (Todo.findByPk as jest.Mock).mockResolvedValue(null);

      const mockRequest = createMockRequest({
        params: { id: '1' },
      });
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await deleteTodo(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Todo not found' });
    });

    it('should handle errors and return 500 status', async () => {
      (Todo.findByPk as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

      const mockRequest = createMockRequest({
        params: { id: '1' },
      });
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await deleteTodo(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});
