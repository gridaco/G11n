import { currentTextEditValueAtom } from "../../states";

export const REALTIME_EDIT_WSS_HOST =
  "wss://0vmxo5qnya.execute-api.us-west-1.amazonaws.com/dev";

type OnLayerSelectListener = (data: {
  layer: string;
  text?: string;
  locale?: string;
}) => void;
export class RealtimeEditEditorClient {
  ws: WebSocket;
  constructor(readonly appId: string) {
    console.log("preparing editor wsclient with appid", appId);
    this.ws = new WebSocket(REALTIME_EDIT_WSS_HOST);
    this.ws.onmessage = this.handleMessages;
  }

  _onLayerSelectListeners: Array<OnLayerSelectListener> = [];
  addOnLayerSelectListener(callback: OnLayerSelectListener) {
    this._onLayerSelectListeners.push(callback);
  }

  private handleMessages(message: MessageEvent) {
    const payload = message.data;
    let event: {
      action: string;
      appId: string;
      data?: any;
    } = typeof payload == "object" ? payload : JSON.parse(payload);

    console.log("event reviced from editor", event);
    if (event.action?.includes("to-editor")) {
      switch (event.action) {
        case "to-editor/layer":
          const data: {
            layer: string;
            text?: string;
            locale?: string;
          } = event.data;

          // data.text
          console.log("data received", data);

          // call all callbacks
          this._onLayerSelectListeners.map((cb) => cb?.(data));
          break;

        default:
          break;
      }
    } else {
      // ignore. the message is for running application. not this editor.
    }
  }

  updateLayer(
    layer: string,
    data: {
      text?: string;
      locale: string;
    }
  ) {
    this._send({
      action: "to-app/layer-update",
      appId: this.appId,
      data: {
        layer,
        ...data,
      },
    });
  }

  pauseApp() {
    this._send({
      action: "to-app/control",
      appId: this.appId,
      command: "pause",
    });
  }

  resumeApp() {
    this._send({
      action: "to-app/control",
      command: "resume",
    });
  }

  private _send(data: object) {
    this.ws.send(JSON.stringify(data));
  }
}
