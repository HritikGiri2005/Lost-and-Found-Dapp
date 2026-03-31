import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHandHolding, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { reportLostItem, reportFoundItem, getWalletAddress, connectWallet } from '../services/contract';

const Report = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLost, setIsLost] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
  });

  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    try {
      const address = await getWalletAddress();
      setWalletAddress(address);
    } catch (error) {
      console.log('Wallet not connected');
    }
  };

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      toast.success('Wallet connected!');
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.name || !formData.description || !formData.location) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      if (isLost) {
        await reportLostItem(formData.name, formData.description, formData.location);
        toast.success('Lost item reported successfully!');
      } else {
        await reportFoundItem(formData.name, formData.description, formData.location);
        toast.success('Found item reported successfully!');
      }
      
      setFormData({ name: '', description: '', location: '' });
      navigate('/items');
    } catch (error) {
      console.error('Report error:', error);
      if (error.message.includes('user rejected')) {
        toast.error('Transaction was cancelled');
      } else {
        toast.error('Failed to report item. Please try again.');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="report-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="report-card">
              <Card.Body>
                <h2 className="page-title">Report an Item</h2>
                <p className="page-subtitle">
                  Fill in the details below to report a lost or found item
                </p>

                {!walletAddress && (
                  <Alert variant="warning" className="wallet-alert">
                    <Alert.Heading>Wallet Not Connected</Alert.Heading>
                    <p>You need to connect your MetaMask wallet to report an item.</p>
                    <Button variant="success" onClick={handleConnect}>
                      Connect Wallet
                    </Button>
                  </Alert>
                )}

                {/* Type Toggle */}
                <div className="type-toggle">
                  <button 
                    type="button"
                    className={`toggle-btn ${isLost ? 'active lost' : ''}`}
                    onClick={() => setIsLost(true)}
                  >
                    <FaSearch className="me-2" />
                    Lost Item
                  </button>
                  <button 
                    type="button"
                    className={`toggle-btn ${!isLost ? 'active found' : ''}`}
                    onClick={() => setIsLost(false)}
                  >
                    <FaHandHolding className="me-2" />
                    Found Item
                  </button>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="e.g., Blue Wallet, iPhone 14, Car Keys"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      className="custom-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      placeholder="Provide detailed description including color, brand, distinguishing features..."
                      value={formData.description}
                      onChange={handleChange}
                      disabled={loading}
                      className="custom-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      {isLost ? 'Last Known Location' : 'Where Found'}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      placeholder="e.g., Central Park, Main Library, Coffee Shop on 5th Ave"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={loading}
                      className="custom-input"
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading || !walletAddress}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Processing Transaction...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Report;
