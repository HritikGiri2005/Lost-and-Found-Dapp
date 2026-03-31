import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, ButtonGroup, Button } from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllItems, getWalletAddress } from '../services/contract';
import { toast } from 'react-toastify';

const Items = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    loadItems();
    checkWallet();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, searchTerm, filter]);

  const checkWallet = async () => {
    try {
      const address = await getWalletAddress();
      setWalletAddress(address);
    } catch (error) {
      console.log('Wallet not connected');
    }
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const fetchedItems = await getAllItems();
      // Sort by newest first
      const sortedItems = fetchedItems.sort((a, b) => b.timestamp - a.timestamp);
      setItems(sortedItems);
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items. Make sure MetaMask is connected to Ganache.');
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Apply status filter
    if (filter === 'lost') {
      filtered = filtered.filter(item => item.isLost && !item.isClaimed);
    } else if (filter === 'found') {
      filtered = filtered.filter(item => !item.isLost && !item.isClaimed);
    } else if (filter === 'claimed') {
      filtered = filtered.filter(item => item.isClaimed);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term)
      );
    }

    setFilteredItems(filtered);
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleItemClaimed = () => {
    loadItems(); // Refresh the list
  };

  const getFilterCount = (filterType) => {
    switch (filterType) {
      case 'lost':
        return items.filter(i => i.isLost && !i.isClaimed).length;
      case 'found':
        return items.filter(i => !i.isLost && !i.isClaimed).length;
      case 'claimed':
        return items.filter(i => i.isClaimed).length;
      default:
        return items.length;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading items from blockchain..." />;
  }

  return (
    <div className="items-page">
      <Container>
        <div className="items-header">
          <h2 className="page-title">Browse Items</h2>
          <p className="page-subtitle">
            {items.length} total items reported
          </p>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <Row className="align-items-center g-3">
            <Col md={6}>
              <InputGroup className="search-input">
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <div className="filter-buttons">
                <FaFilter className="filter-icon" />
                <ButtonGroup>
                  <Button
                    variant={filter === 'all' ? 'success' : 'outline-success'}
                    onClick={() => setFilter('all')}
                  >
                    All ({getFilterCount('all')})
                  </Button>
                  <Button
                    variant={filter === 'lost' ? 'danger' : 'outline-danger'}
                    onClick={() => setFilter('lost')}
                  >
                    Lost ({getFilterCount('lost')})
                  </Button>
                  <Button
                    variant={filter === 'found' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('found')}
                  >
                    Found ({getFilterCount('found')})
                  </Button>
                  {/* <Button
                    variant={filter === 'claimed' ? 'secondary' : 'outline-secondary'}
                    onClick={() => setFilter('claimed')}
                  >
                    Claimed ({getFilterCount('claimed')})
                  </Button> */}
                </ButtonGroup>
              </div>
            </Col>
          </Row>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <h4>No items found</h4>
            <p>
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to report an item!'}
            </p>
          </div>
        ) : (
          <Row className="g-4 items-grid">
            {filteredItems.map((item) => (
              <Col key={item.id} sm={6} lg={4}>
                <ItemCard
                  item={item}
                  onClick={() => handleCardClick(item)}
                  currentUser={walletAddress}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* Item Detail Modal */}
        <ItemModal
          show={showModal}
          onHide={handleCloseModal}
          item={selectedItem}
          currentUser={walletAddress}
          onClaimed={handleItemClaimed}
        />
      </Container>
    </div>
  );
};

export default Items;
