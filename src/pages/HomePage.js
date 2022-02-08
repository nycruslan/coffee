import './HomePage.css';

import PropTypes from 'prop-types';
import Thumbnail from '../components/Thumbnail';
import { itemImages } from '../items';

function HomePage({ items }) {
  return (
    <div>
      <div className="home-component">
        {items.map((item) => (
          <Thumbnail
            key={item.id}
            id={item.id}
            image={itemImages[item.imageId]}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
}

HomePage.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  })).isRequired,
};

export default HomePage;
