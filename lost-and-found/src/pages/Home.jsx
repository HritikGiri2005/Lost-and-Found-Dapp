import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaHandHolding, FaList, FaShieldAlt, FaGlobe, FaLock } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="hero-content">
              <h1 className="hero-title">
                Lost Something?
                <span className="highlight"> Found Something?</span>
              </h1>
              <p className="hero-subtitle">
                A decentralized platform to help reunite lost items with their owners. .
              </p>
              <div className="hero-buttons">
                <Button 
                  as={Link} 
                  to="/report" 
                  variant="light" 
                  size="lg"
                  className="hero-btn primary-btn"
                >
                  <FaSearch className="me-2" />
                  Report Lost Item
                </Button>
                <Button 
                  as={Link} 
                  to="/report" 
                  variant="outline-light" 
                  size="lg"
                  className="hero-btn secondary-btn"
                >
                  <FaHandHolding className="me-2" />
                  Report Found Item
                </Button>
              </div>
            </Col>
            <Col lg={6} className="hero-image-col">
              <div className="hero-graphic">
                <div className="floating-card card-1">
                  <FaSearch size={24} />
                  <span>Lost Wallet</span>
                </div>
                <div className="floating-card card-2">
                  <FaHandHolding size={24} />
                  <span>Found Keys</span>
                </div>
                <div className="floating-card card-3">
                  <FaShieldAlt size={24} />
                  <span>Secure</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title">How It Works</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="feature-card">
                <Card.Body>
                  <div className="feature-icon">
                    <FaSearch />
                  </div>
                  <h4>Report</h4>
                  <p>
                    Report lost or found items with detailed descriptions and locations. 
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card">
                <Card.Body>
                  <div className="feature-icon">
                    <FaList />
                  </div>
                  <h4>Browse</h4>
                  <p>
                    Search through reported items using filters. Find matches for 
                    your lost items or locate owners of found items.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card">
                <Card.Body>
                  <div className="feature-icon">
                    <FaHandHolding />
                  </div>
                  <h4>Claim</h4>
                  <p>
                    Found a match? Claim the item to initiate the reunion process. 
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
{/* Why Choose Our Platform Section */}
<section className="why-section">
  <Container>
    <h2 className="section-title">Why Choose Our Platform?</h2>
    <Row className="g-4">
      <Col md={6}>
        <div className="why-item">
          <FaLock className="why-icon" />
          <div>
            <h5>Secure Records</h5>
            <p>All reported items are securely stored and protected from unauthorized changes.</p>
          </div>
        </div>
      </Col>
      <Col md={6}>
        <div className="why-item">
          <FaGlobe className="why-icon" />
          <div>
            <h5>Accessible Anywhere</h5>
            <p>Access and manage lost or found items anytime, from any location.</p>
          </div>
        </div>
      </Col>
      <Col md={6}>
        <div className="why-item">
          <FaShieldAlt className="why-icon" />
          <div>
            <h5>Full Transparency</h5>
            <p>Track item status and updates clearly with complete visibility.</p>
          </div>
        </div>
      </Col>
      <Col md={6}>
        <div className="why-item">
          <FaHandHolding className="why-icon" />
          <div>
            <h5>Reliable Process</h5>
            <p>A smooth and dependable system ensures fair and efficient item claims.</p>
          </div>
        </div>
      </Col>
    </Row>
  </Container>
</section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Browse all reported items or submit your own report</p>
            <Button 
              as={Link} 
              to="/items" 
              variant="light" 
              size="lg"
              className="cta-btn"
            >
              <FaList className="me-2" />
              View All Items
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
