import { useEffect } from "react";

function App() {
  const test = async () => {
    const res = await fetch("http://localhost:3000");
    console.log(await res.text());
  };
  useEffect(() => {
    test();
  });
  return (
    <>
      <h1>Vite + React</h1>
      <div>Example app</div>
    </>
  );
}

export default App;
