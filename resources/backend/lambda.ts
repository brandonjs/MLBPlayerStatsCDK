exports.main = async function(event, context) {
  // this function will fetch data from the 3 provided sources and update the DynamoDB table(s) accordingly
  const body = "Hello world"
  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body)
  }
}
