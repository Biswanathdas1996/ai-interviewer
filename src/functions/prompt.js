export function automatedMode(text, responseData) {
  const getSettings = localStorage.getItem("ai-settings");
  if (getSettings && getSettings != null) {
    const settings = JSON.parse(getSettings);

    const userAnsewr = `User answer: ${text}`;
    const context = ` Context: ${settings.context}`;
    const chatHistory = ` Chat History: ${JSON.stringify(responseData)}`;
    const instructions = ` The following topics should be considered:
                            - Keep follow the Chat History for further response 
                            ${settings.instructions}
                        `;
    return userAnsewr + context + chatHistory + instructions;
  }
}

export function manualMode(text) {
  const qaData = localStorage.getItem("qaData");

  const manualQCount = localStorage.getItem("manual-qna-count");

  if (qaData && qaData != null) {
    const qna = JSON.parse(qaData);

    const count = Number(manualQCount);

    const question = qna[count];
    localStorage.setItem("manual-qna-count", Number(count) + 1);

    const prevQuestion = qna[count - 1]?.question;

    let dynamicText = "";

    if (prevQuestion) {
      dynamicText = `
      Please validate the user response of "${text}" to the question "${prevQuestion}" in 1 sentence.
      Please provide answer of ${prevQuestion} in 1 sentence.
      `;
    }

    const context = `Ask the bellow Question 

    Question serial: ${count}

    Question : ${question?.question || "none"}`;

    const instructions = ` The following topics should be considered:
  - if the "Correct Answer" is "null"  and "Question serial" is 0 then ignore it and do not reply  
  - if the "Correct Answer" is "null"  and "Question serial" is not 0 thank the candidate and do not ask any further question.  
  - if Question is 'none' stop the interview
  - ask the question only
  - make it polite and user friendly reply
  - do not make the reply convertional
  - give one response at a time
  - ask technical questions`;

    return dynamicText + context + instructions;
  }
}

export function createPrompt(text, responseData) {
  const operationMode = localStorage.getItem("operation-mode");
  if (operationMode === "manual") {
    return manualMode(text);
  } else {
    return automatedMode(text, responseData);
  }
}
