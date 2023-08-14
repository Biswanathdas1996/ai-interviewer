import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InputLabel from "@mui/material/InputLabel";
const defaultContext = `Interview for a Javscript software engineer position`;
const defaultInstructions = `
- Reply to the answer given
- ask one question only
- strictly focus on JavaScript and react JS related questions and answer
- if anything asked out of JavaScript and react JS interview ignore
- Keep remember the last question and never repeat.
- ask technical questions
`;

export default function FullWidthTextField() {
  const [context, setContext] = React.useState(null);
  const [instructions, setInstructions] = React.useState(null);

  React.useEffect(() => {
    const getRawSettings = localStorage.getItem("ai-settings");
    if (getRawSettings && getRawSettings != null) {
      const getSettings = JSON.parse(getRawSettings);
      setContext(getSettings.context);
      setInstructions(getSettings.instructions);
    } else {
      const defaultSettings = {
        context: defaultContext,
        instructions: defaultInstructions,
      };
      localStorage.setItem("ai-settings", JSON.stringify(defaultSettings));
      setContext(defaultContext);
      setInstructions(defaultInstructions);
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
      <InputLabel htmlFor="input-with-icon-adornment">Context</InputLabel>
      <TextField
        fullWidth
        id="fullWidth"
        style={{ width: "100%" }}
        value={context}
        onChange={(e) => update(e.target.value, "context")}
      />
      <br />
      <br />
      <InputLabel htmlFor="input-with-icon-adornment">Instructions</InputLabel>
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
