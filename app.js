const express = require('express');
const app = express();
const { proxy, scriptUrl } = require('rtsp-relay')(app);
var bodyParser = require('body-parser');
const httpClient = require('urllib');

const handler = proxy({
  url: `rtsp://admin:password123@192.168.0.127:554/Streaming/Channels/202`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
  additionalFlags: ['-q', '1'],
});

// Go ahead and make them request!
// the endpoint our RTSP uses
app.use(bodyParser.json());
app.ws('/api/stream', handler);

// this is an example html page to view the stream
app.get('/', (req, res) =>
  res.send(`
  <canvas id='canvas' width="600" height="600"></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://' + location.host + '/api/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`)
);
app.get('/ptz/left', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('camera id: ' + req.query.id);
  console.log('camera id: ' + req.body);
  var data;
  const url = `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.id}/continuous`;
  const options = {
    method: 'PUT',
    rejectUnauthorized: false,
    // auth: "username:password" use it if you want simple auth
    digestAuth: 'admin:password123',
    content:
      '<?xml version: "1.0" encoding="UTF-8"?>\r\n<PTZData>\r\n    <pan>-60</pan>\r\n    <tilt>0</tilt>\r\n</PTZData>',
    headers: {
      'Content-Type': 'application/xml',
      //'Content-Type': 'application/json' use it if payload is json
      //'Content-Type': 'application/text'
    },
  };
  const options2 = {
    method: 'PUT',
    rejectUnauthorized: false,
    // auth: "username:password" use it if you want simple auth
    digestAuth: 'admin:password123',
    content:
      '<?xml version: "1.0" encoding="UTF-8"?>\r\n<PTZData>\r\n    <pan>0</pan>\r\n    <tilt>0</tilt>\r\n</PTZData>',
    headers: {
      'Content-Type': 'application/xml',
      //'Content-Type': 'application/json' use it if payload is json
      //'Content-Type': 'application/text'
    },
  };
  const responseHandler = (err, data, res) => {
    if (err) {
      console.log(err);
    }
    console.log(res.statusCode);
    console.log(res.headers);
    console.log(data.toString('utf8'));
    data = data;
  };
  httpClient.request(url, options, responseHandler);
  httpClient.request(url, options2, responseHandler);
  res.status(200).end(data); // Responding is important
});

app.get('/temps', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('camera id: ' + req.query.id);
  console.log('camera id: ' + req.body);
  var resData;
  const url =
    'http://192.168.0.127/ISAPI/Thermal/channels/2/thermometry/1/rulesTemperatureInfo?format=json';
  const options = {
    method: 'GET',
    rejectUnauthorized: false,
    // auth: "username:password" use it if you want simple auth
    digestAuth: 'admin:password123',
    //content: 'Hello world. Data can be json or xml.',
    dataType: 'json',
    headers: {
      //'Content-Type': 'application/xml'  use it if payload is xml
      //'Content-Type': 'application/json' use it if payload is json
      //'Content-Type': 'application/text'
    },
  };
  const responseHandler = (err, data, res) => {
    if (err) {
      console.log(err);
    }
    console.log(res.statusCode);
    console.log(res.headers);
    console.log(
      data.ThermometryRulesTemperatureInfoList
        .ThermometryRulesTemperatureInfo[0].averageTemperature
    );
    resData =
      data.ThermometryRulesTemperatureInfoList
        .ThermometryRulesTemperatureInfo[0].averageTemperature;
  };
  var millisecondsToWait = 500;
  httpClient.request(url, options, responseHandler);
  setTimeout(function () {
    res.status(200).json({ temp: resData }).end(); // Responding is important
  }, millisecondsToWait);
});

app.listen(2000);
