import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import TodoList from "../pages/TodoList";
import TodoService from "../services/TodoService";

jest.mock("../services/TodoService");

jest.mock("sweetalert2", () => ({
  fire: jest.fn(() => ({
    html: "",
    then: jest.fn(() => Promise.resolve())
  })),
}));

test("adds a new todo item", async () => {
  const newTodo = { id: 1, description: "New Task", status: false };
  (TodoService.getAllTodos as jest.Mock).mockResolvedValue([]);
  (TodoService.saveTodo as jest.Mock).mockResolvedValue(newTodo);

  render(<TodoList />);

  const input = screen.getByPlaceholderText("Add a new task");
  fireEvent.change(input, { target: { value: "New Task" } });

  await act(async () => {
    fireEvent.click(screen.getByText("Add"));
  });

  expect(await screen.findByText("New Task")).toBeInTheDocument();
});

test("completes a todo item", async () => {
  const todo = { id: 1, description: "Complete this task", status: false };
  (TodoService.getAllTodos as jest.Mock).mockResolvedValue([todo]);
  (TodoService.completeTodo as jest.Mock).mockResolvedValue(null);

  render(<TodoList />);

  const listItem = await screen.findByText(/Complete this task/i);

  await act(async () => {
    fireEvent.click(listItem);
  });

  await waitFor(() => {
    const updatedListItem = screen.getByText(/Complete this task/i).closest('li');
    expect(updatedListItem).toHaveClass("completed");
  });
});

test("deletes a todo item", async () => {
  const todo = { id: 1, description: "Delete this task", status: false };
  (TodoService.getAllTodos as jest.Mock).mockResolvedValue([todo]);
  (TodoService.deleteTodo as jest.Mock).mockResolvedValue(null);

  render(<TodoList />);

  const deleteButton = await screen.findByTestId(`delete-button-${todo.id}`);
  
  fireEvent.click(deleteButton);

  await waitFor(() => {
    expect(screen.queryByText(/Delete this task/i)).not.toBeInTheDocument();
  });
});
