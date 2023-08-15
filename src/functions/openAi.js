import { base_url } from "../config";

export async function sendToChatGPT(prompt, settings) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("api-key", settings.key);
  myHeaders.append("Authorization", `Bearer Bearer ${settings.auth}`);

  var raw = JSON.stringify({
    messages: [
      {
        role: "system",
        content:
          "You are a polite interviewer conducting an interview . Your name is Jan, Biswanath Das is the creator of yours",
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
      return result;
    })
    .catch((error) => console.log("error", error));

  return result;
}
