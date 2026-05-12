import { cloneScene, createDefaultScene, normalizeScene, validateScene } from './schema';
import { getSourceExport, renderParallaxScene } from './runtime';
import type { ParallaxElement, ParallaxScene, RenderedScene, StudioOptions, UploadResult } from './types';

type Selection = { layerIndex: number; elementPath: number[] };

export class ParallaxSceneStudio {
  private readonly options: StudioOptions;
  private readonly mount: HTMLElement;
  private scene: ParallaxScene;
  private rendered?: RenderedScene;
  private root?: HTMLElement;
  private stage?: HTMLElement;
  private layerPanel?: HTMLElement;
  private propsPanel?: HTMLElement;
  private typeButtons: HTMLButtonElement[] = [];
  private selection: Selection = { layerIndex: 0, elementPath: [0] };
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
    this.selection = { layerIndex: 0, elementPath: [0] };
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
    const stage = document.createElement('main');
    const topbar = document.createElement('div');
    const topLeft = document.createElement('div');
    const topActions = document.createElement('div');
    const brand = document.createElement('span');
    const title = document.createElement('input');
    const addLayer = document.createElement('button');
    const upload = document.createElement('button');
    const file = document.createElement('input');
    const save = document.createElement('button');
    const layerPanel = document.createElement('aside');
    const propsPanel = document.createElement('aside');
    const bottomBar = document.createElement('div');
    const bottomLabel = document.createElement('span');
    const typeSeg = document.createElement('span');
    const parallaxType = document.createElement('button');
    const staticType = document.createElement('button');
    const hint = document.createElement('span');

    root.className = 'pss-studio';
    stage.className = 'pss-stage';
    topbar.className = 'pss-topbar';
    topLeft.className = 'pss-topbar-left';
    topActions.className = 'pss-actions';
    brand.className = 'pss-brand';
    brand.textContent = 'Parallax Scene Studio';
    title.className = 'pss-title-input';
    title.value = this.scene.name;
    title.maxLength = 80;
    title.ariaLabel = 'Scene title';
    title.name = 'scene_title';
    addLayer.className = 'pss-button';
    addLayer.type = 'button';
    addLayer.textContent = '+ Layer';
    upload.className = 'pss-button pss-button-primary';
    upload.type = 'button';
    upload.textContent = 'Upload';
    file.type = 'file';
    file.accept = 'image/png,image/jpeg,image/webp,image/svg+xml';
    file.hidden = true;
    file.name = 'scene_image';
    save.className = 'pss-button';
    save.type = 'button';
    save.textContent = 'Save';
    layerPanel.className = 'pss-panel pss-layer-panel';
    propsPanel.className = 'pss-panel pss-props-panel';
    bottomBar.className = 'pss-bottom-bar';
    bottomLabel.className = 'pss-bottom-label';
    bottomLabel.textContent = 'type';
    typeSeg.className = 'pss-seg';
    parallaxType.type = 'button';
    parallaxType.dataset.type = 'parallax';
    parallaxType.textContent = 'Parallax';
    staticType.type = 'button';
    staticType.dataset.type = 'static';
    staticType.textContent = 'Static';
    hint.className = 'pss-bottom-hint';
    hint.textContent = 'Select a layer, then drag it on the scene';
    this.typeButtons = [parallaxType, staticType];

    title.addEventListener('input', () => {
      this.scene.name = title.value || 'Untitled Scene';
      this.renderPanel();
      this.emitChange();
    });
    this.typeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.scene.type = button.dataset.type === 'static' ? 'static' : 'parallax';
        this.updateTypeButtons();
        this.renderScene();
        this.renderPanel();
        this.emitChange();
      });
    });
    addLayer.addEventListener('click', () => this.addGeneratedLayer());
    upload.addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const picked = file.files?.[0];
      if (picked) void this.addUploadedLayer(picked);
      file.value = '';
    });
    save.addEventListener('click', () => void this.save());

    topLeft.append(brand, title);
    topActions.append(addLayer, upload, save);
    topbar.append(topLeft, topActions);
    typeSeg.append(parallaxType, staticType);
    bottomBar.append(bottomLabel, typeSeg, hint);
    root.append(stage, topbar, layerPanel, propsPanel, bottomBar, file);
    this.mount.replaceChildren(root);

    this.root = root;
    this.stage = stage;
    this.layerPanel = layerPanel;
    this.propsPanel = propsPanel;
    this.updateTypeButtons();
  }

  private updateTypeButtons(): void {
    this.typeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.type === this.scene.type);
    });
  }

  private renderScene(): void {
    if (!this.stage) return;
    this.rendered?.destroy();
    this.rendered = renderParallaxScene(this.stage, this.scene);
    this.rendered.scene.addEventListener('pointerdown', (event) => this.startDrag(event));
    this.syncSceneSelection();
  }

  private renderPanel(): void {
    this.renderLayerPanel();
    this.renderPropsPanel();
  }

  private renderLayerPanel(): void {
    if (!this.layerPanel) return;
    const panel = this.layerPanel;
    const header = document.createElement('div');
    const title = document.createElement('h2');
    const count = document.createElement('span');
    const tree = document.createElement('div');

    panel.replaceChildren();
    header.className = 'pss-panel-header';
    title.textContent = 'Layers';
    count.className = 'pss-panel-kicker';
    count.textContent = `${this.scene.layers.length}`;
    tree.className = 'pss-layer-tree';
    tree.append(...this.renderLayerRows());
    header.append(title, count);
    panel.append(header, tree);
  }

  private renderPropsPanel(): void {
    if (!this.propsPanel) return;
    const panel = this.propsPanel;
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

    const selectedLayer = this.scene.layers[this.selection.layerIndex];
    if (selectedLayer) {
      panel.append(this.section('Layer', [
        this.rangeControl('Depth', selectedLayer.depth, 0, 1, 0.01, (value) => {
          selectedLayer.depth = value;
          this.renderScene();
          this.renderPanel();
          this.emitChange();
        })
      ]));
    }

    const selected = this.getSelectedElement();
    if (selected) panel.append(this.renderElementSection(selected));

    if (this.options.showSourceCard) {
      panel.append(this.renderSourceCard());
    }
  }

  private renderLayerRows(): HTMLElement[] {
    const body: HTMLElement[] = [];

    this.scene.layers.forEach((layer, index) => {
      const row = document.createElement('button');
      const thumb = document.createElement('span');
      const meta = document.createElement('span');
      const name = document.createElement('span');
      const depth = document.createElement('span');
      row.type = 'button';
      row.className = `pss-layer-row ${this.selection.layerIndex === index ? 'is-active' : ''}`;
      thumb.className = 'pss-layer-thumb';
      thumb.style.backgroundImage = `url("${firstLayerImage(layer.elements[0])}")`;
      meta.className = 'pss-layer-meta';
      name.className = 'pss-layer-name';
      name.textContent = layer.name;
      depth.className = 'pss-layer-depth';
      depth.textContent = `depth ${layer.depth.toFixed(2)}`;
      meta.append(name, depth);
      row.append(thumb, meta);
      row.addEventListener('click', () => {
        this.selection = { layerIndex: index, elementPath: [0] };
        this.syncSceneSelection();
        this.renderPanel();
      });
      body.push(row);
    });

    if (!body.length) {
      const empty = document.createElement('p');
      empty.className = 'pss-muted';
      empty.textContent = 'No layers yet.';
      body.push(empty);
    }

    return body;
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
    wrapper.className = 'pss-section pss-source-card';
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
    this.selection = { layerIndex: this.scene.layers.length - 1, elementPath: [0] };
    this.renderScene();
    this.renderPanel();
    this.emitChange();
  }

  private startDrag(event: PointerEvent): void {
    if (this.options.readOnly) return;
    if (event.button !== 0) return;

    const eventTarget = event.target instanceof Element ? event.target : null;
    const hitTarget = eventTarget?.closest<HTMLElement>('.pss-element') || null;
    const hitPath = hitTarget?.dataset.indexPath ? parseIndexPath(hitTarget.dataset.indexPath) : null;
    if (hitPath) {
      this.selection = hitPath;
    }

    const layer = this.scene.layers[this.selection.layerIndex];
    const element = layer ? getElementByPath(layer.elements, this.selection.elementPath) : null;
    const target = this.getSelectedElementNode();
    if (!layer || !element || layer.locked || element.locked) return;
    if (!target) return;

    event.preventDefault();
    this.syncSceneSelection();
    this.renderPanel();
    this.rendered?.scene.classList.add('is-dragging');
    const parent = target.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = parsePercent(element.x);
    const startTop = parsePercent(element.y);
    const pointerId = event.pointerId;

    const move = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      moveEvent.preventDefault();
      const dx = ((moveEvent.clientX - startX) / Math.max(parentRect.width, 1)) * 100;
      const dy = ((moveEvent.clientY - startY) / Math.max(parentRect.height, 1)) * 100;
      element.x = `${round(startLeft + dx)}%`;
      element.y = `${round(startTop + dy)}%`;
      target.style.left = element.x;
      target.style.top = element.y;
      this.emitChange();
    };

    const up = (upEvent: PointerEvent) => {
      if (upEvent.pointerId !== pointerId) return;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      this.rendered?.scene.classList.remove('is-dragging');
      this.renderPanel();
      this.syncSceneSelection();
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
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
    return getElementByPath(layer.elements, this.selection.elementPath);
  }

  private getSelectedElementNode(): HTMLElement | null {
    const scene = this.rendered?.scene;
    if (!scene) return null;
    const selectedPath = selectionToIndexPath(this.selection);
    return Array.from(scene.querySelectorAll<HTMLElement>('.pss-element'))
      .find((element) => element.dataset.indexPath === selectedPath) || null;
  }

  private syncSceneSelection(): void {
    const scene = this.rendered?.scene;
    if (!scene) return;
    const selectedPath = selectionToIndexPath(this.selection);
    scene.querySelectorAll<HTMLElement>('.pss-element.is-selected').forEach((element) => {
      element.classList.remove('is-selected');
      element.removeAttribute('aria-selected');
    });
    const selected = this.getSelectedElementNode();
    if (!selected) return;
    selected.classList.add('is-selected');
    selected.setAttribute('aria-selected', 'true');
    scene.dataset.selectedIndexPath = selectedPath;
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
    section.className = 'pss-section';
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
    input.name = controlName(labelText);
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
    input.name = controlName(labelText);
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
    input.name = controlName(labelText);
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

function firstLayerImage(element?: ParallaxElement): string {
  const image = element?.image || '';
  if (!image) return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%23262d38"/%3E%3C/svg%3E';
  return image.replace(/"/g, '%22');
}

function controlName(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'control';
}

function selectionToIndexPath(selection: Selection): string {
  return [selection.layerIndex, ...selection.elementPath].join('.');
}

function parseIndexPath(indexPath: string): Selection | null {
  const parts = indexPath.split('.').map((part) => Number(part));
  if (parts.length < 2 || parts.some((part) => !Number.isInteger(part) || part < 0)) return null;
  const [layerIndex, ...elementPath] = parts;
  return { layerIndex, elementPath };
}

function getElementByPath(elements: ParallaxElement[], elementPath: number[]): ParallaxElement | null {
  let current: ParallaxElement | undefined = elements[elementPath[0]];
  for (const index of elementPath.slice(1)) {
    current = current?.children?.[index];
    if (!current) return null;
  }
  return current || null;
}
