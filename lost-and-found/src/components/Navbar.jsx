import { useState, useEffect } from 'react';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaWallet, FaSearch } from 'react-icons/fa';
import { connectWallet, getWalletAddress, truncateAddress } from '../services/contract';

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkWalletConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      const address = await getWalletAddress();
      setWalletAddress(address);
    } catch (error) {
      console.log('Wallet not connected');
    }
  };

  const handleAccountChange = (accounts) => {
    setWalletAddress(accounts[0] || null);
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
    setConnecting(false);
  };

  return (
    <BSNavbar expand="lg" className="navbar-custom" sticky="top">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="brand-logo">
          <FaSearch className="me-2" />
          Lost & Found
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="navbar-nav" />
        
        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/report" 
              className={location.pathname === '/report' ? 'active' : ''}
            >
              Report Item
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/items" 
              className={location.pathname === '/items' ? 'active' : ''}
            >
              Browse Items
            </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center">
            {walletAddress ? (
              <div className="wallet-badge">
                <FaWallet className="me-2" />
                {truncateAddress(walletAddress)}
              </div>
            ) : (
              <Button 
                variant="light" 
                className="connect-btn"
                onClick={handleConnect}
                disabled={connecting}
              >
                <FaWallet className="me-2" />
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
