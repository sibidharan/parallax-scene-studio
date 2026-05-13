/// <reference path="./vendor.d.ts" />

import $ from 'jquery';
import Parallax from 'parallax-js';
import Sortable from 'sortablejs';
import html2canvas from 'html2canvas';
import { normalizeScene } from './schema';
import { renderLabsEditorShell, type LabsEditorShellOptions } from './labs-template';
import type {
  ParallaxScene,
  UploadContext,
  UploadResult,
  SaveContext,
  SaveResult
} from './types';
import labsThemeEditorSource from './labs/theme-editor.js?raw';
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
  onSave?: (
    scene: ParallaxScene,
    context: SaveContext
  ) => SaveResult | void | Promise<SaveResult | void>;

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

type JQueryLike = JQueryStatic & Record<'ajax' | 'post' | 'get', (...args: unknown[]) => unknown>;

type RestoreFn = () => void;

export class LabsThemeEditor {
  private readonly mount: HTMLElement;
  private readonly options: LabsThemeEditorOptions;
  private readonly objectUrls: string[] = [];
  private scene: ParallaxScene;
  private root?: HTMLElement;
  private restoreEndpoints?: RestoreFn;
  private restoreGlobals?: RestoreFn;

  constructor(options: LabsThemeEditorOptions) {
    this.options = options;
    this.mount = resolveMount(options.mount);
    this.scene = normalizeScene(options.value);
    this.renderShell();
    this.restoreGlobals = installGlobals(options);
    this.restoreEndpoints = installEndpointAdapters(options, this.objectUrls, (scene) => {
      this.scene = normalizeScene(scene);
    });
    runLabsEditorSource();
  }

  getValue(): ParallaxScene {
    return JSON.parse(JSON.stringify(this.scene)) as ParallaxScene;
  }

  destroy(): void {
    const jq = $ as JQueryLike;
    $(document).off('.te .tecanvas .tecursor .tedrag .teresize .terotate .tepanel');
    jq(document).off('click', '.te-layer-row');
    jq(document).off('click', '.te-child-row');
    jq(document).off('click', '.te-grandchild-row');
    jq(document).off('click', '.te-expand-toggle');
    this.restoreEndpoints?.();
    this.restoreGlobals?.();
    this.root?.remove();
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.objectUrls.length = 0;
  }

  private renderShell(): void {
    const root = document.createElement('div');
    root.className = 'pss-labs-editor-host';
    root.innerHTML = renderLabsEditorShell(this.scene, this.options);
    this.mount.replaceChildren(root);
    this.root = root;
    window.__themeEditorConfig = this.scene;
    window.__themeEditorMode = this.options.mode || 'new';
    if (!document.documentElement.getAttribute('data-coreui-theme')) {
      document.documentElement.setAttribute('data-coreui-theme', 'dark');
    }
    document.body.classList.add('hwa-enabled');
  }
}

function installGlobals(options: LabsThemeEditorOptions): RestoreFn {
  const win = window as LabsEditorWindow;
  const previous = {
    $: win.$,
    jQuery: win.jQuery,
    Parallax: win.Parallax,
    Sortable: win.Sortable,
    html2canvas: win.html2canvas,
    coreui: win.coreui,
    Dialog: win.Dialog,
    Toast: win.Toast
  };
  const previousReplaceState = window.history.replaceState.bind(window.history);

  win.$ = $;
  win.jQuery = $;
  win.Parallax = Parallax;
  win.Sortable = Sortable;
  win.html2canvas = html2canvas;
  win.coreui = previous.coreui || createCoreUiStub();
  win.Dialog = createDialogClass();
  win.Toast = createToastClass(options);
  if (options.preservePageUrl !== false) {
    window.history.replaceState = function replaceState(state: unknown, unused: string, url?: string | URL | null): void {
      if (typeof url === 'string' && url.startsWith('/theme/editor?edit=')) return;
      previousReplaceState(state, unused, url);
    };
  }

  // Intercept exit/discard navigation.
  // The built-in editor source calls `window.location.href = '/dashboard'`.
  // We cannot override window.location directly, but we can catch it via
  // the beforeunload event for the onExit callback.
  if (options.onExit) {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      options.onExit?.();
    };
    window.addEventListener('beforeunload', onBeforeUnload, { capture: true });
    (previous as Record<string, unknown>).__exitListener = onBeforeUnload;
  }

  return () => {
    win.$ = previous.$;
    win.jQuery = previous.jQuery;
    win.Parallax = previous.Parallax;
    win.Sortable = previous.Sortable;
    win.html2canvas = previous.html2canvas;
    win.coreui = previous.coreui;
    win.Dialog = previous.Dialog;
    win.Toast = previous.Toast;
    window.history.replaceState = previousReplaceState;
    const exitListener = (previous as Record<string, unknown>).__exitListener;
    if (typeof exitListener === 'function') {
      window.removeEventListener('beforeunload', exitListener as EventListener, { capture: true });
    }
  };
}

function installEndpointAdapters(
  options: LabsThemeEditorOptions,
  objectUrls: string[],
  setScene: (scene: ParallaxScene) => void
): RestoreFn {
  const jq = $ as JQueryLike;
  const originalAjax = jq.ajax.bind(jq);
  const originalPost = jq.post.bind(jq);
  const originalGet = jq.get.bind(jq);
  const mutableJq = jq as unknown as Record<'ajax' | 'post' | 'get', (...args: unknown[]) => unknown>;

  mutableJq.post = function patchedPost(url: unknown, data?: unknown, success?: unknown, dataType?: unknown): unknown {
    if (typeof url !== 'string') return originalPost(url, data, success, dataType);
    const handled = handlePost(url, data, success, options, setScene);
    return handled || originalPost(url, data, success, dataType);
  };

  mutableJq.get = function patchedGet(url: unknown, data?: unknown, success?: unknown, dataType?: unknown): unknown {
    if (typeof url !== 'string') return originalGet(url, data, success, dataType);
    const handled = handleGet(url, data, success, options);
    return handled || originalGet(url, data, success, dataType);
  };

  mutableJq.ajax = function patchedAjax(request: unknown): unknown {
    if (typeof request !== 'object' || request === null) return originalAjax(request);
    const settings = request as JQueryAjaxSettings;
    if (settings.url === '/api/app/user_theme_upload') {
      return handleUpload(settings, options, objectUrls);
    }
    return originalAjax(request);
  };

  return () => {
    mutableJq.ajax = originalAjax;
    mutableJq.post = originalPost;
    mutableJq.get = originalGet;
  };
}

function handlePost(
  url: string,
  data: unknown,
  success: unknown,
  options: LabsThemeEditorOptions,
  setScene: (scene: ParallaxScene) => void
): unknown {
  const payload = data as Record<string, unknown> | undefined;

  // ── Preferences (panel layout, UI state) ────────────────────────────────
  if (url === '/api/app/preferences') {
    const preferenceId = String(payload?.preference_id || '');
    const value = String(payload?.value ?? '');
    const promise = Promise.resolve(options.onSavePreferences?.(preferenceId, value))
      .then(() => ({ result: 'success' }));
    return jqResult(promise, success);
  }

  // ── Theme slot unlock — platform-specific, silently succeed ─────────────
  // Extend LabsThemeEditor in your platform adapter to handle this.
  if (url === '/api/app/user_theme_slot') {
    return jqResult(Promise.resolve({ result: 'success', message: 'Theme slot unlocked.' }), success);
  }

  // ── Admin review — platform-specific, silently succeed ──────────────────
  // Extend LabsThemeEditor in your platform adapter to handle this.
  if (url === '/api/admin/themes/review') {
    return jqResult(Promise.resolve({ result: 'success', message: 'Review action saved.' }), success);
  }

  // ── Theme save / submit ──────────────────────────────────────────────────
  if (url === '/api/app/user_themes') {

    // Submit for review — platform-specific, silently succeed.
    // Extend LabsThemeEditor in your platform adapter to handle this.
    if (payload?._method === 'SUBMIT') {
      return jqResult(Promise.resolve({ result: 'success' }), success);
    }

    // Save (new / edit / save+apply / save+apply+exit)
    const config = typeof payload?.config === 'string'
      ? JSON.parse(payload.config) as ParallaxScene
      : null;
    const scene = normalizeScene(config || options.value);

    const saveContext: SaveContext = {
      apply: String(payload?.action) === 'apply' || String(payload?.action) === 'exit',
      exit: String(payload?.action) === 'exit',
      themeId: (payload?.theme_id as string | undefined)
        || (scene as ParallaxScene & { theme_id?: string }).theme_id,
      thumbnailDataUri: payload?.thumbnail_url as string | undefined
    };

    const promise = Promise.resolve(options.onSave?.(scene, saveContext))
      .then((result) => {
        const theme_id = (result as SaveResult | undefined)?.theme_id
          || saveContext.themeId
          || 'local-demo';
        setScene(scene);
        options.onChange?.(scene);
        // Fire onApply if the save action requested it
        if (saveContext.apply && options.onApply) {
          Promise.resolve(options.onApply(theme_id)).catch(() => undefined);
        }
        return { result: 'success', theme_id };
      });
    return jqResult(promise, success);
  }

  return null;
}

function handleGet(
  url: string,
  data: unknown,
  success: unknown,
  options: LabsThemeEditorOptions
): unknown {
  // ── Asset / file picker ──────────────────────────────────────────────────
  if (url.startsWith('/api/app/user_files')) {
    const promise = Promise.resolve(options.getAssetPickerHtml?.() || defaultAssetPickerHtml());
    return jqResult(promise, success);
  }

  // ── Help dialog ──────────────────────────────────────────────────────────
  if (url === '/api/app/theme_help') {
    const promise = Promise.resolve(options.getHelpHtml?.() || defaultHelpHtml());
    return jqResult(promise, success);
  }

  // ── Apply theme (set as active on the platform) ──────────────────────────
  // Labs: GET /api/app/set_theme?id=custom:{themeId}
  if (url.startsWith('/api/app/set_theme')) {
    const themeId = new URL(url, window.location.origin).searchParams.get('id') || '';
    const promise = Promise.resolve(options.onApply?.(themeId))
      .then(() => ({ result: 'success' }));
    return jqResult(promise, success);
  }

  return null;
}

function handleUpload(settings: JQueryAjaxSettings, options: LabsThemeEditorOptions, objectUrls: string[]): unknown {
  const form = settings.data instanceof FormData ? settings.data : null;
  const file = form?.get('file');
  const promise = file instanceof File
    ? uploadFile(file, options, objectUrls)
    : Promise.reject(new Error('No file uploaded.'));

  promise
    .then((payload) => {
      callJqueryCallback(settings.success, payload, 'success', undefined as unknown as JQuery.jqXHR);
      callJqueryCallback(settings.complete, undefined as unknown as JQuery.jqXHR, 'success');
      return payload;
    })
    .catch((error: Error) => {
      callJqueryCallback(settings.error, undefined as unknown as JQuery.jqXHR, 'error', error.message);
      callJqueryCallback(settings.complete, undefined as unknown as JQuery.jqXHR, 'error');
    });

  return jqResult(promise);
}

async function uploadFile(file: File, options: LabsThemeEditorOptions, objectUrls: string[]): Promise<Record<string, unknown>> {
  if (options.onUpload) {
    const result = await options.onUpload(file, { scene: normalizeScene(options.value), target: 'layer' });
    const url = typeof result === 'string' ? result : result.url;
    return { result: 'success', url };
  }
  const url = URL.createObjectURL(file);
  objectUrls.push(url);
  return { result: 'success', url };
}

function jqResult<T>(promise: Promise<T>, success?: unknown): JQueryPromiseLike<T> {
  if (typeof success === 'function') {
    promise.then((value) => { (success as (value: T) => void)(value); });
  }
  const api: JQueryPromiseLike<T> = {
    done(callback) {
      promise.then(callback);
      return api;
    },
    fail(callback) {
      promise.catch(callback);
      return api;
    },
    always(callback) {
      promise.finally(callback);
      return api;
    },
    then(onFulfilled, onRejected) {
      return promise.then(onFulfilled, onRejected);
    }
  };
  return api;
}

function callJqueryCallback(callback: unknown, ...args: unknown[]): void {
  if (Array.isArray(callback)) {
    callback.forEach((fn) => callJqueryCallback(fn, ...args));
    return;
  }
  if (typeof callback === 'function') {
    (callback as (...values: unknown[]) => void)(...args);
  }
}

function runLabsEditorSource(): void {
  const runner = new Function(
    'window',
    'document',
    '$',
    'jQuery',
    'Parallax',
    'Sortable',
    'html2canvas',
    'coreui',
    'Dialog',
    'Toast',
    `${labsThemeEditorSource}\n//# sourceURL=parallax-scene-studio/labs-theme-editor.js`
  ) as LabsSourceRunner;

  const win = window as LabsEditorWindow;
  runner(window, document, $, $, Parallax, Sortable, html2canvas, win.coreui, win.Dialog, win.Toast);
}

function createCoreUiStub(): CoreUiLike {
  class Tooltip {
    static getInstance(): null {
      return null;
    }
    constructor(_element: Element, _options?: Record<string, unknown>) {}
    dispose(): void {}
  }
  return { Tooltip };
}

function createToastClass(options: LabsThemeEditorOptions): ToastConstructor {
  return class Toast {
    constructor(private title: string, _time: string, private message: string, private toastOptions?: { autohide?: boolean; delay?: number }) {}
    show(): void {
      options.notify?.(stripHtml(this.message || this.title), inferToastLevel(this.title));
      const toast = document.createElement('div');
      toast.className = 'pss-labs-toast';
      toast.innerHTML = `<strong>${escapeHtml(this.title)}</strong><span>${this.message}</span>`;
      document.body.appendChild(toast);
      if (this.toastOptions?.autohide !== false) {
        window.setTimeout(() => toast.remove(), this.toastOptions?.delay || 2400);
      }
    }
  };
}

function createDialogClass(): DialogConstructor {
  return class Dialog {
    cloneId = `pss-labs-dialog-${Math.random().toString(36).slice(2)}`;
    private buttons: DialogButton[] = [];
    private events: DialogEvent[] = [];
    constructor(private title: string, private body: string, private size: string = 'medium') {}
    setButtons(buttons: DialogButton[]): void {
      this.buttons = buttons;
    }
    setEvents(events: DialogEvent[]): void {
      this.events = events;
    }
    show(): void {
      const modal = document.createElement('div');
      modal.id = this.cloneId;
      modal.className = `modal pss-labs-dialog pss-labs-dialog-${this.size}`;
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">${escapeHtml(this.title)}</h5><button type="button" class="btn-close" data-dismiss="dialog">×</button></div>
            <div class="modal-body">${this.body}</div>
            <div class="modal-footer"></div>
          </div>
        </div>`;
      const footer = modal.querySelector<HTMLElement>('.modal-footer');
      this.buttons.forEach((button) => {
        const element = document.createElement('button');
        element.type = 'button';
        element.className = button.class || 'btn btn-secondary';
        element.textContent = button.name;
        element.addEventListener('click', () => {
          button.onClick?.();
          if (button.dismiss) this.hide();
        });
        footer?.appendChild(element);
      });
      modal.querySelector('[data-dismiss="dialog"]')?.addEventListener('click', () => this.hide());
      document.body.appendChild(modal);
      this.events
        .filter((event) => event.action === 'shown')
        .forEach((event) => event.callback({ data: { modal: `#${this.cloneId}` } }));
    }
    hide(): void {
      document.getElementById(this.cloneId)?.remove();
    }
  };
}

function defaultAssetPickerHtml(): string {
  return '<div class="text-center py-3">No asset picker is configured for this demo. Use upload instead.</div>';
}

function defaultHelpHtml(): string {
  return '<div class="te-help-dialog"><div class="te-help-body"><div class="te-help-section active"><div class="te-help-text"><p>Select a layer or element, then drag, resize, rotate, and adjust properties from the panels.</p></div></div></div></div>';
}

function resolveMount(mount: string | HTMLElement): HTMLElement {
  const element = typeof mount === 'string' ? document.querySelector<HTMLElement>(mount) : mount;
  if (!element) throw new Error('Parallax Scene Studio mount element was not found.');
  return element;
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stripHtml(value: string): string {
  const div = document.createElement('div');
  div.innerHTML = value;
  return div.textContent || div.innerText || '';
}

function inferToastLevel(title: string): 'info' | 'success' | 'warning' | 'error' {
  const lower = title.toLowerCase();
  if (lower.includes('error')) return 'error';
  if (lower.includes('warn')) return 'warning';
  if (lower.includes('saved') || lower.includes('success')) return 'success';
  return 'info';
}

interface LabsEditorWindow extends Window {
  $?: JQueryStatic;
  jQuery?: JQueryStatic;
  Parallax?: typeof Parallax;
  Sortable?: typeof Sortable;
  html2canvas?: typeof html2canvas;
  coreui?: CoreUiLike;
  Dialog?: DialogConstructor;
  Toast?: ToastConstructor;
  __themeEditorConfig?: ParallaxScene;
  __themeEditorMode?: string;
}

interface CoreUiLike {
  Tooltip?: {
    new(element: Element, options?: Record<string, unknown>): { dispose(): void };
    getInstance?(element: Element): { dispose(): void } | null;
  };
}

interface DialogButton {
  name: string;
  class?: string;
  dismiss?: boolean;
  onClick?: () => void;
}

interface DialogEvent {
  action: string;
  callback: (event: { data: { modal: string } }) => void;
}

interface DialogConstructor {
  new(title: string, body: string, size?: string): {
    cloneId: string;
    setButtons(buttons: DialogButton[]): void;
    setEvents(events: DialogEvent[]): void;
    show(): void;
    hide(): void;
  };
}

interface ToastConstructor {
  new(title: string, time: string, message: string, options?: { autohide?: boolean; delay?: number }): { show(): void };
}

interface JQueryPromiseLike<T> {
  done(callback: (value: T) => void): JQueryPromiseLike<T>;
  fail(callback: (error: unknown) => void): JQueryPromiseLike<T>;
  always(callback: () => void): JQueryPromiseLike<T>;
  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2>;
}

type LabsSourceRunner = (
  windowValue: Window,
  documentValue: Document,
  jqueryDollar: JQueryStatic,
  jquery: JQueryStatic,
  parallax: typeof Parallax,
  sortable: typeof Sortable,
  canvas: typeof html2canvas,
  coreui: CoreUiLike | undefined,
  dialog: DialogConstructor | undefined,
  toast: ToastConstructor | undefined
) => void;

declare global {
  interface Window {
    __themeEditorConfig?: ParallaxScene;
    __themeEditorMode?: string;
  }
}
