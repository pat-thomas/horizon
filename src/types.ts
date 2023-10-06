export type PromptPart = {
  text: string,
  weight: string
};

export type AppState = {
  rawPrompt: string,
  promptParts: PromptPart[]
};
