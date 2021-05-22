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
  return {
    statusCode: 200,
  };
};

export const disconnectHandler = async (...props) => {
  console.log("disconnect", props);
  return {
    statusCode: 200,
  };
};

export const defaultHandler = async (event, context) => {
  console.log("event", event);
  const domain = event.requestContext.domainName;
  // const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const callbackUrlForAWS = `https://${domain}`;
  await sendMessageToClient(callbackUrlForAWS, connectionId, event);

  return {
    statusCode: 200,
  };
};
