import { Fn, FnParameter, PythonFn } from '../../../model/fn/fn';
import { FnType } from '../../../model/fn/fn-types';
import { VariableType } from '../../../model/variable/variable-types';

// TODO: make this type better: inject these fns rather than hardcoding them
export type DragonflyBuiltinFnsProvider = {
  getMouseMoveAbsPx: () => Fn;
  getMouseMoveRelPx: () => Fn;
  getMouseMoveWinPct: () => Fn;
  getMouseClick: () => Fn;
  getMouseHoldRelease: () => Fn;
  getAll: () => Fn[];
};

export class DefaultDragonflyBuiltinFnsProvider
  implements DragonflyBuiltinFnsProvider
{
  getAll(): PythonFn[] {
    return [
      this.getMouseMoveAbsPx(),
      this.getMouseMoveRelPx(),
      this.getMouseMoveWinPct(),
      this.getMouseClick(),
      this.getMouseHoldRelease(),
    ];
  }

  getMouseMoveAbsPx(): Fn {
    return this.createFn(
      'execute_mouse_move_abs_px',
      this.getMouseMoveParams()
    );
  }

  getMouseMoveRelPx(): Fn {
    return this.createFn(
      'execute_mouse_move_rel_px',
      this.getMouseMoveParams()
    );
  }

  getMouseMoveWinPct(): Fn {
    return this.createFn(
      'execute_mouse_move_win_pct',
      this.getMouseMoveParams()
    );
  }

  getMouseClick(): Fn {
    return this.createFn('execute_mouse_click', [
      {
        id: '',
        name: 'button',
        type: VariableType.Enum.ENUM,
      },
      {
        id: '',
        name: 'repeat',
        type: VariableType.Enum.NUMBER,
      },
      {
        id: '',
        name: 'pause',
        type: VariableType.Enum.NUMBER,
      },
    ]);
  }

  getMouseHoldRelease(): Fn {
    return this.createFn('execute_mouse_hold_release', [
      {
        id: '',
        name: 'button',
        type: VariableType.Enum.ENUM,
      },
      {
        id: '',
        name: 'direction',
        type: VariableType.Enum.ENUM,
      },
      {
        id: '',
        name: 'pause',
        type: VariableType.Enum.NUMBER,
      },
    ]);
  }

  private createFn(name: string, params: FnParameter[]): Fn {
    return {
      id: name,
      name: name,
      roleKey: '',
      type: FnType.Enum.PYTHON,
      enabled: true,
      locked: true,
      importTokens: [],
      parameters: params,
    };
  }

  private getMouseMoveParams(): FnParameter[] {
    return [
      {
        id: '',
        name: 'x',
        type: VariableType.Enum.NUMBER,
      },
      {
        id: '',
        name: 'y',
        type: VariableType.Enum.NUMBER,
      },
    ];
  }
}
