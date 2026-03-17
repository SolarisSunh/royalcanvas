import { useEffect, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEnvironment } from '../contexts/EnvironmentContext';
import { PortalPlanesScene } from '../components/alternar/PortalPlanesScene';
import './AlternarRoyalANormalPage.css';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';
import tutorialArrow from '../assets/tutorial-arrow.svg';
import { envToPrefix } from '../utils/envRouting';

const BASE_URL = import.meta.env.BASE_URL || '/';
const IMG_DIR = `${(BASE_URL === './' ? '' : BASE_URL.replace(/\/$/, ''))}/AlternarRoyalANormal`.replace(/\/\/+/g, '/');

const IMAGES = [
  // Coloca estos archivos en: public/AlternarRoyalANormal/
  // (acepta .png o .jpg; el loader intentará primero png y luego jpg)
  {
    baseName: 'improvisaciones',
    title: 'Improvisaciones',
    description:
      '¿Estás seguro que esta es tu institución? Si continúas habrán varios procesos que se tienen que hacer para cambiarte!',
  },
  {
    baseName: 'escuela',
    title: 'Escuela',
    description:
      '¿Estás seguro que esta es tu institución? Si continúas habrán varios procesos que se tienen que hacer para cambiarte!',
  },
  {
    baseName: 'royal',
    title: 'Royal',
    description:
      '¿Estás seguro que esta es tu institución? Si continúas habrán varios procesos que se tienen que hacer para cambiarte!',
  },
];

const imageCandidates = IMAGES.map((img) => [
  `${IMG_DIR}/${img.baseName}.png`,
  `${IMG_DIR}/${img.baseName}.jpg`,
  `${IMG_DIR}/${img.baseName}.jpeg`,
]);

const imageLabels = IMAGES.map((img) => img.baseName);

/**
 * Página AlternarRoyalANormal — escena Three.js de 3 planos portal con parallax.
 * Copiada del proyecto AlternarRoyalANormal (threejs-portal-planes-with-matcaps).
 * Cambia las imágenes en public/AlternarRoyalANormal/ (1.jpg, 2.jpg, 3.jpg).
 */
export function AlternarRoyalANormalPage() {
  const { clearPostRegister, postRegister, user } = useAuth();
  const { setEnvironment } = useEnvironment();
  const [selected, setSelected] = useState(-1);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialDir, setTutorialDir] = useState('next'); // 'next' | 'prev'
  const [tutorialAnimNonce, setTutorialAnimNonce] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Show onboarding/tutorial only right after registration
    if (postRegister) {
      setShowTutorial(true);
      setTutorialStep(0);
    }
  }, [postRegister]);

  const onSelect = useCallback((idx) => {
    setSelected(typeof idx === 'number' ? idx : -1);
  }, []);

  const selectedItem = useMemo(() => {
    if (selected < 0 || selected >= IMAGES.length) return null;
    return IMAGES[selected];
  }, [selected]);

  const selectedImage = useMemo(() => {
    if (!selectedItem) return null;
    return {
      png: `${IMG_DIR}/${selectedItem.baseName}.png`,
      jpg: `${IMG_DIR}/${selectedItem.baseName}.jpg`,
      jpeg: `${IMG_DIR}/${selectedItem.baseName}.jpeg`,
      alt: selectedItem.title || selectedItem.baseName,
    };
  }, [selectedItem]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const redirectToRoleHome = useCallback(
    (envKey) => {
      const role = user?.role;
      const prefix = envToPrefix(envKey || 'royal');
      if (role === ROLES.TEACHER) navigate(`${prefix}${ROUTES.TEACHER_HOME}`, { replace: true });
      else if (role === ROLES.STUDENT) navigate(`${prefix}${ROUTES.STUDENT_ACCESS}`, { replace: true });
      else if (role === ROLES.ADMIN) navigate(`${prefix}${ROUTES.ADMIN}`, { replace: true });
      else navigate(ROUTES.LOGIN, { replace: true });
    },
    [navigate, user]
  );

  const tutorialSlides = useMemo(
    () => [
      {
        title: 'Bienvenido',
        text:
          'Gracias por registrarte. Antes de continuar, haremos una pequeña guía.',
      },
      {
        title: 'Lo que sigue',
        text:
          'Ahora tendrás que elegir entre 3 opciones. Esa elección aplicará un filtro y te llevará a tu entorno.',
      },
      {
        title: 'Opción 1: Royal',
        text: 'Entrarás al entorno Royal (premium).',
      },
      {
        title: 'Opción 2: Otra institución',
        text: 'Entrarás al entorno de otra institución.',
      },
      {
        title: 'Opción 3: Improvisaciones',
        text: 'Entrarás al entorno de improvisaciones.',
      },
      {
        title: 'Selecciona tu opción',
        text:
          'Cuando cierres este tutorial, haz click en el cuadro que corresponda para seleccionarlo y continuar.',
      },
    ],
    []
  );

  const isLastSlide = tutorialStep >= tutorialSlides.length - 1;
  const activeSlide = tutorialSlides[tutorialStep] || tutorialSlides[0];

  const endTutorial = useCallback(() => {
    setShowTutorial(false);
    // Keep postRegister true until the user actually picks one option.
    // This makes it easy to enforce onboarding if they go back.
  }, []);

  const goNext = useCallback(() => {
    if (isLastSlide) {
      endTutorial();
      return;
    }
    setTutorialDir('next');
    setTutorialAnimNonce((n) => n + 1);
    setTutorialStep((s) => Math.min(s + 1, tutorialSlides.length - 1));
  }, [endTutorial, isLastSlide, tutorialSlides.length]);

  const goPrev = useCallback(() => {
    if (tutorialStep <= 0) return;
    setTutorialDir('prev');
    setTutorialAnimNonce((n) => n + 1);
    setTutorialStep((s) => Math.max(s - 1, 0));
  }, [tutorialStep]);

  const confirmEnvironment = useCallback(
    (envKey) => {
      try {
        localStorage.setItem('royalcanvas_environment', envKey);
      } catch {
        // ignore
      }
      setEnvironment(envKey);
      clearPostRegister();
      redirectToRoleHome(envKey);
    },
    [clearPostRegister, redirectToRoleHome, setEnvironment]
  );

  const confirmSelected = useCallback(() => {
    if (!selectedItem) return;
    // baseName matches the environment key we store
    confirmEnvironment(selectedItem.baseName);
  }, [confirmEnvironment, selectedItem]);

  return (
    <div className="alternar-royal-page alternar-royal-page--fullscreen">
      <PortalPlanesScene imageUrls={imageCandidates} onSelect={showTutorial ? undefined : onSelect} />
      {showTutorial && (
        <div className="alternar-tutorial">
          <div className="alternar-tutorial__backdrop" />
          <div className="alternar-tutorial__panel" role="dialog" aria-label="Tutorial">
            <div className="alternar-tutorial__kicker">
              Tutorial {tutorialStep + 1}/{tutorialSlides.length}
            </div>
            <div
              key={`${tutorialStep}-${tutorialAnimNonce}`}
              className={`alternar-tutorial__slide alternar-tutorial__slide--${tutorialDir}`}
            >
              <div className="alternar-tutorial__title">{activeSlide.title}</div>
              <div className="alternar-tutorial__text">{activeSlide.text}</div>
            </div>

            <div className="alternar-tutorial__dots" aria-hidden="true">
              {tutorialSlides.map((_, i) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className={`alternar-tutorial__dot ${i === tutorialStep ? 'alternar-tutorial__dot--active' : ''}`}
                />
              ))}
            </div>

            <div className="alternar-tutorial__actions">
              <button
                type="button"
                className="alternar-tutorial__btn alternar-tutorial__btn--ghost"
                onClick={goPrev}
                disabled={tutorialStep === 0}
              >
                Anterior
              </button>

              <button type="button" className="alternar-tutorial__btn" onClick={goNext}>
                {isLastSlide ? 'Entendido' : 'Siguiente'}
                {!isLastSlide && (
                  <img className="alternar-tutorial__arrow" src={tutorialArrow} alt="" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`alternar-royal-dim ${selectedItem ? 'alternar-royal-dim--active' : ''}`}
        onClick={() => setSelected(-1)}
        role="button"
        tabIndex={-1}
        aria-label="Cerrar selección"
      />
      {selectedItem && (
        <div className="alternar-royal-panel" role="dialog" aria-label="Detalle">
          {selectedImage && (
            <div className="alternar-royal-panel__media" aria-hidden="true">
              <picture>
                <source srcSet={selectedImage.png} type="image/png" />
                <source srcSet={selectedImage.jpg} type="image/jpeg" />
                <source srcSet={selectedImage.jpeg} type="image/jpeg" />
                <img
                  className="alternar-royal-panel__img"
                  src={selectedImage.png}
                  alt={selectedImage.alt}
                  loading="lazy"
                />
              </picture>
            </div>
          )}
          <div className="alternar-royal-panel__title">{selectedItem.title}</div>
          <div className="alternar-royal-panel__desc">{selectedItem.description}</div>
          <div className="alternar-royal-panel__actions">
            <button type="button" className="alternar-royal-panel__btn" onClick={confirmSelected}>
              Continuar
            </button>
          </div>
          <div className="alternar-royal-panel__hint">Click fuera o ESC para cerrar</div>
        </div>
      )}
      <div className="alternar-royal-labels" aria-hidden="true">
        {imageLabels.map((label) => (
          <div key={label} className="alternar-royal-label">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
