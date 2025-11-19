export interface PricePoint {
  month: string;
  price: number;
}

export interface ProductAnalysis {
  productName: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  bestTime: string;
  verdict: 'BUY_NOW' | 'WAIT' | 'NEUTRAL';
  analysisText: string;
  history: PricePoint[];
  reliableSources: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  analysis: ProductAnalysis;
  groundingChunks: GroundingChunk[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
