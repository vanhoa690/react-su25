import "./App.css";
import Card from "./components/Card";
import Greeting from "./components/Greeting";

function App() {
  const name = "hoadv";
  const element = (
    <>
      <img src="" />
      <h1>Hello, World!</h1>
      <p>Welcome to React!</p>
    </>
  );
  return (
    <>
      <Card>
        <Greeting name="Alice" />
        <p>This is inside a card!</p>
      </Card>
      <Card>
        <p>This is inside a card 2!</p>
      </Card>
    </>
  );
}

export default App;
