import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <Spinner animation="border" className="loading-spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
