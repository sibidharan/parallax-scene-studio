import type { ParallaxScene } from './types';
export interface LabsEditorShellOptions {
    mode?: 'new' | 'edit' | 'fork' | 'view';
    showSourceCard?: boolean;
    panelPositions?: Record<string, {
        left?: string;
        top?: string;
        width?: string;
    }>;
}
export declare function renderLabsEditorShell(scene: ParallaxScene, options?: LabsEditorShellOptions): string;
//# sourceMappingURL=labs-template.d.ts.map