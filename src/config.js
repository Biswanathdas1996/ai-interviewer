export const base_url =
  "https://soumenopenai.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-03-15-preview";
// export const base_url =
//   "https://azure-test12.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-03-15-preview";

export const api_key = "3a5a6eba4d2546558d3fa749ef9fb5ce";
export const authorization = "a8fe99cb6b354a06913f189536cdf8fc";

export const defaultContext = `Interview for a Javscript software engineer position`;
export const defaultInstructions = `
- Reply to the answer given
- ask one question only
- strictly focus on JavaScript and react JS related questions and answer
- if anything asked out of JavaScript and react JS interview ignore
- Keep remember the last question and never repeat.
- ask technical questions
`;
