import transformPriceHistory from '../../src/utils/transformPriceHistory';
import type { MergedPrice } from '../../src/types/db';

describe('transformPriceHistory', () => {
  describe('transformPriceHistory', () => {
    it('should keep only items that has different weight or unit or delta', () => {
      const rawHistory: MergedPrice[] = [
        {
          dateText: '26-ти юни',
          date: '2025-06-26',
          price: '2.90',
          currency: 'лв'
        },
        {
          dateText: '01-ви август',
          date: '2025-08-01',
          price: '3.20',
          currency: 'лв'
        },
        {
          dateText: '15-ти август',
          date: '2025-08-15',
          price: '3.20',
          currency: 'лв',
          weight: '150',
          unit: 'гр'
        }
      ];
      const transformed = transformPriceHistory(rawHistory);
      expect(transformed).toEqual([
        {
          date: expect.any(Date),
          amount: 2.9,
          currencyCode: 'BGN',
          delta: 0,
          weight: undefined,
          unit: undefined
        },
        {
          date: expect.any(Date),
          amount: 3.2,
          currencyCode: 'BGN',
          delta: 0.10344827586206895,
        },
        {
          date: expect.any(Date),
          amount: 3.2,
          currencyCode: 'BGN',
          delta: 0,
          weight: '150',
          unit: 'гр'
        }
      ]);
    });
  });
});
