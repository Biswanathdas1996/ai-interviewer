import React, { useEffect, useState } from "react";
import { ReactMic } from "react-mic";
import { sendToChatGPT } from "../functions/openAi";
import ChatBox from "../components/ChatBox";
import VoiceOverImage from "./UI/VoiceOverImage";
import Loader from "../asset/ios_9.gif";
import ButtonsUi from "./UI/ButtonsUi";
import { createPrompt } from "../functions/prompt";

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
  const [settings, setSettings] = useState(false);

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
          const response = await sendToChatGPT(
            createPrompt(transcript),
            settings
          );
          setLoading(false);
          console.log("=====response===>", response.choices[0].message.content);
          responseData.push({
            user: "Jan",
            text: response.choices[0].message.content,
          });
          setResponseData(responseData);
          speakLongText(response.choices[0].message.content);
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
      <div
        style={{
          display: "flex",
          padding: 20,
          height: "90vh",
          alignItems: "center",
        }}
      >
        <div>
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
        </div>
        <div style={{ width: "100%" }}>
          {responseData && <ChatBox chatData={responseData} />}
          <center>
            {loading && (
              <div
                style={{ backgroundImage: `url(${Loader})` }}
                className="myDiv-loader"
              ></div>
            )}
          </center>
        </div>
      </div>

      <Settings />
    </>
  );
}

export default VoiceChat;
