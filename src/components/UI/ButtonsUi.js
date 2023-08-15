import React from "react";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";

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

      <Button
        variant="outlined"
        // color="success"
        onClick={() => window.location.reload()}
        startIcon={<LogoutIcon fontSize="large" />}
        className="end-btn"
      >
        {" "}
        End Interview
      </Button>
    </div>
  );
}
