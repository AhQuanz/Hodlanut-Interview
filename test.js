import chai from "chai";
import request from 'request';
import fetch from 'node-fetch';

const { expect } = chai;

describe("Test", () => {
  it("Request for invalid user balance", async () => {
    let id = 9999;
    request('http://localhost:3000/' + id , function(error, response, body) {
        expect(body).to.equal('{"' + id + '":0}');
    });
  });
  it("Request for valid user balance", async () => {
    let id = 3;
    const api_link = 'https://www.bitstamp.net/api/v2/ticker/ethusdt';
    const result = await fetch(api_link)
    const price = await result.json().then(data => {return parseFloat(data["ask"])});
    const balance = price * 5;
    request('http://localhost:3000/' + id , function(error, response, body) {
        expect(body).to.equal(`{"${id}":${balance}}`);
    });
  });
});