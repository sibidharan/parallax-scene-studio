export type ParallaxSceneType = 'parallax' | 'static';

export type ParallaxAnimation =
  | ''
  | 'pulse'
  | 'swing'
  | 'float'
  | 'drift'
  | 'bob'
  | 'spin'
  | 'bounce'
  | 'flicker'
  | 'sway'
  | 'zoom'
  | 'shake'
  | 'glow'
  | 'wave'
  | 'rise'
  | 'rock'
  | 'fade';

export interface ParallaxSceneSettings {
  background_color: string;
  relative_input: boolean;
  scalar_x: number;
  scalar_y: number;
  friction_x: number;
  friction_y: number;
  invert_x: boolean;
  invert_y: boolean;
  filter_dark?: SceneFilter;
  filter_light?: SceneFilter;
}

export interface SceneFilter {
  saturate: number;
  brightness: number;
  contrast: number;
}

export interface SceneBlur {
  dark: string;
  light: string;
}

export interface LayerOffset {
  left: number;
  top: number;
}

export interface ParallaxElement {
  image: string;
  x: string;
  y: string;
  width: string;
  height: string;
  name?: string;
  css?: string;
  bgSize?: string;
  bgPosition?: string;
  bgRepeat?: string;
  opacity?: number;
  animation?: ParallaxAnimation;
  animation_duration?: string;
  scale?: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  hidden?: boolean;
  locked?: boolean;
  tag?: 'div' | 'img';
  class?: string;
  children?: ParallaxElement[];
}

export interface ParallaxLayer {
  name: string;
  depth: number;
  hidden?: boolean;
  locked?: boolean;
  elements: ParallaxElement[];
}

export interface ParallaxScene {
  schema_version: 1;
  name: string;
  type: ParallaxSceneType;
  mode?: string;
  accent?: string;
  scene: ParallaxSceneSettings;
  blur: SceneBlur;
  layer_offset: LayerOffset;
  design_ratio: number;
  layers: ParallaxLayer[];
  thumbnail_url?: string;
  forked_from?: string | null;
}

export interface RenderOptions {
  className?: string;
  interactive?: boolean;
  usePointerEngine?: boolean;
}

export interface RenderedScene {
  root: HTMLElement;
  scene: HTMLElement;
  destroy(): void;
}

export interface SourceExport {
  json: string;
  html: string;
  css: string;
  js: string;
}

export interface UploadContext {
  scene: ParallaxScene;
  target: 'layer' | 'element' | 'child' | 'thumbnail';
  layerIndex?: number;
  elementIndex?: number;
  childIndex?: number;
}

export type UploadResult = string | { url: string; id?: string; [key: string]: unknown };

/**
 * Context passed to {@link LabsThemeEditorOptions.onSave}.
 * Describes why the save was triggered.
 */
export interface SaveContext {
  /** True when triggered by "Save & Apply" or "Save, Apply & Exit". */
  apply: boolean;
  /** True when triggered by "Save, Apply & Exit" (also sets `apply`). */
  exit: boolean;
  /** The existing theme ID when editing a saved theme; `undefined` for a brand-new theme. */
  themeId?: string;
  /** Base64 data-URI thumbnail captured via html2canvas immediately before the save call. `undefined` if no thumbnail was taken. */
  thumbnailDataUri?: string;
}

/**
 * Expected return value from {@link LabsThemeEditorOptions.onSave}.
 * The `theme_id` is used for all subsequent `onApply`, `onSubmitForReview`,
 * and admin-review calls.
 */
export interface SaveResult {
  /** Platform-assigned ID for the saved theme. */
  theme_id: string;
}


export interface StudioOptions {
  mount: string | HTMLElement;
  value?: Partial<ParallaxScene>;
  readOnly?: boolean;
  showSourceCard?: boolean;
  sourceCardDefaultOpen?: boolean;
  onChange?: (scene: ParallaxScene) => void;
  onSave?: (scene: ParallaxScene) => void | Promise<void>;
  onUpload?: (file: File, context: UploadContext) => UploadResult | Promise<UploadResult>;
  notify?: (message: string, level?: 'info' | 'success' | 'warning' | 'error') => void;
  confirm?: (message: string) => boolean | Promise<boolean>;
}

