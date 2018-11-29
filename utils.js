const https = require('https');

const request = (requestUrl) => {
  return new Promise((resolve, reject) => {
    let chunk = '';
    https.get(requestUrl, (res) => {
      // console.log('statusCode:', res.statusCode);
      // console.log('headers:', res.headers);

      res.on('data', (d) => {
        chunk += d;
      });

      res.on('end', () => {
        // console.log('chunk in https request is', chunk);
        resolve(JSON.parse(chunk));
      })

    }).on('error', (e) => {
      console.error(e);
      reject(e);
    });
  })
}

exports.request = request;