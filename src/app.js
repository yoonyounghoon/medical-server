const express = require('express');
const app = express();
const request = require('request-promise-native');
const convert = require('xml-js');

// env 파일 사용 설정
require('dotenv').config();

app.get('/hospital/:siDoCd/:siGunGuCd', async (req, res) => {
  let siDoCd = req.params.siDoCd;
  let siGunGuCd = req.params.siGunGuCd;
  let url = `http://apis.data.go.kr/openapi/service/rest/HmcSearchService/getRegnHmcList?serviceKey=${process.env.API_KEY}&siDoCd=${siDoCd}&siGunGuCd=${siGunGuCd}`;
  try {
    let response = await request(url);

    response = convert.xml2js(response, {
      compact: true,
      spaces: 4,
      ignoreDoctype: true,
    });
    res.json(response.response.body.items);
  } catch (e) {
    console.log(e);
    res.send('error!');
  }
});

app.get('/pharmacy/:yPos/:xPos', async (req, res) => {
  let xPos = req.params.xPos;
  let yPos = req.params.yPos;
  let url = `http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyLcinfoInqire?serviceKey=${process.env.API_KEY}&WGS84_LON=${yPos}&WGS84_LAT=${xPos}`;
  try {
    let response = await request(url);

    response = convert.xml2js(response, {
      compact: true,
      spaces: 4,
      ignoreDoctype: true,
    });
    res.json(response.response.body.items);
  } catch (e) {
    console.log(e);
    res.send('error!');
  }
});

module.exports = app;
