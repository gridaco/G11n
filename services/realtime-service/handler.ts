import {
  braodcastToSessionWith,
  joinSession,
  sendMessageToClient,
  setEndpoint,
} from "service";

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
  const stage =
    event.requestContext.stage == "local" ? "dev" : event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const endpoint = `${"0vmxo5qnya"}.execute-api.${
    process.env.AWS_REGION
  }.amazonaws.com/${stage}`;
  setEndpoint(endpoint);

  const jsonBody: {
    action: string;
    appId: string;
    data?: any;
  } = JSON.parse(event.body);

  switch (jsonBody.action) {
    case "join-session":
      await joinSession({
        connectionId,
        appId: jsonBody.appId,
      });
      break;
    case "to-app/control":
      await braodcastToSessionWith({
        appId: jsonBody.appId,
        event: jsonBody.data,
      });
      break;
    case "to-editor/layer":
      break;
    case "to-app/layer-update":
      break;
    default:
      await sendMessageToClient(connectionId, event);
      break;
  }

  return {
    statusCode: 200,
  };
};
