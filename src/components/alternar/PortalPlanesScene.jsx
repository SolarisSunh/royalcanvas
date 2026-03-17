/**
 * Escena Three.js: 3 planos tipo portal con esquinas redondeadas (SDF)
 * y parallax con el ratón. Copiado de AlternarRoyalANormal (threejs-portal-planes-with-matcaps).
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BOX_H = 1.4;
const BOX_W = 1;
// Reduce plane size so images feel "farther" without changing camera perspective
const PLANE_SCALE = 0.65;

function createRoundedPortalPhotoPlane(geometry, photoTexture) {
  const material = new THREE.MeshMatcapMaterial({
    matcap: photoTexture,
    transparent: true,
  });

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
            #include <common>
            varying vec4 vPosition;
            varying vec2 vUv;
        `
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <fog_vertex>',
      `
              #include <fog_vertex>
              vPosition = mvPosition;
              vUv = uv;
          `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
        #include <common>
        varying vec4 vPosition;
        varying vec2 vUv;
        float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
            return length(max(abs(CenterPosition)-Size+Radius,0.0))-Radius;
          }
        `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
        #include <dithering_fragment>
        vec2 size = vec2(1.0, 1.0);
        float edgeSoftness  = 0.001;
        float radius = 0.08;
        float distance  = roundedBoxSDF(vUv.xy - (size/2.0), size/2.0, radius);
        float smoothedAlpha =  1.0-smoothstep(0.0, edgeSoftness * 2.0,distance);
        gl_FragColor = vec4(outgoingLight, smoothedAlpha);
        `
    );
  };

  return new THREE.Mesh(geometry, material);
}

export function PortalPlanesScene({ imageUrls, onSelect }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !imageUrls || imageUrls.length < 3) return;

    let cancelled = false;
    let width = container.clientWidth;
    let height = container.clientHeight;
    if (width <= 0 || height <= 0) {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    const planeGeometry = new THREE.PlaneGeometry(BOX_W * PLANE_SCALE, BOX_H * PLANE_SCALE);
    const loader = new THREE.TextureLoader();
    const fallbackUrls = [
      'https://assets.codepen.io/4201020/city2.png?format=auto',
      'https://assets.codepen.io/4201020/shopp-e-1731594468645280783813006762.png',
      'https://assets.codepen.io/4201020/shopp-e-1731593813681771088199459824.png',
    ];
    const textures = imageUrls.slice(0, 3).map((urlOrCandidates, i) => {
      const candidates = Array.isArray(urlOrCandidates) ? urlOrCandidates : [urlOrCandidates];
      const allCandidates = [...candidates, fallbackUrls[i]];

      // Start with a 1x1 texture (will be replaced once loaded)
      const placeholder = new THREE.Texture();
      placeholder.needsUpdate = true;

      const loadAt = (idx) => {
        const url = allCandidates[idx];
        if (!url) return;
        loader.load(
          url,
          (tex) => {
            placeholder.image = tex.image;
            placeholder.needsUpdate = true;
          },
          undefined,
          () => {
            loadAt(idx + 1);
          }
        );
      };

      loadAt(0);

      const t = placeholder;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(0.1, 0.1);
      return t;
    });

    const planeGroup = new THREE.Group();

    const photoPlane01 = createRoundedPortalPhotoPlane(planeGeometry.clone(), textures[0]);
    photoPlane01.position.set(-1, 0, 1);
    photoPlane01.rotation.y = Math.PI * 0.1;
    photoPlane01.name = 'plane0';
    planeGroup.add(photoPlane01);

    const photoPlane02 = createRoundedPortalPhotoPlane(planeGeometry.clone(), textures[1]);
    photoPlane02.position.set(0, 0, 0.5);
    photoPlane02.name = 'plane1';
    planeGroup.add(photoPlane02);

    const photoPlane03 = createRoundedPortalPhotoPlane(planeGeometry.clone(), textures[2]);
    photoPlane03.position.set(1, 0, 1);
    photoPlane03.rotation.y = Math.PI * -0.1;
    photoPlane03.name = 'plane2';
    planeGroup.add(photoPlane03);

    scene.add(planeGroup);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2();
    const pointerNdc = new THREE.Vector2();
    const xParallaxFactor = -0.3;
    const yParallaxFactor = 0.3;
    const raycaster = new THREE.Raycaster();
    const planes = [photoPlane01, photoPlane02, photoPlane03];
    const base = planes.map((p) => ({
      position: p.position.clone(),
      rotation: p.rotation.clone(),
      opacity: p.material.opacity ?? 1,
      scale: p.scale.clone(),
    }));

    let selectedIndex = -1;

    const setSelected = (idx) => {
      selectedIndex = idx;
      if (typeof onSelect === 'function') onSelect(idx);
    };

    const onClick = (event) => {
      const rect = container.getBoundingClientRect();
      pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(planes, false);
      if (hits.length) {
        const hit = hits[0].object;
        const idx = planes.indexOf(hit);
        if (idx !== -1) setSelected(idx);
        return;
      }
      // Click outside -> close selection
      if (selectedIndex !== -1) setSelected(-1);
    };

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClick);

    const clock = new THREE.Clock();
    let previousTime = 0;
    let animationId = null;

    function animate() {
      if (cancelled) return;
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      const parallaxX = mouse.x * xParallaxFactor;
      const parallaxY = mouse.y * yParallaxFactor;
      planeGroup.rotation.y += (parallaxX - planeGroup.rotation.y) * 3 * deltaTime;
      planeGroup.rotation.x += (parallaxY - planeGroup.rotation.x) * 3 * deltaTime;

      // Selection animation: move selected to center, dim others
      const target = (i) => {
        if (selectedIndex === -1) return base[i];
        if (i === selectedIndex) {
          return {
            position: new THREE.Vector3(0, 0, 0.25),
            rotation: new THREE.Euler(0, 0, 0),
            opacity: 1,
            scale: new THREE.Vector3(1.12, 1.12, 1.12),
          };
        }
        // push others outward a bit and dim
        const dir = i === 0 ? -1 : 1;
        return {
          position: new THREE.Vector3(dir * 1.35, 0, 1.5),
          rotation: base[i].rotation,
          opacity: 0.18,
          scale: base[i].scale,
        };
      };

      for (let i = 0; i < planes.length; i += 1) {
        const t = target(i);
        planes[i].position.lerp(t.position, 1 - Math.pow(0.0006, deltaTime * 60));
        planes[i].scale.lerp(t.scale, 1 - Math.pow(0.0006, deltaTime * 60));
        planes[i].rotation.x += (t.rotation.x - planes[i].rotation.x) * (1 - Math.pow(0.0006, deltaTime * 60));
        planes[i].rotation.y += (t.rotation.y - planes[i].rotation.y) * (1 - Math.pow(0.0006, deltaTime * 60));
        planes[i].rotation.z += (t.rotation.z - planes[i].rotation.z) * (1 - Math.pow(0.0006, deltaTime * 60));
        planes[i].material.opacity += (t.opacity - planes[i].material.opacity) * (1 - Math.pow(0.0006, deltaTime * 60));
      }

      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', onClick);
      if (animationId) cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      planeGeometry.dispose();
      textures.forEach((t) => t.dispose());
      planeGroup.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
    };
  }, [imageUrls]);

  return (
    <div
      ref={containerRef}
      className="portal-planes-scene"
      style={{ width: '100%', height: '100%', minHeight: '100vh' }}
    />
  );
}
