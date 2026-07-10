interface DiagramViewProps {
  svg: string | null;
  error: string | null;
  errorDetail?: string | null;
}

export function DiagramView({ svg, error, errorDetail }: DiagramViewProps) {
  if (error) {
    return (
      <div className="diagram-error">
        <p>{error}</p>
        {errorDetail && <p className="diagram-error-detail">{errorDetail}</p>}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="diagram-empty">
        <p>Ingresa los valores y presiona "Generar Diagrama"</p>
      </div>
    );
  }

  return (
    <div
      className="diagram-container"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
