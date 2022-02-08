import './Thumbnail.css';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Thumbnail({ id, image, title }) {
  return (
    <Link className="thumbnail-component" data-testid="thumbnail-component" to={`/details/${id}`}>
      <img src={image} alt={title} />
      <div className="title">{title}</div>
    </Link>
  );
}

Thumbnail.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Thumbnail;
