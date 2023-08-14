import React from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

export default function ButtonsUi({
  startRecording,
  stopRecording,
  isRecording,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: 30,
      }}
    >
      {isRecording ? (
        <>
          <Button
            variant="contained"
            // color="error"
            onClick={stopRecording}
            startIcon={<PauseCircleIcon fontSize="large" />}
            className="stop-btn"
          >
            {" "}
            Stop
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          // color="success"
          onClick={startRecording}
          startIcon={<PlayCircleFilledWhiteIcon fontSize="large" />}
          className="start-btn"
        >
          {" "}
          Start
        </Button>
      )}
    </div>
  );
}
