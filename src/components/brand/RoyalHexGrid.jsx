import { useEffect, useRef } from 'react';

const GOLD = '#c28f2c'; // dorado más oscuro
const BG = '#020617';

// Máscara aproximada de una corona (1 = hex pintado, 0 = fondo)
// Se puede refinar fila por fila para acercarse más al logo original.
const MASK = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
];

export function RoyalHexGrid({ size = 18 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = MASK[0].length;
    const rows = MASK.length;

    const hexRadius = size;
    const hexWidth = hexRadius * 2;
    const hexHeight = Math.sqrt(3) * hexRadius;
    const horizontalSpacing = (3 / 2) * hexRadius;
    const verticalSpacing = hexHeight;

    const width = (cols - 1) * horizontalSpacing + hexWidth + hexRadius;
    const height = rows * verticalSpacing + hexRadius;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, width, height);

    const drawHex = (cx, cy, r, fill) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = ((Math.PI / 180) * 60 * i) + Math.PI / 6; // flat-top
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    };

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const maskValue = MASK[row][col];
        if (!maskValue) continue;
        const cx = col * horizontalSpacing + hexRadius + (row % 2 === 0 ? 0 : hexRadius * 0.75);
        const cy = row * verticalSpacing + hexHeight / 2;
        drawHex(cx, cy, hexRadius - 1, GOLD);
      }
    }
  }, [size]);

  return (
    <div className="inline-flex items-center justify-center rounded-2xl border border-slate-800 bg-black px-4 py-4">
      <canvas ref={canvasRef} className="block max-w-full h-auto" />
    </div>
  );
}

