import type {
  ParallaxAnimation,
  ParallaxElement,
  ParallaxLayer,
  ParallaxScene,
  ParallaxSceneSettings
} from './types';

export const allowedAnimations: ParallaxAnimation[] = [
  '',
  'pulse',
  'swing',
  'float',
  'drift',
  'bob',
  'spin',
  'bounce',
  'flicker',
  'sway',
  'zoom',
  'shake',
  'glow',
  'wave',
  'rise',
  'rock',
  'fade'
];

export const defaultSceneSettings: ParallaxSceneSettings = {
  background_color: '#102336',
  relative_input: true,
  scalar_x: 10,
  scalar_y: 10,
  friction_x: 0.12,
  friction_y: 0.12,
  invert_x: true,
  invert_y: true
};

export function createDefaultScene(): ParallaxScene {
  return {
    schema_version: 1,
    name: 'Untitled Scene',
    type: 'parallax',
    mode: 'scene',
    accent: '#ff7a1a',
    scene: { ...defaultSceneSettings },
    blur: {
      dark: 'rgba(20, 25, 35, 0.92)',
      light: 'rgba(245, 248, 250, 0.92)'
    },
    layer_offset: { left: 0, top: 0 },
    design_ratio: 1.778,
    layers: []
  };
}

export function cloneScene(scene: ParallaxScene): ParallaxScene {
  return JSON.parse(JSON.stringify(scene)) as ParallaxScene;
}

export function normalizeScene(input?: Partial<ParallaxScene>): ParallaxScene {
  const base = createDefaultScene();
  if (!input) return base;

  const normalized: ParallaxScene = {
    ...base,
    ...input,
    schema_version: 1,
    type: input.type === 'static' ? 'static' : 'parallax',
    scene: {
      ...base.scene,
      ...(input.scene || {})
    },
    blur: {
      ...base.blur,
      ...(input.blur || {})
    },
    layer_offset: {
      ...base.layer_offset,
      ...(input.layer_offset || {})
    },
    design_ratio: Number(input.design_ratio || base.design_ratio),
    layers: (input.layers || []).map(normalizeLayer)
  };

  return normalized;
}

export function normalizeLayer(layer: Partial<ParallaxLayer>, index = 0): ParallaxLayer {
  return {
    name: layer.name || `Layer ${index + 1}`,
    depth: clampNumber(layer.depth, 0, 1, 0.5),
    hidden: Boolean(layer.hidden),
    locked: Boolean(layer.locked),
    elements: (layer.elements || []).map(normalizeElement)
  };
}

export function normalizeElement(element: Partial<ParallaxElement>): ParallaxElement {
  const animation = allowedAnimations.includes((element.animation || '') as ParallaxAnimation)
    ? (element.animation || '') as ParallaxAnimation
    : '';

  return {
    image: String(element.image || ''),
    x: String(element.x || '20%'),
    y: String(element.y || '20%'),
    width: String(element.width || '40%'),
    height: String(element.height || '40%'),
    name: element.name,
    css: element.css,
    bgSize: element.bgSize || 'contain',
    bgPosition: element.bgPosition || 'center',
    bgRepeat: element.bgRepeat || 'no-repeat',
    opacity: clampNumber(element.opacity, 0, 1, 1),
    animation,
    animation_duration: element.animation_duration || '4s',
    scale: clampNumber(element.scale, 0.05, 5, 1),
    rotation: clampNumber(element.rotation, -180, 180, 0),
    flipX: Boolean(element.flipX),
    flipY: Boolean(element.flipY),
    hidden: Boolean(element.hidden),
    locked: Boolean(element.locked),
    tag: element.tag === 'img' ? 'img' : 'div',
    class: element.class,
    children: (element.children || []).map(normalizeElement)
  };
}

export function validateScene(scene: ParallaxScene): string[] {
  const errors: string[] = [];
  if (!scene.name.trim()) errors.push('Scene name is required.');
  if (!scene.layers.length) errors.push('At least one layer is required.');

  scene.layers.forEach((layer, layerIndex) => {
    if (layer.depth < 0 || layer.depth > 1) {
      errors.push(`Layer ${layerIndex + 1} depth must be between 0 and 1.`);
    }
    if (!layer.elements.length) {
      errors.push(`Layer ${layerIndex + 1} has no elements.`);
    }
    layer.elements.forEach((element, elementIndex) => {
      if (!element.image) {
        errors.push(`Layer ${layerIndex + 1}, element ${elementIndex + 1} has no image.`);
      }
    });
  });

  return errors;
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

