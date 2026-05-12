import { cloneScene, normalizeScene } from './schema';
import type { ParallaxElement, ParallaxScene, RenderOptions, RenderedScene, SourceExport } from './types';

export function renderParallaxScene(
  mount: string | HTMLElement,
  sceneInput: Partial<ParallaxScene>,
  options: RenderOptions = {}
): RenderedScene {
  const mountEl = resolveMount(mount);
  const scene = normalizeScene(sceneInput);
  const root = document.createElement('div');
  const sceneEl = document.createElement('div');
  const cleanup: Array<() => void> = [];

  root.className = ['pss-bg-cover', options.className || ''].filter(Boolean).join(' ');
  root.style.setProperty('--pss-design-ratio', String(scene.design_ratio));
  sceneEl.className = 'pss-scene';
  sceneEl.style.backgroundColor = scene.scene.background_color;
  sceneEl.dataset.relativeInput = String(scene.scene.relative_input);
  sceneEl.dataset.scalarX = String(scene.scene.scalar_x);
  sceneEl.dataset.scalarY = String(scene.scene.scalar_y);
  sceneEl.dataset.frictionX = String(scene.scene.friction_x);
  sceneEl.dataset.frictionY = String(scene.scene.friction_y);
  sceneEl.dataset.invertX = String(scene.scene.invert_x);
  sceneEl.dataset.invertY = String(scene.scene.invert_y);

  scene.layers.forEach((layer, layerIndex) => {
    if (layer.hidden) return;
    const layerEl = document.createElement('div');
    layerEl.className = 'pss-layer';
    layerEl.dataset.depth = String(layer.depth);
    layerEl.dataset.layerIndex = String(layerIndex);
    layerEl.style.left = `${scene.layer_offset.left || 0}px`;
    layerEl.style.top = `${scene.layer_offset.top || 0}px`;

    layer.elements.forEach((element, elementIndex) => {
      if (element.hidden) return;
      layerEl.appendChild(createElementNode(element, [layerIndex, elementIndex]));
    });

    sceneEl.appendChild(layerEl);
  });

  root.appendChild(sceneEl);
  mountEl.replaceChildren(root);

  if (scene.type === 'parallax' && options.usePointerEngine !== false) {
    cleanup.push(createPointerEngine(sceneEl, scene));
  }

  return {
    root,
    scene: sceneEl,
    destroy() {
      cleanup.forEach((fn) => fn());
      root.remove();
    }
  };
}

export function createPointerEngine(sceneEl: HTMLElement, sceneInput: ParallaxScene): () => void {
  const scene = cloneScene(sceneInput);
  const layers = Array.from(sceneEl.querySelectorAll<HTMLElement>('.pss-layer'));
  let raf = 0;
  let active = true;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  const scalarX = scene.scene.scalar_x || 10;
  const scalarY = scene.scene.scalar_y || 10;
  const frictionX = scene.scene.friction_x || 0.12;
  const frictionY = scene.scene.friction_y || 0.12;
  const invertX = scene.scene.invert_x ? -1 : 1;
  const invertY = scene.scene.invert_y ? -1 : 1;

  function setTarget(clientX: number, clientY: number) {
    const rect = sceneEl.getBoundingClientRect();
    const nx = ((clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
    const ny = ((clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    targetX = nx * scalarX * invertX;
    targetY = ny * scalarY * invertY;
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function onPointerMove(event: PointerEvent) {
    setTarget(event.clientX, event.clientY);
  }

  function tick() {
    if (!active) return;
    currentX += (targetX - currentX) * frictionX;
    currentY += (targetY - currentY) * frictionY;
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0);
      layer.style.transform = `translate3d(${(currentX * depth).toFixed(2)}px, ${(currentY * depth).toFixed(2)}px, 0)`;
    });

    if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });

  return () => {
    active = false;
    window.removeEventListener('pointermove', onPointerMove);
    if (raf) cancelAnimationFrame(raf);
  };
}

export function getSourceExport(sceneInput: ParallaxScene): SourceExport {
  const scene = normalizeScene(sceneInput);
  const json = JSON.stringify(scene, null, 2);
  const escapedJson = json.replace(/</g, '\\u003c');

  return {
    json,
    html: `<div id="parallax-scene"></div>`,
    css: `@import "parallax-scene-studio/style.css";`,
    js: [
      `import { renderParallaxScene } from 'parallax-scene-studio';`,
      `import 'parallax-scene-studio/style.css';`,
      ``,
      `const scene = ${escapedJson};`,
      ``,
      `renderParallaxScene('#parallax-scene', scene);`
    ].join('\n')
  };
}

function createElementNode(element: ParallaxElement, indexPath: number[]): HTMLElement {
  const el = document.createElement(element.tag === 'img' && !element.children?.length ? 'img' : 'div');
  el.className = ['pss-element', element.animation ? `pss-anim-${element.animation}` : '', element.class || '']
    .filter(Boolean)
    .join(' ');

  el.dataset.indexPath = indexPath.join('.');
  el.style.position = 'absolute';
  el.style.left = safeCssValue(element.x);
  el.style.top = safeCssValue(element.y);
  el.style.width = safeCssValue(element.width);
  el.style.height = safeCssValue(element.height);
  el.style.backgroundSize = safeCssValue(element.bgSize || 'contain');
  el.style.backgroundPosition = safeCssValue(element.bgPosition || 'center');
  el.style.backgroundRepeat = safeCssValue(element.bgRepeat || 'no-repeat');
  el.style.opacity = String(element.opacity ?? 1);
  el.style.animationDuration = safeCssValue(element.animation_duration || '4s');

  const scaleX = (element.flipX ? -1 : 1) * (element.scale || 1);
  const scaleY = (element.flipY ? -1 : 1) * (element.scale || 1);
  el.style.rotate = element.rotation ? `${Number(element.rotation)}deg` : '';
  el.style.scale = scaleX !== 1 || scaleY !== 1 ? `${scaleX} ${scaleY}` : '';

  if (el instanceof HTMLImageElement) {
    el.src = safeUrl(element.image);
    el.alt = element.name || '';
    el.draggable = false;
  } else {
    el.style.backgroundImage = `url("${safeUrl(element.image)}")`;
  }

  if (element.children?.length) {
    el.style.position = 'absolute';
    element.children.forEach((child, childIndex) => {
      if (!child.hidden) el.appendChild(createElementNode(child, [...indexPath, childIndex]));
    });
  }

  return el;
}

function resolveMount(mount: string | HTMLElement): HTMLElement {
  const el = typeof mount === 'string' ? document.querySelector<HTMLElement>(mount) : mount;
  if (!el) throw new Error('Parallax Scene Studio mount element was not found.');
  return el;
}

function safeCssValue(value: string): string {
  return String(value).replace(/[<>"'{}]|\/\*|\*\/|<\/|expression\s*\(/gi, '');
}

function safeUrl(value: string): string {
  const url = String(value || '').trim();
  if (/^(https?:\/\/|\/|\.\/|\.\.\/|blob:|data:image\/)/i.test(url)) return url.replace(/"/g, '%22');
  return '';
}

