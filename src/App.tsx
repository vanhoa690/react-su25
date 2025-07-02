import Card from "./components/Card";
import Greeting from "./components/Greeting";

function App() {
  // const element = (
  //   <>
  //     <h1>Hello, World!</h1>
  //     <p>Welcome to React!</p>
  //   </>
  // );
  return (
    <div>
      <Card>
        <Greeting name="Alice" />
        <p>This is inside a card!</p>
      </Card>
    </div>

    // <div style={{ padding: "20px" }}>
    //   <h1>Product Management</h1>
    //   <Button type="primary" style={{ marginBottom: "16px" }}>
    //     Add Product
    //   </Button>
    //   <ProductList />
    // </div>
  );
}

export default App;
