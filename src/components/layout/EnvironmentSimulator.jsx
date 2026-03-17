import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEnvironment } from '../../contexts/EnvironmentContext';
import { envToPrefix } from '../../utils/envRouting';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../constants/roles';

export function EnvironmentSimulator() {
  const { environment, previewEnvironment, effectiveEnvironment, setPreviewEnvironment, clearPreview, setEnvironment } =
    useEnvironment();
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const options = useMemo(
    () => [
      { value: 'royal', label: 'Royal' },
      { value: 'institucion', label: 'Otra institución' },
      { value: 'improvisaciones', label: 'Improvisaciones' },
    ],
    []
  );

  const canShow = params.envPrefix === 'impro';
  if (!canShow) return null;

  return (
    <div className="flex items-center gap-2">
      <select
        value={previewEnvironment || ''}
        onChange={(e) => {
          const val = e.target.value;
          if (!val) clearPreview();
          else setPreviewEnvironment(val);
        }}
        className="h-9 rounded-lg bg-black/30 border border-white/15 px-2 text-sm text-white/85"
        aria-label="Simulación de entorno"
      >
        <option value="">Ver como (sin preview)</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="h-9 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-sm text-white/90 border border-white/10"
        onClick={() => {
          const toSave = previewEnvironment || effectiveEnvironment;
          setEnvironment(toSave);
          clearPreview();
          const prefix = envToPrefix(toSave);
          if (user?.role === ROLES.STUDENT) navigate(`${prefix}/student/access`, { replace: true });
          else if (user?.role === ROLES.ADMIN) navigate(`${prefix}/admin`, { replace: true });
          else navigate(`${prefix}/teacher/home`, { replace: true });
        }}
        title="Guardar este entorno como el real"
      >
        Guardar
      </button>

      {(previewEnvironment || environment !== effectiveEnvironment) && (
        <button
          type="button"
          className="h-9 px-3 rounded-lg bg-black/30 hover:bg-black/40 text-sm text-white/80 border border-white/10"
          onClick={() => clearPreview()}
          title="Salir del modo preview"
        >
          Salir preview
        </button>
      )}
    </div>
  );
}

