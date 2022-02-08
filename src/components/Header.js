import './Header.css';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CartIcon from '../images/cart.svg';

import UserDetails from './UserDetails';

function Header({ cart }) {
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header>
      <h1><Link to="/">Coffee Shop</Link></h1>
      <UserDetails />
      <Link to="/cart" className="cart">
        <img src={CartIcon} alt="Cart" />
        <div className="badge" data-testid="cart-quantity">{cartQuantity}</div>
      </Link>
    </header>
  );
}

Header.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
};

export default Header;
