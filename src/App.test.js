import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { items } from './items';
import { getOrders } from './mocks/data';

describe('App', () => {
  it('Displays the logged in user\'s name', async () => {
    render(<App />);
    await screen.findByText(/Welcome, Tester/);
  });

  it('Allows the user to build a cart and place an order', async () => {
    render(<div id="root"><App /></div>);
    await waitFor(() => {
      const thumbnails = screen.queryAllByTestId('thumbnail-component');
      expect(thumbnails).toHaveLength(items.length);
    });
    userEvent.click(screen.getByRole('link', { name: /Apple/i }));
    await screen.findByText(/Price:/);

    userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
    await waitFor(() => (
      expect(screen.getByTestId('cart-quantity')).toHaveTextContent('1')
    ));

    userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
    await waitFor(() => (
      expect(screen.getByTestId('cart-quantity')).toHaveTextContent('2')
    ));

    userEvent.click(screen.getByRole('link', { name: /Cart/i }));
    await screen.findByLabelText(/Name/);
    expect(screen.getByRole('button', { name: 'Place Order' })).toBeDisabled();

    userEvent.type(screen.getByLabelText(/Name/), 'Big Nerd Ranch');
    userEvent.type(screen.getByLabelText(/Zip Code/), '30307');
    expect(screen.getByRole('button', { name: 'Place Order' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'Place Order' }));
    await screen.findByText(/Thanks for your order/i);
    expect(getOrders()).toHaveLength(1);

    userEvent.click(screen.getByRole('button', { name: 'Return Home' }));
    await screen.findAllByTestId('thumbnail-component');
  });
});
