import React from "react";
import Main from "./components/Main";

function App() {
  React.useEffect(() => {
    localStorage.setItem("manual-qna-count", 0);
  }, []);

  return <Main />;
}

export default App;
