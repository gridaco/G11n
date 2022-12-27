using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//using HybridWebSocket;
using NativeWebSocket;

using System.Text;
using System;

public class G11nRemoteEditorSyncManager : MonoBehaviour
{
    [SerializeField]
    public string AppId;

    #region instance
    private static G11nRemoteEditorSyncManager _instance;

    public static G11nRemoteEditorSyncManager Instance { get { return _instance; } }

    private void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(this.gameObject);
        }
        else
        {
            _instance = this;
        }
    }
    #endregion instance


    [Serializable]
    class EventBase
    {
        [SerializeField] public string action;
        [SerializeField] public string appId;
    }

    [Serializable]
    class EV_ToApp_Control : EventBase
    {
        [SerializeField] public string command;
    }

    [Serializable]
    class EV_ToApp_LayerUpdate : EventBase
    {
        [SerializeField] public UpdateLayerData data;
    }

    [Serializable]
    class UpdateLayerData
    {
        [SerializeField] public string layer;
        [SerializeField] public string text;
        [SerializeField] public string locale;
    }


    private enum SslProtocolsHack
    {
        Tls = 192,
        Tls11 = 768,
        Tls12 = 3072
    }


    WebSocket ws = WebSocketFactory.CreateInstance("wss://0vmxo5qnya.execute-api.us-west-1.amazonaws.com/dev");

    private void Start()
    {
        // Add OnOpen event listener
        ws.OnOpen += () =>
        {
            Debug.Log("WS connected!");

            // Join the room
            JoinSession();
        };

        
        // Add OnMessage event listener
        ws.OnMessage += (byte[] msg) =>
        {
            var payload = Encoding.UTF8.GetString(msg);
            Debug.Log("WS received message: " + payload);

            var json = JsonUtility.FromJson<EventBase>(payload);
            Debug.Log(json);

            if (json?.action?.Contains("to-app") ?? false)
            {

                switch (json.action)
                {
                    case "to-app/layer-update":
                        var lu_ev = JsonUtility.FromJson<EV_ToApp_LayerUpdate>(payload);
                        G11nRuntimeSelectedLayerManager.Instance.UpdateSelectedLayerContent(lu_ev.data.text);
                        break;
                    case "to-app/control":
                        var c_ev = JsonUtility.FromJson<EV_ToApp_Control>(payload);
                        switch (c_ev.command)
                        {
                            case "resume":
                                this.OnResumeCommand();
                                break;
                            case "pause":
                                this.OnPauseCommand();
                                break;
                        }
                        break;
                }

            }
            else
            {
                // ignore. this is not for app.
            }


        };

        // Add OnError event listener
        ws.OnError += (string errMsg) =>
        {
            Debug.Log("WS error: " + errMsg);
        };

        // Add OnClose event listener
        ws.OnClose += (WebSocketCloseCode code) =>
        {
            Debug.Log("WS closed with code: " + code.ToString());
            //var sslProtocolHack = (System.Security.Authentication.SslProtocols)(SslProtocolsHack.Tls12 | SslProtocolsHack.Tls11 | SslProtocolsHack.Tls);
            //TlsHandshakeFailure
            //if (code == WebSocketCloseCode.TlsHandshakeFailure && ws.SslConfiguration.EnabledSslProtocols != sslProtocolHack)
            //{
            //    ws.SslConfiguration.EnabledSslProtocols = sslProtocolHack;
            //    ws.Connect();
            //}
        };

        // Connect to the server
        ws.Connect();

    }

    private void OnPauseCommand()
    {
        GameControllerInjection.Instance.RPC_Pause();
    }

    private void OnResumeCommand()
    {
        GameControllerInjection.Instance.RPC_Resume();
    }

    private void OnLayerUpdateCommand (){
        //G11nRuntimeSelectedLayerManager.Instance.UpdateSelectedLayerContent()
    }

    private void JoinSession()
    {
        _Send("{\"action\": \"join-session\", \"appId\": \"games-endless-runner\"}");
    }



    [Serializable]
    class LayerSelectEvent
    {
        [SerializeField] public string action;
        [SerializeField] public string appId;
        [SerializeField] public LayerSelectEventData data;
    }

    [Serializable]
    class LayerSelectEventData
    {
        [SerializeField] public string layer;
        [SerializeField] public string text;
    }


    public void OnLayerSelect(string layer, string text, string? locale)
    {
        var Data = new
        LayerSelectEvent {
            action = "to-editor/layer",
            appId = AppId,
            data = new LayerSelectEventData {
                layer = layer,
                text = text
            }
        };
        var content = JsonUtility.ToJson(Data);
        //Debug.Log("send on layer select event." + Data.layer + "  " + Data.text);
        //var content = $"{{\"layer\":\"{layer}\",\"text\":\"{text}\"}}";
        Debug.Log(Data);
        Debug.Log($"sending {content }");
        _Send(content);
    }

    private void _Send(string json)
    {
        //var payload = Encoding.UTF8.GetBytes(json);
        ws.SendText(json);
    }

    private void _Send(object data)
    {
        var json = JsonUtility.ToJson(data);
        this._Send(json);
    }



    private void Update()
    {
        #if !UNITY_WEBGL || UNITY_EDITOR
                ws.DispatchMessageQueue();
        #endif
    }
}
