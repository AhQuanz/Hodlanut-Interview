import express, { response } from "express";
import fetch from 'node-fetch';

const app = express()
const port = 3000

const userBalances = {
  "user-1": {
    "BTC": "0.5",
    "ETH": "2"
  },
  "user-2": {
    "BTC": "0.1",
  },
  "user-3": {
    "ETH": "5",
  },
};

app.get('/:userId', async (req, res) => {
  // Retrieve the user in question 
  const user = userBalances["user-" + req.params.userId]
  let assets = []
  
  // Retrieve all assets the user holds
  for ( let key in user) {
    assets.push(key);
  }

  let requests = assets.map(asset => {
    const api_link = 'https://www.bitstamp.net/api/v2/ticker/' + asset.toLowerCase() + "usdt";
    return fetch(api_link)
  })

  let balance = 0;
  const allPromises = Promise.all(requests);
  try {
      const preFormattedResults = await allPromises;
      const formattedResults = preFormattedResults
                                  .map(r => {
                                    // In any case fetch fails 
                                    if(!r.ok) {
                                      throw Error("API ERROR");
                                    }
                                    return r.json();
                                });
      let i = 0;
      //Consume the promises
      for await(let result of formattedResults) {
          const asset = assets[i];
          const numOfAsset = user[asset];
          const price = parseFloat(result["ask"])
          balance += numOfAsset * price;
      }
      const result = {}
      // Format result to be send back
      result[req.params.userId] = balance;
      res.send(result);
  } catch (error) {
     console.log(error)
     res.send(error["message"]);
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});