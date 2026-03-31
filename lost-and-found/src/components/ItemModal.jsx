import { useState } from 'react';
import { Modal, Button, Badge, Spinner } from 'react-bootstrap';
import { FaMapMarkerAlt, FaClock, FaUser, FaCheck } from 'react-icons/fa';
import { getTimeAgo, truncateAddress, claimItem } from '../services/contract';
import { toast } from 'react-toastify';

const ItemModal = ({ show, onHide, item, currentUser, onClaimed }) => {
  const [claiming, setClaiming] = useState(false);

  if (!item) return null;

  const isOwnItem = currentUser?.toLowerCase() === item.reporter.toLowerCase();
  const canClaim = !item.isClaimed && !isOwnItem && currentUser;

  const getStatusInfo = () => {
    if (item.isClaimed) {
      return { variant: 'secondary', text: 'Claimed' };
    }
    if (item.isLost) {
      return { variant: 'danger', text: 'Lost' };
    }
    return { variant: 'success', text: 'Found' };
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      toast.info('Submitting claim transaction...');
      const tx = await claimItem(item.id);
      console.log('Claim transaction submitted:', tx);
      
      toast.info('Transaction pending. Waiting for confirmation...');
      toast.success('Item claimed successfully!');
      onClaimed();
      onHide();
    } catch (error) {
      console.error('Claim error:', error);
      console.error('Error code:', error.code);
      console.error('Error reason:', error.reason);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      // Check for specific error messages from contract
      const errorMessage = error.message?.toLowerCase() || '';
      const errorReason = error.reason?.toLowerCase() || '';
      
      if (errorMessage.includes('own item') || errorReason.includes('own item')) {
        toast.error('You cannot claim your own item');
      } else if (errorMessage.includes('claimed') || errorReason.includes('claimed')) {
        toast.error('This item has already been claimed');
      } else if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        toast.error('Insufficient funds for transaction');
      } else if (errorMessage.includes('revert')) {
        toast.error('Transaction failed. Item may already be claimed.');
      } else {
        toast.error(`Failed to claim item: ${error.message || 'Unknown error'}`);
      }
    }
    setClaiming(false);
  };

  const status = getStatusInfo();

  return (
    <Modal show={show} onHide={onHide} centered className="item-modal">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-3">
          {item.name}
          <Badge bg={status.variant}>{status.text}</Badge>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div className="modal-section">
          <h6>Description</h6>
          <p>{item.description}</p>
        </div>
        
        <div className="modal-details">
          <div className="detail-row">
            <FaMapMarkerAlt className="detail-icon" />
            <div>
              <small>Location</small>
              <p>{item.location}</p>
            </div>
          </div>
          
          <div className="detail-row">
            <FaClock className="detail-icon" />
            <div>
              <small>Reported</small>
              <p>{getTimeAgo(item.timestamp)}</p>
            </div>
          </div>
          
          <div className="detail-row">
            <FaUser className="detail-icon" />
            <div>
              <small>Reporter</small>
              <p>{isOwnItem ? 'You' : truncateAddress(item.reporter)}</p>
            </div>
          </div>
        </div>

        {isOwnItem && (
          <div className="alert alert-info mt-3">
            This is your reported item
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        
        {canClaim && (
          <Button 
            variant="success" 
            onClick={handleClaim}
            disabled={claiming}
            className="claim-btn"
          >
            {claiming ? (
              <>
                <Spinner size="sm" className="me-2" />
                Claiming...
              </>
            ) : (
              <>
                <FaCheck className="me-2" />
                Claim Item
              </>
            )}
          </Button>
        )}
        
        {item.isClaimed && (
          <Button variant="secondary" disabled>
            Already Claimed
          </Button>
        )}
        
        {!currentUser && (
          <Button variant="warning" disabled>
            Connect Wallet to Claim
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ItemModal;
