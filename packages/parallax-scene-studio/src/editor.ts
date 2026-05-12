import { cloneScene, createDefaultScene, normalizeScene, validateScene } from './schema';
import { getSourceExport, renderParallaxScene } from './runtime';
import type { ParallaxElement, ParallaxScene, RenderedScene, StudioOptions, UploadResult } from './types';

type Selection = { layerIndex: number; elementIndex?: number };

export class ParallaxSceneStudio {
  private readonly options: StudioOptions;
  private readonly mount: HTMLElement;
  private scene: ParallaxScene;
  private rendered?: RenderedScene;
  private root?: HTMLElement;
  private stage?: HTMLElement;
  private panel?: HTMLElement;
  private selection: Selection = { layerIndex: 0 };
  private objectUrls: string[] = [];
  private sourceOpen: boolean;

  constructor(options: StudioOptions) {
    this.options = {
      showSourceCard: true,
      sourceCardDefaultOpen: false,
      ...options
    };
    this.mount = this.resolveMount(options.mount);
    this.scene = normalizeScene(options.value || createDefaultScene());
    this.sourceOpen = Boolean(this.options.sourceCardDefaultOpen);
    this.renderShell();
    this.renderScene();
    this.renderPanel();
  }

  getValue(): ParallaxScene {
    return cloneScene(this.scene);
  }

  setValue(value: Partial<ParallaxScene>): void {
    this.scene = normalizeScene(value);
    this.selection = { layerIndex: 0 };
    this.renderScene();
    this.renderPanel();
    this.emitChange();
  }

  destroy(): void {
    this.rendered?.destroy();
    this.root?.remove();
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.objectUrls = [];
  }

  private renderShell(): void {
    const root = document.createElement('div');
    const toolbar = document.createElement('div');
    const title = document.createElement('input');
    const typeToggle = document.createElement('button');
    const addLayer = document.createElement('button');
    const upload = document.createElement('button');
    const file = document.createElement('input');
    const save = document.createElement('button');
    const workbench = document.createElement('div');
    const stage = document.createElement('main');
    const panel = document.createElement('aside');

    root.className = 'pss-studio';
    toolbar.className = 'pss-toolbar';
    title.className = 'pss-title-input';
    title.value = this.scene.name;
    title.maxLength = 80;
    title.ariaLabel = 'Scene title';
    typeToggle.className = 'pss-button';
    typeToggle.type = 'button';
    addLayer.className = 'pss-button';
    addLayer.type = 'button';
    addLayer.textContent = 'Add Layer';
    upload.className = 'pss-button pss-button-primary';
    upload.type = 'button';
    upload.textContent = 'Upload Image';
    file.type = 'file';
    file.accept = 'image/png,image/jpeg,image/webp,image/svg+xml';
    file.hidden = true;
    save.className = 'pss-button';
    save.type = 'button';
    save.textContent = 'Save';
    workbench.className = 'pss-workbench';
    stage.className = 'pss-stage';
    panel.className = 'pss-side-panel';

    const updateTypeButton = () => {
      typeToggle.textContent = this.scene.type === 'parallax' ? 'Parallax' : 'Static';
    };
    updateTypeButton();

    title.addEventListener('input', () => {
      this.scene.name = title.value || 'Untitled Scene';
      this.renderPanel();
      this.emitChange();
    });
    typeToggle.addEventListener('click', () => {
      this.scene.type = this.scene.type === 'parallax' ? 'static' : 'parallax';
      updateTypeButton();
      this.renderScene();
      this.renderPanel();
      this.emitChange();
    });
    addLayer.addEventListener('click', () => this.addGeneratedLayer());
    upload.addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const picked = file.files?.[0];
      if (picked) void this.addUploadedLayer(picked);
      file.value = '';
    });
    save.addEventListener('click', () => void this.save());

    toolbar.append(title, typeToggle, addLayer, upload, file, save);
    workbench.append(stage, panel);
    root.append(toolbar, workbench);
    this.mount.replaceChildren(root);

    this.root = root;
    this.stage = stage;
    this.panel = panel;
  }

  private renderScene(): void {
    if (!this.stage) return;
    this.rendered?.destroy();
    this.rendered = renderParallaxScene(this.stage, this.scene);
    this.rendered.scene.addEventListener('pointerdown', (event) => this.startDrag(event));
  }

  private renderPanel(): void {
    if (!this.panel) return;
    const panel = this.panel;
    panel.replaceChildren();

    panel.append(
      this.section('Scene', [
        this.colorControl('Background', this.scene.scene.background_color, (value) => {
          this.scene.scene.background_color = value;
          this.renderScene();
          this.emitChange();
        }),
        this.rangeControl('Scalar X', this.scene.scene.scalar_x, 1, 50, 1, (value) => {
          this.scene.scene.scalar_x = value;
          this.renderScene();
          this.emitChange();
        }),
        this.rangeControl('Scalar Y', this.scene.scene.scalar_y, 1, 50, 1, (value) => {
          this.scene.scene.scalar_y = value;
          this.renderScene();
          this.emitChange();
        })
      ])
    );

    panel.append(this.renderLayerSection());

    const selected = this.getSelectedElement();
    if (selected) panel.append(this.renderElementSection(selected));

    if (this.options.showSourceCard) {
      panel.append(this.renderSourceCard());
    }
  }

  private renderLayerSection(): HTMLElement {
    const body: HTMLElement[] = [];

    this.scene.layers.forEach((layer, index) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `pss-layer-row ${this.selection.layerIndex === index ? 'is-active' : ''}`;
      row.textContent = `${layer.name} · ${layer.depth.toFixed(2)}`;
      row.addEventListener('click', () => {
        this.selection = { layerIndex: index, elementIndex: 0 };
        this.renderPanel();
      });
      body.push(row);
    });

    if (!body.length) {
      const empty = document.createElement('p');
      empty.className = 'pss-muted';
      empty.textContent = 'No layers yet. Add or upload an image to start.';
      body.push(empty);
    }

    const selectedLayer = this.scene.layers[this.selection.layerIndex];
    if (selectedLayer) {
      body.push(this.rangeControl('Selected depth', selectedLayer.depth, 0, 1, 0.01, (value) => {
        selectedLayer.depth = value;
        this.renderScene();
        this.renderPanel();
        this.emitChange();
      }));
    }

    return this.section('Layers', body);
  }

  private renderElementSection(element: ParallaxElement): HTMLElement {
    return this.section('Element', [
      this.textControl('X', element.x, (value) => this.updateSelectedElement({ x: value })),
      this.textControl('Y', element.y, (value) => this.updateSelectedElement({ y: value })),
      this.textControl('Width', element.width, (value) => this.updateSelectedElement({ width: value })),
      this.textControl('Height', element.height, (value) => this.updateSelectedElement({ height: value })),
      this.rangeControl('Rotate', element.rotation || 0, -180, 180, 1, (value) => this.updateSelectedElement({ rotation: value })),
      this.rangeControl('Opacity', element.opacity ?? 1, 0, 1, 0.01, (value) => this.updateSelectedElement({ opacity: value }))
    ]);
  }

  private renderSourceCard(): HTMLElement {
    const exportData = getSourceExport(this.scene);
    const wrapper = document.createElement('section');
    const header = document.createElement('button');
    wrapper.className = 'pss-card pss-source-card';
    header.className = 'pss-card-toggle';
    header.type = 'button';
    header.textContent = this.sourceOpen ? 'Source Code - hide' : 'Source Code - show';
    header.addEventListener('click', () => {
      this.sourceOpen = !this.sourceOpen;
      this.renderPanel();
    });
    wrapper.append(header);

    if (this.sourceOpen) {
      wrapper.append(
        this.codeBlock('scene.json', exportData.json),
        this.codeBlock('index.html', exportData.html),
        this.codeBlock('style.css', exportData.css),
        this.codeBlock('main.js', exportData.js)
      );
    }

    return wrapper;
  }

  private codeBlock(labelText: string, value: string): HTMLElement {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const textarea = document.createElement('textarea');
    label.className = 'pss-code-field';
    span.textContent = labelText;
    textarea.readOnly = true;
    textarea.spellcheck = false;
    textarea.value = value;
    label.append(span, textarea);
    return label;
  }

  private async addUploadedLayer(file: File): Promise<void> {
    try {
      const result = await this.uploadFile(file);
      this.addLayerWithImage(typeof result === 'string' ? result : result.url, file.name);
      this.notify('Image added.', 'success');
    } catch (error) {
      this.notify(error instanceof Error ? error.message : 'Upload failed.', 'error');
    }
  }

  private async uploadFile(file: File): Promise<UploadResult> {
    if (this.options.onUpload) {
      return this.options.onUpload(file, {
        scene: this.getValue(),
        target: 'layer'
      });
    }

    const url = URL.createObjectURL(file);
    this.objectUrls.push(url);
    return url;
  }

  private addGeneratedLayer(): void {
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">`,
      `<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#39d98a"/><stop offset="1" stop-color="#ffb020"/></linearGradient></defs>`,
      `<rect width="1200" height="700" fill="url(#g)"/>`,
      `<circle cx="900" cy="180" r="130" fill="#ffffff" opacity=".26"/>`,
      `<path d="M0 530 C220 430 360 600 570 500 C760 408 910 470 1200 380 L1200 700 L0 700 Z" fill="#17202b" opacity=".72"/>`,
      `</svg>`
    ].join('');
    this.addLayerWithImage(`data:image/svg+xml,${encodeURIComponent(svg)}`, `Layer ${this.scene.layers.length + 1}`);
  }

  private addLayerWithImage(image: string, name: string): void {
    this.scene.layers.push({
      name,
      depth: Math.max(0.1, 1 - this.scene.layers.length * 0.18),
      elements: [{
        image,
        name,
        x: '-5%',
        y: '-5%',
        width: '110%',
        height: '110%',
        bgSize: 'cover',
        bgPosition: 'center',
        bgRepeat: 'no-repeat',
        animation: '',
        animation_duration: '4s'
      }]
    });
    this.selection = { layerIndex: this.scene.layers.length - 1, elementIndex: 0 };
    this.renderScene();
    this.renderPanel();
    this.emitChange();
  }

  private startDrag(event: PointerEvent): void {
    if (this.options.readOnly) return;
    const target = (event.target as HTMLElement).closest<HTMLElement>('.pss-element');
    if (!target || !target.dataset.indexPath) return;
    const [layerIndex, elementIndex] = target.dataset.indexPath.split('.').map(Number);
    const layer = this.scene.layers[layerIndex];
    const element = layer?.elements[elementIndex];
    if (!layer || !element || layer.locked || element.locked) return;

    this.selection = { layerIndex, elementIndex };
    this.renderPanel();
    target.setPointerCapture(event.pointerId);

    const parent = target.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = parsePercent(element.x);
    const startTop = parsePercent(element.y);

    const move = (moveEvent: PointerEvent) => {
      const dx = ((moveEvent.clientX - startX) / Math.max(parentRect.width, 1)) * 100;
      const dy = ((moveEvent.clientY - startY) / Math.max(parentRect.height, 1)) * 100;
      element.x = `${round(startLeft + dx)}%`;
      element.y = `${round(startTop + dy)}%`;
      target.style.left = element.x;
      target.style.top = element.y;
      this.emitChange();
    };

    const up = () => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
      this.renderPanel();
    };

    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  }

  private updateSelectedElement(patch: Partial<ParallaxElement>): void {
    const element = this.getSelectedElement();
    if (!element) return;
    Object.assign(element, patch);
    this.renderScene();
    this.renderPanel();
    this.emitChange();
  }

  private getSelectedElement(): ParallaxElement | null {
    const layer = this.scene.layers[this.selection.layerIndex];
    if (!layer) return null;
    const elementIndex = this.selection.elementIndex ?? 0;
    return layer.elements[elementIndex] || null;
  }

  private async save(): Promise<void> {
    const errors = validateScene(this.scene);
    if (errors.length) {
      this.notify(errors[0], 'warning');
      return;
    }
    await this.options.onSave?.(this.getValue());
    this.notify('Scene saved.', 'success');
  }

  private section(titleText: string, children: HTMLElement[]): HTMLElement {
    const section = document.createElement('section');
    const title = document.createElement('h2');
    section.className = 'pss-card';
    title.textContent = titleText;
    section.append(title, ...children);
    return section;
  }

  private colorControl(labelText: string, value: string, onInput: (value: string) => void): HTMLElement {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const input = document.createElement('input');
    label.className = 'pss-control';
    span.textContent = labelText;
    input.type = 'color';
    input.value = value;
    input.addEventListener('input', () => onInput(input.value));
    label.append(span, input);
    return label;
  }

  private textControl(labelText: string, value: string, onInput: (value: string) => void): HTMLElement {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const input = document.createElement('input');
    label.className = 'pss-control';
    span.textContent = labelText;
    input.type = 'text';
    input.value = value;
    input.addEventListener('change', () => onInput(input.value));
    label.append(span, input);
    return label;
  }

  private rangeControl(
    labelText: string,
    value: number,
    min: number,
    max: number,
    step: number,
    onInput: (value: number) => void
  ): HTMLElement {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const input = document.createElement('input');
    const output = document.createElement('output');
    label.className = 'pss-control';
    span.textContent = labelText;
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(value);
    output.value = String(value);
    input.addEventListener('input', () => {
      output.value = input.value;
      onInput(Number(input.value));
    });
    label.append(span, input, output);
    return label;
  }

  private emitChange(): void {
    this.options.onChange?.(this.getValue());
  }

  private notify(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    if (this.options.notify) {
      this.options.notify(message, level);
      return;
    }
    if (level === 'error') console.error(message);
  }

  private resolveMount(mount: string | HTMLElement): HTMLElement {
    const el = typeof mount === 'string' ? document.querySelector<HTMLElement>(mount) : mount;
    if (!el) throw new Error('Parallax Scene Studio mount element was not found.');
    return el;
  }
}

function parsePercent(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

