import type { ParallaxAnimation, ParallaxElement, ParallaxLayer, ParallaxScene, ParallaxSceneSettings } from './types';
export declare const allowedAnimations: ParallaxAnimation[];
export declare const defaultSceneSettings: ParallaxSceneSettings;
export declare function createDefaultScene(): ParallaxScene;
export declare function cloneScene(scene: ParallaxScene): ParallaxScene;
export declare function normalizeScene(input?: Partial<ParallaxScene>): ParallaxScene;
export declare function normalizeLayer(layer: Partial<ParallaxLayer>, index?: number): ParallaxLayer;
export declare function normalizeElement(element: Partial<ParallaxElement>): ParallaxElement;
export declare function validateScene(scene: ParallaxScene): string[];
//# sourceMappingURL=schema.d.ts.map