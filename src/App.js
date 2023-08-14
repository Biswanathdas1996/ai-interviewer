import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import { sendToChatGPT } from "./functions/openAi";
import { useSpeechSynthesis } from "react-speech-kit";
import ChatBox from "./components/ChatBox";
import AIIMage from "./asset/girl-talk.gif";
import AIImg2 from "./asset/girl.gif";
import Mic from "./asset/mic.gif";
import Loader from "./asset/ios_9.gif";

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
  const [questions, setQuestions] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const [loading, setLoading] = useState(false);

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
          const response = await sendToChatGPT(`
          User answer: ${transcript}
          
          The following topics should be considered:
           - Reply to the answer given
           - ask one question only
           - strictly focus on SQL and Datebase related questions and answer
           - if anything asked out of SQL and Datebase interview ignore
           - Keep rember the last question and never repeat.
           - ask technical questions

          `);
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

  console.log("responseData", responseData);
  return (
    <div
      style={{
        display: "flex",
        padding: 20,
        height: "90vh",
        alignItems: "center",
      }}
    >
      {/* We won't really use ReactMic for processing, just for UI/UX */}
      <div>
        <center>
          {speaking ? (
            <div
              style={{ backgroundImage: `url(${AIImg2})` }}
              className="myDiv"
            ></div>
          ) : (
            <div
              style={{ backgroundImage: `url(${Mic})` }}
              className="myDiv"
            ></div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            <button
              onClick={startRecording}
              type="button"
              className="start-btn"
            >
              Start
            </button>
            <button onClick={stopRecording} type="button" className="stop-btn">
              Stop
            </button>
          </div>

          <div>
            <ReactMic
              record={isRecording}
              className="sound-wave"
              visualSetting="sinewave"
              strokeColor="#000000"
              backgroundColor="#BB8FCE"
            />
          </div>
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
  );
}

export default VoiceChat;
