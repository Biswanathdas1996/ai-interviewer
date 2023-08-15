import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InputLabel from "@mui/material/InputLabel";

export default function FullWidthTextField() {
  const [key, setContext] = React.useState(null);
  const [auth, setInstructions] = React.useState(null);

  React.useEffect(() => {
    const getRawSettings = localStorage.getItem("ai-config");
    if (getRawSettings && getRawSettings != null) {
      const getSettings = JSON.parse(getRawSettings);
      setContext(getSettings.key);
      setInstructions(getSettings.auth);
    }
  }, []);

  const update = (text, type) => {
    let tempLocalStote;
    if (type === "key") {
      setContext(text);
      tempLocalStote = {
        key: text,
        auth: auth,
      };
    } else {
      setInstructions(text);
      tempLocalStote = {
        key: key,
        auth: text,
      };
    }

    localStorage.setItem("ai-config", JSON.stringify(tempLocalStote));
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
      }}
      style={{ marginBottom: 20 }}
    >
      <div>
        <InputLabel
          htmlFor="input-with-icon-adornment"
          style={{ color: "white" }}
        >
          API Key
        </InputLabel>
        <TextField
          fullWidth
          id="fullWidth"
          style={{ width: "100%", background: "white" }}
          value={key}
          onChange={(e) => update(e.target.value, "key")}
        />
      </div>
      <div>
        <InputLabel
          htmlFor="input-with-icon-adornment"
          style={{ color: "white", marginTop: 10 }}
        >
          Auth token
        </InputLabel>
        <TextField
          minRows={3}
          fullWidth
          placeholder="Type something here..."
          style={{ width: "100%", background: "white" }}
          value={auth}
          onChange={(e) => update(e.target.value, "instruction")}
        />
      </div>
    </Box>
  );
}
