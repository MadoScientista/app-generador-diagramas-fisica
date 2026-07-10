interface ExportButtonProps {
  svg: string | null;
}

export function ExportButton({ svg }: ExportButtonProps) {
  const handleExport = () => {
    if (!svg) return;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagrama-mru.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport} disabled={!svg} className="export-button">
      Exportar SVG
    </button>
  );
}
