import type { ParallaxScene, RenderOptions, RenderedScene, SourceExport } from './types';
export declare function renderParallaxScene(mount: string | HTMLElement, sceneInput: Partial<ParallaxScene>, options?: RenderOptions): RenderedScene;
export declare function createPointerEngine(sceneEl: HTMLElement, sceneInput: ParallaxScene): () => void;
export declare function getSourceExport(sceneInput: ParallaxScene): SourceExport;
//# sourceMappingURL=runtime.d.ts.map