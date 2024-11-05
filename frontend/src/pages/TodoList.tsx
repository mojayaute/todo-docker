import { useState, useEffect } from "react";
import TodoService from "../services/TodoService";
import type { Todo } from "../interfaces/types";
import Swal from "sweetalert2";
import "./TodoList.scss";

function TodoList() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodoDescription, setNewTodoDescription] = useState<string>("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos: Todo[] = await TodoService.getAllTodos();
        setTodoList(todos);
      } catch (error) {
        handleError("Error fetching todos", error);
      }
    };

    fetchTodos();
  }, []);

  const handleError = (title: string, error: any) => {
    console.error(title, error);
    Swal.fire({
      title: "Error",
      text: "An error occurred, please try again later.",
      icon: "error",
    });
  };

  const handleAddTodo = async () => {
    if (!newTodoDescription.trim()) {
      Swal.fire({
        title: "Warning",
        text: "Todo description cannot be empty",
        icon: "warning",
      });
      return;
    }

    try {
      const newTodo: Todo = await TodoService.saveTodo(newTodoDescription);
      setTodoList((prevTodos) => [...prevTodos, newTodo]);
      setNewTodoDescription(""); 
    } catch (error) {
      handleError("Error adding todo", error);
    }
  };

  const handleCompleteTodo = async (id: number) => {
    try {
      await TodoService.completeTodo(id);
      setTodoList((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, status: true } : todo
        )
      );
    } catch (error) {
      handleError("Error completing todo", error);
    }
  };
  

  const handleDeleteTodo = async (id: number) => {
    try {
      await TodoService.deleteTodo(id);
      setTodoList((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      handleError("Error deleting todo", error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>To-Do List</h1>
      </header>
      <div className="input-container">
        <input
          type="text"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul className="task-list">
        {todoList.map(({ id, description, status }) => (
          <li
            key={id}
            className={`task ${status ? 'completed' : ''}`}
            onClick={() => !status && handleCompleteTodo(id)}
          >
            <span>{description}</span>
            <button data-testid={`delete-button-${id}`} onClick={(e) => { e.stopPropagation(); handleDeleteTodo(id); }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
