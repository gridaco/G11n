using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using UnityEngine.UI;


public class G11nRuntimeSelectedLayerManager : MonoBehaviour
{
    private static G11nRuntimeSelectedLayerManager _instance;

    public static G11nRuntimeSelectedLayerManager Instance { get { return _instance; } }

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

    private IG11nRuntimeSelectableLayer _selectedLayer;
    public IG11nRuntimeSelectableLayer selectedLayer {
        get
        {
            return _selectedLayer;
        }
        set {
            G11nRemoteEditorSyncManager.Instance.OnLayerSelect(value.GetId(), value.GetContent(), null);
            _selectedLayer?.Deselect();
            _selectedLayer = value;
        }

    }

    public  void UpdateSelectedLayerContent(string content)
    {
        _selectedLayer.SetContent(content);
    }

    private void Start()
    {
        
    }

}

