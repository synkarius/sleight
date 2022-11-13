export const dragonflyTemplateSupportFns = `
def convert_to_centiseconds(seconds):
    return abs(seconds * 100)

def convert_to_decimal_percentage(value):
    return value/100.0

def sign(v, nv):
    n = 1 if nv is None or nv == "+" else -1
    return v * n

def do_nothing():
    pass

def execute_pause(seconds):
    Pause().execute({"time": convert_to_centiseconds(seconds)})

def execute_key(key, mods, outer_pause, inner_pause=None, repeat=None, direction=None):
    """build arg from params"""
    arg = key
    if mods != "no-mods":
        arg = mods + "-" + arg
    if direction is None:
        arg = arg \\
        + "/" + str(convert_to_centiseconds(inner_pause)) \\
        + ":" + str(repeat) \\
        + "/" + str(convert_to_centiseconds(outer_pause))
    else:
        arg = arg \\
        + ":" + direction \\
        + "/" + str(convert_to_centiseconds(outer_pause))
    Key(arg).execute()

def execute_mouse_move_abs_px(x, y, nx=None, ny=None):
    Mouse("[" + str(sign(x, nx)) + ", " + str(sign(y, ny)) + "]").execute()
    
def execute_mouse_move_rel_px(x, y, nx=None, ny=None):
    Mouse("<" + str(sign(x, nx)) + ", " + str(sign(y, ny)) + ">").execute()
    
def execute_mouse_move_win_pct(x, y, nx=None, ny=None):
    x_pct = convert_to_decimal_percentage(sign(x, nx))
    y_pct = convert_to_decimal_percentage(sign(y, ny))
    Mouse("<" + str(x_pct) + ", " + str(y_pct) + ">").execute()
    
def execute_mouse_click(button, repeat, pause):
    arg = button + ":" + str(repeat) + "/" + str(convert_to_centiseconds(pause))
    Mouse(arg).execute()
    
def execute_mouse_hold_release(button, direction, pause):
    arg = button + ":" + direction + "/" + str(convert_to_centiseconds(pause))
    Mouse(arg).execute()
`;
