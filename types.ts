
export interface PolishedParagraph {
  original: string;
  polished: string;
  explanations: string[];
}

export interface ProcessingResult {
  paragraphs: PolishedParagraph[];
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
