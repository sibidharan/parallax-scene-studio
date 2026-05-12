/// <reference path="./vendor.d.ts" />

import $ from 'jquery';
import Parallax from 'parallax-js';
import Sortable from 'sortablejs';
import html2canvas from 'html2canvas';
import { normalizeScene } from './schema';
import { renderLabsEditorShell, type LabsEditorShellOptions } from './labs-template';
import type { ParallaxScene, UploadContext, UploadResult } from './types';
import labsThemeEditorSource from './labs/theme-editor.js?raw';
import './labs/parallax.scss';
import './labs/theme-editor.scss';

export interface LabsThemeEditorOptions extends LabsEditorShellOptions {
  mount: string | HTMLElement;
  value?: Partial<ParallaxScene>;
  preservePageUrl?: boolean;
  onChange?: (scene: ParallaxScene) => void;
  onSave?: (scene: ParallaxScene) => void | Promise<void>;
  onUpload?: (file: File, context: UploadContext) => UploadResult | Promise<UploadResult>;
  notify?: (message: string, level?: 'info' | 'success' | 'warning' | 'error') => void;
  getAssetPickerHtml?: () => string | Promise<string>;
  getHelpHtml?: () => string | Promise<string>;
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
  if (url === '/api/app/preferences') return jqResult(Promise.resolve({ result: 'success' }), success);
  if (url === '/api/app/set_theme') return jqResult(Promise.resolve({ result: 'success' }), success);
  if (url === '/api/app/user_theme_slot') return jqResult(Promise.resolve({ result: 'success', message: 'Theme slot unlocked.' }), success);
  if (url === '/api/admin/themes/review') return jqResult(Promise.resolve({ result: 'success', message: 'Review action saved.' }), success);
  if (url === '/api/app/user_themes') {
    const payload = data as Record<string, unknown> | undefined;
    if (payload?._method === 'SUBMIT') {
      return jqResult(Promise.resolve({ result: 'success' }), success);
    }
    const config = typeof payload?.config === 'string' ? JSON.parse(payload.config) as ParallaxScene : null;
    const scene = normalizeScene(config || options.value);
    const promise = Promise.resolve(options.onSave?.(scene))
      .then(() => {
        setScene(scene);
        options.onChange?.(scene);
        return { result: 'success', theme_id: (payload?.theme_id as string | undefined) || (scene as ParallaxScene & { theme_id?: string }).theme_id || 'local-demo' };
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
  if (url.startsWith('/api/app/user_files')) {
    const promise = Promise.resolve(options.getAssetPickerHtml?.() || defaultAssetPickerHtml());
    return jqResult(promise, success);
  }
  if (url === '/api/app/theme_help') {
    const promise = Promise.resolve(options.getHelpHtml?.() || defaultHelpHtml());
    return jqResult(promise, success);
  }
  if (url.startsWith('/api/app/set_theme')) {
    return jqResult(Promise.resolve({ result: 'success' }), success);
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
