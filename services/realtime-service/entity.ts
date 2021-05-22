import * as dynamoose from "dynamoose";
import { nanoid } from "nanoid";

export type WSEvents =
  | EV_ToApp_Control
  | EV_ToEditor_Layer
  | EV_ToApp_LayerUpdate;
export interface EV_ToApp_Control {
  action: "to-app/control";
  command: "resume" | "pause";
}

export interface EV_ToEditor_Layer {
  action: "to-editor/layer";
  data: {
    layer: string;
    text?: string;
    locale?: string;
  };
}

export interface EV_ToApp_LayerUpdate {
  action: "to-app/layer-update";
  data: {
    layer: string;
    text: string;
    local: string;
  };
}

export interface EditingSession {
  id: string;
  appId: string;
  connections: string[];
  targetLayer: string;
}

export const EditingSessionSchema = new dynamoose.Schema({
  id: {
    type: String,
    required: true,
    hashKey: true,
    default: () => nanoid(),
  },
  /**
   * unique per session. (for now.) will not be unique when session is managed per user.
   */
  appId: {
    type: String,
    required: true,
  },
  connections: {
    type: [String],
    required: true,
  },
  targetLayer: {
    type: String,
    required: false,
  },
});

const SESSION_TABLE_NAME = process.env.DYNAMODB_SESSION_TABLE;
export const EditingSessionModel = dynamoose.model(
  SESSION_TABLE_NAME,
  EditingSessionSchema,
  {
    create: false,
  }
);
