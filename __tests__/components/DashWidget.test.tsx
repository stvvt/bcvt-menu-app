import { render, screen } from '@testing-library/react';
import DashWidget from '@/components/DashWidget';
import { EnrichedMeal } from '@/types/app';
import getMealPrices from '@/utils/getMealPrices';

// Mock dependencies
jest.mock('@/utils/getMealPrices', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/components/FormatPrice', () => ({
  __esModule: true,
  default: ({ price }: { price: { price: string } }) => <span data-testid="format-price">{price.price}</span>,
}));

jest.mock('@/utils/currencyConverter', () => ({
  __esModule: true,
  default: jest.fn((price) => Number(price.price)),
}));

jest.mock('@/config/client', () => ({
  NEXT_PUBLIC_BASE_CURRENCY_CODE: 'CZK',
}));

// Mock ResizeObserver for Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('DashWidget', () => {
  const mockMeal = { name: 'Test Meal', images: [] } as unknown as EnrichedMeal;
  const mockDate = new Date('2024-01-01');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing if price history has 1 or fewer items', () => {
    (getMealPrices as jest.Mock).mockReturnValue([{ date: '2024-01-01', price: '100' }]);
    const { container } = render(<DashWidget meal={mockMeal} refDate={mockDate} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders price bars for extensive history', () => {
     (getMealPrices as jest.Mock).mockReturnValue([
       { date: '2024-01-01', price: '100' },
       { date: '2024-01-02', price: '120' }, // Increase
       { date: '2024-01-03', price: '110' }, // Decrease
     ]);
     
     render(<DashWidget meal={mockMeal} refDate={mockDate} />);
     
     const buttons = screen.getAllByRole('button');
     expect(buttons).toHaveLength(2);
     
     expect(buttons[0]).toHaveClass('bg-red-400'); // Increase (bad for user, expensive)
     expect(buttons[1]).toHaveClass('bg-green-400'); // Decrease (good for user, cheaper)
  });
  
  it('does not render bar if price did not change', () => {
      (getMealPrices as jest.Mock).mockReturnValue([
       { date: '2024-01-01', price: '100' },
       { date: '2024-01-02', price: '100' }, // No change
     ]);
     
     render(<DashWidget meal={mockMeal} refDate={mockDate} />);
     const buttons = screen.queryAllByRole('button');
     expect(buttons).toHaveLength(0);
  });
});
