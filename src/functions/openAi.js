export async function sendToChatGPT(prompt) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("api-key", "ee0aad3b4f7042e88a5252d5c1697fa9");
  myHeaders.append(
    "Authorization",
    "Bearer Bearer a8fe99cb6b354a06913f189536cdf8fc"
  );

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
    temperature: 0.7,
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

  const result = await fetch(
    "https://azure-test12.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-03-15-preview",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.log("error", error));

  return result;
}
