import { type LabsEditorShellOptions } from './labs-template';
import type { ParallaxScene, UploadContext, UploadResult, SaveContext, SaveResult } from './types';
import './labs/parallax.scss';
import './labs/theme-editor.scss';
export interface LabsThemeEditorOptions extends LabsEditorShellOptions {
    mount: string | HTMLElement;
    value?: Partial<ParallaxScene>;
    /**
     * When `true` (default), suppresses `history.replaceState` calls that would
     * push `/theme/editor?edit=…` URLs into the host page's history stack.
     * Set to `false` if the host page manages its own URL state.
     */
    preservePageUrl?: boolean;
    /**
     * Called whenever the scene changes (debounced by the editor, ~500 ms).
     * Use this for auto-save drafts or live previews.
     *
     * Labs: does not map to a network call — used for IndexedDB draft persistence.
     */
    onChange?: (scene: ParallaxScene) => void;
    /**
     * Called on Save / Save & Apply / Save, Apply & Exit.
     *
     * Persist the scene and return a platform-assigned `theme_id`.
     * The returned ID is passed to `onApply` when the user saves and applies in one action.
     *
     * Returning `void` (or no return value) is accepted for demos — the editor
     * falls back to the theme ID already set in `value.theme_id` or `"local-demo"`.
     *
     * Labs:
     *   POST /api/app/user_themes
     *   body: { config: JSON, theme_id?: string, thumbnail_url?: string }
     *   response: { result: "success", theme_id: string }
     */
    onSave?: (scene: ParallaxScene, context: SaveContext) => SaveResult | void | Promise<SaveResult | void>;
    /**
     * Called after a successful save when the action was "Save & Apply" or
     * "Save, Apply & Exit". Should make `themeId` the active theme for the
     * current user (i.e. apply it to their dashboard/lab background).
     *
     * Called with the `theme_id` returned by `onSave`. If `onSave` did not
     * return a `theme_id`, this will not be called.
     *
     * Labs:
     *   GET /api/app/set_theme?id=custom:{themeId}
     *   response: { result: "success" }
     */
    onApply?: (themeId: string) => void | Promise<void>;
    /**
     * Called when the user clicks "← Exit editor" or "Discard".
     * Navigate the host page away from the editor.
     *
     * Labs: `window.location.href = '/dashboard'`
     *
     * Note: the built-in editor source also calls `window.location.href`
     * directly after some actions. For a fully sandboxed embedding, intercept
     * navigation at the host router level in addition to this callback.
     */
    onExit?: () => void;
    /**
     * Called when the editor saves UI preferences (e.g. panel layout positions
     * after the user drags a panel or clicks "Reset panels").
     *
     * Labs:
     *   POST /api/app/preferences
     *   body: { preference_id: string, value: string }   (value is a JSON string)
     *   response: { result: "success" }
     */
    onSavePreferences?: (preferenceId: string, value: string) => void | Promise<void>;
    /**
     * Called when the user clicks a file in the layer panel's image-pick flow.
     * Should return an HTML string that will be injected into the picker dialog.
     *
     * Labs:
     *   GET /api/app/user_files?mode=picker&filter=theme
     *   response: HTML string (list of user-uploaded assets)
     */
    getAssetPickerHtml?: () => string | Promise<string>;
    /**
     * Called when the user opens the help dialog (?).
     * Should return an HTML string rendered inside the xlarge dialog.
     *
     * Labs:
     *   GET /api/app/theme_help
     *   response: HTML string (editor documentation)
     */
    getHelpHtml?: () => string | Promise<string>;
    /**
     * Notification handler — called for all editor toasts/alerts.
     * If omitted, a lightweight fallback toast is rendered in the host page.
     *
     * Labs: routed to the platform's `new Toast(...)` component.
     */
    notify?: (message: string, level?: 'info' | 'success' | 'warning' | 'error') => void;
    /**
     * Called when a file is dropped onto a layer or selected via the upload
     * input. Should upload the file to persistent storage and return its URL.
     *
     * If omitted, files are held in memory via `URL.createObjectURL` for the
     * duration of the session (suitable for demos).
     *
     * Labs:
     *   POST /api/app/user_theme_upload  (multipart: file + theme_id)
     *   response: { result: "success", url: string }
     */
    onUpload?: (file: File, context: UploadContext) => UploadResult | Promise<UploadResult>;
}
export declare class LabsThemeEditor {
    private readonly mount;
    private readonly options;
    private readonly objectUrls;
    private scene;
    private root?;
    private restoreEndpoints?;
    private restoreGlobals?;
    constructor(options: LabsThemeEditorOptions);
    getValue(): ParallaxScene;
    destroy(): void;
    private renderShell;
}
declare global {
    interface Window {
        __themeEditorConfig?: ParallaxScene;
        __themeEditorMode?: string;
    }
}
//# sourceMappingURL=labs-editor.d.ts.map