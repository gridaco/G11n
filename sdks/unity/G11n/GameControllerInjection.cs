using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameControllerInjection : MonoBehaviour
{

    #region instance
    private static GameControllerInjection _instance;

    public static GameControllerInjection Instance { get { return _instance; } }

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


    float lastTimeScale;
    float lastGlobalVolume;
    bool rpcPased = false;

    private void Start()
    {
        lastTimeScale = Time.timeScale;
        lastGlobalVolume = AudioListener.volume;
    }

    public void RPC_Pause()
    {
        rpcPased = true;
        lastTimeScale = Time.timeScale;
        lastGlobalVolume = AudioListener.volume;
        Time.timeScale = 0;
        AudioListener.volume = 0;
    }

    public void RPC_Resume()
    {
        if (!rpcPased)
        {
            return;
        }
        Time.timeScale = lastTimeScale;
        AudioListener.volume = lastGlobalVolume;
        rpcPased = false;
    }

    public void RPC_ReloadScene()
    {
        // not implemented
    }

    public void RPC_RestartGame()
    {
        // not implemented
    }
}
