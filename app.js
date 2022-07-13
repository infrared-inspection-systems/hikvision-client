const express = require('express');
const app = express();
const { proxy, scriptUrl } = require('rtsp-relay')(app);
var bodyParser = require('body-parser');
const httpClient = require('urllib');
var parseString = require('xml2js').parseString;

const handler = proxy({
  url: `rtsp://admin:password123@192.168.0.127:554/Streaming/Channels/202`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
  additionalFlags: ['-q', '1'],
});

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

app.get('/regions', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('camera id: ' + req.query.id);
  console.log('camera id: ' + req.body);
  console.log('preset id: ' + req.query.preset);
  onsole.log('channel id: ' + req.query.channelId);
  var resData = [];
  const url = `http://${req.query.address}/ISAPI/Thermal/channels/${req.query.channelId}/thermometry/${req.query.preset}`;
  const options = {
    method: 'GET',
    rejectUnauthorized: false,
    digestAuth: 'admin:password123',
    dataType: 'text',
    headers: {},
  };
  const responseHandler = (err, data, res) => {
    if (err) {
      console.log(err);
    }
    parseString(data, function (err, result) {
      console.dir(
        result.ThermometryScene.ThermometryRegionList[0].ThermometryRegion
      );
      var regions =
        result.ThermometryScene.ThermometryRegionList[0].ThermometryRegion;
      regions.map(function (region) {
        if (region.enabled[0] === 'true') {
          var regionData = {
            name: region.name[0],
            id: region.id[0],
          };
          resData.push(regionData);
        }
      });
    });
  };
  var millisecondsToWait = 100;
  httpClient.request(url, options, responseHandler);
  setTimeout(function () {
    res.status(200).json(resData).end();
  }, millisecondsToWait);
});

app.get('/presets', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('channel id: ' + req.channelId);
  var resData;
  const url = `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.channleId}/patrols`;
  const options = {
    method: 'GET',
    rejectUnauthorized: false,
    digestAuth: 'admin:password123',
    dataType: 'text',
    headers: {},
  };
  const responseHandler = (err, data, res) => {
    if (err) {
      console.log(err);
    }
    parseString(data, function (err, result) {
      var presets = [];
      var patrols = result.PTZPatrolList;
      patrols.map(function (patrol) {
        if (patrol.enabled[0] === 'true') {
          patrol.PatrolSequenceList.map(function (sequence) {
            if (sequence.id[0] != 0) {
              presets.push(sequence.id[0]);
            }
          });
          resData = presets;
        }
      });
    });
  };
  var millisecondsToWait = 100;
  httpClient.request(url, options, responseHandler);
  setTimeout(function () {
    res.status(200).json(resData).end();
  }, millisecondsToWait);
});

app.get('/temperatures', (req, res) => {
  console.log('camera ip: ' + req.query.address);
  console.log('camera channel id: ' + req.query.channelId);
  console.log('camera preset id: ' + req.query.presetId);

  //Get Presets

  //Data
  let regionsData = [];
  const tempData = [];
  // Get Regions List
  const url = `http://${req.query.address}/ISAPI/Thermal/channels/${req.query.channelId}/thermometry/${req.query.presetId}`;
  const options = {
    method: 'GET',
    rejectUnauthorized: false,
    digestAuth: 'admin:password123',
    dataType: 'text',
    headers: {},
  };
  const responseHandler = (err, data, res) => {
    if (err) {
      console.log(err);
    }
    parseString(data, function (err, result) {
      var regions =
        result.ThermometryScene.ThermometryRegionList[0].ThermometryRegion;
      regions.map(function (region) {
        if (region.enabled[0] === 'true') {
          var regionData = {
            name: region.name[0],
            id: region.id[0],
          };
          regionsData.push(regionData);
        }
      });
    });
  };
  httpClient.request(url, options, responseHandler);

  //navigate to preset
  // httpClient.request(
  //   `http://${req.query.address}/ISAPI/Thermal/channels/${req.query.channleId}/presets/${req.query.presetId}/goto`,
  //   {
  //     method: 'PUT',
  //     rejectUnauthorized: false,
  //     digestAuth: 'admin:password123',
  //     content: {},
  //     dataType: 'json',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   },
  //   function (err, data, res) {
  //     if (err) {
  //     }
  //   }
  // );
  setTimeout(function () {
    regionsData.forEach((region) => {
      //get temp data for each region
      setTimeout(function () {
        httpClient.request(
          `http://${req.query.address}/ISAPI/Thermal/channels/${req.query.channelId}/thermometry/${req.query.presetId}/rulesTemperatureInfo/${region.id}?format=json`,
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
            var obj = {};

            obj[`${region.name}`] = {
              id: region.id,
              temp: data.ThermometryRulesTemperatureInfo.averageTemperature,
              time: new Date(),
            };
            tempData.push(obj);
            tempData.sort(function (a, b) {
              return parseFloat(a.id) - parseFloat(b.id);
            });
          }
        );
      }, 500);
    });
  }, 500);

  setTimeout(function () {
    console.log(tempData);
    res.status(200).json(tempData).end();
  }, 2000);
});

app.listen(2000);
