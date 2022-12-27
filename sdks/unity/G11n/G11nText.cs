using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using UnityEngine.UI;


[RequireComponent(typeof(Text))]
[RequireComponent(typeof(UnityEvent))]
public class G11nText : MonoBehaviour, IPointerClickHandler, IG11nRuntimeSelectableLayer
{
    const bool DEVMODE = true;
    Text text;
    UnityEvent eventHost;
    Button clickEventHost;
    Outline outline;

    bool layerSelected = false;


    G11nRuntimeSelectedLayerManager layerMananer {
        get {
            return G11nRuntimeSelectedLayerManager.Instance;
        } }


    private void Awake()
    {
        // init text
        this.text = GetComponent<Text>();

        // load button if only already existing
        if (TryGetComponent(out Button button))
        {
            this.clickEventHost = button;
        }


        // load outline if only already existing.
        if (TryGetComponent(out Outline outline))
        {
            this.outline = outline;
        }

    }


    // Start is called before the first frame update
    void Start()
    {

        // last call
        if (DEVMODE)
        {
            EnableDevMode();
        }
    }



    private void EnableDevMode()
    {
        if (!DEVMODE)
        {
            return;
        }

        //this.text.on


        // create button for input handling if non exists.
        try
        {

            if (!GetComponent<Button>())
            {
                this.clickEventHost = this.gameObject.AddComponent<Button>();
                clickEventHost.targetGraphic = this.text;
            }
            //
            this.clickEventHost.onClick.AddListener(DevHandleOnClick);
        }
        catch (Exception e)
        {

        }
        //

        // create outline for selection indication if non exists.
        if (!outline)
        {
            outline = this.gameObject.AddComponent<Outline>();
            outline.effectColor = Color.red;
            outline.effectDistance = new Vector2(2, 2);
            outline.enabled = false;
        }
    }


    private void ShowOutline()
    {
        GetComponent<Outline>().enabled = true;
    }

    private void HideOutline()
    {
        try
        {

            if (!gameObject == null)
            {
                GetComponent<Outline>().enabled = false;
            }
        }
        catch (Exception e)
        {

        }
    }


    private void DisableDevMode()
    {
        this.clickEventHost.onClick.RemoveListener(DevHandleOnClick);
        // todo remove button component also, if dynamically created.
    }


    // IPointerClickHandler
    public void OnPointerClick(PointerEventData eventData)
    {
        //throw new System.NotImplementedException();
    }

    private void DevHandleOnClick()
    {
        if (layerSelected)
        {
            this.Deselect();
        }
        else
        {
            this.SetSelect();
        }
    }

    public void SetSelect()
    {
        layerSelected = true;
        ShowOutline();
        layerMananer.selectedLayer = this;
    }

    public void Deselect()
    {
        layerSelected = false;
        HideOutline();
    }

    public string GetId()
    {
        return this.gameObject.GetInstanceID().ToString();
    }

    public string GetContent()
    {
        return text.text;
    }

    public void SetContent(string content)
    {
        this.text.text = content;
    }
}
