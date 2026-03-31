import { Card, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaClock, FaUser } from 'react-icons/fa';
import { getTimeAgo, truncateAddress } from '../services/contract';

const ItemCard = ({ item, onClick, currentUser }) => {
  const getStatusBadge = () => {
    if (item.isClaimed) {
      return <Badge bg="secondary" className="status-badge">Claimed</Badge>;
    }
    if (item.isLost) {
      return <Badge bg="danger" className="status-badge">Lost</Badge>;
    }
    return <Badge bg="success" className="status-badge">Found</Badge>;
  };

  const isOwnItem = currentUser?.toLowerCase() === item.reporter.toLowerCase();

  return (
    <Card className="item-card" onClick={onClick}>
      <Card.Body>
        <div className="card-header-row">
          <Card.Title className="item-name">{item.name}</Card.Title>
          {getStatusBadge()}
        </div>
        
        <Card.Text className="item-description">
          {item.description.length > 100 
            ? `${item.description.substring(0, 100)}...` 
            : item.description}
        </Card.Text>
        
        <div className="item-meta">
          <div className="meta-item">
            <FaMapMarkerAlt className="meta-icon" />
            <span>{item.location}</span>
          </div>
          <div className="meta-item">
            <FaClock className="meta-icon" />
            <span>{getTimeAgo(item.timestamp)}</span>
          </div>
          <div className="meta-item">
            <FaUser className="meta-icon" />
            <span>
              {isOwnItem ? 'You' : truncateAddress(item.reporter)}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ItemCard;
