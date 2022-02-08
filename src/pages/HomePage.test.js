import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import HomePage from './HomePage';
import { items } from '../items';

describe('Home', () => {
  it('Displays Items', () => {
    render(<Router><HomePage items={items} /></Router>);
    const thumbnails = screen.queryAllByTestId('thumbnail-component');
    expect(thumbnails).toHaveLength(items.length);
  });
});
