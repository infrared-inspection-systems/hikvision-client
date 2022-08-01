const express = require('express');
require('express-async-errors');
const app = express();
const { proxy, scriptUrl } = require('rtsp-relay')(app);
var bodyParser = require('body-parser');
const httpClient = require('urllib');
var parseString = require('xml2js').parseString;
const multer = require('multer');
const upload = multer();
const asyncHandler = require('express-async-handler');

const handler = proxy({
  url: `rtsp://admin:password123@192.168.0.127:554/Streaming/Channels/202`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
  additionalFlags: ['-q', '1'],
});
var router = express.Router();
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

app.post('/hook', upload.none(), async (req, res, next) => {
  var response;
  var detectionRegionEntry;
  if (req.body.TMA != null) {
    await parseString(req.body.TMA.toString(), (err, result) => {
      if (err) {
        throw err;
      }
      json = JSON.stringify(result, null, 2);
      response = result;
    });
    detectionRegionEntry = await response.EventNotificationAlert
      .DetectionRegionList[0].DetectionRegionEntry;

    detectionRegionEntry.forEach(async (region) => {
      console.log(region);
      await httpClient.request('http://localhost:8083/api/notifications', {
        method: 'POST',
        data: {
          channel: `${response.EventNotificationAlert.channelID[0]}`,
          ip: `${response.EventNotificationAlert.ipAddress[0]}`,
          region: `${region.regionID[0]}`,
          message: `${region.TMA[0].ruleType[0]} ${region.TMA[0].ruleTemperature[0]} ${region.TMA[0].thermometryUnit[0]} (CurrentTemp:${region.TMA[0].currTemperature[0]} ${region.TMA[0].thermometryUnit[0]})`,
          trigger: 'temperature_measurement_alert',
          label: 'temperature_measurement_alert',
          type: 'WARN',
        },
      });
    });
  } else if (req.body.linedetection != null) {
    await parseString(req.body.linedetection.toString(), (err, result) => {
      if (err) {
        throw err;
      }
      json = JSON.stringify(result, null, 2);
      response = result;
    });
    detectionRegionEntry = await response.EventNotificationAlert
      .DetectionRegionList[0].DetectionRegionEntry;

    detectionRegionEntry.forEach(async (region) => {
      console.log(region);
      await httpClient.request('http://localhost:8083/api/notifications', {
        method: 'POST',
        data: {
          channel: `${response.EventNotificationAlert.channelID[0]}`,
          ip: `${response.EventNotificationAlert.ipAddress[0]}`,
          region: `${region.regionID[0]}`,
          message: `Intrusion Alert (${response.EventNotificationAlert.ruleName[0]}) @ region: ${region.regionID[0]} - scene:${region.sceneID[0]}`,
          trigger: 'line_detection',
          label: 'intrusion',
          type: 'WARN',
        },
      });
    });
  }
});

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
        '<?xml version: "1.0" encoding="UTF-8"?>\r\n<PTZData>\r\n    <pan>-60</pan>\r\n    <tilt>0</tilt>\r\n    <Momentary>\r\n        <duration>750</duration>\r\n    </Momentary>\r\n</PTZData>',
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
  console.log('channel id: ' + req.query.channelId);
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
  const url = `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.channelId}/patrols`;
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
      console.log(result.PTZPatrolList.PTZPatrol[0]);
      var presets = [];
      var patrols = result.PTZPatrolList.PTZPatrol;
      patrols.map(function (patrol) {
        if (patrol.enabled[0] === 'true') {
          patrol.PatrolSequenceList[0].PatrolSequence.map(function (sequence) {
            console.log(sequence);
            if (sequence.presetID[0] != 0) {
              presets.push(sequence.presetID[0]);
            }
          });
          resData = presets;
        }
      });
    });
  };
  var millisecondsToWait = 1000;
  httpClient.request(url, options, responseHandler);
  setTimeout(function () {
    res.status(200).json(resData).end();
  }, millisecondsToWait);
});
app.get('/goto', (req, res) => {
  console.log('camera url: ' + req.query.address);
  console.log('camera name: ' + req.query.name);
  console.log('channel id: ' + req.query.channelId);
  console.log('preset id: ' + req.query.presetId);
  var resData;
  const url = `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.channelId}/presets/${req.query.presetId}/goto`;
  const options = {
    method: 'PUT',
    rejectUnauthorized: false,
    digestAuth: 'admin:password123',
    dataType: 'text',
    headers: {},
    content: '',
  };
  const responseHandler = (err, data, res) => {
    if (err) {
      console.log(err);
    }
    1;
    parseString(data, function (err, result) {
      console.log(result);
    });
  };
  var millisecondsToWait = 100;
  httpClient.request(url, options, responseHandler);
  setTimeout(function () {
    res.status(200).json(resData).end();
  }, millisecondsToWait);
});

app.get(
  '/temperatures',
  asyncHandler(async function (req, res) {
    console.log('camera ip: ' + req.query.address);
    console.log('camera channel id: ' + req.query.channelId);
    console.log('camera preset id: ' + req.query.presetId);

    //Get Presets

    //Data
    let regionsData = [];
    let tempData = [];
    let presetData = [];

    // Get Presets

    const presetUrl = `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.channelId}/patrols`;
    const presetOptions = {
      method: 'GET',
      rejectUnauthorized: false,
      digestAuth: 'admin:password123',
      dataType: 'text',
      headers: {},
    };
    const presetHandler = async function (err, data, res) {
      if (err) {
        console.log(err);
      }
      parseString(data, function (err, result) {
        console.log(result.PTZPatrolList.PTZPatrol[0]);
        var presets = [];
        var patrols = result.PTZPatrolList.PTZPatrol;
        patrols.map(function (patrol) {
          if (patrol.enabled[0] === 'true') {
            patrol.PatrolSequenceList[0].PatrolSequence.map(function (
              sequence
            ) {
              if (sequence.presetID[0] != 0) {
                console.log(sequence);
                presets.push(sequence.presetID[0]);
              }
            });
            presetData = presets;
          }
        });
      });
    };
    await httpClient.request(presetUrl, presetOptions, presetHandler);

    // Get Regions List
    presetData.forEach(async function (preset) {
      const url = `http://${req.query.address}/ISAPI/Thermal/channels/${req.query.channelId}/thermometry/${preset}`;
      const options = {
        method: 'GET',
        rejectUnauthorized: false,
        digestAuth: 'admin:password123',
        dataType: 'text',
        headers: {},
      };
      const responseHandler = async function (err, data, res) {
        if (err) {
          console.log(err);
        }
        console.log(res)
        await parseString(data, async function (err, result) {
          var regions =
            result.ThermometryScene.ThermometryRegionList[0].ThermometryRegion;
          regions.map(function (region) {
            if (region.enabled[0] === 'true') {
              var regionData = {
                name: region.name[0],
                id: region.id[0],
              };
              console.log(regionData);
              regionsData.push(regionData);
            }
          });
        });
        await httpClient.request(
          `http://${req.query.address}/ISAPI/PTZCtrl/channels/${req.query.channelId}/presets/${preset}/goto`,
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
          async function (err, data, res) {
            if (err) {
            }
            console.log('wemoved');
          }
        );

        regionsData.forEach(async function (region) {
          //get temp data for each region
          await httpClient.request(
            `http://${req.query.address}/ISAPI/Thermal/channels/${req.query.channelId}/thermometry/1/rulesTemperatureInfo/${region.id}?format=json`,
            {
              method: 'GET',
              rejectUnauthorized: false,
              digestAuth: 'admin:password123',
              dataType: 'json',
              headers: {},
            },
            async function (err, data, res) {
              if (err) {
                console.log(err);
              }
              var obj = {};

              obj[`${region.name}`] = {
                id: region.id,
                temp: data.ThermometryRulesTemperatureInfo.averageTemperature,
                time: new Date(),
              };
              console.log(obj);
              tempData.push(obj);
              tempData.sort(function (a, b) {
                return parseFloat(a.id) - parseFloat(b.id);
              });
            }
          );
        });
      };
      await httpClient.request(url, options, responseHandler);
      console.log(regionsData);
    });

    console.log(tempData);
    await res.status(200).json(tempData).end();
  })
);

app.listen(2000);
