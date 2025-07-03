export type PriceHistoryItem = {
  name: string;
  prices: {
    dateText: string;
    date: string;
    price: string;
  }[];
}; 