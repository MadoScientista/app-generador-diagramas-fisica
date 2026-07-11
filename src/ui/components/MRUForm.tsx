import { DISTANCE_UNITS, TIME_UNITS, VELOCITY_UNITS } from '../../core/units.ts';
import type { DistanceUnit, TimeUnit, VelocityUnit } from '../../core/units.ts';
import type { ShowValuesFlags } from '../../modules/mru/types.ts';

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
  showValues: ShowValuesFlags;
  onShowValuesChange: (key: keyof ShowValuesFlags) => void;
  onCalculate: () => void;
  onSubmit: () => void;
}

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
  showValues,
  onShowValuesChange,
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
      <div className="form-field">
        <label htmlFor="x0">xi (posición inicial)</label>
        <div className="input-with-unit">
          <input
            id="x0"
            type="text"
            value={values.x0}
            onChange={(e) => onChange('x0', e.target.value)}
            placeholder="0"
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
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showValues.xi}
            onChange={() => onShowValuesChange('xi')}
          /> Mostrar valor
        </label>
      </div>

      <div className="form-field">
        <label htmlFor="v">v (velocidad)</label>
        <div className="input-with-unit">
          <input
            id="v"
            type="text"
            value={values.v}
            onChange={(e) => onChange('v', e.target.value)}
            placeholder="1"
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
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showValues.v}
            onChange={() => onShowValuesChange('v')}
          /> Mostrar valor
        </label>
      </div>

      <div className="form-field">
        <label htmlFor="t">t (tiempo)</label>
        <div className="input-with-unit">
          <input
            id="t"
            type="text"
            value={values.t}
            onChange={(e) => onChange('t', e.target.value)}
            placeholder="1"
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
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showValues.t}
            onChange={() => onShowValuesChange('t')}
          /> Mostrar valor
        </label>
      </div>

      <div className="form-field">
        <label htmlFor="xf">xf (posición final)</label>
        <div className="input-with-unit">
          <input
            id="xf"
            type="text"
            value={values.xf}
            onChange={(e) => onChange('xf', e.target.value)}
            placeholder="0"
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
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showValues.xf}
            onChange={() => onShowValuesChange('xf')}
          /> Mostrar valor
        </label>
      </div>

      <div className="form-field">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showValues.dx}
            onChange={() => onShowValuesChange('dx')}
          /> Mostrar Δx
        </label>
      </div>

      <button type="button" className="calculate-button" onClick={onCalculate} disabled={filledCount !== 3}>
        Calcular
      </button>
      <button type="submit">
        Generar Diagrama
      </button>
    </form>
  );
}
