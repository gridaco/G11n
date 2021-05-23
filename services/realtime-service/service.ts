import * as dynamoose from "dynamoose";
import { EditingSession, EditingSessionModel } from "./entity";
import AWS from "aws-sdk";
import {
  WSEvents,
  EV_ToApp_Control,
  EV_ToApp_LayerUpdate,
  EV_ToEditor_Layer,
} from "./entity";
import { nanoid } from "nanoid";

/**
 * join or create & join session
 */
export async function joinSession(params: {
  connectionId: string;
  appId: string;
}) {
  // check for existing session.
  // appid = room for now.
  //   const maybeExistingAppSession = await EditingSessionModel.get({
  //     appId: params.appId,
  //   });

  console.log("connectionId", params.connectionId);
  const existsCheckCondition = new dynamoose.Condition()
    .where("appId")
    .eq(params.appId);
  const scaned = await EditingSessionModel.scan(existsCheckCondition).exec();
  console.log(scaned);
  const maybeExistingAppSession = scaned?.[0];

  if (maybeExistingAppSession) {
    console.log(
      "join session: joining session existing",
      maybeExistingAppSession
    );
    // existing
    const id = maybeExistingAppSession.id;
    await EditingSessionModel.update(
      { id: id },
      {
        // dirty data. needs cleanup after connection is dead.
        connections: [
          ...new Set([
            ...maybeExistingAppSession.connections,
            params.connectionId,
          ]),
        ],
      }
    );
  } else {
    // create new
    console.log("join session: creating new session and join");
    const input = new EditingSessionModel(<EditingSession>{
      id: nanoid(),
      connections: [params.connectionId],
      appId: params.appId,
    });
    await input.save();
  }
}

///
/// region remote app control
///
export async function appControl_pause(appId: string) {
  const session = await EditingSessionModel.get({ appId: appId });
  if (session) {
    session.connections.map((con) => {
      // send message
      sendMessageToClient(con, {});
    });
  } else {
    // ignore. no available session
  }
}

export function appcontrolCommand(ev: EV_ToApp_Control) {
  switch (ev.command) {
    case "pause":
      break;
    case "resume":
      break;
  }
}

export async function braodcastToSessionWith(params: {
  appId: string;
  event: any;
}) {
  const session = await EditingSessionModel.get({ appId: params.appId });
  if (session) {
    session.connections.map((con) => {
      // send message
      sendMessageToClient(con, params.event);
    });
  } else {
    // ignore. no available session
  }
}

///
/// endregion remote app control
///

export const sendMessageToClient = (connectionId: string, payload: any) =>
  new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: ENDPOINT,
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

let ENDPOINT;
export function setEndpoint(endpoint: string) {
  ENDPOINT = endpoint;
}
