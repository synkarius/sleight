export class ContextType {
    static readonly EXECUTABLE_NAME = "Executable Name";
    static readonly WINDOW_TITLE = "Window Title";
    static readonly values = () => [ContextType.EXECUTABLE_NAME, ContextType.WINDOW_TITLE];
};