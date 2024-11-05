import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoList from "./pages/TodoList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/todos" element={<TodoList />} />
      </Routes>
    </Router>
  );
}

export default App;
