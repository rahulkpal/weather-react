import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Platform from './Platform.jsx';
import Credits from './Credits.jsx';
import Footer from './Footer.jsx';

export default class Page extends React.Component {
  // constructor() {
  //
  // }
  render () {
    return (
      <div>
        <Container fluid={true}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <br></br>
                  <Platform />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <br></br>
        <Credits />
        <Footer />
      </div>
    );
  }
}
