import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const STORAGE_KEY = 'royalcanvas_impro_exam_builder_draft_v2';
const STORAGE_KEY_V1 = 'royalcanvas_impro_exam_builder_draft_v1';

function uid() {
  return `q_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Opción múltiple' },
  { value: 'short_answer', label: 'Respuesta corta' },
  { value: 'true_false', label: 'Verdadero/Falso' },
];

function createQuestion(type = 'multiple_choice') {
  if (type === 'true_false') {
    return {
      id: uid(),
      kind: 'question',
      type,
      title: 'Nueva pregunta (V/F)',
      prompt: '',
      required: true,
      answer: true,
    };
  }
  if (type === 'short_answer') {
    return {
      id: uid(),
      kind: 'question',
      type,
      title: 'Nueva pregunta (corta)',
      prompt: '',
      required: true,
      answer: '',
    };
  }
  return {
    id: uid(),
    kind: 'question',
    type,
    title: 'Nueva pregunta (opción múltiple)',
    prompt: '',
    required: true,
    options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
    answerIndex: 0,
  };
}

function createSection() {
  return {
    id: uid(),
    kind: 'section',
    title: 'Nueva sección',
    description: '',
  };
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function migrateToV2(maybeV2, maybeV1) {
  // V2 shape: { title, description, settings, items: [...] }
  if (maybeV2 && Array.isArray(maybeV2.items)) return maybeV2;

  if (maybeV1 && Array.isArray(maybeV1.questions)) {
    return {
      title: maybeV1.title || 'Nuevo examen',
      description: maybeV1.description || '',
      settings: {
        timeLimitMinutes: 0,
        shuffleQuestions: false,
        showPoints: true,
      },
      items: [
        { id: uid(), kind: 'section', title: 'Sección 1', description: '' },
        ...maybeV1.questions.map((q) => ({ ...q, kind: 'question' })),
      ],
    };
  }

  return {
    title: 'Nuevo examen',
    description: '',
    settings: { timeLimitMinutes: 0, shuffleQuestions: false, showPoints: true },
    items: [{ id: uid(), kind: 'section', title: 'Sección 1', description: '' }, createQuestion('multiple_choice')],
  };
}

function SortableRow({ item, active, onClick, right }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-2 ${
        active
          ? 'bg-white/10 border-white/20 text-white'
          : 'bg-black/10 border-white/10 text-white/80 hover:bg-white/10'
      } ${isDragging ? 'opacity-70' : ''}`}
    >
      <span
        {...attributes}
        {...listeners}
        className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/70 cursor-grab active:cursor-grabbing"
        title="Arrastrar"
      >
        ≡
      </span>
      <div className="flex-1 min-w-0">
        {item.kind === 'section' ? (
          <>
            <div className="text-xs text-white/50">Sección</div>
            <div className="text-sm font-semibold truncate">{item.title || 'Sin título'}</div>
          </>
        ) : (
          <>
            <div className="text-xs text-white/50">{item.type}</div>
            <div className="text-sm font-medium line-clamp-2">{item.title || 'Sin título'}</div>
          </>
        )}
      </div>
      {right}
    </button>
  );
}

export function ExamBuilderPage() {
  const [draft, setDraft] = useState(() => {
    const storedV2 = safeParse(localStorage.getItem(STORAGE_KEY) || '');
    const storedV1 = safeParse(localStorage.getItem(STORAGE_KEY_V1) || '');
    return migrateToV2(storedV2, storedV1);
  });
  const [selectedId, setSelectedId] = useState(draft.items.find((i) => i.kind === 'question')?.id ?? draft.items[0]?.id ?? null);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const selected = useMemo(() => draft.items.find((q) => q.id === selectedId) || draft.items[0] || null, [draft.items, selectedId]);

  useEffect(() => {
    if (!selectedId && draft.items[0]) setSelectedId(draft.items[0].id);
  }, [draft.items, selectedId]);

  const setSelected = (patch) => {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((q) => (q.id === selected?.id ? { ...q, ...patch } : q)),
    }));
  };

  const addQuestion = (type) => {
    const q = createQuestion(type);
    setDraft((prev) => ({ ...prev, items: [...prev.items, q] }));
    setSelectedId(q.id);
  };

  const addSection = () => {
    const s = createSection();
    setDraft((prev) => ({ ...prev, items: [...prev.items, s] }));
    setSelectedId(s.id);
  };

  const duplicateQuestion = () => {
    if (!selected || selected.kind !== 'question') return;
    const copy = { ...selected, id: uid(), title: `${selected.title} (copia)` };
    setDraft((prev) => ({ ...prev, items: [...prev.items, copy] }));
    setSelectedId(copy.id);
  };

  const deleteQuestion = () => {
    if (!selected) return;
    setDraft((prev) => {
      const nextItems = prev.items.filter((q) => q.id !== selected.id);
      const hasQuestion = nextItems.some((i) => i.kind === 'question');
      return {
        ...prev,
        items: hasQuestion ? nextItems : [...nextItems, createQuestion('multiple_choice')],
      };
    });
    setSelectedId((prevId) => (prevId === selected.id ? null : prevId));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const itemIds = useMemo(() => draft.items.map((i) => i.id), [draft.items]);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setDraft((prev) => {
      const oldIndex = prev.items.findIndex((i) => i.id === active.id);
      const newIndex = prev.items.findIndex((i) => i.id === over.id);
      return { ...prev, items: arrayMove(prev.items, oldIndex, newIndex) };
    });
  };

  const exportJson = useMemo(() => JSON.stringify(draft, null, 2), [draft]);

  const importJson = () => {
    const raw = exportRef.current?.value;
    const parsed = safeParse(raw);
    const next = migrateToV2(parsed, null);
    setDraft(next);
    setSelectedId(next.items[0]?.id ?? null);
    setShowExport(false);
  };

  return (
    <div className="h-[calc(100vh-56px-48px)] min-h-[640px] grid grid-cols-12 gap-4">
      {/* Left: question list */}
      <div className="col-span-12 lg:col-span-3 rounded-2xl bg-black/25 border border-white/10 backdrop-blur p-3 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-white">Estructura</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white"
            >
              Ajustes
            </button>
            <button
              type="button"
              onClick={() => setShowExport(true)}
              className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white"
            >
              Import/Export
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="relative group">
            <button type="button" className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white">
              + Pregunta
            </button>
            <div className="absolute left-0 mt-2 w-52 rounded-xl bg-slate-950/95 border border-white/10 shadow-lg overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition">
              {QUESTION_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => addQuestion(t.value)}
                  className="w-full text-left px-3 py-2 text-sm text-white/85 hover:bg-white/10"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white"
          >
            + Sección
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {draft.items.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  active={item.id === selectedId}
                  onClick={() => setSelectedId(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Center: editor */}
      <div className="col-span-12 lg:col-span-6 rounded-2xl bg-black/25 border border-white/10 backdrop-blur p-4 overflow-auto">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <input
              className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/40"
              value={draft.title}
              onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
              placeholder="Título del examen"
            />
            <textarea
              className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 placeholder:text-white/35 min-h-[84px]"
              value={draft.description}
              onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descripción (opcional)"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={duplicateQuestion}
              className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-white"
              disabled={!selected || selected.kind !== 'question'}
            >
              Duplicar
            </button>
            <button
              type="button"
              onClick={deleteQuestion}
              className="h-9 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-sm text-red-100 border border-red-500/20"
            >
              Eliminar
            </button>
          </div>
        </div>

        {!selected ? (
          <div className="text-white/70">Selecciona una pregunta.</div>
        ) : selected.kind === 'section' ? (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs text-white/60">
              <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">Sección</span>
            </div>
            <input
              className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/40"
              value={selected.title}
              onChange={(e) => setSelected({ title: e.target.value })}
              placeholder="Título de la sección"
            />
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 placeholder:text-white/35 min-h-[120px]"
              value={selected.description || ''}
              onChange={(e) => setSelected({ description: e.target.value })}
              placeholder="Descripción (opcional)"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <input
              className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/40"
              value={selected.title}
              onChange={(e) => setSelected({ title: e.target.value })}
              placeholder="Título de la pregunta"
            />

            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 placeholder:text-white/35 min-h-[120px]"
              value={selected.prompt}
              onChange={(e) => setSelected({ prompt: e.target.value })}
              placeholder="Escribe el enunciado..."
            />

            <div className="flex items-center justify-between">
              <div className="text-sm text-white/70">
                Tipo: <span className="text-white/90">{selected.type}</span>
              </div>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={!!selected.required}
                  onChange={(e) => setSelected({ required: e.target.checked })}
                />
                Requerida
              </label>
            </div>

            {selected.type === 'multiple_choice' && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-white">Opciones</div>
                {selected.options.map((opt, i) => (
                  <div key={`${selected.id}_opt_${i}`} className="flex items-center gap-2">
                    <input
                      className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white"
                      value={opt}
                      onChange={(e) => {
                        const next = [...selected.options];
                        next[i] = e.target.value;
                        setSelected({ options: next });
                      }}
                    />
                    <button
                      type="button"
                      className={`h-9 px-3 rounded-xl border text-sm ${
                        selected.answerIndex === i
                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100'
                          : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                      }`}
                      onClick={() => setSelected({ answerIndex: i })}
                    >
                      Correcta
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-white"
                  onClick={() => setSelected({ options: [...selected.options, `Opción ${String.fromCharCode(65 + selected.options.length)}`] })}
                >
                  + Agregar opción
                </button>
              </div>
            )}

            {selected.type === 'true_false' && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-white">Respuesta</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`h-10 px-4 rounded-xl border ${
                      selected.answer === true
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                    onClick={() => setSelected({ answer: true })}
                  >
                    Verdadero
                  </button>
                  <button
                    type="button"
                    className={`h-10 px-4 rounded-xl border ${
                      selected.answer === false
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                    onClick={() => setSelected({ answer: false })}
                  >
                    Falso
                  </button>
                </div>
              </div>
            )}

            {selected.type === 'short_answer' && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-white">Respuesta esperada (opcional)</div>
                <input
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/40"
                  value={selected.answer}
                  onChange={(e) => setSelected({ answer: e.target.value })}
                  placeholder="Ej. 42"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: preview */}
      <div className="col-span-12 lg:col-span-3 rounded-2xl bg-black/25 border border-white/10 backdrop-blur p-4 overflow-auto">
        <div className="text-sm font-semibold text-white mb-3">Vista previa</div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-lg font-semibold text-white">{draft.title || 'Sin título'}</div>
          {draft.description && <div className="mt-1 text-sm text-white/70">{draft.description}</div>}
          <div className="mt-4 space-y-4">
            {draft.items.map((it, i) => {
              if (it.kind === 'section') {
                return (
                  <div key={it.id} className="rounded-xl bg-black/10 border border-white/10 p-3">
                    <div className="text-xs text-white/50">Sección</div>
                    <div className="text-sm font-semibold text-white">{it.title || 'Sin título'}</div>
                    {it.description && <div className="mt-1 text-sm text-white/70">{it.description}</div>}
                  </div>
                );
              }
              const q = it;
              const qNumber = draft.items.slice(0, i + 1).filter((x) => x.kind === 'question').length;
              return (
                <div key={q.id} className="rounded-xl bg-black/20 border border-white/10 p-3">
                  <div className="text-xs text-white/50">Pregunta {qNumber}</div>
                  <div className="text-sm font-semibold text-white">{q.title || 'Sin título'}</div>
                  {q.prompt && <div className="mt-1 text-sm text-white/75 whitespace-pre-wrap">{q.prompt}</div>}
                  {q.type === 'multiple_choice' && (
                    <div className="mt-2 space-y-1">
                      {q.options.map((opt, idx) => (
                        <label key={`${q.id}_pv_${idx}`} className="flex items-center gap-2 text-sm text-white/75">
                          <input type="radio" name={`pv_${q.id}`} disabled />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'true_false' && (
                    <div className="mt-2 flex gap-3 text-sm text-white/75">
                      <label className="flex items-center gap-2">
                        <input type="radio" name={`pv_${q.id}`} disabled /> Verdadero
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name={`pv_${q.id}`} disabled /> Falso
                      </label>
                    </div>
                  )}
                  {q.type === 'short_answer' && (
                    <input
                      className="mt-2 w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white/70"
                      placeholder="Tu respuesta..."
                      disabled
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-3 text-xs text-white/50">
          Guardado automático (local). Incluye secciones, reordenar con drag & drop e import/export JSON.
        </div>
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowSettings(false)} />
          <div className="relative w-[min(640px,calc(100%-28px))] rounded-2xl bg-slate-950/90 border border-white/10 backdrop-blur p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-semibold">Ajustes del examen</div>
              <button type="button" className="text-white/70 hover:text-white" onClick={() => setShowSettings(false)}>
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-xs text-white/60">Tiempo límite (minutos)</div>
                <input
                  className="mt-2 w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white"
                  type="number"
                  min="0"
                  value={draft.settings?.timeLimitMinutes ?? 0}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      settings: { ...p.settings, timeLimitMinutes: parseInt(e.target.value || '0', 10) },
                    }))
                  }
                />
                <div className="mt-1 text-xs text-white/50">0 = sin límite</div>
              </label>
              <label className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">Mezclar preguntas</div>
                  <div className="text-xs text-white/50">Al iniciar el examen</div>
                </div>
                <input
                  type="checkbox"
                  checked={!!draft.settings?.shuffleQuestions}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, settings: { ...p.settings, shuffleQuestions: e.target.checked } }))
                  }
                />
              </label>
              <label className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">Mostrar puntos</div>
                  <div className="text-xs text-white/50">En la vista del alumno</div>
                </div>
                <input
                  type="checkbox"
                  checked={!!draft.settings?.showPoints}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, settings: { ...p.settings, showPoints: e.target.checked } }))
                  }
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Import/Export modal */}
      {showExport && (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowExport(false)} />
          <div className="relative w-[min(860px,calc(100%-28px))] rounded-2xl bg-slate-950/90 border border-white/10 backdrop-blur p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-semibold">Import / Export (JSON)</div>
              <button type="button" className="text-white/70 hover:text-white" onClick={() => setShowExport(false)}>
                ✕
              </button>
            </div>
            <textarea
              ref={exportRef}
              defaultValue={exportJson}
              className="w-full min-h-[320px] bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white/85 font-mono"
            />
            <div className="mt-3 flex gap-2 justify-end">
              <button
                type="button"
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-white"
                onClick={() => {
                  navigator.clipboard?.writeText(exportRef.current?.value || exportJson);
                }}
              >
                Copiar
              </button>
              <button
                type="button"
                className="h-10 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-sm text-emerald-100 border border-emerald-500/20"
                onClick={importJson}
              >
                Importar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

