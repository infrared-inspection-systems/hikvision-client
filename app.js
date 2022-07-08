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
  httpClient.request(
    `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.id}/momentary`,
    {
      method: 'PUT',
      rejectUnauthorized: false,
      digestAuth: 'admin:password123',
      content:
        '<?xml version: "1.0" encoding="UTF-8"?>\r\n<PTZData>\r\n    <pan>60</pan>\r\n    <tilt>0</tilt>\r\n    <Momentary>\r\n        <duration>500</duration>\r\n    </Momentary>\r\n</PTZData>',
      headers: {
        'Content-Type': 'application/xml',
      },
    },
    function (err, data, res) {
      if (err) {
        console.log(err);
      }
      console.log(res.statusCode);
      console.log(res.headers);
      console.log(data.toString('utf8'));
      data = data;
    }
  );
  res.status(200).end(data); // Responding is important
});

app.get('/ptz/right', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('camera id: ' + req.query.id);
  console.log('camera id: ' + req.body);
  var data;
  httpClient.request(
    `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.id}/momentary`,
    {
      method: 'PUT',
      rejectUnauthorized: false,
      digestAuth: 'admin:password123',
      content:
        '<?xml version: "1.0" encoding="UTF-8"?>\r\n<PTZData>\r\n    <pan>60</pan>\r\n    <tilt>0</tilt>\r\n    <Momentary>\r\n        <duration>500</duration>\r\n    </Momentary>\r\n</PTZData>',
      headers: {
        'Content-Type': 'application/xml',
      },
    },
    function (err, data, res) {
      if (err) {
        console.log(err);
      }
      console.log(res.statusCode);
      console.log(res.headers);
      console.log(data.toString('utf8'));
      data = data;
    }
  );
  res.status(200).end(data); // Responding is important
});

app.get('/ptz/up', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('camera id: ' + req.query.id);
  console.log('camera id: ' + req.body);
  var data;

  httpClient.request(
    `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.id}/momentary`,
    {
      method: 'PUT',
      rejectUnauthorized: false,
      digestAuth: 'admin:password123',
      content:
        '<?xml version: "1.0" encoding="UTF-8"?>\r\n<PTZData>\r\n    <pan>0</pan>\r\n    <tilt>60</tilt>\r\n    <Momentary>\r\n        <duration>500</duration>\r\n    </Momentary>\r\n</PTZData>',
      headers: {
        'Content-Type': 'application/xml',
      },
    },
    function (err, data, res) {
      if (err) {
        console.log(err);
      }
      console.log(res.statusCode);
      console.log(res.headers);
      console.log(data.toString('utf8'));
      data = data;
    }
  );
  res.status(200).end(data); // Responding is important
});

app.get('/ptz/down', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('camera id: ' + req.query.id);
  console.log('camera id: ' + req.body);
  var data;
  httpClient.request(
    `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.id}/momentary`,
    {
      method: 'PUT',
      rejectUnauthorized: false,
      digestAuth: 'admin:password123',
      content:
        '<?xml version: "1.0" encoding="UTF-8"?>\r\n<PTZData>\r\n    <pan>0</pan>\r\n    <tilt>-60</tilt>\r\n    <Momentary>\r\n        <duration>500</duration>\r\n    </Momentary>\r\n</PTZData>',
      headers: {
        'Content-Type': 'application/xml',
      },
    },
    function (err, data, res) {
      if (err) {
        console.log(err);
      }
      console.log(res.statusCode);
      console.log(res.headers);
      console.log(data.toString('utf8'));
      data = data;
    }
  );
  res.status(200).end(data); // Responding is important
});

app.get('/ptz/zoomin', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('camera id: ' + req.query.id);
  console.log('camera id: ' + req.body);
  var data;
  httpClient.request(
    `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.id}/momentary`,
    {
      method: 'PUT',
      rejectUnauthorized: false,
      digestAuth: 'admin:password123',
      content:
        '<?xml version: "1.0" encoding="UTF-8"?>\r\n<PTZData>\r\n    <zoom>-60</zoom>\r\n</PTZData>',
      headers: {
        'Content-Type': 'application/xml',
      },
    },
    function (err, data, res) {
      if (err) {
        console.log(err);
      }
      console.log(res.statusCode);
      console.log(res.headers);
      console.log(data.toString('utf8'));
      data = data;
    }
  );
  res.status(200).end(data); // Responding is important
});

app.get('/ptz/zoomout', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('camera id: ' + req.query.id);
  console.log('camera id: ' + req.body);
  var data;
  httpClient.request(
    `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.id}/momentary`,
    {
      method: 'PUT',
      rejectUnauthorized: false,
      // auth: "username:password" use it if you want simple auth
      digestAuth: 'admin:password123',
      content:
        '<?xml version: "1.0" encoding="UTF-8"?>\r\n<PTZData>\r\n    <zoom>-60</zoom>\r\n    <Momentary>\r\n        <duration>500</duration>\r\n    </Momentary>\r\n</PTZData>',
      headers: {
        'Content-Type': 'application/xml',
        //'Content-Type': 'application/json' use it if payload is json
        //'Content-Type': 'application/text'
      },
    },
    function (err, data, res) {
      if (err) {
        console.log(err);
      }
      console.log(res.statusCode);
      console.log(res.headers);
      console.log(data.toString('utf8'));
      data = data;
    }
  );
  res.status(200).end(data); // Responding is important
});

app.get('/ptz/reset', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('camera id: ' + req.query.id);
  console.log('camera id: ' + req.body);
  var data;
  httpClient.request(
    `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.id}/momentary`,
    {
      method: 'PUT',
      rejectUnauthorized: false,
      digestAuth: 'admin:password123',
      content:
        '<?xml version: "1.0" encoding="UTF-8"?>\r\n<PTZData>\r\n    <pan>0</pan>\r\n    <tilt>0</tilt>\r\n    <Momentary>\r\n        <duration>500</duration>\r\n    </Momentary>\r\n</PTZData>',
      headers: {
        'Content-Type': 'application/xml',
      },
    },
    function (err, data, res) {
      if (err) {
        console.log(err);
      }
      console.log(res.statusCode);
      console.log(res.headers);
      console.log(data.toString('utf8'));
      data = data;
    }
  );
  res.status(200).end(data);
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

app.get('/temperatures', (req, res) => {
  console.log('camera ip: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('camera channel id: ' + req.query.channleId);

  //Data
  const presetData = [];
  const regionsData = [];
  const tempData = [];

  //get ptz presets
  httpClient.request(
    `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.channleId}/presets`,
    {
      method: 'GET',
      rejectUnauthorized: false,
      digestAuth: 'admin:password123',
      dataType: 'json',
      headers: {},
    },
    function (err, data, res) {
      if (err) {
        console.log(err);
      }
      console.log(res.statusCode);
      console.log(res.headers);
      //save list of enabled presets
      presetData =
        data.ThermometryRulesTemperatureInfoList
          .ThermometryRulesTemperatureInfo[0].averageTemperature;
    }
  );

  presetData.forEach((preset) => {
    //get preset regions info
    httpClient.request(
      `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.channleId}/thermometry/${preset}`,
      {
        method: 'GET',
        rejectUnauthorized: false,
        digestAuth: 'admin:password123',
        dataType: 'json',
        headers: {},
      },
      function (err, data, res) {
        if (err) {
          console.log(err);
        }
        console.log(res.statusCode);
        console.log(res.headers);
        //save list of enabled region ID's + names
        regionsData =
          data.ThermometryRulesTemperatureInfoList
            .ThermometryRulesTemperatureInfo[0].averageTemperature;
      }
    );
    //navigate to preset
    httpClient.request(
      `http://${req.query.address}/ISAPI/Thermal/channels/${req.query.channleId}/presets/${preset}/goto`,
      {
        method: 'PUT',
        rejectUnauthorized: false,
        digestAuth: 'admin:password123',
        content: {},
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      function (err, data, res) {
        if (err) {
          console.log(err);
        }
        console.log(res.statusCode);
        console.log(res.headers);
      }
    );
    regionsData.forEach((region) => {
      //get temp data for each region
      httpClient.request(
        `http://${req.query.address}/ISAPI/Thermal/channels/${req.query.channleId}/thermometry/${preset}/rulesTemperatureInfo/${region}?format=json`,
        {
          method: 'GET',
          rejectUnauthorized: false,
          digestAuth: 'admin:password123',
          dataType: 'json',
          headers: {},
        },
        function (err, data, res) {
          if (err) {
            console.log(err);
          }
          console.log(res.statusCode);
          console.log(res.headers);
          var obj = {};
          obj[`Preset:${preset} - Region:${region}`] =
            data.ThermometryRulesTemperatureInfo.averageTemperature;
          tempData.push(obj);
        }
      );
    });
  });
  setTimeout(function () {
    res.status(200).json({ temps: tempData }).end(); // Responding is important
  }, 500);
});

app.listen(2000);
