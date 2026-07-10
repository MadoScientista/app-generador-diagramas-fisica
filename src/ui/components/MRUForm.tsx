interface MRUFormProps {
  values: { x0: string; v: string; t: string };
  onChange: (field: 'x0' | 'v' | 't', value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function MRUForm({ values, onChange, onSubmit, disabled }: MRUFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mru-form">
      <div className="form-field">
        <label htmlFor="x0">x₀ (posición inicial)</label>
        <input
          id="x0"
          type="text"
          value={values.x0}
          onChange={(e) => onChange('x0', e.target.value)}
          placeholder="20"
          disabled={disabled}
        />
      </div>
      <div className="form-field">
        <label htmlFor="v">v (velocidad)</label>
        <input
          id="v"
          type="text"
          value={values.v}
          onChange={(e) => onChange('v', e.target.value)}
          placeholder="3"
          disabled={disabled}
        />
      </div>
      <div className="form-field">
        <label htmlFor="t">t (tiempo)</label>
        <input
          id="t"
          type="text"
          value={values.t}
          onChange={(e) => onChange('t', e.target.value)}
          placeholder="10"
          disabled={disabled}
        />
      </div>
      <button type="submit" disabled={disabled}>
        Generar Diagrama
      </button>
    </form>
  );
}
