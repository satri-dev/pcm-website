export type ConvertDirection = "np2en" | "en2np";

export interface ConverterPanel {
  direction: ConvertDirection;
  inputText: string;
  outputText: string;
}
