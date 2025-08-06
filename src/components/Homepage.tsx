import { useEffect } from "react";
import Header from "./Header";

function Homepage() {
  useEffect(() => {
    const timer = setInterval(() => console.log("Tick"), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div>
      <Header />
      <h1>Trang chủ</h1>
      <p>Chào mừng bạn đến với trang chủ của chúng tôi!</p>
    </div>
  );
}
export default Homepage;
