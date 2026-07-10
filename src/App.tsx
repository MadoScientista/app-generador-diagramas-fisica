import { useState, useEffect, useRef, useCallback } from 'react';
import { ModuleRegistry } from './core/module-registry.ts';
import { PhysicsDiagramEngine } from './app/engine.ts';
import { MRUModule } from './modules/mru/index.ts';
import { MRUForm } from './ui/components/MRUForm.tsx';
import { DiagramView } from './ui/components/DiagramView.tsx';
import { ExportButton } from './ui/components/ExportButton.tsx';
import { formatValue } from './core/format.ts';
import type { PipelineResult } from './core/types.ts';
import type { DistanceUnit, TimeUnit, VelocityUnit } from './core/units.ts';
import type { ComputedField, ShowValuesFlags } from './modules/mru/types.ts';
import './App.css';

const registry = new ModuleRegistry();
registry.register(MRUModule);
const engine = new PhysicsDiagramEngine(registry);

function threeFilled(x0: string, v: string, t: string, xf: string) {
  return [x0, v, t, xf].filter((s) => s.trim() !== '').length >= 3;
}

function allFilled(x0: string, v: string, t: string, xf: string) {
  return [x0, v, t, xf].every((s) => s.trim() !== '');
}

function App() {
  const [x0, setX0] = useState('');
  const [v, setV] = useState('');
  const [t, setT] = useState('');
  const [xf, setXf] = useState('');
  const [x0Unit, setX0Unit] = useState<DistanceUnit>('m');
  const [xfUnit, setXfUnit] = useState<DistanceUnit>('m');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('s');
  const [velUnit, setVelUnit] = useState<VelocityUnit>('m/s');
  const [showValues, setShowValues] = useState<ShowValuesFlags>({
    xi: true, xf: true, v: true, t: true, dx: true,
  });
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const computedFieldRef = useRef<{ field: ComputedField; value: string } | null>(null);
  const prevUnitsRef = useRef({ x0Unit, xfUnit, timeUnit, velUnit });

  const svg = result && result.type === 'success' ? result.svg : null;
  const error = result && result.type !== 'success' ? result.message : null;
  const errorDetail = result && result.type !== 'success' && 'detail' in result ? (result as { detail?: string }).detail : null;

  const clearAll = useCallback(() => {
    setX0('');
    setV('');
    setT('');
    setXf('');
    setX0Unit('m');
    setXfUnit('m');
    setTimeUnit('s');
    setVelUnit('m/s');
    setShowValues({ xi: true, xf: true, v: true, t: true, dx: true });
    setResult(null);
    setLoading(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    computedFieldRef.current = null;
    prevUnitsRef.current = { x0Unit: 'm', xfUnit: 'm', timeUnit: 's', velUnit: 'm/s' };
  }, []);

  const buildInput = useCallback(() => {
    const rawInput: Record<string, string> = { x0, v, t, xf };

    if (allFilled(x0, v, t, xf)) {
      const prev = prevUnitsRef.current;
      if (x0Unit !== prev.x0Unit) rawInput.x0 = '';
      if (xfUnit !== prev.xfUnit) rawInput.xf = '';
      if (timeUnit !== prev.timeUnit) rawInput.t = '';
      if (velUnit !== prev.velUnit) rawInput.v = '';

      if (computedFieldRef.current) {
        const cf = computedFieldRef.current;
        if (rawInput[cf.field!] === cf.value) {
          rawInput[cf.field!] = '';
        }
      }
    }

    prevUnitsRef.current = { x0Unit, xfUnit, timeUnit, velUnit };
    return rawInput;
  }, [x0, v, t, xf, x0Unit, xfUnit, timeUnit, velUnit]);

  const runEngine = useCallback(() => {
    const rawInput = buildInput();

    const res = engine.generate({
      moduleId: 'mru',
      rawInput,
      x0Unit,
      xfUnit,
      timeUnit,
      velUnit,
      showValues,
    });

    if (res.type === 'success' && res.computedField && res.resolvedValues) {
      const computedField = res.computedField;
      const computedValue = res.resolvedValues[computedField];
      const computedStr = formatValue(computedValue);

      if (computedField === 'xf' && xf !== computedStr) {
        setXf(computedStr);
        computedFieldRef.current = { field: 'xf', value: computedStr };
      } else if (computedField === 'v' && v !== computedStr) {
        setV(computedStr);
        computedFieldRef.current = { field: 'v', value: computedStr };
      } else if (computedField === 't' && t !== computedStr) {
        setT(computedStr);
        computedFieldRef.current = { field: 't', value: computedStr };
      }
    } else if (res.type === 'success') {
      computedFieldRef.current = null;
    }

    setResult(res as PipelineResult);
  }, [buildInput, v, t, xf, x0Unit, xfUnit, timeUnit, velUnit, showValues]);

  const handleChange = useCallback((field: 'x0' | 'v' | 't' | 'xf', value: string) => {
    if (computedFieldRef.current?.field === field) {
      computedFieldRef.current = null;
    }
    if (field === 'x0') setX0(value);
    else if (field === 'v') setV(value);
    else if (field === 't') setT(value);
    else setXf(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (threeFilled(x0, v, t, xf)) {
      setLoading(true);
      setResult(null);
    }
    runEngine();
    setLoading(false);
  }, [runEngine, x0, v, t, xf]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (threeFilled(x0, v, t, xf)) {
        setLoading(true);
        setResult(null);
      }
      runEngine();
      setLoading(false);
    }, 400);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [x0, v, t, xf, x0Unit, xfUnit, timeUnit, velUnit, showValues, runEngine]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Physics Diagram Engine</h1>
        <p className="subtitle">Generador automático de diagramas de Física</p>
      </header>

      <main className="app-main">
        <section className="input-section">
          <h2>Movimiento Rectilíneo Uniforme</h2>
          <p className="input-description">
            Ingresa los valores del problema. Completa al menos 3 campos para resolver.
          </p>
          <MRUForm
            values={{ x0, v, t, xf }}
            onChange={handleChange}
            x0Unit={x0Unit}
            xfUnit={xfUnit}
            timeUnit={timeUnit}
            velUnit={velUnit}
            onX0UnitChange={setX0Unit}
            onXfUnitChange={setXfUnit}
            onTimeUnitChange={setTimeUnit}
            onVelUnitChange={setVelUnit}
            showValues={showValues}
            onShowValuesChange={(key) =>
              setShowValues((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            onSubmit={handleSubmit}
            disabled={loading}
          />
          <button className="clear-button" onClick={clearAll}>
            Borrar datos
          </button>
        </section>

        <section className="diagram-section">
          <div className="diagram-toolbar">
            <h2>Diagrama</h2>
            <ExportButton svg={svg} />
          </div>
          {loading ? (
            <div className="diagram-loading">
              <p>Generando diagrama...</p>
            </div>
          ) : (
            <DiagramView svg={svg} error={error} errorDetail={errorDetail} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
