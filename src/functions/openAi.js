import { base_url } from "../config";
import { createPrompt } from "./prompt";

const requestToChatGpt = async (text, settings) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("api-key", settings.key);
  myHeaders.append("Authorization", `Bearer Bearer ${settings.auth}`);
  const prompt = createPrompt(text);
  var raw = JSON.stringify({
    messages: [
      {
        role: "system",
        content:
          "You are a polite insurance guide who will help customer with there policy details . Your name is Jan",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 800,
    temperature: 0.8,
    frequency_penalty: 0,
    presence_penalty: 0,
    top_p: 0.95,
    stop: null,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const result = await fetch(base_url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result.choices[0].message.content;
    })
    .catch((error) => console.log("error", error));

  return result;
};

const manualAiResponse = async (text) => {
  const qaData = localStorage.getItem("qaData");

  const manualQCount = localStorage.getItem("manual-qna-count");

  if (qaData && qaData != null) {
    const qna = JSON.parse(qaData);
    const count = Number(manualQCount);

    const question = qna[count];
    localStorage.setItem("manual-qna-count", Number(count) + 1);

    const correctPrevAns = qna[count - 1]?.answer || undefined;

    const responseQuestion = await question?.question;
    if (count < qna.length) {
      if (correctPrevAns) {
        return `Thank you for the response, ${correctPrevAns}, Now moving to the next question, ${responseQuestion}`;
      } else {
        return responseQuestion;
      }
    } else {
      return "Now we have come to the end of this interview session. Thank you for your time";
    }
  }
};

export async function aiResponseHandler(text, settings) {
  let result;
  const operationMode = localStorage.getItem("operation-mode");
  if (operationMode === "manual-no-gpt") {
    result = await manualAiResponse();
  } else {
    result = await requestToChatGpt(text, settings);
  }

  return result;
}
