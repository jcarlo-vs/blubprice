/* Example in Node.js */
const axios = require("axios");

let response = null;
new Promise(async (resolve, reject) => {
  try {
    response = await axios.get(
      "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=24478,29150,29743",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c",
        },
      }
    );
  } catch (ex) {
    response = null;
    // error
    console.log(ex);
    reject(ex);
  }
  if (response) {
    // success
    const json = response.data;
    console.log(json);
    resolve(json);
  }
});

// Preferred method: Via a custom header named X-CMC_PRO_API_KEY
// Convenience method: Via a query string parameter named CMC_PRO_API_KEY

// /v1/cryptocurrency/quotes/latest
// symbol=BTC,ETH

// c2350fbf-33a3-4b7f-b496-ce331bf5494e

fetch(
  "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=24478,29150,29743",
  {
    headers: {
      "X-CMC_PRO_API_KEY": "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c",
    },
  }
);
