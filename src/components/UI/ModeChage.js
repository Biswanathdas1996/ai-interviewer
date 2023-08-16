import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function ControlledRadioButtonsGroup({ setMode }) {
  const [value, setValue] = React.useState("automated");

  const handleChange = (event) => {
    setValue(event.target.value);
    localStorage.setItem("operation-mode", event.target.value);
    setMode(event.target.value);
  };

  React.useEffect(() => {
    const localData = localStorage.getItem("operation-mode");
    if (localData && localData != null) {
      setValue(localData);
      setMode(localData);
    }
  }, []);

  return (
    <div className="file-upload-div">
      <FormControl>
        <FormLabel
          id="demo-controlled-radio-buttons-group"
          style={{ color: "white" }}
        >
          Operation Mode
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value="automated"
            control={<Radio />}
            label="Automated QnA with GPT"
          />
          <FormControlLabel
            value="manual"
            control={<Radio />}
            label="Semi automatic QnA "
          />
          <span style={{ fontSize: 10 }}>
            For Semi automatic QnA need to only upload the{" "}
            <b style={{ color: "#ad1b02" }}>questions</b> and GPT will validate
            the user response with the questions
          </span>
          <FormControlLabel
            value="manual-no-gpt"
            control={<Radio />}
            label="Manual QnA"
          />
          <span style={{ fontSize: 10 }}>
            For Manual QnA need to upload the <b>questions</b> as well as the{" "}
            <b style={{ color: "#ad1b02" }}>answer</b>, there is no interaction
            with GPT
          </span>
        </RadioGroup>
      </FormControl>
    </div>
  );
}
