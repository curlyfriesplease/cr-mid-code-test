import { LambdaWrapper, ResponseModel } from '@comicrelief/lambda-wrapper';
import CONFIGURATION from '../Config/Configuration';
import getAddressDetails from '../Functions/getAddressDetails';

export default LambdaWrapper(CONFIGURATION, async (di, request) => {
  // Note to self: getPathParameter is a method from RequestService within lambda-wrapper
  const postCodeString = request.getPathParameter('postCodeParamString', null);

  console.log(`lambda invoked for postcode ${postCodeString}`);
  const postCodePromises = [
    Promise.all([
      getAddressDetails(postCodeString, false),
      getAddressDetails(postCodeString, true),
    ]),
  ];
  const uncombinedData = await Promise.all(postCodePromises);

  const { addresses } = uncombinedData[0][0];
  const { latitude } = uncombinedData[0][1].result;
  const { longitude } = uncombinedData[0][1].result;

  const postcoderesponse = addresses.map((address) => ({
    ...address,
    latitude,
    longitude,
  }));

  return new ResponseModel(
    {
      displayResponse: { postcoderesponse },
    },
    200,
    'ok'
  ).generate();
});
