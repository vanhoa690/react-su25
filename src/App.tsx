import { Button } from "antd";
import UserList from "./components/UserList";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>My React App</h1>
      <Button type="primary">Click me</Button>
      <UserList />
    </div>
  );
}

export default App;
