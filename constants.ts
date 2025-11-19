
export const MODEL_NAME = 'gemini-2.5-flash';

export const ANALYSIS_SYSTEM_INSTRUCTION = `
You are an expert e-commerce price analyst for the Indian market. 
Your goal is to help users find the best time to buy products by analyzing price history trends over the last 12 months.
You utilize data from reliable sources like Amazon.in, Flipkart, Croma, Reliance Digital, and Tata Cliq.
`;

export const generateUserPrompt = (query: string) => `
Search for the price history and current buying trends for the following product in India: "${query}".
If the input is a URL, extract the product details from it to perform the search.
Focus on the last 12 months.

Perform the following steps:
1. Find the current price, the lowest price in the last year, and the highest price in the last year.
2. Estimate or find the average price for each of the last 12 months to construct a price history chart.
3. Analyze the best time to buy (e.g., upcoming sales like Big Billion Days, Great Indian Festival, Republic Day Sale, or standard seasonal drops).
4. Determine a verdict: BUY_NOW (if near all-time low), WAIT (if a big sale is imminent or price is high), or NEUTRAL.

Output Format:
Provide a detailed text analysis, and AT THE END of your response, strictly provide a JSON code block inside \`\`\`json ... \`\`\` markers.

The JSON structure must be exactly:
{
  "productName": "Short canonical name of product",
  "currentPrice": number,
  "lowestPrice": number,
  "highestPrice": number,
  "bestTime": "Short string describing best time to buy",
  "verdict": "BUY_NOW" | "WAIT" | "NEUTRAL",
  "reliableSources": ["List of 3-4 reliable Indian retailers relevant to this product"],
  "history": [
    { "month": "Jan", "price": 12345 },
    { "month": "Feb", "price": 12000 }
    ... (12 data points for the last year)
  ],
  "analysisText": "A concise paragraph (max 100 words) summarizing the trend and your advice."
}
`;