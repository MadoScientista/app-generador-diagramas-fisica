import { DISTANCE_UNITS, TIME_UNITS, VELOCITY_UNITS } from '../../core/units.ts';
import type { DistanceUnit, TimeUnit, VelocityUnit } from '../../core/units.ts';
import type { DiagramControls, ElementControls } from '../../modules/mru/types.ts';

interface MRUFormValues {
  x0: string;
  v: string;
  t: string;
  xf: string;
}

interface MRUFormProps {
  values: MRUFormValues;
  onChange: (field: 'x0' | 'v' | 't' | 'xf', value: string) => void;
  x0Unit: DistanceUnit;
  xfUnit: DistanceUnit;
  timeUnit: TimeUnit;
  velUnit: VelocityUnit;
  onX0UnitChange: (unit: DistanceUnit) => void;
  onXfUnitChange: (unit: DistanceUnit) => void;
  onTimeUnitChange: (unit: TimeUnit) => void;
  onVelUnitChange: (unit: VelocityUnit) => void;
  controls: DiagramControls;
  onControlChange: (element: keyof DiagramControls, field: keyof ElementControls, value: boolean) => void;
  onCalculate: () => void;
  onSubmit: () => void;
}

interface ControlRow {
  id: keyof DiagramControls;
  label: string;
  hasVector: boolean;
}

const CONTROL_ROWS: ControlRow[] = [
  { id: 'xi', label: 'xi', hasVector: false },
  { id: 'xf', label: 'xf', hasVector: false },
  { id: 'v', label: 'v', hasVector: true },
  { id: 't', label: 't', hasVector: false },
  { id: 'dx', label: 'Δx', hasVector: true },
];

export function MRUForm({
  values,
  onChange,
  x0Unit,
  xfUnit,
  timeUnit,
  velUnit,
  onX0UnitChange,
  onXfUnitChange,
  onTimeUnitChange,
  onVelUnitChange,
  controls,
  onControlChange,
  onCalculate,
  onSubmit,
}: MRUFormProps) {
  const filledCount = [values.x0, values.v, values.t, values.xf].filter((s) => s.trim() !== '').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mru-form">
      <div className="card">
        <h3>Datos del diagrama</h3>
        <div className="form-field">
          <label htmlFor="x0">Posición inicial</label>
          <div className="input-with-unit">
            <input
              id="x0"
              type="text"
              value={values.x0}
              onChange={(e) => onChange('x0', e.target.value)}
              placeholder="xi"
            />
            <select
              value={x0Unit}
              onChange={(e) => onX0UnitChange(e.target.value as DistanceUnit)}
            >
              {DISTANCE_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="v">Velocidad</label>
          <div className="input-with-unit">
            <input
              id="v"
              type="text"
              value={values.v}
              onChange={(e) => onChange('v', e.target.value)}
              placeholder="v"
            />
            <select
              value={velUnit}
              onChange={(e) => onVelUnitChange(e.target.value as VelocityUnit)}
            >
              {VELOCITY_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="t">Tiempo</label>
          <div className="input-with-unit">
            <input
              id="t"
              type="text"
              value={values.t}
              onChange={(e) => onChange('t', e.target.value)}
              placeholder="t"
            />
            <select
              value={timeUnit}
              onChange={(e) => onTimeUnitChange(e.target.value as TimeUnit)}
            >
              {TIME_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="xf">Posición final</label>
          <div className="input-with-unit">
            <input
              id="xf"
              type="text"
              value={values.xf}
              onChange={(e) => onChange('xf', e.target.value)}
              placeholder="xf"
            />
            <select
              value={xfUnit}
              onChange={(e) => onXfUnitChange(e.target.value as DistanceUnit)}
            >
              {DISTANCE_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="button" className="calculate-button" onClick={onCalculate} disabled={filledCount !== 3}>
          Calcular
        </button>
      </div>

      <div className="card">
        <h3>Elementos del diagrama</h3>
        <div className="controls-table">
          <div className="controls-row controls-header">
            <span className="controls-cell element-label">Elemento</span>
            <span className="controls-cell">Etiqueta</span>
            <span className="controls-cell">Valor</span>
            <span className="controls-cell">Vector</span>
          </div>
          {CONTROL_ROWS.map((row) => {
            const ctrl = controls[row.id];
            const showValueDisabled = !ctrl.showLabel;
            return (
              <div key={row.id} className="controls-row">
                <span className="controls-cell element-label">{row.label}</span>
                <span className="controls-cell">
                  <input
                    type="checkbox"
                    checked={ctrl.showLabel}
                    onChange={() => onControlChange(row.id, 'showLabel', !ctrl.showLabel)}
                  />
                </span>
                <span className="controls-cell">
                  <input
                    type="checkbox"
                    checked={ctrl.showValue && ctrl.showLabel}
                    disabled={showValueDisabled}
                    onChange={() => onControlChange(row.id, 'showValue', !ctrl.showValue)}
                  />
                </span>
                <span className="controls-cell">
                  {row.hasVector ? (
                    <input
                      type="checkbox"
                      checked={'showVector' in ctrl ? (ctrl as ElementControls & { showVector: boolean }).showVector : false}
                      onChange={() => onControlChange(row.id, 'showVector', !('showVector' in ctrl ? (ctrl as ElementControls & { showVector: boolean }).showVector : false))}
                    />
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button type="submit">
        Generar Diagrama
      </button>
    </form>
  );
}
