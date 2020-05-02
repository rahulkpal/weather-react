import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMapMarkerAlt, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faCloud, faSun, faMoon, faCloudShowersHeavy } from '@fortawesome/free-solid-svg-icons';
import { faSnowflake, faRainbow, faWind, faSmog, faCloudSun, faCloudMoon } from '@fortawesome/free-solid-svg-icons';
import { faCloudMeatball, faMeteor, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

export default icon => {
  let weatherSummaryIcon;
  switch (icon) {
    case 'cloudy':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faCloud} />);
      break;
    case 'clear-day':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faSun} />);
      break;
    case 'clear-night':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faMoon} />);
      break;
    case 'rain':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faCloudShowersHeavy} />);
      break;
    case 'snow':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faSnowflake} />);
      break;
    case 'sleet':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faRainbow} />);
      break;
    case 'wind':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faWind} />);
      break;
    case 'fog':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faSmog} />);
      break;
    case 'partly-cloudy-day':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faCloudSun} />);
      break;
    case 'partly-cloudy-night':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faCloudMoon} />);
      break;
    case 'thunderstorm':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faCloudMeatball} />);
      break;
    case 'hail':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faMeteor} />);
      break;
    case 'tornado':
      weatherSummaryIcon = (<FontAwesomeIcon icon={faWind} />);
      break;
    default:
      weatherSummaryIcon = (<FontAwesomeIcon icon={faRainbow} />);
  }
  return weatherSummaryIcon;
}
