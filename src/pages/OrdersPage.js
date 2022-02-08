import './OrdersPage.css';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import ClipLoader from 'react-spinners/ClipLoader';

import axios from 'axios';

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

function OrdersPage({ items }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`${(
      window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    )}${window.location.host}/ws-coffee`);
    ws.onopen = () => {
      console.log('connected');
    };
    ws.onerror = (event) => {
      console.error(event);
    };
    ws.onmessage = (message) => {
      const newOrders = JSON.parse(message.data);
      setLoading(false);
      setOrders(newOrders);
    };
    ws.onclose = () => {
      console.log('disconnected');
    };

    Modal.setAppElement('#root');

    return () => {
      ws.close();
    };
  }, []);

  const putData = async (order) => {
    try {
      await axios.put(`/api/orders/${order.id}`, {
        id: order.id,
        isComplete: true,
        name: order.name,
        items: order.items,
        phone: order.phone,
        zipCode: order.zipCode,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteOrder = async (order) => {
    try {
      await axios.delete(`api/orders/${order.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => setConfirmModalOpen(false);

  const conditionalRendering = () => {
    if (loading) return <ClipLoader size={100} color="white" />;
    if (orders.length === 0 && !loading) return <h3>No Orders yet 🙃</h3>;

    return (
      orders.map((order) => (

        <div className="order" key={order.id}>
          <Modal
            isOpen={!!confirmModalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Action confirmation"
          >
            <p>Are you sure you want to delete this order?</p>
            <button
              className="delete"
              onClick={() => {
                deleteOrder(order);
                closeModal();
              }}
              type="button"
            >
              Delete Forever

            </button>
            <button className="green-btn" type="button" onClick={() => closeModal()}>Cancel</button>
          </Modal>
          <div>
            <h4>Name:</h4>
            <p>{order.name}</p>
          </div>
          {order.phone ? (
            <div>
              <h4>Phone number:</h4>
              <p>{order.phone}</p>
            </div>
          ) : null}
          <div>
            <h4>Zip Code:</h4>
            <p>{order.zipCode}</p>
          </div>

          <h4>Items:</h4>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {`${item.quantity} - ${items.find((i) => i.id === item.id).title}`}
              </li>
            ))}
          </ul>

          <div>
            <button
              className="delete"
              type="button"
              onClick={() => setConfirmModalOpen(true)}
            >
              Delete Order

            </button>
            <button className="green-btn" type="button" onClick={() => putData(order)}>Complete Order</button>
            <h4 className={order.isComplete ? 'order-complete' : 'order-pending'}>
              {order.isComplete ? 'Completed ✅' : 'Order in progress 🧑‍💻'}
            </h4>
          </div>
        </div>
      ))
    );
  };

  return (
    <div className="orders-component">
      <h2>Existing Orders</h2>
      {conditionalRendering()}
    </div>
  );
}

OrdersPage.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  })).isRequired,
};

export default OrdersPage;
