import './CartPage.css';

import PropTypes from 'prop-types';
import {
  useState, useMemo, useRef, useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Modal from 'react-modal';

import { CartTypes } from '../reducers/cartReducer';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    color: '#000',
  },
};

function CartPage({
  cart, dispatch, items, setQuantity,
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [apiError, setApiError] = useState(false);

  const zipRef = useRef();
  const navigate = useNavigate();

  const subTotal = cart.reduce((acc, item) => {
    const details = items.find((i) => item.id === i.id);
    return item.quantity * details.price + acc;
  }, 0);

  const taxRate = useMemo(() => {
    const taxPercentage = parseInt(zipCode.substring(0, 1) || '0', 10) + 1;
    return taxPercentage / 100;
  }, [zipCode]);

  const tax = subTotal * taxRate;
  const total = subTotal + tax;
  const formValid = zipCode.length === 5 && name.trim();

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const updatePhoneNumber = (newNumber) => {
    const digits = newNumber.replace(/\D/g, '');
    let formatted = digits.substring(0, 3);
    if (digits.length === 3 && newNumber[3] === '-') {
      formatted = `${formatted}-`;
    } else if (digits.length > 3) {
      formatted = `(${formatted}) ${digits.substring(3, 6)}`;
    }
    if (digits.length === 6 && newNumber[7] === '-') {
      formatted = `${formatted}-`;
    } else if (digits.length > 6) {
      formatted = `${formatted}-${digits.substring(6, 10)}`;
    }
    setPhone(formatted);

    if (digits.length === 10) {
      zipRef.current.focus();
    }
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    try {
      axios.post('/api/orders', {
        items: cart,
        name,
        phone,
        zipCode,
      });

      dispatch({ type: CartTypes.EMPTY });
      setThankYouOpen(true);
    } catch (error) {
      console.error(error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
    }
  };

  const thankYouModalClose = () => {
    setThankYouOpen(false);
    navigate('/');
  };

  const apiErrorClose = () => {
    setApiError(false);
  };

  return (
    <div className="cart-component">
      <Modal
        isOpen={thankYouOpen}
        onRequestClose={thankYouModalClose}
        style={customStyles}
        contentLabel="Thanks for your order"
      >
        <p>Thanks for your order</p>
        <button type="button" onClick={() => thankYouModalClose()}>Return Home</button>
      </Modal>
      <Modal
        isOpen={apiError}
        onRequestClose={apiErrorClose}
        style={customStyles}
        contentLabel="Something went wrong"
      >
        <p>There was an error submitting your order</p>
        <p>{ apiError }</p>
        <p>Please try again</p>
        <button type="button" onClick={() => apiErrorClose()}>OK</button>
      </Modal>
      <h1>Your Cart</h1>
      <div>
        {!cart.length ? <h3>Your Cart is Empty</h3> : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Quantity</th>
                  <th>Id</th>
                  <th>Price</th>
                  <th>Update item</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <select
                        name="qty"
                        id="quantity"
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.id, +e.target.value)}
                      >
                        {[...Array(10).keys()].map((key) => (
                          <option value={key + 1} key={key + 1}>{key + 1}</option>
                        ))}
                      </select>
                    </td>
                    <td>{items.find((i) => i.id === item.id).title}</td>
                    <td>
                      {`$${(item.quantity * items.find((i) => i.id === item.id).price).toFixed(2)}`}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => dispatch({
                          type: CartTypes.ADD,
                          itemId: item.id,
                        })}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        disabled={item.quantity === 1}
                        onClick={() => {
                          dispatch({
                            type: CartTypes.DECREASE,
                            itemId: item.id,
                          });
                        }}
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch({
                          type: CartTypes.REMOVE,
                          itemId: item.id,
                        })}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '20px' }}>
              {`Sub-total: $${subTotal.toFixed(2)}`}
            </div>
            <div>
              {`Tax: $${tax.toFixed(2)}`}
            </div>
            <div>
              <h3>
                {`Total: $${total.toFixed(2)}`}
              </h3>
            </div>
            <h1>Checkout</h1>
            <form autoComplete="off" onSubmit={submitOrder}>
              <label htmlFor="name">
                Name:
                {/* eslint-disable jsx-a11y/no-autofocus */}
                <input autoFocus type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label htmlFor="phone">
                Phone:
                <input type="tel" id="phone" value={phone} onChange={(e) => updatePhoneNumber(e.target.value)} />
              </label>
              <label htmlFor="zipCode">
                Zip Code:
                <input type="number" id="zipCode" ref={zipRef} value={zipCode} onChange={(e) => setZipCode(e.target.value)} required maxLength={5} />
              </label>
              <button type="submit" disabled={!formValid}>Place Order</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

CartPage.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  setQuantity: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  })).isRequired,
};

export default CartPage;
