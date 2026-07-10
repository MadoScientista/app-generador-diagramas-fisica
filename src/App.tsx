import { useState, useEffect, useRef, useCallback } from 'react';
import { ModuleRegistry } from './core/module-registry.ts';
import { PhysicsDiagramEngine } from './app/engine.ts';
import { MRUModule } from './modules/mru/index.ts';
import { MRUForm } from './ui/components/MRUForm.tsx';
import { DiagramView } from './ui/components/DiagramView.tsx';
import { ExportButton } from './ui/components/ExportButton.tsx';
import type { PipelineResult } from './core/types.ts';
import './App.css';

const registry = new ModuleRegistry();
registry.register(MRUModule);
const engine = new PhysicsDiagramEngine(registry);

function allFilled(x0: string, v: string, t: string) {
  return x0.trim() !== '' && v.trim() !== '' && t.trim() !== '';
}

function App() {
  const [x0, setX0] = useState('');
  const [v, setV] = useState('');
  const [t, setT] = useState('');
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const svg = result && result.type === 'success' ? result.svg : null;
  const error = result && result.type !== 'success' ? result.message : null;
  const errorDetail = result && result.type !== 'success' && 'detail' in result ? (result as { detail?: string }).detail : null;

  const handleChange = useCallback((field: 'x0' | 'v' | 't', value: string) => {
    if (field === 'x0') setX0(value);
    else if (field === 'v') setV(value);
    else setT(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (allFilled(x0, v, t)) {
      setLoading(true);
      setResult(null);
    }
    const res = engine.generate('mru', { x0, v, t });
    setResult(res);
    setLoading(false);
  }, [x0, v, t]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (allFilled(x0, v, t)) {
        setLoading(true);
        setResult(null);
      }
      const res = engine.generate('mru', { x0, v, t });
      setResult(res);
      setLoading(false);
    }, 400);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [x0, v, t]);

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
            Ingresa los valores del problema. El diagrama se generará automáticamente.
          </p>
          <MRUForm
            values={{ x0, v, t }}
            onChange={handleChange}
            onSubmit={handleSubmit}
            disabled={loading}
          />
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
