import { base_url } from "../config";
import { createPrompt } from "./prompt";

const requestToChatGpt = async (text, settings, responseData) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("api-key", settings.key);
  myHeaders.append("Authorization", `Bearer Bearer ${settings.auth}`);
  const prompt = createPrompt(text, responseData);
  var raw = JSON.stringify({
    messages: [
      {
        role: "system",
        content:
          "You are a polite interviewer conducting an interview . Your name is Jan",
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

const testRequest = async (text, settings) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("api-key", settings.key);
  myHeaders.append("Authorization", `Bearer Bearer ${settings.auth}`);

  var raw = JSON.stringify({
    messages: [
      {
        role: "system",
        content: "You are a polite insurance guide. Your name is Jan",
      },
      // {
      //   role: "user",
      //   content: `
      //   User input: ${text}
      //   Follow one instruction at a time
      //   Output Insrtuctions:
      //   - if user asked to see policy, return a html button that opens in new tab with "https://myaccount.policybazaar.com/policyDetail/NTQzOTQzMzgy" this link

      //   - if user want to file a new claim then create a HTML form having "name", "dob", "hospital name", "policy no" and get request all the data to "https://myaccount.policybazaar.com/claimAssistance/24"
      //   `,
      // },
      {
        role: "user",
        content: `
          suggest a a list of medicine and itz compositions for the treatment of blood suger

          Poins must be consider for reply:
          - Reply only a json for only

          Expeted output format
          [
            {
              name:"medicine 1",
              compositions:["c1", "c2", "c3"]
            },
            {
              name:"medicine 2",
              compositions:["c1", "c2", "c3"]
            },
            ....
          ]
        `,
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

export async function aiResponseHandler(text, settings, responseData) {
  let result;
  const operationMode = localStorage.getItem("operation-mode");
  if (operationMode === "manual-no-gpt") {
    result = await manualAiResponse();
  } else {
    result = await requestToChatGpt(text, settings, responseData);
  }

  return result;
}
