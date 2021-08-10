const express = require('express');
const app = express();
const request = require('request-promise-native');
const convert = require('xml-js');

// env 파일 사용 설정
require('dotenv').config();

// xml-js ._text 속성 삭제하기 위한 메서드
function RemoveJsonTextAttribute(value, parentElement) {
  try {
    var keyNo = Object.keys(parentElement._parent).length;
    var keyName = Object.keys(parentElement._parent)[keyNo - 1];
    parentElement._parent[keyName] = value;
  } catch (e) {}
}

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
      textFn: RemoveJsonTextAttribute,
    });
    res.json(response.response.body.items.item);
  } catch (e) {
    console.log(e);
    res.send('error!');
  }
});

app.get('/pharmacy/:id', async (req, res) => {
  let id = req.params.id;
  let url = `http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyBassInfoInqire?serviceKey=OW%2B7pApxaWyA%2FMtp4h809DV8bN%2FTeDY%2B6RVsTr5ZsS4Peuz2gAmUOTBpsqyZc0ITRd%2FIyE5qor%2B2cCxo42moPQ%3D%3D&HPID=${id}&pageNo=1&numOfRows=10`;
  try {
    let response = await request(url);

    response = convert.xml2js(response, {
      compact: true,
      spaces: 4,
      ignoreDoctype: true,
      textFn: RemoveJsonTextAttribute,
    });
    res.json(response.response.body.items.item);
  } catch (e) {
    console.log(e);
    res.send('error!');
  }
});

module.exports = app;
