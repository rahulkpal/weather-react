export default weatherData => {
  return {
    options: {
      chart: {
        id: "basic-bar",
        height: 50,
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true | '<img src="/static/icons/reset.png" width="20">',
          }
        },
      },
      xaxis: {
        type: 'categories',
        categories: weatherData.hourly.map(({ time }) => new Date(time * 1000).getHours() + ':00'),
        title: {
          text: "Next 12 hours' expected temperature in °C",
          fontFamily: 'Nunito Sans',
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth'
      },
    },
    series: [
      {
        name: "Temperature",
        data: weatherData.hourly.map(({ temperature }) => temperature),
      },
    ]
  };
}
