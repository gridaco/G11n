using System;
public interface IG11nRuntimeSelectableLayer
{
    string GetId();
    string GetContent();
    void SetContent(string content);
    void SetSelect();
    void Deselect();
}
