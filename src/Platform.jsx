import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Form, InputGroup, Row, Col, Container, Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMapMarkerAlt, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faCloud, faSun, faMoon, faCloudShowersHeavy } from '@fortawesome/free-solid-svg-icons';
import { faSnowflake, faRainbow, faWind, faSmog, faCloudSun, faCloudMoon } from '@fortawesome/free-solid-svg-icons';
import { faCloudMeatball, faMeteor } from '@fortawesome/free-solid-svg-icons';

import Daily from './Daily.jsx';
import iconAssigner from './iconAssigner.jsx';
import chartOptions from './chartOptions.js';

export default class Platform extends React.Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      weatherData: {},
      locateMeDisabled: false,
      submitButtonDisabled: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCordinates = this.getCordinates.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.setState({ submitButtonDisabled: true });
    const form = document.forms.addressForm;
    const textAddress = {
      location: form.textAddress.value
    };

    //Get weather data via textual address from API
    const options = {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(textAddress)
    }
    fetch('/text', options)
      .then(result => {
        if (result.status == 200) {
          result.json().then(res => this.setState({ weatherData: res }))
        } else {
          result.json().then(res => this.setState({ errors: res }))
        }
      })
      .catch(err => console.error(err))
  }

  resetForm (e) {
    this.setState({
      errors: {},
      weatherData: {},
      locateMeDisabled: false,
      submitButtonDisabled: false,
    });
  }

  getCordinates (e) {
    this.setState({ locateMeDisabled: true });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        const options = {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify(coords)
        }
        //Get weather data from co-ordinates data from API
        fetch('/coords', options)
          .then(result => {
            if (result.status == 200) {
              result.json().then(res => this.setState({ weatherData: res }))
            } else {
              result.json().then(res => this.setState({ errors: res }))
            }
          })
          .catch(err => console.error(err))
      }, (err) => {
        switch(err.code) {
	    		case err.PERMISSION_DENIED:
	    		  alert('You must allow to access your location, alternatively you can key in your location to check the weather!');
	    		  break;
	    		case err.POSITION_UNAVAILABLE:
	    		  alert("Location information is unavailable.");
	    		  break;
	    		case err.TIMEOUT:
	    		  alert("The request to get user location timed out. Please try again!");
	    		  break;
	    		case err.UNKNOWN_ERROR:
	    		  alert("An unknown error occurred.");
	    		  break;
		    }
      });
    }
  }

  render () {
    const { errors, weatherData, locateMeDisabled, submitButtonDisabled } = this.state;
    const spinnerElementLocate = (<span><Spinner animation="grow" size="sm" variant="secondary" /> Loading...</span>);
    const spinnerElementSubmit = (<span><Spinner animation="grow" size="sm" variant="light" /> Loading...</span>);
    const locateMeInnerText = (<span><FontAwesomeIcon icon={faLocationArrow} className="mr-1" />Locate Me</span>);
    const resetInnerText = (<span><FontAwesomeIcon icon={faArrowLeft} className="mr-1" />Back</span>);
    let weatherSummaryIcon;

    if (Object.values(errors).length) {
      return(
        <React.Fragment>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Card className="mb-3" style={{borderRadius: '0px'}}>
                <Card.Header as="h3" className="text-primary">
                  {errors.title}
                </Card.Header>
                <Card.Body>
                  {errors.message}
                </Card.Body>
              </Card>
              <Button variant="outline-primary" onClick={this.resetForm} style={{borderRadius: '0px', border: '1px solid #ced4da'}} className="float-left">{resetInnerText}</Button>
            </Col>
          </Row>
        </React.Fragment>
      )
    } else if (Object.values(weatherData).length) {
      let weatherSummaryIcon = iconAssigner(weatherData.icon);
      const chartDetails = chartOptions(weatherData);
      let dailyElements = weatherData.daily.map((elem, index) => <Daily data={elem} key={index} />);

      return (
        <React.Fragment>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Card className="mb-3 text-center" style={{borderRadius: '0px'}}>
                <Card.Header as="h3" className="text-primary">
                  <Button variant="outline-primary" onClick={this.resetForm} style={{borderRadius: '0px', border: '1px solid #ced4da'}} className="float-left">{resetInnerText}</Button>
                  Weather Details
                </Card.Header>
                <Card.Body>
                  <Card.Title as="h5">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {weatherData.displayName}
                  </Card.Title>
                  <Row>
                    <Col lg={1} md={4} sm={12} xs={12}>
                      <p><FontAwesomeIcon icon={faThermometerHalf} /> {weatherData.temperature}</p>
                    </Col>
                    <Col lg={2} md={4} sm={12} xs={12}>
                      <p>Feels Like: {weatherData.apparentTemperature}</p>
                    </Col>
                    <Col lg={2} md={4} sm={12} xs={12}>
                      <p>Wind Speed: {weatherData.windSpeed}</p>
                    </Col>
                    <Col lg={2} md={4} sm={12} xs={12}>
                      <p>{weatherSummaryIcon} {weatherData.summary}</p>
                    </Col>
                    <Col lg={2} md={4} sm={12} xs={12}>
                      <p>Humidity Level: {weatherData.humidity}</p>
                    </Col>
                    <Col lg={3} md={4} sm={12} xs={12}>
                      <p>Forecast: {weatherData.forecast}</p>
                    </Col>
                  </Row>
                  <Card className="mb-3 text-center" style={{borderRadius: '0px'}}>
                    <Card.Header>
                      Next 12 hours' temperature forecast in °C
                    </Card.Header>
                    <Row>
                      <Col lg={3} md={1} sm={12} xs={12}></Col>
                      <Col lg={6} md={10} sm={12} xs={12}>
                        <div>
                          <Chart type="area" series={chartDetails.series} options={chartDetails.options} height="250" />
                        </div>
                      </Col>
                      <Col lg={3} md={1} sm={12} xs={12}></Col>
                    </Row>
                  </Card>
                  <Card className="mb-3 text-center" style={{borderRadius: '0px'}}>
                    <Card.Header>
                      Upcoming days' forecast
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {dailyElements}
                      </Row>
                    </Card.Body>
                  </Card>
                  <Button variant="outline-primary" onClick={this.resetForm} style={{borderRadius: '0px', border: '1px solid #ced4da'}} className="float-left">{resetInnerText}</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </React.Fragment>
      );
    } else {
      return (
        <Container fluid={true}>
          <Row>
            <Col lg={2} md={1} sm={0} xs={0}></Col>
            <Col lg={8} md={10} sm={12} xs={12}>
              <Card text="primary" style={{borderRadius: '0px'}} className="text-center">
                <Card.Header as="h5">
                  Check Weather
                </Card.Header>
                <Card.Body>
                  <Form name="addressForm" onSubmit={this.handleSubmit}>
                    <Form.Row>
                      <Form.Group as={Col}>
                        <InputGroup>
                          <InputGroup.Prepend>
                            <Form.Control name="textAddress" placeholder="Enter address/location" required={true} style={{borderRadius: '0px'}} />
                          </InputGroup.Prepend>
                          <Button type="submit" variant="primary" name="checkButton" disabled={submitButtonDisabled} style={{borderRadius: '0px'}}>{ submitButtonDisabled ? spinnerElementSubmit : 'Check' }</Button>
                        </InputGroup>
                      </Form.Group>
                      <Form.Label as={Col}>OR</Form.Label>
                      <Form.Group as={Col}>
                        <Button variant="light" onClick={this.getCordinates} disabled={locateMeDisabled} style={{borderRadius: '0px', border: '1px solid #ced4da'}} >{ locateMeDisabled ? spinnerElementLocate : locateMeInnerText }</Button>
                      </Form.Group>
                    </Form.Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={1} sm={0} xs={0}></Col>
          </Row>
        </Container>
      );
    }
  }
}
