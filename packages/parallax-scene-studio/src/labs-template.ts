import type { ParallaxScene } from './types';

export interface LabsEditorShellOptions {
  mode?: 'new' | 'edit' | 'fork' | 'view';
  showSourceCard?: boolean;
  panelPositions?: Record<string, { left?: string; top?: string; width?: string }>;
}

export function renderLabsEditorShell(scene: ParallaxScene, options: LabsEditorShellOptions = {}): string {
  const mode = options.mode || 'new';
  const isViewOnly = mode === 'view';
  const reviewStatus = String((scene as ParallaxScene & { review_status?: string }).review_status || 'draft');
  const title = escapeHtml(scene.name || '');
  const accent = escapeHtml(scene.accent || '#FF6B1A');
  const layerPanelStyle = panelStyle('te-layer-panel', options.panelPositions);
  const propsPanelStyle = panelStyle('te-props-panel', options.panelPositions);

  return `
<div class="bg-cover" data-bg-luma="dark" style="--design-ratio:${Number(scene.design_ratio || 1.778)}">
  <div id="scene" data-relative-input="true"></div>
</div>

<div id="theme-editor" class="theme-editor" data-mode="${escapeHtml(mode)}">
  <div class="te-topbar" id="te-topbar">
    <span class="te-topbar-left">
      <button class="te-btn te-btn-glass" id="te-exit-btn">&larr; ${isViewOnly ? 'Close' : 'Exit editor'}</button>
      ${isViewOnly ? '' : '<button class="te-btn te-btn-glass te-btn-help" id="te-help-btn" title="Editor help" data-coreui-toggle="tooltip">?</button>'}
      ${isViewOnly ? '' : '<button class="te-btn te-btn-glass" id="te-reset-panels-btn" title="Reset panel positions" data-coreui-toggle="tooltip">&#x229E;</button>'}
    </span>
    <span class="te-status te-btn-glass">
      ${isViewOnly
        ? `View Only &middot; <strong>${title || 'Untitled'}</strong>`
        : `Theme Editor &middot; <strong><input type="text" id="te-title-input" class="te-title-editable" value="${title}" placeholder="Untitled" maxlength="30"></strong> &middot; <span id="te-save-status">${reviewStatus === 'pending_review' ? 'pending review' : 'unsaved'}</span>`}
    </span>
    <span class="te-actions">
      <button class="te-btn te-btn-glass" id="te-preview-mode-toggle" title="Preview in dark/light mode" data-coreui-toggle="tooltip" style="font-size:11px;padding:4px 10px"><span id="te-mode-icon">🌙</span> <span id="te-mode-label">Dark</span></button>
      <button class="te-btn te-btn-glass" id="te-sample-cards-toggle" title="Show sample UI cards" data-coreui-toggle="tooltip" style="font-size:11px;padding:4px 10px">🃏 Preview UI</button>
      <button class="te-btn te-btn-glass" id="te-blur-toggle" title="Toggle blur on/off" data-coreui-toggle="tooltip" style="font-size:11px;padding:4px 10px"><span id="te-blur-label">Blur on</span></button>
      <button class="te-btn te-btn-glass" id="te-parallax-toggle" title="Pause/resume parallax movement" data-coreui-toggle="tooltip">⏸ Parallax live</button>
      <button class="te-btn te-btn-glass" id="te-zen-btn" title="Hide all chrome (Tab)" data-coreui-toggle="tooltip">&#x26F6; Preview only</button>
      ${isViewOnly ? '' : '<button class="te-btn te-btn-glass" id="te-discard-btn">Discard</button>'}
      ${isViewOnly ? '' : `<span class="te-save-split">
        <button class="te-btn te-btn-glass te-save-action te-save-main" id="te-save-btn">Save</button>
        <button class="te-btn te-btn-glass te-save-action te-save-drop" id="te-save-dropdown">&#x25BE;</button>
        <span class="te-save-menu" id="te-save-menu">
          <button class="te-save-option" id="te-save-apply-btn">Save &amp; Apply</button>
          <button class="te-save-option" id="te-save-exit-btn">Save, Apply &amp; Exit</button>
          <button class="te-save-option" id="te-retake-thumb-btn">&#x1F4F7; Retake Thumbnail</button>
        </span>
      </span>`}
    </span>
  </div>

  <div class="te-panel te-layer-panel${layerPanelStyle.dragged ? ' te-panel-dragged' : ''}" id="te-layer-panel"${layerPanelStyle.style ? ` style="${layerPanelStyle.style}"` : ''}>
    <div class="te-panel-header">
      <h5>Layers</h5>
      <span class="te-panel-actions">
        <button class="te-btn te-btn-glass te-btn-sm" id="te-3d-btn">3D</button>
        <button class="te-btn te-btn-primary te-btn-sm" id="te-add-layer-btn">&#xFF0B;</button>
      </span>
    </div>
    <div class="te-layer-tree" id="te-layer-tree"></div>
    <div class="te-action-ribbon" id="te-action-ribbon" style="display:none">
      <button class="te-ribbon-btn" id="te-rb-move-up" title="Move up (Ctrl+])" data-coreui-toggle="tooltip">&#x25B2;</button>
      <button class="te-ribbon-btn" id="te-rb-move-down" title="Move down (Ctrl+[)" data-coreui-toggle="tooltip">&#x25BC;</button>
      <button class="te-ribbon-btn" id="te-rb-duplicate" title="Duplicate (Ctrl+D)" data-coreui-toggle="tooltip">&#x2295;</button>
      <button class="te-ribbon-btn" id="te-rb-center" title="Center element" data-coreui-toggle="tooltip" style="display:none">&#x2316;</button>
      <button class="te-ribbon-btn te-ribbon-danger" id="te-rb-delete" title="Delete" data-coreui-toggle="tooltip">&#x2715;</button>
    </div>
    <div class="te-layer-empty" id="te-layer-empty">
      <p>No layers yet</p>
      <p class="te-hint">Drop an image to start</p>
    </div>
  </div>

  <div class="te-panel te-props-panel${propsPanelStyle.dragged ? ' te-panel-dragged' : ''}" id="te-props-panel"${propsPanelStyle.style ? ` style="${propsPanelStyle.style}"` : ''}>
    <div class="te-breadcrumb" id="te-breadcrumb"><span class="te-bc-item te-bc-active" data-nav="scene">Scene</span></div>
    <div id="te-scene-props">
      <div class="te-props-controls" style="margin-top:4px">
        <div class="te-prop-row"><span class="te-prop-label">background</span><input type="color" id="te-bg-color" value="#1c2330" class="te-color-pick"><input type="text" id="te-bg-hex" class="te-mono-input" value="#1c2330" maxlength="7"></div>
        <input type="color" id="te-bg-swatch" style="display:none" value="#1c2330">
        <div class="te-prop-row"><span class="te-prop-label">accent</span><input type="color" id="te-accent-color" value="${accent}" class="te-color-pick"><input type="color" id="te-accent-swatch" class="te-accent-swatch" value="${accent}" style="display:none"><button class="te-chip" id="te-accent-enhance" title="Optimize accent for WCAG contrast on cards">✨ Enhance</button></div>
        <hr class="te-divider">
        <span class="te-prop-label">Card tint <span class="te-hint">(no-blur fallback, blur derives from backdrop)</span></span>
        <div class="te-prop-row"><span class="te-prop-label">dark</span><input type="color" id="te-blur-dark" value="#1c2330" class="te-color-pick"><input type="range" id="te-blur-dark-alpha" min="80" max="100" value="95"><input type="number" id="te-blur-dark-num" class="te-mono-input" style="width:40px" min="80" max="100" value="95"><span class="te-val">%</span></div>
        <div class="te-prop-row"><span class="te-prop-label">light</span><input type="color" id="te-blur-light" value="#f0f0f0" class="te-color-pick"><input type="range" id="te-blur-light-alpha" min="80" max="100" value="95"><input type="number" id="te-blur-light-num" class="te-mono-input" style="width:40px" min="80" max="100" value="95"><span class="te-val">%</span></div>
        <hr class="te-divider">
        <div class="te-prop-row"><span class="te-prop-label">scalar X</span><input type="range" id="te-scalar-x" min="1" max="50" value="10"><input type="number" id="te-scalar-x-num" class="te-mono-input" style="width:40px" min="1" max="50" value="10"></div>
        <div class="te-prop-row"><span class="te-prop-label">scalar Y</span><input type="range" id="te-scalar-y" min="1" max="50" value="10"><input type="number" id="te-scalar-y-num" class="te-mono-input" style="width:40px" min="1" max="50" value="10"></div>
        <div class="te-prop-row"><span class="te-prop-label">friction</span><input type="range" id="te-friction" min="1" max="100" value="10"><input type="number" id="te-friction-num" class="te-mono-input" style="width:40px" min="1" max="100" value="10"></div>
        <div class="te-prop-row"><span class="te-prop-label">invert</span><button class="te-chip active" id="te-invert-x" data-toggled="true">X</button><button class="te-chip active" id="te-invert-y" data-toggled="true">Y</button></div>
        <div class="te-prop-row"><span class="te-prop-label">offset</span><input type="number" id="te-offset-left" class="te-mono-input" value="0"><input type="number" id="te-offset-top" class="te-mono-input" value="0"></div>
        <hr class="te-divider">
        <div class="d-flex justify-content-between align-items-center"><span class="te-prop-label" style="margin:0">Scene filter</span><span style="display:inline-flex;gap:2px"><button class="te-chip active" id="te-filter-mode-both" data-fmode="both" style="font-size:9px;padding:2px 6px">both</button><button class="te-chip" id="te-filter-mode-dark" data-fmode="dark" style="font-size:9px;padding:2px 6px">dark</button><button class="te-chip" id="te-filter-mode-light" data-fmode="light" style="font-size:9px;padding:2px 6px">light</button></span></div>
        <div class="te-prop-row"><span class="te-prop-label">saturate</span><input type="range" id="te-filter-sat" min="0" max="200" value="130"><input type="number" id="te-filter-sat-num" class="te-mono-input" style="width:40px" min="0" max="200" value="130"><span class="te-val">%</span></div>
        <div class="te-prop-row"><span class="te-prop-label">brightness</span><input type="range" id="te-filter-bri" min="0" max="200" value="65"><input type="number" id="te-filter-bri-num" class="te-mono-input" style="width:40px" min="0" max="200" value="65"><span class="te-val">%</span></div>
        <div class="te-prop-row"><span class="te-prop-label">contrast</span><input type="range" id="te-filter-con" min="0" max="200" value="100"><input type="number" id="te-filter-con-num" class="te-mono-input" style="width:40px" min="0" max="200" value="100"><span class="te-val">%</span></div>
      </div>
    </div>

    <div id="te-layer-props" style="display:none">
      <div class="te-panel-header"><h5 id="te-layer-props-title">Layer</h5><button class="te-btn te-btn-glass te-btn-sm" id="te-deselect-layer">&times;</button></div>
      <div class="te-prop-row"><span class="te-prop-label" title="Controls parallax movement intensity based on cursor position">motion depth</span><input type="range" id="te-layer-depth" min="0" max="100" value="50"><span class="te-val" id="te-layer-depth-val">0.50</span></div>
      <div class="te-prop-row"><button class="te-btn te-btn-warm" id="te-delete-layer">&times; Delete layer</button></div>
    </div>

    <div id="te-element-props" style="display:none">
      <div class="te-panel-header"><h5 id="te-element-props-title">element</h5><button class="te-btn te-btn-glass te-btn-sm" id="te-deselect-element" title="Close">&times;</button></div>
      <div class="te-prop-row"><span class="te-prop-label">x</span><input type="text" id="te-el-x" class="te-mono-input" value="50%"><span class="te-prop-label">y</span><input type="text" id="te-el-y" class="te-mono-input" value="50%"></div>
      <div class="te-prop-row"><span class="te-prop-label">w</span><input type="text" id="te-el-w" class="te-mono-input" value="120px"><button class="te-btn te-btn-glass te-btn-sm te-link-toggle active" id="te-link-wh" title="Constrain proportions" data-coreui-toggle="tooltip">&#x1F517;</button><span class="te-prop-label">h</span><input type="text" id="te-el-h" class="te-mono-input" value="80px"></div>
      <div class="te-prop-row"><span class="te-prop-label" title="Visual zoom (CSS zoom)">zoom</span><input type="range" id="te-el-scale" min="5" max="500" value="100"><input type="number" id="te-el-scale-num" class="te-mono-input" style="width:45px" min="5" max="500" value="100"><span class="te-val">%</span></div>
      <div class="te-prop-row"><span class="te-prop-label">rotate</span><input type="range" id="te-el-rotate" min="-180" max="180" value="0"><input type="number" id="te-el-rotate-num" class="te-mono-input" style="width:45px" min="-180" max="180" value="0"><span class="te-val">°</span></div>
      <div class="te-prop-row"><span class="te-prop-label">flip</span><button class="te-chip" id="te-el-flipx" title="Flip Horizontal">↔ H</button><button class="te-chip" id="te-el-flipy" title="Flip Vertical">↕ V</button></div>
      <hr class="te-divider"><span class="te-prop-label">appearance</span>
      <div class="te-prop-row"><span class="te-prop-label">opacity</span><input type="range" id="te-el-opacity" min="0" max="100" value="100"><input type="number" id="te-el-opacity-num" class="te-mono-input" style="width:45px" min="0" max="100" value="100"><span class="te-val">%</span></div>
      <div class="te-prop-row"><span class="te-prop-label">bg-size</span><select id="te-el-bgsize" class="te-mono-input" style="width:auto"><option value="contain">contain</option><option value="cover">cover</option><option value="custom">custom…</option></select><input type="text" id="te-el-bgsize-custom" class="te-mono-input" style="width:80px;display:none" placeholder="280px 280px"></div>
      <div class="te-prop-row"><span class="te-prop-label">bg-pos</span><select id="te-el-bgpos" class="te-mono-input" style="width:auto"><option value="">default</option><option value="center">center</option><option value="top center">top center</option><option value="bottom center">bottom center</option><option value="left center">left center</option><option value="right center">right center</option><option value="custom">custom…</option></select><input type="text" id="te-el-bgpos-custom" class="te-mono-input" style="width:80px;display:none" placeholder="50% 100%"></div>
      <div class="te-prop-row"><span class="te-prop-label">bg-repeat</span><select id="te-el-bgrepeat" class="te-mono-input" style="width:auto"><option value="no-repeat">no-repeat</option><option value="repeat">repeat</option><option value="repeat-x">repeat-x</option><option value="repeat-y">repeat-y</option></select></div>
      <hr class="te-divider"><span class="te-prop-label">animation</span>
      <div class="te-anim-chips" id="te-anim-chips">
        ${['', 'pulse', 'float', 'bob', 'bounce', 'rise', 'drift', 'wave', 'swing', 'sway', 'rock', 'spin', 'shake', 'zoom', 'glow', 'flicker', 'fade'].map((animation) => `<button class="te-chip${animation ? '' : ' active'}" data-anim="${animation}">${animation || 'none'}</button>`).join('')}
      </div>
      <div class="te-prop-row"><span class="te-prop-label">duration</span><input type="range" id="te-el-duration" min="2" max="30" value="4"><span class="te-val" id="te-el-duration-val">4s</span></div>
      <hr class="te-divider">
      <div id="te-container-section" style="display:none">
        <div class="te-prop-row"><span class="te-toggle"><input type="checkbox" id="te-container-toggle"> <label for="te-container-toggle">Container</label></span><span class="te-hint" id="te-container-child-count">no children</span></div>
        <div id="te-container-opts" style="display:none"><div class="te-container-explain"><span class="te-hint">Children are positioned relative to this element using x/y %. Enable &lt;img&gt; tag so children align to the image's actual shape.</span></div><div class="te-prop-row"><span class="te-toggle"><input type="checkbox" id="te-container-img-toggle"> <label for="te-container-img-toggle">Render as &lt;img&gt;</label></span></div></div>
        <hr class="te-divider">
      </div>
      <div class="te-prop-row" style="justify-content:center;gap:4px"><button class="te-btn te-btn-glass te-btn-sm" id="te-nav-prev" title="Previous sibling">◀ prev</button><button class="te-btn te-btn-glass te-btn-sm" id="te-nav-parent" title="Go to parent" style="display:none">↑ parent</button><button class="te-btn te-btn-glass te-btn-sm" id="te-nav-next" title="Next sibling">next ▶</button></div>
      <div class="te-prop-row"><button class="te-btn te-btn-glass" id="te-replace-el-img">&uarr; Replace</button><button class="te-btn te-btn-glass" id="te-add-child-btn">&#xFF0B; Child</button><button class="te-btn te-btn-warm" id="te-delete-el">Delete</button></div>
    </div>

    ${options.showSourceCard ? '<div id="te-source-card" class="te-source-card" style="display:none"></div>' : ''}
  </div>

  <div class="te-coords" id="te-coords" style="display:none"><span class="te-coord-label">x</span> <span id="te-coord-x">0</span>px <span class="te-coord-label">y</span> <span id="te-coord-y">0</span>px <span class="te-coord-label">w</span> <span id="te-coord-w">0</span>px <span class="te-coord-label">h</span> <span id="te-coord-h">0</span>px</div>
  <div class="te-bottombar" id="te-bottombar"><span class="te-bottom-group"><span class="te-bottom-label">type</span><span class="te-seg" id="te-type-toggle"><button class="active" data-val="parallax">Parallax</button><button data-val="static">Static</button></span></span><span class="te-bottom-hints" id="te-shortcuts"></span></div>
  <button class="te-btn te-btn-glass te-zen-exit" id="te-zen-exit" style="display:none">Show UI &#x232B;</button>
  <div id="te-sample-cards" style="display:none;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:8;pointer-events:auto;max-width:900px;width:95%;max-height:80vh;overflow-y:auto"><div class="card blur" style="max-width:320px;margin:auto"><div class="card-body" style="padding:1rem"><h6>Preview UI</h6><button class="btn btn-sm btn-primary">Primary</button> <button class="btn btn-sm btn-success">Success</button></div></div><div class="text-center mt-2"><button class="te-btn te-btn-glass" id="te-dismiss-samples" style="font-size:11px;padding:4px 12px;opacity:0.7">✕ Dismiss</button></div></div>
  <div class="te-drop-overlay" id="te-drop-overlay" style="display:none"><div class="te-drop-message">drop to add layer</div></div>
</div>`;
}

function panelStyle(panelId: string, positions?: LabsEditorShellOptions['panelPositions']): { style: string; dragged: boolean } {
  const position = positions?.[panelId];
  if (!position) return { style: '', dragged: false };
  const parts: string[] = [];
  if (position.left && position.top) {
    parts.push(`left:${escapeHtml(position.left)}`, `top:${escapeHtml(position.top)}`, 'right:auto', 'bottom:auto');
  }
  if (position.width) parts.push(`width:${escapeHtml(position.width)}`);
  return { style: parts.join(';'), dragged: Boolean(position.left && position.top) };
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
