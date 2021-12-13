exports.main = async function(event, context) {
  // This function will fetch the data from the DynamoDB tables and export the data in the 
  // appropriate format (JSON, YAML) for a consumer to use.
  const body = "Hello world"
  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body)
  }
}
