import React from "react";
import Main from "./components/Main";

import { defaultContext, defaultInstructions } from "./config";

function App() {
  React.useEffect(() => {
    localStorage.setItem("manual-qna-count", 0);

    if (!localStorage.getItem("operation-mode")) {
      localStorage.setItem("operation-mode", "automated");
    }
    if (!localStorage.getItem("ai-settings")) {
      const defaultSettings = {
        context: defaultContext,
        instructions: defaultInstructions,
      };
      localStorage.setItem("ai-settings", JSON.stringify(defaultSettings));
    }
  }, []);

  return <Main />;
}

export default App;
