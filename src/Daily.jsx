import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

import iconAssigner from './iconAssigner.jsx';

export default props => {
  return (
    <Col lg={4} md={6} sm={12} xs={12}>
      <Card className="text-center" style={{borderRadius: '0px'}}>
        <Card.Header>
          {new Date(props.data.time * 1000).toDateString().split(' ')[0]} {iconAssigner(props.data.icon)}
        </Card.Header>
        <Card.Body>
          <p>Sunrise: {new Date(props.data.sunriseTime * 1000).toTimeString().split(' ')[0]}</p>
          <p>Sunset: {new Date(props.data.sunsetTime * 1000).toTimeString().split(' ')[0]}</p>
          <p><b>Temperature:</b></p>
          <FontAwesomeIcon icon={faAngleUp} /> {`${props.data.temperatureHigh} °C at ${new Date(props.data.temperatureHighTime * 1000).toTimeString().split(' ')[0]}`}
          <span>&nbsp;&nbsp;&nbsp;</span>
          <FontAwesomeIcon icon={faAngleDown} /> {`${props.data.temperatureLow} °C at ${new Date(props.data.temperatureLowTime * 1000).toTimeString().split(' ')[0]}`}
        </Card.Body>
      </Card>
    </Col>
  )
}
