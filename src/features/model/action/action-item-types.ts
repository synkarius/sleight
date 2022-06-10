export class ActionItemType {
    static readonly PAUSE = "Pause";
    static readonly SEND_KEY = "Send Key";
    static readonly SEND_TEXT = "Send Text";
    static readonly MOUSE_CLICK = "Mouse Click";
    static readonly BRING_APP = "Bring App";
    static readonly WAIT_FOR_WINDOW = "Wait for Window";
    static readonly CALL_FUNCTION = "Call Function";
    static readonly MIMIC = "Mimic";
    static readonly values = () => [
        ActionItemType.PAUSE, 
        ActionItemType.SEND_KEY, 
        ActionItemType.SEND_TEXT, 
        ActionItemType.MOUSE_CLICK, 
        ActionItemType.BRING_APP, 
        ActionItemType.WAIT_FOR_WINDOW, 
        ActionItemType.CALL_FUNCTION, 
        ActionItemType.MIMIC
    ];
};