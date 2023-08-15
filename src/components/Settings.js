import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Datatable from "./UI/Datatable";
import ModeChage from "./UI/ModeChage";
import ContextForAutomatedQNA from "./UI/ContextForAutomatedQNA";
import Credential from "./UI/Credential";
import SampleCsv from "../sample/QnA.csv";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import Fab from "@mui/material/Fab";
import SettingsIcon from "@mui/icons-material/Settings";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "90vh",
  overflowY: "auto",
  //   bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  color: "white",
};

function CsvUpload() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  const [mode, setMode] = useState(null);

  const handleChange = (e) => {
    handleUpload(e.target.files[0]);
  };

  const handleUpload = (file) => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    Papa.parse(file, {
      complete: function (result) {
        if (result.data && result.data.length > 0) {
          // Assuming first row of CSV are headers
          const headers = result.data[0];
          const questionsIndex = headers.indexOf("questions");
          const answersIndex = headers.indexOf("answer");

          if (questionsIndex === -1 || answersIndex === -1) {
            alert(
              'CSV format not valid. Make sure to have "questions" and "answer" columns.'
            );
            return;
          }

          const jsonData = result.data.slice(1).map((row) => ({
            question: row[questionsIndex],
            answer: row[answersIndex],
          }));

          const filteredData = jsonData.filter((item) => item.question !== "");

          setData(filteredData);
          localStorage.setItem("qaData", JSON.stringify(filteredData));
        } else {
          alert("No data found in CSV.");
        }
      },
      error: function (err) {
        alert("Error parsing CSV. Please check the file and try again.");
        console.error(err);
      },
    });
  };

  useEffect(() => {
    const localData = localStorage.getItem("qaData");
    if (localData && localData != null) {
      setData(JSON.parse(localData));
    }
  }, []);

  const handleDownload = () => {
    const filePath = SampleCsv; // Specify the path to your sample CSV file

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = filePath;
    link.download = "sample.csv"; // Specify the desired filename

    // Simulate a click event to trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Fab
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          background: "#ad1b02",
        }}
        color="primary"
        aria-label="add"
        onClick={handleOpen}
      >
        <SettingsIcon className="SettingsSuggestIcon" />
      </Fab>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ background: "#2C3E50" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Settings
          </Typography>

          <Credential />
          <ModeChage setMode={setMode} />

          {mode === "manual" ? (
            <>
              <div className="file-upload-div">
                <input type="file" onChange={handleChange} accept=".csv" />
                <div>
                  <Button
                    color="info"
                    variant="outlined"
                    onClick={handleDownload}
                    style={{
                      marginRight: 10,
                      color: "white",
                      // background: "rgb(102 56 121)",
                    }}
                  >
                    Download Sample CSV
                  </Button>
                </div>
              </div>
              {data && <Datatable data={data} />}
            </>
          ) : (
            <>
              <ContextForAutomatedQNA />
            </>
          )}
          <Button
            variant="outlined"
            // color="success"
            onClick={() => window.location.reload()}
            startIcon={<TouchAppIcon fontSize="large" />}
            className="end-btn"
          >
            {" "}
            Apply Changes
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default CsvUpload;
