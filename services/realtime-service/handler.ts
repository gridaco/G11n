import AWS from "aws-sdk";

const sendMessageToClient = (url, connectionId, payload) =>
  new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: url,
    });
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId, // connectionId of the receiving ws-client
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          console.log("err is", err);
          reject(err);
        }
        resolve(data);
      }
    );
  });

export const connectHandler = async (...props) => {
  console.log("connect", props);
};

export const disconnectHandler = async (...props) => {
  console.log("disconnect", props);
};

export const defaultHandler = async (event, context) => {
  console.log("event", event);
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const callbackUrlForAWS = "https://example.com";
  //   const callbackUrlForAWS = util.format(
  //     util.format("https://%s/%s", domain, stage)
  //   ); //construct the needed url
  await sendMessageToClient(callbackUrlForAWS, connectionId, event);

  return {
    statusCode: 200,
  };
};
