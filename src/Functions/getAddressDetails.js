import https from 'https';

export default async function getAddressDetails(postCodeString, latlong) {
  const endpoint = latlong
    ? `https://api.postcodes.io/postcodes/${postCodeString}`
    : `https://lookups.sls.comicrelief.com/postcode/lookup/${postCodeString}`;

  return new Promise((resolve, reject) => {
    https
      .get(endpoint, (response) => {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => {
          rawData += chunk;
        });
        response.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (error) {
            console.log(
              `Error from getAddressDetails(), isLatLong: ${latlong}, when trying to parse the raw data:`
            );
            reject(error);
          }
        });
      })
      .on('error', (error) => {
        console.log(
          `Error from getAddressDetails(), isLatLong: ${latlong}, when trying to call endpoint:`
        );
        reject(error);
      });
  });
}
