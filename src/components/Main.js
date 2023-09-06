import React, { useEffect, useState } from "react";
import { ReactMic } from "react-mic";
import { aiResponseHandler } from "../functions/openAi";
import ChatBox from "../components/ChatBox";
import VoiceOverImage from "./UI/VoiceOverImage";
import Loader from "../asset/ios_9.gif";
import ButtonsUi from "./UI/ButtonsUi";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Settings from "./Settings";

function chunkText(text, length = 100) {
  const chunks = [];
  while (text.length > 0) {
    const chunk = text.substr(0, length);
    const lastSpace = chunk.lastIndexOf(" ");
    if (lastSpace !== -1 && text.length !== length) {
      chunks.push(chunk.substr(0, lastSpace));
      text = text.substr(lastSpace + 1);
    } else {
      chunks.push(chunk);
      text = text.substr(length);
    }
  }
  return chunks;
}

function speak({ text, onEnd }) {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      if (onEnd) onEnd();
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}

function VoiceChat() {
  const [isRecording, setRecording] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("ai-config")) {
      const defaultSettings = localStorage.getItem("ai-config");
      const tempSettings = JSON.parse(defaultSettings);
      setSettings(tempSettings);
    }
  }, []);

  // const { speak } = useSpeechSynthesis();

  async function speakLongText(text) {
    setSpeaking(true);
    const chunks = chunkText(text);
    for (let i = 0; i < chunks.length; i++) {
      await speak({ text: chunks[i] });
    }
    startRecording();
    setSpeaking(false);
  }

  let recognition;

  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = async function (event) {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          console.log("=====transcript===>", transcript);

          responseData.push({
            user: "You",
            text: transcript,
          });
          setResponseData(responseData);
          // speak({ text: transcript });
          stopRecording();
          setLoading(true);

          const response = await aiResponseHandler(
            transcript,
            settings,
            responseData
          );
          setLoading(false);
          console.log("=====response===>", response);
          responseData.push({
            user: "Jan",
            text: response,
          });
          setResponseData(responseData);
          speakLongText(response);
        } else {
          interimTranscript += transcript;
        }
      }
    };
  }

  const startRecording = () => {
    setRecording(true);
    if (recognition) recognition.start();
  };

  const stopRecording = () => {
    setRecording(false);
    if (recognition) recognition.stop();
  };

  // const speak = (message) => {
  //   const utterance = new SpeechSynthesisUtterance(message);
  //   window.speechSynthesis.speak(utterance);
  // };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            lg={8}
            style={{ display: "grid", alignItems: "center" }}
          >
            <center>
              <VoiceOverImage speaking={speaking} />
              <ButtonsUi
                startRecording={startRecording}
                stopRecording={stopRecording}
                isRecording={isRecording}
              />
              <ReactMic
                record={isRecording}
                className="sound-wave"
                visualSetting="sinewave"
                strokeColor="#ffff"
                backgroundColor="#bb8fce2b"
              />
            </center>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            {responseData && <ChatBox chatData={responseData} />}
            <center>
              {loading && (
                <div
                  style={{ backgroundImage: `url(${Loader})` }}
                  className="myDiv-loader"
                ></div>
              )}
            </center>
          </Grid>
        </Grid>
      </Box>
      {/* <div
        style={{
          display: "flex",
          padding: 20,
          height: "90vh",
          alignItems: "center",
        }}
      >
        
       
      </div> */}

      <Settings />
    </>
  );
}

export default VoiceChat;
