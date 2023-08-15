import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InputLabel from "@mui/material/InputLabel";

export default function FullWidthTextField() {
  const [context, setContext] = React.useState(null);
  const [instructions, setInstructions] = React.useState(null);

  React.useEffect(() => {
    const getRawSettings = localStorage.getItem("ai-settings");
    if (getRawSettings && getRawSettings != null) {
      const getSettings = JSON.parse(getRawSettings);
      setContext(getSettings.context);
      setInstructions(getSettings.instructions);
    }
  }, []);

  const update = (text, type) => {
    let tempLocalStote;
    if (type === "context") {
      setContext(text);
      tempLocalStote = {
        context: text,
        instructions: instructions,
      };
    } else {
      setInstructions(text);
      tempLocalStote = {
        context: context,
        instructions: text,
      };
    }

    localStorage.setItem("ai-settings", JSON.stringify(tempLocalStote));
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <InputLabel
        htmlFor="input-with-icon-adornment"
        style={{ color: "white" }}
      >
        Interview Context
      </InputLabel>
      <TextField
        fullWidth
        id="fullWidth"
        style={{ width: "100%", background: "white" }}
        value={context}
        onChange={(e) => update(e.target.value, "context")}
      />
      <br />
      <br />
      <InputLabel
        htmlFor="input-with-icon-adornment"
        style={{ color: "white" }}
      >
        Instructions
      </InputLabel>
      <TextareaAutosize
        minRows={3}
        fullWidth
        placeholder="Type something here..."
        style={{ width: "99%" }}
        value={instructions}
        onChange={(e) => update(e.target.value, "instruction")}
      />
    </Box>
  );
}
