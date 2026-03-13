import { useEffect, useRef } from 'react';

export function DoNotDisturbOverlay({ onClose }) {
  const canvasRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (!canvasRef.current) return;
      try {
        const module = await import(
          /* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js'
        );
        if (cancelled) return;
        const Grid1Background = module.default;
        const bg = Grid1Background(canvasRef.current);
        bgRef.current = bg;
      } catch (err) {
        // swallow errors silently for now
        // eslint-disable-next-line no-console
        console.error('Failed to load hexagonal grid background', err);
      }
    }

    setup();

    return () => {
      cancelled = true;
      if (bgRef.current && typeof bgRef.current.dispose === 'function') {
        bgRef.current.dispose();
      }
    };
  }, []);

  const handleRandomColors = () => {
    const bg = bgRef.current;
    if (!bg || !bg.grid) return;

    const rand = () => 0xffffff * Math.random();
    bg.grid.setColors([rand(), rand(), rand()]);
    if (bg.grid.light1) {
      bg.grid.light1.color.set(rand());
      bg.grid.light1.intensity = 500 + Math.random() * 1000;
    }
    if (bg.grid.light2) {
      bg.grid.light2.color.set(rand());
      bg.grid.light2.intensity = 250 + Math.random() * 250;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
      <div className="relative w-full h-full text-white">
        <canvas
          ref={canvasRef}
          id="webgl-canvas"
          className="absolute inset-0 w-full h-full"
        />

        <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
          <div className="text-center pointer-events-auto select-none">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight drop-shadow-lg uppercase">
              Modo
            </h1>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight drop-shadow-lg uppercase">
              No molestar
            </h2>
          </div>

          <div className="pointer-events-auto mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={handleRandomColors}
              className="btn-secondary text-sm"
            >
              Random colors
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-slate-100 border border-slate-600 hover:bg-black focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Salir de modo no molestar"
        >
          ×
        </button>
      </div>
    </div>
  );
}

