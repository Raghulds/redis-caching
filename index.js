const redis = require('redis');
const express = require('express');
const { Client } = require("@googlemaps/google-maps-services-js");

const app = express();
const client = redis.createClient();
const subscriber = client.duplicate();
const GoogleMapsClient = new Client({});

(async function () {
  
})()

app.get('/locations', async (req, res) => {
  try {
    let dist = await GoogleMapsClient.distancematrix({
      params: {
        origins: [[11.874416, 76.144316]], // [lat, long]
        destinations: [[11.874417, 76.144316], [12.874416, 76.14431], [18.874416, 76.14431]],
        key: 'AIzaSyCwh295PWZUnXPrmOGMOZmy01xny_TWvYM',
      },
    });
  
    console.log(dist.data.rows[0].elements);
    res.status(200).send(dist.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
});

app.post('/loc', async (req, res) => {
  await subscriber.connect();
  subscriber.on('error', (err) => console.log('Redis Client Error', err));
  console.log(await subscriber.keys('*'));
  await subscriber.set('1a', JSON.stringify({ riderId: [Math.random(), Math.random()] }));
  await subscriber.set('2a', JSON.stringify({ riderId: [Math.random(), Math.random()] }));
  await subscriber.set('3a', JSON.stringify({ riderId: [Math.random(), Math.random()] }));
  console.log(await subscriber.hGetAll('*'));
  res.status(200).send(await subscriber.get('1a'));
  // subscriber.disconnect();
});

app.get('/hash-of-riders', async (req, res) => {
  await subscriber.connect();
  subscriber.on('error', (err) => console.log('Redis Client Error', err));
  console.log(await subscriber.keys('*'));
  subscriber.multi().keys('*', function (err, keys) {
    if (err) return console.log(err);
    if (keys) {
      console.log(keys);
    }
    console.log(keys);
  });
});

app.post('/set-hash', async (req, res) => {
  await subscriber.connect();
  subscriber.on('error', (err) => console.log('Redis Client Error', err));
  for (let i = 0; i < 800; i++) {
    await subscriber.hSet('riders', 'riderId' + i, JSON.stringify([Math.random(), Math.random()]));
  }
  const ridersHash = await subscriber.hGetAll('riders');
  await subscriber.disconnect();
  res.status(200).send(ridersHash);
});

app.listen(3000, () => {
  console.log("LISTENING.... ")
});

module.exports = app;