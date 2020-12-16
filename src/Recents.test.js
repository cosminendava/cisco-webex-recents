import { render, screen } from '@testing-library/react';
import Recents from './Recents';

test('renders learn react link', () => {
  render(<Recents />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
