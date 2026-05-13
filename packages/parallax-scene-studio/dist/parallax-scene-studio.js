const bd = [
  "",
  "pulse",
  "swing",
  "float",
  "drift",
  "bob",
  "spin",
  "bounce",
  "flicker",
  "sway",
  "zoom",
  "shake",
  "glow",
  "wave",
  "rise",
  "rock",
  "fade"
], Ed = {
  background_color: "#102336",
  relative_input: !0,
  scalar_x: 10,
  scalar_y: 10,
  friction_x: 0.12,
  friction_y: 0.12,
  invert_x: !0,
  invert_y: !0
};
function nl() {
  return {
    schema_version: 1,
    name: "Untitled Scene",
    type: "parallax",
    mode: "scene",
    accent: "#ff7a1a",
    scene: { ...Ed },
    blur: {
      dark: "rgba(20, 25, 35, 0.92)",
      light: "rgba(245, 248, 250, 0.92)"
    },
    layer_offset: { left: 0, top: 0 },
    design_ratio: 1.778,
    layers: []
  };
}
function rl(e) {
  return JSON.parse(JSON.stringify(e));
}
function gt(e) {
  const A = nl();
  return e ? {
    ...A,
    ...e,
    schema_version: 1,
    type: e.type === "static" ? "static" : "parallax",
    scene: {
      ...A.scene,
      ...e.scene || {}
    },
    blur: {
      ...A.blur,
      ...e.blur || {}
    },
    layer_offset: {
      ...A.layer_offset,
      ...e.layer_offset || {}
    },
    design_ratio: Number(e.design_ratio || A.design_ratio),
    layers: (e.layers || []).map(xd)
  } : A;
}
function xd(e, A = 0) {
  return {
    name: e.name || `Layer ${A + 1}`,
    depth: kr(e.depth, 0, 1, 0.5),
    hidden: !!e.hidden,
    locked: !!e.locked,
    elements: (e.elements || []).map(il)
  };
}
function il(e) {
  const A = bd.includes(e.animation || "") && e.animation || "";
  return {
    image: String(e.image || ""),
    x: String(e.x || "20%"),
    y: String(e.y || "20%"),
    width: String(e.width || "40%"),
    height: String(e.height || "40%"),
    name: e.name,
    css: e.css,
    bgSize: e.bgSize || "contain",
    bgPosition: e.bgPosition || "center",
    bgRepeat: e.bgRepeat || "no-repeat",
    opacity: kr(e.opacity, 0, 1, 1),
    animation: A,
    animation_duration: e.animation_duration || "4s",
    scale: kr(e.scale, 0.05, 5, 1),
    rotation: kr(e.rotation, -180, 180, 0),
    flipX: !!e.flipX,
    flipY: !!e.flipY,
    hidden: !!e.hidden,
    locked: !!e.locked,
    tag: e.tag === "img" ? "img" : "div",
    class: e.class,
    children: (e.children || []).map(il)
  };
}
function Id(e) {
  const A = [];
  return e.name.trim() || A.push("Scene name is required."), e.layers.length || A.push("At least one layer is required."), e.layers.forEach((t, n) => {
    (t.depth < 0 || t.depth > 1) && A.push(`Layer ${n + 1} depth must be between 0 and 1.`), t.elements.length || A.push(`Layer ${n + 1} has no elements.`), t.elements.forEach((i, s) => {
      i.image || A.push(`Layer ${n + 1}, element ${s + 1} has no image.`);
    });
  }), A;
}
function kr(e, A, t, n) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(t, Math.max(A, i)) : n;
}
function Hd(e, A, t = {}) {
  const n = Td(e), i = gt(A), s = document.createElement("div"), l = document.createElement("div"), u = [];
  return s.className = ["pss-bg-cover", t.className || ""].filter(Boolean).join(" "), s.style.setProperty("--pss-design-ratio", String(i.design_ratio)), l.className = "pss-scene", l.style.backgroundColor = i.scene.background_color, l.dataset.relativeInput = String(i.scene.relative_input), l.dataset.scalarX = String(i.scene.scalar_x), l.dataset.scalarY = String(i.scene.scalar_y), l.dataset.frictionX = String(i.scene.friction_x), l.dataset.frictionY = String(i.scene.friction_y), l.dataset.invertX = String(i.scene.invert_x), l.dataset.invertY = String(i.scene.invert_y), i.layers.forEach((f, g) => {
    if (f.hidden) return;
    const w = document.createElement("div");
    w.className = "pss-layer", w.dataset.depth = String(f.depth), w.dataset.layerIndex = String(g), w.style.left = `${i.layer_offset.left || 0}px`, w.style.top = `${i.layer_offset.top || 0}px`, f.elements.forEach((v, U) => {
      v.hidden || w.appendChild(al(v, [g, U]));
    }), l.appendChild(w);
  }), s.appendChild(l), n.replaceChildren(s), i.type === "parallax" && t.usePointerEngine !== !1 && u.push(Sd(l, i)), {
    root: s,
    scene: l,
    destroy() {
      u.forEach((f) => f()), s.remove();
    }
  };
}
function Sd(e, A) {
  const t = rl(A), n = Array.from(e.querySelectorAll(".pss-layer"));
  let i = 0, s = !0, l = 0, u = 0, f = 0, g = 0;
  const w = t.scene.scalar_x || 10, v = t.scene.scalar_y || 10, U = t.scene.friction_x || 0.12, L = t.scene.friction_y || 0.12, C = t.scene.invert_x ? -1 : 1, y = t.scene.invert_y ? -1 : 1;
  function I($, M) {
    const _ = e.getBoundingClientRect(), R = (($ - _.left) / Math.max(_.width, 1) - 0.5) * 2, c = ((M - _.top) / Math.max(_.height, 1) - 0.5) * 2;
    l = R * w * C, u = c * v * y, i || (i = requestAnimationFrame(O));
  }
  function b($) {
    I($.clientX, $.clientY);
  }
  function O() {
    s && (f += (l - f) * U, g += (u - g) * L, n.forEach(($) => {
      const M = Number($.dataset.depth || 0);
      $.style.transform = `translate3d(${(f * M).toFixed(2)}px, ${(g * M).toFixed(2)}px, 0)`;
    }), Math.abs(l - f) > 0.01 || Math.abs(u - g) > 0.01 ? i = requestAnimationFrame(O) : i = 0);
  }
  return window.addEventListener("pointermove", b, { passive: !0 }), () => {
    s = !1, window.removeEventListener("pointermove", b), i && cancelAnimationFrame(i);
  };
}
function Ld(e) {
  const A = gt(e), t = JSON.stringify(A, null, 2), n = t.replace(/</g, "\\u003c");
  return {
    json: t,
    html: '<div id="parallax-scene"></div>',
    css: '@import "parallax-scene-studio/style.css";',
    js: [
      "import { renderParallaxScene } from 'parallax-scene-studio';",
      "import 'parallax-scene-studio/style.css';",
      "",
      `const scene = ${n};`,
      "",
      "renderParallaxScene('#parallax-scene', scene);"
    ].join(`
`)
  };
}
function al(e, A) {
  const t = document.createElement(e.tag === "img" && !e.children?.length ? "img" : "div");
  t.className = ["pss-element", e.animation ? `pss-anim-${e.animation}` : "", e.class || ""].filter(Boolean).join(" "), t.dataset.indexPath = A.join("."), t.style.position = "absolute", t.style.left = rt(e.x), t.style.top = rt(e.y), t.style.width = rt(e.width), t.style.height = rt(e.height), t.style.backgroundSize = rt(e.bgSize || "contain"), t.style.backgroundPosition = rt(e.bgPosition || "center"), t.style.backgroundRepeat = rt(e.bgRepeat || "no-repeat"), t.style.opacity = String(e.opacity ?? 1), t.style.animationDuration = rt(e.animation_duration || "4s");
  const n = (e.flipX ? -1 : 1) * (e.scale || 1), i = (e.flipY ? -1 : 1) * (e.scale || 1);
  return t.style.rotate = e.rotation ? `${Number(e.rotation)}deg` : "", t.style.scale = n !== 1 || i !== 1 ? `${n} ${i}` : "", t instanceof HTMLImageElement ? (t.src = Rs(e.image), t.alt = e.name || "", t.draggable = !1) : t.style.backgroundImage = `url("${Rs(e.image)}")`, e.css && Dd(t, e.css), e.children?.length && (t.style.position = "absolute", e.children.forEach((s, l) => {
    s.hidden || t.appendChild(al(s, [...A, l]));
  })), t;
}
function Td(e) {
  const A = typeof e == "string" ? document.querySelector(e) : e;
  if (!A) throw new Error("Parallax Scene Studio mount element was not found.");
  return A;
}
function rt(e) {
  return String(e).replace(/[<>"'{}]|\/\*|\*\/|<\/|expression\s*\(/gi, "");
}
function Rs(e) {
  const A = String(e || "").trim();
  return /^(https?:\/\/|\/|\.\/|\.\.\/|blob:|data:image\/)/i.test(A) ? A.replace(/"/g, "%22") : "";
}
function Dd(e, A) {
  const t = /(?:^|[-\s])(?:behavior|expression|src)\s*:|url\s*\(|javascript\s*:|<\/|\/\*|\*\//i;
  A.split(";").forEach((n) => {
    const i = n.trim();
    if (!i || t.test(i)) return;
    const s = i.indexOf(":");
    if (s <= 0) return;
    const l = i.slice(0, s).trim(), u = i.slice(s + 1).trim();
    /^--[a-zA-Z0-9_-]+$|^[a-zA-Z-]+$/.test(l) && (/[<>{}]/.test(u) || e.style.setProperty(l, u));
  });
}
class nw {
  options;
  mount;
  scene;
  rendered;
  root;
  stage;
  layerPanel;
  propsPanel;
  typeButtons = [];
  selection = { layerIndex: 0, elementPath: [0] };
  objectUrls = [];
  sourceOpen;
  constructor(A) {
    this.options = {
      showSourceCard: !0,
      sourceCardDefaultOpen: !1,
      ...A
    }, this.mount = this.resolveMount(A.mount), this.scene = gt(A.value || nl()), this.sourceOpen = !!this.options.sourceCardDefaultOpen, this.renderShell(), this.renderScene(), this.renderPanel();
  }
  getValue() {
    return rl(this.scene);
  }
  setValue(A) {
    this.scene = gt(A), this.selection = { layerIndex: 0, elementPath: [0] }, this.renderScene(), this.renderPanel(), this.emitChange();
  }
  destroy() {
    this.rendered?.destroy(), this.root?.remove(), this.objectUrls.forEach((A) => URL.revokeObjectURL(A)), this.objectUrls = [];
  }
  renderShell() {
    const A = document.createElement("div"), t = document.createElement("main"), n = document.createElement("div"), i = document.createElement("div"), s = document.createElement("div"), l = document.createElement("span"), u = document.createElement("input"), f = document.createElement("button"), g = document.createElement("button"), w = document.createElement("input"), v = document.createElement("button"), U = document.createElement("aside"), L = document.createElement("aside"), C = document.createElement("div"), y = document.createElement("span"), I = document.createElement("span"), b = document.createElement("button"), O = document.createElement("button"), $ = document.createElement("span");
    A.className = "pss-studio", t.className = "pss-stage", n.className = "pss-topbar", i.className = "pss-topbar-left", s.className = "pss-actions", l.className = "pss-brand", l.textContent = "Parallax Scene Studio", u.className = "pss-title-input", u.value = this.scene.name, u.maxLength = 80, u.ariaLabel = "Scene title", u.name = "scene_title", f.className = "pss-button", f.type = "button", f.textContent = "+ Layer", g.className = "pss-button pss-button-primary", g.type = "button", g.textContent = "Upload", w.type = "file", w.accept = "image/png,image/jpeg,image/webp,image/svg+xml", w.hidden = !0, w.name = "scene_image", v.className = "pss-button", v.type = "button", v.textContent = "Save", U.className = "pss-panel pss-layer-panel", L.className = "pss-panel pss-props-panel", C.className = "pss-bottom-bar", y.className = "pss-bottom-label", y.textContent = "type", I.className = "pss-seg", b.type = "button", b.dataset.type = "parallax", b.textContent = "Parallax", O.type = "button", O.dataset.type = "static", O.textContent = "Static", $.className = "pss-bottom-hint", $.textContent = "Select a layer, then drag it on the scene", this.typeButtons = [b, O], u.addEventListener("input", () => {
      this.scene.name = u.value || "Untitled Scene", this.renderPanel(), this.emitChange();
    }), this.typeButtons.forEach((M) => {
      M.addEventListener("click", () => {
        this.scene.type = M.dataset.type === "static" ? "static" : "parallax", this.updateTypeButtons(), this.renderScene(), this.renderPanel(), this.emitChange();
      });
    }), f.addEventListener("click", () => this.addGeneratedLayer()), g.addEventListener("click", () => w.click()), w.addEventListener("change", () => {
      const M = w.files?.[0];
      M && this.addUploadedLayer(M), w.value = "";
    }), v.addEventListener("click", () => {
      this.save();
    }), i.append(l, u), s.append(f, g, v), n.append(i, s), I.append(b, O), C.append(y, I, $), A.append(t, n, U, L, C, w), this.mount.replaceChildren(A), this.root = A, this.stage = t, this.layerPanel = U, this.propsPanel = L, this.updateTypeButtons();
  }
  updateTypeButtons() {
    this.typeButtons.forEach((A) => {
      A.classList.toggle("is-active", A.dataset.type === this.scene.type);
    });
  }
  renderScene() {
    this.stage && (this.rendered?.destroy(), this.rendered = Hd(this.stage, this.scene), this.rendered.scene.addEventListener("pointerdown", (A) => this.startDrag(A)), this.syncSceneSelection());
  }
  renderPanel() {
    this.renderLayerPanel(), this.renderPropsPanel();
  }
  renderLayerPanel() {
    if (!this.layerPanel) return;
    const A = this.layerPanel, t = document.createElement("div"), n = document.createElement("h2"), i = document.createElement("span"), s = document.createElement("div");
    A.replaceChildren(), t.className = "pss-panel-header", n.textContent = "Layers", i.className = "pss-panel-kicker", i.textContent = `${this.scene.layers.length}`, s.className = "pss-layer-tree", s.append(...this.renderLayerRows()), t.append(n, i), A.append(t, s);
  }
  renderPropsPanel() {
    if (!this.propsPanel) return;
    const A = this.propsPanel;
    A.replaceChildren(), A.append(
      this.section("Scene", [
        this.colorControl("Background", this.scene.scene.background_color, (i) => {
          this.scene.scene.background_color = i, this.renderScene(), this.emitChange();
        }),
        this.rangeControl("Scalar X", this.scene.scene.scalar_x, 1, 50, 1, (i) => {
          this.scene.scene.scalar_x = i, this.renderScene(), this.emitChange();
        }),
        this.rangeControl("Scalar Y", this.scene.scene.scalar_y, 1, 50, 1, (i) => {
          this.scene.scene.scalar_y = i, this.renderScene(), this.emitChange();
        })
      ])
    );
    const t = this.scene.layers[this.selection.layerIndex];
    t && A.append(this.section("Layer", [
      this.rangeControl("Depth", t.depth, 0, 1, 0.01, (i) => {
        t.depth = i, this.renderScene(), this.renderPanel(), this.emitChange();
      })
    ]));
    const n = this.getSelectedElement();
    n && A.append(this.renderElementSection(n)), this.options.showSourceCard && A.append(this.renderSourceCard());
  }
  renderLayerRows() {
    const A = [];
    if (this.scene.layers.forEach((t, n) => {
      const i = document.createElement("button"), s = document.createElement("span"), l = document.createElement("span"), u = document.createElement("span"), f = document.createElement("span");
      i.type = "button", i.className = `pss-layer-row ${this.selection.layerIndex === n ? "is-active" : ""}`, s.className = "pss-layer-thumb", s.style.backgroundImage = `url("${Kd(t.elements[0])}")`, l.className = "pss-layer-meta", u.className = "pss-layer-name", u.textContent = t.name, f.className = "pss-layer-depth", f.textContent = `depth ${t.depth.toFixed(2)}`, l.append(u, f), i.append(s, l), i.addEventListener("click", () => {
        this.selection = { layerIndex: n, elementPath: [0] }, this.syncSceneSelection(), this.renderPanel();
      }), A.push(i);
    }), !A.length) {
      const t = document.createElement("p");
      t.className = "pss-muted", t.textContent = "No layers yet.", A.push(t);
    }
    return A;
  }
  renderElementSection(A) {
    return this.section("Element", [
      this.textControl("X", A.x, (t) => this.updateSelectedElement({ x: t })),
      this.textControl("Y", A.y, (t) => this.updateSelectedElement({ y: t })),
      this.textControl("Width", A.width, (t) => this.updateSelectedElement({ width: t })),
      this.textControl("Height", A.height, (t) => this.updateSelectedElement({ height: t })),
      this.rangeControl("Rotate", A.rotation || 0, -180, 180, 1, (t) => this.updateSelectedElement({ rotation: t })),
      this.rangeControl("Opacity", A.opacity ?? 1, 0, 1, 0.01, (t) => this.updateSelectedElement({ opacity: t }))
    ]);
  }
  renderSourceCard() {
    const A = Ld(this.scene), t = document.createElement("section"), n = document.createElement("button");
    return t.className = "pss-section pss-source-card", n.className = "pss-card-toggle", n.type = "button", n.textContent = this.sourceOpen ? "Source Code - hide" : "Source Code - show", n.addEventListener("click", () => {
      this.sourceOpen = !this.sourceOpen, this.renderPanel();
    }), t.append(n), this.sourceOpen && t.append(
      this.codeBlock("scene.json", A.json),
      this.codeBlock("index.html", A.html),
      this.codeBlock("style.css", A.css),
      this.codeBlock("main.js", A.js)
    ), t;
  }
  codeBlock(A, t) {
    const n = document.createElement("label"), i = document.createElement("span"), s = document.createElement("textarea");
    return n.className = "pss-code-field", i.textContent = A, s.readOnly = !0, s.spellcheck = !1, s.value = t, n.append(i, s), n;
  }
  async addUploadedLayer(A) {
    try {
      const t = await this.uploadFile(A);
      this.addLayerWithImage(typeof t == "string" ? t : t.url, A.name), this.notify("Image added.", "success");
    } catch (t) {
      this.notify(t instanceof Error ? t.message : "Upload failed.", "error");
    }
  }
  async uploadFile(A) {
    if (this.options.onUpload)
      return this.options.onUpload(A, {
        scene: this.getValue(),
        target: "layer"
      });
    const t = URL.createObjectURL(A);
    return this.objectUrls.push(t), t;
  }
  addGeneratedLayer() {
    const A = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">',
      '<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#39d98a"/><stop offset="1" stop-color="#ffb020"/></linearGradient></defs>',
      '<rect width="1200" height="700" fill="url(#g)"/>',
      '<circle cx="900" cy="180" r="130" fill="#ffffff" opacity=".26"/>',
      '<path d="M0 530 C220 430 360 600 570 500 C760 408 910 470 1200 380 L1200 700 L0 700 Z" fill="#17202b" opacity=".72"/>',
      "</svg>"
    ].join("");
    this.addLayerWithImage(`data:image/svg+xml,${encodeURIComponent(A)}`, `Layer ${this.scene.layers.length + 1}`);
  }
  addLayerWithImage(A, t) {
    this.scene.layers.push({
      name: t,
      depth: Math.max(0.1, 1 - this.scene.layers.length * 0.18),
      elements: [{
        image: A,
        name: t,
        x: "-5%",
        y: "-5%",
        width: "110%",
        height: "110%",
        bgSize: "cover",
        bgPosition: "center",
        bgRepeat: "no-repeat",
        animation: "",
        animation_duration: "4s"
      }]
    }), this.selection = { layerIndex: this.scene.layers.length - 1, elementPath: [0] }, this.renderScene(), this.renderPanel(), this.emitChange();
  }
  startDrag(A) {
    if (this.options.readOnly || A.button !== 0) return;
    const n = (A.target instanceof Element ? A.target : null)?.closest(".pss-element") || null, i = n?.dataset.indexPath ? kd(n.dataset.indexPath) : null;
    i && (this.selection = i);
    const s = this.scene.layers[this.selection.layerIndex], l = s ? $s(s.elements, this.selection.elementPath) : null, u = this.getSelectedElementNode();
    if (!s || !l || s.locked || l.locked || !u) return;
    A.preventDefault(), this.syncSceneSelection(), this.renderPanel(), this.rendered?.scene.classList.add("is-dragging");
    const f = u.parentElement;
    if (!f) return;
    const g = f.getBoundingClientRect(), w = A.clientX, v = A.clientY, U = Ps(l.x), L = Ps(l.y), C = A.pointerId, y = (b) => {
      if (b.pointerId !== C) return;
      b.preventDefault();
      const O = (b.clientX - w) / Math.max(g.width, 1) * 100, $ = (b.clientY - v) / Math.max(g.height, 1) * 100;
      l.x = `${Ns(U + O)}%`, l.y = `${Ns(L + $)}%`, u.style.left = l.x, u.style.top = l.y, this.emitChange();
    }, I = (b) => {
      b.pointerId === C && (window.removeEventListener("pointermove", y), window.removeEventListener("pointerup", I), window.removeEventListener("pointercancel", I), this.rendered?.scene.classList.remove("is-dragging"), this.renderPanel(), this.syncSceneSelection());
    };
    window.addEventListener("pointermove", y), window.addEventListener("pointerup", I), window.addEventListener("pointercancel", I);
  }
  updateSelectedElement(A) {
    const t = this.getSelectedElement();
    t && (Object.assign(t, A), this.renderScene(), this.renderPanel(), this.emitChange());
  }
  getSelectedElement() {
    const A = this.scene.layers[this.selection.layerIndex];
    return A ? $s(A.elements, this.selection.elementPath) : null;
  }
  getSelectedElementNode() {
    const A = this.rendered?.scene;
    if (!A) return null;
    const t = _s(this.selection);
    return Array.from(A.querySelectorAll(".pss-element")).find((n) => n.dataset.indexPath === t) || null;
  }
  syncSceneSelection() {
    const A = this.rendered?.scene;
    if (!A) return;
    const t = _s(this.selection);
    A.querySelectorAll(".pss-element.is-selected").forEach((i) => {
      i.classList.remove("is-selected"), i.removeAttribute("aria-selected");
    });
    const n = this.getSelectedElementNode();
    n && (n.classList.add("is-selected"), n.setAttribute("aria-selected", "true"), A.dataset.selectedIndexPath = t);
  }
  async save() {
    const A = Id(this.scene);
    if (A.length) {
      this.notify(A[0], "warning");
      return;
    }
    await this.options.onSave?.(this.getValue()), this.notify("Scene saved.", "success");
  }
  section(A, t) {
    const n = document.createElement("section"), i = document.createElement("h2");
    return n.className = "pss-section", i.textContent = A, n.append(i, ...t), n;
  }
  colorControl(A, t, n) {
    const i = document.createElement("label"), s = document.createElement("span"), l = document.createElement("input");
    return i.className = "pss-control", s.textContent = A, l.type = "color", l.name = Pi(A), l.value = t, l.addEventListener("input", () => n(l.value)), i.append(s, l), i;
  }
  textControl(A, t, n) {
    const i = document.createElement("label"), s = document.createElement("span"), l = document.createElement("input");
    return i.className = "pss-control", s.textContent = A, l.type = "text", l.name = Pi(A), l.value = t, l.addEventListener("change", () => n(l.value)), i.append(s, l), i;
  }
  rangeControl(A, t, n, i, s, l) {
    const u = document.createElement("label"), f = document.createElement("span"), g = document.createElement("input"), w = document.createElement("output");
    return u.className = "pss-control", f.textContent = A, g.type = "range", g.name = Pi(A), g.min = String(n), g.max = String(i), g.step = String(s), g.value = String(t), w.value = String(t), g.addEventListener("input", () => {
      w.value = g.value, l(Number(g.value));
    }), u.append(f, g, w), u;
  }
  emitChange() {
    this.options.onChange?.(this.getValue());
  }
  notify(A, t = "info") {
    if (this.options.notify) {
      this.options.notify(A, t);
      return;
    }
    t === "error" && console.error(A);
  }
  resolveMount(A) {
    const t = typeof A == "string" ? document.querySelector(A) : A;
    if (!t) throw new Error("Parallax Scene Studio mount element was not found.");
    return t;
  }
}
function Ps(e) {
  const A = Number.parseFloat(e);
  return Number.isFinite(A) ? A : 0;
}
function Ns(e) {
  return Math.round(e * 100) / 100;
}
function Kd(e) {
  const A = e?.image || "";
  return A ? A.replace(/"/g, "%22") : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%23262d38"/%3E%3C/svg%3E';
}
function Pi(e) {
  return e.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "control";
}
function _s(e) {
  return [e.layerIndex, ...e.elementPath].join(".");
}
function kd(e) {
  const A = e.split(".").map((i) => Number(i));
  if (A.length < 2 || A.some((i) => !Number.isInteger(i) || i < 0)) return null;
  const [t, ...n] = A;
  return { layerIndex: t, elementPath: n };
}
function $s(e, A) {
  let t = e[A[0]];
  for (const n of A.slice(1))
    if (t = t?.children?.[n], !t) return null;
  return t || null;
}
var Gs = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function sl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Or = { exports: {} };
var Od = Or.exports, Xs;
function Md() {
  return Xs || (Xs = 1, (function(e) {
    (function(A, t) {
      e.exports = A.document ? t(A, !0) : function(n) {
        if (!n.document)
          throw new Error("jQuery requires a window with a document");
        return t(n);
      };
    })(typeof window < "u" ? window : Od, function(A, t) {
      var n = [], i = Object.getPrototypeOf, s = n.slice, l = n.flat ? function(r) {
        return n.flat.call(r);
      } : function(r) {
        return n.concat.apply([], r);
      }, u = n.push, f = n.indexOf, g = {}, w = g.toString, v = g.hasOwnProperty, U = v.toString, L = U.call(Object), C = {}, y = function(a) {
        return typeof a == "function" && typeof a.nodeType != "number" && typeof a.item != "function";
      }, I = function(a) {
        return a != null && a === a.window;
      }, b = A.document, O = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
      };
      function $(r, a, o) {
        o = o || b;
        var d, h, p = o.createElement("script");
        if (p.text = r, a)
          for (d in O)
            h = a[d] || a.getAttribute && a.getAttribute(d), h && p.setAttribute(d, h);
        o.head.appendChild(p).parentNode.removeChild(p);
      }
      function M(r) {
        return r == null ? r + "" : typeof r == "object" || typeof r == "function" ? g[w.call(r)] || "object" : typeof r;
      }
      var _ = "3.7.1", R = /HTML$/i, c = function(r, a) {
        return new c.fn.init(r, a);
      };
      c.fn = c.prototype = {
        // The current version of jQuery being used
        jquery: _,
        constructor: c,
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function() {
          return s.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(r) {
          return r == null ? s.call(this) : r < 0 ? this[r + this.length] : this[r];
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(r) {
          var a = c.merge(this.constructor(), r);
          return a.prevObject = this, a;
        },
        // Execute a callback for every element in the matched set.
        each: function(r) {
          return c.each(this, r);
        },
        map: function(r) {
          return this.pushStack(c.map(this, function(a, o) {
            return r.call(a, o, a);
          }));
        },
        slice: function() {
          return this.pushStack(s.apply(this, arguments));
        },
        first: function() {
          return this.eq(0);
        },
        last: function() {
          return this.eq(-1);
        },
        even: function() {
          return this.pushStack(c.grep(this, function(r, a) {
            return (a + 1) % 2;
          }));
        },
        odd: function() {
          return this.pushStack(c.grep(this, function(r, a) {
            return a % 2;
          }));
        },
        eq: function(r) {
          var a = this.length, o = +r + (r < 0 ? a : 0);
          return this.pushStack(o >= 0 && o < a ? [this[o]] : []);
        },
        end: function() {
          return this.prevObject || this.constructor();
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: u,
        sort: n.sort,
        splice: n.splice
      }, c.extend = c.fn.extend = function() {
        var r, a, o, d, h, p, B = arguments[0] || {}, F = 1, Q = arguments.length, x = !1;
        for (typeof B == "boolean" && (x = B, B = arguments[F] || {}, F++), typeof B != "object" && !y(B) && (B = {}), F === Q && (B = this, F--); F < Q; F++)
          if ((r = arguments[F]) != null)
            for (a in r)
              d = r[a], !(a === "__proto__" || B === d) && (x && d && (c.isPlainObject(d) || (h = Array.isArray(d))) ? (o = B[a], h && !Array.isArray(o) ? p = [] : !h && !c.isPlainObject(o) ? p = {} : p = o, h = !1, B[a] = c.extend(x, p, d)) : d !== void 0 && (B[a] = d));
        return B;
      }, c.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (_ + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: !0,
        error: function(r) {
          throw new Error(r);
        },
        noop: function() {
        },
        isPlainObject: function(r) {
          var a, o;
          return !r || w.call(r) !== "[object Object]" ? !1 : (a = i(r), a ? (o = v.call(a, "constructor") && a.constructor, typeof o == "function" && U.call(o) === L) : !0);
        },
        isEmptyObject: function(r) {
          var a;
          for (a in r)
            return !1;
          return !0;
        },
        // Evaluates a script in a provided context; falls back to the global one
        // if not specified.
        globalEval: function(r, a, o) {
          $(r, { nonce: a && a.nonce }, o);
        },
        each: function(r, a) {
          var o, d = 0;
          if (AA(r))
            for (o = r.length; d < o && a.call(r[d], d, r[d]) !== !1; d++)
              ;
          else
            for (d in r)
              if (a.call(r[d], d, r[d]) === !1)
                break;
          return r;
        },
        // Retrieve the text value of an array of DOM nodes
        text: function(r) {
          var a, o = "", d = 0, h = r.nodeType;
          if (!h)
            for (; a = r[d++]; )
              o += c.text(a);
          return h === 1 || h === 11 ? r.textContent : h === 9 ? r.documentElement.textContent : h === 3 || h === 4 ? r.nodeValue : o;
        },
        // results is for internal usage only
        makeArray: function(r, a) {
          var o = a || [];
          return r != null && (AA(Object(r)) ? c.merge(
            o,
            typeof r == "string" ? [r] : r
          ) : u.call(o, r)), o;
        },
        inArray: function(r, a, o) {
          return a == null ? -1 : f.call(a, r, o);
        },
        isXMLDoc: function(r) {
          var a = r && r.namespaceURI, o = r && (r.ownerDocument || r).documentElement;
          return !R.test(a || o && o.nodeName || "HTML");
        },
        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function(r, a) {
          for (var o = +a.length, d = 0, h = r.length; d < o; d++)
            r[h++] = a[d];
          return r.length = h, r;
        },
        grep: function(r, a, o) {
          for (var d, h = [], p = 0, B = r.length, F = !o; p < B; p++)
            d = !a(r[p], p), d !== F && h.push(r[p]);
          return h;
        },
        // arg is for internal usage only
        map: function(r, a, o) {
          var d, h, p = 0, B = [];
          if (AA(r))
            for (d = r.length; p < d; p++)
              h = a(r[p], p, o), h != null && B.push(h);
          else
            for (p in r)
              h = a(r[p], p, o), h != null && B.push(h);
          return l(B);
        },
        // A global GUID counter for objects
        guid: 1,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: C
      }), typeof Symbol == "function" && (c.fn[Symbol.iterator] = n[Symbol.iterator]), c.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(r, a) {
          g["[object " + a + "]"] = a.toLowerCase();
        }
      );
      function AA(r) {
        var a = !!r && "length" in r && r.length, o = M(r);
        return y(r) || I(r) ? !1 : o === "array" || a === 0 || typeof a == "number" && a > 0 && a - 1 in r;
      }
      function N(r, a) {
        return r.nodeName && r.nodeName.toLowerCase() === a.toLowerCase();
      }
      var gA = n.pop, FA = n.sort, SA = n.splice, j = "[\\x20\\t\\r\\n\\f]", BA = new RegExp(
        "^" + j + "+|((?:^|[^\\\\])(?:\\\\.)*)" + j + "+$",
        "g"
      );
      c.contains = function(r, a) {
        var o = a && a.parentNode;
        return r === o || !!(o && o.nodeType === 1 && // Support: IE 9 - 11+
        // IE doesn't have `contains` on SVG.
        (r.contains ? r.contains(o) : r.compareDocumentPosition && r.compareDocumentPosition(o) & 16));
      };
      var VA = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
      function UA(r, a) {
        return a ? r === "\0" ? "�" : r.slice(0, -1) + "\\" + r.charCodeAt(r.length - 1).toString(16) + " " : "\\" + r;
      }
      c.escapeSelector = function(r) {
        return (r + "").replace(VA, UA);
      };
      var vA = b, NA = u;
      (function() {
        var r, a, o, d, h, p = NA, B, F, Q, x, D, k = c.expando, S = 0, P = 0, rA = rr(), hA = rr(), sA = rr(), _A = rr(), MA = function(m, E) {
          return m === E && (h = !0), 0;
        }, Le = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", Te = "(?:\\\\[\\da-fA-F]{1,6}" + j + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", cA = "\\[" + j + "*(" + Te + ")(?:" + j + // Operator (capture 2)
        "*([*^$|!~]?=)" + j + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + Te + "))|)" + j + "*\\]", Ct = ":(" + Te + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + cA + ")*)|.*)\\)|)", pA = new RegExp(j + "+", "g"), IA = new RegExp("^" + j + "*," + j + "*"), gn = new RegExp("^" + j + "*([>+~]|" + j + ")" + j + "*"), Ti = new RegExp(j + "|>"), De = new RegExp(Ct), Bn = new RegExp("^" + Te + "$"), Ke = {
          ID: new RegExp("^#(" + Te + ")"),
          CLASS: new RegExp("^\\.(" + Te + ")"),
          TAG: new RegExp("^(" + Te + "|[*])"),
          ATTR: new RegExp("^" + cA),
          PSEUDO: new RegExp("^" + Ct),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + j + "*(even|odd|(([+-]|)(\\d*)n|)" + j + "*(?:([+-]|)" + j + "*(\\d+)|))" + j + "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + Le + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + j + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + j + "*((?:-\\d)?\\d*)" + j + "*\\)|)(?=[^-]|$)", "i")
        }, et = /^(?:input|select|textarea|button)$/i, tt = /^h\d$/i, pe = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Di = /[+~]/, Ge = new RegExp("\\\\[\\da-fA-F]{1,6}" + j + "?|\\\\([^\\r\\n\\f])", "g"), Xe = function(m, E) {
          var H = "0x" + m.slice(1) - 65536;
          return E || (H < 0 ? String.fromCharCode(H + 65536) : String.fromCharCode(H >> 10 | 55296, H & 1023 | 56320));
        }, vd = function() {
          nt();
        }, md = ar(
          function(m) {
            return m.disabled === !0 && N(m, "fieldset");
          },
          { dir: "parentNode", next: "legend" }
        );
        function yd() {
          try {
            return B.activeElement;
          } catch {
          }
        }
        try {
          p.apply(
            n = s.call(vA.childNodes),
            vA.childNodes
          ), n[vA.childNodes.length].nodeType;
        } catch {
          p = {
            apply: function(E, H) {
              NA.apply(E, s.call(H));
            },
            call: function(E) {
              NA.apply(E, s.call(arguments, 1));
            }
          };
        }
        function mA(m, E, H, T) {
          var K, G, Y, z, W, oA, tA, iA = E && E.ownerDocument, lA = E ? E.nodeType : 9;
          if (H = H || [], typeof m != "string" || !m || lA !== 1 && lA !== 9 && lA !== 11)
            return H;
          if (!T && (nt(E), E = E || B, Q)) {
            if (lA !== 11 && (W = pe.exec(m)))
              if (K = W[1]) {
                if (lA === 9)
                  if (Y = E.getElementById(K)) {
                    if (Y.id === K)
                      return p.call(H, Y), H;
                  } else
                    return H;
                else if (iA && (Y = iA.getElementById(K)) && mA.contains(E, Y) && Y.id === K)
                  return p.call(H, Y), H;
              } else {
                if (W[2])
                  return p.apply(H, E.getElementsByTagName(m)), H;
                if ((K = W[3]) && E.getElementsByClassName)
                  return p.apply(H, E.getElementsByClassName(K)), H;
              }
            if (!_A[m + " "] && (!x || !x.test(m))) {
              if (tA = m, iA = E, lA === 1 && (Ti.test(m) || gn.test(m))) {
                for (iA = Di.test(m) && Ki(E.parentNode) || E, (iA != E || !C.scope) && ((z = E.getAttribute("id")) ? z = c.escapeSelector(z) : E.setAttribute("id", z = k)), oA = wn(m), G = oA.length; G--; )
                  oA[G] = (z ? "#" + z : ":scope") + " " + ir(oA[G]);
                tA = oA.join(",");
              }
              try {
                return p.apply(
                  H,
                  iA.querySelectorAll(tA)
                ), H;
              } catch {
                _A(m, !0);
              } finally {
                z === k && E.removeAttribute("id");
              }
            }
          }
          return Ms(m.replace(BA, "$1"), E, H, T);
        }
        function rr() {
          var m = [];
          function E(H, T) {
            return m.push(H + " ") > a.cacheLength && delete E[m.shift()], E[H + " "] = T;
          }
          return E;
        }
        function Fe(m) {
          return m[k] = !0, m;
        }
        function Pt(m) {
          var E = B.createElement("fieldset");
          try {
            return !!m(E);
          } catch {
            return !1;
          } finally {
            E.parentNode && E.parentNode.removeChild(E), E = null;
          }
        }
        function Cd(m) {
          return function(E) {
            return N(E, "input") && E.type === m;
          };
        }
        function Qd(m) {
          return function(E) {
            return (N(E, "input") || N(E, "button")) && E.type === m;
          };
        }
        function ks(m) {
          return function(E) {
            return "form" in E ? E.parentNode && E.disabled === !1 ? "label" in E ? "label" in E.parentNode ? E.parentNode.disabled === m : E.disabled === m : E.isDisabled === m || // Where there is no isDisabled, check manually
            E.isDisabled !== !m && md(E) === m : E.disabled === m : "label" in E ? E.disabled === m : !1;
          };
        }
        function Qt(m) {
          return Fe(function(E) {
            return E = +E, Fe(function(H, T) {
              for (var K, G = m([], H.length, E), Y = G.length; Y--; )
                H[K = G[Y]] && (H[K] = !(T[K] = H[K]));
            });
          });
        }
        function Ki(m) {
          return m && typeof m.getElementsByTagName < "u" && m;
        }
        function nt(m) {
          var E, H = m ? m.ownerDocument || m : vA;
          return H == B || H.nodeType !== 9 || !H.documentElement || (B = H, F = B.documentElement, Q = !c.isXMLDoc(B), D = F.matches || F.webkitMatchesSelector || F.msMatchesSelector, F.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
          // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
          // two documents; shallow comparisons work.
          // eslint-disable-next-line eqeqeq
          vA != B && (E = B.defaultView) && E.top !== E && E.addEventListener("unload", vd), C.getById = Pt(function(T) {
            return F.appendChild(T).id = c.expando, !B.getElementsByName || !B.getElementsByName(c.expando).length;
          }), C.disconnectedMatch = Pt(function(T) {
            return D.call(T, "*");
          }), C.scope = Pt(function() {
            return B.querySelectorAll(":scope");
          }), C.cssHas = Pt(function() {
            try {
              return B.querySelector(":has(*,:jqfake)"), !1;
            } catch {
              return !0;
            }
          }), C.getById ? (a.filter.ID = function(T) {
            var K = T.replace(Ge, Xe);
            return function(G) {
              return G.getAttribute("id") === K;
            };
          }, a.find.ID = function(T, K) {
            if (typeof K.getElementById < "u" && Q) {
              var G = K.getElementById(T);
              return G ? [G] : [];
            }
          }) : (a.filter.ID = function(T) {
            var K = T.replace(Ge, Xe);
            return function(G) {
              var Y = typeof G.getAttributeNode < "u" && G.getAttributeNode("id");
              return Y && Y.value === K;
            };
          }, a.find.ID = function(T, K) {
            if (typeof K.getElementById < "u" && Q) {
              var G, Y, z, W = K.getElementById(T);
              if (W) {
                if (G = W.getAttributeNode("id"), G && G.value === T)
                  return [W];
                for (z = K.getElementsByName(T), Y = 0; W = z[Y++]; )
                  if (G = W.getAttributeNode("id"), G && G.value === T)
                    return [W];
              }
              return [];
            }
          }), a.find.TAG = function(T, K) {
            return typeof K.getElementsByTagName < "u" ? K.getElementsByTagName(T) : K.querySelectorAll(T);
          }, a.find.CLASS = function(T, K) {
            if (typeof K.getElementsByClassName < "u" && Q)
              return K.getElementsByClassName(T);
          }, x = [], Pt(function(T) {
            var K;
            F.appendChild(T).innerHTML = "<a id='" + k + "' href='' disabled='disabled'></a><select id='" + k + "-\r\\' disabled='disabled'><option selected=''></option></select>", T.querySelectorAll("[selected]").length || x.push("\\[" + j + "*(?:value|" + Le + ")"), T.querySelectorAll("[id~=" + k + "-]").length || x.push("~="), T.querySelectorAll("a#" + k + "+*").length || x.push(".#.+[+~]"), T.querySelectorAll(":checked").length || x.push(":checked"), K = B.createElement("input"), K.setAttribute("type", "hidden"), T.appendChild(K).setAttribute("name", "D"), F.appendChild(T).disabled = !0, T.querySelectorAll(":disabled").length !== 2 && x.push(":enabled", ":disabled"), K = B.createElement("input"), K.setAttribute("name", ""), T.appendChild(K), T.querySelectorAll("[name='']").length || x.push("\\[" + j + "*name" + j + "*=" + j + `*(?:''|"")`);
          }), C.cssHas || x.push(":has"), x = x.length && new RegExp(x.join("|")), MA = function(T, K) {
            if (T === K)
              return h = !0, 0;
            var G = !T.compareDocumentPosition - !K.compareDocumentPosition;
            return G || (G = (T.ownerDocument || T) == (K.ownerDocument || K) ? T.compareDocumentPosition(K) : (
              // Otherwise we know they are disconnected
              1
            ), G & 1 || !C.sortDetached && K.compareDocumentPosition(T) === G ? T === B || T.ownerDocument == vA && mA.contains(vA, T) ? -1 : K === B || K.ownerDocument == vA && mA.contains(vA, K) ? 1 : d ? f.call(d, T) - f.call(d, K) : 0 : G & 4 ? -1 : 1);
          }), B;
        }
        mA.matches = function(m, E) {
          return mA(m, null, null, E);
        }, mA.matchesSelector = function(m, E) {
          if (nt(m), Q && !_A[E + " "] && (!x || !x.test(E)))
            try {
              var H = D.call(m, E);
              if (H || C.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              m.document && m.document.nodeType !== 11)
                return H;
            } catch {
              _A(E, !0);
            }
          return mA(E, B, null, [m]).length > 0;
        }, mA.contains = function(m, E) {
          return (m.ownerDocument || m) != B && nt(m), c.contains(m, E);
        }, mA.attr = function(m, E) {
          (m.ownerDocument || m) != B && nt(m);
          var H = a.attrHandle[E.toLowerCase()], T = H && v.call(a.attrHandle, E.toLowerCase()) ? H(m, E, !Q) : void 0;
          return T !== void 0 ? T : m.getAttribute(E);
        }, mA.error = function(m) {
          throw new Error("Syntax error, unrecognized expression: " + m);
        }, c.uniqueSort = function(m) {
          var E, H = [], T = 0, K = 0;
          if (h = !C.sortStable, d = !C.sortStable && s.call(m, 0), FA.call(m, MA), h) {
            for (; E = m[K++]; )
              E === m[K] && (T = H.push(K));
            for (; T--; )
              SA.call(m, H[T], 1);
          }
          return d = null, m;
        }, c.fn.uniqueSort = function() {
          return this.pushStack(c.uniqueSort(s.apply(this)));
        }, a = c.expr = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: Fe,
          match: Ke,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: !0 },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: !0 },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(m) {
              return m[1] = m[1].replace(Ge, Xe), m[3] = (m[3] || m[4] || m[5] || "").replace(Ge, Xe), m[2] === "~=" && (m[3] = " " + m[3] + " "), m.slice(0, 4);
            },
            CHILD: function(m) {
              return m[1] = m[1].toLowerCase(), m[1].slice(0, 3) === "nth" ? (m[3] || mA.error(m[0]), m[4] = +(m[4] ? m[5] + (m[6] || 1) : 2 * (m[3] === "even" || m[3] === "odd")), m[5] = +(m[7] + m[8] || m[3] === "odd")) : m[3] && mA.error(m[0]), m;
            },
            PSEUDO: function(m) {
              var E, H = !m[6] && m[2];
              return Ke.CHILD.test(m[0]) ? null : (m[3] ? m[2] = m[4] || m[5] || "" : H && De.test(H) && // Get excess from tokenize (recursively)
              (E = wn(H, !0)) && // advance to the next closing parenthesis
              (E = H.indexOf(")", H.length - E) - H.length) && (m[0] = m[0].slice(0, E), m[2] = H.slice(0, E)), m.slice(0, 3));
            }
          },
          filter: {
            TAG: function(m) {
              var E = m.replace(Ge, Xe).toLowerCase();
              return m === "*" ? function() {
                return !0;
              } : function(H) {
                return N(H, E);
              };
            },
            CLASS: function(m) {
              var E = rA[m + " "];
              return E || (E = new RegExp("(^|" + j + ")" + m + "(" + j + "|$)")) && rA(m, function(H) {
                return E.test(
                  typeof H.className == "string" && H.className || typeof H.getAttribute < "u" && H.getAttribute("class") || ""
                );
              });
            },
            ATTR: function(m, E, H) {
              return function(T) {
                var K = mA.attr(T, m);
                return K == null ? E === "!=" : E ? (K += "", E === "=" ? K === H : E === "!=" ? K !== H : E === "^=" ? H && K.indexOf(H) === 0 : E === "*=" ? H && K.indexOf(H) > -1 : E === "$=" ? H && K.slice(-H.length) === H : E === "~=" ? (" " + K.replace(pA, " ") + " ").indexOf(H) > -1 : E === "|=" ? K === H || K.slice(0, H.length + 1) === H + "-" : !1) : !0;
              };
            },
            CHILD: function(m, E, H, T, K) {
              var G = m.slice(0, 3) !== "nth", Y = m.slice(-4) !== "last", z = E === "of-type";
              return T === 1 && K === 0 ? (
                // Shortcut for :nth-*(n)
                function(W) {
                  return !!W.parentNode;
                }
              ) : function(W, oA, tA) {
                var iA, lA, Z, CA, ne, YA = G !== Y ? "nextSibling" : "previousSibling", ge = W.parentNode, ke = z && W.nodeName.toLowerCase(), Nt = !tA && !z, zA = !1;
                if (ge) {
                  if (G) {
                    for (; YA; ) {
                      for (Z = W; Z = Z[YA]; )
                        if (z ? N(Z, ke) : Z.nodeType === 1)
                          return !1;
                      ne = YA = m === "only" && !ne && "nextSibling";
                    }
                    return !0;
                  }
                  if (ne = [Y ? ge.firstChild : ge.lastChild], Y && Nt) {
                    for (lA = ge[k] || (ge[k] = {}), iA = lA[m] || [], CA = iA[0] === S && iA[1], zA = CA && iA[2], Z = CA && ge.childNodes[CA]; Z = ++CA && Z && Z[YA] || // Fallback to seeking `elem` from the start
                    (zA = CA = 0) || ne.pop(); )
                      if (Z.nodeType === 1 && ++zA && Z === W) {
                        lA[m] = [S, CA, zA];
                        break;
                      }
                  } else if (Nt && (lA = W[k] || (W[k] = {}), iA = lA[m] || [], CA = iA[0] === S && iA[1], zA = CA), zA === !1)
                    for (; (Z = ++CA && Z && Z[YA] || (zA = CA = 0) || ne.pop()) && !((z ? N(Z, ke) : Z.nodeType === 1) && ++zA && (Nt && (lA = Z[k] || (Z[k] = {}), lA[m] = [S, zA]), Z === W)); )
                      ;
                  return zA -= K, zA === T || zA % T === 0 && zA / T >= 0;
                }
              };
            },
            PSEUDO: function(m, E) {
              var H, T = a.pseudos[m] || a.setFilters[m.toLowerCase()] || mA.error("unsupported pseudo: " + m);
              return T[k] ? T(E) : T.length > 1 ? (H = [m, m, "", E], a.setFilters.hasOwnProperty(m.toLowerCase()) ? Fe(function(K, G) {
                for (var Y, z = T(K, E), W = z.length; W--; )
                  Y = f.call(K, z[W]), K[Y] = !(G[Y] = z[W]);
              }) : function(K) {
                return T(K, 0, H);
              }) : T;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: Fe(function(m) {
              var E = [], H = [], T = Ri(m.replace(BA, "$1"));
              return T[k] ? Fe(function(K, G, Y, z) {
                for (var W, oA = T(K, null, z, []), tA = K.length; tA--; )
                  (W = oA[tA]) && (K[tA] = !(G[tA] = W));
              }) : function(K, G, Y) {
                return E[0] = K, T(E, null, Y, H), E[0] = null, !H.pop();
              };
            }),
            has: Fe(function(m) {
              return function(E) {
                return mA(m, E).length > 0;
              };
            }),
            contains: Fe(function(m) {
              return m = m.replace(Ge, Xe), function(E) {
                return (E.textContent || c.text(E)).indexOf(m) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // https://www.w3.org/TR/selectors/#lang-pseudo
            lang: Fe(function(m) {
              return Bn.test(m || "") || mA.error("unsupported lang: " + m), m = m.replace(Ge, Xe).toLowerCase(), function(E) {
                var H;
                do
                  if (H = Q ? E.lang : E.getAttribute("xml:lang") || E.getAttribute("lang"))
                    return H = H.toLowerCase(), H === m || H.indexOf(m + "-") === 0;
                while ((E = E.parentNode) && E.nodeType === 1);
                return !1;
              };
            }),
            // Miscellaneous
            target: function(m) {
              var E = A.location && A.location.hash;
              return E && E.slice(1) === m.id;
            },
            root: function(m) {
              return m === F;
            },
            focus: function(m) {
              return m === yd() && B.hasFocus() && !!(m.type || m.href || ~m.tabIndex);
            },
            // Boolean properties
            enabled: ks(!1),
            disabled: ks(!0),
            checked: function(m) {
              return N(m, "input") && !!m.checked || N(m, "option") && !!m.selected;
            },
            selected: function(m) {
              return m.parentNode && m.parentNode.selectedIndex, m.selected === !0;
            },
            // Contents
            empty: function(m) {
              for (m = m.firstChild; m; m = m.nextSibling)
                if (m.nodeType < 6)
                  return !1;
              return !0;
            },
            parent: function(m) {
              return !a.pseudos.empty(m);
            },
            // Element/input types
            header: function(m) {
              return tt.test(m.nodeName);
            },
            input: function(m) {
              return et.test(m.nodeName);
            },
            button: function(m) {
              return N(m, "input") && m.type === "button" || N(m, "button");
            },
            text: function(m) {
              var E;
              return N(m, "input") && m.type === "text" && // Support: IE <10 only
              // New HTML5 attribute values (e.g., "search") appear
              // with elem.type === "text"
              ((E = m.getAttribute("type")) == null || E.toLowerCase() === "text");
            },
            // Position-in-collection
            first: Qt(function() {
              return [0];
            }),
            last: Qt(function(m, E) {
              return [E - 1];
            }),
            eq: Qt(function(m, E, H) {
              return [H < 0 ? H + E : H];
            }),
            even: Qt(function(m, E) {
              for (var H = 0; H < E; H += 2)
                m.push(H);
              return m;
            }),
            odd: Qt(function(m, E) {
              for (var H = 1; H < E; H += 2)
                m.push(H);
              return m;
            }),
            lt: Qt(function(m, E, H) {
              var T;
              for (H < 0 ? T = H + E : H > E ? T = E : T = H; --T >= 0; )
                m.push(T);
              return m;
            }),
            gt: Qt(function(m, E, H) {
              for (var T = H < 0 ? H + E : H; ++T < E; )
                m.push(T);
              return m;
            })
          }
        }, a.pseudos.nth = a.pseudos.eq;
        for (r in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
          a.pseudos[r] = Cd(r);
        for (r in { submit: !0, reset: !0 })
          a.pseudos[r] = Qd(r);
        function Os() {
        }
        Os.prototype = a.filters = a.pseudos, a.setFilters = new Os();
        function wn(m, E) {
          var H, T, K, G, Y, z, W, oA = hA[m + " "];
          if (oA)
            return E ? 0 : oA.slice(0);
          for (Y = m, z = [], W = a.preFilter; Y; ) {
            (!H || (T = IA.exec(Y))) && (T && (Y = Y.slice(T[0].length) || Y), z.push(K = [])), H = !1, (T = gn.exec(Y)) && (H = T.shift(), K.push({
              value: H,
              // Cast descendant combinators to space
              type: T[0].replace(BA, " ")
            }), Y = Y.slice(H.length));
            for (G in a.filter)
              (T = Ke[G].exec(Y)) && (!W[G] || (T = W[G](T))) && (H = T.shift(), K.push({
                value: H,
                type: G,
                matches: T
              }), Y = Y.slice(H.length));
            if (!H)
              break;
          }
          return E ? Y.length : Y ? mA.error(m) : (
            // Cache the tokens
            hA(m, z).slice(0)
          );
        }
        function ir(m) {
          for (var E = 0, H = m.length, T = ""; E < H; E++)
            T += m[E].value;
          return T;
        }
        function ar(m, E, H) {
          var T = E.dir, K = E.next, G = K || T, Y = H && G === "parentNode", z = P++;
          return E.first ? (
            // Check against closest ancestor/preceding element
            function(W, oA, tA) {
              for (; W = W[T]; )
                if (W.nodeType === 1 || Y)
                  return m(W, oA, tA);
              return !1;
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(W, oA, tA) {
              var iA, lA, Z = [S, z];
              if (tA) {
                for (; W = W[T]; )
                  if ((W.nodeType === 1 || Y) && m(W, oA, tA))
                    return !0;
              } else
                for (; W = W[T]; )
                  if (W.nodeType === 1 || Y)
                    if (lA = W[k] || (W[k] = {}), K && N(W, K))
                      W = W[T] || W;
                    else {
                      if ((iA = lA[G]) && iA[0] === S && iA[1] === z)
                        return Z[2] = iA[2];
                      if (lA[G] = Z, Z[2] = m(W, oA, tA))
                        return !0;
                    }
              return !1;
            }
          );
        }
        function ki(m) {
          return m.length > 1 ? function(E, H, T) {
            for (var K = m.length; K--; )
              if (!m[K](E, H, T))
                return !1;
            return !0;
          } : m[0];
        }
        function Fd(m, E, H) {
          for (var T = 0, K = E.length; T < K; T++)
            mA(m, E[T], H);
          return H;
        }
        function sr(m, E, H, T, K) {
          for (var G, Y = [], z = 0, W = m.length, oA = E != null; z < W; z++)
            (G = m[z]) && (!H || H(G, T, K)) && (Y.push(G), oA && E.push(z));
          return Y;
        }
        function Oi(m, E, H, T, K, G) {
          return T && !T[k] && (T = Oi(T)), K && !K[k] && (K = Oi(K, G)), Fe(function(Y, z, W, oA) {
            var tA, iA, lA, Z, CA = [], ne = [], YA = z.length, ge = Y || Fd(
              E || "*",
              W.nodeType ? [W] : W,
              []
            ), ke = m && (Y || !E) ? sr(ge, CA, m, W, oA) : ge;
            if (H ? (Z = K || (Y ? m : YA || T) ? (
              // ...intermediate processing is necessary
              []
            ) : (
              // ...otherwise use results directly
              z
            ), H(ke, Z, W, oA)) : Z = ke, T)
              for (tA = sr(Z, ne), T(tA, [], W, oA), iA = tA.length; iA--; )
                (lA = tA[iA]) && (Z[ne[iA]] = !(ke[ne[iA]] = lA));
            if (Y) {
              if (K || m) {
                if (K) {
                  for (tA = [], iA = Z.length; iA--; )
                    (lA = Z[iA]) && tA.push(ke[iA] = lA);
                  K(null, Z = [], tA, oA);
                }
                for (iA = Z.length; iA--; )
                  (lA = Z[iA]) && (tA = K ? f.call(Y, lA) : CA[iA]) > -1 && (Y[tA] = !(z[tA] = lA));
              }
            } else
              Z = sr(
                Z === z ? Z.splice(YA, Z.length) : Z
              ), K ? K(null, z, Z, oA) : p.apply(z, Z);
          });
        }
        function Mi(m) {
          for (var E, H, T, K = m.length, G = a.relative[m[0].type], Y = G || a.relative[" "], z = G ? 1 : 0, W = ar(function(iA) {
            return iA === E;
          }, Y, !0), oA = ar(function(iA) {
            return f.call(E, iA) > -1;
          }, Y, !0), tA = [function(iA, lA, Z) {
            var CA = !G && (Z || lA != o) || ((E = lA).nodeType ? W(iA, lA, Z) : oA(iA, lA, Z));
            return E = null, CA;
          }]; z < K; z++)
            if (H = a.relative[m[z].type])
              tA = [ar(ki(tA), H)];
            else {
              if (H = a.filter[m[z].type].apply(null, m[z].matches), H[k]) {
                for (T = ++z; T < K && !a.relative[m[T].type]; T++)
                  ;
                return Oi(
                  z > 1 && ki(tA),
                  z > 1 && ir(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    m.slice(0, z - 1).concat({ value: m[z - 2].type === " " ? "*" : "" })
                  ).replace(BA, "$1"),
                  H,
                  z < T && Mi(m.slice(z, T)),
                  T < K && Mi(m = m.slice(T)),
                  T < K && ir(m)
                );
              }
              tA.push(H);
            }
          return ki(tA);
        }
        function Ud(m, E) {
          var H = E.length > 0, T = m.length > 0, K = function(G, Y, z, W, oA) {
            var tA, iA, lA, Z = 0, CA = "0", ne = G && [], YA = [], ge = o, ke = G || T && a.find.TAG("*", oA), Nt = S += ge == null ? 1 : Math.random() || 0.1, zA = ke.length;
            for (oA && (o = Y == B || Y || oA); CA !== zA && (tA = ke[CA]) != null; CA++) {
              if (T && tA) {
                for (iA = 0, !Y && tA.ownerDocument != B && (nt(tA), z = !Q); lA = m[iA++]; )
                  if (lA(tA, Y || B, z)) {
                    p.call(W, tA);
                    break;
                  }
                oA && (S = Nt);
              }
              H && ((tA = !lA && tA) && Z--, G && ne.push(tA));
            }
            if (Z += CA, H && CA !== Z) {
              for (iA = 0; lA = E[iA++]; )
                lA(ne, YA, Y, z);
              if (G) {
                if (Z > 0)
                  for (; CA--; )
                    ne[CA] || YA[CA] || (YA[CA] = gA.call(W));
                YA = sr(YA);
              }
              p.apply(W, YA), oA && !G && YA.length > 0 && Z + E.length > 1 && c.uniqueSort(W);
            }
            return oA && (S = Nt, o = ge), ne;
          };
          return H ? Fe(K) : K;
        }
        function Ri(m, E) {
          var H, T = [], K = [], G = sA[m + " "];
          if (!G) {
            for (E || (E = wn(m)), H = E.length; H--; )
              G = Mi(E[H]), G[k] ? T.push(G) : K.push(G);
            G = sA(
              m,
              Ud(K, T)
            ), G.selector = m;
          }
          return G;
        }
        function Ms(m, E, H, T) {
          var K, G, Y, z, W, oA = typeof m == "function" && m, tA = !T && wn(m = oA.selector || m);
          if (H = H || [], tA.length === 1) {
            if (G = tA[0] = tA[0].slice(0), G.length > 2 && (Y = G[0]).type === "ID" && E.nodeType === 9 && Q && a.relative[G[1].type]) {
              if (E = (a.find.ID(
                Y.matches[0].replace(Ge, Xe),
                E
              ) || [])[0], E)
                oA && (E = E.parentNode);
              else return H;
              m = m.slice(G.shift().value.length);
            }
            for (K = Ke.needsContext.test(m) ? 0 : G.length; K-- && (Y = G[K], !a.relative[z = Y.type]); )
              if ((W = a.find[z]) && (T = W(
                Y.matches[0].replace(Ge, Xe),
                Di.test(G[0].type) && Ki(E.parentNode) || E
              ))) {
                if (G.splice(K, 1), m = T.length && ir(G), !m)
                  return p.apply(H, T), H;
                break;
              }
          }
          return (oA || Ri(m, tA))(
            T,
            E,
            !Q,
            H,
            !E || Di.test(m) && Ki(E.parentNode) || E
          ), H;
        }
        C.sortStable = k.split("").sort(MA).join("") === k, nt(), C.sortDetached = Pt(function(m) {
          return m.compareDocumentPosition(B.createElement("fieldset")) & 1;
        }), c.find = mA, c.expr[":"] = c.expr.pseudos, c.unique = c.uniqueSort, mA.compile = Ri, mA.select = Ms, mA.setDocument = nt, mA.tokenize = wn, mA.escape = c.escapeSelector, mA.getText = c.text, mA.isXML = c.isXMLDoc, mA.selectors = c.expr, mA.support = c.support, mA.uniqueSort = c.uniqueSort;
      })();
      var OA = function(r, a, o) {
        for (var d = [], h = o !== void 0; (r = r[a]) && r.nodeType !== 9; )
          if (r.nodeType === 1) {
            if (h && c(r).is(o))
              break;
            d.push(r);
          }
        return d;
      }, ue = function(r, a) {
        for (var o = []; r; r = r.nextSibling)
          r.nodeType === 1 && r !== a && o.push(r);
        return o;
      }, se = c.expr.match.needsContext, fe = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
      function oe(r, a, o) {
        return y(a) ? c.grep(r, function(d, h) {
          return !!a.call(d, h, d) !== o;
        }) : a.nodeType ? c.grep(r, function(d) {
          return d === a !== o;
        }) : typeof a != "string" ? c.grep(r, function(d) {
          return f.call(a, d) > -1 !== o;
        }) : c.filter(a, r, o);
      }
      c.filter = function(r, a, o) {
        var d = a[0];
        return o && (r = ":not(" + r + ")"), a.length === 1 && d.nodeType === 1 ? c.find.matchesSelector(d, r) ? [d] : [] : c.find.matches(r, c.grep(a, function(h) {
          return h.nodeType === 1;
        }));
      }, c.fn.extend({
        find: function(r) {
          var a, o, d = this.length, h = this;
          if (typeof r != "string")
            return this.pushStack(c(r).filter(function() {
              for (a = 0; a < d; a++)
                if (c.contains(h[a], this))
                  return !0;
            }));
          for (o = this.pushStack([]), a = 0; a < d; a++)
            c.find(r, h[a], o);
          return d > 1 ? c.uniqueSort(o) : o;
        },
        filter: function(r) {
          return this.pushStack(oe(this, r || [], !1));
        },
        not: function(r) {
          return this.pushStack(oe(this, r || [], !0));
        },
        is: function(r) {
          return !!oe(
            this,
            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof r == "string" && se.test(r) ? c(r) : r || [],
            !1
          ).length;
        }
      });
      var Ie, Ce = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, At = c.fn.init = function(r, a, o) {
        var d, h;
        if (!r)
          return this;
        if (o = o || Ie, typeof r == "string")
          if (r[0] === "<" && r[r.length - 1] === ">" && r.length >= 3 ? d = [null, r, null] : d = Ce.exec(r), d && (d[1] || !a))
            if (d[1]) {
              if (a = a instanceof c ? a[0] : a, c.merge(this, c.parseHTML(
                d[1],
                a && a.nodeType ? a.ownerDocument || a : b,
                !0
              )), fe.test(d[1]) && c.isPlainObject(a))
                for (d in a)
                  y(this[d]) ? this[d](a[d]) : this.attr(d, a[d]);
              return this;
            } else
              return h = b.getElementById(d[2]), h && (this[0] = h, this.length = 1), this;
          else return !a || a.jquery ? (a || o).find(r) : this.constructor(a).find(r);
        else {
          if (r.nodeType)
            return this[0] = r, this.length = 1, this;
          if (y(r))
            return o.ready !== void 0 ? o.ready(r) : (
              // Execute immediately if ready is not present
              r(c)
            );
        }
        return c.makeArray(r, this);
      };
      At.prototype = c.fn, Ie = c(b);
      var wt = /^(?:parents|prev(?:Until|All))/, xc = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
      };
      c.fn.extend({
        has: function(r) {
          var a = c(r, this), o = a.length;
          return this.filter(function() {
            for (var d = 0; d < o; d++)
              if (c.contains(this, a[d]))
                return !0;
          });
        },
        closest: function(r, a) {
          var o, d = 0, h = this.length, p = [], B = typeof r != "string" && c(r);
          if (!se.test(r)) {
            for (; d < h; d++)
              for (o = this[d]; o && o !== a; o = o.parentNode)
                if (o.nodeType < 11 && (B ? B.index(o) > -1 : (
                  // Don't pass non-elements to jQuery#find
                  o.nodeType === 1 && c.find.matchesSelector(o, r)
                ))) {
                  p.push(o);
                  break;
                }
          }
          return this.pushStack(p.length > 1 ? c.uniqueSort(p) : p);
        },
        // Determine the position of an element within the set
        index: function(r) {
          return r ? typeof r == "string" ? f.call(c(r), this[0]) : f.call(
            this,
            // If it receives a jQuery object, the first element is used
            r.jquery ? r[0] : r
          ) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        },
        add: function(r, a) {
          return this.pushStack(
            c.uniqueSort(
              c.merge(this.get(), c(r, a))
            )
          );
        },
        addBack: function(r) {
          return this.add(
            r == null ? this.prevObject : this.prevObject.filter(r)
          );
        }
      });
      function ns(r, a) {
        for (; (r = r[a]) && r.nodeType !== 1; )
          ;
        return r;
      }
      c.each({
        parent: function(r) {
          var a = r.parentNode;
          return a && a.nodeType !== 11 ? a : null;
        },
        parents: function(r) {
          return OA(r, "parentNode");
        },
        parentsUntil: function(r, a, o) {
          return OA(r, "parentNode", o);
        },
        next: function(r) {
          return ns(r, "nextSibling");
        },
        prev: function(r) {
          return ns(r, "previousSibling");
        },
        nextAll: function(r) {
          return OA(r, "nextSibling");
        },
        prevAll: function(r) {
          return OA(r, "previousSibling");
        },
        nextUntil: function(r, a, o) {
          return OA(r, "nextSibling", o);
        },
        prevUntil: function(r, a, o) {
          return OA(r, "previousSibling", o);
        },
        siblings: function(r) {
          return ue((r.parentNode || {}).firstChild, r);
        },
        children: function(r) {
          return ue(r.firstChild);
        },
        contents: function(r) {
          return r.contentDocument != null && // Support: IE 11+
          // <object> elements with no `data` attribute has an object
          // `contentDocument` with a `null` prototype.
          i(r.contentDocument) ? r.contentDocument : (N(r, "template") && (r = r.content || r), c.merge([], r.childNodes));
        }
      }, function(r, a) {
        c.fn[r] = function(o, d) {
          var h = c.map(this, a, o);
          return r.slice(-5) !== "Until" && (d = o), d && typeof d == "string" && (h = c.filter(d, h)), this.length > 1 && (xc[r] || c.uniqueSort(h), wt.test(r) && h.reverse()), this.pushStack(h);
        };
      });
      var He = /[^\x20\t\r\n\f]+/g;
      function Ic(r) {
        var a = {};
        return c.each(r.match(He) || [], function(o, d) {
          a[d] = !0;
        }), a;
      }
      c.Callbacks = function(r) {
        r = typeof r == "string" ? Ic(r) : c.extend({}, r);
        var a, o, d, h, p = [], B = [], F = -1, Q = function() {
          for (h = h || r.once, d = a = !0; B.length; F = -1)
            for (o = B.shift(); ++F < p.length; )
              p[F].apply(o[0], o[1]) === !1 && r.stopOnFalse && (F = p.length, o = !1);
          r.memory || (o = !1), a = !1, h && (o ? p = [] : p = "");
        }, x = {
          // Add a callback or a collection of callbacks to the list
          add: function() {
            return p && (o && !a && (F = p.length - 1, B.push(o)), (function D(k) {
              c.each(k, function(S, P) {
                y(P) ? (!r.unique || !x.has(P)) && p.push(P) : P && P.length && M(P) !== "string" && D(P);
              });
            })(arguments), o && !a && Q()), this;
          },
          // Remove a callback from the list
          remove: function() {
            return c.each(arguments, function(D, k) {
              for (var S; (S = c.inArray(k, p, S)) > -1; )
                p.splice(S, 1), S <= F && F--;
            }), this;
          },
          // Check if a given callback is in the list.
          // If no argument is given, return whether or not list has callbacks attached.
          has: function(D) {
            return D ? c.inArray(D, p) > -1 : p.length > 0;
          },
          // Remove all callbacks from the list
          empty: function() {
            return p && (p = []), this;
          },
          // Disable .fire and .add
          // Abort any current/pending executions
          // Clear all callbacks and values
          disable: function() {
            return h = B = [], p = o = "", this;
          },
          disabled: function() {
            return !p;
          },
          // Disable .fire
          // Also disable .add unless we have memory (since it would have no effect)
          // Abort any pending executions
          lock: function() {
            return h = B = [], !o && !a && (p = o = ""), this;
          },
          locked: function() {
            return !!h;
          },
          // Call all callbacks with the given context and arguments
          fireWith: function(D, k) {
            return h || (k = k || [], k = [D, k.slice ? k.slice() : k], B.push(k), a || Q()), this;
          },
          // Call all the callbacks with the given arguments
          fire: function() {
            return x.fireWith(this, arguments), this;
          },
          // To know if the callbacks have already been called at least once
          fired: function() {
            return !!d;
          }
        };
        return x;
      };
      function Tt(r) {
        return r;
      }
      function zn(r) {
        throw r;
      }
      function rs(r, a, o, d) {
        var h;
        try {
          r && y(h = r.promise) ? h.call(r).done(a).fail(o) : r && y(h = r.then) ? h.call(r, a, o) : a.apply(void 0, [r].slice(d));
        } catch (p) {
          o.apply(void 0, [p]);
        }
      }
      c.extend({
        Deferred: function(r) {
          var a = [
            // action, add listener, callbacks,
            // ... .then handlers, argument index, [final state]
            [
              "notify",
              "progress",
              c.Callbacks("memory"),
              c.Callbacks("memory"),
              2
            ],
            [
              "resolve",
              "done",
              c.Callbacks("once memory"),
              c.Callbacks("once memory"),
              0,
              "resolved"
            ],
            [
              "reject",
              "fail",
              c.Callbacks("once memory"),
              c.Callbacks("once memory"),
              1,
              "rejected"
            ]
          ], o = "pending", d = {
            state: function() {
              return o;
            },
            always: function() {
              return h.done(arguments).fail(arguments), this;
            },
            catch: function(p) {
              return d.then(null, p);
            },
            // Keep pipe for back-compat
            pipe: function() {
              var p = arguments;
              return c.Deferred(function(B) {
                c.each(a, function(F, Q) {
                  var x = y(p[Q[4]]) && p[Q[4]];
                  h[Q[1]](function() {
                    var D = x && x.apply(this, arguments);
                    D && y(D.promise) ? D.promise().progress(B.notify).done(B.resolve).fail(B.reject) : B[Q[0] + "With"](
                      this,
                      x ? [D] : arguments
                    );
                  });
                }), p = null;
              }).promise();
            },
            then: function(p, B, F) {
              var Q = 0;
              function x(D, k, S, P) {
                return function() {
                  var rA = this, hA = arguments, sA = function() {
                    var MA, Le;
                    if (!(D < Q)) {
                      if (MA = S.apply(rA, hA), MA === k.promise())
                        throw new TypeError("Thenable self-resolution");
                      Le = MA && // Support: Promises/A+ section 2.3.4
                      // https://promisesaplus.com/#point-64
                      // Only check objects and functions for thenability
                      (typeof MA == "object" || typeof MA == "function") && MA.then, y(Le) ? P ? Le.call(
                        MA,
                        x(Q, k, Tt, P),
                        x(Q, k, zn, P)
                      ) : (Q++, Le.call(
                        MA,
                        x(Q, k, Tt, P),
                        x(Q, k, zn, P),
                        x(
                          Q,
                          k,
                          Tt,
                          k.notifyWith
                        )
                      )) : (S !== Tt && (rA = void 0, hA = [MA]), (P || k.resolveWith)(rA, hA));
                    }
                  }, _A = P ? sA : function() {
                    try {
                      sA();
                    } catch (MA) {
                      c.Deferred.exceptionHook && c.Deferred.exceptionHook(
                        MA,
                        _A.error
                      ), D + 1 >= Q && (S !== zn && (rA = void 0, hA = [MA]), k.rejectWith(rA, hA));
                    }
                  };
                  D ? _A() : (c.Deferred.getErrorHook ? _A.error = c.Deferred.getErrorHook() : c.Deferred.getStackHook && (_A.error = c.Deferred.getStackHook()), A.setTimeout(_A));
                };
              }
              return c.Deferred(function(D) {
                a[0][3].add(
                  x(
                    0,
                    D,
                    y(F) ? F : Tt,
                    D.notifyWith
                  )
                ), a[1][3].add(
                  x(
                    0,
                    D,
                    y(p) ? p : Tt
                  )
                ), a[2][3].add(
                  x(
                    0,
                    D,
                    y(B) ? B : zn
                  )
                );
              }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function(p) {
              return p != null ? c.extend(p, d) : d;
            }
          }, h = {};
          return c.each(a, function(p, B) {
            var F = B[2], Q = B[5];
            d[B[1]] = F.add, Q && F.add(
              function() {
                o = Q;
              },
              // rejected_callbacks.disable
              // fulfilled_callbacks.disable
              a[3 - p][2].disable,
              // rejected_handlers.disable
              // fulfilled_handlers.disable
              a[3 - p][3].disable,
              // progress_callbacks.lock
              a[0][2].lock,
              // progress_handlers.lock
              a[0][3].lock
            ), F.add(B[3].fire), h[B[0]] = function() {
              return h[B[0] + "With"](this === h ? void 0 : this, arguments), this;
            }, h[B[0] + "With"] = F.fireWith;
          }), d.promise(h), r && r.call(h, h), h;
        },
        // Deferred helper
        when: function(r) {
          var a = arguments.length, o = a, d = Array(o), h = s.call(arguments), p = c.Deferred(), B = function(F) {
            return function(Q) {
              d[F] = this, h[F] = arguments.length > 1 ? s.call(arguments) : Q, --a || p.resolveWith(d, h);
            };
          };
          if (a <= 1 && (rs(
            r,
            p.done(B(o)).resolve,
            p.reject,
            !a
          ), p.state() === "pending" || y(h[o] && h[o].then)))
            return p.then();
          for (; o--; )
            rs(h[o], B(o), p.reject);
          return p.promise();
        }
      });
      var Hc = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
      c.Deferred.exceptionHook = function(r, a) {
        A.console && A.console.warn && r && Hc.test(r.name) && A.console.warn(
          "jQuery.Deferred exception: " + r.message,
          r.stack,
          a
        );
      }, c.readyException = function(r) {
        A.setTimeout(function() {
          throw r;
        });
      };
      var wi = c.Deferred();
      c.fn.ready = function(r) {
        return wi.then(r).catch(function(a) {
          c.readyException(a);
        }), this;
      }, c.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: !1,
        // A counter to track how many items to wait for before
        // the ready event fires. See trac-6781
        readyWait: 1,
        // Handle when the DOM is ready
        ready: function(r) {
          (r === !0 ? --c.readyWait : c.isReady) || (c.isReady = !0, !(r !== !0 && --c.readyWait > 0) && wi.resolveWith(b, [c]));
        }
      }), c.ready.then = wi.then;
      function qn() {
        b.removeEventListener("DOMContentLoaded", qn), A.removeEventListener("load", qn), c.ready();
      }
      b.readyState === "complete" || b.readyState !== "loading" && !b.documentElement.doScroll ? A.setTimeout(c.ready) : (b.addEventListener("DOMContentLoaded", qn), A.addEventListener("load", qn));
      var _e = function(r, a, o, d, h, p, B) {
        var F = 0, Q = r.length, x = o == null;
        if (M(o) === "object") {
          h = !0;
          for (F in o)
            _e(r, a, F, o[F], !0, p, B);
        } else if (d !== void 0 && (h = !0, y(d) || (B = !0), x && (B ? (a.call(r, d), a = null) : (x = a, a = function(D, k, S) {
          return x.call(c(D), S);
        })), a))
          for (; F < Q; F++)
            a(
              r[F],
              o,
              B ? d : d.call(r[F], F, a(r[F], o))
            );
        return h ? r : x ? a.call(r) : Q ? a(r[0], o) : p;
      }, Sc = /^-ms-/, Lc = /-([a-z])/g;
      function Tc(r, a) {
        return a.toUpperCase();
      }
      function Se(r) {
        return r.replace(Sc, "ms-").replace(Lc, Tc);
      }
      var on = function(r) {
        return r.nodeType === 1 || r.nodeType === 9 || !+r.nodeType;
      };
      function ln() {
        this.expando = c.expando + ln.uid++;
      }
      ln.uid = 1, ln.prototype = {
        cache: function(r) {
          var a = r[this.expando];
          return a || (a = {}, on(r) && (r.nodeType ? r[this.expando] = a : Object.defineProperty(r, this.expando, {
            value: a,
            configurable: !0
          }))), a;
        },
        set: function(r, a, o) {
          var d, h = this.cache(r);
          if (typeof a == "string")
            h[Se(a)] = o;
          else
            for (d in a)
              h[Se(d)] = a[d];
          return h;
        },
        get: function(r, a) {
          return a === void 0 ? this.cache(r) : (
            // Always use camelCase key (gh-2257)
            r[this.expando] && r[this.expando][Se(a)]
          );
        },
        access: function(r, a, o) {
          return a === void 0 || a && typeof a == "string" && o === void 0 ? this.get(r, a) : (this.set(r, a, o), o !== void 0 ? o : a);
        },
        remove: function(r, a) {
          var o, d = r[this.expando];
          if (d !== void 0) {
            if (a !== void 0)
              for (Array.isArray(a) ? a = a.map(Se) : (a = Se(a), a = a in d ? [a] : a.match(He) || []), o = a.length; o--; )
                delete d[a[o]];
            (a === void 0 || c.isEmptyObject(d)) && (r.nodeType ? r[this.expando] = void 0 : delete r[this.expando]);
          }
        },
        hasData: function(r) {
          var a = r[this.expando];
          return a !== void 0 && !c.isEmptyObject(a);
        }
      };
      var q = new ln(), Ae = new ln(), Dc = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, Kc = /[A-Z]/g;
      function kc(r) {
        return r === "true" ? !0 : r === "false" ? !1 : r === "null" ? null : r === +r + "" ? +r : Dc.test(r) ? JSON.parse(r) : r;
      }
      function is(r, a, o) {
        var d;
        if (o === void 0 && r.nodeType === 1)
          if (d = "data-" + a.replace(Kc, "-$&").toLowerCase(), o = r.getAttribute(d), typeof o == "string") {
            try {
              o = kc(o);
            } catch {
            }
            Ae.set(r, a, o);
          } else
            o = void 0;
        return o;
      }
      c.extend({
        hasData: function(r) {
          return Ae.hasData(r) || q.hasData(r);
        },
        data: function(r, a, o) {
          return Ae.access(r, a, o);
        },
        removeData: function(r, a) {
          Ae.remove(r, a);
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function(r, a, o) {
          return q.access(r, a, o);
        },
        _removeData: function(r, a) {
          q.remove(r, a);
        }
      }), c.fn.extend({
        data: function(r, a) {
          var o, d, h, p = this[0], B = p && p.attributes;
          if (r === void 0) {
            if (this.length && (h = Ae.get(p), p.nodeType === 1 && !q.get(p, "hasDataAttrs"))) {
              for (o = B.length; o--; )
                B[o] && (d = B[o].name, d.indexOf("data-") === 0 && (d = Se(d.slice(5)), is(p, d, h[d])));
              q.set(p, "hasDataAttrs", !0);
            }
            return h;
          }
          return typeof r == "object" ? this.each(function() {
            Ae.set(this, r);
          }) : _e(this, function(F) {
            var Q;
            if (p && F === void 0)
              return Q = Ae.get(p, r), Q !== void 0 || (Q = is(p, r), Q !== void 0) ? Q : void 0;
            this.each(function() {
              Ae.set(this, r, F);
            });
          }, null, a, arguments.length > 1, null, !0);
        },
        removeData: function(r) {
          return this.each(function() {
            Ae.remove(this, r);
          });
        }
      }), c.extend({
        queue: function(r, a, o) {
          var d;
          if (r)
            return a = (a || "fx") + "queue", d = q.get(r, a), o && (!d || Array.isArray(o) ? d = q.access(r, a, c.makeArray(o)) : d.push(o)), d || [];
        },
        dequeue: function(r, a) {
          a = a || "fx";
          var o = c.queue(r, a), d = o.length, h = o.shift(), p = c._queueHooks(r, a), B = function() {
            c.dequeue(r, a);
          };
          h === "inprogress" && (h = o.shift(), d--), h && (a === "fx" && o.unshift("inprogress"), delete p.stop, h.call(r, B, p)), !d && p && p.empty.fire();
        },
        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function(r, a) {
          var o = a + "queueHooks";
          return q.get(r, o) || q.access(r, o, {
            empty: c.Callbacks("once memory").add(function() {
              q.remove(r, [a + "queue", o]);
            })
          });
        }
      }), c.fn.extend({
        queue: function(r, a) {
          var o = 2;
          return typeof r != "string" && (a = r, r = "fx", o--), arguments.length < o ? c.queue(this[0], r) : a === void 0 ? this : this.each(function() {
            var d = c.queue(this, r, a);
            c._queueHooks(this, r), r === "fx" && d[0] !== "inprogress" && c.dequeue(this, r);
          });
        },
        dequeue: function(r) {
          return this.each(function() {
            c.dequeue(this, r);
          });
        },
        clearQueue: function(r) {
          return this.queue(r || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function(r, a) {
          var o, d = 1, h = c.Deferred(), p = this, B = this.length, F = function() {
            --d || h.resolveWith(p, [p]);
          };
          for (typeof r != "string" && (a = r, r = void 0), r = r || "fx"; B--; )
            o = q.get(p[B], r + "queueHooks"), o && o.empty && (d++, o.empty.add(F));
          return F(), h.promise(a);
        }
      });
      var as = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, cn = new RegExp("^(?:([+-])=|)(" + as + ")([a-z%]*)$", "i"), $e = ["Top", "Right", "Bottom", "Left"], vt = b.documentElement, Dt = function(r) {
        return c.contains(r.ownerDocument, r);
      }, Oc = { composed: !0 };
      vt.getRootNode && (Dt = function(r) {
        return c.contains(r.ownerDocument, r) || r.getRootNode(Oc) === r.ownerDocument;
      });
      var Zn = function(r, a) {
        return r = a || r, r.style.display === "none" || r.style.display === "" && // Otherwise, check computed style
        // Support: Firefox <=43 - 45
        // Disconnected elements can have computed display: none, so first confirm that elem is
        // in the document.
        Dt(r) && c.css(r, "display") === "none";
      };
      function ss(r, a, o, d) {
        var h, p, B = 20, F = d ? function() {
          return d.cur();
        } : function() {
          return c.css(r, a, "");
        }, Q = F(), x = o && o[3] || (c.cssNumber[a] ? "" : "px"), D = r.nodeType && (c.cssNumber[a] || x !== "px" && +Q) && cn.exec(c.css(r, a));
        if (D && D[3] !== x) {
          for (Q = Q / 2, x = x || D[3], D = +Q || 1; B--; )
            c.style(r, a, D + x), (1 - p) * (1 - (p = F() / Q || 0.5)) <= 0 && (B = 0), D = D / p;
          D = D * 2, c.style(r, a, D + x), o = o || [];
        }
        return o && (D = +D || +Q || 0, h = o[1] ? D + (o[1] + 1) * o[2] : +o[2], d && (d.unit = x, d.start = D, d.end = h)), h;
      }
      var os = {};
      function Mc(r) {
        var a, o = r.ownerDocument, d = r.nodeName, h = os[d];
        return h || (a = o.body.appendChild(o.createElement(d)), h = c.css(a, "display"), a.parentNode.removeChild(a), h === "none" && (h = "block"), os[d] = h, h);
      }
      function Kt(r, a) {
        for (var o, d, h = [], p = 0, B = r.length; p < B; p++)
          d = r[p], d.style && (o = d.style.display, a ? (o === "none" && (h[p] = q.get(d, "display") || null, h[p] || (d.style.display = "")), d.style.display === "" && Zn(d) && (h[p] = Mc(d))) : o !== "none" && (h[p] = "none", q.set(d, "display", o)));
        for (p = 0; p < B; p++)
          h[p] != null && (r[p].style.display = h[p]);
        return r;
      }
      c.fn.extend({
        show: function() {
          return Kt(this, !0);
        },
        hide: function() {
          return Kt(this);
        },
        toggle: function(r) {
          return typeof r == "boolean" ? r ? this.show() : this.hide() : this.each(function() {
            Zn(this) ? c(this).show() : c(this).hide();
          });
        }
      });
      var dn = /^(?:checkbox|radio)$/i, ls = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, cs = /^$|^module$|\/(?:java|ecma)script/i;
      (function() {
        var r = b.createDocumentFragment(), a = r.appendChild(b.createElement("div")), o = b.createElement("input");
        o.setAttribute("type", "radio"), o.setAttribute("checked", "checked"), o.setAttribute("name", "t"), a.appendChild(o), C.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, a.innerHTML = "<textarea>x</textarea>", C.noCloneChecked = !!a.cloneNode(!0).lastChild.defaultValue, a.innerHTML = "<option></option>", C.option = !!a.lastChild;
      })();
      var he = {
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
      he.tbody = he.tfoot = he.colgroup = he.caption = he.thead, he.th = he.td, C.option || (he.optgroup = he.option = [1, "<select multiple='multiple'>", "</select>"]);
      function ee(r, a) {
        var o;
        return typeof r.getElementsByTagName < "u" ? o = r.getElementsByTagName(a || "*") : typeof r.querySelectorAll < "u" ? o = r.querySelectorAll(a || "*") : o = [], a === void 0 || a && N(r, a) ? c.merge([r], o) : o;
      }
      function vi(r, a) {
        for (var o = 0, d = r.length; o < d; o++)
          q.set(
            r[o],
            "globalEval",
            !a || q.get(a[o], "globalEval")
          );
      }
      var Rc = /<|&#?\w+;/;
      function ds(r, a, o, d, h) {
        for (var p, B, F, Q, x, D, k = a.createDocumentFragment(), S = [], P = 0, rA = r.length; P < rA; P++)
          if (p = r[P], p || p === 0)
            if (M(p) === "object")
              c.merge(S, p.nodeType ? [p] : p);
            else if (!Rc.test(p))
              S.push(a.createTextNode(p));
            else {
              for (B = B || k.appendChild(a.createElement("div")), F = (ls.exec(p) || ["", ""])[1].toLowerCase(), Q = he[F] || he._default, B.innerHTML = Q[1] + c.htmlPrefilter(p) + Q[2], D = Q[0]; D--; )
                B = B.lastChild;
              c.merge(S, B.childNodes), B = k.firstChild, B.textContent = "";
            }
        for (k.textContent = "", P = 0; p = S[P++]; ) {
          if (d && c.inArray(p, d) > -1) {
            h && h.push(p);
            continue;
          }
          if (x = Dt(p), B = ee(k.appendChild(p), "script"), x && vi(B), o)
            for (D = 0; p = B[D++]; )
              cs.test(p.type || "") && o.push(p);
        }
        return k;
      }
      var us = /^([^.]*)(?:\.(.+)|)/;
      function kt() {
        return !0;
      }
      function Ot() {
        return !1;
      }
      function mi(r, a, o, d, h, p) {
        var B, F;
        if (typeof a == "object") {
          typeof o != "string" && (d = d || o, o = void 0);
          for (F in a)
            mi(r, F, o, d, a[F], p);
          return r;
        }
        if (d == null && h == null ? (h = o, d = o = void 0) : h == null && (typeof o == "string" ? (h = d, d = void 0) : (h = d, d = o, o = void 0)), h === !1)
          h = Ot;
        else if (!h)
          return r;
        return p === 1 && (B = h, h = function(Q) {
          return c().off(Q), B.apply(this, arguments);
        }, h.guid = B.guid || (B.guid = c.guid++)), r.each(function() {
          c.event.add(this, a, h, d, o);
        });
      }
      c.event = {
        global: {},
        add: function(r, a, o, d, h) {
          var p, B, F, Q, x, D, k, S, P, rA, hA, sA = q.get(r);
          if (on(r))
            for (o.handler && (p = o, o = p.handler, h = p.selector), h && c.find.matchesSelector(vt, h), o.guid || (o.guid = c.guid++), (Q = sA.events) || (Q = sA.events = /* @__PURE__ */ Object.create(null)), (B = sA.handle) || (B = sA.handle = function(_A) {
              return typeof c < "u" && c.event.triggered !== _A.type ? c.event.dispatch.apply(r, arguments) : void 0;
            }), a = (a || "").match(He) || [""], x = a.length; x--; )
              F = us.exec(a[x]) || [], P = hA = F[1], rA = (F[2] || "").split(".").sort(), P && (k = c.event.special[P] || {}, P = (h ? k.delegateType : k.bindType) || P, k = c.event.special[P] || {}, D = c.extend({
                type: P,
                origType: hA,
                data: d,
                handler: o,
                guid: o.guid,
                selector: h,
                needsContext: h && c.expr.match.needsContext.test(h),
                namespace: rA.join(".")
              }, p), (S = Q[P]) || (S = Q[P] = [], S.delegateCount = 0, (!k.setup || k.setup.call(r, d, rA, B) === !1) && r.addEventListener && r.addEventListener(P, B)), k.add && (k.add.call(r, D), D.handler.guid || (D.handler.guid = o.guid)), h ? S.splice(S.delegateCount++, 0, D) : S.push(D), c.event.global[P] = !0);
        },
        // Detach an event or set of events from an element
        remove: function(r, a, o, d, h) {
          var p, B, F, Q, x, D, k, S, P, rA, hA, sA = q.hasData(r) && q.get(r);
          if (!(!sA || !(Q = sA.events))) {
            for (a = (a || "").match(He) || [""], x = a.length; x--; ) {
              if (F = us.exec(a[x]) || [], P = hA = F[1], rA = (F[2] || "").split(".").sort(), !P) {
                for (P in Q)
                  c.event.remove(r, P + a[x], o, d, !0);
                continue;
              }
              for (k = c.event.special[P] || {}, P = (d ? k.delegateType : k.bindType) || P, S = Q[P] || [], F = F[2] && new RegExp("(^|\\.)" + rA.join("\\.(?:.*\\.|)") + "(\\.|$)"), B = p = S.length; p--; )
                D = S[p], (h || hA === D.origType) && (!o || o.guid === D.guid) && (!F || F.test(D.namespace)) && (!d || d === D.selector || d === "**" && D.selector) && (S.splice(p, 1), D.selector && S.delegateCount--, k.remove && k.remove.call(r, D));
              B && !S.length && ((!k.teardown || k.teardown.call(r, rA, sA.handle) === !1) && c.removeEvent(r, P, sA.handle), delete Q[P]);
            }
            c.isEmptyObject(Q) && q.remove(r, "handle events");
          }
        },
        dispatch: function(r) {
          var a, o, d, h, p, B, F = new Array(arguments.length), Q = c.event.fix(r), x = (q.get(this, "events") || /* @__PURE__ */ Object.create(null))[Q.type] || [], D = c.event.special[Q.type] || {};
          for (F[0] = Q, a = 1; a < arguments.length; a++)
            F[a] = arguments[a];
          if (Q.delegateTarget = this, !(D.preDispatch && D.preDispatch.call(this, Q) === !1)) {
            for (B = c.event.handlers.call(this, Q, x), a = 0; (h = B[a++]) && !Q.isPropagationStopped(); )
              for (Q.currentTarget = h.elem, o = 0; (p = h.handlers[o++]) && !Q.isImmediatePropagationStopped(); )
                (!Q.rnamespace || p.namespace === !1 || Q.rnamespace.test(p.namespace)) && (Q.handleObj = p, Q.data = p.data, d = ((c.event.special[p.origType] || {}).handle || p.handler).apply(h.elem, F), d !== void 0 && (Q.result = d) === !1 && (Q.preventDefault(), Q.stopPropagation()));
            return D.postDispatch && D.postDispatch.call(this, Q), Q.result;
          }
        },
        handlers: function(r, a) {
          var o, d, h, p, B, F = [], Q = a.delegateCount, x = r.target;
          if (Q && // Support: IE <=9
          // Black-hole SVG <use> instance trees (trac-13180)
          x.nodeType && // Support: Firefox <=42
          // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
          // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
          // Support: IE 11 only
          // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
          !(r.type === "click" && r.button >= 1)) {
            for (; x !== this; x = x.parentNode || this)
              if (x.nodeType === 1 && !(r.type === "click" && x.disabled === !0)) {
                for (p = [], B = {}, o = 0; o < Q; o++)
                  d = a[o], h = d.selector + " ", B[h] === void 0 && (B[h] = d.needsContext ? c(h, this).index(x) > -1 : c.find(h, this, null, [x]).length), B[h] && p.push(d);
                p.length && F.push({ elem: x, handlers: p });
              }
          }
          return x = this, Q < a.length && F.push({ elem: x, handlers: a.slice(Q) }), F;
        },
        addProp: function(r, a) {
          Object.defineProperty(c.Event.prototype, r, {
            enumerable: !0,
            configurable: !0,
            get: y(a) ? function() {
              if (this.originalEvent)
                return a(this.originalEvent);
            } : function() {
              if (this.originalEvent)
                return this.originalEvent[r];
            },
            set: function(o) {
              Object.defineProperty(this, r, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: o
              });
            }
          });
        },
        fix: function(r) {
          return r[c.expando] ? r : new c.Event(r);
        },
        special: {
          load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: !0
          },
          click: {
            // Utilize native event to ensure correct state for checkable inputs
            setup: function(r) {
              var a = this || r;
              return dn.test(a.type) && a.click && N(a, "input") && Ar(a, "click", !0), !1;
            },
            trigger: function(r) {
              var a = this || r;
              return dn.test(a.type) && a.click && N(a, "input") && Ar(a, "click"), !0;
            },
            // For cross-browser consistency, suppress native .click() on links
            // Also prevent it if we're currently inside a leveraged native-event stack
            _default: function(r) {
              var a = r.target;
              return dn.test(a.type) && a.click && N(a, "input") && q.get(a, "click") || N(a, "a");
            }
          },
          beforeunload: {
            postDispatch: function(r) {
              r.result !== void 0 && r.originalEvent && (r.originalEvent.returnValue = r.result);
            }
          }
        }
      };
      function Ar(r, a, o) {
        if (!o) {
          q.get(r, a) === void 0 && c.event.add(r, a, kt);
          return;
        }
        q.set(r, a, !1), c.event.add(r, a, {
          namespace: !1,
          handler: function(d) {
            var h, p = q.get(this, a);
            if (d.isTrigger & 1 && this[a]) {
              if (p)
                (c.event.special[a] || {}).delegateType && d.stopPropagation();
              else if (p = s.call(arguments), q.set(this, a, p), this[a](), h = q.get(this, a), q.set(this, a, !1), p !== h)
                return d.stopImmediatePropagation(), d.preventDefault(), h;
            } else p && (q.set(this, a, c.event.trigger(
              p[0],
              p.slice(1),
              this
            )), d.stopPropagation(), d.isImmediatePropagationStopped = kt);
          }
        });
      }
      c.removeEvent = function(r, a, o) {
        r.removeEventListener && r.removeEventListener(a, o);
      }, c.Event = function(r, a) {
        if (!(this instanceof c.Event))
          return new c.Event(r, a);
        r && r.type ? (this.originalEvent = r, this.type = r.type, this.isDefaultPrevented = r.defaultPrevented || r.defaultPrevented === void 0 && // Support: Android <=2.3 only
        r.returnValue === !1 ? kt : Ot, this.target = r.target && r.target.nodeType === 3 ? r.target.parentNode : r.target, this.currentTarget = r.currentTarget, this.relatedTarget = r.relatedTarget) : this.type = r, a && c.extend(this, a), this.timeStamp = r && r.timeStamp || Date.now(), this[c.expando] = !0;
      }, c.Event.prototype = {
        constructor: c.Event,
        isDefaultPrevented: Ot,
        isPropagationStopped: Ot,
        isImmediatePropagationStopped: Ot,
        isSimulated: !1,
        preventDefault: function() {
          var r = this.originalEvent;
          this.isDefaultPrevented = kt, r && !this.isSimulated && r.preventDefault();
        },
        stopPropagation: function() {
          var r = this.originalEvent;
          this.isPropagationStopped = kt, r && !this.isSimulated && r.stopPropagation();
        },
        stopImmediatePropagation: function() {
          var r = this.originalEvent;
          this.isImmediatePropagationStopped = kt, r && !this.isSimulated && r.stopImmediatePropagation(), this.stopPropagation();
        }
      }, c.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: !0
      }, c.event.addProp), c.each({ focus: "focusin", blur: "focusout" }, function(r, a) {
        function o(d) {
          if (b.documentMode) {
            var h = q.get(this, "handle"), p = c.event.fix(d);
            p.type = d.type === "focusin" ? "focus" : "blur", p.isSimulated = !0, h(d), p.target === p.currentTarget && h(p);
          } else
            c.event.simulate(
              a,
              d.target,
              c.event.fix(d)
            );
        }
        c.event.special[r] = {
          // Utilize native event if possible so blur/focus sequence is correct
          setup: function() {
            var d;
            if (Ar(this, r, !0), b.documentMode)
              d = q.get(this, a), d || this.addEventListener(a, o), q.set(this, a, (d || 0) + 1);
            else
              return !1;
          },
          trigger: function() {
            return Ar(this, r), !0;
          },
          teardown: function() {
            var d;
            if (b.documentMode)
              d = q.get(this, a) - 1, d ? q.set(this, a, d) : (this.removeEventListener(a, o), q.remove(this, a));
            else
              return !1;
          },
          // Suppress native focus or blur if we're currently inside
          // a leveraged native-event stack
          _default: function(d) {
            return q.get(d.target, r);
          },
          delegateType: a
        }, c.event.special[a] = {
          setup: function() {
            var d = this.ownerDocument || this.document || this, h = b.documentMode ? this : d, p = q.get(h, a);
            p || (b.documentMode ? this.addEventListener(a, o) : d.addEventListener(r, o, !0)), q.set(h, a, (p || 0) + 1);
          },
          teardown: function() {
            var d = this.ownerDocument || this.document || this, h = b.documentMode ? this : d, p = q.get(h, a) - 1;
            p ? q.set(h, a, p) : (b.documentMode ? this.removeEventListener(a, o) : d.removeEventListener(r, o, !0), q.remove(h, a));
          }
        };
      }), c.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
      }, function(r, a) {
        c.event.special[r] = {
          delegateType: a,
          bindType: a,
          handle: function(o) {
            var d, h = this, p = o.relatedTarget, B = o.handleObj;
            return (!p || p !== h && !c.contains(h, p)) && (o.type = B.origType, d = B.handler.apply(this, arguments), o.type = a), d;
          }
        };
      }), c.fn.extend({
        on: function(r, a, o, d) {
          return mi(this, r, a, o, d);
        },
        one: function(r, a, o, d) {
          return mi(this, r, a, o, d, 1);
        },
        off: function(r, a, o) {
          var d, h;
          if (r && r.preventDefault && r.handleObj)
            return d = r.handleObj, c(r.delegateTarget).off(
              d.namespace ? d.origType + "." + d.namespace : d.origType,
              d.selector,
              d.handler
            ), this;
          if (typeof r == "object") {
            for (h in r)
              this.off(h, a, r[h]);
            return this;
          }
          return (a === !1 || typeof a == "function") && (o = a, a = void 0), o === !1 && (o = Ot), this.each(function() {
            c.event.remove(this, r, o, a);
          });
        }
      });
      var Pc = /<script|<style|<link/i, Nc = /checked\s*(?:[^=]|=\s*.checked.)/i, _c = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
      function fs(r, a) {
        return N(r, "table") && N(a.nodeType !== 11 ? a : a.firstChild, "tr") && c(r).children("tbody")[0] || r;
      }
      function $c(r) {
        return r.type = (r.getAttribute("type") !== null) + "/" + r.type, r;
      }
      function Gc(r) {
        return (r.type || "").slice(0, 5) === "true/" ? r.type = r.type.slice(5) : r.removeAttribute("type"), r;
      }
      function hs(r, a) {
        var o, d, h, p, B, F, Q;
        if (a.nodeType === 1) {
          if (q.hasData(r) && (p = q.get(r), Q = p.events, Q)) {
            q.remove(a, "handle events");
            for (h in Q)
              for (o = 0, d = Q[h].length; o < d; o++)
                c.event.add(a, h, Q[h][o]);
          }
          Ae.hasData(r) && (B = Ae.access(r), F = c.extend({}, B), Ae.set(a, F));
        }
      }
      function Xc(r, a) {
        var o = a.nodeName.toLowerCase();
        o === "input" && dn.test(r.type) ? a.checked = r.checked : (o === "input" || o === "textarea") && (a.defaultValue = r.defaultValue);
      }
      function Mt(r, a, o, d) {
        a = l(a);
        var h, p, B, F, Q, x, D = 0, k = r.length, S = k - 1, P = a[0], rA = y(P);
        if (rA || k > 1 && typeof P == "string" && !C.checkClone && Nc.test(P))
          return r.each(function(hA) {
            var sA = r.eq(hA);
            rA && (a[0] = P.call(this, hA, sA.html())), Mt(sA, a, o, d);
          });
        if (k && (h = ds(a, r[0].ownerDocument, !1, r, d), p = h.firstChild, h.childNodes.length === 1 && (h = p), p || d)) {
          for (B = c.map(ee(h, "script"), $c), F = B.length; D < k; D++)
            Q = h, D !== S && (Q = c.clone(Q, !0, !0), F && c.merge(B, ee(Q, "script"))), o.call(r[D], Q, D);
          if (F)
            for (x = B[B.length - 1].ownerDocument, c.map(B, Gc), D = 0; D < F; D++)
              Q = B[D], cs.test(Q.type || "") && !q.access(Q, "globalEval") && c.contains(x, Q) && (Q.src && (Q.type || "").toLowerCase() !== "module" ? c._evalUrl && !Q.noModule && c._evalUrl(Q.src, {
                nonce: Q.nonce || Q.getAttribute("nonce")
              }, x) : $(Q.textContent.replace(_c, ""), Q, x));
        }
        return r;
      }
      function ps(r, a, o) {
        for (var d, h = a ? c.filter(a, r) : r, p = 0; (d = h[p]) != null; p++)
          !o && d.nodeType === 1 && c.cleanData(ee(d)), d.parentNode && (o && Dt(d) && vi(ee(d, "script")), d.parentNode.removeChild(d));
        return r;
      }
      c.extend({
        htmlPrefilter: function(r) {
          return r;
        },
        clone: function(r, a, o) {
          var d, h, p, B, F = r.cloneNode(!0), Q = Dt(r);
          if (!C.noCloneChecked && (r.nodeType === 1 || r.nodeType === 11) && !c.isXMLDoc(r))
            for (B = ee(F), p = ee(r), d = 0, h = p.length; d < h; d++)
              Xc(p[d], B[d]);
          if (a)
            if (o)
              for (p = p || ee(r), B = B || ee(F), d = 0, h = p.length; d < h; d++)
                hs(p[d], B[d]);
            else
              hs(r, F);
          return B = ee(F, "script"), B.length > 0 && vi(B, !Q && ee(r, "script")), F;
        },
        cleanData: function(r) {
          for (var a, o, d, h = c.event.special, p = 0; (o = r[p]) !== void 0; p++)
            if (on(o)) {
              if (a = o[q.expando]) {
                if (a.events)
                  for (d in a.events)
                    h[d] ? c.event.remove(o, d) : c.removeEvent(o, d, a.handle);
                o[q.expando] = void 0;
              }
              o[Ae.expando] && (o[Ae.expando] = void 0);
            }
        }
      }), c.fn.extend({
        detach: function(r) {
          return ps(this, r, !0);
        },
        remove: function(r) {
          return ps(this, r);
        },
        text: function(r) {
          return _e(this, function(a) {
            return a === void 0 ? c.text(this) : this.empty().each(function() {
              (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) && (this.textContent = a);
            });
          }, null, r, arguments.length);
        },
        append: function() {
          return Mt(this, arguments, function(r) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var a = fs(this, r);
              a.appendChild(r);
            }
          });
        },
        prepend: function() {
          return Mt(this, arguments, function(r) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var a = fs(this, r);
              a.insertBefore(r, a.firstChild);
            }
          });
        },
        before: function() {
          return Mt(this, arguments, function(r) {
            this.parentNode && this.parentNode.insertBefore(r, this);
          });
        },
        after: function() {
          return Mt(this, arguments, function(r) {
            this.parentNode && this.parentNode.insertBefore(r, this.nextSibling);
          });
        },
        empty: function() {
          for (var r, a = 0; (r = this[a]) != null; a++)
            r.nodeType === 1 && (c.cleanData(ee(r, !1)), r.textContent = "");
          return this;
        },
        clone: function(r, a) {
          return r = r ?? !1, a = a ?? r, this.map(function() {
            return c.clone(this, r, a);
          });
        },
        html: function(r) {
          return _e(this, function(a) {
            var o = this[0] || {}, d = 0, h = this.length;
            if (a === void 0 && o.nodeType === 1)
              return o.innerHTML;
            if (typeof a == "string" && !Pc.test(a) && !he[(ls.exec(a) || ["", ""])[1].toLowerCase()]) {
              a = c.htmlPrefilter(a);
              try {
                for (; d < h; d++)
                  o = this[d] || {}, o.nodeType === 1 && (c.cleanData(ee(o, !1)), o.innerHTML = a);
                o = 0;
              } catch {
              }
            }
            o && this.empty().append(a);
          }, null, r, arguments.length);
        },
        replaceWith: function() {
          var r = [];
          return Mt(this, arguments, function(a) {
            var o = this.parentNode;
            c.inArray(this, r) < 0 && (c.cleanData(ee(this)), o && o.replaceChild(a, this));
          }, r);
        }
      }), c.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
      }, function(r, a) {
        c.fn[r] = function(o) {
          for (var d, h = [], p = c(o), B = p.length - 1, F = 0; F <= B; F++)
            d = F === B ? this : this.clone(!0), c(p[F])[a](d), u.apply(h, d.get());
          return this.pushStack(h);
        };
      });
      var yi = new RegExp("^(" + as + ")(?!px)[a-z%]+$", "i"), Ci = /^--/, er = function(r) {
        var a = r.ownerDocument.defaultView;
        return (!a || !a.opener) && (a = A), a.getComputedStyle(r);
      }, gs = function(r, a, o) {
        var d, h, p = {};
        for (h in a)
          p[h] = r.style[h], r.style[h] = a[h];
        d = o.call(r);
        for (h in a)
          r.style[h] = p[h];
        return d;
      }, Vc = new RegExp($e.join("|"), "i");
      (function() {
        function r() {
          if (x) {
            Q.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", x.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", vt.appendChild(Q).appendChild(x);
            var D = A.getComputedStyle(x);
            o = D.top !== "1%", F = a(D.marginLeft) === 12, x.style.right = "60%", p = a(D.right) === 36, d = a(D.width) === 36, x.style.position = "absolute", h = a(x.offsetWidth / 3) === 12, vt.removeChild(Q), x = null;
          }
        }
        function a(D) {
          return Math.round(parseFloat(D));
        }
        var o, d, h, p, B, F, Q = b.createElement("div"), x = b.createElement("div");
        x.style && (x.style.backgroundClip = "content-box", x.cloneNode(!0).style.backgroundClip = "", C.clearCloneStyle = x.style.backgroundClip === "content-box", c.extend(C, {
          boxSizingReliable: function() {
            return r(), d;
          },
          pixelBoxStyles: function() {
            return r(), p;
          },
          pixelPosition: function() {
            return r(), o;
          },
          reliableMarginLeft: function() {
            return r(), F;
          },
          scrollboxSize: function() {
            return r(), h;
          },
          // Support: IE 9 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Behavior in IE 9 is more subtle than in newer versions & it passes
          // some versions of this test; make sure not to make it pass there!
          //
          // Support: Firefox 70+
          // Only Firefox includes border widths
          // in computed dimensions. (gh-4529)
          reliableTrDimensions: function() {
            var D, k, S, P;
            return B == null && (D = b.createElement("table"), k = b.createElement("tr"), S = b.createElement("div"), D.style.cssText = "position:absolute;left:-11111px;border-collapse:separate", k.style.cssText = "box-sizing:content-box;border:1px solid", k.style.height = "1px", S.style.height = "9px", S.style.display = "block", vt.appendChild(D).appendChild(k).appendChild(S), P = A.getComputedStyle(k), B = parseInt(P.height, 10) + parseInt(P.borderTopWidth, 10) + parseInt(P.borderBottomWidth, 10) === k.offsetHeight, vt.removeChild(D)), B;
          }
        }));
      })();
      function un(r, a, o) {
        var d, h, p, B, F = Ci.test(a), Q = r.style;
        return o = o || er(r), o && (B = o.getPropertyValue(a) || o[a], F && B && (B = B.replace(BA, "$1") || void 0), B === "" && !Dt(r) && (B = c.style(r, a)), !C.pixelBoxStyles() && yi.test(B) && Vc.test(a) && (d = Q.width, h = Q.minWidth, p = Q.maxWidth, Q.minWidth = Q.maxWidth = Q.width = B, B = o.width, Q.width = d, Q.minWidth = h, Q.maxWidth = p)), B !== void 0 ? (
          // Support: IE <=9 - 11 only
          // IE returns zIndex value as an integer.
          B + ""
        ) : B;
      }
      function Bs(r, a) {
        return {
          get: function() {
            if (r()) {
              delete this.get;
              return;
            }
            return (this.get = a).apply(this, arguments);
          }
        };
      }
      var ws = ["Webkit", "Moz", "ms"], vs = b.createElement("div").style, ms = {};
      function Yc(r) {
        for (var a = r[0].toUpperCase() + r.slice(1), o = ws.length; o--; )
          if (r = ws[o] + a, r in vs)
            return r;
      }
      function Qi(r) {
        var a = c.cssProps[r] || ms[r];
        return a || (r in vs ? r : ms[r] = Yc(r) || r);
      }
      var Wc = /^(none|table(?!-c[ea]).+)/, Jc = { position: "absolute", visibility: "hidden", display: "block" }, ys = {
        letterSpacing: "0",
        fontWeight: "400"
      };
      function Cs(r, a, o) {
        var d = cn.exec(a);
        return d ? (
          // Guard against undefined "subtract", e.g., when used as in cssHooks
          Math.max(0, d[2] - (o || 0)) + (d[3] || "px")
        ) : a;
      }
      function Fi(r, a, o, d, h, p) {
        var B = a === "width" ? 1 : 0, F = 0, Q = 0, x = 0;
        if (o === (d ? "border" : "content"))
          return 0;
        for (; B < 4; B += 2)
          o === "margin" && (x += c.css(r, o + $e[B], !0, h)), d ? (o === "content" && (Q -= c.css(r, "padding" + $e[B], !0, h)), o !== "margin" && (Q -= c.css(r, "border" + $e[B] + "Width", !0, h))) : (Q += c.css(r, "padding" + $e[B], !0, h), o !== "padding" ? Q += c.css(r, "border" + $e[B] + "Width", !0, h) : F += c.css(r, "border" + $e[B] + "Width", !0, h));
        return !d && p >= 0 && (Q += Math.max(0, Math.ceil(
          r["offset" + a[0].toUpperCase() + a.slice(1)] - p - Q - F - 0.5
          // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
          // Use an explicit zero to avoid NaN (gh-3964)
        )) || 0), Q + x;
      }
      function Qs(r, a, o) {
        var d = er(r), h = !C.boxSizingReliable() || o, p = h && c.css(r, "boxSizing", !1, d) === "border-box", B = p, F = un(r, a, d), Q = "offset" + a[0].toUpperCase() + a.slice(1);
        if (yi.test(F)) {
          if (!o)
            return F;
          F = "auto";
        }
        return (!C.boxSizingReliable() && p || // Support: IE 10 - 11+, Edge 15 - 18+
        // IE/Edge misreport `getComputedStyle` of table rows with width/height
        // set in CSS while `offset*` properties report correct values.
        // Interestingly, in some cases IE 9 doesn't suffer from this issue.
        !C.reliableTrDimensions() && N(r, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        F === "auto" || // Support: Android <=4.1 - 4.3 only
        // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
        !parseFloat(F) && c.css(r, "display", !1, d) === "inline") && // Make sure the element is visible & connected
        r.getClientRects().length && (p = c.css(r, "boxSizing", !1, d) === "border-box", B = Q in r, B && (F = r[Q])), F = parseFloat(F) || 0, F + Fi(
          r,
          a,
          o || (p ? "border" : "content"),
          B,
          d,
          // Provide the current computed size to request scroll gutter calculation (gh-3589)
          F
        ) + "px";
      }
      c.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
          opacity: {
            get: function(r, a) {
              if (a) {
                var o = un(r, "opacity");
                return o === "" ? "1" : o;
              }
            }
          }
        },
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
          animationIterationCount: !0,
          aspectRatio: !0,
          borderImageSlice: !0,
          columnCount: !0,
          flexGrow: !0,
          flexShrink: !0,
          fontWeight: !0,
          gridArea: !0,
          gridColumn: !0,
          gridColumnEnd: !0,
          gridColumnStart: !0,
          gridRow: !0,
          gridRowEnd: !0,
          gridRowStart: !0,
          lineHeight: !0,
          opacity: !0,
          order: !0,
          orphans: !0,
          scale: !0,
          widows: !0,
          zIndex: !0,
          zoom: !0,
          // SVG-related
          fillOpacity: !0,
          floodOpacity: !0,
          stopOpacity: !0,
          strokeMiterlimit: !0,
          strokeOpacity: !0
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {},
        // Get and set the style property on a DOM Node
        style: function(r, a, o, d) {
          if (!(!r || r.nodeType === 3 || r.nodeType === 8 || !r.style)) {
            var h, p, B, F = Se(a), Q = Ci.test(a), x = r.style;
            if (Q || (a = Qi(F)), B = c.cssHooks[a] || c.cssHooks[F], o !== void 0) {
              if (p = typeof o, p === "string" && (h = cn.exec(o)) && h[1] && (o = ss(r, a, h), p = "number"), o == null || o !== o)
                return;
              p === "number" && !Q && (o += h && h[3] || (c.cssNumber[F] ? "" : "px")), !C.clearCloneStyle && o === "" && a.indexOf("background") === 0 && (x[a] = "inherit"), (!B || !("set" in B) || (o = B.set(r, o, d)) !== void 0) && (Q ? x.setProperty(a, o) : x[a] = o);
            } else
              return B && "get" in B && (h = B.get(r, !1, d)) !== void 0 ? h : x[a];
          }
        },
        css: function(r, a, o, d) {
          var h, p, B, F = Se(a), Q = Ci.test(a);
          return Q || (a = Qi(F)), B = c.cssHooks[a] || c.cssHooks[F], B && "get" in B && (h = B.get(r, !0, o)), h === void 0 && (h = un(r, a, d)), h === "normal" && a in ys && (h = ys[a]), o === "" || o ? (p = parseFloat(h), o === !0 || isFinite(p) ? p || 0 : h) : h;
        }
      }), c.each(["height", "width"], function(r, a) {
        c.cssHooks[a] = {
          get: function(o, d, h) {
            if (d)
              return Wc.test(c.css(o, "display")) && // Support: Safari 8+
              // Table columns in Safari have non-zero offsetWidth & zero
              // getBoundingClientRect().width unless display is changed.
              // Support: IE <=11 only
              // Running getBoundingClientRect on a disconnected node
              // in IE throws an error.
              (!o.getClientRects().length || !o.getBoundingClientRect().width) ? gs(o, Jc, function() {
                return Qs(o, a, h);
              }) : Qs(o, a, h);
          },
          set: function(o, d, h) {
            var p, B = er(o), F = !C.scrollboxSize() && B.position === "absolute", Q = F || h, x = Q && c.css(o, "boxSizing", !1, B) === "border-box", D = h ? Fi(
              o,
              a,
              h,
              x,
              B
            ) : 0;
            return x && F && (D -= Math.ceil(
              o["offset" + a[0].toUpperCase() + a.slice(1)] - parseFloat(B[a]) - Fi(o, a, "border", !1, B) - 0.5
            )), D && (p = cn.exec(d)) && (p[3] || "px") !== "px" && (o.style[a] = d, d = c.css(o, a)), Cs(o, d, D);
          }
        };
      }), c.cssHooks.marginLeft = Bs(
        C.reliableMarginLeft,
        function(r, a) {
          if (a)
            return (parseFloat(un(r, "marginLeft")) || r.getBoundingClientRect().left - gs(r, { marginLeft: 0 }, function() {
              return r.getBoundingClientRect().left;
            })) + "px";
        }
      ), c.each({
        margin: "",
        padding: "",
        border: "Width"
      }, function(r, a) {
        c.cssHooks[r + a] = {
          expand: function(o) {
            for (var d = 0, h = {}, p = typeof o == "string" ? o.split(" ") : [o]; d < 4; d++)
              h[r + $e[d] + a] = p[d] || p[d - 2] || p[0];
            return h;
          }
        }, r !== "margin" && (c.cssHooks[r + a].set = Cs);
      }), c.fn.extend({
        css: function(r, a) {
          return _e(this, function(o, d, h) {
            var p, B, F = {}, Q = 0;
            if (Array.isArray(d)) {
              for (p = er(o), B = d.length; Q < B; Q++)
                F[d[Q]] = c.css(o, d[Q], !1, p);
              return F;
            }
            return h !== void 0 ? c.style(o, d, h) : c.css(o, d);
          }, r, a, arguments.length > 1);
        }
      });
      function te(r, a, o, d, h) {
        return new te.prototype.init(r, a, o, d, h);
      }
      c.Tween = te, te.prototype = {
        constructor: te,
        init: function(r, a, o, d, h, p) {
          this.elem = r, this.prop = o, this.easing = h || c.easing._default, this.options = a, this.start = this.now = this.cur(), this.end = d, this.unit = p || (c.cssNumber[o] ? "" : "px");
        },
        cur: function() {
          var r = te.propHooks[this.prop];
          return r && r.get ? r.get(this) : te.propHooks._default.get(this);
        },
        run: function(r) {
          var a, o = te.propHooks[this.prop];
          return this.options.duration ? this.pos = a = c.easing[this.easing](
            r,
            this.options.duration * r,
            0,
            1,
            this.options.duration
          ) : this.pos = a = r, this.now = (this.end - this.start) * a + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), o && o.set ? o.set(this) : te.propHooks._default.set(this), this;
        }
      }, te.prototype.init.prototype = te.prototype, te.propHooks = {
        _default: {
          get: function(r) {
            var a;
            return r.elem.nodeType !== 1 || r.elem[r.prop] != null && r.elem.style[r.prop] == null ? r.elem[r.prop] : (a = c.css(r.elem, r.prop, ""), !a || a === "auto" ? 0 : a);
          },
          set: function(r) {
            c.fx.step[r.prop] ? c.fx.step[r.prop](r) : r.elem.nodeType === 1 && (c.cssHooks[r.prop] || r.elem.style[Qi(r.prop)] != null) ? c.style(r.elem, r.prop, r.now + r.unit) : r.elem[r.prop] = r.now;
          }
        }
      }, te.propHooks.scrollTop = te.propHooks.scrollLeft = {
        set: function(r) {
          r.elem.nodeType && r.elem.parentNode && (r.elem[r.prop] = r.now);
        }
      }, c.easing = {
        linear: function(r) {
          return r;
        },
        swing: function(r) {
          return 0.5 - Math.cos(r * Math.PI) / 2;
        },
        _default: "swing"
      }, c.fx = te.prototype.init, c.fx.step = {};
      var Rt, tr, jc = /^(?:toggle|show|hide)$/, zc = /queueHooks$/;
      function Ui() {
        tr && (b.hidden === !1 && A.requestAnimationFrame ? A.requestAnimationFrame(Ui) : A.setTimeout(Ui, c.fx.interval), c.fx.tick());
      }
      function Fs() {
        return A.setTimeout(function() {
          Rt = void 0;
        }), Rt = Date.now();
      }
      function nr(r, a) {
        var o, d = 0, h = { height: r };
        for (a = a ? 1 : 0; d < 4; d += 2 - a)
          o = $e[d], h["margin" + o] = h["padding" + o] = r;
        return a && (h.opacity = h.width = r), h;
      }
      function Us(r, a, o) {
        for (var d, h = (Qe.tweeners[a] || []).concat(Qe.tweeners["*"]), p = 0, B = h.length; p < B; p++)
          if (d = h[p].call(o, a, r))
            return d;
      }
      function qc(r, a, o) {
        var d, h, p, B, F, Q, x, D, k = "width" in a || "height" in a, S = this, P = {}, rA = r.style, hA = r.nodeType && Zn(r), sA = q.get(r, "fxshow");
        o.queue || (B = c._queueHooks(r, "fx"), B.unqueued == null && (B.unqueued = 0, F = B.empty.fire, B.empty.fire = function() {
          B.unqueued || F();
        }), B.unqueued++, S.always(function() {
          S.always(function() {
            B.unqueued--, c.queue(r, "fx").length || B.empty.fire();
          });
        }));
        for (d in a)
          if (h = a[d], jc.test(h)) {
            if (delete a[d], p = p || h === "toggle", h === (hA ? "hide" : "show"))
              if (h === "show" && sA && sA[d] !== void 0)
                hA = !0;
              else
                continue;
            P[d] = sA && sA[d] || c.style(r, d);
          }
        if (Q = !c.isEmptyObject(a), !(!Q && c.isEmptyObject(P))) {
          k && r.nodeType === 1 && (o.overflow = [rA.overflow, rA.overflowX, rA.overflowY], x = sA && sA.display, x == null && (x = q.get(r, "display")), D = c.css(r, "display"), D === "none" && (x ? D = x : (Kt([r], !0), x = r.style.display || x, D = c.css(r, "display"), Kt([r]))), (D === "inline" || D === "inline-block" && x != null) && c.css(r, "float") === "none" && (Q || (S.done(function() {
            rA.display = x;
          }), x == null && (D = rA.display, x = D === "none" ? "" : D)), rA.display = "inline-block")), o.overflow && (rA.overflow = "hidden", S.always(function() {
            rA.overflow = o.overflow[0], rA.overflowX = o.overflow[1], rA.overflowY = o.overflow[2];
          })), Q = !1;
          for (d in P)
            Q || (sA ? "hidden" in sA && (hA = sA.hidden) : sA = q.access(r, "fxshow", { display: x }), p && (sA.hidden = !hA), hA && Kt([r], !0), S.done(function() {
              hA || Kt([r]), q.remove(r, "fxshow");
              for (d in P)
                c.style(r, d, P[d]);
            })), Q = Us(hA ? sA[d] : 0, d, S), d in sA || (sA[d] = Q.start, hA && (Q.end = Q.start, Q.start = 0));
        }
      }
      function Zc(r, a) {
        var o, d, h, p, B;
        for (o in r)
          if (d = Se(o), h = a[d], p = r[o], Array.isArray(p) && (h = p[1], p = r[o] = p[0]), o !== d && (r[d] = p, delete r[o]), B = c.cssHooks[d], B && "expand" in B) {
            p = B.expand(p), delete r[d];
            for (o in p)
              o in r || (r[o] = p[o], a[o] = h);
          } else
            a[d] = h;
      }
      function Qe(r, a, o) {
        var d, h, p = 0, B = Qe.prefilters.length, F = c.Deferred().always(function() {
          delete Q.elem;
        }), Q = function() {
          if (h)
            return !1;
          for (var k = Rt || Fs(), S = Math.max(0, x.startTime + x.duration - k), P = S / x.duration || 0, rA = 1 - P, hA = 0, sA = x.tweens.length; hA < sA; hA++)
            x.tweens[hA].run(rA);
          return F.notifyWith(r, [x, rA, S]), rA < 1 && sA ? S : (sA || F.notifyWith(r, [x, 1, 0]), F.resolveWith(r, [x]), !1);
        }, x = F.promise({
          elem: r,
          props: c.extend({}, a),
          opts: c.extend(!0, {
            specialEasing: {},
            easing: c.easing._default
          }, o),
          originalProperties: a,
          originalOptions: o,
          startTime: Rt || Fs(),
          duration: o.duration,
          tweens: [],
          createTween: function(k, S) {
            var P = c.Tween(
              r,
              x.opts,
              k,
              S,
              x.opts.specialEasing[k] || x.opts.easing
            );
            return x.tweens.push(P), P;
          },
          stop: function(k) {
            var S = 0, P = k ? x.tweens.length : 0;
            if (h)
              return this;
            for (h = !0; S < P; S++)
              x.tweens[S].run(1);
            return k ? (F.notifyWith(r, [x, 1, 0]), F.resolveWith(r, [x, k])) : F.rejectWith(r, [x, k]), this;
          }
        }), D = x.props;
        for (Zc(D, x.opts.specialEasing); p < B; p++)
          if (d = Qe.prefilters[p].call(x, r, D, x.opts), d)
            return y(d.stop) && (c._queueHooks(x.elem, x.opts.queue).stop = d.stop.bind(d)), d;
        return c.map(D, Us, x), y(x.opts.start) && x.opts.start.call(r, x), x.progress(x.opts.progress).done(x.opts.done, x.opts.complete).fail(x.opts.fail).always(x.opts.always), c.fx.timer(
          c.extend(Q, {
            elem: r,
            anim: x,
            queue: x.opts.queue
          })
        ), x;
      }
      c.Animation = c.extend(Qe, {
        tweeners: {
          "*": [function(r, a) {
            var o = this.createTween(r, a);
            return ss(o.elem, r, cn.exec(a), o), o;
          }]
        },
        tweener: function(r, a) {
          y(r) ? (a = r, r = ["*"]) : r = r.match(He);
          for (var o, d = 0, h = r.length; d < h; d++)
            o = r[d], Qe.tweeners[o] = Qe.tweeners[o] || [], Qe.tweeners[o].unshift(a);
        },
        prefilters: [qc],
        prefilter: function(r, a) {
          a ? Qe.prefilters.unshift(r) : Qe.prefilters.push(r);
        }
      }), c.speed = function(r, a, o) {
        var d = r && typeof r == "object" ? c.extend({}, r) : {
          complete: o || !o && a || y(r) && r,
          duration: r,
          easing: o && a || a && !y(a) && a
        };
        return c.fx.off ? d.duration = 0 : typeof d.duration != "number" && (d.duration in c.fx.speeds ? d.duration = c.fx.speeds[d.duration] : d.duration = c.fx.speeds._default), (d.queue == null || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
          y(d.old) && d.old.call(this), d.queue && c.dequeue(this, d.queue);
        }, d;
      }, c.fn.extend({
        fadeTo: function(r, a, o, d) {
          return this.filter(Zn).css("opacity", 0).show().end().animate({ opacity: a }, r, o, d);
        },
        animate: function(r, a, o, d) {
          var h = c.isEmptyObject(r), p = c.speed(a, o, d), B = function() {
            var F = Qe(this, c.extend({}, r), p);
            (h || q.get(this, "finish")) && F.stop(!0);
          };
          return B.finish = B, h || p.queue === !1 ? this.each(B) : this.queue(p.queue, B);
        },
        stop: function(r, a, o) {
          var d = function(h) {
            var p = h.stop;
            delete h.stop, p(o);
          };
          return typeof r != "string" && (o = a, a = r, r = void 0), a && this.queue(r || "fx", []), this.each(function() {
            var h = !0, p = r != null && r + "queueHooks", B = c.timers, F = q.get(this);
            if (p)
              F[p] && F[p].stop && d(F[p]);
            else
              for (p in F)
                F[p] && F[p].stop && zc.test(p) && d(F[p]);
            for (p = B.length; p--; )
              B[p].elem === this && (r == null || B[p].queue === r) && (B[p].anim.stop(o), h = !1, B.splice(p, 1));
            (h || !o) && c.dequeue(this, r);
          });
        },
        finish: function(r) {
          return r !== !1 && (r = r || "fx"), this.each(function() {
            var a, o = q.get(this), d = o[r + "queue"], h = o[r + "queueHooks"], p = c.timers, B = d ? d.length : 0;
            for (o.finish = !0, c.queue(this, r, []), h && h.stop && h.stop.call(this, !0), a = p.length; a--; )
              p[a].elem === this && p[a].queue === r && (p[a].anim.stop(!0), p.splice(a, 1));
            for (a = 0; a < B; a++)
              d[a] && d[a].finish && d[a].finish.call(this);
            delete o.finish;
          });
        }
      }), c.each(["toggle", "show", "hide"], function(r, a) {
        var o = c.fn[a];
        c.fn[a] = function(d, h, p) {
          return d == null || typeof d == "boolean" ? o.apply(this, arguments) : this.animate(nr(a, !0), d, h, p);
        };
      }), c.each({
        slideDown: nr("show"),
        slideUp: nr("hide"),
        slideToggle: nr("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
      }, function(r, a) {
        c.fn[r] = function(o, d, h) {
          return this.animate(a, o, d, h);
        };
      }), c.timers = [], c.fx.tick = function() {
        var r, a = 0, o = c.timers;
        for (Rt = Date.now(); a < o.length; a++)
          r = o[a], !r() && o[a] === r && o.splice(a--, 1);
        o.length || c.fx.stop(), Rt = void 0;
      }, c.fx.timer = function(r) {
        c.timers.push(r), c.fx.start();
      }, c.fx.interval = 13, c.fx.start = function() {
        tr || (tr = !0, Ui());
      }, c.fx.stop = function() {
        tr = null;
      }, c.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
      }, c.fn.delay = function(r, a) {
        return r = c.fx && c.fx.speeds[r] || r, a = a || "fx", this.queue(a, function(o, d) {
          var h = A.setTimeout(o, r);
          d.stop = function() {
            A.clearTimeout(h);
          };
        });
      }, (function() {
        var r = b.createElement("input"), a = b.createElement("select"), o = a.appendChild(b.createElement("option"));
        r.type = "checkbox", C.checkOn = r.value !== "", C.optSelected = o.selected, r = b.createElement("input"), r.value = "t", r.type = "radio", C.radioValue = r.value === "t";
      })();
      var bs, fn = c.expr.attrHandle;
      c.fn.extend({
        attr: function(r, a) {
          return _e(this, c.attr, r, a, arguments.length > 1);
        },
        removeAttr: function(r) {
          return this.each(function() {
            c.removeAttr(this, r);
          });
        }
      }), c.extend({
        attr: function(r, a, o) {
          var d, h, p = r.nodeType;
          if (!(p === 3 || p === 8 || p === 2)) {
            if (typeof r.getAttribute > "u")
              return c.prop(r, a, o);
            if ((p !== 1 || !c.isXMLDoc(r)) && (h = c.attrHooks[a.toLowerCase()] || (c.expr.match.bool.test(a) ? bs : void 0)), o !== void 0) {
              if (o === null) {
                c.removeAttr(r, a);
                return;
              }
              return h && "set" in h && (d = h.set(r, o, a)) !== void 0 ? d : (r.setAttribute(a, o + ""), o);
            }
            return h && "get" in h && (d = h.get(r, a)) !== null ? d : (d = c.find.attr(r, a), d ?? void 0);
          }
        },
        attrHooks: {
          type: {
            set: function(r, a) {
              if (!C.radioValue && a === "radio" && N(r, "input")) {
                var o = r.value;
                return r.setAttribute("type", a), o && (r.value = o), a;
              }
            }
          }
        },
        removeAttr: function(r, a) {
          var o, d = 0, h = a && a.match(He);
          if (h && r.nodeType === 1)
            for (; o = h[d++]; )
              r.removeAttribute(o);
        }
      }), bs = {
        set: function(r, a, o) {
          return a === !1 ? c.removeAttr(r, o) : r.setAttribute(o, o), o;
        }
      }, c.each(c.expr.match.bool.source.match(/\w+/g), function(r, a) {
        var o = fn[a] || c.find.attr;
        fn[a] = function(d, h, p) {
          var B, F, Q = h.toLowerCase();
          return p || (F = fn[Q], fn[Q] = B, B = o(d, h, p) != null ? Q : null, fn[Q] = F), B;
        };
      });
      var Ad = /^(?:input|select|textarea|button)$/i, ed = /^(?:a|area)$/i;
      c.fn.extend({
        prop: function(r, a) {
          return _e(this, c.prop, r, a, arguments.length > 1);
        },
        removeProp: function(r) {
          return this.each(function() {
            delete this[c.propFix[r] || r];
          });
        }
      }), c.extend({
        prop: function(r, a, o) {
          var d, h, p = r.nodeType;
          if (!(p === 3 || p === 8 || p === 2))
            return (p !== 1 || !c.isXMLDoc(r)) && (a = c.propFix[a] || a, h = c.propHooks[a]), o !== void 0 ? h && "set" in h && (d = h.set(r, o, a)) !== void 0 ? d : r[a] = o : h && "get" in h && (d = h.get(r, a)) !== null ? d : r[a];
        },
        propHooks: {
          tabIndex: {
            get: function(r) {
              var a = c.find.attr(r, "tabindex");
              return a ? parseInt(a, 10) : Ad.test(r.nodeName) || ed.test(r.nodeName) && r.href ? 0 : -1;
            }
          }
        },
        propFix: {
          for: "htmlFor",
          class: "className"
        }
      }), C.optSelected || (c.propHooks.selected = {
        get: function(r) {
          var a = r.parentNode;
          return a && a.parentNode && a.parentNode.selectedIndex, null;
        },
        set: function(r) {
          var a = r.parentNode;
          a && (a.selectedIndex, a.parentNode && a.parentNode.selectedIndex);
        }
      }), c.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
      ], function() {
        c.propFix[this.toLowerCase()] = this;
      });
      function mt(r) {
        var a = r.match(He) || [];
        return a.join(" ");
      }
      function yt(r) {
        return r.getAttribute && r.getAttribute("class") || "";
      }
      function bi(r) {
        return Array.isArray(r) ? r : typeof r == "string" ? r.match(He) || [] : [];
      }
      c.fn.extend({
        addClass: function(r) {
          var a, o, d, h, p, B;
          return y(r) ? this.each(function(F) {
            c(this).addClass(r.call(this, F, yt(this)));
          }) : (a = bi(r), a.length ? this.each(function() {
            if (d = yt(this), o = this.nodeType === 1 && " " + mt(d) + " ", o) {
              for (p = 0; p < a.length; p++)
                h = a[p], o.indexOf(" " + h + " ") < 0 && (o += h + " ");
              B = mt(o), d !== B && this.setAttribute("class", B);
            }
          }) : this);
        },
        removeClass: function(r) {
          var a, o, d, h, p, B;
          return y(r) ? this.each(function(F) {
            c(this).removeClass(r.call(this, F, yt(this)));
          }) : arguments.length ? (a = bi(r), a.length ? this.each(function() {
            if (d = yt(this), o = this.nodeType === 1 && " " + mt(d) + " ", o) {
              for (p = 0; p < a.length; p++)
                for (h = a[p]; o.indexOf(" " + h + " ") > -1; )
                  o = o.replace(" " + h + " ", " ");
              B = mt(o), d !== B && this.setAttribute("class", B);
            }
          }) : this) : this.attr("class", "");
        },
        toggleClass: function(r, a) {
          var o, d, h, p, B = typeof r, F = B === "string" || Array.isArray(r);
          return y(r) ? this.each(function(Q) {
            c(this).toggleClass(
              r.call(this, Q, yt(this), a),
              a
            );
          }) : typeof a == "boolean" && F ? a ? this.addClass(r) : this.removeClass(r) : (o = bi(r), this.each(function() {
            if (F)
              for (p = c(this), h = 0; h < o.length; h++)
                d = o[h], p.hasClass(d) ? p.removeClass(d) : p.addClass(d);
            else (r === void 0 || B === "boolean") && (d = yt(this), d && q.set(this, "__className__", d), this.setAttribute && this.setAttribute(
              "class",
              d || r === !1 ? "" : q.get(this, "__className__") || ""
            ));
          }));
        },
        hasClass: function(r) {
          var a, o, d = 0;
          for (a = " " + r + " "; o = this[d++]; )
            if (o.nodeType === 1 && (" " + mt(yt(o)) + " ").indexOf(a) > -1)
              return !0;
          return !1;
        }
      });
      var td = /\r/g;
      c.fn.extend({
        val: function(r) {
          var a, o, d, h = this[0];
          return arguments.length ? (d = y(r), this.each(function(p) {
            var B;
            this.nodeType === 1 && (d ? B = r.call(this, p, c(this).val()) : B = r, B == null ? B = "" : typeof B == "number" ? B += "" : Array.isArray(B) && (B = c.map(B, function(F) {
              return F == null ? "" : F + "";
            })), a = c.valHooks[this.type] || c.valHooks[this.nodeName.toLowerCase()], (!a || !("set" in a) || a.set(this, B, "value") === void 0) && (this.value = B));
          })) : h ? (a = c.valHooks[h.type] || c.valHooks[h.nodeName.toLowerCase()], a && "get" in a && (o = a.get(h, "value")) !== void 0 ? o : (o = h.value, typeof o == "string" ? o.replace(td, "") : o ?? "")) : void 0;
        }
      }), c.extend({
        valHooks: {
          option: {
            get: function(r) {
              var a = c.find.attr(r, "value");
              return a ?? // Support: IE <=10 - 11 only
              // option.text throws exceptions (trac-14686, trac-14858)
              // Strip and collapse whitespace
              // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
              mt(c.text(r));
            }
          },
          select: {
            get: function(r) {
              var a, o, d, h = r.options, p = r.selectedIndex, B = r.type === "select-one", F = B ? null : [], Q = B ? p + 1 : h.length;
              for (p < 0 ? d = Q : d = B ? p : 0; d < Q; d++)
                if (o = h[d], (o.selected || d === p) && // Don't return options that are disabled or in a disabled optgroup
                !o.disabled && (!o.parentNode.disabled || !N(o.parentNode, "optgroup"))) {
                  if (a = c(o).val(), B)
                    return a;
                  F.push(a);
                }
              return F;
            },
            set: function(r, a) {
              for (var o, d, h = r.options, p = c.makeArray(a), B = h.length; B--; )
                d = h[B], (d.selected = c.inArray(c.valHooks.option.get(d), p) > -1) && (o = !0);
              return o || (r.selectedIndex = -1), p;
            }
          }
        }
      }), c.each(["radio", "checkbox"], function() {
        c.valHooks[this] = {
          set: function(r, a) {
            if (Array.isArray(a))
              return r.checked = c.inArray(c(r).val(), a) > -1;
          }
        }, C.checkOn || (c.valHooks[this].get = function(r) {
          return r.getAttribute("value") === null ? "on" : r.value;
        });
      });
      var hn = A.location, Es = { guid: Date.now() }, Ei = /\?/;
      c.parseXML = function(r) {
        var a, o;
        if (!r || typeof r != "string")
          return null;
        try {
          a = new A.DOMParser().parseFromString(r, "text/xml");
        } catch {
        }
        return o = a && a.getElementsByTagName("parsererror")[0], (!a || o) && c.error("Invalid XML: " + (o ? c.map(o.childNodes, function(d) {
          return d.textContent;
        }).join(`
`) : r)), a;
      };
      var xs = /^(?:focusinfocus|focusoutblur)$/, Is = function(r) {
        r.stopPropagation();
      };
      c.extend(c.event, {
        trigger: function(r, a, o, d) {
          var h, p, B, F, Q, x, D, k, S = [o || b], P = v.call(r, "type") ? r.type : r, rA = v.call(r, "namespace") ? r.namespace.split(".") : [];
          if (p = k = B = o = o || b, !(o.nodeType === 3 || o.nodeType === 8) && !xs.test(P + c.event.triggered) && (P.indexOf(".") > -1 && (rA = P.split("."), P = rA.shift(), rA.sort()), Q = P.indexOf(":") < 0 && "on" + P, r = r[c.expando] ? r : new c.Event(P, typeof r == "object" && r), r.isTrigger = d ? 2 : 3, r.namespace = rA.join("."), r.rnamespace = r.namespace ? new RegExp("(^|\\.)" + rA.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, r.result = void 0, r.target || (r.target = o), a = a == null ? [r] : c.makeArray(a, [r]), D = c.event.special[P] || {}, !(!d && D.trigger && D.trigger.apply(o, a) === !1))) {
            if (!d && !D.noBubble && !I(o)) {
              for (F = D.delegateType || P, xs.test(F + P) || (p = p.parentNode); p; p = p.parentNode)
                S.push(p), B = p;
              B === (o.ownerDocument || b) && S.push(B.defaultView || B.parentWindow || A);
            }
            for (h = 0; (p = S[h++]) && !r.isPropagationStopped(); )
              k = p, r.type = h > 1 ? F : D.bindType || P, x = (q.get(p, "events") || /* @__PURE__ */ Object.create(null))[r.type] && q.get(p, "handle"), x && x.apply(p, a), x = Q && p[Q], x && x.apply && on(p) && (r.result = x.apply(p, a), r.result === !1 && r.preventDefault());
            return r.type = P, !d && !r.isDefaultPrevented() && (!D._default || D._default.apply(S.pop(), a) === !1) && on(o) && Q && y(o[P]) && !I(o) && (B = o[Q], B && (o[Q] = null), c.event.triggered = P, r.isPropagationStopped() && k.addEventListener(P, Is), o[P](), r.isPropagationStopped() && k.removeEventListener(P, Is), c.event.triggered = void 0, B && (o[Q] = B)), r.result;
          }
        },
        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function(r, a, o) {
          var d = c.extend(
            new c.Event(),
            o,
            {
              type: r,
              isSimulated: !0
            }
          );
          c.event.trigger(d, null, a);
        }
      }), c.fn.extend({
        trigger: function(r, a) {
          return this.each(function() {
            c.event.trigger(r, a, this);
          });
        },
        triggerHandler: function(r, a) {
          var o = this[0];
          if (o)
            return c.event.trigger(r, a, o, !0);
        }
      });
      var nd = /\[\]$/, Hs = /\r?\n/g, rd = /^(?:submit|button|image|reset|file)$/i, id = /^(?:input|select|textarea|keygen)/i;
      function xi(r, a, o, d) {
        var h;
        if (Array.isArray(a))
          c.each(a, function(p, B) {
            o || nd.test(r) ? d(r, B) : xi(
              r + "[" + (typeof B == "object" && B != null ? p : "") + "]",
              B,
              o,
              d
            );
          });
        else if (!o && M(a) === "object")
          for (h in a)
            xi(r + "[" + h + "]", a[h], o, d);
        else
          d(r, a);
      }
      c.param = function(r, a) {
        var o, d = [], h = function(p, B) {
          var F = y(B) ? B() : B;
          d[d.length] = encodeURIComponent(p) + "=" + encodeURIComponent(F ?? "");
        };
        if (r == null)
          return "";
        if (Array.isArray(r) || r.jquery && !c.isPlainObject(r))
          c.each(r, function() {
            h(this.name, this.value);
          });
        else
          for (o in r)
            xi(o, r[o], a, h);
        return d.join("&");
      }, c.fn.extend({
        serialize: function() {
          return c.param(this.serializeArray());
        },
        serializeArray: function() {
          return this.map(function() {
            var r = c.prop(this, "elements");
            return r ? c.makeArray(r) : this;
          }).filter(function() {
            var r = this.type;
            return this.name && !c(this).is(":disabled") && id.test(this.nodeName) && !rd.test(r) && (this.checked || !dn.test(r));
          }).map(function(r, a) {
            var o = c(this).val();
            return o == null ? null : Array.isArray(o) ? c.map(o, function(d) {
              return { name: a.name, value: d.replace(Hs, `\r
`) };
            }) : { name: a.name, value: o.replace(Hs, `\r
`) };
          }).get();
        }
      });
      var ad = /%20/g, sd = /#.*$/, od = /([?&])_=[^&]*/, ld = /^(.*?):[ \t]*([^\r\n]*)$/mg, cd = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, dd = /^(?:GET|HEAD)$/, ud = /^\/\//, Ss = {}, Ii = {}, Ls = "*/".concat("*"), Hi = b.createElement("a");
      Hi.href = hn.href;
      function Ts(r) {
        return function(a, o) {
          typeof a != "string" && (o = a, a = "*");
          var d, h = 0, p = a.toLowerCase().match(He) || [];
          if (y(o))
            for (; d = p[h++]; )
              d[0] === "+" ? (d = d.slice(1) || "*", (r[d] = r[d] || []).unshift(o)) : (r[d] = r[d] || []).push(o);
        };
      }
      function Ds(r, a, o, d) {
        var h = {}, p = r === Ii;
        function B(F) {
          var Q;
          return h[F] = !0, c.each(r[F] || [], function(x, D) {
            var k = D(a, o, d);
            if (typeof k == "string" && !p && !h[k])
              return a.dataTypes.unshift(k), B(k), !1;
            if (p)
              return !(Q = k);
          }), Q;
        }
        return B(a.dataTypes[0]) || !h["*"] && B("*");
      }
      function Si(r, a) {
        var o, d, h = c.ajaxSettings.flatOptions || {};
        for (o in a)
          a[o] !== void 0 && ((h[o] ? r : d || (d = {}))[o] = a[o]);
        return d && c.extend(!0, r, d), r;
      }
      function fd(r, a, o) {
        for (var d, h, p, B, F = r.contents, Q = r.dataTypes; Q[0] === "*"; )
          Q.shift(), d === void 0 && (d = r.mimeType || a.getResponseHeader("Content-Type"));
        if (d) {
          for (h in F)
            if (F[h] && F[h].test(d)) {
              Q.unshift(h);
              break;
            }
        }
        if (Q[0] in o)
          p = Q[0];
        else {
          for (h in o) {
            if (!Q[0] || r.converters[h + " " + Q[0]]) {
              p = h;
              break;
            }
            B || (B = h);
          }
          p = p || B;
        }
        if (p)
          return p !== Q[0] && Q.unshift(p), o[p];
      }
      function hd(r, a, o, d) {
        var h, p, B, F, Q, x = {}, D = r.dataTypes.slice();
        if (D[1])
          for (B in r.converters)
            x[B.toLowerCase()] = r.converters[B];
        for (p = D.shift(); p; )
          if (r.responseFields[p] && (o[r.responseFields[p]] = a), !Q && d && r.dataFilter && (a = r.dataFilter(a, r.dataType)), Q = p, p = D.shift(), p) {
            if (p === "*")
              p = Q;
            else if (Q !== "*" && Q !== p) {
              if (B = x[Q + " " + p] || x["* " + p], !B) {
                for (h in x)
                  if (F = h.split(" "), F[1] === p && (B = x[Q + " " + F[0]] || x["* " + F[0]], B)) {
                    B === !0 ? B = x[h] : x[h] !== !0 && (p = F[0], D.unshift(F[1]));
                    break;
                  }
              }
              if (B !== !0)
                if (B && r.throws)
                  a = B(a);
                else
                  try {
                    a = B(a);
                  } catch (k) {
                    return {
                      state: "parsererror",
                      error: B ? k : "No conversion from " + Q + " to " + p
                    };
                  }
            }
          }
        return { state: "success", data: a };
      }
      c.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: hn.href,
          type: "GET",
          isLocal: cd.test(hn.protocol),
          global: !0,
          processData: !0,
          async: !0,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          /*
          timeout: 0,
          data: null,
          dataType: null,
          username: null,
          password: null,
          cache: null,
          throws: false,
          traditional: false,
          headers: {},
          */
          accepts: {
            "*": Ls,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
          },
          contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/
          },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
          },
          // Data converters
          // Keys separate source (or catchall "*") and destination types with a single space
          converters: {
            // Convert anything to text
            "* text": String,
            // Text to html (true = no transformation)
            "text html": !0,
            // Evaluate text as a json expression
            "text json": JSON.parse,
            // Parse text as xml
            "text xml": c.parseXML
          },
          // For options that shouldn't be deep extended:
          // you can add your own custom options here if
          // and when you create one that shouldn't be
          // deep extended (see ajaxExtend)
          flatOptions: {
            url: !0,
            context: !0
          }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function(r, a) {
          return a ? (
            // Building a settings object
            Si(Si(r, c.ajaxSettings), a)
          ) : (
            // Extending ajaxSettings
            Si(c.ajaxSettings, r)
          );
        },
        ajaxPrefilter: Ts(Ss),
        ajaxTransport: Ts(Ii),
        // Main method
        ajax: function(r, a) {
          typeof r == "object" && (a = r, r = void 0), a = a || {};
          var o, d, h, p, B, F, Q, x, D, k, S = c.ajaxSetup({}, a), P = S.context || S, rA = S.context && (P.nodeType || P.jquery) ? c(P) : c.event, hA = c.Deferred(), sA = c.Callbacks("once memory"), _A = S.statusCode || {}, MA = {}, Le = {}, Te = "canceled", cA = {
            readyState: 0,
            // Builds headers hashtable if needed
            getResponseHeader: function(pA) {
              var IA;
              if (Q) {
                if (!p)
                  for (p = {}; IA = ld.exec(h); )
                    p[IA[1].toLowerCase() + " "] = (p[IA[1].toLowerCase() + " "] || []).concat(IA[2]);
                IA = p[pA.toLowerCase() + " "];
              }
              return IA == null ? null : IA.join(", ");
            },
            // Raw string
            getAllResponseHeaders: function() {
              return Q ? h : null;
            },
            // Caches the header
            setRequestHeader: function(pA, IA) {
              return Q == null && (pA = Le[pA.toLowerCase()] = Le[pA.toLowerCase()] || pA, MA[pA] = IA), this;
            },
            // Overrides response content-type header
            overrideMimeType: function(pA) {
              return Q == null && (S.mimeType = pA), this;
            },
            // Status-dependent callbacks
            statusCode: function(pA) {
              var IA;
              if (pA)
                if (Q)
                  cA.always(pA[cA.status]);
                else
                  for (IA in pA)
                    _A[IA] = [_A[IA], pA[IA]];
              return this;
            },
            // Cancel the request
            abort: function(pA) {
              var IA = pA || Te;
              return o && o.abort(IA), Ct(0, IA), this;
            }
          };
          if (hA.promise(cA), S.url = ((r || S.url || hn.href) + "").replace(ud, hn.protocol + "//"), S.type = a.method || a.type || S.method || S.type, S.dataTypes = (S.dataType || "*").toLowerCase().match(He) || [""], S.crossDomain == null) {
            F = b.createElement("a");
            try {
              F.href = S.url, F.href = F.href, S.crossDomain = Hi.protocol + "//" + Hi.host != F.protocol + "//" + F.host;
            } catch {
              S.crossDomain = !0;
            }
          }
          if (S.data && S.processData && typeof S.data != "string" && (S.data = c.param(S.data, S.traditional)), Ds(Ss, S, a, cA), Q)
            return cA;
          x = c.event && S.global, x && c.active++ === 0 && c.event.trigger("ajaxStart"), S.type = S.type.toUpperCase(), S.hasContent = !dd.test(S.type), d = S.url.replace(sd, ""), S.hasContent ? S.data && S.processData && (S.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && (S.data = S.data.replace(ad, "+")) : (k = S.url.slice(d.length), S.data && (S.processData || typeof S.data == "string") && (d += (Ei.test(d) ? "&" : "?") + S.data, delete S.data), S.cache === !1 && (d = d.replace(od, "$1"), k = (Ei.test(d) ? "&" : "?") + "_=" + Es.guid++ + k), S.url = d + k), S.ifModified && (c.lastModified[d] && cA.setRequestHeader("If-Modified-Since", c.lastModified[d]), c.etag[d] && cA.setRequestHeader("If-None-Match", c.etag[d])), (S.data && S.hasContent && S.contentType !== !1 || a.contentType) && cA.setRequestHeader("Content-Type", S.contentType), cA.setRequestHeader(
            "Accept",
            S.dataTypes[0] && S.accepts[S.dataTypes[0]] ? S.accepts[S.dataTypes[0]] + (S.dataTypes[0] !== "*" ? ", " + Ls + "; q=0.01" : "") : S.accepts["*"]
          );
          for (D in S.headers)
            cA.setRequestHeader(D, S.headers[D]);
          if (S.beforeSend && (S.beforeSend.call(P, cA, S) === !1 || Q))
            return cA.abort();
          if (Te = "abort", sA.add(S.complete), cA.done(S.success), cA.fail(S.error), o = Ds(Ii, S, a, cA), !o)
            Ct(-1, "No Transport");
          else {
            if (cA.readyState = 1, x && rA.trigger("ajaxSend", [cA, S]), Q)
              return cA;
            S.async && S.timeout > 0 && (B = A.setTimeout(function() {
              cA.abort("timeout");
            }, S.timeout));
            try {
              Q = !1, o.send(MA, Ct);
            } catch (pA) {
              if (Q)
                throw pA;
              Ct(-1, pA);
            }
          }
          function Ct(pA, IA, gn, Ti) {
            var De, Bn, Ke, et, tt, pe = IA;
            Q || (Q = !0, B && A.clearTimeout(B), o = void 0, h = Ti || "", cA.readyState = pA > 0 ? 4 : 0, De = pA >= 200 && pA < 300 || pA === 304, gn && (et = fd(S, cA, gn)), !De && c.inArray("script", S.dataTypes) > -1 && c.inArray("json", S.dataTypes) < 0 && (S.converters["text script"] = function() {
            }), et = hd(S, et, cA, De), De ? (S.ifModified && (tt = cA.getResponseHeader("Last-Modified"), tt && (c.lastModified[d] = tt), tt = cA.getResponseHeader("etag"), tt && (c.etag[d] = tt)), pA === 204 || S.type === "HEAD" ? pe = "nocontent" : pA === 304 ? pe = "notmodified" : (pe = et.state, Bn = et.data, Ke = et.error, De = !Ke)) : (Ke = pe, (pA || !pe) && (pe = "error", pA < 0 && (pA = 0))), cA.status = pA, cA.statusText = (IA || pe) + "", De ? hA.resolveWith(P, [Bn, pe, cA]) : hA.rejectWith(P, [cA, pe, Ke]), cA.statusCode(_A), _A = void 0, x && rA.trigger(
              De ? "ajaxSuccess" : "ajaxError",
              [cA, S, De ? Bn : Ke]
            ), sA.fireWith(P, [cA, pe]), x && (rA.trigger("ajaxComplete", [cA, S]), --c.active || c.event.trigger("ajaxStop")));
          }
          return cA;
        },
        getJSON: function(r, a, o) {
          return c.get(r, a, o, "json");
        },
        getScript: function(r, a) {
          return c.get(r, void 0, a, "script");
        }
      }), c.each(["get", "post"], function(r, a) {
        c[a] = function(o, d, h, p) {
          return y(d) && (p = p || h, h = d, d = void 0), c.ajax(c.extend({
            url: o,
            type: a,
            dataType: p,
            data: d,
            success: h
          }, c.isPlainObject(o) && o));
        };
      }), c.ajaxPrefilter(function(r) {
        var a;
        for (a in r.headers)
          a.toLowerCase() === "content-type" && (r.contentType = r.headers[a] || "");
      }), c._evalUrl = function(r, a, o) {
        return c.ajax({
          url: r,
          // Make this explicit, since user can override this through ajaxSetup (trac-11264)
          type: "GET",
          dataType: "script",
          cache: !0,
          async: !1,
          global: !1,
          // Only evaluate the response if it is successful (gh-4126)
          // dataFilter is not invoked for failure responses, so using it instead
          // of the default converter is kludgy but it works.
          converters: {
            "text script": function() {
            }
          },
          dataFilter: function(d) {
            c.globalEval(d, a, o);
          }
        });
      }, c.fn.extend({
        wrapAll: function(r) {
          var a;
          return this[0] && (y(r) && (r = r.call(this[0])), a = c(r, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && a.insertBefore(this[0]), a.map(function() {
            for (var o = this; o.firstElementChild; )
              o = o.firstElementChild;
            return o;
          }).append(this)), this;
        },
        wrapInner: function(r) {
          return y(r) ? this.each(function(a) {
            c(this).wrapInner(r.call(this, a));
          }) : this.each(function() {
            var a = c(this), o = a.contents();
            o.length ? o.wrapAll(r) : a.append(r);
          });
        },
        wrap: function(r) {
          var a = y(r);
          return this.each(function(o) {
            c(this).wrapAll(a ? r.call(this, o) : r);
          });
        },
        unwrap: function(r) {
          return this.parent(r).not("body").each(function() {
            c(this).replaceWith(this.childNodes);
          }), this;
        }
      }), c.expr.pseudos.hidden = function(r) {
        return !c.expr.pseudos.visible(r);
      }, c.expr.pseudos.visible = function(r) {
        return !!(r.offsetWidth || r.offsetHeight || r.getClientRects().length);
      }, c.ajaxSettings.xhr = function() {
        try {
          return new A.XMLHttpRequest();
        } catch {
        }
      };
      var pd = {
        // File protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE <=9 only
        // trac-1450: sometimes IE returns 1223 when it should be 204
        1223: 204
      }, pn = c.ajaxSettings.xhr();
      C.cors = !!pn && "withCredentials" in pn, C.ajax = pn = !!pn, c.ajaxTransport(function(r) {
        var a, o;
        if (C.cors || pn && !r.crossDomain)
          return {
            send: function(d, h) {
              var p, B = r.xhr();
              if (B.open(
                r.type,
                r.url,
                r.async,
                r.username,
                r.password
              ), r.xhrFields)
                for (p in r.xhrFields)
                  B[p] = r.xhrFields[p];
              r.mimeType && B.overrideMimeType && B.overrideMimeType(r.mimeType), !r.crossDomain && !d["X-Requested-With"] && (d["X-Requested-With"] = "XMLHttpRequest");
              for (p in d)
                B.setRequestHeader(p, d[p]);
              a = function(F) {
                return function() {
                  a && (a = o = B.onload = B.onerror = B.onabort = B.ontimeout = B.onreadystatechange = null, F === "abort" ? B.abort() : F === "error" ? typeof B.status != "number" ? h(0, "error") : h(
                    // File: protocol always yields status 0; see trac-8605, trac-14207
                    B.status,
                    B.statusText
                  ) : h(
                    pd[B.status] || B.status,
                    B.statusText,
                    // Support: IE <=9 only
                    // IE9 has no XHR2 but throws on binary (trac-11426)
                    // For XHR2 non-text, let the caller handle it (gh-2498)
                    (B.responseType || "text") !== "text" || typeof B.responseText != "string" ? { binary: B.response } : { text: B.responseText },
                    B.getAllResponseHeaders()
                  ));
                };
              }, B.onload = a(), o = B.onerror = B.ontimeout = a("error"), B.onabort !== void 0 ? B.onabort = o : B.onreadystatechange = function() {
                B.readyState === 4 && A.setTimeout(function() {
                  a && o();
                });
              }, a = a("abort");
              try {
                B.send(r.hasContent && r.data || null);
              } catch (F) {
                if (a)
                  throw F;
              }
            },
            abort: function() {
              a && a();
            }
          };
      }), c.ajaxPrefilter(function(r) {
        r.crossDomain && (r.contents.script = !1);
      }), c.ajaxSetup({
        accepts: {
          script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
          script: /\b(?:java|ecma)script\b/
        },
        converters: {
          "text script": function(r) {
            return c.globalEval(r), r;
          }
        }
      }), c.ajaxPrefilter("script", function(r) {
        r.cache === void 0 && (r.cache = !1), r.crossDomain && (r.type = "GET");
      }), c.ajaxTransport("script", function(r) {
        if (r.crossDomain || r.scriptAttrs) {
          var a, o;
          return {
            send: function(d, h) {
              a = c("<script>").attr(r.scriptAttrs || {}).prop({ charset: r.scriptCharset, src: r.url }).on("load error", o = function(p) {
                a.remove(), o = null, p && h(p.type === "error" ? 404 : 200, p.type);
              }), b.head.appendChild(a[0]);
            },
            abort: function() {
              o && o();
            }
          };
        }
      });
      var Ks = [], Li = /(=)\?(?=&|$)|\?\?/;
      c.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
          var r = Ks.pop() || c.expando + "_" + Es.guid++;
          return this[r] = !0, r;
        }
      }), c.ajaxPrefilter("json jsonp", function(r, a, o) {
        var d, h, p, B = r.jsonp !== !1 && (Li.test(r.url) ? "url" : typeof r.data == "string" && (r.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && Li.test(r.data) && "data");
        if (B || r.dataTypes[0] === "jsonp")
          return d = r.jsonpCallback = y(r.jsonpCallback) ? r.jsonpCallback() : r.jsonpCallback, B ? r[B] = r[B].replace(Li, "$1" + d) : r.jsonp !== !1 && (r.url += (Ei.test(r.url) ? "&" : "?") + r.jsonp + "=" + d), r.converters["script json"] = function() {
            return p || c.error(d + " was not called"), p[0];
          }, r.dataTypes[0] = "json", h = A[d], A[d] = function() {
            p = arguments;
          }, o.always(function() {
            h === void 0 ? c(A).removeProp(d) : A[d] = h, r[d] && (r.jsonpCallback = a.jsonpCallback, Ks.push(d)), p && y(h) && h(p[0]), p = h = void 0;
          }), "script";
      }), C.createHTMLDocument = (function() {
        var r = b.implementation.createHTMLDocument("").body;
        return r.innerHTML = "<form></form><form></form>", r.childNodes.length === 2;
      })(), c.parseHTML = function(r, a, o) {
        if (typeof r != "string")
          return [];
        typeof a == "boolean" && (o = a, a = !1);
        var d, h, p;
        return a || (C.createHTMLDocument ? (a = b.implementation.createHTMLDocument(""), d = a.createElement("base"), d.href = b.location.href, a.head.appendChild(d)) : a = b), h = fe.exec(r), p = !o && [], h ? [a.createElement(h[1])] : (h = ds([r], a, p), p && p.length && c(p).remove(), c.merge([], h.childNodes));
      }, c.fn.load = function(r, a, o) {
        var d, h, p, B = this, F = r.indexOf(" ");
        return F > -1 && (d = mt(r.slice(F)), r = r.slice(0, F)), y(a) ? (o = a, a = void 0) : a && typeof a == "object" && (h = "POST"), B.length > 0 && c.ajax({
          url: r,
          // If "type" variable is undefined, then "GET" method will be used.
          // Make value of this field explicit since
          // user can override it through ajaxSetup method
          type: h || "GET",
          dataType: "html",
          data: a
        }).done(function(Q) {
          p = arguments, B.html(d ? (
            // If a selector was specified, locate the right elements in a dummy div
            // Exclude scripts to avoid IE 'Permission Denied' errors
            c("<div>").append(c.parseHTML(Q)).find(d)
          ) : (
            // Otherwise use the full result
            Q
          ));
        }).always(o && function(Q, x) {
          B.each(function() {
            o.apply(this, p || [Q.responseText, x, Q]);
          });
        }), this;
      }, c.expr.pseudos.animated = function(r) {
        return c.grep(c.timers, function(a) {
          return r === a.elem;
        }).length;
      }, c.offset = {
        setOffset: function(r, a, o) {
          var d, h, p, B, F, Q, x, D = c.css(r, "position"), k = c(r), S = {};
          D === "static" && (r.style.position = "relative"), F = k.offset(), p = c.css(r, "top"), Q = c.css(r, "left"), x = (D === "absolute" || D === "fixed") && (p + Q).indexOf("auto") > -1, x ? (d = k.position(), B = d.top, h = d.left) : (B = parseFloat(p) || 0, h = parseFloat(Q) || 0), y(a) && (a = a.call(r, o, c.extend({}, F))), a.top != null && (S.top = a.top - F.top + B), a.left != null && (S.left = a.left - F.left + h), "using" in a ? a.using.call(r, S) : k.css(S);
        }
      }, c.fn.extend({
        // offset() relates an element's border box to the document origin
        offset: function(r) {
          if (arguments.length)
            return r === void 0 ? this : this.each(function(h) {
              c.offset.setOffset(this, r, h);
            });
          var a, o, d = this[0];
          if (d)
            return d.getClientRects().length ? (a = d.getBoundingClientRect(), o = d.ownerDocument.defaultView, {
              top: a.top + o.pageYOffset,
              left: a.left + o.pageXOffset
            }) : { top: 0, left: 0 };
        },
        // position() relates an element's margin box to its offset parent's padding box
        // This corresponds to the behavior of CSS absolute positioning
        position: function() {
          if (this[0]) {
            var r, a, o, d = this[0], h = { top: 0, left: 0 };
            if (c.css(d, "position") === "fixed")
              a = d.getBoundingClientRect();
            else {
              for (a = this.offset(), o = d.ownerDocument, r = d.offsetParent || o.documentElement; r && (r === o.body || r === o.documentElement) && c.css(r, "position") === "static"; )
                r = r.parentNode;
              r && r !== d && r.nodeType === 1 && (h = c(r).offset(), h.top += c.css(r, "borderTopWidth", !0), h.left += c.css(r, "borderLeftWidth", !0));
            }
            return {
              top: a.top - h.top - c.css(d, "marginTop", !0),
              left: a.left - h.left - c.css(d, "marginLeft", !0)
            };
          }
        },
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function() {
          return this.map(function() {
            for (var r = this.offsetParent; r && c.css(r, "position") === "static"; )
              r = r.offsetParent;
            return r || vt;
          });
        }
      }), c.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(r, a) {
        var o = a === "pageYOffset";
        c.fn[r] = function(d) {
          return _e(this, function(h, p, B) {
            var F;
            if (I(h) ? F = h : h.nodeType === 9 && (F = h.defaultView), B === void 0)
              return F ? F[a] : h[p];
            F ? F.scrollTo(
              o ? F.pageXOffset : B,
              o ? B : F.pageYOffset
            ) : h[p] = B;
          }, r, d, arguments.length);
        };
      }), c.each(["top", "left"], function(r, a) {
        c.cssHooks[a] = Bs(
          C.pixelPosition,
          function(o, d) {
            if (d)
              return d = un(o, a), yi.test(d) ? c(o).position()[a] + "px" : d;
          }
        );
      }), c.each({ Height: "height", Width: "width" }, function(r, a) {
        c.each({
          padding: "inner" + r,
          content: a,
          "": "outer" + r
        }, function(o, d) {
          c.fn[d] = function(h, p) {
            var B = arguments.length && (o || typeof h != "boolean"), F = o || (h === !0 || p === !0 ? "margin" : "border");
            return _e(this, function(Q, x, D) {
              var k;
              return I(Q) ? d.indexOf("outer") === 0 ? Q["inner" + r] : Q.document.documentElement["client" + r] : Q.nodeType === 9 ? (k = Q.documentElement, Math.max(
                Q.body["scroll" + r],
                k["scroll" + r],
                Q.body["offset" + r],
                k["offset" + r],
                k["client" + r]
              )) : D === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                c.css(Q, x, F)
              ) : (
                // Set width or height on the element
                c.style(Q, x, D, F)
              );
            }, a, B ? h : void 0, B);
          };
        });
      }), c.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
      ], function(r, a) {
        c.fn[a] = function(o) {
          return this.on(a, o);
        };
      }), c.fn.extend({
        bind: function(r, a, o) {
          return this.on(r, null, a, o);
        },
        unbind: function(r, a) {
          return this.off(r, null, a);
        },
        delegate: function(r, a, o, d) {
          return this.on(a, r, o, d);
        },
        undelegate: function(r, a, o) {
          return arguments.length === 1 ? this.off(r, "**") : this.off(a, r || "**", o);
        },
        hover: function(r, a) {
          return this.on("mouseenter", r).on("mouseleave", a || r);
        }
      }), c.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
        function(r, a) {
          c.fn[a] = function(o, d) {
            return arguments.length > 0 ? this.on(a, null, o, d) : this.trigger(a);
          };
        }
      );
      var gd = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
      c.proxy = function(r, a) {
        var o, d, h;
        if (typeof a == "string" && (o = r[a], a = r, r = o), !!y(r))
          return d = s.call(arguments, 2), h = function() {
            return r.apply(a || this, d.concat(s.call(arguments)));
          }, h.guid = r.guid = r.guid || c.guid++, h;
      }, c.holdReady = function(r) {
        r ? c.readyWait++ : c.ready(!0);
      }, c.isArray = Array.isArray, c.parseJSON = JSON.parse, c.nodeName = N, c.isFunction = y, c.isWindow = I, c.camelCase = Se, c.type = M, c.now = Date.now, c.isNumeric = function(r) {
        var a = c.type(r);
        return (a === "number" || a === "string") && // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(r - parseFloat(r));
      }, c.trim = function(r) {
        return r == null ? "" : (r + "").replace(gd, "$1");
      };
      var Bd = A.jQuery, wd = A.$;
      return c.noConflict = function(r) {
        return A.$ === c && (A.$ = wd), r && A.jQuery === c && (A.jQuery = Bd), c;
      }, typeof t > "u" && (A.jQuery = A.$ = c), c;
    });
  })(Or)), Or.exports;
}
var Rd = Md();
const Lt = /* @__PURE__ */ sl(Rd);
function or(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Ni = { exports: {} }, Vs;
function Pd() {
  return Vs || (Vs = 1, (function(e, A) {
    (function(t) {
      e.exports = t();
    })(function() {
      return (function t(n, i, s) {
        function l(g, w) {
          if (!i[g]) {
            if (!n[g]) {
              var v = typeof or == "function" && or;
              if (!w && v) return v(g, !0);
              if (u) return u(g, !0);
              var U = new Error("Cannot find module '" + g + "'");
              throw U.code = "MODULE_NOT_FOUND", U;
            }
            var L = i[g] = { exports: {} };
            n[g][0].call(L.exports, function(C) {
              var y = n[g][1][C];
              return l(y || C);
            }, L, L.exports, t, n, i, s);
          }
          return i[g].exports;
        }
        for (var u = typeof or == "function" && or, f = 0; f < s.length; f++) l(s[f]);
        return l;
      })({ 1: [function(t, n, i) {
        var s = Object.getOwnPropertySymbols, l = Object.prototype.hasOwnProperty, u = Object.prototype.propertyIsEnumerable;
        function f(w) {
          if (w == null)
            throw new TypeError("Object.assign cannot be called with null or undefined");
          return Object(w);
        }
        function g() {
          try {
            if (!Object.assign)
              return !1;
            var w = new String("abc");
            if (w[5] = "de", Object.getOwnPropertyNames(w)[0] === "5")
              return !1;
            for (var v = {}, U = 0; U < 10; U++)
              v["_" + String.fromCharCode(U)] = U;
            var L = Object.getOwnPropertyNames(v).map(function(y) {
              return v[y];
            });
            if (L.join("") !== "0123456789")
              return !1;
            var C = {};
            return "abcdefghijklmnopqrst".split("").forEach(function(y) {
              C[y] = y;
            }), Object.keys(Object.assign({}, C)).join("") === "abcdefghijklmnopqrst";
          } catch {
            return !1;
          }
        }
        n.exports = g() ? Object.assign : function(w, v) {
          for (var U, L = f(w), C, y = 1; y < arguments.length; y++) {
            U = Object(arguments[y]);
            for (var I in U)
              l.call(U, I) && (L[I] = U[I]);
            if (s) {
              C = s(U);
              for (var b = 0; b < C.length; b++)
                u.call(U, C[b]) && (L[C[b]] = U[C[b]]);
            }
          }
          return L;
        };
      }, {}], 2: [function(t, n, i) {
        (function(s) {
          (function() {
            var l, u, f, g, w, v;
            typeof performance < "u" && performance !== null && performance.now ? n.exports = function() {
              return performance.now();
            } : typeof s < "u" && s !== null && s.hrtime ? (n.exports = function() {
              return (l() - w) / 1e6;
            }, u = s.hrtime, l = function() {
              var U;
              return U = u(), U[0] * 1e9 + U[1];
            }, g = l(), v = s.uptime() * 1e9, w = g - v) : Date.now ? (n.exports = function() {
              return Date.now() - f;
            }, f = Date.now()) : (n.exports = function() {
              return (/* @__PURE__ */ new Date()).getTime() - f;
            }, f = (/* @__PURE__ */ new Date()).getTime());
          }).call(this);
        }).call(this, t("_process"));
      }, { _process: 3 }], 3: [function(t, n, i) {
        var s = n.exports = {}, l, u;
        function f() {
          throw new Error("setTimeout has not been defined");
        }
        function g() {
          throw new Error("clearTimeout has not been defined");
        }
        (function() {
          try {
            typeof setTimeout == "function" ? l = setTimeout : l = f;
          } catch {
            l = f;
          }
          try {
            typeof clearTimeout == "function" ? u = clearTimeout : u = g;
          } catch {
            u = g;
          }
        })();
        function w(M) {
          if (l === setTimeout)
            return setTimeout(M, 0);
          if ((l === f || !l) && setTimeout)
            return l = setTimeout, setTimeout(M, 0);
          try {
            return l(M, 0);
          } catch {
            try {
              return l.call(null, M, 0);
            } catch {
              return l.call(this, M, 0);
            }
          }
        }
        function v(M) {
          if (u === clearTimeout)
            return clearTimeout(M);
          if ((u === g || !u) && clearTimeout)
            return u = clearTimeout, clearTimeout(M);
          try {
            return u(M);
          } catch {
            try {
              return u.call(null, M);
            } catch {
              return u.call(this, M);
            }
          }
        }
        var U = [], L = !1, C, y = -1;
        function I() {
          !L || !C || (L = !1, C.length ? U = C.concat(U) : y = -1, U.length && b());
        }
        function b() {
          if (!L) {
            var M = w(I);
            L = !0;
            for (var _ = U.length; _; ) {
              for (C = U, U = []; ++y < _; )
                C && C[y].run();
              y = -1, _ = U.length;
            }
            C = null, L = !1, v(M);
          }
        }
        s.nextTick = function(M) {
          var _ = new Array(arguments.length - 1);
          if (arguments.length > 1)
            for (var R = 1; R < arguments.length; R++)
              _[R - 1] = arguments[R];
          U.push(new O(M, _)), U.length === 1 && !L && w(b);
        };
        function O(M, _) {
          this.fun = M, this.array = _;
        }
        O.prototype.run = function() {
          this.fun.apply(null, this.array);
        }, s.title = "browser", s.browser = !0, s.env = {}, s.argv = [], s.version = "", s.versions = {};
        function $() {
        }
        s.on = $, s.addListener = $, s.once = $, s.off = $, s.removeListener = $, s.removeAllListeners = $, s.emit = $, s.prependListener = $, s.prependOnceListener = $, s.listeners = function(M) {
          return [];
        }, s.binding = function(M) {
          throw new Error("process.binding is not supported");
        }, s.cwd = function() {
          return "/";
        }, s.chdir = function(M) {
          throw new Error("process.chdir is not supported");
        }, s.umask = function() {
          return 0;
        };
      }, {}], 4: [function(t, n, i) {
        (function(s) {
          for (var l = t("performance-now"), u = typeof window > "u" ? s : window, f = ["moz", "webkit"], g = "AnimationFrame", w = u["request" + g], v = u["cancel" + g] || u["cancelRequest" + g], U = 0; !w && U < f.length; U++)
            w = u[f[U] + "Request" + g], v = u[f[U] + "Cancel" + g] || u[f[U] + "CancelRequest" + g];
          if (!w || !v) {
            var L = 0, C = 0, y = [], I = 1e3 / 60;
            w = function(b) {
              if (y.length === 0) {
                var O = l(), $ = Math.max(0, I - (O - L));
                L = $ + O, setTimeout(function() {
                  var M = y.slice(0);
                  y.length = 0;
                  for (var _ = 0; _ < M.length; _++)
                    if (!M[_].cancelled)
                      try {
                        M[_].callback(L);
                      } catch (R) {
                        setTimeout(function() {
                          throw R;
                        }, 0);
                      }
                }, Math.round($));
              }
              return y.push({
                handle: ++C,
                callback: b,
                cancelled: !1
              }), C;
            }, v = function(b) {
              for (var O = 0; O < y.length; O++)
                y[O].handle === b && (y[O].cancelled = !0);
            };
          }
          n.exports = function(b) {
            return w.call(u, b);
          }, n.exports.cancel = function() {
            v.apply(u, arguments);
          }, n.exports.polyfill = function() {
            u.requestAnimationFrame = w, u.cancelAnimationFrame = v;
          };
        }).call(this, typeof Gs < "u" ? Gs : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, { "performance-now": 2 }], 5: [function(t, n, i) {
        var s = /* @__PURE__ */ (function() {
          function L(C, y) {
            for (var I = 0; I < y.length; I++) {
              var b = y[I];
              b.enumerable = b.enumerable || !1, b.configurable = !0, "value" in b && (b.writable = !0), Object.defineProperty(C, b.key, b);
            }
          }
          return function(C, y, I) {
            return y && L(C.prototype, y), I && L(C, I), C;
          };
        })();
        function l(L, C) {
          if (!(L instanceof C))
            throw new TypeError("Cannot call a class as a function");
        }
        var u = t("raf"), f = t("object-assign"), g = {
          propertyCache: {},
          vendors: [null, ["-webkit-", "webkit"], ["-moz-", "Moz"], ["-o-", "O"], ["-ms-", "ms"]],
          clamp: function(C, y, I) {
            return y < I ? C < y ? y : C > I ? I : C : C < I ? I : C > y ? y : C;
          },
          data: function(C, y) {
            return g.deserialize(C.getAttribute("data-" + y));
          },
          deserialize: function(C) {
            return C === "true" ? !0 : C === "false" ? !1 : C === "null" ? null : !isNaN(parseFloat(C)) && isFinite(C) ? parseFloat(C) : C;
          },
          camelCase: function(C) {
            return C.replace(/-+(.)?/g, function(y, I) {
              return I ? I.toUpperCase() : "";
            });
          },
          accelerate: function(C) {
            g.css(C, "transform", "translate3d(0,0,0) rotate(0.0001deg)"), g.css(C, "transform-style", "preserve-3d"), g.css(C, "backface-visibility", "hidden");
          },
          transformSupport: function(C) {
            for (var y = document.createElement("div"), I = !1, b = null, O = !1, $ = null, M = null, _ = 0, R = g.vendors.length; _ < R; _++)
              if (g.vendors[_] !== null ? ($ = g.vendors[_][0] + "transform", M = g.vendors[_][1] + "Transform") : ($ = "transform", M = "transform"), y.style[M] !== void 0) {
                I = !0;
                break;
              }
            switch (C) {
              case "2D":
                O = I;
                break;
              case "3D":
                if (I) {
                  var c = document.body || document.createElement("body"), AA = document.documentElement, N = AA.style.overflow, gA = !1;
                  document.body || (gA = !0, AA.style.overflow = "hidden", AA.appendChild(c), c.style.overflow = "hidden", c.style.background = ""), c.appendChild(y), y.style[M] = "translate3d(1px,1px,1px)", b = window.getComputedStyle(y).getPropertyValue($), O = b !== void 0 && b.length > 0 && b !== "none", AA.style.overflow = N, c.removeChild(y), gA && (c.removeAttribute("style"), c.parentNode.removeChild(c));
                }
                break;
            }
            return O;
          },
          css: function(C, y, I) {
            var b = g.propertyCache[y];
            if (!b) {
              for (var O = 0, $ = g.vendors.length; O < $; O++)
                if (g.vendors[O] !== null ? b = g.camelCase(g.vendors[O][1] + "-" + y) : b = y, C.style[b] !== void 0) {
                  g.propertyCache[y] = b;
                  break;
                }
            }
            C.style[b] = I;
          }
        }, w = 30, v = {
          relativeInput: !1,
          clipRelativeInput: !1,
          inputElement: null,
          hoverOnly: !1,
          calibrationThreshold: 100,
          calibrationDelay: 500,
          supportDelay: 500,
          calibrateX: !1,
          calibrateY: !0,
          invertX: !0,
          invertY: !0,
          limitX: !1,
          limitY: !1,
          scalarX: 10,
          scalarY: 10,
          frictionX: 0.1,
          frictionY: 0.1,
          originX: 0.5,
          originY: 0.5,
          pointerEvents: !1,
          precision: 1,
          onReady: null,
          selector: null
        }, U = (function() {
          function L(C, y) {
            l(this, L), this.element = C;
            var I = {
              calibrateX: g.data(this.element, "calibrate-x"),
              calibrateY: g.data(this.element, "calibrate-y"),
              invertX: g.data(this.element, "invert-x"),
              invertY: g.data(this.element, "invert-y"),
              limitX: g.data(this.element, "limit-x"),
              limitY: g.data(this.element, "limit-y"),
              scalarX: g.data(this.element, "scalar-x"),
              scalarY: g.data(this.element, "scalar-y"),
              frictionX: g.data(this.element, "friction-x"),
              frictionY: g.data(this.element, "friction-y"),
              originX: g.data(this.element, "origin-x"),
              originY: g.data(this.element, "origin-y"),
              pointerEvents: g.data(this.element, "pointer-events"),
              precision: g.data(this.element, "precision"),
              relativeInput: g.data(this.element, "relative-input"),
              clipRelativeInput: g.data(this.element, "clip-relative-input"),
              hoverOnly: g.data(this.element, "hover-only"),
              inputElement: document.querySelector(g.data(this.element, "input-element")),
              selector: g.data(this.element, "selector")
            };
            for (var b in I)
              I[b] === null && delete I[b];
            f(this, v, I, y), this.inputElement || (this.inputElement = this.element), this.calibrationTimer = null, this.calibrationFlag = !0, this.enabled = !1, this.depthsX = [], this.depthsY = [], this.raf = null, this.bounds = null, this.elementPositionX = 0, this.elementPositionY = 0, this.elementWidth = 0, this.elementHeight = 0, this.elementCenterX = 0, this.elementCenterY = 0, this.elementRangeX = 0, this.elementRangeY = 0, this.calibrationX = 0, this.calibrationY = 0, this.inputX = 0, this.inputY = 0, this.motionX = 0, this.motionY = 0, this.velocityX = 0, this.velocityY = 0, this.onMouseMove = this.onMouseMove.bind(this), this.onDeviceOrientation = this.onDeviceOrientation.bind(this), this.onDeviceMotion = this.onDeviceMotion.bind(this), this.onOrientationTimer = this.onOrientationTimer.bind(this), this.onMotionTimer = this.onMotionTimer.bind(this), this.onCalibrationTimer = this.onCalibrationTimer.bind(this), this.onAnimationFrame = this.onAnimationFrame.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.windowWidth = null, this.windowHeight = null, this.windowCenterX = null, this.windowCenterY = null, this.windowRadiusX = null, this.windowRadiusY = null, this.portrait = !1, this.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), this.motionSupport = !!window.DeviceMotionEvent && !this.desktop, this.orientationSupport = !!window.DeviceOrientationEvent && !this.desktop, this.orientationStatus = 0, this.motionStatus = 0, this.initialise();
          }
          return s(L, [{
            key: "initialise",
            value: function() {
              this.transform2DSupport === void 0 && (this.transform2DSupport = g.transformSupport("2D"), this.transform3DSupport = g.transformSupport("3D")), this.transform3DSupport && g.accelerate(this.element);
              var y = window.getComputedStyle(this.element);
              y.getPropertyValue("position") === "static" && (this.element.style.position = "relative"), this.pointerEvents || (this.element.style.pointerEvents = "none"), this.updateLayers(), this.updateDimensions(), this.enable(), this.queueCalibration(this.calibrationDelay);
            }
          }, {
            key: "doReadyCallback",
            value: function() {
              this.onReady && this.onReady();
            }
          }, {
            key: "updateLayers",
            value: function() {
              this.selector ? this.layers = this.element.querySelectorAll(this.selector) : this.layers = this.element.children, this.layers.length || console.warn("ParallaxJS: Your scene does not have any layers."), this.depthsX = [], this.depthsY = [];
              for (var y = 0; y < this.layers.length; y++) {
                var I = this.layers[y];
                this.transform3DSupport && g.accelerate(I), I.style.position = y ? "absolute" : "relative", I.style.display = "block", I.style.left = 0, I.style.top = 0;
                var b = g.data(I, "depth") || 0;
                this.depthsX.push(g.data(I, "depth-x") || b), this.depthsY.push(g.data(I, "depth-y") || b);
              }
            }
          }, {
            key: "updateDimensions",
            value: function() {
              this.windowWidth = window.innerWidth, this.windowHeight = window.innerHeight, this.windowCenterX = this.windowWidth * this.originX, this.windowCenterY = this.windowHeight * this.originY, this.windowRadiusX = Math.max(this.windowCenterX, this.windowWidth - this.windowCenterX), this.windowRadiusY = Math.max(this.windowCenterY, this.windowHeight - this.windowCenterY);
            }
          }, {
            key: "updateBounds",
            value: function() {
              this.bounds = this.inputElement.getBoundingClientRect(), this.elementPositionX = this.bounds.left, this.elementPositionY = this.bounds.top, this.elementWidth = this.bounds.width, this.elementHeight = this.bounds.height, this.elementCenterX = this.elementWidth * this.originX, this.elementCenterY = this.elementHeight * this.originY, this.elementRangeX = Math.max(this.elementCenterX, this.elementWidth - this.elementCenterX), this.elementRangeY = Math.max(this.elementCenterY, this.elementHeight - this.elementCenterY);
            }
          }, {
            key: "queueCalibration",
            value: function(y) {
              clearTimeout(this.calibrationTimer), this.calibrationTimer = setTimeout(this.onCalibrationTimer, y);
            }
          }, {
            key: "enable",
            value: function() {
              this.enabled || (this.enabled = !0, this.orientationSupport ? (this.portrait = !1, window.addEventListener("deviceorientation", this.onDeviceOrientation), this.detectionTimer = setTimeout(this.onOrientationTimer, this.supportDelay)) : this.motionSupport ? (this.portrait = !1, window.addEventListener("devicemotion", this.onDeviceMotion), this.detectionTimer = setTimeout(this.onMotionTimer, this.supportDelay)) : (this.calibrationX = 0, this.calibrationY = 0, this.portrait = !1, window.addEventListener("mousemove", this.onMouseMove), this.doReadyCallback()), window.addEventListener("resize", this.onWindowResize), this.raf = u(this.onAnimationFrame));
            }
          }, {
            key: "disable",
            value: function() {
              this.enabled && (this.enabled = !1, this.orientationSupport ? window.removeEventListener("deviceorientation", this.onDeviceOrientation) : this.motionSupport ? window.removeEventListener("devicemotion", this.onDeviceMotion) : window.removeEventListener("mousemove", this.onMouseMove), window.removeEventListener("resize", this.onWindowResize), u.cancel(this.raf));
            }
          }, {
            key: "calibrate",
            value: function(y, I) {
              this.calibrateX = y === void 0 ? this.calibrateX : y, this.calibrateY = I === void 0 ? this.calibrateY : I;
            }
          }, {
            key: "invert",
            value: function(y, I) {
              this.invertX = y === void 0 ? this.invertX : y, this.invertY = I === void 0 ? this.invertY : I;
            }
          }, {
            key: "friction",
            value: function(y, I) {
              this.frictionX = y === void 0 ? this.frictionX : y, this.frictionY = I === void 0 ? this.frictionY : I;
            }
          }, {
            key: "scalar",
            value: function(y, I) {
              this.scalarX = y === void 0 ? this.scalarX : y, this.scalarY = I === void 0 ? this.scalarY : I;
            }
          }, {
            key: "limit",
            value: function(y, I) {
              this.limitX = y === void 0 ? this.limitX : y, this.limitY = I === void 0 ? this.limitY : I;
            }
          }, {
            key: "origin",
            value: function(y, I) {
              this.originX = y === void 0 ? this.originX : y, this.originY = I === void 0 ? this.originY : I;
            }
          }, {
            key: "setInputElement",
            value: function(y) {
              this.inputElement = y, this.updateDimensions();
            }
          }, {
            key: "setPosition",
            value: function(y, I, b) {
              I = I.toFixed(this.precision) + "px", b = b.toFixed(this.precision) + "px", this.transform3DSupport ? g.css(y, "transform", "translate3d(" + I + "," + b + ",0)") : this.transform2DSupport ? g.css(y, "transform", "translate(" + I + "," + b + ")") : (y.style.left = I, y.style.top = b);
            }
          }, {
            key: "onOrientationTimer",
            value: function() {
              this.orientationSupport && this.orientationStatus === 0 ? (this.disable(), this.orientationSupport = !1, this.enable()) : this.doReadyCallback();
            }
          }, {
            key: "onMotionTimer",
            value: function() {
              this.motionSupport && this.motionStatus === 0 ? (this.disable(), this.motionSupport = !1, this.enable()) : this.doReadyCallback();
            }
          }, {
            key: "onCalibrationTimer",
            value: function() {
              this.calibrationFlag = !0;
            }
          }, {
            key: "onWindowResize",
            value: function() {
              this.updateDimensions();
            }
          }, {
            key: "onAnimationFrame",
            value: function() {
              this.updateBounds();
              var y = this.inputX - this.calibrationX, I = this.inputY - this.calibrationY;
              (Math.abs(y) > this.calibrationThreshold || Math.abs(I) > this.calibrationThreshold) && this.queueCalibration(0), this.portrait ? (this.motionX = this.calibrateX ? I : this.inputY, this.motionY = this.calibrateY ? y : this.inputX) : (this.motionX = this.calibrateX ? y : this.inputX, this.motionY = this.calibrateY ? I : this.inputY), this.motionX *= this.elementWidth * (this.scalarX / 100), this.motionY *= this.elementHeight * (this.scalarY / 100), isNaN(parseFloat(this.limitX)) || (this.motionX = g.clamp(this.motionX, -this.limitX, this.limitX)), isNaN(parseFloat(this.limitY)) || (this.motionY = g.clamp(this.motionY, -this.limitY, this.limitY)), this.velocityX += (this.motionX - this.velocityX) * this.frictionX, this.velocityY += (this.motionY - this.velocityY) * this.frictionY;
              for (var b = 0; b < this.layers.length; b++) {
                var O = this.layers[b], $ = this.depthsX[b], M = this.depthsY[b], _ = this.velocityX * ($ * (this.invertX ? -1 : 1)), R = this.velocityY * (M * (this.invertY ? -1 : 1));
                this.setPosition(O, _, R);
              }
              this.raf = u(this.onAnimationFrame);
            }
          }, {
            key: "rotate",
            value: function(y, I) {
              var b = (y || 0) / w, O = (I || 0) / w, $ = this.windowHeight > this.windowWidth;
              this.portrait !== $ && (this.portrait = $, this.calibrationFlag = !0), this.calibrationFlag && (this.calibrationFlag = !1, this.calibrationX = b, this.calibrationY = O), this.inputX = b, this.inputY = O;
            }
          }, {
            key: "onDeviceOrientation",
            value: function(y) {
              var I = y.beta, b = y.gamma;
              I !== null && b !== null && (this.orientationStatus = 1, this.rotate(I, b));
            }
          }, {
            key: "onDeviceMotion",
            value: function(y) {
              var I = y.rotationRate.beta, b = y.rotationRate.gamma;
              I !== null && b !== null && (this.motionStatus = 1, this.rotate(I, b));
            }
          }, {
            key: "onMouseMove",
            value: function(y) {
              var I = y.clientX, b = y.clientY;
              if (this.hoverOnly && (I < this.elementPositionX || I > this.elementPositionX + this.elementWidth || b < this.elementPositionY || b > this.elementPositionY + this.elementHeight)) {
                this.inputX = 0, this.inputY = 0;
                return;
              }
              this.relativeInput ? (this.clipRelativeInput && (I = Math.max(I, this.elementPositionX), I = Math.min(I, this.elementPositionX + this.elementWidth), b = Math.max(b, this.elementPositionY), b = Math.min(b, this.elementPositionY + this.elementHeight)), this.elementRangeX && this.elementRangeY && (this.inputX = (I - this.elementPositionX - this.elementCenterX) / this.elementRangeX, this.inputY = (b - this.elementPositionY - this.elementCenterY) / this.elementRangeY)) : this.windowRadiusX && this.windowRadiusY && (this.inputX = (I - this.windowCenterX) / this.windowRadiusX, this.inputY = (b - this.windowCenterY) / this.windowRadiusY);
            }
          }, {
            key: "destroy",
            value: function() {
              this.disable(), clearTimeout(this.calibrationTimer), clearTimeout(this.detectionTimer), this.element.removeAttribute("style");
              for (var y = 0; y < this.layers.length; y++)
                this.layers[y].removeAttribute("style");
              delete this.element, delete this.layers;
            }
          }, {
            key: "version",
            value: function() {
              return "3.1.0";
            }
          }]), L;
        })();
        n.exports = U;
      }, { "object-assign": 1, raf: 4 }] }, {}, [5])(5);
    });
  })(Ni)), Ni.exports;
}
var Nd = Pd();
const ol = /* @__PURE__ */ sl(Nd);
function _d(e, A, t) {
  return (A = Vd(A)) in e ? Object.defineProperty(e, A, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[A] = t, e;
}
function ze() {
  return ze = Object.assign ? Object.assign.bind() : function(e) {
    for (var A = 1; A < arguments.length; A++) {
      var t = arguments[A];
      for (var n in t) ({}).hasOwnProperty.call(t, n) && (e[n] = t[n]);
    }
    return e;
  }, ze.apply(null, arguments);
}
function Ys(e, A) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    A && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), t.push.apply(t, n);
  }
  return t;
}
function Re(e) {
  for (var A = 1; A < arguments.length; A++) {
    var t = arguments[A] != null ? arguments[A] : {};
    A % 2 ? Ys(Object(t), !0).forEach(function(n) {
      _d(e, n, t[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Ys(Object(t)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(t, n));
    });
  }
  return e;
}
function $d(e, A) {
  if (e == null) return {};
  var t, n, i = Gd(e, A);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (n = 0; n < s.length; n++) t = s[n], A.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (i[t] = e[t]);
  }
  return i;
}
function Gd(e, A) {
  if (e == null) return {};
  var t = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (A.indexOf(n) !== -1) continue;
    t[n] = e[n];
  }
  return t;
}
function Xd(e, A) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(e, A);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (A === "string" ? String : Number)(e);
}
function Vd(e) {
  var A = Xd(e, "string");
  return typeof A == "symbol" ? A : A + "";
}
function wa(e) {
  "@babel/helpers - typeof";
  return wa = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(A) {
    return typeof A;
  } : function(A) {
    return A && typeof Symbol == "function" && A.constructor === Symbol && A !== Symbol.prototype ? "symbol" : typeof A;
  }, wa(e);
}
var Yd = "1.15.7";
function Je(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Ze = Je(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Yn = Je(/Edge/i), Ws = Je(/firefox/i), Dn = Je(/safari/i) && !Je(/chrome/i) && !Je(/android/i), Va = Je(/iP(ad|od|hone)/i), ll = Je(/chrome/i) && Je(/android/i), cl = {
  capture: !1,
  passive: !1
};
function fA(e, A, t) {
  e.addEventListener(A, t, !Ze && cl);
}
function uA(e, A, t) {
  e.removeEventListener(A, t, !Ze && cl);
}
function Vr(e, A) {
  if (A) {
    if (A[0] === ">" && (A = A.substring(1)), e)
      try {
        if (e.matches)
          return e.matches(A);
        if (e.msMatchesSelector)
          return e.msMatchesSelector(A);
        if (e.webkitMatchesSelector)
          return e.webkitMatchesSelector(A);
      } catch {
        return !1;
      }
    return !1;
  }
}
function dl(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function Ee(e, A, t, n) {
  if (e) {
    t = t || document;
    do {
      if (A != null && (A[0] === ">" ? e.parentNode === t && Vr(e, A) : Vr(e, A)) || n && e === t)
        return e;
      if (e === t) break;
    } while (e = dl(e));
  }
  return null;
}
var Js = /\s+/g;
function le(e, A, t) {
  if (e && A)
    if (e.classList)
      e.classList[t ? "add" : "remove"](A);
    else {
      var n = (" " + e.className + " ").replace(Js, " ").replace(" " + A + " ", " ");
      e.className = (n + (t ? " " + A : "")).replace(Js, " ");
    }
}
function nA(e, A, t) {
  var n = e && e.style;
  if (n) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), A === void 0 ? t : t[A];
    !(A in n) && A.indexOf("webkit") === -1 && (A = "-webkit-" + A), n[A] = t + (typeof t == "string" ? "" : "px");
  }
}
function en(e, A) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var n = nA(e, "transform");
      n && n !== "none" && (t = n + " " + t);
    } while (!A && (e = e.parentNode));
  var i = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return i && new i(t);
}
function ul(e, A, t) {
  if (e) {
    var n = e.getElementsByTagName(A), i = 0, s = n.length;
    if (t)
      for (; i < s; i++)
        t(n[i], i);
    return n;
  }
  return [];
}
function Me() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function KA(e, A, t, n, i) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var s, l, u, f, g, w, v;
    if (e !== window && e.parentNode && e !== Me() ? (s = e.getBoundingClientRect(), l = s.top, u = s.left, f = s.bottom, g = s.right, w = s.height, v = s.width) : (l = 0, u = 0, f = window.innerHeight, g = window.innerWidth, w = window.innerHeight, v = window.innerWidth), (A || t) && e !== window && (i = i || e.parentNode, !Ze))
      do
        if (i && i.getBoundingClientRect && (nA(i, "transform") !== "none" || t && nA(i, "position") !== "static")) {
          var U = i.getBoundingClientRect();
          l -= U.top + parseInt(nA(i, "border-top-width")), u -= U.left + parseInt(nA(i, "border-left-width")), f = l + s.height, g = u + s.width;
          break;
        }
      while (i = i.parentNode);
    if (n && e !== window) {
      var L = en(i || e), C = L && L.a, y = L && L.d;
      L && (l /= y, u /= C, v /= C, w /= y, f = l + w, g = u + v);
    }
    return {
      top: l,
      left: u,
      bottom: f,
      right: g,
      width: v,
      height: w
    };
  }
}
function js(e, A, t) {
  for (var n = ct(e, !0), i = KA(e)[A]; n; ) {
    var s = KA(n)[t], l = void 0;
    if (l = i >= s, !l) return n;
    if (n === Me()) break;
    n = ct(n, !1);
  }
  return !1;
}
function rn(e, A, t, n) {
  for (var i = 0, s = 0, l = e.children; s < l.length; ) {
    if (l[s].style.display !== "none" && l[s] !== eA.ghost && (n || l[s] !== eA.dragged) && Ee(l[s], t.draggable, e, !1)) {
      if (i === A)
        return l[s];
      i++;
    }
    s++;
  }
  return null;
}
function Ya(e, A) {
  for (var t = e.lastElementChild; t && (t === eA.ghost || nA(t, "display") === "none" || A && !Vr(t, A)); )
    t = t.previousElementSibling;
  return t || null;
}
function Be(e, A) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== eA.clone && (!A || Vr(e, A)) && t++;
  return t;
}
function zs(e) {
  var A = 0, t = 0, n = Me();
  if (e)
    do {
      var i = en(e), s = i.a, l = i.d;
      A += e.scrollLeft * s, t += e.scrollTop * l;
    } while (e !== n && (e = e.parentNode));
  return [A, t];
}
function Wd(e, A) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var n in A)
        if (A.hasOwnProperty(n) && A[n] === e[t][n]) return Number(t);
    }
  return -1;
}
function ct(e, A) {
  if (!e || !e.getBoundingClientRect) return Me();
  var t = e, n = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var i = nA(t);
      if (t.clientWidth < t.scrollWidth && (i.overflowX == "auto" || i.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (i.overflowY == "auto" || i.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return Me();
        if (n || A) return t;
        n = !0;
      }
    }
  while (t = t.parentNode);
  return Me();
}
function Jd(e, A) {
  if (e && A)
    for (var t in A)
      A.hasOwnProperty(t) && (e[t] = A[t]);
  return e;
}
function _i(e, A) {
  return Math.round(e.top) === Math.round(A.top) && Math.round(e.left) === Math.round(A.left) && Math.round(e.height) === Math.round(A.height) && Math.round(e.width) === Math.round(A.width);
}
var Kn;
function fl(e, A) {
  return function() {
    if (!Kn) {
      var t = arguments, n = this;
      t.length === 1 ? e.call(n, t[0]) : e.apply(n, t), Kn = setTimeout(function() {
        Kn = void 0;
      }, A);
    }
  };
}
function jd() {
  clearTimeout(Kn), Kn = void 0;
}
function hl(e, A, t) {
  e.scrollLeft += A, e.scrollTop += t;
}
function pl(e) {
  var A = window.Polymer, t = window.jQuery || window.Zepto;
  return A && A.dom ? A.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function gl(e, A, t) {
  var n = {};
  return Array.from(e.children).forEach(function(i) {
    var s, l, u, f;
    if (!(!Ee(i, A.draggable, e, !1) || i.animated || i === t)) {
      var g = KA(i);
      n.left = Math.min((s = n.left) !== null && s !== void 0 ? s : 1 / 0, g.left), n.top = Math.min((l = n.top) !== null && l !== void 0 ? l : 1 / 0, g.top), n.right = Math.max((u = n.right) !== null && u !== void 0 ? u : -1 / 0, g.right), n.bottom = Math.max((f = n.bottom) !== null && f !== void 0 ? f : -1 / 0, g.bottom);
    }
  }), n.width = n.right - n.left, n.height = n.bottom - n.top, n.x = n.left, n.y = n.top, n;
}
var ae = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function zd() {
  var e = [], A;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var n = [].slice.call(this.el.children);
        n.forEach(function(i) {
          if (!(nA(i, "display") === "none" || i === eA.ghost)) {
            e.push({
              target: i,
              rect: KA(i)
            });
            var s = Re({}, e[e.length - 1].rect);
            if (i.thisAnimationDuration) {
              var l = en(i, !0);
              l && (s.top -= l.f, s.left -= l.e);
            }
            i.fromRect = s;
          }
        });
      }
    },
    addAnimationState: function(n) {
      e.push(n);
    },
    removeAnimationState: function(n) {
      e.splice(Wd(e, {
        target: n
      }), 1);
    },
    animateAll: function(n) {
      var i = this;
      if (!this.options.animation) {
        clearTimeout(A), typeof n == "function" && n();
        return;
      }
      var s = !1, l = 0;
      e.forEach(function(u) {
        var f = 0, g = u.target, w = g.fromRect, v = KA(g), U = g.prevFromRect, L = g.prevToRect, C = u.rect, y = en(g, !0);
        y && (v.top -= y.f, v.left -= y.e), g.toRect = v, g.thisAnimationDuration && _i(U, v) && !_i(w, v) && // Make sure animatingRect is on line between toRect & fromRect
        (C.top - v.top) / (C.left - v.left) === (w.top - v.top) / (w.left - v.left) && (f = Zd(C, U, L, i.options)), _i(v, w) || (g.prevFromRect = w, g.prevToRect = v, f || (f = i.options.animation), i.animate(g, C, v, f)), f && (s = !0, l = Math.max(l, f), clearTimeout(g.animationResetTimer), g.animationResetTimer = setTimeout(function() {
          g.animationTime = 0, g.prevFromRect = null, g.fromRect = null, g.prevToRect = null, g.thisAnimationDuration = null;
        }, f), g.thisAnimationDuration = f);
      }), clearTimeout(A), s ? A = setTimeout(function() {
        typeof n == "function" && n();
      }, l) : typeof n == "function" && n(), e = [];
    },
    animate: function(n, i, s, l) {
      if (l) {
        nA(n, "transition", ""), nA(n, "transform", "");
        var u = en(this.el), f = u && u.a, g = u && u.d, w = (i.left - s.left) / (f || 1), v = (i.top - s.top) / (g || 1);
        n.animatingX = !!w, n.animatingY = !!v, nA(n, "transform", "translate3d(" + w + "px," + v + "px,0)"), this.forRepaintDummy = qd(n), nA(n, "transition", "transform " + l + "ms" + (this.options.easing ? " " + this.options.easing : "")), nA(n, "transform", "translate3d(0,0,0)"), typeof n.animated == "number" && clearTimeout(n.animated), n.animated = setTimeout(function() {
          nA(n, "transition", ""), nA(n, "transform", ""), n.animated = !1, n.animatingX = !1, n.animatingY = !1;
        }, l);
      }
    }
  };
}
function qd(e) {
  return e.offsetWidth;
}
function Zd(e, A, t, n) {
  return Math.sqrt(Math.pow(A.top - e.top, 2) + Math.pow(A.left - e.left, 2)) / Math.sqrt(Math.pow(A.top - t.top, 2) + Math.pow(A.left - t.left, 2)) * n.animation;
}
var _t = [], $i = {
  initializeByDefault: !0
}, Wn = {
  mount: function(A) {
    for (var t in $i)
      $i.hasOwnProperty(t) && !(t in A) && (A[t] = $i[t]);
    _t.forEach(function(n) {
      if (n.pluginName === A.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(A.pluginName, " more than once");
    }), _t.push(A);
  },
  pluginEvent: function(A, t, n) {
    var i = this;
    this.eventCanceled = !1, n.cancel = function() {
      i.eventCanceled = !0;
    };
    var s = A + "Global";
    _t.forEach(function(l) {
      t[l.pluginName] && (t[l.pluginName][s] && t[l.pluginName][s](Re({
        sortable: t
      }, n)), t.options[l.pluginName] && t[l.pluginName][A] && t[l.pluginName][A](Re({
        sortable: t
      }, n)));
    });
  },
  initializePlugins: function(A, t, n, i) {
    _t.forEach(function(u) {
      var f = u.pluginName;
      if (!(!A.options[f] && !u.initializeByDefault)) {
        var g = new u(A, t, A.options);
        g.sortable = A, g.options = A.options, A[f] = g, ze(n, g.defaults);
      }
    });
    for (var s in A.options)
      if (A.options.hasOwnProperty(s)) {
        var l = this.modifyOption(A, s, A.options[s]);
        typeof l < "u" && (A.options[s] = l);
      }
  },
  getEventProperties: function(A, t) {
    var n = {};
    return _t.forEach(function(i) {
      typeof i.eventProperties == "function" && ze(n, i.eventProperties.call(t[i.pluginName], A));
    }), n;
  },
  modifyOption: function(A, t, n) {
    var i;
    return _t.forEach(function(s) {
      A[s.pluginName] && s.optionListeners && typeof s.optionListeners[t] == "function" && (i = s.optionListeners[t].call(A[s.pluginName], n));
    }), i;
  }
};
function Au(e) {
  var A = e.sortable, t = e.rootEl, n = e.name, i = e.targetEl, s = e.cloneEl, l = e.toEl, u = e.fromEl, f = e.oldIndex, g = e.newIndex, w = e.oldDraggableIndex, v = e.newDraggableIndex, U = e.originalEvent, L = e.putSortable, C = e.extraEventProperties;
  if (A = A || t && t[ae], !!A) {
    var y, I = A.options, b = "on" + n.charAt(0).toUpperCase() + n.substr(1);
    window.CustomEvent && !Ze && !Yn ? y = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0
    }) : (y = document.createEvent("Event"), y.initEvent(n, !0, !0)), y.to = l || t, y.from = u || t, y.item = i || t, y.clone = s, y.oldIndex = f, y.newIndex = g, y.oldDraggableIndex = w, y.newDraggableIndex = v, y.originalEvent = U, y.pullMode = L ? L.lastPutMode : void 0;
    var O = Re(Re({}, C), Wn.getEventProperties(n, A));
    for (var $ in O)
      y[$] = O[$];
    t && t.dispatchEvent(y), I[b] && I[b].call(A, y);
  }
}
var eu = ["evt"], re = function(A, t) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = n.evt, s = $d(n, eu);
  Wn.pluginEvent.bind(eA)(A, t, Re({
    dragEl: X,
    parentEl: HA,
    ghostEl: aA,
    rootEl: EA,
    nextEl: Et,
    lastDownEl: Mr,
    cloneEl: xA,
    cloneHidden: lt,
    dragStarted: Qn,
    putSortable: $A,
    activeSortable: eA.active,
    originalEvent: i,
    oldIndex: Zt,
    oldDraggableIndex: kn,
    newIndex: de,
    newDraggableIndex: st,
    hideGhostForTarget: ml,
    unhideGhostForTarget: yl,
    cloneNowHidden: function() {
      lt = !0;
    },
    cloneNowShown: function() {
      lt = !1;
    },
    dispatchSortableEvent: function(u) {
      qA({
        sortable: t,
        name: u,
        originalEvent: i
      });
    }
  }, s));
};
function qA(e) {
  Au(Re({
    putSortable: $A,
    cloneEl: xA,
    targetEl: X,
    rootEl: EA,
    oldIndex: Zt,
    oldDraggableIndex: kn,
    newIndex: de,
    newDraggableIndex: st
  }, e));
}
var X, HA, aA, EA, Et, Mr, xA, lt, Zt, de, kn, st, lr, $A, jt = !1, Yr = !1, Wr = [], Ft, Ue, Gi, Xi, qs, Zs, Qn, $t, On, Mn = !1, cr = !1, Rr, WA, Vi = [], va = !1, Jr = [], si = typeof document < "u", dr = Va, Ao = Yn || Ze ? "cssFloat" : "float", tu = si && !ll && !Va && "draggable" in document.createElement("div"), Bl = (function() {
  if (si) {
    if (Ze)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), wl = function(A, t) {
  var n = nA(A), i = parseInt(n.width) - parseInt(n.paddingLeft) - parseInt(n.paddingRight) - parseInt(n.borderLeftWidth) - parseInt(n.borderRightWidth), s = rn(A, 0, t), l = rn(A, 1, t), u = s && nA(s), f = l && nA(l), g = u && parseInt(u.marginLeft) + parseInt(u.marginRight) + KA(s).width, w = f && parseInt(f.marginLeft) + parseInt(f.marginRight) + KA(l).width;
  if (n.display === "flex")
    return n.flexDirection === "column" || n.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (n.display === "grid")
    return n.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (s && u.float && u.float !== "none") {
    var v = u.float === "left" ? "left" : "right";
    return l && (f.clear === "both" || f.clear === v) ? "vertical" : "horizontal";
  }
  return s && (u.display === "block" || u.display === "flex" || u.display === "table" || u.display === "grid" || g >= i && n[Ao] === "none" || l && n[Ao] === "none" && g + w > i) ? "vertical" : "horizontal";
}, nu = function(A, t, n) {
  var i = n ? A.left : A.top, s = n ? A.right : A.bottom, l = n ? A.width : A.height, u = n ? t.left : t.top, f = n ? t.right : t.bottom, g = n ? t.width : t.height;
  return i === u || s === f || i + l / 2 === u + g / 2;
}, ru = function(A, t) {
  var n;
  return Wr.some(function(i) {
    var s = i[ae].options.emptyInsertThreshold;
    if (!(!s || Ya(i))) {
      var l = KA(i), u = A >= l.left - s && A <= l.right + s, f = t >= l.top - s && t <= l.bottom + s;
      if (u && f)
        return n = i;
    }
  }), n;
}, vl = function(A) {
  function t(s, l) {
    return function(u, f, g, w) {
      var v = u.options.group.name && f.options.group.name && u.options.group.name === f.options.group.name;
      if (s == null && (l || v))
        return !0;
      if (s == null || s === !1)
        return !1;
      if (l && s === "clone")
        return s;
      if (typeof s == "function")
        return t(s(u, f, g, w), l)(u, f, g, w);
      var U = (l ? u : f).options.group.name;
      return s === !0 || typeof s == "string" && s === U || s.join && s.indexOf(U) > -1;
    };
  }
  var n = {}, i = A.group;
  (!i || wa(i) != "object") && (i = {
    name: i
  }), n.name = i.name, n.checkPull = t(i.pull, !0), n.checkPut = t(i.put), n.revertClone = i.revertClone, A.group = n;
}, ml = function() {
  !Bl && aA && nA(aA, "display", "none");
}, yl = function() {
  !Bl && aA && nA(aA, "display", "");
};
si && !ll && document.addEventListener("click", function(e) {
  if (Yr)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Yr = !1, !1;
}, !0);
var Ut = function(A) {
  if (X) {
    A = A.touches ? A.touches[0] : A;
    var t = ru(A.clientX, A.clientY);
    if (t) {
      var n = {};
      for (var i in A)
        A.hasOwnProperty(i) && (n[i] = A[i]);
      n.target = n.rootEl = t, n.preventDefault = void 0, n.stopPropagation = void 0, t[ae]._onDragOver(n);
    }
  }
}, iu = function(A) {
  X && X.parentNode[ae]._isOutsideThisEl(A.target);
};
function eA(e, A) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = A = ze({}, A), e[ae] = this;
  var t = {
    group: null,
    sort: !0,
    disabled: !1,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(e.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: !1,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: !0,
    direction: function() {
      return wl(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(l, u) {
      l.setData("Text", u.textContent);
    },
    dropBubble: !1,
    dragoverBubble: !1,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: !1,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: !1,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: !1,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    // Disabled on Safari: #1571; Enabled on Safari IOS: #2244
    supportPointer: eA.supportPointer !== !1 && "PointerEvent" in window && (!Dn || Va),
    emptyInsertThreshold: 5
  };
  Wn.initializePlugins(this, e, t);
  for (var n in t)
    !(n in A) && (A[n] = t[n]);
  vl(A);
  for (var i in this)
    i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
  this.nativeDraggable = A.forceFallback ? !1 : tu, this.nativeDraggable && (this.options.touchStartThreshold = 1), A.supportPointer ? fA(e, "pointerdown", this._onTapStart) : (fA(e, "mousedown", this._onTapStart), fA(e, "touchstart", this._onTapStart)), this.nativeDraggable && (fA(e, "dragover", this), fA(e, "dragenter", this)), Wr.push(this.el), A.store && A.store.get && this.sort(A.store.get(this) || []), ze(this, zd());
}
eA.prototype = /** @lends Sortable.prototype */
{
  constructor: eA,
  _isOutsideThisEl: function(A) {
    !this.el.contains(A) && A !== this.el && ($t = null);
  },
  _getDirection: function(A, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, A, t, X) : this.options.direction;
  },
  _onTapStart: function(A) {
    if (A.cancelable) {
      var t = this, n = this.el, i = this.options, s = i.preventOnFilter, l = A.type, u = A.touches && A.touches[0] || A.pointerType && A.pointerType === "touch" && A, f = (u || A).target, g = A.target.shadowRoot && (A.path && A.path[0] || A.composedPath && A.composedPath()[0]) || f, w = i.filter;
      if (fu(n), !X && !(/mousedown|pointerdown/.test(l) && A.button !== 0 || i.disabled) && !g.isContentEditable && !(!this.nativeDraggable && Dn && f && f.tagName.toUpperCase() === "SELECT") && (f = Ee(f, i.draggable, n, !1), !(f && f.animated) && Mr !== f)) {
        if (Zt = Be(f), kn = Be(f, i.draggable), typeof w == "function") {
          if (w.call(this, A, f, this)) {
            qA({
              sortable: t,
              rootEl: g,
              name: "filter",
              targetEl: f,
              toEl: n,
              fromEl: n
            }), re("filter", t, {
              evt: A
            }), s && A.preventDefault();
            return;
          }
        } else if (w && (w = w.split(",").some(function(v) {
          if (v = Ee(g, v.trim(), n, !1), v)
            return qA({
              sortable: t,
              rootEl: v,
              name: "filter",
              targetEl: f,
              fromEl: n,
              toEl: n
            }), re("filter", t, {
              evt: A
            }), !0;
        }), w)) {
          s && A.preventDefault();
          return;
        }
        i.handle && !Ee(g, i.handle, n, !1) || this._prepareDragStart(A, u, f);
      }
    }
  },
  _prepareDragStart: function(A, t, n) {
    var i = this, s = i.el, l = i.options, u = s.ownerDocument, f;
    if (n && !X && n.parentNode === s) {
      var g = KA(n);
      if (EA = s, X = n, HA = X.parentNode, Et = X.nextSibling, Mr = n, lr = l.group, eA.dragged = X, Ft = {
        target: X,
        clientX: (t || A).clientX,
        clientY: (t || A).clientY
      }, qs = Ft.clientX - g.left, Zs = Ft.clientY - g.top, this._lastX = (t || A).clientX, this._lastY = (t || A).clientY, X.style["will-change"] = "all", f = function() {
        if (re("delayEnded", i, {
          evt: A
        }), eA.eventCanceled) {
          i._onDrop();
          return;
        }
        i._disableDelayedDragEvents(), !Ws && i.nativeDraggable && (X.draggable = !0), i._triggerDragStart(A, t), qA({
          sortable: i,
          name: "choose",
          originalEvent: A
        }), le(X, l.chosenClass, !0);
      }, l.ignore.split(",").forEach(function(w) {
        ul(X, w.trim(), Yi);
      }), fA(u, "dragover", Ut), fA(u, "mousemove", Ut), fA(u, "touchmove", Ut), l.supportPointer ? (fA(u, "pointerup", i._onDrop), !this.nativeDraggable && fA(u, "pointercancel", i._onDrop)) : (fA(u, "mouseup", i._onDrop), fA(u, "touchend", i._onDrop), fA(u, "touchcancel", i._onDrop)), Ws && this.nativeDraggable && (this.options.touchStartThreshold = 4, X.draggable = !0), re("delayStart", this, {
        evt: A
      }), l.delay && (!l.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Yn || Ze))) {
        if (eA.eventCanceled) {
          this._onDrop();
          return;
        }
        l.supportPointer ? (fA(u, "pointerup", i._disableDelayedDrag), fA(u, "pointercancel", i._disableDelayedDrag)) : (fA(u, "mouseup", i._disableDelayedDrag), fA(u, "touchend", i._disableDelayedDrag), fA(u, "touchcancel", i._disableDelayedDrag)), fA(u, "mousemove", i._delayedDragTouchMoveHandler), fA(u, "touchmove", i._delayedDragTouchMoveHandler), l.supportPointer && fA(u, "pointermove", i._delayedDragTouchMoveHandler), i._dragStartTimer = setTimeout(f, l.delay);
      } else
        f();
    }
  },
  _delayedDragTouchMoveHandler: function(A) {
    var t = A.touches ? A.touches[0] : A;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    X && Yi(X), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var A = this.el.ownerDocument;
    uA(A, "mouseup", this._disableDelayedDrag), uA(A, "touchend", this._disableDelayedDrag), uA(A, "touchcancel", this._disableDelayedDrag), uA(A, "pointerup", this._disableDelayedDrag), uA(A, "pointercancel", this._disableDelayedDrag), uA(A, "mousemove", this._delayedDragTouchMoveHandler), uA(A, "touchmove", this._delayedDragTouchMoveHandler), uA(A, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(A, t) {
    t = t || A.pointerType == "touch" && A, !this.nativeDraggable || t ? this.options.supportPointer ? fA(document, "pointermove", this._onTouchMove) : t ? fA(document, "touchmove", this._onTouchMove) : fA(document, "mousemove", this._onTouchMove) : (fA(X, "dragend", this), fA(EA, "dragstart", this._onDragStart));
    try {
      document.selection ? Pr(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(A, t) {
    if (jt = !1, EA && X) {
      re("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && fA(document, "dragover", iu);
      var n = this.options;
      !A && le(X, n.dragClass, !1), le(X, n.ghostClass, !0), eA.active = this, A && this._appendGhost(), qA({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Ue) {
      this._lastX = Ue.clientX, this._lastY = Ue.clientY, ml();
      for (var A = document.elementFromPoint(Ue.clientX, Ue.clientY), t = A; A && A.shadowRoot && (A = A.shadowRoot.elementFromPoint(Ue.clientX, Ue.clientY), A !== t); )
        t = A;
      if (X.parentNode[ae]._isOutsideThisEl(A), t)
        do {
          if (t[ae]) {
            var n = void 0;
            if (n = t[ae]._onDragOver({
              clientX: Ue.clientX,
              clientY: Ue.clientY,
              target: A,
              rootEl: t
            }), n && !this.options.dragoverBubble)
              break;
          }
          A = t;
        } while (t = dl(t));
      yl();
    }
  },
  _onTouchMove: function(A) {
    if (Ft) {
      var t = this.options, n = t.fallbackTolerance, i = t.fallbackOffset, s = A.touches ? A.touches[0] : A, l = aA && en(aA, !0), u = aA && l && l.a, f = aA && l && l.d, g = dr && WA && zs(WA), w = (s.clientX - Ft.clientX + i.x) / (u || 1) + (g ? g[0] - Vi[0] : 0) / (u || 1), v = (s.clientY - Ft.clientY + i.y) / (f || 1) + (g ? g[1] - Vi[1] : 0) / (f || 1);
      if (!eA.active && !jt) {
        if (n && Math.max(Math.abs(s.clientX - this._lastX), Math.abs(s.clientY - this._lastY)) < n)
          return;
        this._onDragStart(A, !0);
      }
      if (aA) {
        l ? (l.e += w - (Gi || 0), l.f += v - (Xi || 0)) : l = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: w,
          f: v
        };
        var U = "matrix(".concat(l.a, ",").concat(l.b, ",").concat(l.c, ",").concat(l.d, ",").concat(l.e, ",").concat(l.f, ")");
        nA(aA, "webkitTransform", U), nA(aA, "mozTransform", U), nA(aA, "msTransform", U), nA(aA, "transform", U), Gi = w, Xi = v, Ue = s;
      }
      A.cancelable && A.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!aA) {
      var A = this.options.fallbackOnBody ? document.body : EA, t = KA(X, !0, dr, !0, A), n = this.options;
      if (dr) {
        for (WA = A; nA(WA, "position") === "static" && nA(WA, "transform") === "none" && WA !== document; )
          WA = WA.parentNode;
        WA !== document.body && WA !== document.documentElement ? (WA === document && (WA = Me()), t.top += WA.scrollTop, t.left += WA.scrollLeft) : WA = Me(), Vi = zs(WA);
      }
      aA = X.cloneNode(!0), le(aA, n.ghostClass, !1), le(aA, n.fallbackClass, !0), le(aA, n.dragClass, !0), nA(aA, "transition", ""), nA(aA, "transform", ""), nA(aA, "box-sizing", "border-box"), nA(aA, "margin", 0), nA(aA, "top", t.top), nA(aA, "left", t.left), nA(aA, "width", t.width), nA(aA, "height", t.height), nA(aA, "opacity", "0.8"), nA(aA, "position", dr ? "absolute" : "fixed"), nA(aA, "zIndex", "100000"), nA(aA, "pointerEvents", "none"), eA.ghost = aA, A.appendChild(aA), nA(aA, "transform-origin", qs / parseInt(aA.style.width) * 100 + "% " + Zs / parseInt(aA.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(A, t) {
    var n = this, i = A.dataTransfer, s = n.options;
    if (re("dragStart", this, {
      evt: A
    }), eA.eventCanceled) {
      this._onDrop();
      return;
    }
    re("setupClone", this), eA.eventCanceled || (xA = pl(X), xA.removeAttribute("id"), xA.draggable = !1, xA.style["will-change"] = "", this._hideClone(), le(xA, this.options.chosenClass, !1), eA.clone = xA), n.cloneId = Pr(function() {
      re("clone", n), !eA.eventCanceled && (n.options.removeCloneOnHide || EA.insertBefore(xA, X), n._hideClone(), qA({
        sortable: n,
        name: "clone"
      }));
    }), !t && le(X, s.dragClass, !0), t ? (Yr = !0, n._loopId = setInterval(n._emulateDragOver, 50)) : (uA(document, "mouseup", n._onDrop), uA(document, "touchend", n._onDrop), uA(document, "touchcancel", n._onDrop), i && (i.effectAllowed = "move", s.setData && s.setData.call(n, i, X)), fA(document, "drop", n), nA(X, "transform", "translateZ(0)")), jt = !0, n._dragStartId = Pr(n._dragStarted.bind(n, t, A)), fA(document, "selectstart", n), Qn = !0, window.getSelection().removeAllRanges(), Dn && nA(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(A) {
    var t = this.el, n = A.target, i, s, l, u = this.options, f = u.group, g = eA.active, w = lr === f, v = u.sort, U = $A || g, L, C = this, y = !1;
    if (va) return;
    function I(NA, OA) {
      re(NA, C, Re({
        evt: A,
        isOwner: w,
        axis: L ? "vertical" : "horizontal",
        revert: l,
        dragRect: i,
        targetRect: s,
        canSort: v,
        fromSortable: U,
        target: n,
        completed: O,
        onMove: function(se, fe) {
          return ur(EA, t, X, i, se, KA(se), A, fe);
        },
        changed: $
      }, OA));
    }
    function b() {
      I("dragOverAnimationCapture"), C.captureAnimationState(), C !== U && U.captureAnimationState();
    }
    function O(NA) {
      return I("dragOverCompleted", {
        insertion: NA
      }), NA && (w ? g._hideClone() : g._showClone(C), C !== U && (le(X, $A ? $A.options.ghostClass : g.options.ghostClass, !1), le(X, u.ghostClass, !0)), $A !== C && C !== eA.active ? $A = C : C === eA.active && $A && ($A = null), U === C && (C._ignoreWhileAnimating = n), C.animateAll(function() {
        I("dragOverAnimationComplete"), C._ignoreWhileAnimating = null;
      }), C !== U && (U.animateAll(), U._ignoreWhileAnimating = null)), (n === X && !X.animated || n === t && !n.animated) && ($t = null), !u.dragoverBubble && !A.rootEl && n !== document && (X.parentNode[ae]._isOutsideThisEl(A.target), !NA && Ut(A)), !u.dragoverBubble && A.stopPropagation && A.stopPropagation(), y = !0;
    }
    function $() {
      de = Be(X), st = Be(X, u.draggable), qA({
        sortable: C,
        name: "change",
        toEl: t,
        newIndex: de,
        newDraggableIndex: st,
        originalEvent: A
      });
    }
    if (A.preventDefault !== void 0 && A.cancelable && A.preventDefault(), n = Ee(n, u.draggable, t, !0), I("dragOver"), eA.eventCanceled) return y;
    if (X.contains(A.target) || n.animated && n.animatingX && n.animatingY || C._ignoreWhileAnimating === n)
      return O(!1);
    if (Yr = !1, g && !u.disabled && (w ? v || (l = HA !== EA) : $A === this || (this.lastPutMode = lr.checkPull(this, g, X, A)) && f.checkPut(this, g, X, A))) {
      if (L = this._getDirection(A, n) === "vertical", i = KA(X), I("dragOverValid"), eA.eventCanceled) return y;
      if (l)
        return HA = EA, b(), this._hideClone(), I("revert"), eA.eventCanceled || (Et ? EA.insertBefore(X, Et) : EA.appendChild(X)), O(!0);
      var M = Ya(t, u.draggable);
      if (!M || lu(A, L, this) && !M.animated) {
        if (M === X)
          return O(!1);
        if (M && t === A.target && (n = M), n && (s = KA(n)), ur(EA, t, X, i, n, s, A, !!n) !== !1)
          return b(), M && M.nextSibling ? t.insertBefore(X, M.nextSibling) : t.appendChild(X), HA = t, $(), O(!0);
      } else if (M && ou(A, L, this)) {
        var _ = rn(t, 0, u, !0);
        if (_ === X)
          return O(!1);
        if (n = _, s = KA(n), ur(EA, t, X, i, n, s, A, !1) !== !1)
          return b(), t.insertBefore(X, _), HA = t, $(), O(!0);
      } else if (n.parentNode === t) {
        s = KA(n);
        var R = 0, c, AA = X.parentNode !== t, N = !nu(X.animated && X.toRect || i, n.animated && n.toRect || s, L), gA = L ? "top" : "left", FA = js(n, "top", "top") || js(X, "top", "top"), SA = FA ? FA.scrollTop : void 0;
        $t !== n && (c = s[gA], Mn = !1, cr = !N && u.invertSwap || AA), R = cu(A, n, s, L, N ? 1 : u.swapThreshold, u.invertedSwapThreshold == null ? u.swapThreshold : u.invertedSwapThreshold, cr, $t === n);
        var j;
        if (R !== 0) {
          var BA = Be(X);
          do
            BA -= R, j = HA.children[BA];
          while (j && (nA(j, "display") === "none" || j === aA));
        }
        if (R === 0 || j === n)
          return O(!1);
        $t = n, On = R;
        var VA = n.nextElementSibling, UA = !1;
        UA = R === 1;
        var vA = ur(EA, t, X, i, n, s, A, UA);
        if (vA !== !1)
          return (vA === 1 || vA === -1) && (UA = vA === 1), va = !0, setTimeout(su, 30), b(), UA && !VA ? t.appendChild(X) : n.parentNode.insertBefore(X, UA ? VA : n), FA && hl(FA, 0, SA - FA.scrollTop), HA = X.parentNode, c !== void 0 && !cr && (Rr = Math.abs(c - KA(n)[gA])), $(), O(!0);
      }
      if (t.contains(X))
        return O(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    uA(document, "mousemove", this._onTouchMove), uA(document, "touchmove", this._onTouchMove), uA(document, "pointermove", this._onTouchMove), uA(document, "dragover", Ut), uA(document, "mousemove", Ut), uA(document, "touchmove", Ut);
  },
  _offUpEvents: function() {
    var A = this.el.ownerDocument;
    uA(A, "mouseup", this._onDrop), uA(A, "touchend", this._onDrop), uA(A, "pointerup", this._onDrop), uA(A, "pointercancel", this._onDrop), uA(A, "touchcancel", this._onDrop), uA(document, "selectstart", this);
  },
  _onDrop: function(A) {
    var t = this.el, n = this.options;
    if (de = Be(X), st = Be(X, n.draggable), re("drop", this, {
      evt: A
    }), HA = X && X.parentNode, de = Be(X), st = Be(X, n.draggable), eA.eventCanceled) {
      this._nulling();
      return;
    }
    jt = !1, cr = !1, Mn = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), ma(this.cloneId), ma(this._dragStartId), this.nativeDraggable && (uA(document, "drop", this), uA(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Dn && nA(document.body, "user-select", ""), nA(X, "transform", ""), A && (Qn && (A.cancelable && A.preventDefault(), !n.dropBubble && A.stopPropagation()), aA && aA.parentNode && aA.parentNode.removeChild(aA), (EA === HA || $A && $A.lastPutMode !== "clone") && xA && xA.parentNode && xA.parentNode.removeChild(xA), X && (this.nativeDraggable && uA(X, "dragend", this), Yi(X), X.style["will-change"] = "", Qn && !jt && le(X, $A ? $A.options.ghostClass : this.options.ghostClass, !1), le(X, this.options.chosenClass, !1), qA({
      sortable: this,
      name: "unchoose",
      toEl: HA,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: A
    }), EA !== HA ? (de >= 0 && (qA({
      rootEl: HA,
      name: "add",
      toEl: HA,
      fromEl: EA,
      originalEvent: A
    }), qA({
      sortable: this,
      name: "remove",
      toEl: HA,
      originalEvent: A
    }), qA({
      rootEl: HA,
      name: "sort",
      toEl: HA,
      fromEl: EA,
      originalEvent: A
    }), qA({
      sortable: this,
      name: "sort",
      toEl: HA,
      originalEvent: A
    })), $A && $A.save()) : de !== Zt && de >= 0 && (qA({
      sortable: this,
      name: "update",
      toEl: HA,
      originalEvent: A
    }), qA({
      sortable: this,
      name: "sort",
      toEl: HA,
      originalEvent: A
    })), eA.active && ((de == null || de === -1) && (de = Zt, st = kn), qA({
      sortable: this,
      name: "end",
      toEl: HA,
      originalEvent: A
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    re("nulling", this), EA = X = HA = aA = Et = xA = Mr = lt = Ft = Ue = Qn = de = st = Zt = kn = $t = On = $A = lr = eA.dragged = eA.ghost = eA.clone = eA.active = null;
    var A = this.el;
    Jr.forEach(function(t) {
      A.contains(t) && (t.checked = !0);
    }), Jr.length = Gi = Xi = 0;
  },
  handleEvent: function(A) {
    switch (A.type) {
      case "drop":
      case "dragend":
        this._onDrop(A);
        break;
      case "dragenter":
      case "dragover":
        X && (this._onDragOver(A), au(A));
        break;
      case "selectstart":
        A.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function() {
    for (var A = [], t, n = this.el.children, i = 0, s = n.length, l = this.options; i < s; i++)
      t = n[i], Ee(t, l.draggable, this.el, !1) && A.push(t.getAttribute(l.dataIdAttr) || uu(t));
    return A;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(A, t) {
    var n = {}, i = this.el;
    this.toArray().forEach(function(s, l) {
      var u = i.children[l];
      Ee(u, this.options.draggable, i, !1) && (n[s] = u);
    }, this), t && this.captureAnimationState(), A.forEach(function(s) {
      n[s] && (i.removeChild(n[s]), i.appendChild(n[s]));
    }), t && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function() {
    var A = this.options.store;
    A && A.set && A.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function(A, t) {
    return Ee(A, t || this.options.draggable, this.el, !1);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function(A, t) {
    var n = this.options;
    if (t === void 0)
      return n[A];
    var i = Wn.modifyOption(this, A, t);
    typeof i < "u" ? n[A] = i : n[A] = t, A === "group" && vl(n);
  },
  /**
   * Destroy
   */
  destroy: function() {
    re("destroy", this);
    var A = this.el;
    A[ae] = null, uA(A, "mousedown", this._onTapStart), uA(A, "touchstart", this._onTapStart), uA(A, "pointerdown", this._onTapStart), this.nativeDraggable && (uA(A, "dragover", this), uA(A, "dragenter", this)), Array.prototype.forEach.call(A.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), Wr.splice(Wr.indexOf(this.el), 1), this.el = A = null;
  },
  _hideClone: function() {
    if (!lt) {
      if (re("hideClone", this), eA.eventCanceled) return;
      nA(xA, "display", "none"), this.options.removeCloneOnHide && xA.parentNode && xA.parentNode.removeChild(xA), lt = !0;
    }
  },
  _showClone: function(A) {
    if (A.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (lt) {
      if (re("showClone", this), eA.eventCanceled) return;
      X.parentNode == EA && !this.options.group.revertClone ? EA.insertBefore(xA, X) : Et ? EA.insertBefore(xA, Et) : EA.appendChild(xA), this.options.group.revertClone && this.animate(X, xA), nA(xA, "display", ""), lt = !1;
    }
  }
};
function au(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function ur(e, A, t, n, i, s, l, u) {
  var f, g = e[ae], w = g.options.onMove, v;
  return window.CustomEvent && !Ze && !Yn ? f = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (f = document.createEvent("Event"), f.initEvent("move", !0, !0)), f.to = A, f.from = e, f.dragged = t, f.draggedRect = n, f.related = i || A, f.relatedRect = s || KA(A), f.willInsertAfter = u, f.originalEvent = l, e.dispatchEvent(f), w && (v = w.call(g, f, l)), v;
}
function Yi(e) {
  e.draggable = !1;
}
function su() {
  va = !1;
}
function ou(e, A, t) {
  var n = KA(rn(t.el, 0, t.options, !0)), i = gl(t.el, t.options, aA), s = 10;
  return A ? e.clientX < i.left - s || e.clientY < n.top && e.clientX < n.right : e.clientY < i.top - s || e.clientY < n.bottom && e.clientX < n.left;
}
function lu(e, A, t) {
  var n = KA(Ya(t.el, t.options.draggable)), i = gl(t.el, t.options, aA), s = 10;
  return A ? e.clientX > i.right + s || e.clientY > n.bottom && e.clientX > n.left : e.clientY > i.bottom + s || e.clientX > n.right && e.clientY > n.top;
}
function cu(e, A, t, n, i, s, l, u) {
  var f = n ? e.clientY : e.clientX, g = n ? t.height : t.width, w = n ? t.top : t.left, v = n ? t.bottom : t.right, U = !1;
  if (!l) {
    if (u && Rr < g * i) {
      if (!Mn && (On === 1 ? f > w + g * s / 2 : f < v - g * s / 2) && (Mn = !0), Mn)
        U = !0;
      else if (On === 1 ? f < w + Rr : f > v - Rr)
        return -On;
    } else if (f > w + g * (1 - i) / 2 && f < v - g * (1 - i) / 2)
      return du(A);
  }
  return U = U || l, U && (f < w + g * s / 2 || f > v - g * s / 2) ? f > w + g / 2 ? 1 : -1 : 0;
}
function du(e) {
  return Be(X) < Be(e) ? 1 : -1;
}
function uu(e) {
  for (var A = e.tagName + e.className + e.src + e.href + e.textContent, t = A.length, n = 0; t--; )
    n += A.charCodeAt(t);
  return n.toString(36);
}
function fu(e) {
  Jr.length = 0;
  for (var A = e.getElementsByTagName("input"), t = A.length; t--; ) {
    var n = A[t];
    n.checked && Jr.push(n);
  }
}
function Pr(e) {
  return setTimeout(e, 0);
}
function ma(e) {
  return clearTimeout(e);
}
si && fA(document, "touchmove", function(e) {
  (eA.active || jt) && e.cancelable && e.preventDefault();
});
eA.utils = {
  on: fA,
  off: uA,
  css: nA,
  find: ul,
  is: function(A, t) {
    return !!Ee(A, t, A, !1);
  },
  extend: Jd,
  throttle: fl,
  closest: Ee,
  toggleClass: le,
  clone: pl,
  index: Be,
  nextTick: Pr,
  cancelNextTick: ma,
  detectDirection: wl,
  getChild: rn,
  expando: ae
};
eA.get = function(e) {
  return e[ae];
};
eA.mount = function() {
  for (var e = arguments.length, A = new Array(e), t = 0; t < e; t++)
    A[t] = arguments[t];
  A[0].constructor === Array && (A = A[0]), A.forEach(function(n) {
    if (!n.prototype || !n.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(n));
    n.utils && (eA.utils = Re(Re({}, eA.utils), n.utils)), Wn.mount(n);
  });
};
eA.create = function(e, A) {
  return new eA(e, A);
};
eA.version = Yd;
var DA = [], Fn, ya, Ca = !1, Wi, Ji, jr, Un;
function hu() {
  function e() {
    this.defaults = {
      scroll: !0,
      forceAutoScrollFallback: !1,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: !0
    };
    for (var A in this)
      A.charAt(0) === "_" && typeof this[A] == "function" && (this[A] = this[A].bind(this));
  }
  return e.prototype = {
    dragStarted: function(t) {
      var n = t.originalEvent;
      this.sortable.nativeDraggable ? fA(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? fA(document, "pointermove", this._handleFallbackAutoScroll) : n.touches ? fA(document, "touchmove", this._handleFallbackAutoScroll) : fA(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var n = t.originalEvent;
      !this.options.dragOverBubble && !n.rootEl && this._handleAutoScroll(n);
    },
    drop: function() {
      this.sortable.nativeDraggable ? uA(document, "dragover", this._handleAutoScroll) : (uA(document, "pointermove", this._handleFallbackAutoScroll), uA(document, "touchmove", this._handleFallbackAutoScroll), uA(document, "mousemove", this._handleFallbackAutoScroll)), eo(), Nr(), jd();
    },
    nulling: function() {
      jr = ya = Fn = Ca = Un = Wi = Ji = null, DA.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, n) {
      var i = this, s = (t.touches ? t.touches[0] : t).clientX, l = (t.touches ? t.touches[0] : t).clientY, u = document.elementFromPoint(s, l);
      if (jr = t, n || this.options.forceAutoScrollFallback || Yn || Ze || Dn) {
        ji(t, this.options, u, n);
        var f = ct(u, !0);
        Ca && (!Un || s !== Wi || l !== Ji) && (Un && eo(), Un = setInterval(function() {
          var g = ct(document.elementFromPoint(s, l), !0);
          g !== f && (f = g, Nr()), ji(t, i.options, g, n);
        }, 10), Wi = s, Ji = l);
      } else {
        if (!this.options.bubbleScroll || ct(u, !0) === Me()) {
          Nr();
          return;
        }
        ji(t, this.options, ct(u, !1), !1);
      }
    }
  }, ze(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Nr() {
  DA.forEach(function(e) {
    clearInterval(e.pid);
  }), DA = [];
}
function eo() {
  clearInterval(Un);
}
var ji = fl(function(e, A, t, n) {
  if (A.scroll) {
    var i = (e.touches ? e.touches[0] : e).clientX, s = (e.touches ? e.touches[0] : e).clientY, l = A.scrollSensitivity, u = A.scrollSpeed, f = Me(), g = !1, w;
    ya !== t && (ya = t, Nr(), Fn = A.scroll, w = A.scrollFn, Fn === !0 && (Fn = ct(t, !0)));
    var v = 0, U = Fn;
    do {
      var L = U, C = KA(L), y = C.top, I = C.bottom, b = C.left, O = C.right, $ = C.width, M = C.height, _ = void 0, R = void 0, c = L.scrollWidth, AA = L.scrollHeight, N = nA(L), gA = L.scrollLeft, FA = L.scrollTop;
      L === f ? (_ = $ < c && (N.overflowX === "auto" || N.overflowX === "scroll" || N.overflowX === "visible"), R = M < AA && (N.overflowY === "auto" || N.overflowY === "scroll" || N.overflowY === "visible")) : (_ = $ < c && (N.overflowX === "auto" || N.overflowX === "scroll"), R = M < AA && (N.overflowY === "auto" || N.overflowY === "scroll"));
      var SA = _ && (Math.abs(O - i) <= l && gA + $ < c) - (Math.abs(b - i) <= l && !!gA), j = R && (Math.abs(I - s) <= l && FA + M < AA) - (Math.abs(y - s) <= l && !!FA);
      if (!DA[v])
        for (var BA = 0; BA <= v; BA++)
          DA[BA] || (DA[BA] = {});
      (DA[v].vx != SA || DA[v].vy != j || DA[v].el !== L) && (DA[v].el = L, DA[v].vx = SA, DA[v].vy = j, clearInterval(DA[v].pid), (SA != 0 || j != 0) && (g = !0, DA[v].pid = setInterval((function() {
        n && this.layer === 0 && eA.active._onTouchMove(jr);
        var VA = DA[this.layer].vy ? DA[this.layer].vy * u : 0, UA = DA[this.layer].vx ? DA[this.layer].vx * u : 0;
        typeof w == "function" && w.call(eA.dragged.parentNode[ae], UA, VA, e, jr, DA[this.layer].el) !== "continue" || hl(DA[this.layer].el, UA, VA);
      }).bind({
        layer: v
      }), 24))), v++;
    } while (A.bubbleScroll && U !== f && (U = ct(U, !1)));
    Ca = g;
  }
}, 30), Cl = function(A) {
  var t = A.originalEvent, n = A.putSortable, i = A.dragEl, s = A.activeSortable, l = A.dispatchSortableEvent, u = A.hideGhostForTarget, f = A.unhideGhostForTarget;
  if (t) {
    var g = n || s;
    u();
    var w = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, v = document.elementFromPoint(w.clientX, w.clientY);
    f(), g && !g.el.contains(v) && (l("spill"), this.onSpill({
      dragEl: i,
      putSortable: n
    }));
  }
};
function Wa() {
}
Wa.prototype = {
  startIndex: null,
  dragStart: function(A) {
    var t = A.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(A) {
    var t = A.dragEl, n = A.putSortable;
    this.sortable.captureAnimationState(), n && n.captureAnimationState();
    var i = rn(this.sortable.el, this.startIndex, this.options);
    i ? this.sortable.el.insertBefore(t, i) : this.sortable.el.appendChild(t), this.sortable.animateAll(), n && n.animateAll();
  },
  drop: Cl
};
ze(Wa, {
  pluginName: "revertOnSpill"
});
function Ja() {
}
Ja.prototype = {
  onSpill: function(A) {
    var t = A.dragEl, n = A.putSortable, i = n || this.sortable;
    i.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), i.animateAll();
  },
  drop: Cl
};
ze(Ja, {
  pluginName: "removeOnSpill"
});
eA.mount(new hu());
eA.mount(Ja, Wa);
var Qa = function(e, A) {
  return Qa = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
  }, Qa(e, A);
};
function xe(e, A) {
  if (typeof A != "function" && A !== null)
    throw new TypeError("Class extends value " + String(A) + " is not a constructor or null");
  Qa(e, A);
  function t() {
    this.constructor = e;
  }
  e.prototype = A === null ? Object.create(A) : (t.prototype = A.prototype, new t());
}
var Fa = function() {
  return Fa = Object.assign || function(A) {
    for (var t, n = 1, i = arguments.length; n < i; n++) {
      t = arguments[n];
      for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (A[s] = t[s]);
    }
    return A;
  }, Fa.apply(this, arguments);
};
function ZA(e, A, t, n) {
  function i(s) {
    return s instanceof t ? s : new t(function(l) {
      l(s);
    });
  }
  return new (t || (t = Promise))(function(s, l) {
    function u(w) {
      try {
        g(n.next(w));
      } catch (v) {
        l(v);
      }
    }
    function f(w) {
      try {
        g(n.throw(w));
      } catch (v) {
        l(v);
      }
    }
    function g(w) {
      w.done ? s(w.value) : i(w.value).then(u, f);
    }
    g((n = n.apply(e, [])).next());
  });
}
function JA(e, A) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, n, i, s, l;
  return l = { next: u(0), throw: u(1), return: u(2) }, typeof Symbol == "function" && (l[Symbol.iterator] = function() {
    return this;
  }), l;
  function u(g) {
    return function(w) {
      return f([g, w]);
    };
  }
  function f(g) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; t; ) try {
      if (n = 1, i && (s = g[0] & 2 ? i.return : g[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, g[1])).done) return s;
      switch (i = 0, s && (g = [g[0] & 2, s.value]), g[0]) {
        case 0:
        case 1:
          s = g;
          break;
        case 4:
          return t.label++, { value: g[1], done: !1 };
        case 5:
          t.label++, i = g[1], g = [0];
          continue;
        case 7:
          g = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (s = t.trys, !(s = s.length > 0 && s[s.length - 1]) && (g[0] === 6 || g[0] === 2)) {
            t = 0;
            continue;
          }
          if (g[0] === 3 && (!s || g[1] > s[0] && g[1] < s[3])) {
            t.label = g[1];
            break;
          }
          if (g[0] === 6 && t.label < s[1]) {
            t.label = s[1], s = g;
            break;
          }
          if (s && t.label < s[2]) {
            t.label = s[2], t.ops.push(g);
            break;
          }
          s[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      g = A.call(e, t);
    } catch (w) {
      g = [6, w], i = 0;
    } finally {
      n = s = 0;
    }
    if (g[0] & 5) throw g[1];
    return { value: g[0] ? g[1] : void 0, done: !0 };
  }
}
function fr(e, A, t) {
  if (arguments.length === 2) for (var n = 0, i = A.length, s; n < i; n++)
    (s || !(n in A)) && (s || (s = Array.prototype.slice.call(A, 0, n)), s[n] = A[n]);
  return e.concat(s || A);
}
var qe = (
  /** @class */
  (function() {
    function e(A, t, n, i) {
      this.left = A, this.top = t, this.width = n, this.height = i;
    }
    return e.prototype.add = function(A, t, n, i) {
      return new e(this.left + A, this.top + t, this.width + n, this.height + i);
    }, e.fromClientRect = function(A, t) {
      return new e(t.left + A.windowBounds.left, t.top + A.windowBounds.top, t.width, t.height);
    }, e.fromDOMRectList = function(A, t) {
      var n = Array.from(t).find(function(i) {
        return i.width !== 0;
      });
      return n ? new e(n.left + A.windowBounds.left, n.top + A.windowBounds.top, n.width, n.height) : e.EMPTY;
    }, e.EMPTY = new e(0, 0, 0, 0), e;
  })()
), oi = function(e, A) {
  return qe.fromClientRect(e, A.getBoundingClientRect());
}, pu = function(e) {
  var A = e.body, t = e.documentElement;
  if (!A || !t)
    throw new Error("Unable to get document size");
  var n = Math.max(Math.max(A.scrollWidth, t.scrollWidth), Math.max(A.offsetWidth, t.offsetWidth), Math.max(A.clientWidth, t.clientWidth)), i = Math.max(Math.max(A.scrollHeight, t.scrollHeight), Math.max(A.offsetHeight, t.offsetHeight), Math.max(A.clientHeight, t.clientHeight));
  return new qe(0, 0, n, i);
}, li = function(e) {
  for (var A = [], t = 0, n = e.length; t < n; ) {
    var i = e.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var s = e.charCodeAt(t++);
      (s & 64512) === 56320 ? A.push(((i & 1023) << 10) + (s & 1023) + 65536) : (A.push(i), t--);
    } else
      A.push(i);
  }
  return A;
}, TA = function() {
  for (var e = [], A = 0; A < arguments.length; A++)
    e[A] = arguments[A];
  if (String.fromCodePoint)
    return String.fromCodePoint.apply(String, e);
  var t = e.length;
  if (!t)
    return "";
  for (var n = [], i = -1, s = ""; ++i < t; ) {
    var l = e[i];
    l <= 65535 ? n.push(l) : (l -= 65536, n.push((l >> 10) + 55296, l % 1024 + 56320)), (i + 1 === t || n.length > 16384) && (s += String.fromCharCode.apply(String, n), n.length = 0);
  }
  return s;
}, to = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", gu = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var hr = 0; hr < to.length; hr++)
  gu[to.charCodeAt(hr)] = hr;
var no = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", bn = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var pr = 0; pr < no.length; pr++)
  bn[no.charCodeAt(pr)] = pr;
var Bu = function(e) {
  var A = e.length * 0.75, t = e.length, n, i = 0, s, l, u, f;
  e[e.length - 1] === "=" && (A--, e[e.length - 2] === "=" && A--);
  var g = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(A) : new Array(A), w = Array.isArray(g) ? g : new Uint8Array(g);
  for (n = 0; n < t; n += 4)
    s = bn[e.charCodeAt(n)], l = bn[e.charCodeAt(n + 1)], u = bn[e.charCodeAt(n + 2)], f = bn[e.charCodeAt(n + 3)], w[i++] = s << 2 | l >> 4, w[i++] = (l & 15) << 4 | u >> 2, w[i++] = (u & 3) << 6 | f & 63;
  return g;
}, wu = function(e) {
  for (var A = e.length, t = [], n = 0; n < A; n += 2)
    t.push(e[n + 1] << 8 | e[n]);
  return t;
}, vu = function(e) {
  for (var A = e.length, t = [], n = 0; n < A; n += 4)
    t.push(e[n + 3] << 24 | e[n + 2] << 16 | e[n + 1] << 8 | e[n]);
  return t;
}, Ht = 5, ja = 11, zi = 2, mu = ja - Ht, Ql = 65536 >> Ht, yu = 1 << Ht, qi = yu - 1, Cu = 1024 >> Ht, Qu = Ql + Cu, Fu = Qu, Uu = 32, bu = Fu + Uu, Eu = 65536 >> ja, xu = 1 << mu, Iu = xu - 1, ro = function(e, A, t) {
  return e.slice ? e.slice(A, t) : new Uint16Array(Array.prototype.slice.call(e, A, t));
}, Hu = function(e, A, t) {
  return e.slice ? e.slice(A, t) : new Uint32Array(Array.prototype.slice.call(e, A, t));
}, Su = function(e, A) {
  var t = Bu(e), n = Array.isArray(t) ? vu(t) : new Uint32Array(t), i = Array.isArray(t) ? wu(t) : new Uint16Array(t), s = 24, l = ro(i, s / 2, n[4] / 2), u = n[5] === 2 ? ro(i, (s + n[4]) / 2) : Hu(n, Math.ceil((s + n[4]) / 4));
  return new Lu(n[0], n[1], n[2], n[3], l, u);
}, Lu = (
  /** @class */
  (function() {
    function e(A, t, n, i, s, l) {
      this.initialValue = A, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = s, this.data = l;
    }
    return e.prototype.get = function(A) {
      var t;
      if (A >= 0) {
        if (A < 55296 || A > 56319 && A <= 65535)
          return t = this.index[A >> Ht], t = (t << zi) + (A & qi), this.data[t];
        if (A <= 65535)
          return t = this.index[Ql + (A - 55296 >> Ht)], t = (t << zi) + (A & qi), this.data[t];
        if (A < this.highStart)
          return t = bu - Eu + (A >> ja), t = this.index[t], t += A >> Ht & Iu, t = this.index[t], t = (t << zi) + (A & qi), this.data[t];
        if (A <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, e;
  })()
), io = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Tu = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var gr = 0; gr < io.length; gr++)
  Tu[io.charCodeAt(gr)] = gr;
var Du = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", ao = 50, Ku = 1, Fl = 2, Ul = 3, ku = 4, Ou = 5, so = 7, bl = 8, oo = 9, dt = 10, Ua = 11, lo = 12, ba = 13, Mu = 14, En = 15, Ea = 16, Br = 17, vn = 18, Ru = 19, co = 20, xa = 21, mn = 22, Zi = 23, Gt = 24, ce = 25, xn = 26, In = 27, Xt = 28, Pu = 29, xt = 30, Nu = 31, wr = 32, vr = 33, Ia = 34, Ha = 35, Sa = 36, Gn = 37, La = 38, _r = 39, $r = 40, Aa = 41, El = 42, _u = 43, $u = [9001, 65288], xl = "!", dA = "×", mr = "÷", Ta = Su(Du), Ve = [xt, Sa], Da = [Ku, Fl, Ul, Ou], Il = [dt, bl], uo = [In, xn], Gu = Da.concat(Il), fo = [La, _r, $r, Ia, Ha], Xu = [En, ba], Vu = function(e, A) {
  A === void 0 && (A = "strict");
  var t = [], n = [], i = [];
  return e.forEach(function(s, l) {
    var u = Ta.get(s);
    if (u > ao ? (i.push(!0), u -= ao) : i.push(!1), ["normal", "auto", "loose"].indexOf(A) !== -1 && [8208, 8211, 12316, 12448].indexOf(s) !== -1)
      return n.push(l), t.push(Ea);
    if (u === ku || u === Ua) {
      if (l === 0)
        return n.push(l), t.push(xt);
      var f = t[l - 1];
      return Gu.indexOf(f) === -1 ? (n.push(n[l - 1]), t.push(f)) : (n.push(l), t.push(xt));
    }
    if (n.push(l), u === Nu)
      return t.push(A === "strict" ? xa : Gn);
    if (u === El || u === Pu)
      return t.push(xt);
    if (u === _u)
      return s >= 131072 && s <= 196605 || s >= 196608 && s <= 262141 ? t.push(Gn) : t.push(xt);
    t.push(u);
  }), [n, t, i];
}, ea = function(e, A, t, n) {
  var i = n[t];
  if (Array.isArray(e) ? e.indexOf(i) !== -1 : e === i)
    for (var s = t; s <= n.length; ) {
      s++;
      var l = n[s];
      if (l === A)
        return !0;
      if (l !== dt)
        break;
    }
  if (i === dt)
    for (var s = t; s > 0; ) {
      s--;
      var u = n[s];
      if (Array.isArray(e) ? e.indexOf(u) !== -1 : e === u)
        for (var f = t; f <= n.length; ) {
          f++;
          var l = n[f];
          if (l === A)
            return !0;
          if (l !== dt)
            break;
        }
      if (u !== dt)
        break;
    }
  return !1;
}, ho = function(e, A) {
  for (var t = e; t >= 0; ) {
    var n = A[t];
    if (n === dt)
      t--;
    else
      return n;
  }
  return 0;
}, Yu = function(e, A, t, n, i) {
  if (t[n] === 0)
    return dA;
  var s = n - 1;
  if (Array.isArray(i) && i[s] === !0)
    return dA;
  var l = s - 1, u = s + 1, f = A[s], g = l >= 0 ? A[l] : 0, w = A[u];
  if (f === Fl && w === Ul)
    return dA;
  if (Da.indexOf(f) !== -1)
    return xl;
  if (Da.indexOf(w) !== -1 || Il.indexOf(w) !== -1)
    return dA;
  if (ho(s, A) === bl)
    return mr;
  if (Ta.get(e[s]) === Ua || (f === wr || f === vr) && Ta.get(e[u]) === Ua || f === so || w === so || f === oo || [dt, ba, En].indexOf(f) === -1 && w === oo || [Br, vn, Ru, Gt, Xt].indexOf(w) !== -1 || ho(s, A) === mn || ea(Zi, mn, s, A) || ea([Br, vn], xa, s, A) || ea(lo, lo, s, A))
    return dA;
  if (f === dt)
    return mr;
  if (f === Zi || w === Zi)
    return dA;
  if (w === Ea || f === Ea)
    return mr;
  if ([ba, En, xa].indexOf(w) !== -1 || f === Mu || g === Sa && Xu.indexOf(f) !== -1 || f === Xt && w === Sa || w === co || Ve.indexOf(w) !== -1 && f === ce || Ve.indexOf(f) !== -1 && w === ce || f === In && [Gn, wr, vr].indexOf(w) !== -1 || [Gn, wr, vr].indexOf(f) !== -1 && w === xn || Ve.indexOf(f) !== -1 && uo.indexOf(w) !== -1 || uo.indexOf(f) !== -1 && Ve.indexOf(w) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [In, xn].indexOf(f) !== -1 && (w === ce || [mn, En].indexOf(w) !== -1 && A[u + 1] === ce) || // ( OP | HY ) × NU
  [mn, En].indexOf(f) !== -1 && w === ce || // NU ×	(NU | SY | IS)
  f === ce && [ce, Xt, Gt].indexOf(w) !== -1)
    return dA;
  if ([ce, Xt, Gt, Br, vn].indexOf(w) !== -1)
    for (var v = s; v >= 0; ) {
      var U = A[v];
      if (U === ce)
        return dA;
      if ([Xt, Gt].indexOf(U) !== -1)
        v--;
      else
        break;
    }
  if ([In, xn].indexOf(w) !== -1)
    for (var v = [Br, vn].indexOf(f) !== -1 ? l : s; v >= 0; ) {
      var U = A[v];
      if (U === ce)
        return dA;
      if ([Xt, Gt].indexOf(U) !== -1)
        v--;
      else
        break;
    }
  if (La === f && [La, _r, Ia, Ha].indexOf(w) !== -1 || [_r, Ia].indexOf(f) !== -1 && [_r, $r].indexOf(w) !== -1 || [$r, Ha].indexOf(f) !== -1 && w === $r || fo.indexOf(f) !== -1 && [co, xn].indexOf(w) !== -1 || fo.indexOf(w) !== -1 && f === In || Ve.indexOf(f) !== -1 && Ve.indexOf(w) !== -1 || f === Gt && Ve.indexOf(w) !== -1 || Ve.concat(ce).indexOf(f) !== -1 && w === mn && $u.indexOf(e[u]) === -1 || Ve.concat(ce).indexOf(w) !== -1 && f === vn)
    return dA;
  if (f === Aa && w === Aa) {
    for (var L = t[s], C = 1; L > 0 && (L--, A[L] === Aa); )
      C++;
    if (C % 2 !== 0)
      return dA;
  }
  return f === wr && w === vr ? dA : mr;
}, Wu = function(e, A) {
  A || (A = { lineBreak: "normal", wordBreak: "normal" });
  var t = Vu(e, A.lineBreak), n = t[0], i = t[1], s = t[2];
  (A.wordBreak === "break-all" || A.wordBreak === "break-word") && (i = i.map(function(u) {
    return [ce, xt, El].indexOf(u) !== -1 ? Gn : u;
  }));
  var l = A.wordBreak === "keep-all" ? s.map(function(u, f) {
    return u && e[f] >= 19968 && e[f] <= 40959;
  }) : void 0;
  return [n, i, l];
}, Ju = (
  /** @class */
  (function() {
    function e(A, t, n, i) {
      this.codePoints = A, this.required = t === xl, this.start = n, this.end = i;
    }
    return e.prototype.slice = function() {
      return TA.apply(void 0, this.codePoints.slice(this.start, this.end));
    }, e;
  })()
), ju = function(e, A) {
  var t = li(e), n = Wu(t, A), i = n[0], s = n[1], l = n[2], u = t.length, f = 0, g = 0;
  return {
    next: function() {
      if (g >= u)
        return { done: !0, value: null };
      for (var w = dA; g < u && (w = Yu(t, s, i, ++g, l)) === dA; )
        ;
      if (w !== dA || g === u) {
        var v = new Ju(t, w, f, g);
        return f = g, { value: v, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, zu = 1, qu = 2, Jn = 4, po = 8, zr = 10, go = 47, Rn = 92, Zu = 9, Af = 32, yr = 34, yn = 61, ef = 35, tf = 36, nf = 37, Cr = 39, Qr = 40, Cn = 41, rf = 95, ie = 45, af = 33, sf = 60, of = 62, lf = 64, cf = 91, df = 93, uf = 61, ff = 123, Fr = 63, hf = 125, Bo = 124, pf = 126, gf = 128, wo = 65533, ta = 42, It = 43, Bf = 44, wf = 58, vf = 59, Xn = 46, mf = 0, yf = 8, Cf = 11, Qf = 14, Ff = 31, Uf = 127, Oe = -1, Hl = 48, Sl = 97, Ll = 101, bf = 102, Ef = 117, xf = 122, Tl = 65, Dl = 69, Kl = 70, If = 85, Hf = 90, jA = function(e) {
  return e >= Hl && e <= 57;
}, Sf = function(e) {
  return e >= 55296 && e <= 57343;
}, Vt = function(e) {
  return jA(e) || e >= Tl && e <= Kl || e >= Sl && e <= bf;
}, Lf = function(e) {
  return e >= Sl && e <= xf;
}, Tf = function(e) {
  return e >= Tl && e <= Hf;
}, Df = function(e) {
  return Lf(e) || Tf(e);
}, Kf = function(e) {
  return e >= gf;
}, Ur = function(e) {
  return e === zr || e === Zu || e === Af;
}, qr = function(e) {
  return Df(e) || Kf(e) || e === rf;
}, vo = function(e) {
  return qr(e) || jA(e) || e === ie;
}, kf = function(e) {
  return e >= mf && e <= yf || e === Cf || e >= Qf && e <= Ff || e === Uf;
}, ot = function(e, A) {
  return e !== Rn ? !1 : A !== zr;
}, br = function(e, A, t) {
  return e === ie ? qr(A) || ot(A, t) : qr(e) ? !0 : !!(e === Rn && ot(e, A));
}, na = function(e, A, t) {
  return e === It || e === ie ? jA(A) ? !0 : A === Xn && jA(t) : jA(e === Xn ? A : e);
}, Of = function(e) {
  var A = 0, t = 1;
  (e[A] === It || e[A] === ie) && (e[A] === ie && (t = -1), A++);
  for (var n = []; jA(e[A]); )
    n.push(e[A++]);
  var i = n.length ? parseInt(TA.apply(void 0, n), 10) : 0;
  e[A] === Xn && A++;
  for (var s = []; jA(e[A]); )
    s.push(e[A++]);
  var l = s.length, u = l ? parseInt(TA.apply(void 0, s), 10) : 0;
  (e[A] === Dl || e[A] === Ll) && A++;
  var f = 1;
  (e[A] === It || e[A] === ie) && (e[A] === ie && (f = -1), A++);
  for (var g = []; jA(e[A]); )
    g.push(e[A++]);
  var w = g.length ? parseInt(TA.apply(void 0, g), 10) : 0;
  return t * (i + u * Math.pow(10, -l)) * Math.pow(10, f * w);
}, Mf = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
}, Rf = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
}, Pf = {
  type: 4
  /* COMMA_TOKEN */
}, Nf = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
}, _f = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
}, $f = {
  type: 21
  /* COLUMN_TOKEN */
}, Gf = {
  type: 9
  /* DASH_MATCH_TOKEN */
}, Xf = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
}, Vf = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
}, Yf = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
}, Wf = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
}, Er = {
  type: 23
  /* BAD_URL_TOKEN */
}, Jf = {
  type: 1
  /* BAD_STRING_TOKEN */
}, jf = {
  type: 25
  /* CDO_TOKEN */
}, zf = {
  type: 24
  /* CDC_TOKEN */
}, qf = {
  type: 26
  /* COLON_TOKEN */
}, Zf = {
  type: 27
  /* SEMICOLON_TOKEN */
}, Ah = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
}, eh = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, th = {
  type: 31
  /* WHITESPACE_TOKEN */
}, Ka = {
  type: 32
  /* EOF_TOKEN */
}, kl = (
  /** @class */
  (function() {
    function e() {
      this._value = [];
    }
    return e.prototype.write = function(A) {
      this._value = this._value.concat(li(A));
    }, e.prototype.read = function() {
      for (var A = [], t = this.consumeToken(); t !== Ka; )
        A.push(t), t = this.consumeToken();
      return A;
    }, e.prototype.consumeToken = function() {
      var A = this.consumeCodePoint();
      switch (A) {
        case yr:
          return this.consumeStringToken(yr);
        case ef:
          var t = this.peekCodePoint(0), n = this.peekCodePoint(1), i = this.peekCodePoint(2);
          if (vo(t) || ot(n, i)) {
            var s = br(t, n, i) ? qu : zu, l = this.consumeName();
            return { type: 5, value: l, flags: s };
          }
          break;
        case tf:
          if (this.peekCodePoint(0) === yn)
            return this.consumeCodePoint(), Nf;
          break;
        case Cr:
          return this.consumeStringToken(Cr);
        case Qr:
          return Mf;
        case Cn:
          return Rf;
        case ta:
          if (this.peekCodePoint(0) === yn)
            return this.consumeCodePoint(), Wf;
          break;
        case It:
          if (na(A, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(A), this.consumeNumericToken();
          break;
        case Bf:
          return Pf;
        case ie:
          var u = A, f = this.peekCodePoint(0), g = this.peekCodePoint(1);
          if (na(u, f, g))
            return this.reconsumeCodePoint(A), this.consumeNumericToken();
          if (br(u, f, g))
            return this.reconsumeCodePoint(A), this.consumeIdentLikeToken();
          if (f === ie && g === of)
            return this.consumeCodePoint(), this.consumeCodePoint(), zf;
          break;
        case Xn:
          if (na(A, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(A), this.consumeNumericToken();
          break;
        case go:
          if (this.peekCodePoint(0) === ta)
            for (this.consumeCodePoint(); ; ) {
              var w = this.consumeCodePoint();
              if (w === ta && (w = this.consumeCodePoint(), w === go))
                return this.consumeToken();
              if (w === Oe)
                return this.consumeToken();
            }
          break;
        case wf:
          return qf;
        case vf:
          return Zf;
        case sf:
          if (this.peekCodePoint(0) === af && this.peekCodePoint(1) === ie && this.peekCodePoint(2) === ie)
            return this.consumeCodePoint(), this.consumeCodePoint(), jf;
          break;
        case lf:
          var v = this.peekCodePoint(0), U = this.peekCodePoint(1), L = this.peekCodePoint(2);
          if (br(v, U, L)) {
            var l = this.consumeName();
            return { type: 7, value: l };
          }
          break;
        case cf:
          return Ah;
        case Rn:
          if (ot(A, this.peekCodePoint(0)))
            return this.reconsumeCodePoint(A), this.consumeIdentLikeToken();
          break;
        case df:
          return eh;
        case uf:
          if (this.peekCodePoint(0) === yn)
            return this.consumeCodePoint(), _f;
          break;
        case ff:
          return Vf;
        case hf:
          return Yf;
        case Ef:
        case If:
          var C = this.peekCodePoint(0), y = this.peekCodePoint(1);
          return C === It && (Vt(y) || y === Fr) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(A), this.consumeIdentLikeToken();
        case Bo:
          if (this.peekCodePoint(0) === yn)
            return this.consumeCodePoint(), Gf;
          if (this.peekCodePoint(0) === Bo)
            return this.consumeCodePoint(), $f;
          break;
        case pf:
          if (this.peekCodePoint(0) === yn)
            return this.consumeCodePoint(), Xf;
          break;
        case Oe:
          return Ka;
      }
      return Ur(A) ? (this.consumeWhiteSpace(), th) : jA(A) ? (this.reconsumeCodePoint(A), this.consumeNumericToken()) : qr(A) ? (this.reconsumeCodePoint(A), this.consumeIdentLikeToken()) : { type: 6, value: TA(A) };
    }, e.prototype.consumeCodePoint = function() {
      var A = this._value.shift();
      return typeof A > "u" ? -1 : A;
    }, e.prototype.reconsumeCodePoint = function(A) {
      this._value.unshift(A);
    }, e.prototype.peekCodePoint = function(A) {
      return A >= this._value.length ? -1 : this._value[A];
    }, e.prototype.consumeUnicodeRangeToken = function() {
      for (var A = [], t = this.consumeCodePoint(); Vt(t) && A.length < 6; )
        A.push(t), t = this.consumeCodePoint();
      for (var n = !1; t === Fr && A.length < 6; )
        A.push(t), t = this.consumeCodePoint(), n = !0;
      if (n) {
        var i = parseInt(TA.apply(void 0, A.map(function(f) {
          return f === Fr ? Hl : f;
        })), 16), s = parseInt(TA.apply(void 0, A.map(function(f) {
          return f === Fr ? Kl : f;
        })), 16);
        return { type: 30, start: i, end: s };
      }
      var l = parseInt(TA.apply(void 0, A), 16);
      if (this.peekCodePoint(0) === ie && Vt(this.peekCodePoint(1))) {
        this.consumeCodePoint(), t = this.consumeCodePoint();
        for (var u = []; Vt(t) && u.length < 6; )
          u.push(t), t = this.consumeCodePoint();
        var s = parseInt(TA.apply(void 0, u), 16);
        return { type: 30, start: l, end: s };
      } else
        return { type: 30, start: l, end: l };
    }, e.prototype.consumeIdentLikeToken = function() {
      var A = this.consumeName();
      return A.toLowerCase() === "url" && this.peekCodePoint(0) === Qr ? (this.consumeCodePoint(), this.consumeUrlToken()) : this.peekCodePoint(0) === Qr ? (this.consumeCodePoint(), { type: 19, value: A }) : { type: 20, value: A };
    }, e.prototype.consumeUrlToken = function() {
      var A = [];
      if (this.consumeWhiteSpace(), this.peekCodePoint(0) === Oe)
        return { type: 22, value: "" };
      var t = this.peekCodePoint(0);
      if (t === Cr || t === yr) {
        var n = this.consumeStringToken(this.consumeCodePoint());
        return n.type === 0 && (this.consumeWhiteSpace(), this.peekCodePoint(0) === Oe || this.peekCodePoint(0) === Cn) ? (this.consumeCodePoint(), { type: 22, value: n.value }) : (this.consumeBadUrlRemnants(), Er);
      }
      for (; ; ) {
        var i = this.consumeCodePoint();
        if (i === Oe || i === Cn)
          return { type: 22, value: TA.apply(void 0, A) };
        if (Ur(i))
          return this.consumeWhiteSpace(), this.peekCodePoint(0) === Oe || this.peekCodePoint(0) === Cn ? (this.consumeCodePoint(), { type: 22, value: TA.apply(void 0, A) }) : (this.consumeBadUrlRemnants(), Er);
        if (i === yr || i === Cr || i === Qr || kf(i))
          return this.consumeBadUrlRemnants(), Er;
        if (i === Rn)
          if (ot(i, this.peekCodePoint(0)))
            A.push(this.consumeEscapedCodePoint());
          else
            return this.consumeBadUrlRemnants(), Er;
        else
          A.push(i);
      }
    }, e.prototype.consumeWhiteSpace = function() {
      for (; Ur(this.peekCodePoint(0)); )
        this.consumeCodePoint();
    }, e.prototype.consumeBadUrlRemnants = function() {
      for (; ; ) {
        var A = this.consumeCodePoint();
        if (A === Cn || A === Oe)
          return;
        ot(A, this.peekCodePoint(0)) && this.consumeEscapedCodePoint();
      }
    }, e.prototype.consumeStringSlice = function(A) {
      for (var t = 5e4, n = ""; A > 0; ) {
        var i = Math.min(t, A);
        n += TA.apply(void 0, this._value.splice(0, i)), A -= i;
      }
      return this._value.shift(), n;
    }, e.prototype.consumeStringToken = function(A) {
      var t = "", n = 0;
      do {
        var i = this._value[n];
        if (i === Oe || i === void 0 || i === A)
          return t += this.consumeStringSlice(n), { type: 0, value: t };
        if (i === zr)
          return this._value.splice(0, n), Jf;
        if (i === Rn) {
          var s = this._value[n + 1];
          s !== Oe && s !== void 0 && (s === zr ? (t += this.consumeStringSlice(n), n = -1, this._value.shift()) : ot(i, s) && (t += this.consumeStringSlice(n), t += TA(this.consumeEscapedCodePoint()), n = -1));
        }
        n++;
      } while (!0);
    }, e.prototype.consumeNumber = function() {
      var A = [], t = Jn, n = this.peekCodePoint(0);
      for ((n === It || n === ie) && A.push(this.consumeCodePoint()); jA(this.peekCodePoint(0)); )
        A.push(this.consumeCodePoint());
      n = this.peekCodePoint(0);
      var i = this.peekCodePoint(1);
      if (n === Xn && jA(i))
        for (A.push(this.consumeCodePoint(), this.consumeCodePoint()), t = po; jA(this.peekCodePoint(0)); )
          A.push(this.consumeCodePoint());
      n = this.peekCodePoint(0), i = this.peekCodePoint(1);
      var s = this.peekCodePoint(2);
      if ((n === Dl || n === Ll) && ((i === It || i === ie) && jA(s) || jA(i)))
        for (A.push(this.consumeCodePoint(), this.consumeCodePoint()), t = po; jA(this.peekCodePoint(0)); )
          A.push(this.consumeCodePoint());
      return [Of(A), t];
    }, e.prototype.consumeNumericToken = function() {
      var A = this.consumeNumber(), t = A[0], n = A[1], i = this.peekCodePoint(0), s = this.peekCodePoint(1), l = this.peekCodePoint(2);
      if (br(i, s, l)) {
        var u = this.consumeName();
        return { type: 15, number: t, flags: n, unit: u };
      }
      return i === nf ? (this.consumeCodePoint(), { type: 16, number: t, flags: n }) : { type: 17, number: t, flags: n };
    }, e.prototype.consumeEscapedCodePoint = function() {
      var A = this.consumeCodePoint();
      if (Vt(A)) {
        for (var t = TA(A); Vt(this.peekCodePoint(0)) && t.length < 6; )
          t += TA(this.consumeCodePoint());
        Ur(this.peekCodePoint(0)) && this.consumeCodePoint();
        var n = parseInt(t, 16);
        return n === 0 || Sf(n) || n > 1114111 ? wo : n;
      }
      return A === Oe ? wo : A;
    }, e.prototype.consumeName = function() {
      for (var A = ""; ; ) {
        var t = this.consumeCodePoint();
        if (vo(t))
          A += TA(t);
        else if (ot(t, this.peekCodePoint(0)))
          A += TA(this.consumeEscapedCodePoint());
        else
          return this.reconsumeCodePoint(t), A;
      }
    }, e;
  })()
), Ol = (
  /** @class */
  (function() {
    function e(A) {
      this._tokens = A;
    }
    return e.create = function(A) {
      var t = new kl();
      return t.write(A), new e(t.read());
    }, e.parseValue = function(A) {
      return e.create(A).parseComponentValue();
    }, e.parseValues = function(A) {
      return e.create(A).parseComponentValues();
    }, e.prototype.parseComponentValue = function() {
      for (var A = this.consumeToken(); A.type === 31; )
        A = this.consumeToken();
      if (A.type === 32)
        throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
      this.reconsumeToken(A);
      var t = this.consumeComponentValue();
      do
        A = this.consumeToken();
      while (A.type === 31);
      if (A.type === 32)
        return t;
      throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");
    }, e.prototype.parseComponentValues = function() {
      for (var A = []; ; ) {
        var t = this.consumeComponentValue();
        if (t.type === 32)
          return A;
        A.push(t), A.push();
      }
    }, e.prototype.consumeComponentValue = function() {
      var A = this.consumeToken();
      switch (A.type) {
        case 11:
        case 28:
        case 2:
          return this.consumeSimpleBlock(A.type);
        case 19:
          return this.consumeFunction(A);
      }
      return A;
    }, e.prototype.consumeSimpleBlock = function(A) {
      for (var t = { type: A, values: [] }, n = this.consumeToken(); ; ) {
        if (n.type === 32 || rh(n, A))
          return t;
        this.reconsumeToken(n), t.values.push(this.consumeComponentValue()), n = this.consumeToken();
      }
    }, e.prototype.consumeFunction = function(A) {
      for (var t = {
        name: A.value,
        values: [],
        type: 18
        /* FUNCTION */
      }; ; ) {
        var n = this.consumeToken();
        if (n.type === 32 || n.type === 3)
          return t;
        this.reconsumeToken(n), t.values.push(this.consumeComponentValue());
      }
    }, e.prototype.consumeToken = function() {
      var A = this._tokens.shift();
      return typeof A > "u" ? Ka : A;
    }, e.prototype.reconsumeToken = function(A) {
      this._tokens.unshift(A);
    }, e;
  })()
), jn = function(e) {
  return e.type === 15;
}, sn = function(e) {
  return e.type === 17;
}, yA = function(e) {
  return e.type === 20;
}, nh = function(e) {
  return e.type === 0;
}, ka = function(e, A) {
  return yA(e) && e.value === A;
}, Ml = function(e) {
  return e.type !== 31;
}, an = function(e) {
  return e.type !== 31 && e.type !== 4;
}, Pe = function(e) {
  var A = [], t = [];
  return e.forEach(function(n) {
    if (n.type === 4) {
      if (t.length === 0)
        throw new Error("Error parsing function args, zero tokens for arg");
      A.push(t), t = [];
      return;
    }
    n.type !== 31 && t.push(n);
  }), t.length && A.push(t), A;
}, rh = function(e, A) {
  return A === 11 && e.type === 12 || A === 28 && e.type === 29 ? !0 : A === 2 && e.type === 3;
}, Bt = function(e) {
  return e.type === 17 || e.type === 15;
}, kA = function(e) {
  return e.type === 16 || Bt(e);
}, Rl = function(e) {
  return e.length > 1 ? [e[0], e[1]] : [e[0]];
}, XA = {
  type: 17,
  number: 0,
  flags: Jn
}, za = {
  type: 16,
  number: 50,
  flags: Jn
}, ut = {
  type: 16,
  number: 100,
  flags: Jn
}, Hn = function(e, A, t) {
  var n = e[0], i = e[1];
  return [QA(n, A), QA(typeof i < "u" ? i : n, t)];
}, QA = function(e, A) {
  if (e.type === 16)
    return e.number / 100 * A;
  if (jn(e))
    switch (e.unit) {
      case "rem":
      case "em":
        return 16 * e.number;
      default:
        return e.number;
    }
  return e.number;
}, Pl = "deg", Nl = "grad", _l = "rad", $l = "turn", ci = {
  name: "angle",
  parse: function(e, A) {
    if (A.type === 15)
      switch (A.unit) {
        case Pl:
          return Math.PI * A.number / 180;
        case Nl:
          return Math.PI / 200 * A.number;
        case _l:
          return A.number;
        case $l:
          return Math.PI * 2 * A.number;
      }
    throw new Error("Unsupported angle type");
  }
}, Gl = function(e) {
  return e.type === 15 && (e.unit === Pl || e.unit === Nl || e.unit === _l || e.unit === $l);
}, Xl = function(e) {
  var A = e.filter(yA).map(function(t) {
    return t.value;
  }).join(" ");
  switch (A) {
    case "to bottom right":
    case "to right bottom":
    case "left top":
    case "top left":
      return [XA, XA];
    case "to top":
    case "bottom":
      return me(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [XA, ut];
    case "to right":
    case "left":
      return me(90);
    case "to top left":
    case "to left top":
    case "right bottom":
    case "bottom right":
      return [ut, ut];
    case "to bottom":
    case "top":
      return me(180);
    case "to top right":
    case "to right top":
    case "left bottom":
    case "bottom left":
      return [ut, XA];
    case "to left":
    case "right":
      return me(270);
  }
  return 0;
}, me = function(e) {
  return Math.PI * e / 180;
}, ht = {
  name: "color",
  parse: function(e, A) {
    if (A.type === 18) {
      var t = ih[A.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported color function "' + A.name + '"');
      return t(e, A.values);
    }
    if (A.type === 5) {
      if (A.value.length === 3) {
        var n = A.value.substring(0, 1), i = A.value.substring(1, 2), s = A.value.substring(2, 3);
        return ft(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(s + s, 16), 1);
      }
      if (A.value.length === 4) {
        var n = A.value.substring(0, 1), i = A.value.substring(1, 2), s = A.value.substring(2, 3), l = A.value.substring(3, 4);
        return ft(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(s + s, 16), parseInt(l + l, 16) / 255);
      }
      if (A.value.length === 6) {
        var n = A.value.substring(0, 2), i = A.value.substring(2, 4), s = A.value.substring(4, 6);
        return ft(parseInt(n, 16), parseInt(i, 16), parseInt(s, 16), 1);
      }
      if (A.value.length === 8) {
        var n = A.value.substring(0, 2), i = A.value.substring(2, 4), s = A.value.substring(4, 6), l = A.value.substring(6, 8);
        return ft(parseInt(n, 16), parseInt(i, 16), parseInt(s, 16), parseInt(l, 16) / 255);
      }
    }
    if (A.type === 20) {
      var u = je[A.value.toUpperCase()];
      if (typeof u < "u")
        return u;
    }
    return je.TRANSPARENT;
  }
}, pt = function(e) {
  return (255 & e) === 0;
}, PA = function(e) {
  var A = 255 & e, t = 255 & e >> 8, n = 255 & e >> 16, i = 255 & e >> 24;
  return A < 255 ? "rgba(" + i + "," + n + "," + t + "," + A / 255 + ")" : "rgb(" + i + "," + n + "," + t + ")";
}, ft = function(e, A, t, n) {
  return (e << 24 | A << 16 | t << 8 | Math.round(n * 255) << 0) >>> 0;
}, mo = function(e, A) {
  if (e.type === 17)
    return e.number;
  if (e.type === 16) {
    var t = A === 3 ? 1 : 255;
    return A === 3 ? e.number / 100 * t : Math.round(e.number / 100 * t);
  }
  return 0;
}, yo = function(e, A) {
  var t = A.filter(an);
  if (t.length === 3) {
    var n = t.map(mo), i = n[0], s = n[1], l = n[2];
    return ft(i, s, l, 1);
  }
  if (t.length === 4) {
    var u = t.map(mo), i = u[0], s = u[1], l = u[2], f = u[3];
    return ft(i, s, l, f);
  }
  return 0;
};
function ra(e, A, t) {
  return t < 0 && (t += 1), t >= 1 && (t -= 1), t < 1 / 6 ? (A - e) * t * 6 + e : t < 1 / 2 ? A : t < 2 / 3 ? (A - e) * 6 * (2 / 3 - t) + e : e;
}
var Co = function(e, A) {
  var t = A.filter(an), n = t[0], i = t[1], s = t[2], l = t[3], u = (n.type === 17 ? me(n.number) : ci.parse(e, n)) / (Math.PI * 2), f = kA(i) ? i.number / 100 : 0, g = kA(s) ? s.number / 100 : 0, w = typeof l < "u" && kA(l) ? QA(l, 1) : 1;
  if (f === 0)
    return ft(g * 255, g * 255, g * 255, 1);
  var v = g <= 0.5 ? g * (f + 1) : g + f - g * f, U = g * 2 - v, L = ra(U, v, u + 1 / 3), C = ra(U, v, u), y = ra(U, v, u - 1 / 3);
  return ft(L * 255, C * 255, y * 255, w);
}, ih = {
  hsl: Co,
  hsla: Co,
  rgb: yo,
  rgba: yo
}, Pn = function(e, A) {
  return ht.parse(e, Ol.create(A).parseComponentValue());
}, je = {
  ALICEBLUE: 4042850303,
  ANTIQUEWHITE: 4209760255,
  AQUA: 16777215,
  AQUAMARINE: 2147472639,
  AZURE: 4043309055,
  BEIGE: 4126530815,
  BISQUE: 4293182719,
  BLACK: 255,
  BLANCHEDALMOND: 4293643775,
  BLUE: 65535,
  BLUEVIOLET: 2318131967,
  BROWN: 2771004159,
  BURLYWOOD: 3736635391,
  CADETBLUE: 1604231423,
  CHARTREUSE: 2147418367,
  CHOCOLATE: 3530104575,
  CORAL: 4286533887,
  CORNFLOWERBLUE: 1687547391,
  CORNSILK: 4294499583,
  CRIMSON: 3692313855,
  CYAN: 16777215,
  DARKBLUE: 35839,
  DARKCYAN: 9145343,
  DARKGOLDENROD: 3095837695,
  DARKGRAY: 2846468607,
  DARKGREEN: 6553855,
  DARKGREY: 2846468607,
  DARKKHAKI: 3182914559,
  DARKMAGENTA: 2332068863,
  DARKOLIVEGREEN: 1433087999,
  DARKORANGE: 4287365375,
  DARKORCHID: 2570243327,
  DARKRED: 2332033279,
  DARKSALMON: 3918953215,
  DARKSEAGREEN: 2411499519,
  DARKSLATEBLUE: 1211993087,
  DARKSLATEGRAY: 793726975,
  DARKSLATEGREY: 793726975,
  DARKTURQUOISE: 13554175,
  DARKVIOLET: 2483082239,
  DEEPPINK: 4279538687,
  DEEPSKYBLUE: 12582911,
  DIMGRAY: 1768516095,
  DIMGREY: 1768516095,
  DODGERBLUE: 512819199,
  FIREBRICK: 2988581631,
  FLORALWHITE: 4294635775,
  FORESTGREEN: 579543807,
  FUCHSIA: 4278255615,
  GAINSBORO: 3705462015,
  GHOSTWHITE: 4177068031,
  GOLD: 4292280575,
  GOLDENROD: 3668254975,
  GRAY: 2155905279,
  GREEN: 8388863,
  GREENYELLOW: 2919182335,
  GREY: 2155905279,
  HONEYDEW: 4043305215,
  HOTPINK: 4285117695,
  INDIANRED: 3445382399,
  INDIGO: 1258324735,
  IVORY: 4294963455,
  KHAKI: 4041641215,
  LAVENDER: 3873897215,
  LAVENDERBLUSH: 4293981695,
  LAWNGREEN: 2096890111,
  LEMONCHIFFON: 4294626815,
  LIGHTBLUE: 2916673279,
  LIGHTCORAL: 4034953471,
  LIGHTCYAN: 3774873599,
  LIGHTGOLDENRODYELLOW: 4210742015,
  LIGHTGRAY: 3553874943,
  LIGHTGREEN: 2431553791,
  LIGHTGREY: 3553874943,
  LIGHTPINK: 4290167295,
  LIGHTSALMON: 4288707327,
  LIGHTSEAGREEN: 548580095,
  LIGHTSKYBLUE: 2278488831,
  LIGHTSLATEGRAY: 2005441023,
  LIGHTSLATEGREY: 2005441023,
  LIGHTSTEELBLUE: 2965692159,
  LIGHTYELLOW: 4294959359,
  LIME: 16711935,
  LIMEGREEN: 852308735,
  LINEN: 4210091775,
  MAGENTA: 4278255615,
  MAROON: 2147483903,
  MEDIUMAQUAMARINE: 1724754687,
  MEDIUMBLUE: 52735,
  MEDIUMORCHID: 3126187007,
  MEDIUMPURPLE: 2473647103,
  MEDIUMSEAGREEN: 1018393087,
  MEDIUMSLATEBLUE: 2070474495,
  MEDIUMSPRINGGREEN: 16423679,
  MEDIUMTURQUOISE: 1221709055,
  MEDIUMVIOLETRED: 3340076543,
  MIDNIGHTBLUE: 421097727,
  MINTCREAM: 4127193855,
  MISTYROSE: 4293190143,
  MOCCASIN: 4293178879,
  NAVAJOWHITE: 4292783615,
  NAVY: 33023,
  OLDLACE: 4260751103,
  OLIVE: 2155872511,
  OLIVEDRAB: 1804477439,
  ORANGE: 4289003775,
  ORANGERED: 4282712319,
  ORCHID: 3664828159,
  PALEGOLDENROD: 4008225535,
  PALEGREEN: 2566625535,
  PALETURQUOISE: 2951671551,
  PALEVIOLETRED: 3681588223,
  PAPAYAWHIP: 4293907967,
  PEACHPUFF: 4292524543,
  PERU: 3448061951,
  PINK: 4290825215,
  PLUM: 3718307327,
  POWDERBLUE: 2967529215,
  PURPLE: 2147516671,
  REBECCAPURPLE: 1714657791,
  RED: 4278190335,
  ROSYBROWN: 3163525119,
  ROYALBLUE: 1097458175,
  SADDLEBROWN: 2336560127,
  SALMON: 4202722047,
  SANDYBROWN: 4104413439,
  SEAGREEN: 780883967,
  SEASHELL: 4294307583,
  SIENNA: 2689740287,
  SILVER: 3233857791,
  SKYBLUE: 2278484991,
  SLATEBLUE: 1784335871,
  SLATEGRAY: 1887473919,
  SLATEGREY: 1887473919,
  SNOW: 4294638335,
  SPRINGGREEN: 16744447,
  STEELBLUE: 1182971135,
  TAN: 3535047935,
  TEAL: 8421631,
  THISTLE: 3636451583,
  TOMATO: 4284696575,
  TRANSPARENT: 0,
  TURQUOISE: 1088475391,
  VIOLET: 4001558271,
  WHEAT: 4125012991,
  WHITE: 4294967295,
  WHITESMOKE: 4126537215,
  YELLOW: 4294902015,
  YELLOWGREEN: 2597139199
}, ah = {
  name: "background-clip",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.map(function(t) {
      if (yA(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, sh = {
  name: "background-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, di = function(e, A) {
  var t = ht.parse(e, A[0]), n = A[1];
  return n && kA(n) ? { color: t, stop: n } : { color: t, stop: null };
}, Qo = function(e, A) {
  var t = e[0], n = e[e.length - 1];
  t.stop === null && (t.stop = XA), n.stop === null && (n.stop = ut);
  for (var i = [], s = 0, l = 0; l < e.length; l++) {
    var u = e[l].stop;
    if (u !== null) {
      var f = QA(u, A);
      f > s ? i.push(f) : i.push(s), s = f;
    } else
      i.push(null);
  }
  for (var g = null, l = 0; l < i.length; l++) {
    var w = i[l];
    if (w === null)
      g === null && (g = l);
    else if (g !== null) {
      for (var v = l - g, U = i[g - 1], L = (w - U) / (v + 1), C = 1; C <= v; C++)
        i[g + C - 1] = L * C;
      g = null;
    }
  }
  return e.map(function(y, I) {
    var b = y.color;
    return { color: b, stop: Math.max(Math.min(1, i[I] / A), 0) };
  });
}, oh = function(e, A, t) {
  var n = A / 2, i = t / 2, s = QA(e[0], A) - n, l = i - QA(e[1], t);
  return (Math.atan2(l, s) + Math.PI * 2) % (Math.PI * 2);
}, lh = function(e, A, t) {
  var n = typeof e == "number" ? e : oh(e, A, t), i = Math.abs(A * Math.sin(n)) + Math.abs(t * Math.cos(n)), s = A / 2, l = t / 2, u = i / 2, f = Math.sin(n - Math.PI / 2) * u, g = Math.cos(n - Math.PI / 2) * u;
  return [i, s - g, s + g, l - f, l + f];
}, be = function(e, A) {
  return Math.sqrt(e * e + A * A);
}, Fo = function(e, A, t, n, i) {
  var s = [
    [0, 0],
    [0, A],
    [e, 0],
    [e, A]
  ];
  return s.reduce(function(l, u) {
    var f = u[0], g = u[1], w = be(t - f, n - g);
    return (i ? w < l.optimumDistance : w > l.optimumDistance) ? {
      optimumCorner: u,
      optimumDistance: w
    } : l;
  }, {
    optimumDistance: i ? 1 / 0 : -1 / 0,
    optimumCorner: null
  }).optimumCorner;
}, ch = function(e, A, t, n, i) {
  var s = 0, l = 0;
  switch (e.size) {
    case 0:
      e.shape === 0 ? s = l = Math.min(Math.abs(A), Math.abs(A - n), Math.abs(t), Math.abs(t - i)) : e.shape === 1 && (s = Math.min(Math.abs(A), Math.abs(A - n)), l = Math.min(Math.abs(t), Math.abs(t - i)));
      break;
    case 2:
      if (e.shape === 0)
        s = l = Math.min(be(A, t), be(A, t - i), be(A - n, t), be(A - n, t - i));
      else if (e.shape === 1) {
        var u = Math.min(Math.abs(t), Math.abs(t - i)) / Math.min(Math.abs(A), Math.abs(A - n)), f = Fo(n, i, A, t, !0), g = f[0], w = f[1];
        s = be(g - A, (w - t) / u), l = u * s;
      }
      break;
    case 1:
      e.shape === 0 ? s = l = Math.max(Math.abs(A), Math.abs(A - n), Math.abs(t), Math.abs(t - i)) : e.shape === 1 && (s = Math.max(Math.abs(A), Math.abs(A - n)), l = Math.max(Math.abs(t), Math.abs(t - i)));
      break;
    case 3:
      if (e.shape === 0)
        s = l = Math.max(be(A, t), be(A, t - i), be(A - n, t), be(A - n, t - i));
      else if (e.shape === 1) {
        var u = Math.max(Math.abs(t), Math.abs(t - i)) / Math.max(Math.abs(A), Math.abs(A - n)), v = Fo(n, i, A, t, !1), g = v[0], w = v[1];
        s = be(g - A, (w - t) / u), l = u * s;
      }
      break;
  }
  return Array.isArray(e.size) && (s = QA(e.size[0], n), l = e.size.length === 2 ? QA(e.size[1], i) : s), [s, l];
}, dh = function(e, A) {
  var t = me(180), n = [];
  return Pe(A).forEach(function(i, s) {
    if (s === 0) {
      var l = i[0];
      if (l.type === 20 && l.value === "to") {
        t = Xl(i);
        return;
      } else if (Gl(l)) {
        t = ci.parse(e, l);
        return;
      }
    }
    var u = di(e, i);
    n.push(u);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, xr = function(e, A) {
  var t = me(180), n = [];
  return Pe(A).forEach(function(i, s) {
    if (s === 0) {
      var l = i[0];
      if (l.type === 20 && ["top", "left", "right", "bottom"].indexOf(l.value) !== -1) {
        t = Xl(i);
        return;
      } else if (Gl(l)) {
        t = (ci.parse(e, l) + me(270)) % me(360);
        return;
      }
    }
    var u = di(e, i);
    n.push(u);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, uh = function(e, A) {
  var t = me(180), n = [], i = 1, s = 0, l = 3, u = [];
  return Pe(A).forEach(function(f, g) {
    var w = f[0];
    if (g === 0) {
      if (yA(w) && w.value === "linear") {
        i = 1;
        return;
      } else if (yA(w) && w.value === "radial") {
        i = 2;
        return;
      }
    }
    if (w.type === 18) {
      if (w.name === "from") {
        var v = ht.parse(e, w.values[0]);
        n.push({ stop: XA, color: v });
      } else if (w.name === "to") {
        var v = ht.parse(e, w.values[0]);
        n.push({ stop: ut, color: v });
      } else if (w.name === "color-stop") {
        var U = w.values.filter(an);
        if (U.length === 2) {
          var v = ht.parse(e, U[1]), L = U[0];
          sn(L) && n.push({
            stop: { type: 16, number: L.number * 100, flags: L.flags },
            color: v
          });
        }
      }
    }
  }), i === 1 ? {
    angle: (t + me(180)) % me(360),
    stops: n,
    type: i
  } : { size: l, shape: s, stops: n, position: u, type: i };
}, Vl = "closest-side", Yl = "farthest-side", Wl = "closest-corner", Jl = "farthest-corner", jl = "circle", zl = "ellipse", ql = "cover", Zl = "contain", fh = function(e, A) {
  var t = 0, n = 3, i = [], s = [];
  return Pe(A).forEach(function(l, u) {
    var f = !0;
    if (u === 0) {
      var g = !1;
      f = l.reduce(function(v, U) {
        if (g)
          if (yA(U))
            switch (U.value) {
              case "center":
                return s.push(za), v;
              case "top":
              case "left":
                return s.push(XA), v;
              case "right":
              case "bottom":
                return s.push(ut), v;
            }
          else (kA(U) || Bt(U)) && s.push(U);
        else if (yA(U))
          switch (U.value) {
            case jl:
              return t = 0, !1;
            case zl:
              return t = 1, !1;
            case "at":
              return g = !0, !1;
            case Vl:
              return n = 0, !1;
            case ql:
            case Yl:
              return n = 1, !1;
            case Zl:
            case Wl:
              return n = 2, !1;
            case Jl:
              return n = 3, !1;
          }
        else if (Bt(U) || kA(U))
          return Array.isArray(n) || (n = []), n.push(U), !1;
        return v;
      }, f);
    }
    if (f) {
      var w = di(e, l);
      i.push(w);
    }
  }), {
    size: n,
    shape: t,
    stops: i,
    position: s,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, Ir = function(e, A) {
  var t = 0, n = 3, i = [], s = [];
  return Pe(A).forEach(function(l, u) {
    var f = !0;
    if (u === 0 ? f = l.reduce(function(w, v) {
      if (yA(v))
        switch (v.value) {
          case "center":
            return s.push(za), !1;
          case "top":
          case "left":
            return s.push(XA), !1;
          case "right":
          case "bottom":
            return s.push(ut), !1;
        }
      else if (kA(v) || Bt(v))
        return s.push(v), !1;
      return w;
    }, f) : u === 1 && (f = l.reduce(function(w, v) {
      if (yA(v))
        switch (v.value) {
          case jl:
            return t = 0, !1;
          case zl:
            return t = 1, !1;
          case Zl:
          case Vl:
            return n = 0, !1;
          case Yl:
            return n = 1, !1;
          case Wl:
            return n = 2, !1;
          case ql:
          case Jl:
            return n = 3, !1;
        }
      else if (Bt(v) || kA(v))
        return Array.isArray(n) || (n = []), n.push(v), !1;
      return w;
    }, f)), f) {
      var g = di(e, l);
      i.push(g);
    }
  }), {
    size: n,
    shape: t,
    stops: i,
    position: s,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, hh = function(e) {
  return e.type === 1;
}, ph = function(e) {
  return e.type === 2;
}, qa = {
  name: "image",
  parse: function(e, A) {
    if (A.type === 22) {
      var t = {
        url: A.value,
        type: 0
        /* URL */
      };
      return e.cache.addImage(A.value), t;
    }
    if (A.type === 18) {
      var n = Ac[A.name];
      if (typeof n > "u")
        throw new Error('Attempting to parse an unsupported image function "' + A.name + '"');
      return n(e, A.values);
    }
    throw new Error("Unsupported image type " + A.type);
  }
};
function gh(e) {
  return !(e.type === 20 && e.value === "none") && (e.type !== 18 || !!Ac[e.name]);
}
var Ac = {
  "linear-gradient": dh,
  "-moz-linear-gradient": xr,
  "-ms-linear-gradient": xr,
  "-o-linear-gradient": xr,
  "-webkit-linear-gradient": xr,
  "radial-gradient": fh,
  "-moz-radial-gradient": Ir,
  "-ms-radial-gradient": Ir,
  "-o-radial-gradient": Ir,
  "-webkit-radial-gradient": Ir,
  "-webkit-gradient": uh
}, Bh = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    if (A.length === 0)
      return [];
    var t = A[0];
    return t.type === 20 && t.value === "none" ? [] : A.filter(function(n) {
      return an(n) && gh(n);
    }).map(function(n) {
      return qa.parse(e, n);
    });
  }
}, wh = {
  name: "background-origin",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.map(function(t) {
      if (yA(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, vh = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    return Pe(A).map(function(t) {
      return t.filter(kA);
    }).map(Rl);
  }
}, mh = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return Pe(A).map(function(t) {
      return t.filter(yA).map(function(n) {
        return n.value;
      }).join(" ");
    }).map(yh);
  }
}, yh = function(e) {
  switch (e) {
    case "no-repeat":
      return 1;
    case "repeat-x":
    case "repeat no-repeat":
      return 2;
    case "repeat-y":
    case "no-repeat repeat":
      return 3;
    default:
      return 0;
  }
}, tn;
(function(e) {
  e.AUTO = "auto", e.CONTAIN = "contain", e.COVER = "cover";
})(tn || (tn = {}));
var Ch = {
  name: "background-size",
  initialValue: "0",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return Pe(A).map(function(t) {
      return t.filter(Qh);
    });
  }
}, Qh = function(e) {
  return yA(e) || kA(e);
}, ui = function(e) {
  return {
    name: "border-" + e + "-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
  };
}, Fh = ui("top"), Uh = ui("right"), bh = ui("bottom"), Eh = ui("left"), fi = function(e) {
  return {
    name: "border-radius-" + e,
    initialValue: "0 0",
    prefix: !1,
    type: 1,
    parse: function(A, t) {
      return Rl(t.filter(kA));
    }
  };
}, xh = fi("top-left"), Ih = fi("top-right"), Hh = fi("bottom-right"), Sh = fi("bottom-left"), hi = function(e) {
  return {
    name: "border-" + e + "-style",
    initialValue: "solid",
    prefix: !1,
    type: 2,
    parse: function(A, t) {
      switch (t) {
        case "none":
          return 0;
        case "dashed":
          return 2;
        case "dotted":
          return 3;
        case "double":
          return 4;
      }
      return 1;
    }
  };
}, Lh = hi("top"), Th = hi("right"), Dh = hi("bottom"), Kh = hi("left"), pi = function(e) {
  return {
    name: "border-" + e + "-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(A, t) {
      return jn(t) ? t.number : 0;
    }
  };
}, kh = pi("top"), Oh = pi("right"), Mh = pi("bottom"), Rh = pi("left"), Ph = {
  name: "color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Nh = {
  name: "direction",
  initialValue: "ltr",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    return A === "rtl" ? 1 : 0;
  }
}, _h = {
  name: "display",
  initialValue: "inline-block",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.filter(yA).reduce(
      function(t, n) {
        return t | $h(n.value);
      },
      0
      /* NONE */
    );
  }
}, $h = function(e) {
  switch (e) {
    case "block":
    case "-webkit-box":
      return 2;
    case "inline":
      return 4;
    case "run-in":
      return 8;
    case "flow":
      return 16;
    case "flow-root":
      return 32;
    case "table":
      return 64;
    case "flex":
    case "-webkit-flex":
      return 128;
    case "grid":
    case "-ms-grid":
      return 256;
    case "ruby":
      return 512;
    case "subgrid":
      return 1024;
    case "list-item":
      return 2048;
    case "table-row-group":
      return 4096;
    case "table-header-group":
      return 8192;
    case "table-footer-group":
      return 16384;
    case "table-row":
      return 32768;
    case "table-cell":
      return 65536;
    case "table-column-group":
      return 131072;
    case "table-column":
      return 262144;
    case "table-caption":
      return 524288;
    case "ruby-base":
      return 1048576;
    case "ruby-text":
      return 2097152;
    case "ruby-base-container":
      return 4194304;
    case "ruby-text-container":
      return 8388608;
    case "contents":
      return 16777216;
    case "inline-block":
      return 33554432;
    case "inline-list-item":
      return 67108864;
    case "inline-table":
      return 134217728;
    case "inline-flex":
      return 268435456;
    case "inline-grid":
      return 536870912;
  }
  return 0;
}, Gh = {
  name: "float",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "left":
        return 1;
      case "right":
        return 2;
      case "inline-start":
        return 3;
      case "inline-end":
        return 4;
    }
    return 0;
  }
}, Xh = {
  name: "letter-spacing",
  initialValue: "0",
  prefix: !1,
  type: 0,
  parse: function(e, A) {
    return A.type === 20 && A.value === "normal" ? 0 : A.type === 17 || A.type === 15 ? A.number : 0;
  }
}, Zr;
(function(e) {
  e.NORMAL = "normal", e.STRICT = "strict";
})(Zr || (Zr = {}));
var Vh = {
  name: "line-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    return A === "strict" ? Zr.STRICT : Zr.NORMAL;
  }
}, Yh = {
  name: "line-height",
  initialValue: "normal",
  prefix: !1,
  type: 4
  /* TOKEN_VALUE */
}, Uo = function(e, A) {
  return yA(e) && e.value === "normal" ? 1.2 * A : e.type === 17 ? A * e.number : kA(e) ? QA(e, A) : A;
}, Wh = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: !1,
  parse: function(e, A) {
    return A.type === 20 && A.value === "none" ? null : qa.parse(e, A);
  }
}, Jh = {
  name: "list-style-position",
  initialValue: "outside",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    return A === "inside" ? 0 : 1;
  }
}, Oa = {
  name: "list-style-type",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "disc":
        return 0;
      case "circle":
        return 1;
      case "square":
        return 2;
      case "decimal":
        return 3;
      case "cjk-decimal":
        return 4;
      case "decimal-leading-zero":
        return 5;
      case "lower-roman":
        return 6;
      case "upper-roman":
        return 7;
      case "lower-greek":
        return 8;
      case "lower-alpha":
        return 9;
      case "upper-alpha":
        return 10;
      case "arabic-indic":
        return 11;
      case "armenian":
        return 12;
      case "bengali":
        return 13;
      case "cambodian":
        return 14;
      case "cjk-earthly-branch":
        return 15;
      case "cjk-heavenly-stem":
        return 16;
      case "cjk-ideographic":
        return 17;
      case "devanagari":
        return 18;
      case "ethiopic-numeric":
        return 19;
      case "georgian":
        return 20;
      case "gujarati":
        return 21;
      case "gurmukhi":
        return 22;
      case "hebrew":
        return 22;
      case "hiragana":
        return 23;
      case "hiragana-iroha":
        return 24;
      case "japanese-formal":
        return 25;
      case "japanese-informal":
        return 26;
      case "kannada":
        return 27;
      case "katakana":
        return 28;
      case "katakana-iroha":
        return 29;
      case "khmer":
        return 30;
      case "korean-hangul-formal":
        return 31;
      case "korean-hanja-formal":
        return 32;
      case "korean-hanja-informal":
        return 33;
      case "lao":
        return 34;
      case "lower-armenian":
        return 35;
      case "malayalam":
        return 36;
      case "mongolian":
        return 37;
      case "myanmar":
        return 38;
      case "oriya":
        return 39;
      case "persian":
        return 40;
      case "simp-chinese-formal":
        return 41;
      case "simp-chinese-informal":
        return 42;
      case "tamil":
        return 43;
      case "telugu":
        return 44;
      case "thai":
        return 45;
      case "tibetan":
        return 46;
      case "trad-chinese-formal":
        return 47;
      case "trad-chinese-informal":
        return 48;
      case "upper-armenian":
        return 49;
      case "disclosure-open":
        return 50;
      case "disclosure-closed":
        return 51;
      default:
        return -1;
    }
  }
}, gi = function(e) {
  return {
    name: "margin-" + e,
    initialValue: "0",
    prefix: !1,
    type: 4
    /* TOKEN_VALUE */
  };
}, jh = gi("top"), zh = gi("right"), qh = gi("bottom"), Zh = gi("left"), Ap = {
  name: "overflow",
  initialValue: "visible",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.filter(yA).map(function(t) {
      switch (t.value) {
        case "hidden":
          return 1;
        case "scroll":
          return 2;
        case "clip":
          return 3;
        case "auto":
          return 4;
        default:
          return 0;
      }
    });
  }
}, ep = {
  name: "overflow-wrap",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    return A === "break-word" ? "break-word" : "normal";
  }
}, Bi = function(e) {
  return {
    name: "padding-" + e,
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length-percentage"
  };
}, tp = Bi("top"), np = Bi("right"), rp = Bi("bottom"), ip = Bi("left"), ap = {
  name: "text-align",
  initialValue: "left",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "right":
        return 2;
      case "center":
      case "justify":
        return 1;
      default:
        return 0;
    }
  }
}, sp = {
  name: "position",
  initialValue: "static",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "relative":
        return 1;
      case "absolute":
        return 2;
      case "fixed":
        return 3;
      case "sticky":
        return 4;
    }
    return 0;
  }
}, op = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    return A.length === 1 && ka(A[0], "none") ? [] : Pe(A).map(function(t) {
      for (var n = {
        color: je.TRANSPARENT,
        offsetX: XA,
        offsetY: XA,
        blur: XA
      }, i = 0, s = 0; s < t.length; s++) {
        var l = t[s];
        Bt(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : n.blur = l, i++) : n.color = ht.parse(e, l);
      }
      return n;
    });
  }
}, lp = {
  name: "text-transform",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "uppercase":
        return 2;
      case "lowercase":
        return 1;
      case "capitalize":
        return 3;
    }
    return 0;
  }
}, cp = {
  name: "transform",
  initialValue: "none",
  prefix: !0,
  type: 0,
  parse: function(e, A) {
    if (A.type === 20 && A.value === "none")
      return null;
    if (A.type === 18) {
      var t = fp[A.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported transform function "' + A.name + '"');
      return t(A.values);
    }
    return null;
  }
}, dp = function(e) {
  var A = e.filter(function(t) {
    return t.type === 17;
  }).map(function(t) {
    return t.number;
  });
  return A.length === 6 ? A : null;
}, up = function(e) {
  var A = e.filter(function(f) {
    return f.type === 17;
  }).map(function(f) {
    return f.number;
  }), t = A[0], n = A[1];
  A[2], A[3];
  var i = A[4], s = A[5];
  A[6], A[7], A[8], A[9], A[10], A[11];
  var l = A[12], u = A[13];
  return A[14], A[15], A.length === 16 ? [t, n, i, s, l, u] : null;
}, fp = {
  matrix: dp,
  matrix3d: up
}, bo = {
  type: 16,
  number: 50,
  flags: Jn
}, hp = [bo, bo], pp = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(e, A) {
    var t = A.filter(kA);
    return t.length !== 2 ? hp : [t[0], t[1]];
  }
}, gp = {
  name: "visible",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "hidden":
        return 1;
      case "collapse":
        return 2;
      default:
        return 0;
    }
  }
}, Nn;
(function(e) {
  e.NORMAL = "normal", e.BREAK_ALL = "break-all", e.KEEP_ALL = "keep-all";
})(Nn || (Nn = {}));
var Bp = {
  name: "word-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "break-all":
        return Nn.BREAK_ALL;
      case "keep-all":
        return Nn.KEEP_ALL;
      default:
        return Nn.NORMAL;
    }
  }
}, wp = {
  name: "z-index",
  initialValue: "auto",
  prefix: !1,
  type: 0,
  parse: function(e, A) {
    if (A.type === 20)
      return { auto: !0, order: 0 };
    if (sn(A))
      return { auto: !1, order: A.number };
    throw new Error("Invalid z-index number parsed");
  }
}, ec = {
  name: "time",
  parse: function(e, A) {
    if (A.type === 15)
      switch (A.unit.toLowerCase()) {
        case "s":
          return 1e3 * A.number;
        case "ms":
          return A.number;
      }
    throw new Error("Unsupported time type");
  }
}, vp = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: !1,
  parse: function(e, A) {
    return sn(A) ? A.number : 1;
  }
}, mp = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, yp = {
  name: "text-decoration-line",
  initialValue: "none",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.filter(yA).map(function(t) {
      switch (t.value) {
        case "underline":
          return 1;
        case "overline":
          return 2;
        case "line-through":
          return 3;
        case "none":
          return 4;
      }
      return 0;
    }).filter(function(t) {
      return t !== 0;
    });
  }
}, Cp = {
  name: "font-family",
  initialValue: "",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    var t = [], n = [];
    return A.forEach(function(i) {
      switch (i.type) {
        case 20:
        case 0:
          t.push(i.value);
          break;
        case 17:
          t.push(i.number.toString());
          break;
        case 4:
          n.push(t.join(" ")), t.length = 0;
          break;
      }
    }), t.length && n.push(t.join(" ")), n.map(function(i) {
      return i.indexOf(" ") === -1 ? i : "'" + i + "'";
    });
  }
}, Qp = {
  name: "font-size",
  initialValue: "0",
  prefix: !1,
  type: 3,
  format: "length"
}, Fp = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: !1,
  parse: function(e, A) {
    return sn(A) ? A.number : yA(A) && A.value === "bold" ? 700 : 400;
  }
}, Up = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    return A.filter(yA).map(function(t) {
      return t.value;
    });
  }
}, bp = {
  name: "font-style",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "oblique":
        return "oblique";
      case "italic":
        return "italic";
      default:
        return "normal";
    }
  }
}, RA = function(e, A) {
  return (e & A) !== 0;
}, Ep = {
  name: "content",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    if (A.length === 0)
      return [];
    var t = A[0];
    return t.type === 20 && t.value === "none" ? [] : A;
  }
}, xp = {
  name: "counter-increment",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(e, A) {
    if (A.length === 0)
      return null;
    var t = A[0];
    if (t.type === 20 && t.value === "none")
      return null;
    for (var n = [], i = A.filter(Ml), s = 0; s < i.length; s++) {
      var l = i[s], u = i[s + 1];
      if (l.type === 20) {
        var f = u && sn(u) ? u.number : 1;
        n.push({ counter: l.value, increment: f });
      }
    }
    return n;
  }
}, Ip = {
  name: "counter-reset",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(e, A) {
    if (A.length === 0)
      return [];
    for (var t = [], n = A.filter(Ml), i = 0; i < n.length; i++) {
      var s = n[i], l = n[i + 1];
      if (yA(s) && s.value !== "none") {
        var u = l && sn(l) ? l.number : 0;
        t.push({ counter: s.value, reset: u });
      }
    }
    return t;
  }
}, Hp = {
  name: "duration",
  initialValue: "0s",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.filter(jn).map(function(t) {
      return ec.parse(e, t);
    });
  }
}, Sp = {
  name: "quotes",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(e, A) {
    if (A.length === 0)
      return null;
    var t = A[0];
    if (t.type === 20 && t.value === "none")
      return null;
    var n = [], i = A.filter(nh);
    if (i.length % 2 !== 0)
      return null;
    for (var s = 0; s < i.length; s += 2) {
      var l = i[s].value, u = i[s + 1].value;
      n.push({ open: l, close: u });
    }
    return n;
  }
}, Eo = function(e, A, t) {
  if (!e)
    return "";
  var n = e[Math.min(A, e.length - 1)];
  return n ? t ? n.open : n.close : "";
}, Lp = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    return A.length === 1 && ka(A[0], "none") ? [] : Pe(A).map(function(t) {
      for (var n = {
        color: 255,
        offsetX: XA,
        offsetY: XA,
        blur: XA,
        spread: XA,
        inset: !1
      }, i = 0, s = 0; s < t.length; s++) {
        var l = t[s];
        ka(l, "inset") ? n.inset = !0 : Bt(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : i === 2 ? n.blur = l : n.spread = l, i++) : n.color = ht.parse(e, l);
      }
      return n;
    });
  }
}, Tp = {
  name: "paint-order",
  initialValue: "normal",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    var t = [
      0,
      1,
      2
      /* MARKERS */
    ], n = [];
    return A.filter(yA).forEach(function(i) {
      switch (i.value) {
        case "stroke":
          n.push(
            1
            /* STROKE */
          );
          break;
        case "fill":
          n.push(
            0
            /* FILL */
          );
          break;
        case "markers":
          n.push(
            2
            /* MARKERS */
          );
          break;
      }
    }), t.forEach(function(i) {
      n.indexOf(i) === -1 && n.push(i);
    }), n;
  }
}, Dp = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: !1,
  type: 3,
  format: "color"
}, Kp = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: !1,
  parse: function(e, A) {
    return jn(A) ? A.number : 0;
  }
}, kp = (
  /** @class */
  (function() {
    function e(A, t) {
      var n, i;
      this.animationDuration = J(A, Hp, t.animationDuration), this.backgroundClip = J(A, ah, t.backgroundClip), this.backgroundColor = J(A, sh, t.backgroundColor), this.backgroundImage = J(A, Bh, t.backgroundImage), this.backgroundOrigin = J(A, wh, t.backgroundOrigin), this.backgroundPosition = J(A, vh, t.backgroundPosition), this.backgroundRepeat = J(A, mh, t.backgroundRepeat), this.backgroundSize = J(A, Ch, t.backgroundSize), this.borderTopColor = J(A, Fh, t.borderTopColor), this.borderRightColor = J(A, Uh, t.borderRightColor), this.borderBottomColor = J(A, bh, t.borderBottomColor), this.borderLeftColor = J(A, Eh, t.borderLeftColor), this.borderTopLeftRadius = J(A, xh, t.borderTopLeftRadius), this.borderTopRightRadius = J(A, Ih, t.borderTopRightRadius), this.borderBottomRightRadius = J(A, Hh, t.borderBottomRightRadius), this.borderBottomLeftRadius = J(A, Sh, t.borderBottomLeftRadius), this.borderTopStyle = J(A, Lh, t.borderTopStyle), this.borderRightStyle = J(A, Th, t.borderRightStyle), this.borderBottomStyle = J(A, Dh, t.borderBottomStyle), this.borderLeftStyle = J(A, Kh, t.borderLeftStyle), this.borderTopWidth = J(A, kh, t.borderTopWidth), this.borderRightWidth = J(A, Oh, t.borderRightWidth), this.borderBottomWidth = J(A, Mh, t.borderBottomWidth), this.borderLeftWidth = J(A, Rh, t.borderLeftWidth), this.boxShadow = J(A, Lp, t.boxShadow), this.color = J(A, Ph, t.color), this.direction = J(A, Nh, t.direction), this.display = J(A, _h, t.display), this.float = J(A, Gh, t.cssFloat), this.fontFamily = J(A, Cp, t.fontFamily), this.fontSize = J(A, Qp, t.fontSize), this.fontStyle = J(A, bp, t.fontStyle), this.fontVariant = J(A, Up, t.fontVariant), this.fontWeight = J(A, Fp, t.fontWeight), this.letterSpacing = J(A, Xh, t.letterSpacing), this.lineBreak = J(A, Vh, t.lineBreak), this.lineHeight = J(A, Yh, t.lineHeight), this.listStyleImage = J(A, Wh, t.listStyleImage), this.listStylePosition = J(A, Jh, t.listStylePosition), this.listStyleType = J(A, Oa, t.listStyleType), this.marginTop = J(A, jh, t.marginTop), this.marginRight = J(A, zh, t.marginRight), this.marginBottom = J(A, qh, t.marginBottom), this.marginLeft = J(A, Zh, t.marginLeft), this.opacity = J(A, vp, t.opacity);
      var s = J(A, Ap, t.overflow);
      this.overflowX = s[0], this.overflowY = s[s.length > 1 ? 1 : 0], this.overflowWrap = J(A, ep, t.overflowWrap), this.paddingTop = J(A, tp, t.paddingTop), this.paddingRight = J(A, np, t.paddingRight), this.paddingBottom = J(A, rp, t.paddingBottom), this.paddingLeft = J(A, ip, t.paddingLeft), this.paintOrder = J(A, Tp, t.paintOrder), this.position = J(A, sp, t.position), this.textAlign = J(A, ap, t.textAlign), this.textDecorationColor = J(A, mp, (n = t.textDecorationColor) !== null && n !== void 0 ? n : t.color), this.textDecorationLine = J(A, yp, (i = t.textDecorationLine) !== null && i !== void 0 ? i : t.textDecoration), this.textShadow = J(A, op, t.textShadow), this.textTransform = J(A, lp, t.textTransform), this.transform = J(A, cp, t.transform), this.transformOrigin = J(A, pp, t.transformOrigin), this.visibility = J(A, gp, t.visibility), this.webkitTextStrokeColor = J(A, Dp, t.webkitTextStrokeColor), this.webkitTextStrokeWidth = J(A, Kp, t.webkitTextStrokeWidth), this.wordBreak = J(A, Bp, t.wordBreak), this.zIndex = J(A, wp, t.zIndex);
    }
    return e.prototype.isVisible = function() {
      return this.display > 0 && this.opacity > 0 && this.visibility === 0;
    }, e.prototype.isTransparent = function() {
      return pt(this.backgroundColor);
    }, e.prototype.isTransformed = function() {
      return this.transform !== null;
    }, e.prototype.isPositioned = function() {
      return this.position !== 0;
    }, e.prototype.isPositionedWithZIndex = function() {
      return this.isPositioned() && !this.zIndex.auto;
    }, e.prototype.isFloating = function() {
      return this.float !== 0;
    }, e.prototype.isInlineLevel = function() {
      return RA(
        this.display,
        4
        /* INLINE */
      ) || RA(
        this.display,
        33554432
        /* INLINE_BLOCK */
      ) || RA(
        this.display,
        268435456
        /* INLINE_FLEX */
      ) || RA(
        this.display,
        536870912
        /* INLINE_GRID */
      ) || RA(
        this.display,
        67108864
        /* INLINE_LIST_ITEM */
      ) || RA(
        this.display,
        134217728
        /* INLINE_TABLE */
      );
    }, e;
  })()
), Op = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A, t) {
      this.content = J(A, Ep, t.content), this.quotes = J(A, Sp, t.quotes);
    }
    return e;
  })()
), xo = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A, t) {
      this.counterIncrement = J(A, xp, t.counterIncrement), this.counterReset = J(A, Ip, t.counterReset);
    }
    return e;
  })()
), J = function(e, A, t) {
  var n = new kl(), i = t !== null && typeof t < "u" ? t.toString() : A.initialValue;
  n.write(i);
  var s = new Ol(n.read());
  switch (A.type) {
    case 2:
      var l = s.parseComponentValue();
      return A.parse(e, yA(l) ? l.value : A.initialValue);
    case 0:
      return A.parse(e, s.parseComponentValue());
    case 1:
      return A.parse(e, s.parseComponentValues());
    case 4:
      return s.parseComponentValue();
    case 3:
      switch (A.format) {
        case "angle":
          return ci.parse(e, s.parseComponentValue());
        case "color":
          return ht.parse(e, s.parseComponentValue());
        case "image":
          return qa.parse(e, s.parseComponentValue());
        case "length":
          var u = s.parseComponentValue();
          return Bt(u) ? u : XA;
        case "length-percentage":
          var f = s.parseComponentValue();
          return kA(f) ? f : XA;
        case "time":
          return ec.parse(e, s.parseComponentValue());
      }
      break;
  }
}, Mp = "data-html2canvas-debug", Rp = function(e) {
  var A = e.getAttribute(Mp);
  switch (A) {
    case "all":
      return 1;
    case "clone":
      return 2;
    case "parse":
      return 3;
    case "render":
      return 4;
    default:
      return 0;
  }
}, Ma = function(e, A) {
  var t = Rp(e);
  return t === 1 || A === t;
}, Ne = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A, t) {
      if (this.context = A, this.textNodes = [], this.elements = [], this.flags = 0, Ma(
        t,
        3
        /* PARSE */
      ))
        debugger;
      this.styles = new kp(A, window.getComputedStyle(t, null)), Na(t) && (this.styles.animationDuration.some(function(n) {
        return n > 0;
      }) && (t.style.animationDuration = "0s"), this.styles.transform !== null && (t.style.transform = "none")), this.bounds = oi(this.context, t), Ma(
        t,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return e;
  })()
), Pp = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", Io = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Sn = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Hr = 0; Hr < Io.length; Hr++)
  Sn[Io.charCodeAt(Hr)] = Hr;
var Np = function(e) {
  var A = e.length * 0.75, t = e.length, n, i = 0, s, l, u, f;
  e[e.length - 1] === "=" && (A--, e[e.length - 2] === "=" && A--);
  var g = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(A) : new Array(A), w = Array.isArray(g) ? g : new Uint8Array(g);
  for (n = 0; n < t; n += 4)
    s = Sn[e.charCodeAt(n)], l = Sn[e.charCodeAt(n + 1)], u = Sn[e.charCodeAt(n + 2)], f = Sn[e.charCodeAt(n + 3)], w[i++] = s << 2 | l >> 4, w[i++] = (l & 15) << 4 | u >> 2, w[i++] = (u & 3) << 6 | f & 63;
  return g;
}, _p = function(e) {
  for (var A = e.length, t = [], n = 0; n < A; n += 2)
    t.push(e[n + 1] << 8 | e[n]);
  return t;
}, $p = function(e) {
  for (var A = e.length, t = [], n = 0; n < A; n += 4)
    t.push(e[n + 3] << 24 | e[n + 2] << 16 | e[n + 1] << 8 | e[n]);
  return t;
}, St = 5, Za = 11, ia = 2, Gp = Za - St, tc = 65536 >> St, Xp = 1 << St, aa = Xp - 1, Vp = 1024 >> St, Yp = tc + Vp, Wp = Yp, Jp = 32, jp = Wp + Jp, zp = 65536 >> Za, qp = 1 << Gp, Zp = qp - 1, Ho = function(e, A, t) {
  return e.slice ? e.slice(A, t) : new Uint16Array(Array.prototype.slice.call(e, A, t));
}, Ag = function(e, A, t) {
  return e.slice ? e.slice(A, t) : new Uint32Array(Array.prototype.slice.call(e, A, t));
}, eg = function(e, A) {
  var t = Np(e), n = Array.isArray(t) ? $p(t) : new Uint32Array(t), i = Array.isArray(t) ? _p(t) : new Uint16Array(t), s = 24, l = Ho(i, s / 2, n[4] / 2), u = n[5] === 2 ? Ho(i, (s + n[4]) / 2) : Ag(n, Math.ceil((s + n[4]) / 4));
  return new tg(n[0], n[1], n[2], n[3], l, u);
}, tg = (
  /** @class */
  (function() {
    function e(A, t, n, i, s, l) {
      this.initialValue = A, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = s, this.data = l;
    }
    return e.prototype.get = function(A) {
      var t;
      if (A >= 0) {
        if (A < 55296 || A > 56319 && A <= 65535)
          return t = this.index[A >> St], t = (t << ia) + (A & aa), this.data[t];
        if (A <= 65535)
          return t = this.index[tc + (A - 55296 >> St)], t = (t << ia) + (A & aa), this.data[t];
        if (A < this.highStart)
          return t = jp - zp + (A >> Za), t = this.index[t], t += A >> St & Zp, t = this.index[t], t = (t << ia) + (A & aa), this.data[t];
        if (A <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, e;
  })()
), So = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ng = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Sr = 0; Sr < So.length; Sr++)
  ng[So.charCodeAt(Sr)] = Sr;
var rg = 1, sa = 2, oa = 3, Lo = 4, To = 5, ig = 7, Do = 8, la = 9, ca = 10, Ko = 11, ko = 12, Oo = 13, Mo = 14, da = 15, ag = function(e) {
  for (var A = [], t = 0, n = e.length; t < n; ) {
    var i = e.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var s = e.charCodeAt(t++);
      (s & 64512) === 56320 ? A.push(((i & 1023) << 10) + (s & 1023) + 65536) : (A.push(i), t--);
    } else
      A.push(i);
  }
  return A;
}, sg = function() {
  for (var e = [], A = 0; A < arguments.length; A++)
    e[A] = arguments[A];
  if (String.fromCodePoint)
    return String.fromCodePoint.apply(String, e);
  var t = e.length;
  if (!t)
    return "";
  for (var n = [], i = -1, s = ""; ++i < t; ) {
    var l = e[i];
    l <= 65535 ? n.push(l) : (l -= 65536, n.push((l >> 10) + 55296, l % 1024 + 56320)), (i + 1 === t || n.length > 16384) && (s += String.fromCharCode.apply(String, n), n.length = 0);
  }
  return s;
}, og = eg(Pp), we = "×", ua = "÷", lg = function(e) {
  return og.get(e);
}, cg = function(e, A, t) {
  var n = t - 2, i = A[n], s = A[t - 1], l = A[t];
  if (s === sa && l === oa)
    return we;
  if (s === sa || s === oa || s === Lo || l === sa || l === oa || l === Lo)
    return ua;
  if (s === Do && [Do, la, Ko, ko].indexOf(l) !== -1 || (s === Ko || s === la) && (l === la || l === ca) || (s === ko || s === ca) && l === ca || l === Oo || l === To || l === ig || s === rg)
    return we;
  if (s === Oo && l === Mo) {
    for (; i === To; )
      i = A[--n];
    if (i === Mo)
      return we;
  }
  if (s === da && l === da) {
    for (var u = 0; i === da; )
      u++, i = A[--n];
    if (u % 2 === 0)
      return we;
  }
  return ua;
}, dg = function(e) {
  var A = ag(e), t = A.length, n = 0, i = 0, s = A.map(lg);
  return {
    next: function() {
      if (n >= t)
        return { done: !0, value: null };
      for (var l = we; n < t && (l = cg(A, s, ++n)) === we; )
        ;
      if (l !== we || n === t) {
        var u = sg.apply(null, A.slice(i, n));
        return i = n, { value: u, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, ug = function(e) {
  for (var A = dg(e), t = [], n; !(n = A.next()).done; )
    n.value && t.push(n.value.slice());
  return t;
}, fg = function(e) {
  var A = 123;
  if (e.createRange) {
    var t = e.createRange();
    if (t.getBoundingClientRect) {
      var n = e.createElement("boundtest");
      n.style.height = A + "px", n.style.display = "block", e.body.appendChild(n), t.selectNode(n);
      var i = t.getBoundingClientRect(), s = Math.round(i.height);
      if (e.body.removeChild(n), s === A)
        return !0;
    }
  }
  return !1;
}, hg = function(e) {
  var A = e.createElement("boundtest");
  A.style.width = "50px", A.style.display = "block", A.style.fontSize = "12px", A.style.letterSpacing = "0px", A.style.wordSpacing = "0px", e.body.appendChild(A);
  var t = e.createRange();
  A.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var n = A.firstChild, i = li(n.data).map(function(f) {
    return TA(f);
  }), s = 0, l = {}, u = i.every(function(f, g) {
    t.setStart(n, s), t.setEnd(n, s + f.length);
    var w = t.getBoundingClientRect();
    s += f.length;
    var v = w.x > l.x || w.y > l.y;
    return l = w, g === 0 ? !0 : v;
  });
  return e.body.removeChild(A), u;
}, pg = function() {
  return typeof new Image().crossOrigin < "u";
}, gg = function() {
  return typeof new XMLHttpRequest().responseType == "string";
}, Bg = function(e) {
  var A = new Image(), t = e.createElement("canvas"), n = t.getContext("2d");
  if (!n)
    return !1;
  A.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
  try {
    n.drawImage(A, 0, 0), t.toDataURL();
  } catch {
    return !1;
  }
  return !0;
}, Ro = function(e) {
  return e[0] === 0 && e[1] === 255 && e[2] === 0 && e[3] === 255;
}, wg = function(e) {
  var A = e.createElement("canvas"), t = 100;
  A.width = t, A.height = t;
  var n = A.getContext("2d");
  if (!n)
    return Promise.reject(!1);
  n.fillStyle = "rgb(0, 255, 0)", n.fillRect(0, 0, t, t);
  var i = new Image(), s = A.toDataURL();
  i.src = s;
  var l = Ra(t, t, 0, 0, i);
  return n.fillStyle = "red", n.fillRect(0, 0, t, t), Po(l).then(function(u) {
    n.drawImage(u, 0, 0);
    var f = n.getImageData(0, 0, t, t).data;
    n.fillStyle = "red", n.fillRect(0, 0, t, t);
    var g = e.createElement("div");
    return g.style.backgroundImage = "url(" + s + ")", g.style.height = t + "px", Ro(f) ? Po(Ra(t, t, 0, 0, g)) : Promise.reject(!1);
  }).then(function(u) {
    return n.drawImage(u, 0, 0), Ro(n.getImageData(0, 0, t, t).data);
  }).catch(function() {
    return !1;
  });
}, Ra = function(e, A, t, n, i) {
  var s = "http://www.w3.org/2000/svg", l = document.createElementNS(s, "svg"), u = document.createElementNS(s, "foreignObject");
  return l.setAttributeNS(null, "width", e.toString()), l.setAttributeNS(null, "height", A.toString()), u.setAttributeNS(null, "width", "100%"), u.setAttributeNS(null, "height", "100%"), u.setAttributeNS(null, "x", t.toString()), u.setAttributeNS(null, "y", n.toString()), u.setAttributeNS(null, "externalResourcesRequired", "true"), l.appendChild(u), u.appendChild(i), l;
}, Po = function(e) {
  return new Promise(function(A, t) {
    var n = new Image();
    n.onload = function() {
      return A(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(e));
  });
}, GA = {
  get SUPPORT_RANGE_BOUNDS() {
    var e = fg(document);
    return Object.defineProperty(GA, "SUPPORT_RANGE_BOUNDS", { value: e }), e;
  },
  get SUPPORT_WORD_BREAKING() {
    var e = GA.SUPPORT_RANGE_BOUNDS && hg(document);
    return Object.defineProperty(GA, "SUPPORT_WORD_BREAKING", { value: e }), e;
  },
  get SUPPORT_SVG_DRAWING() {
    var e = Bg(document);
    return Object.defineProperty(GA, "SUPPORT_SVG_DRAWING", { value: e }), e;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var e = typeof Array.from == "function" && typeof window.fetch == "function" ? wg(document) : Promise.resolve(!1);
    return Object.defineProperty(GA, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: e }), e;
  },
  get SUPPORT_CORS_IMAGES() {
    var e = pg();
    return Object.defineProperty(GA, "SUPPORT_CORS_IMAGES", { value: e }), e;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var e = gg();
    return Object.defineProperty(GA, "SUPPORT_RESPONSE_TYPE", { value: e }), e;
  },
  get SUPPORT_CORS_XHR() {
    var e = "withCredentials" in new XMLHttpRequest();
    return Object.defineProperty(GA, "SUPPORT_CORS_XHR", { value: e }), e;
  },
  get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
    var e = !!(typeof Intl < "u" && Intl.Segmenter);
    return Object.defineProperty(GA, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value: e }), e;
  }
}, _n = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A, t) {
      this.text = A, this.bounds = t;
    }
    return e;
  })()
), vg = function(e, A, t, n) {
  var i = Cg(A, t), s = [], l = 0;
  return i.forEach(function(u) {
    if (t.textDecorationLine.length || u.trim().length > 0)
      if (GA.SUPPORT_RANGE_BOUNDS) {
        var f = No(n, l, u.length).getClientRects();
        if (f.length > 1) {
          var g = As(u), w = 0;
          g.forEach(function(U) {
            s.push(new _n(U, qe.fromDOMRectList(e, No(n, w + l, U.length).getClientRects()))), w += U.length;
          });
        } else
          s.push(new _n(u, qe.fromDOMRectList(e, f)));
      } else {
        var v = n.splitText(u.length);
        s.push(new _n(u, mg(e, n))), n = v;
      }
    else GA.SUPPORT_RANGE_BOUNDS || (n = n.splitText(u.length));
    l += u.length;
  }), s;
}, mg = function(e, A) {
  var t = A.ownerDocument;
  if (t) {
    var n = t.createElement("html2canvaswrapper");
    n.appendChild(A.cloneNode(!0));
    var i = A.parentNode;
    if (i) {
      i.replaceChild(n, A);
      var s = oi(e, n);
      return n.firstChild && i.replaceChild(n.firstChild, n), s;
    }
  }
  return qe.EMPTY;
}, No = function(e, A, t) {
  var n = e.ownerDocument;
  if (!n)
    throw new Error("Node has no owner document");
  var i = n.createRange();
  return i.setStart(e, A), i.setEnd(e, A + t), i;
}, As = function(e) {
  if (GA.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var A = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(A.segment(e)).map(function(t) {
      return t.segment;
    });
  }
  return ug(e);
}, yg = function(e, A) {
  if (GA.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var t = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(t.segment(e)).map(function(n) {
      return n.segment;
    });
  }
  return Fg(e, A);
}, Cg = function(e, A) {
  return A.letterSpacing !== 0 ? As(e) : yg(e, A);
}, Qg = [32, 160, 4961, 65792, 65793, 4153, 4241], Fg = function(e, A) {
  for (var t = ju(e, {
    lineBreak: A.lineBreak,
    wordBreak: A.overflowWrap === "break-word" ? "break-word" : A.wordBreak
  }), n = [], i, s = function() {
    if (i.value) {
      var l = i.value.slice(), u = li(l), f = "";
      u.forEach(function(g) {
        Qg.indexOf(g) === -1 ? f += TA(g) : (f.length && n.push(f), n.push(TA(g)), f = "");
      }), f.length && n.push(f);
    }
  }; !(i = t.next()).done; )
    s();
  return n;
}, Ug = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A, t, n) {
      this.text = bg(t.data, n.textTransform), this.textBounds = vg(A, this.text, n, t);
    }
    return e;
  })()
), bg = function(e, A) {
  switch (A) {
    case 1:
      return e.toLowerCase();
    case 3:
      return e.replace(Eg, xg);
    case 2:
      return e.toUpperCase();
    default:
      return e;
  }
}, Eg = /(^|\s|:|-|\(|\))([a-z])/g, xg = function(e, A, t) {
  return e.length > 0 ? A + t.toUpperCase() : e;
}, nc = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this;
      return i.src = n.currentSrc || n.src, i.intrinsicWidth = n.naturalWidth, i.intrinsicHeight = n.naturalHeight, i.context.cache.addImage(i.src), i;
    }
    return A;
  })(Ne)
), rc = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this;
      return i.canvas = n, i.intrinsicWidth = n.width, i.intrinsicHeight = n.height, i;
    }
    return A;
  })(Ne)
), ic = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this, s = new XMLSerializer(), l = oi(t, n);
      return n.setAttribute("width", l.width + "px"), n.setAttribute("height", l.height + "px"), i.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(n)), i.intrinsicWidth = n.width.baseVal.value, i.intrinsicHeight = n.height.baseVal.value, i.context.cache.addImage(i.svg), i;
    }
    return A;
  })(Ne)
), ac = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return A;
  })(Ne)
), Pa = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this;
      return i.start = n.start, i.reversed = typeof n.reversed == "boolean" && n.reversed === !0, i;
    }
    return A;
  })(Ne)
), Ig = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
], Hg = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
], Sg = function(e) {
  return e.width > e.height ? new qe(e.left + (e.width - e.height) / 2, e.top, e.height, e.height) : e.width < e.height ? new qe(e.left, e.top + (e.height - e.width) / 2, e.width, e.width) : e;
}, Lg = function(e) {
  var A = e.type === Tg ? new Array(e.value.length + 1).join("•") : e.value;
  return A.length === 0 ? e.placeholder || "" : A;
}, Ai = "checkbox", ei = "radio", Tg = "password", _o = 707406591, es = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this;
      switch (i.type = n.type.toLowerCase(), i.checked = n.checked, i.value = Lg(n), (i.type === Ai || i.type === ei) && (i.styles.backgroundColor = 3739148031, i.styles.borderTopColor = i.styles.borderRightColor = i.styles.borderBottomColor = i.styles.borderLeftColor = 2779096575, i.styles.borderTopWidth = i.styles.borderRightWidth = i.styles.borderBottomWidth = i.styles.borderLeftWidth = 1, i.styles.borderTopStyle = i.styles.borderRightStyle = i.styles.borderBottomStyle = i.styles.borderLeftStyle = 1, i.styles.backgroundClip = [
        0
        /* BORDER_BOX */
      ], i.styles.backgroundOrigin = [
        0
        /* BORDER_BOX */
      ], i.bounds = Sg(i.bounds)), i.type) {
        case Ai:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = Ig;
          break;
        case ei:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = Hg;
          break;
      }
      return i;
    }
    return A;
  })(Ne)
), sc = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this, s = n.options[n.selectedIndex || 0];
      return i.value = s && s.text || "", i;
    }
    return A;
  })(Ne)
), oc = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return A;
  })(Ne)
), lc = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this;
      i.src = n.src, i.width = parseInt(n.width, 10) || 0, i.height = parseInt(n.height, 10) || 0, i.backgroundColor = i.styles.backgroundColor;
      try {
        if (n.contentWindow && n.contentWindow.document && n.contentWindow.document.documentElement) {
          i.tree = dc(t, n.contentWindow.document.documentElement);
          var s = n.contentWindow.document.documentElement ? Pn(t, getComputedStyle(n.contentWindow.document.documentElement).backgroundColor) : je.TRANSPARENT, l = n.contentWindow.document.body ? Pn(t, getComputedStyle(n.contentWindow.document.body).backgroundColor) : je.TRANSPARENT;
          i.backgroundColor = pt(s) ? pt(l) ? i.styles.backgroundColor : l : s;
        }
      } catch {
      }
      return i;
    }
    return A;
  })(Ne)
), Dg = ["OL", "UL", "MENU"], Gr = function(e, A, t, n) {
  for (var i = A.firstChild, s = void 0; i; i = s)
    if (s = i.nextSibling, uc(i) && i.data.trim().length > 0)
      t.textNodes.push(new Ug(e, i, t.styles));
    else if (An(i))
      if (gc(i) && i.assignedNodes)
        i.assignedNodes().forEach(function(u) {
          return Gr(e, u, t, n);
        });
      else {
        var l = cc(e, i);
        l.styles.isVisible() && (Kg(i, l, n) ? l.flags |= 4 : kg(l.styles) && (l.flags |= 2), Dg.indexOf(i.tagName) !== -1 && (l.flags |= 8), t.elements.push(l), i.slot, i.shadowRoot ? Gr(e, i.shadowRoot, l, n) : !ti(i) && !fc(i) && !ni(i) && Gr(e, i, l, n));
      }
}, cc = function(e, A) {
  return _a(A) ? new nc(e, A) : hc(A) ? new rc(e, A) : fc(A) ? new ic(e, A) : Og(A) ? new ac(e, A) : Mg(A) ? new Pa(e, A) : Rg(A) ? new es(e, A) : ni(A) ? new sc(e, A) : ti(A) ? new oc(e, A) : pc(A) ? new lc(e, A) : new Ne(e, A);
}, dc = function(e, A) {
  var t = cc(e, A);
  return t.flags |= 4, Gr(e, A, t, t), t;
}, Kg = function(e, A, t) {
  return A.styles.isPositionedWithZIndex() || A.styles.opacity < 1 || A.styles.isTransformed() || ts(e) && t.styles.isTransparent();
}, kg = function(e) {
  return e.isPositioned() || e.isFloating();
}, uc = function(e) {
  return e.nodeType === Node.TEXT_NODE;
}, An = function(e) {
  return e.nodeType === Node.ELEMENT_NODE;
}, Na = function(e) {
  return An(e) && typeof e.style < "u" && !Xr(e);
}, Xr = function(e) {
  return typeof e.className == "object";
}, Og = function(e) {
  return e.tagName === "LI";
}, Mg = function(e) {
  return e.tagName === "OL";
}, Rg = function(e) {
  return e.tagName === "INPUT";
}, Pg = function(e) {
  return e.tagName === "HTML";
}, fc = function(e) {
  return e.tagName === "svg";
}, ts = function(e) {
  return e.tagName === "BODY";
}, hc = function(e) {
  return e.tagName === "CANVAS";
}, $o = function(e) {
  return e.tagName === "VIDEO";
}, _a = function(e) {
  return e.tagName === "IMG";
}, pc = function(e) {
  return e.tagName === "IFRAME";
}, Go = function(e) {
  return e.tagName === "STYLE";
}, Ng = function(e) {
  return e.tagName === "SCRIPT";
}, ti = function(e) {
  return e.tagName === "TEXTAREA";
}, ni = function(e) {
  return e.tagName === "SELECT";
}, gc = function(e) {
  return e.tagName === "SLOT";
}, Xo = function(e) {
  return e.tagName.indexOf("-") > 0;
}, _g = (
  /** @class */
  (function() {
    function e() {
      this.counters = {};
    }
    return e.prototype.getCounterValue = function(A) {
      var t = this.counters[A];
      return t && t.length ? t[t.length - 1] : 1;
    }, e.prototype.getCounterValues = function(A) {
      var t = this.counters[A];
      return t || [];
    }, e.prototype.pop = function(A) {
      var t = this;
      A.forEach(function(n) {
        return t.counters[n].pop();
      });
    }, e.prototype.parse = function(A) {
      var t = this, n = A.counterIncrement, i = A.counterReset, s = !0;
      n !== null && n.forEach(function(u) {
        var f = t.counters[u.counter];
        f && u.increment !== 0 && (s = !1, f.length || f.push(1), f[Math.max(0, f.length - 1)] += u.increment);
      });
      var l = [];
      return s && i.forEach(function(u) {
        var f = t.counters[u.counter];
        l.push(u.counter), f || (f = t.counters[u.counter] = []), f.push(u.reset);
      }), l;
    }, e;
  })()
), Vo = {
  integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
}, Yo = {
  integers: [
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "Ք",
    "Փ",
    "Ւ",
    "Ց",
    "Ր",
    "Տ",
    "Վ",
    "Ս",
    "Ռ",
    "Ջ",
    "Պ",
    "Չ",
    "Ո",
    "Շ",
    "Ն",
    "Յ",
    "Մ",
    "Ճ",
    "Ղ",
    "Ձ",
    "Հ",
    "Կ",
    "Ծ",
    "Խ",
    "Լ",
    "Ի",
    "Ժ",
    "Թ",
    "Ը",
    "Է",
    "Զ",
    "Ե",
    "Դ",
    "Գ",
    "Բ",
    "Ա"
  ]
}, $g = {
  integers: [
    1e4,
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    19,
    18,
    17,
    16,
    15,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "י׳",
    "ט׳",
    "ח׳",
    "ז׳",
    "ו׳",
    "ה׳",
    "ד׳",
    "ג׳",
    "ב׳",
    "א׳",
    "ת",
    "ש",
    "ר",
    "ק",
    "צ",
    "פ",
    "ע",
    "ס",
    "נ",
    "מ",
    "ל",
    "כ",
    "יט",
    "יח",
    "יז",
    "טז",
    "טו",
    "י",
    "ט",
    "ח",
    "ז",
    "ו",
    "ה",
    "ד",
    "ג",
    "ב",
    "א"
  ]
}, Gg = {
  integers: [
    1e4,
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "ჵ",
    "ჰ",
    "ჯ",
    "ჴ",
    "ხ",
    "ჭ",
    "წ",
    "ძ",
    "ც",
    "ჩ",
    "შ",
    "ყ",
    "ღ",
    "ქ",
    "ფ",
    "ჳ",
    "ტ",
    "ს",
    "რ",
    "ჟ",
    "პ",
    "ო",
    "ჲ",
    "ნ",
    "მ",
    "ლ",
    "კ",
    "ი",
    "თ",
    "ჱ",
    "ზ",
    "ვ",
    "ე",
    "დ",
    "გ",
    "ბ",
    "ა"
  ]
}, Yt = function(e, A, t, n, i, s) {
  return e < A || e > t ? Vn(e, i, s.length > 0) : n.integers.reduce(function(l, u, f) {
    for (; e >= u; )
      e -= u, l += n.values[f];
    return l;
  }, "") + s;
}, Bc = function(e, A, t, n) {
  var i = "";
  do
    t || e--, i = n(e) + i, e /= A;
  while (e * A >= A);
  return i;
}, LA = function(e, A, t, n, i) {
  var s = t - A + 1;
  return (e < 0 ? "-" : "") + (Bc(Math.abs(e), s, n, function(l) {
    return TA(Math.floor(l % s) + A);
  }) + i);
}, bt = function(e, A, t) {
  t === void 0 && (t = ". ");
  var n = A.length;
  return Bc(Math.abs(e), n, !1, function(i) {
    return A[Math.floor(i % n)];
  }) + t;
}, zt = 1, it = 2, at = 4, Ln = 8, Ye = function(e, A, t, n, i, s) {
  if (e < -9999 || e > 9999)
    return Vn(e, 4, i.length > 0);
  var l = Math.abs(e), u = i;
  if (l === 0)
    return A[0] + u;
  for (var f = 0; l > 0 && f <= 4; f++) {
    var g = l % 10;
    g === 0 && RA(s, zt) && u !== "" ? u = A[g] + u : g > 1 || g === 1 && f === 0 || g === 1 && f === 1 && RA(s, it) || g === 1 && f === 1 && RA(s, at) && e > 100 || g === 1 && f > 1 && RA(s, Ln) ? u = A[g] + (f > 0 ? t[f - 1] : "") + u : g === 1 && f > 0 && (u = t[f - 1] + u), l = Math.floor(l / 10);
  }
  return (e < 0 ? n : "") + u;
}, Wo = "十百千萬", Jo = "拾佰仟萬", jo = "マイナス", fa = "마이너스", Vn = function(e, A, t) {
  var n = t ? ". " : "", i = t ? "、" : "", s = t ? ", " : "", l = t ? " " : "";
  switch (A) {
    case 0:
      return "•" + l;
    case 1:
      return "◦" + l;
    case 2:
      return "◾" + l;
    case 5:
      var u = LA(e, 48, 57, !0, n);
      return u.length < 4 ? "0" + u : u;
    case 4:
      return bt(e, "〇一二三四五六七八九", i);
    case 6:
      return Yt(e, 1, 3999, Vo, 3, n).toLowerCase();
    case 7:
      return Yt(e, 1, 3999, Vo, 3, n);
    case 8:
      return LA(e, 945, 969, !1, n);
    case 9:
      return LA(e, 97, 122, !1, n);
    case 10:
      return LA(e, 65, 90, !1, n);
    case 11:
      return LA(e, 1632, 1641, !0, n);
    case 12:
    case 49:
      return Yt(e, 1, 9999, Yo, 3, n);
    case 35:
      return Yt(e, 1, 9999, Yo, 3, n).toLowerCase();
    case 13:
      return LA(e, 2534, 2543, !0, n);
    case 14:
    case 30:
      return LA(e, 6112, 6121, !0, n);
    case 15:
      return bt(e, "子丑寅卯辰巳午未申酉戌亥", i);
    case 16:
      return bt(e, "甲乙丙丁戊己庚辛壬癸", i);
    case 17:
    case 48:
      return Ye(e, "零一二三四五六七八九", Wo, "負", i, it | at | Ln);
    case 47:
      return Ye(e, "零壹貳參肆伍陸柒捌玖", Jo, "負", i, zt | it | at | Ln);
    case 42:
      return Ye(e, "零一二三四五六七八九", Wo, "负", i, it | at | Ln);
    case 41:
      return Ye(e, "零壹贰叁肆伍陆柒捌玖", Jo, "负", i, zt | it | at | Ln);
    case 26:
      return Ye(e, "〇一二三四五六七八九", "十百千万", jo, i, 0);
    case 25:
      return Ye(e, "零壱弐参四伍六七八九", "拾百千万", jo, i, zt | it | at);
    case 31:
      return Ye(e, "영일이삼사오육칠팔구", "십백천만", fa, s, zt | it | at);
    case 33:
      return Ye(e, "零一二三四五六七八九", "十百千萬", fa, s, 0);
    case 32:
      return Ye(e, "零壹貳參四五六七八九", "拾百千", fa, s, zt | it | at);
    case 18:
      return LA(e, 2406, 2415, !0, n);
    case 20:
      return Yt(e, 1, 19999, Gg, 3, n);
    case 21:
      return LA(e, 2790, 2799, !0, n);
    case 22:
      return LA(e, 2662, 2671, !0, n);
    case 22:
      return Yt(e, 1, 10999, $g, 3, n);
    case 23:
      return bt(e, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
      return bt(e, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
      return LA(e, 3302, 3311, !0, n);
    case 28:
      return bt(e, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", i);
    case 29:
      return bt(e, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", i);
    case 34:
      return LA(e, 3792, 3801, !0, n);
    case 37:
      return LA(e, 6160, 6169, !0, n);
    case 38:
      return LA(e, 4160, 4169, !0, n);
    case 39:
      return LA(e, 2918, 2927, !0, n);
    case 40:
      return LA(e, 1776, 1785, !0, n);
    case 43:
      return LA(e, 3046, 3055, !0, n);
    case 44:
      return LA(e, 3174, 3183, !0, n);
    case 45:
      return LA(e, 3664, 3673, !0, n);
    case 46:
      return LA(e, 3872, 3881, !0, n);
    default:
      return LA(e, 48, 57, !0, n);
  }
}, wc = "data-html2canvas-ignore", zo = (
  /** @class */
  (function() {
    function e(A, t, n) {
      if (this.context = A, this.options = n, this.scrolledElements = [], this.referenceElement = t, this.counters = new _g(), this.quoteDepth = 0, !t.ownerDocument)
        throw new Error("Cloned element does not have an owner document");
      this.documentElement = this.cloneNode(t.ownerDocument.documentElement, !1);
    }
    return e.prototype.toIFrame = function(A, t) {
      var n = this, i = Xg(A, t);
      if (!i.contentWindow)
        return Promise.reject("Unable to find iframe window");
      var s = A.defaultView.pageXOffset, l = A.defaultView.pageYOffset, u = i.contentWindow, f = u.document, g = Wg(i).then(function() {
        return ZA(n, void 0, void 0, function() {
          var w, v;
          return JA(this, function(U) {
            switch (U.label) {
              case 0:
                return this.scrolledElements.forEach(qg), u && (u.scrollTo(t.left, t.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (u.scrollY !== t.top || u.scrollX !== t.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(u.scrollX - t.left, u.scrollY - t.top, 0, 0))), w = this.options.onclone, v = this.clonedReferenceElement, typeof v > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : f.fonts && f.fonts.ready ? [4, f.fonts.ready] : [3, 2];
              case 1:
                U.sent(), U.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, Yg(f)] : [3, 4];
              case 3:
                U.sent(), U.label = 4;
              case 4:
                return typeof w == "function" ? [2, Promise.resolve().then(function() {
                  return w(f, v);
                }).then(function() {
                  return i;
                })] : [2, i];
            }
          });
        });
      });
      return f.open(), f.write(jg(document.doctype) + "<html></html>"), zg(this.referenceElement.ownerDocument, s, l), f.replaceChild(f.adoptNode(this.documentElement), f.documentElement), f.close(), g;
    }, e.prototype.createElementClone = function(A) {
      if (Ma(
        A,
        2
        /* CLONE */
      ))
        debugger;
      if (hc(A))
        return this.createCanvasClone(A);
      if ($o(A))
        return this.createVideoClone(A);
      if (Go(A))
        return this.createStyleClone(A);
      var t = A.cloneNode(!1);
      return _a(t) && (_a(A) && A.currentSrc && A.currentSrc !== A.src && (t.src = A.currentSrc, t.srcset = ""), t.loading === "lazy" && (t.loading = "eager")), Xo(t) ? this.createCustomElementClone(t) : t;
    }, e.prototype.createCustomElementClone = function(A) {
      var t = document.createElement("html2canvascustomelement");
      return ha(A.style, t), t;
    }, e.prototype.createStyleClone = function(A) {
      try {
        var t = A.sheet;
        if (t && t.cssRules) {
          var n = [].slice.call(t.cssRules, 0).reduce(function(s, l) {
            return l && typeof l.cssText == "string" ? s + l.cssText : s;
          }, ""), i = A.cloneNode(!1);
          return i.textContent = n, i;
        }
      } catch (s) {
        if (this.context.logger.error("Unable to access cssRules property", s), s.name !== "SecurityError")
          throw s;
      }
      return A.cloneNode(!1);
    }, e.prototype.createCanvasClone = function(A) {
      var t;
      if (this.options.inlineImages && A.ownerDocument) {
        var n = A.ownerDocument.createElement("img");
        try {
          return n.src = A.toDataURL(), n;
        } catch {
          this.context.logger.info("Unable to inline canvas contents, canvas is tainted", A);
        }
      }
      var i = A.cloneNode(!1);
      try {
        i.width = A.width, i.height = A.height;
        var s = A.getContext("2d"), l = i.getContext("2d");
        if (l)
          if (!this.options.allowTaint && s)
            l.putImageData(s.getImageData(0, 0, A.width, A.height), 0, 0);
          else {
            var u = (t = A.getContext("webgl2")) !== null && t !== void 0 ? t : A.getContext("webgl");
            if (u) {
              var f = u.getContextAttributes();
              f?.preserveDrawingBuffer === !1 && this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false", A);
            }
            l.drawImage(A, 0, 0);
          }
        return i;
      } catch {
        this.context.logger.info("Unable to clone canvas as it is tainted", A);
      }
      return i;
    }, e.prototype.createVideoClone = function(A) {
      var t = A.ownerDocument.createElement("canvas");
      t.width = A.offsetWidth, t.height = A.offsetHeight;
      var n = t.getContext("2d");
      try {
        return n && (n.drawImage(A, 0, 0, t.width, t.height), this.options.allowTaint || n.getImageData(0, 0, t.width, t.height)), t;
      } catch {
        this.context.logger.info("Unable to clone video as it is tainted", A);
      }
      var i = A.ownerDocument.createElement("canvas");
      return i.width = A.offsetWidth, i.height = A.offsetHeight, i;
    }, e.prototype.appendChildNode = function(A, t, n) {
      (!An(t) || !Ng(t) && !t.hasAttribute(wc) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(t))) && (!this.options.copyStyles || !An(t) || !Go(t)) && A.appendChild(this.cloneNode(t, n));
    }, e.prototype.cloneChildNodes = function(A, t, n) {
      for (var i = this, s = A.shadowRoot ? A.shadowRoot.firstChild : A.firstChild; s; s = s.nextSibling)
        if (An(s) && gc(s) && typeof s.assignedNodes == "function") {
          var l = s.assignedNodes();
          l.length && l.forEach(function(u) {
            return i.appendChildNode(t, u, n);
          });
        } else
          this.appendChildNode(t, s, n);
    }, e.prototype.cloneNode = function(A, t) {
      if (uc(A))
        return document.createTextNode(A.data);
      if (!A.ownerDocument)
        return A.cloneNode(!1);
      var n = A.ownerDocument.defaultView;
      if (n && An(A) && (Na(A) || Xr(A))) {
        var i = this.createElementClone(A);
        i.style.transitionProperty = "none";
        var s = n.getComputedStyle(A), l = n.getComputedStyle(A, ":before"), u = n.getComputedStyle(A, ":after");
        this.referenceElement === A && Na(i) && (this.clonedReferenceElement = i), ts(i) && eB(i);
        var f = this.counters.parse(new xo(this.context, s)), g = this.resolvePseudoContent(A, i, l, $n.BEFORE);
        Xo(A) && (t = !0), $o(A) || this.cloneChildNodes(A, i, t), g && i.insertBefore(g, i.firstChild);
        var w = this.resolvePseudoContent(A, i, u, $n.AFTER);
        return w && i.appendChild(w), this.counters.pop(f), (s && (this.options.copyStyles || Xr(A)) && !pc(A) || t) && ha(s, i), (A.scrollTop !== 0 || A.scrollLeft !== 0) && this.scrolledElements.push([i, A.scrollLeft, A.scrollTop]), (ti(A) || ni(A)) && (ti(i) || ni(i)) && (i.value = A.value), i;
      }
      return A.cloneNode(!1);
    }, e.prototype.resolvePseudoContent = function(A, t, n, i) {
      var s = this;
      if (n) {
        var l = n.content, u = t.ownerDocument;
        if (!(!u || !l || l === "none" || l === "-moz-alt-content" || n.display === "none")) {
          this.counters.parse(new xo(this.context, n));
          var f = new Op(this.context, n), g = u.createElement("html2canvaspseudoelement");
          ha(n, g), f.content.forEach(function(v) {
            if (v.type === 0)
              g.appendChild(u.createTextNode(v.value));
            else if (v.type === 22) {
              var U = u.createElement("img");
              U.src = v.value, U.style.opacity = "1", g.appendChild(U);
            } else if (v.type === 18) {
              if (v.name === "attr") {
                var L = v.values.filter(yA);
                L.length && g.appendChild(u.createTextNode(A.getAttribute(L[0].value) || ""));
              } else if (v.name === "counter") {
                var C = v.values.filter(an), y = C[0], I = C[1];
                if (y && yA(y)) {
                  var b = s.counters.getCounterValue(y.value), O = I && yA(I) ? Oa.parse(s.context, I.value) : 3;
                  g.appendChild(u.createTextNode(Vn(b, O, !1)));
                }
              } else if (v.name === "counters") {
                var $ = v.values.filter(an), y = $[0], M = $[1], I = $[2];
                if (y && yA(y)) {
                  var _ = s.counters.getCounterValues(y.value), R = I && yA(I) ? Oa.parse(s.context, I.value) : 3, c = M && M.type === 0 ? M.value : "", AA = _.map(function(FA) {
                    return Vn(FA, R, !1);
                  }).join(c);
                  g.appendChild(u.createTextNode(AA));
                }
              }
            } else if (v.type === 20)
              switch (v.value) {
                case "open-quote":
                  g.appendChild(u.createTextNode(Eo(f.quotes, s.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  g.appendChild(u.createTextNode(Eo(f.quotes, --s.quoteDepth, !1)));
                  break;
                default:
                  g.appendChild(u.createTextNode(v.value));
              }
          }), g.className = $a + " " + Ga;
          var w = i === $n.BEFORE ? " " + $a : " " + Ga;
          return Xr(t) ? t.className.baseValue += w : t.className += w, g;
        }
      }
    }, e.destroy = function(A) {
      return A.parentNode ? (A.parentNode.removeChild(A), !0) : !1;
    }, e;
  })()
), $n;
(function(e) {
  e[e.BEFORE = 0] = "BEFORE", e[e.AFTER = 1] = "AFTER";
})($n || ($n = {}));
var Xg = function(e, A) {
  var t = e.createElement("iframe");
  return t.className = "html2canvas-container", t.style.visibility = "hidden", t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "0px", t.style.border = "0", t.width = A.width.toString(), t.height = A.height.toString(), t.scrolling = "no", t.setAttribute(wc, "true"), e.body.appendChild(t), t;
}, Vg = function(e) {
  return new Promise(function(A) {
    if (e.complete) {
      A();
      return;
    }
    if (!e.src) {
      A();
      return;
    }
    e.onload = A, e.onerror = A;
  });
}, Yg = function(e) {
  return Promise.all([].slice.call(e.images, 0).map(Vg));
}, Wg = function(e) {
  return new Promise(function(A, t) {
    var n = e.contentWindow;
    if (!n)
      return t("No window assigned for iframe");
    var i = n.document;
    n.onload = e.onload = function() {
      n.onload = e.onload = null;
      var s = setInterval(function() {
        i.body.childNodes.length > 0 && i.readyState === "complete" && (clearInterval(s), A(e));
      }, 50);
    };
  });
}, Jg = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
], ha = function(e, A) {
  for (var t = e.length - 1; t >= 0; t--) {
    var n = e.item(t);
    Jg.indexOf(n) === -1 && A.style.setProperty(n, e.getPropertyValue(n));
  }
  return A;
}, jg = function(e) {
  var A = "";
  return e && (A += "<!DOCTYPE ", e.name && (A += e.name), e.internalSubset && (A += e.internalSubset), e.publicId && (A += '"' + e.publicId + '"'), e.systemId && (A += '"' + e.systemId + '"'), A += ">"), A;
}, zg = function(e, A, t) {
  e && e.defaultView && (A !== e.defaultView.pageXOffset || t !== e.defaultView.pageYOffset) && e.defaultView.scrollTo(A, t);
}, qg = function(e) {
  var A = e[0], t = e[1], n = e[2];
  A.scrollLeft = t, A.scrollTop = n;
}, Zg = ":before", AB = ":after", $a = "___html2canvas___pseudoelement_before", Ga = "___html2canvas___pseudoelement_after", qo = `{
    content: "" !important;
    display: none !important;
}`, eB = function(e) {
  tB(e, "." + $a + Zg + qo + `
         .` + Ga + AB + qo);
}, tB = function(e, A) {
  var t = e.ownerDocument;
  if (t) {
    var n = t.createElement("style");
    n.textContent = A, e.appendChild(n);
  }
}, vc = (
  /** @class */
  (function() {
    function e() {
    }
    return e.getOrigin = function(A) {
      var t = e._link;
      return t ? (t.href = A, t.href = t.href, t.protocol + t.hostname + t.port) : "about:blank";
    }, e.isSameOrigin = function(A) {
      return e.getOrigin(A) === e._origin;
    }, e.setContext = function(A) {
      e._link = A.document.createElement("a"), e._origin = e.getOrigin(A.location.href);
    }, e._origin = "about:blank", e;
  })()
), nB = (
  /** @class */
  (function() {
    function e(A, t) {
      this.context = A, this._options = t, this._cache = {};
    }
    return e.prototype.addImage = function(A) {
      var t = Promise.resolve();
      return this.has(A) || (ga(A) || sB(A)) && (this._cache[A] = this.loadImage(A)).catch(function() {
      }), t;
    }, e.prototype.match = function(A) {
      return this._cache[A];
    }, e.prototype.loadImage = function(A) {
      return ZA(this, void 0, void 0, function() {
        var t, n, i, s, l = this;
        return JA(this, function(u) {
          switch (u.label) {
            case 0:
              return t = vc.isSameOrigin(A), n = !pa(A) && this._options.useCORS === !0 && GA.SUPPORT_CORS_IMAGES && !t, i = !pa(A) && !t && !ga(A) && typeof this._options.proxy == "string" && GA.SUPPORT_CORS_XHR && !n, !t && this._options.allowTaint === !1 && !pa(A) && !ga(A) && !i && !n ? [
                2
                /*return*/
              ] : (s = A, i ? [4, this.proxy(s)] : [3, 2]);
            case 1:
              s = u.sent(), u.label = 2;
            case 2:
              return this.context.logger.debug("Added image " + A.substring(0, 256)), [4, new Promise(function(f, g) {
                var w = new Image();
                w.onload = function() {
                  return f(w);
                }, w.onerror = g, (oB(s) || n) && (w.crossOrigin = "anonymous"), w.src = s, w.complete === !0 && setTimeout(function() {
                  return f(w);
                }, 500), l._options.imageTimeout > 0 && setTimeout(function() {
                  return g("Timed out (" + l._options.imageTimeout + "ms) loading image");
                }, l._options.imageTimeout);
              })];
            case 3:
              return [2, u.sent()];
          }
        });
      });
    }, e.prototype.has = function(A) {
      return typeof this._cache[A] < "u";
    }, e.prototype.keys = function() {
      return Promise.resolve(Object.keys(this._cache));
    }, e.prototype.proxy = function(A) {
      var t = this, n = this._options.proxy;
      if (!n)
        throw new Error("No proxy defined");
      var i = A.substring(0, 256);
      return new Promise(function(s, l) {
        var u = GA.SUPPORT_RESPONSE_TYPE ? "blob" : "text", f = new XMLHttpRequest();
        f.onload = function() {
          if (f.status === 200)
            if (u === "text")
              s(f.response);
            else {
              var v = new FileReader();
              v.addEventListener("load", function() {
                return s(v.result);
              }, !1), v.addEventListener("error", function(U) {
                return l(U);
              }, !1), v.readAsDataURL(f.response);
            }
          else
            l("Failed to proxy resource " + i + " with status code " + f.status);
        }, f.onerror = l;
        var g = n.indexOf("?") > -1 ? "&" : "?";
        if (f.open("GET", "" + n + g + "url=" + encodeURIComponent(A) + "&responseType=" + u), u !== "text" && f instanceof XMLHttpRequest && (f.responseType = u), t._options.imageTimeout) {
          var w = t._options.imageTimeout;
          f.timeout = w, f.ontimeout = function() {
            return l("Timed out (" + w + "ms) proxying " + i);
          };
        }
        f.send();
      });
    }, e;
  })()
), rB = /^data:image\/svg\+xml/i, iB = /^data:image\/.*;base64,/i, aB = /^data:image\/.*/i, sB = function(e) {
  return GA.SUPPORT_SVG_DRAWING || !lB(e);
}, pa = function(e) {
  return aB.test(e);
}, oB = function(e) {
  return iB.test(e);
}, ga = function(e) {
  return e.substr(0, 4) === "blob";
}, lB = function(e) {
  return e.substr(-3).toLowerCase() === "svg" || rB.test(e);
}, V = (
  /** @class */
  (function() {
    function e(A, t) {
      this.type = 0, this.x = A, this.y = t;
    }
    return e.prototype.add = function(A, t) {
      return new e(this.x + A, this.y + t);
    }, e;
  })()
), Wt = function(e, A, t) {
  return new V(e.x + (A.x - e.x) * t, e.y + (A.y - e.y) * t);
}, Lr = (
  /** @class */
  (function() {
    function e(A, t, n, i) {
      this.type = 1, this.start = A, this.startControl = t, this.endControl = n, this.end = i;
    }
    return e.prototype.subdivide = function(A, t) {
      var n = Wt(this.start, this.startControl, A), i = Wt(this.startControl, this.endControl, A), s = Wt(this.endControl, this.end, A), l = Wt(n, i, A), u = Wt(i, s, A), f = Wt(l, u, A);
      return t ? new e(this.start, n, l, f) : new e(f, u, s, this.end);
    }, e.prototype.add = function(A, t) {
      return new e(this.start.add(A, t), this.startControl.add(A, t), this.endControl.add(A, t), this.end.add(A, t));
    }, e.prototype.reverse = function() {
      return new e(this.end, this.endControl, this.startControl, this.start);
    }, e;
  })()
), ve = function(e) {
  return e.type === 1;
}, cB = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A) {
      var t = A.styles, n = A.bounds, i = Hn(t.borderTopLeftRadius, n.width, n.height), s = i[0], l = i[1], u = Hn(t.borderTopRightRadius, n.width, n.height), f = u[0], g = u[1], w = Hn(t.borderBottomRightRadius, n.width, n.height), v = w[0], U = w[1], L = Hn(t.borderBottomLeftRadius, n.width, n.height), C = L[0], y = L[1], I = [];
      I.push((s + f) / n.width), I.push((C + v) / n.width), I.push((l + y) / n.height), I.push((g + U) / n.height);
      var b = Math.max.apply(Math, I);
      b > 1 && (s /= b, l /= b, f /= b, g /= b, v /= b, U /= b, C /= b, y /= b);
      var O = n.width - f, $ = n.height - U, M = n.width - v, _ = n.height - y, R = t.borderTopWidth, c = t.borderRightWidth, AA = t.borderBottomWidth, N = t.borderLeftWidth, gA = QA(t.paddingTop, A.bounds.width), FA = QA(t.paddingRight, A.bounds.width), SA = QA(t.paddingBottom, A.bounds.width), j = QA(t.paddingLeft, A.bounds.width);
      this.topLeftBorderDoubleOuterBox = s > 0 || l > 0 ? bA(n.left + N / 3, n.top + R / 3, s - N / 3, l - R / 3, wA.TOP_LEFT) : new V(n.left + N / 3, n.top + R / 3), this.topRightBorderDoubleOuterBox = s > 0 || l > 0 ? bA(n.left + O, n.top + R / 3, f - c / 3, g - R / 3, wA.TOP_RIGHT) : new V(n.left + n.width - c / 3, n.top + R / 3), this.bottomRightBorderDoubleOuterBox = v > 0 || U > 0 ? bA(n.left + M, n.top + $, v - c / 3, U - AA / 3, wA.BOTTOM_RIGHT) : new V(n.left + n.width - c / 3, n.top + n.height - AA / 3), this.bottomLeftBorderDoubleOuterBox = C > 0 || y > 0 ? bA(n.left + N / 3, n.top + _, C - N / 3, y - AA / 3, wA.BOTTOM_LEFT) : new V(n.left + N / 3, n.top + n.height - AA / 3), this.topLeftBorderDoubleInnerBox = s > 0 || l > 0 ? bA(n.left + N * 2 / 3, n.top + R * 2 / 3, s - N * 2 / 3, l - R * 2 / 3, wA.TOP_LEFT) : new V(n.left + N * 2 / 3, n.top + R * 2 / 3), this.topRightBorderDoubleInnerBox = s > 0 || l > 0 ? bA(n.left + O, n.top + R * 2 / 3, f - c * 2 / 3, g - R * 2 / 3, wA.TOP_RIGHT) : new V(n.left + n.width - c * 2 / 3, n.top + R * 2 / 3), this.bottomRightBorderDoubleInnerBox = v > 0 || U > 0 ? bA(n.left + M, n.top + $, v - c * 2 / 3, U - AA * 2 / 3, wA.BOTTOM_RIGHT) : new V(n.left + n.width - c * 2 / 3, n.top + n.height - AA * 2 / 3), this.bottomLeftBorderDoubleInnerBox = C > 0 || y > 0 ? bA(n.left + N * 2 / 3, n.top + _, C - N * 2 / 3, y - AA * 2 / 3, wA.BOTTOM_LEFT) : new V(n.left + N * 2 / 3, n.top + n.height - AA * 2 / 3), this.topLeftBorderStroke = s > 0 || l > 0 ? bA(n.left + N / 2, n.top + R / 2, s - N / 2, l - R / 2, wA.TOP_LEFT) : new V(n.left + N / 2, n.top + R / 2), this.topRightBorderStroke = s > 0 || l > 0 ? bA(n.left + O, n.top + R / 2, f - c / 2, g - R / 2, wA.TOP_RIGHT) : new V(n.left + n.width - c / 2, n.top + R / 2), this.bottomRightBorderStroke = v > 0 || U > 0 ? bA(n.left + M, n.top + $, v - c / 2, U - AA / 2, wA.BOTTOM_RIGHT) : new V(n.left + n.width - c / 2, n.top + n.height - AA / 2), this.bottomLeftBorderStroke = C > 0 || y > 0 ? bA(n.left + N / 2, n.top + _, C - N / 2, y - AA / 2, wA.BOTTOM_LEFT) : new V(n.left + N / 2, n.top + n.height - AA / 2), this.topLeftBorderBox = s > 0 || l > 0 ? bA(n.left, n.top, s, l, wA.TOP_LEFT) : new V(n.left, n.top), this.topRightBorderBox = f > 0 || g > 0 ? bA(n.left + O, n.top, f, g, wA.TOP_RIGHT) : new V(n.left + n.width, n.top), this.bottomRightBorderBox = v > 0 || U > 0 ? bA(n.left + M, n.top + $, v, U, wA.BOTTOM_RIGHT) : new V(n.left + n.width, n.top + n.height), this.bottomLeftBorderBox = C > 0 || y > 0 ? bA(n.left, n.top + _, C, y, wA.BOTTOM_LEFT) : new V(n.left, n.top + n.height), this.topLeftPaddingBox = s > 0 || l > 0 ? bA(n.left + N, n.top + R, Math.max(0, s - N), Math.max(0, l - R), wA.TOP_LEFT) : new V(n.left + N, n.top + R), this.topRightPaddingBox = f > 0 || g > 0 ? bA(n.left + Math.min(O, n.width - c), n.top + R, O > n.width + c ? 0 : Math.max(0, f - c), Math.max(0, g - R), wA.TOP_RIGHT) : new V(n.left + n.width - c, n.top + R), this.bottomRightPaddingBox = v > 0 || U > 0 ? bA(n.left + Math.min(M, n.width - N), n.top + Math.min($, n.height - AA), Math.max(0, v - c), Math.max(0, U - AA), wA.BOTTOM_RIGHT) : new V(n.left + n.width - c, n.top + n.height - AA), this.bottomLeftPaddingBox = C > 0 || y > 0 ? bA(n.left + N, n.top + Math.min(_, n.height - AA), Math.max(0, C - N), Math.max(0, y - AA), wA.BOTTOM_LEFT) : new V(n.left + N, n.top + n.height - AA), this.topLeftContentBox = s > 0 || l > 0 ? bA(n.left + N + j, n.top + R + gA, Math.max(0, s - (N + j)), Math.max(0, l - (R + gA)), wA.TOP_LEFT) : new V(n.left + N + j, n.top + R + gA), this.topRightContentBox = f > 0 || g > 0 ? bA(n.left + Math.min(O, n.width + N + j), n.top + R + gA, O > n.width + N + j ? 0 : f - N + j, g - (R + gA), wA.TOP_RIGHT) : new V(n.left + n.width - (c + FA), n.top + R + gA), this.bottomRightContentBox = v > 0 || U > 0 ? bA(n.left + Math.min(M, n.width - (N + j)), n.top + Math.min($, n.height + R + gA), Math.max(0, v - (c + FA)), U - (AA + SA), wA.BOTTOM_RIGHT) : new V(n.left + n.width - (c + FA), n.top + n.height - (AA + SA)), this.bottomLeftContentBox = C > 0 || y > 0 ? bA(n.left + N + j, n.top + _, Math.max(0, C - (N + j)), y - (AA + SA), wA.BOTTOM_LEFT) : new V(n.left + N + j, n.top + n.height - (AA + SA));
    }
    return e;
  })()
), wA;
(function(e) {
  e[e.TOP_LEFT = 0] = "TOP_LEFT", e[e.TOP_RIGHT = 1] = "TOP_RIGHT", e[e.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", e[e.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(wA || (wA = {}));
var bA = function(e, A, t, n, i) {
  var s = 4 * ((Math.sqrt(2) - 1) / 3), l = t * s, u = n * s, f = e + t, g = A + n;
  switch (i) {
    case wA.TOP_LEFT:
      return new Lr(new V(e, g), new V(e, g - u), new V(f - l, A), new V(f, A));
    case wA.TOP_RIGHT:
      return new Lr(new V(e, A), new V(e + l, A), new V(f, g - u), new V(f, g));
    case wA.BOTTOM_RIGHT:
      return new Lr(new V(f, A), new V(f, A + u), new V(e + l, g), new V(e, g));
    case wA.BOTTOM_LEFT:
    default:
      return new Lr(new V(f, g), new V(f - l, g), new V(e, A + u), new V(e, A));
  }
}, ri = function(e) {
  return [e.topLeftBorderBox, e.topRightBorderBox, e.bottomRightBorderBox, e.bottomLeftBorderBox];
}, dB = function(e) {
  return [
    e.topLeftContentBox,
    e.topRightContentBox,
    e.bottomRightContentBox,
    e.bottomLeftContentBox
  ];
}, ii = function(e) {
  return [
    e.topLeftPaddingBox,
    e.topRightPaddingBox,
    e.bottomRightPaddingBox,
    e.bottomLeftPaddingBox
  ];
}, uB = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A, t, n) {
      this.offsetX = A, this.offsetY = t, this.matrix = n, this.type = 0, this.target = 6;
    }
    return e;
  })()
), Tr = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A, t) {
      this.path = A, this.target = t, this.type = 1;
    }
    return e;
  })()
), fB = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A) {
      this.opacity = A, this.type = 2, this.target = 6;
    }
    return e;
  })()
), hB = function(e) {
  return e.type === 0;
}, mc = function(e) {
  return e.type === 1;
}, pB = function(e) {
  return e.type === 2;
}, Zo = function(e, A) {
  return e.length === A.length ? e.some(function(t, n) {
    return t === A[n];
  }) : !1;
}, gB = function(e, A, t, n, i) {
  return e.map(function(s, l) {
    switch (l) {
      case 0:
        return s.add(A, t);
      case 1:
        return s.add(A + n, t);
      case 2:
        return s.add(A + n, t + i);
      case 3:
        return s.add(A, t + i);
    }
    return s;
  });
}, yc = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A) {
      this.element = A, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
    }
    return e;
  })()
), Cc = (
  /** @class */
  (function() {
    function e(A, t) {
      if (this.container = A, this.parent = t, this.effects = [], this.curves = new cB(this.container), this.container.styles.opacity < 1 && this.effects.push(new fB(this.container.styles.opacity)), this.container.styles.transform !== null) {
        var n = this.container.bounds.left + this.container.styles.transformOrigin[0].number, i = this.container.bounds.top + this.container.styles.transformOrigin[1].number, s = this.container.styles.transform;
        this.effects.push(new uB(n, i, s));
      }
      if (this.container.styles.overflowX !== 0) {
        var l = ri(this.curves), u = ii(this.curves);
        Zo(l, u) ? this.effects.push(new Tr(
          l,
          6
          /* CONTENT */
        )) : (this.effects.push(new Tr(
          l,
          2
          /* BACKGROUND_BORDERS */
        )), this.effects.push(new Tr(
          u,
          4
          /* CONTENT */
        )));
      }
    }
    return e.prototype.getEffects = function(A) {
      for (var t = [
        2,
        3
        /* FIXED */
      ].indexOf(this.container.styles.position) === -1, n = this.parent, i = this.effects.slice(0); n; ) {
        var s = n.effects.filter(function(f) {
          return !mc(f);
        });
        if (t || n.container.styles.position !== 0 || !n.parent) {
          if (i.unshift.apply(i, s), t = [
            2,
            3
            /* FIXED */
          ].indexOf(n.container.styles.position) === -1, n.container.styles.overflowX !== 0) {
            var l = ri(n.curves), u = ii(n.curves);
            Zo(l, u) || i.unshift(new Tr(
              u,
              6
              /* CONTENT */
            ));
          }
        } else
          i.unshift.apply(i, s);
        n = n.parent;
      }
      return i.filter(function(f) {
        return RA(f.target, A);
      });
    }, e;
  })()
), Xa = function(e, A, t, n) {
  e.container.elements.forEach(function(i) {
    var s = RA(
      i.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    ), l = RA(
      i.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    ), u = new Cc(i, e);
    RA(
      i.styles.display,
      2048
      /* LIST_ITEM */
    ) && n.push(u);
    var f = RA(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) ? [] : n;
    if (s || l) {
      var g = s || i.styles.isPositioned() ? t : A, w = new yc(u);
      if (i.styles.isPositioned() || i.styles.opacity < 1 || i.styles.isTransformed()) {
        var v = i.styles.zIndex.order;
        if (v < 0) {
          var U = 0;
          g.negativeZIndex.some(function(C, y) {
            return v > C.element.container.styles.zIndex.order ? (U = y, !1) : U > 0;
          }), g.negativeZIndex.splice(U, 0, w);
        } else if (v > 0) {
          var L = 0;
          g.positiveZIndex.some(function(C, y) {
            return v >= C.element.container.styles.zIndex.order ? (L = y + 1, !1) : L > 0;
          }), g.positiveZIndex.splice(L, 0, w);
        } else
          g.zeroOrAutoZIndexOrTransformedOrOpacity.push(w);
      } else
        i.styles.isFloating() ? g.nonPositionedFloats.push(w) : g.nonPositionedInlineLevel.push(w);
      Xa(u, w, s ? w : t, f);
    } else
      i.styles.isInlineLevel() ? A.inlineLevel.push(u) : A.nonInlineLevel.push(u), Xa(u, A, t, f);
    RA(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) && Qc(i, f);
  });
}, Qc = function(e, A) {
  for (var t = e instanceof Pa ? e.start : 1, n = e instanceof Pa ? e.reversed : !1, i = 0; i < A.length; i++) {
    var s = A[i];
    s.container instanceof ac && typeof s.container.value == "number" && s.container.value !== 0 && (t = s.container.value), s.listValue = Vn(t, s.container.styles.listStyleType, !0), t += n ? -1 : 1;
  }
}, BB = function(e) {
  var A = new Cc(e, null), t = new yc(A), n = [];
  return Xa(A, t, t, n), Qc(A.container, n), t;
}, Al = function(e, A) {
  switch (A) {
    case 0:
      return ye(e.topLeftBorderBox, e.topLeftPaddingBox, e.topRightBorderBox, e.topRightPaddingBox);
    case 1:
      return ye(e.topRightBorderBox, e.topRightPaddingBox, e.bottomRightBorderBox, e.bottomRightPaddingBox);
    case 2:
      return ye(e.bottomRightBorderBox, e.bottomRightPaddingBox, e.bottomLeftBorderBox, e.bottomLeftPaddingBox);
    default:
      return ye(e.bottomLeftBorderBox, e.bottomLeftPaddingBox, e.topLeftBorderBox, e.topLeftPaddingBox);
  }
}, wB = function(e, A) {
  switch (A) {
    case 0:
      return ye(e.topLeftBorderBox, e.topLeftBorderDoubleOuterBox, e.topRightBorderBox, e.topRightBorderDoubleOuterBox);
    case 1:
      return ye(e.topRightBorderBox, e.topRightBorderDoubleOuterBox, e.bottomRightBorderBox, e.bottomRightBorderDoubleOuterBox);
    case 2:
      return ye(e.bottomRightBorderBox, e.bottomRightBorderDoubleOuterBox, e.bottomLeftBorderBox, e.bottomLeftBorderDoubleOuterBox);
    default:
      return ye(e.bottomLeftBorderBox, e.bottomLeftBorderDoubleOuterBox, e.topLeftBorderBox, e.topLeftBorderDoubleOuterBox);
  }
}, vB = function(e, A) {
  switch (A) {
    case 0:
      return ye(e.topLeftBorderDoubleInnerBox, e.topLeftPaddingBox, e.topRightBorderDoubleInnerBox, e.topRightPaddingBox);
    case 1:
      return ye(e.topRightBorderDoubleInnerBox, e.topRightPaddingBox, e.bottomRightBorderDoubleInnerBox, e.bottomRightPaddingBox);
    case 2:
      return ye(e.bottomRightBorderDoubleInnerBox, e.bottomRightPaddingBox, e.bottomLeftBorderDoubleInnerBox, e.bottomLeftPaddingBox);
    default:
      return ye(e.bottomLeftBorderDoubleInnerBox, e.bottomLeftPaddingBox, e.topLeftBorderDoubleInnerBox, e.topLeftPaddingBox);
  }
}, mB = function(e, A) {
  switch (A) {
    case 0:
      return Dr(e.topLeftBorderStroke, e.topRightBorderStroke);
    case 1:
      return Dr(e.topRightBorderStroke, e.bottomRightBorderStroke);
    case 2:
      return Dr(e.bottomRightBorderStroke, e.bottomLeftBorderStroke);
    default:
      return Dr(e.bottomLeftBorderStroke, e.topLeftBorderStroke);
  }
}, Dr = function(e, A) {
  var t = [];
  return ve(e) ? t.push(e.subdivide(0.5, !1)) : t.push(e), ve(A) ? t.push(A.subdivide(0.5, !0)) : t.push(A), t;
}, ye = function(e, A, t, n) {
  var i = [];
  return ve(e) ? i.push(e.subdivide(0.5, !1)) : i.push(e), ve(t) ? i.push(t.subdivide(0.5, !0)) : i.push(t), ve(n) ? i.push(n.subdivide(0.5, !0).reverse()) : i.push(n), ve(A) ? i.push(A.subdivide(0.5, !1).reverse()) : i.push(A), i;
}, Fc = function(e) {
  var A = e.bounds, t = e.styles;
  return A.add(t.borderLeftWidth, t.borderTopWidth, -(t.borderRightWidth + t.borderLeftWidth), -(t.borderTopWidth + t.borderBottomWidth));
}, ai = function(e) {
  var A = e.styles, t = e.bounds, n = QA(A.paddingLeft, t.width), i = QA(A.paddingRight, t.width), s = QA(A.paddingTop, t.width), l = QA(A.paddingBottom, t.width);
  return t.add(n + A.borderLeftWidth, s + A.borderTopWidth, -(A.borderRightWidth + A.borderLeftWidth + n + i), -(A.borderTopWidth + A.borderBottomWidth + s + l));
}, yB = function(e, A) {
  return e === 0 ? A.bounds : e === 2 ? ai(A) : Fc(A);
}, CB = function(e, A) {
  return e === 0 ? A.bounds : e === 2 ? ai(A) : Fc(A);
}, Ba = function(e, A, t) {
  var n = yB(qt(e.styles.backgroundOrigin, A), e), i = CB(qt(e.styles.backgroundClip, A), e), s = QB(qt(e.styles.backgroundSize, A), t, n), l = s[0], u = s[1], f = Hn(qt(e.styles.backgroundPosition, A), n.width - l, n.height - u), g = FB(qt(e.styles.backgroundRepeat, A), f, s, n, i), w = Math.round(n.left + f[0]), v = Math.round(n.top + f[1]);
  return [g, w, v, l, u];
}, Jt = function(e) {
  return yA(e) && e.value === tn.AUTO;
}, Kr = function(e) {
  return typeof e == "number";
}, QB = function(e, A, t) {
  var n = A[0], i = A[1], s = A[2], l = e[0], u = e[1];
  if (!l)
    return [0, 0];
  if (kA(l) && u && kA(u))
    return [QA(l, t.width), QA(u, t.height)];
  var f = Kr(s);
  if (yA(l) && (l.value === tn.CONTAIN || l.value === tn.COVER)) {
    if (Kr(s)) {
      var g = t.width / t.height;
      return g < s != (l.value === tn.COVER) ? [t.width, t.width / s] : [t.height * s, t.height];
    }
    return [t.width, t.height];
  }
  var w = Kr(n), v = Kr(i), U = w || v;
  if (Jt(l) && (!u || Jt(u))) {
    if (w && v)
      return [n, i];
    if (!f && !U)
      return [t.width, t.height];
    if (U && f) {
      var L = w ? n : i * s, C = v ? i : n / s;
      return [L, C];
    }
    var y = w ? n : t.width, I = v ? i : t.height;
    return [y, I];
  }
  if (f) {
    var b = 0, O = 0;
    return kA(l) ? b = QA(l, t.width) : kA(u) && (O = QA(u, t.height)), Jt(l) ? b = O * s : (!u || Jt(u)) && (O = b / s), [b, O];
  }
  var $ = null, M = null;
  if (kA(l) ? $ = QA(l, t.width) : u && kA(u) && (M = QA(u, t.height)), $ !== null && (!u || Jt(u)) && (M = w && v ? $ / n * i : t.height), M !== null && Jt(l) && ($ = w && v ? M / i * n : t.width), $ !== null && M !== null)
    return [$, M];
  throw new Error("Unable to calculate background-size for element");
}, qt = function(e, A) {
  var t = e[A];
  return typeof t > "u" ? e[0] : t;
}, FB = function(e, A, t, n, i) {
  var s = A[0], l = A[1], u = t[0], f = t[1];
  switch (e) {
    case 2:
      return [
        new V(Math.round(n.left), Math.round(n.top + l)),
        new V(Math.round(n.left + n.width), Math.round(n.top + l)),
        new V(Math.round(n.left + n.width), Math.round(f + n.top + l)),
        new V(Math.round(n.left), Math.round(f + n.top + l))
      ];
    case 3:
      return [
        new V(Math.round(n.left + s), Math.round(n.top)),
        new V(Math.round(n.left + s + u), Math.round(n.top)),
        new V(Math.round(n.left + s + u), Math.round(n.height + n.top)),
        new V(Math.round(n.left + s), Math.round(n.height + n.top))
      ];
    case 1:
      return [
        new V(Math.round(n.left + s), Math.round(n.top + l)),
        new V(Math.round(n.left + s + u), Math.round(n.top + l)),
        new V(Math.round(n.left + s + u), Math.round(n.top + l + f)),
        new V(Math.round(n.left + s), Math.round(n.top + l + f))
      ];
    default:
      return [
        new V(Math.round(i.left), Math.round(i.top)),
        new V(Math.round(i.left + i.width), Math.round(i.top)),
        new V(Math.round(i.left + i.width), Math.round(i.height + i.top)),
        new V(Math.round(i.left), Math.round(i.height + i.top))
      ];
  }
}, UB = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", el = "Hidden Text", bB = (
  /** @class */
  (function() {
    function e(A) {
      this._data = {}, this._document = A;
    }
    return e.prototype.parseMetrics = function(A, t) {
      var n = this._document.createElement("div"), i = this._document.createElement("img"), s = this._document.createElement("span"), l = this._document.body;
      n.style.visibility = "hidden", n.style.fontFamily = A, n.style.fontSize = t, n.style.margin = "0", n.style.padding = "0", n.style.whiteSpace = "nowrap", l.appendChild(n), i.src = UB, i.width = 1, i.height = 1, i.style.margin = "0", i.style.padding = "0", i.style.verticalAlign = "baseline", s.style.fontFamily = A, s.style.fontSize = t, s.style.margin = "0", s.style.padding = "0", s.appendChild(this._document.createTextNode(el)), n.appendChild(s), n.appendChild(i);
      var u = i.offsetTop - s.offsetTop + 2;
      n.removeChild(s), n.appendChild(this._document.createTextNode(el)), n.style.lineHeight = "normal", i.style.verticalAlign = "super";
      var f = i.offsetTop - n.offsetTop + 2;
      return l.removeChild(n), { baseline: u, middle: f };
    }, e.prototype.getMetrics = function(A, t) {
      var n = A + " " + t;
      return typeof this._data[n] > "u" && (this._data[n] = this.parseMetrics(A, t)), this._data[n];
    }, e;
  })()
), Uc = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(A, t) {
      this.context = A, this.options = t;
    }
    return e;
  })()
), EB = 1e4, xB = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this;
      return i._activeEffects = [], i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), n.canvas || (i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px"), i.fontMetrics = new bB(document), i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.ctx.textBaseline = "bottom", i._activeEffects = [], i.context.logger.debug("Canvas renderer initialized (" + n.width + "x" + n.height + ") with scale " + n.scale), i;
    }
    return A.prototype.applyEffects = function(t) {
      for (var n = this; this._activeEffects.length; )
        this.popEffect();
      t.forEach(function(i) {
        return n.applyEffect(i);
      });
    }, A.prototype.applyEffect = function(t) {
      this.ctx.save(), pB(t) && (this.ctx.globalAlpha = t.opacity), hB(t) && (this.ctx.translate(t.offsetX, t.offsetY), this.ctx.transform(t.matrix[0], t.matrix[1], t.matrix[2], t.matrix[3], t.matrix[4], t.matrix[5]), this.ctx.translate(-t.offsetX, -t.offsetY)), mc(t) && (this.path(t.path), this.ctx.clip()), this._activeEffects.push(t);
    }, A.prototype.popEffect = function() {
      this._activeEffects.pop(), this.ctx.restore();
    }, A.prototype.renderStack = function(t) {
      return ZA(this, void 0, void 0, function() {
        var n;
        return JA(this, function(i) {
          switch (i.label) {
            case 0:
              return n = t.element.container.styles, n.isVisible() ? [4, this.renderStackContent(t)] : [3, 2];
            case 1:
              i.sent(), i.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderNode = function(t) {
      return ZA(this, void 0, void 0, function() {
        return JA(this, function(n) {
          switch (n.label) {
            case 0:
              if (RA(
                t.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return t.container.styles.isVisible() ? [4, this.renderNodeBackgroundAndBorders(t)] : [3, 3];
            case 1:
              return n.sent(), [4, this.renderNodeContent(t)];
            case 2:
              n.sent(), n.label = 3;
            case 3:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderTextWithLetterSpacing = function(t, n, i) {
      var s = this;
      if (n === 0)
        this.ctx.fillText(t.text, t.bounds.left, t.bounds.top + i);
      else {
        var l = As(t.text);
        l.reduce(function(u, f) {
          return s.ctx.fillText(f, u, t.bounds.top + i), u + s.ctx.measureText(f).width;
        }, t.bounds.left);
      }
    }, A.prototype.createFontStyle = function(t) {
      var n = t.fontVariant.filter(function(l) {
        return l === "normal" || l === "small-caps";
      }).join(""), i = TB(t.fontFamily).join(", "), s = jn(t.fontSize) ? "" + t.fontSize.number + t.fontSize.unit : t.fontSize.number + "px";
      return [
        [t.fontStyle, n, t.fontWeight, s, i].join(" "),
        i,
        s
      ];
    }, A.prototype.renderTextNode = function(t, n) {
      return ZA(this, void 0, void 0, function() {
        var i, s, l, u, f, g, w, v, U = this;
        return JA(this, function(L) {
          return i = this.createFontStyle(n), s = i[0], l = i[1], u = i[2], this.ctx.font = s, this.ctx.direction = n.direction === 1 ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", f = this.fontMetrics.getMetrics(l, u), g = f.baseline, w = f.middle, v = n.paintOrder, t.textBounds.forEach(function(C) {
            v.forEach(function(y) {
              switch (y) {
                case 0:
                  U.ctx.fillStyle = PA(n.color), U.renderTextWithLetterSpacing(C, n.letterSpacing, g);
                  var I = n.textShadow;
                  I.length && C.text.trim().length && (I.slice(0).reverse().forEach(function(b) {
                    U.ctx.shadowColor = PA(b.color), U.ctx.shadowOffsetX = b.offsetX.number * U.options.scale, U.ctx.shadowOffsetY = b.offsetY.number * U.options.scale, U.ctx.shadowBlur = b.blur.number, U.renderTextWithLetterSpacing(C, n.letterSpacing, g);
                  }), U.ctx.shadowColor = "", U.ctx.shadowOffsetX = 0, U.ctx.shadowOffsetY = 0, U.ctx.shadowBlur = 0), n.textDecorationLine.length && (U.ctx.fillStyle = PA(n.textDecorationColor || n.color), n.textDecorationLine.forEach(function(b) {
                    switch (b) {
                      case 1:
                        U.ctx.fillRect(C.bounds.left, Math.round(C.bounds.top + g), C.bounds.width, 1);
                        break;
                      case 2:
                        U.ctx.fillRect(C.bounds.left, Math.round(C.bounds.top), C.bounds.width, 1);
                        break;
                      case 3:
                        U.ctx.fillRect(C.bounds.left, Math.ceil(C.bounds.top + w), C.bounds.width, 1);
                        break;
                    }
                  }));
                  break;
                case 1:
                  n.webkitTextStrokeWidth && C.text.trim().length && (U.ctx.strokeStyle = PA(n.webkitTextStrokeColor), U.ctx.lineWidth = n.webkitTextStrokeWidth, U.ctx.lineJoin = window.chrome ? "miter" : "round", U.ctx.strokeText(C.text, C.bounds.left, C.bounds.top + g)), U.ctx.strokeStyle = "", U.ctx.lineWidth = 0, U.ctx.lineJoin = "miter";
                  break;
              }
            });
          }), [
            2
            /*return*/
          ];
        });
      });
    }, A.prototype.renderReplacedElement = function(t, n, i) {
      if (i && t.intrinsicWidth > 0 && t.intrinsicHeight > 0) {
        var s = ai(t), l = ii(n);
        this.path(l), this.ctx.save(), this.ctx.clip(), this.ctx.drawImage(i, 0, 0, t.intrinsicWidth, t.intrinsicHeight, s.left, s.top, s.width, s.height), this.ctx.restore();
      }
    }, A.prototype.renderNodeContent = function(t) {
      return ZA(this, void 0, void 0, function() {
        var n, i, s, l, u, f, O, O, g, w, v, U, M, L, C, _, y, I, b, O, $, M, _;
        return JA(this, function(R) {
          switch (R.label) {
            case 0:
              this.applyEffects(t.getEffects(
                4
                /* CONTENT */
              )), n = t.container, i = t.curves, s = n.styles, l = 0, u = n.textNodes, R.label = 1;
            case 1:
              return l < u.length ? (f = u[l], [4, this.renderTextNode(f, s)]) : [3, 4];
            case 2:
              R.sent(), R.label = 3;
            case 3:
              return l++, [3, 1];
            case 4:
              if (!(n instanceof nc)) return [3, 8];
              R.label = 5;
            case 5:
              return R.trys.push([5, 7, , 8]), [4, this.context.cache.match(n.src)];
            case 6:
              return O = R.sent(), this.renderReplacedElement(n, i, O), [3, 8];
            case 7:
              return R.sent(), this.context.logger.error("Error loading image " + n.src), [3, 8];
            case 8:
              if (n instanceof rc && this.renderReplacedElement(n, i, n.canvas), !(n instanceof ic)) return [3, 12];
              R.label = 9;
            case 9:
              return R.trys.push([9, 11, , 12]), [4, this.context.cache.match(n.svg)];
            case 10:
              return O = R.sent(), this.renderReplacedElement(n, i, O), [3, 12];
            case 11:
              return R.sent(), this.context.logger.error("Error loading svg " + n.svg.substring(0, 255)), [3, 12];
            case 12:
              return n instanceof lc && n.tree ? (g = new A(this.context, {
                scale: this.options.scale,
                backgroundColor: n.backgroundColor,
                x: 0,
                y: 0,
                width: n.width,
                height: n.height
              }), [4, g.render(n.tree)]) : [3, 14];
            case 13:
              w = R.sent(), n.width && n.height && this.ctx.drawImage(w, 0, 0, n.width, n.height, n.bounds.left, n.bounds.top, n.bounds.width, n.bounds.height), R.label = 14;
            case 14:
              if (n instanceof es && (v = Math.min(n.bounds.width, n.bounds.height), n.type === Ai ? n.checked && (this.ctx.save(), this.path([
                new V(n.bounds.left + v * 0.39363, n.bounds.top + v * 0.79),
                new V(n.bounds.left + v * 0.16, n.bounds.top + v * 0.5549),
                new V(n.bounds.left + v * 0.27347, n.bounds.top + v * 0.44071),
                new V(n.bounds.left + v * 0.39694, n.bounds.top + v * 0.5649),
                new V(n.bounds.left + v * 0.72983, n.bounds.top + v * 0.23),
                new V(n.bounds.left + v * 0.84, n.bounds.top + v * 0.34085),
                new V(n.bounds.left + v * 0.39363, n.bounds.top + v * 0.79)
              ]), this.ctx.fillStyle = PA(_o), this.ctx.fill(), this.ctx.restore()) : n.type === ei && n.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(n.bounds.left + v / 2, n.bounds.top + v / 2, v / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = PA(_o), this.ctx.fill(), this.ctx.restore())), IB(n) && n.value.length) {
                switch (U = this.createFontStyle(s), M = U[0], L = U[1], C = this.fontMetrics.getMetrics(M, L).baseline, this.ctx.font = M, this.ctx.fillStyle = PA(s.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = SB(n.styles.textAlign), _ = ai(n), y = 0, n.styles.textAlign) {
                  case 1:
                    y += _.width / 2;
                    break;
                  case 2:
                    y += _.width;
                    break;
                }
                I = _.add(y, 0, 0, -_.height / 2 + 1), this.ctx.save(), this.path([
                  new V(_.left, _.top),
                  new V(_.left + _.width, _.top),
                  new V(_.left + _.width, _.top + _.height),
                  new V(_.left, _.top + _.height)
                ]), this.ctx.clip(), this.renderTextWithLetterSpacing(new _n(n.value, I), s.letterSpacing, C), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
              }
              if (!RA(
                n.styles.display,
                2048
                /* LIST_ITEM */
              )) return [3, 20];
              if (n.styles.listStyleImage === null) return [3, 19];
              if (b = n.styles.listStyleImage, b.type !== 0) return [3, 18];
              O = void 0, $ = b.url, R.label = 15;
            case 15:
              return R.trys.push([15, 17, , 18]), [4, this.context.cache.match($)];
            case 16:
              return O = R.sent(), this.ctx.drawImage(O, n.bounds.left - (O.width + 10), n.bounds.top), [3, 18];
            case 17:
              return R.sent(), this.context.logger.error("Error loading list-style-image " + $), [3, 18];
            case 18:
              return [3, 20];
            case 19:
              t.listValue && n.styles.listStyleType !== -1 && (M = this.createFontStyle(s)[0], this.ctx.font = M, this.ctx.fillStyle = PA(s.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", _ = new qe(n.bounds.left, n.bounds.top + QA(n.styles.paddingTop, n.bounds.width), n.bounds.width, Uo(s.lineHeight, s.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new _n(t.listValue, _), s.letterSpacing, Uo(s.lineHeight, s.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), R.label = 20;
            case 20:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderStackContent = function(t) {
      return ZA(this, void 0, void 0, function() {
        var n, i, b, s, l, b, u, f, b, g, w, b, v, U, b, L, C, b, y, I, b;
        return JA(this, function(O) {
          switch (O.label) {
            case 0:
              if (RA(
                t.element.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return [4, this.renderNodeBackgroundAndBorders(t.element)];
            case 1:
              O.sent(), n = 0, i = t.negativeZIndex, O.label = 2;
            case 2:
              return n < i.length ? (b = i[n], [4, this.renderStack(b)]) : [3, 5];
            case 3:
              O.sent(), O.label = 4;
            case 4:
              return n++, [3, 2];
            case 5:
              return [4, this.renderNodeContent(t.element)];
            case 6:
              O.sent(), s = 0, l = t.nonInlineLevel, O.label = 7;
            case 7:
              return s < l.length ? (b = l[s], [4, this.renderNode(b)]) : [3, 10];
            case 8:
              O.sent(), O.label = 9;
            case 9:
              return s++, [3, 7];
            case 10:
              u = 0, f = t.nonPositionedFloats, O.label = 11;
            case 11:
              return u < f.length ? (b = f[u], [4, this.renderStack(b)]) : [3, 14];
            case 12:
              O.sent(), O.label = 13;
            case 13:
              return u++, [3, 11];
            case 14:
              g = 0, w = t.nonPositionedInlineLevel, O.label = 15;
            case 15:
              return g < w.length ? (b = w[g], [4, this.renderStack(b)]) : [3, 18];
            case 16:
              O.sent(), O.label = 17;
            case 17:
              return g++, [3, 15];
            case 18:
              v = 0, U = t.inlineLevel, O.label = 19;
            case 19:
              return v < U.length ? (b = U[v], [4, this.renderNode(b)]) : [3, 22];
            case 20:
              O.sent(), O.label = 21;
            case 21:
              return v++, [3, 19];
            case 22:
              L = 0, C = t.zeroOrAutoZIndexOrTransformedOrOpacity, O.label = 23;
            case 23:
              return L < C.length ? (b = C[L], [4, this.renderStack(b)]) : [3, 26];
            case 24:
              O.sent(), O.label = 25;
            case 25:
              return L++, [3, 23];
            case 26:
              y = 0, I = t.positiveZIndex, O.label = 27;
            case 27:
              return y < I.length ? (b = I[y], [4, this.renderStack(b)]) : [3, 30];
            case 28:
              O.sent(), O.label = 29;
            case 29:
              return y++, [3, 27];
            case 30:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.mask = function(t) {
      this.ctx.beginPath(), this.ctx.moveTo(0, 0), this.ctx.lineTo(this.canvas.width, 0), this.ctx.lineTo(this.canvas.width, this.canvas.height), this.ctx.lineTo(0, this.canvas.height), this.ctx.lineTo(0, 0), this.formatPath(t.slice(0).reverse()), this.ctx.closePath();
    }, A.prototype.path = function(t) {
      this.ctx.beginPath(), this.formatPath(t), this.ctx.closePath();
    }, A.prototype.formatPath = function(t) {
      var n = this;
      t.forEach(function(i, s) {
        var l = ve(i) ? i.start : i;
        s === 0 ? n.ctx.moveTo(l.x, l.y) : n.ctx.lineTo(l.x, l.y), ve(i) && n.ctx.bezierCurveTo(i.startControl.x, i.startControl.y, i.endControl.x, i.endControl.y, i.end.x, i.end.y);
      });
    }, A.prototype.renderRepeat = function(t, n, i, s) {
      this.path(t), this.ctx.fillStyle = n, this.ctx.translate(i, s), this.ctx.fill(), this.ctx.translate(-i, -s);
    }, A.prototype.resizeImage = function(t, n, i) {
      var s;
      if (t.width === n && t.height === i)
        return t;
      var l = (s = this.canvas.ownerDocument) !== null && s !== void 0 ? s : document, u = l.createElement("canvas");
      u.width = Math.max(1, n), u.height = Math.max(1, i);
      var f = u.getContext("2d");
      return f.drawImage(t, 0, 0, t.width, t.height, 0, 0, n, i), u;
    }, A.prototype.renderBackgroundImage = function(t) {
      return ZA(this, void 0, void 0, function() {
        var n, i, s, l, u, f;
        return JA(this, function(g) {
          switch (g.label) {
            case 0:
              n = t.styles.backgroundImage.length - 1, i = function(w) {
                var v, U, L, gA, UA, vA, j, BA, AA, C, gA, UA, vA, j, BA, y, I, b, O, $, M, _, R, c, AA, N, gA, FA, SA, j, BA, VA, UA, vA, NA, OA, ue, se, fe, oe, Ie, Ce;
                return JA(this, function(At) {
                  switch (At.label) {
                    case 0:
                      if (w.type !== 0) return [3, 5];
                      v = void 0, U = w.url, At.label = 1;
                    case 1:
                      return At.trys.push([1, 3, , 4]), [4, s.context.cache.match(U)];
                    case 2:
                      return v = At.sent(), [3, 4];
                    case 3:
                      return At.sent(), s.context.logger.error("Error loading background-image " + U), [3, 4];
                    case 4:
                      return v && (L = Ba(t, n, [
                        v.width,
                        v.height,
                        v.width / v.height
                      ]), gA = L[0], UA = L[1], vA = L[2], j = L[3], BA = L[4], AA = s.ctx.createPattern(s.resizeImage(v, j, BA), "repeat"), s.renderRepeat(gA, AA, UA, vA)), [3, 6];
                    case 5:
                      hh(w) ? (C = Ba(t, n, [null, null, null]), gA = C[0], UA = C[1], vA = C[2], j = C[3], BA = C[4], y = lh(w.angle, j, BA), I = y[0], b = y[1], O = y[2], $ = y[3], M = y[4], _ = document.createElement("canvas"), _.width = j, _.height = BA, R = _.getContext("2d"), c = R.createLinearGradient(b, $, O, M), Qo(w.stops, I).forEach(function(wt) {
                        return c.addColorStop(wt.stop, PA(wt.color));
                      }), R.fillStyle = c, R.fillRect(0, 0, j, BA), j > 0 && BA > 0 && (AA = s.ctx.createPattern(_, "repeat"), s.renderRepeat(gA, AA, UA, vA))) : ph(w) && (N = Ba(t, n, [
                        null,
                        null,
                        null
                      ]), gA = N[0], FA = N[1], SA = N[2], j = N[3], BA = N[4], VA = w.position.length === 0 ? [za] : w.position, UA = QA(VA[0], j), vA = QA(VA[VA.length - 1], BA), NA = ch(w, UA, vA, j, BA), OA = NA[0], ue = NA[1], OA > 0 && ue > 0 && (se = s.ctx.createRadialGradient(FA + UA, SA + vA, 0, FA + UA, SA + vA, OA), Qo(w.stops, OA * 2).forEach(function(wt) {
                        return se.addColorStop(wt.stop, PA(wt.color));
                      }), s.path(gA), s.ctx.fillStyle = se, OA !== ue ? (fe = t.bounds.left + 0.5 * t.bounds.width, oe = t.bounds.top + 0.5 * t.bounds.height, Ie = ue / OA, Ce = 1 / Ie, s.ctx.save(), s.ctx.translate(fe, oe), s.ctx.transform(1, 0, 0, Ie, 0, 0), s.ctx.translate(-fe, -oe), s.ctx.fillRect(FA, Ce * (SA - oe) + oe, j, BA * Ce), s.ctx.restore()) : s.ctx.fill())), At.label = 6;
                    case 6:
                      return n--, [
                        2
                        /*return*/
                      ];
                  }
                });
              }, s = this, l = 0, u = t.styles.backgroundImage.slice(0).reverse(), g.label = 1;
            case 1:
              return l < u.length ? (f = u[l], [5, i(f)]) : [3, 4];
            case 2:
              g.sent(), g.label = 3;
            case 3:
              return l++, [3, 1];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderSolidBorder = function(t, n, i) {
      return ZA(this, void 0, void 0, function() {
        return JA(this, function(s) {
          return this.path(Al(i, n)), this.ctx.fillStyle = PA(t), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, A.prototype.renderDoubleBorder = function(t, n, i, s) {
      return ZA(this, void 0, void 0, function() {
        var l, u;
        return JA(this, function(f) {
          switch (f.label) {
            case 0:
              return n < 3 ? [4, this.renderSolidBorder(t, i, s)] : [3, 2];
            case 1:
              return f.sent(), [
                2
                /*return*/
              ];
            case 2:
              return l = wB(s, i), this.path(l), this.ctx.fillStyle = PA(t), this.ctx.fill(), u = vB(s, i), this.path(u), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderNodeBackgroundAndBorders = function(t) {
      return ZA(this, void 0, void 0, function() {
        var n, i, s, l, u, f, g, w, v = this;
        return JA(this, function(U) {
          switch (U.label) {
            case 0:
              return this.applyEffects(t.getEffects(
                2
                /* BACKGROUND_BORDERS */
              )), n = t.container.styles, i = !pt(n.backgroundColor) || n.backgroundImage.length, s = [
                { style: n.borderTopStyle, color: n.borderTopColor, width: n.borderTopWidth },
                { style: n.borderRightStyle, color: n.borderRightColor, width: n.borderRightWidth },
                { style: n.borderBottomStyle, color: n.borderBottomColor, width: n.borderBottomWidth },
                { style: n.borderLeftStyle, color: n.borderLeftColor, width: n.borderLeftWidth }
              ], l = HB(qt(n.backgroundClip, 0), t.curves), i || n.boxShadow.length ? (this.ctx.save(), this.path(l), this.ctx.clip(), pt(n.backgroundColor) || (this.ctx.fillStyle = PA(n.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(t.container)]) : [3, 2];
            case 1:
              U.sent(), this.ctx.restore(), n.boxShadow.slice(0).reverse().forEach(function(L) {
                v.ctx.save();
                var C = ri(t.curves), y = L.inset ? 0 : EB, I = gB(C, -y + (L.inset ? 1 : -1) * L.spread.number, (L.inset ? 1 : -1) * L.spread.number, L.spread.number * (L.inset ? -2 : 2), L.spread.number * (L.inset ? -2 : 2));
                L.inset ? (v.path(C), v.ctx.clip(), v.mask(I)) : (v.mask(C), v.ctx.clip(), v.path(I)), v.ctx.shadowOffsetX = L.offsetX.number + y, v.ctx.shadowOffsetY = L.offsetY.number, v.ctx.shadowColor = PA(L.color), v.ctx.shadowBlur = L.blur.number, v.ctx.fillStyle = L.inset ? PA(L.color) : "rgba(0,0,0,1)", v.ctx.fill(), v.ctx.restore();
              }), U.label = 2;
            case 2:
              u = 0, f = 0, g = s, U.label = 3;
            case 3:
              return f < g.length ? (w = g[f], w.style !== 0 && !pt(w.color) && w.width > 0 ? w.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(
                w.color,
                w.width,
                u,
                t.curves,
                2
                /* DASHED */
              )] : [3, 11]) : [3, 13];
            case 4:
              return U.sent(), [3, 11];
            case 5:
              return w.style !== 3 ? [3, 7] : [4, this.renderDashedDottedBorder(
                w.color,
                w.width,
                u,
                t.curves,
                3
                /* DOTTED */
              )];
            case 6:
              return U.sent(), [3, 11];
            case 7:
              return w.style !== 4 ? [3, 9] : [4, this.renderDoubleBorder(w.color, w.width, u, t.curves)];
            case 8:
              return U.sent(), [3, 11];
            case 9:
              return [4, this.renderSolidBorder(w.color, u, t.curves)];
            case 10:
              U.sent(), U.label = 11;
            case 11:
              u++, U.label = 12;
            case 12:
              return f++, [3, 3];
            case 13:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderDashedDottedBorder = function(t, n, i, s, l) {
      return ZA(this, void 0, void 0, function() {
        var u, f, g, w, v, U, L, C, y, I, b, O, $, M, _, R, _, R;
        return JA(this, function(c) {
          return this.ctx.save(), u = mB(s, i), f = Al(s, i), l === 2 && (this.path(f), this.ctx.clip()), ve(f[0]) ? (g = f[0].start.x, w = f[0].start.y) : (g = f[0].x, w = f[0].y), ve(f[1]) ? (v = f[1].end.x, U = f[1].end.y) : (v = f[1].x, U = f[1].y), i === 0 || i === 2 ? L = Math.abs(g - v) : L = Math.abs(w - U), this.ctx.beginPath(), l === 3 ? this.formatPath(u) : this.formatPath(f.slice(0, 2)), C = n < 3 ? n * 3 : n * 2, y = n < 3 ? n * 2 : n, l === 3 && (C = n, y = n), I = !0, L <= C * 2 ? I = !1 : L <= C * 2 + y ? (b = L / (2 * C + y), C *= b, y *= b) : (O = Math.floor((L + y) / (C + y)), $ = (L - O * C) / (O - 1), M = (L - (O + 1) * C) / O, y = M <= 0 || Math.abs(y - $) < Math.abs(y - M) ? $ : M), I && (l === 3 ? this.ctx.setLineDash([0, C + y]) : this.ctx.setLineDash([C, y])), l === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = n) : this.ctx.lineWidth = n * 2 + 1.1, this.ctx.strokeStyle = PA(t), this.ctx.stroke(), this.ctx.setLineDash([]), l === 2 && (ve(f[0]) && (_ = f[3], R = f[0], this.ctx.beginPath(), this.formatPath([new V(_.end.x, _.end.y), new V(R.start.x, R.start.y)]), this.ctx.stroke()), ve(f[1]) && (_ = f[1], R = f[2], this.ctx.beginPath(), this.formatPath([new V(_.end.x, _.end.y), new V(R.start.x, R.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
            2
            /*return*/
          ];
        });
      });
    }, A.prototype.render = function(t) {
      return ZA(this, void 0, void 0, function() {
        var n;
        return JA(this, function(i) {
          switch (i.label) {
            case 0:
              return this.options.backgroundColor && (this.ctx.fillStyle = PA(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), n = BB(t), [4, this.renderStack(n)];
            case 1:
              return i.sent(), this.applyEffects([]), [2, this.canvas];
          }
        });
      });
    }, A;
  })(Uc)
), IB = function(e) {
  return e instanceof oc || e instanceof sc ? !0 : e instanceof es && e.type !== ei && e.type !== Ai;
}, HB = function(e, A) {
  switch (e) {
    case 0:
      return ri(A);
    case 2:
      return dB(A);
    default:
      return ii(A);
  }
}, SB = function(e) {
  switch (e) {
    case 1:
      return "center";
    case 2:
      return "right";
    default:
      return "left";
  }
}, LB = ["-apple-system", "system-ui"], TB = function(e) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? e.filter(function(A) {
    return LB.indexOf(A) === -1;
  }) : e;
}, DB = (
  /** @class */
  (function(e) {
    xe(A, e);
    function A(t, n) {
      var i = e.call(this, t, n) || this;
      return i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), i.options = n, i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px", i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + n.width + "x" + n.height + " at " + n.x + "," + n.y + ") with scale " + n.scale), i;
    }
    return A.prototype.render = function(t) {
      return ZA(this, void 0, void 0, function() {
        var n, i;
        return JA(this, function(s) {
          switch (s.label) {
            case 0:
              return n = Ra(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, t), [4, KB(n)];
            case 1:
              return i = s.sent(), this.options.backgroundColor && (this.ctx.fillStyle = PA(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(i, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
          }
        });
      });
    }, A;
  })(Uc)
), KB = function(e) {
  return new Promise(function(A, t) {
    var n = new Image();
    n.onload = function() {
      A(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(e));
  });
}, kB = (
  /** @class */
  (function() {
    function e(A) {
      var t = A.id, n = A.enabled;
      this.id = t, this.enabled = n, this.start = Date.now();
    }
    return e.prototype.debug = function() {
      for (var A = [], t = 0; t < arguments.length; t++)
        A[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.debug == "function" ? console.debug.apply(console, fr([this.id, this.getTime() + "ms"], A)) : this.info.apply(this, A));
    }, e.prototype.getTime = function() {
      return Date.now() - this.start;
    }, e.prototype.info = function() {
      for (var A = [], t = 0; t < arguments.length; t++)
        A[t] = arguments[t];
      this.enabled && typeof window < "u" && window.console && typeof console.info == "function" && console.info.apply(console, fr([this.id, this.getTime() + "ms"], A));
    }, e.prototype.warn = function() {
      for (var A = [], t = 0; t < arguments.length; t++)
        A[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.warn == "function" ? console.warn.apply(console, fr([this.id, this.getTime() + "ms"], A)) : this.info.apply(this, A));
    }, e.prototype.error = function() {
      for (var A = [], t = 0; t < arguments.length; t++)
        A[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.error == "function" ? console.error.apply(console, fr([this.id, this.getTime() + "ms"], A)) : this.info.apply(this, A));
    }, e.instances = {}, e;
  })()
), OB = (
  /** @class */
  (function() {
    function e(A, t) {
      var n;
      this.windowBounds = t, this.instanceName = "#" + e.instanceCount++, this.logger = new kB({ id: this.instanceName, enabled: A.logging }), this.cache = (n = A.cache) !== null && n !== void 0 ? n : new nB(this, A);
    }
    return e.instanceCount = 1, e;
  })()
), bc = function(e, A) {
  return A === void 0 && (A = {}), MB(e, A);
};
typeof window < "u" && vc.setContext(window);
var MB = function(e, A) {
  return ZA(void 0, void 0, void 0, function() {
    var t, n, i, s, l, u, f, g, w, v, U, L, C, y, I, b, O, $, M, _, c, R, c, AA, N, gA, FA, SA, j, BA, VA, UA, vA, NA, OA, ue, se, fe, oe, Ie;
    return JA(this, function(Ce) {
      switch (Ce.label) {
        case 0:
          if (!e || typeof e != "object")
            return [2, Promise.reject("Invalid element provided as first argument")];
          if (t = e.ownerDocument, !t)
            throw new Error("Element is not attached to a Document");
          if (n = t.defaultView, !n)
            throw new Error("Document is not attached to a Window");
          return i = {
            allowTaint: (AA = A.allowTaint) !== null && AA !== void 0 ? AA : !1,
            imageTimeout: (N = A.imageTimeout) !== null && N !== void 0 ? N : 15e3,
            proxy: A.proxy,
            useCORS: (gA = A.useCORS) !== null && gA !== void 0 ? gA : !1
          }, s = Fa({ logging: (FA = A.logging) !== null && FA !== void 0 ? FA : !0, cache: A.cache }, i), l = {
            windowWidth: (SA = A.windowWidth) !== null && SA !== void 0 ? SA : n.innerWidth,
            windowHeight: (j = A.windowHeight) !== null && j !== void 0 ? j : n.innerHeight,
            scrollX: (BA = A.scrollX) !== null && BA !== void 0 ? BA : n.pageXOffset,
            scrollY: (VA = A.scrollY) !== null && VA !== void 0 ? VA : n.pageYOffset
          }, u = new qe(l.scrollX, l.scrollY, l.windowWidth, l.windowHeight), f = new OB(s, u), g = (UA = A.foreignObjectRendering) !== null && UA !== void 0 ? UA : !1, w = {
            allowTaint: (vA = A.allowTaint) !== null && vA !== void 0 ? vA : !1,
            onclone: A.onclone,
            ignoreElements: A.ignoreElements,
            inlineImages: g,
            copyStyles: g
          }, f.logger.debug("Starting document clone with size " + u.width + "x" + u.height + " scrolled to " + -u.left + "," + -u.top), v = new zo(f, e, w), U = v.clonedReferenceElement, U ? [4, v.toIFrame(t, u)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return L = Ce.sent(), C = ts(U) || Pg(U) ? pu(U.ownerDocument) : oi(f, U), y = C.width, I = C.height, b = C.left, O = C.top, $ = RB(f, U, A.backgroundColor), M = {
            canvas: A.canvas,
            backgroundColor: $,
            scale: (OA = (NA = A.scale) !== null && NA !== void 0 ? NA : n.devicePixelRatio) !== null && OA !== void 0 ? OA : 1,
            x: ((ue = A.x) !== null && ue !== void 0 ? ue : 0) + b,
            y: ((se = A.y) !== null && se !== void 0 ? se : 0) + O,
            width: (fe = A.width) !== null && fe !== void 0 ? fe : Math.ceil(y),
            height: (oe = A.height) !== null && oe !== void 0 ? oe : Math.ceil(I)
          }, g ? (f.logger.debug("Document cloned, using foreign object rendering"), c = new DB(f, M), [4, c.render(U)]) : [3, 3];
        case 2:
          return _ = Ce.sent(), [3, 5];
        case 3:
          return f.logger.debug("Document cloned, element located at " + b + "," + O + " with size " + y + "x" + I + " using computed rendering"), f.logger.debug("Starting DOM parsing"), R = dc(f, U), $ === R.styles.backgroundColor && (R.styles.backgroundColor = je.TRANSPARENT), f.logger.debug("Starting renderer for element at " + M.x + "," + M.y + " with size " + M.width + "x" + M.height), c = new xB(f, M), [4, c.render(R)];
        case 4:
          _ = Ce.sent(), Ce.label = 5;
        case 5:
          return (!((Ie = A.removeContainer) !== null && Ie !== void 0) || Ie) && (zo.destroy(L) || f.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), f.logger.debug("Finished rendering"), [2, _];
      }
    });
  });
}, RB = function(e, A, t) {
  var n = A.ownerDocument, i = n.documentElement ? Pn(e, getComputedStyle(n.documentElement).backgroundColor) : je.TRANSPARENT, s = n.body ? Pn(e, getComputedStyle(n.body).backgroundColor) : je.TRANSPARENT, l = typeof t == "string" ? Pn(e, t) : t === null ? je.TRANSPARENT : 4294967295;
  return A === n.documentElement ? pt(i) ? pt(s) ? l : s : i : l;
};
function PB(e, A = {}) {
  const t = A.mode || "new", n = t === "view", i = String(e.review_status || "draft"), s = nn(e.name || ""), l = nn(e.accent || "#FF6B1A"), u = tl("te-layer-panel", A.panelPositions), f = tl("te-props-panel", A.panelPositions);
  return `
<div class="bg-cover" data-bg-luma="dark" style="--design-ratio:${Number(e.design_ratio || 1.778)}">
  <div id="scene" data-relative-input="true"></div>
</div>

<div id="theme-editor" class="theme-editor" data-mode="${nn(t)}">
  <div class="te-topbar" id="te-topbar">
    <span class="te-topbar-left">
      <button class="te-btn te-btn-glass" id="te-exit-btn">&larr; ${n ? "Close" : "Exit editor"}</button>
      ${n ? "" : '<button class="te-btn te-btn-glass te-btn-help" id="te-help-btn" title="Editor help" data-coreui-toggle="tooltip">?</button>'}
      ${n ? "" : '<button class="te-btn te-btn-glass" id="te-reset-panels-btn" title="Reset panel positions" data-coreui-toggle="tooltip">&#x229E;</button>'}
    </span>
    <span class="te-status te-btn-glass">
      ${n ? `View Only &middot; <strong>${s || "Untitled"}</strong>` : `Theme Editor &middot; <strong><input type="text" id="te-title-input" class="te-title-editable" value="${s}" placeholder="Untitled" maxlength="30"></strong> &middot; <span id="te-save-status">${i === "pending_review" ? "pending review" : "unsaved"}</span>`}
    </span>
    <span class="te-actions">
      <button class="te-btn te-btn-glass" id="te-preview-mode-toggle" title="Preview in dark/light mode" data-coreui-toggle="tooltip" style="font-size:11px;padding:4px 10px"><span id="te-mode-icon">🌙</span> <span id="te-mode-label">Dark</span></button>
      <button class="te-btn te-btn-glass" id="te-sample-cards-toggle" title="Show sample UI cards" data-coreui-toggle="tooltip" style="font-size:11px;padding:4px 10px">🃏 Preview UI</button>
      <button class="te-btn te-btn-glass" id="te-blur-toggle" title="Toggle blur on/off" data-coreui-toggle="tooltip" style="font-size:11px;padding:4px 10px"><span id="te-blur-label">Blur on</span></button>
      <button class="te-btn te-btn-glass" id="te-parallax-toggle" title="Pause/resume parallax movement" data-coreui-toggle="tooltip">⏸ Parallax live</button>
      <button class="te-btn te-btn-glass" id="te-zen-btn" title="Hide all chrome (Tab)" data-coreui-toggle="tooltip">&#x26F6; Preview only</button>
      ${n ? "" : '<button class="te-btn te-btn-glass" id="te-discard-btn">Discard</button>'}
      ${n ? "" : `<span class="te-save-split">
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

  <div class="te-panel te-layer-panel${u.dragged ? " te-panel-dragged" : ""}" id="te-layer-panel"${u.style ? ` style="${u.style}"` : ""}>
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

  <div class="te-panel te-props-panel${f.dragged ? " te-panel-dragged" : ""}" id="te-props-panel"${f.style ? ` style="${f.style}"` : ""}>
    <div class="te-breadcrumb" id="te-breadcrumb"><span class="te-bc-item te-bc-active" data-nav="scene">Scene</span></div>
    <div id="te-scene-props">
      <div class="te-props-controls" style="margin-top:4px">
        <div class="te-prop-row"><span class="te-prop-label">background</span><input type="color" id="te-bg-color" value="#1c2330" class="te-color-pick"><input type="text" id="te-bg-hex" class="te-mono-input" value="#1c2330" maxlength="7"></div>
        <input type="color" id="te-bg-swatch" style="display:none" value="#1c2330">
        <div class="te-prop-row"><span class="te-prop-label">accent</span><input type="color" id="te-accent-color" value="${l}" class="te-color-pick"><input type="color" id="te-accent-swatch" class="te-accent-swatch" value="${l}" style="display:none"><button class="te-chip" id="te-accent-enhance" title="Optimize accent for WCAG contrast on cards">✨ Enhance</button></div>
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
        ${["", "pulse", "float", "bob", "bounce", "rise", "drift", "wave", "swing", "sway", "rock", "spin", "shake", "zoom", "glow", "flicker", "fade"].map((g) => `<button class="te-chip${g ? "" : " active"}" data-anim="${g}">${g || "none"}</button>`).join("")}
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

    ${A.showSourceCard ? '<div id="te-source-card" class="te-source-card" style="display:none"></div>' : ""}
  </div>

  <div class="te-coords" id="te-coords" style="display:none"><span class="te-coord-label">x</span> <span id="te-coord-x">0</span>px <span class="te-coord-label">y</span> <span id="te-coord-y">0</span>px <span class="te-coord-label">w</span> <span id="te-coord-w">0</span>px <span class="te-coord-label">h</span> <span id="te-coord-h">0</span>px</div>
  <div class="te-bottombar" id="te-bottombar"><span class="te-bottom-group"><span class="te-bottom-label">type</span><span class="te-seg" id="te-type-toggle"><button class="active" data-val="parallax">Parallax</button><button data-val="static">Static</button></span></span><span class="te-bottom-hints" id="te-shortcuts"></span></div>
  <button class="te-btn te-btn-glass te-zen-exit" id="te-zen-exit" style="display:none">Show UI &#x232B;</button>
  <div id="te-sample-cards" style="display:none;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:8;pointer-events:auto;max-width:900px;width:95%;max-height:80vh;overflow-y:auto"><div class="card blur" style="max-width:320px;margin:auto"><div class="card-body" style="padding:1rem"><h6>Preview UI</h6><button class="btn btn-sm btn-primary">Primary</button> <button class="btn btn-sm btn-success">Success</button></div></div><div class="text-center mt-2"><button class="te-btn te-btn-glass" id="te-dismiss-samples" style="font-size:11px;padding:4px 12px;opacity:0.7">✕ Dismiss</button></div></div>
  <div class="te-drop-overlay" id="te-drop-overlay" style="display:none"><div class="te-drop-message">drop to add layer</div></div>
</div>`;
}
function tl(e, A) {
  const t = A?.[e];
  if (!t) return { style: "", dragged: !1 };
  const n = [];
  return t.left && t.top && n.push(`left:${nn(t.left)}`, `top:${nn(t.top)}`, "right:auto", "bottom:auto"), t.width && n.push(`width:${nn(t.width)}`), { style: n.join(";"), dragged: !!(t.left && t.top) };
}
function nn(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const NB = `(function () {
    if (!document.getElementById('theme-editor')) return;

    var filterEditMode = 'both';

    function getActiveFilterMode() {
        return document.documentElement.getAttribute('data-coreui-theme') === 'light' ? 'light' : 'dark';
    }

    function hexToRgbArr(h) { return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]; }
    function rgbToHsl(r,g,b) {
        r/=255;g/=255;b/=255;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),h,s,l=(mx+mn)/2;
        if(mx===mn){h=s=0}else{var d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);
        switch(mx){case r:h=((g-b)/d+(g<b?6:0))*60;break;case g:h=((b-r)/d+2)*60;break;case b:h=((r-g)/d+4)*60;break;}}
        return[Math.round(h),Math.round(s*100),Math.round(l*100)];
    }
    function hslToHex(h,s,l) {
        s/=100;l/=100;var a=s*Math.min(l,1-l);
        var f=function(n){var k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(Math.min(k-3,9-k,1),-1))).toString(16).padStart(2,'0');};
        return'#'+f(0)+f(8)+f(4);
    }
    function applyAccentLive(hex) {
        var rgb = hexToRgbArr(hex);
        var hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        var ah = hsl[0];
        var hueDist = function(a,b){return Math.min(Math.abs(a-b),360-Math.abs(a-b));};
        var defs = [
            {key:'success',h:145,s:78,ld:52,ll:40},
            {key:'danger', h:348,s:85,ld:58,ll:46},
            {key:'warning',h:42, s:88,ld:54,ll:46},
            {key:'info',   h:195,s:85,ld:53,ll:45}
        ];
        var hues = [];
        for (var i = 0; i < defs.length; i++) {
            var d = defs[i], h = d.h;
            if (hueDist(h, ah) < 35) {
                var plus = (h + 70) % 360, minus = (h - 70 + 360) % 360;
                var dp = hueDist(plus, ah), dm = hueDist(minus, ah);
                h = (dp > dm + 15) ? plus : (dm > dp + 15) ? minus : plus;
            }
            hues.push(h);
        }
        for (var i = 0; i < hues.length; i++) {
            for (var j = i + 1; j < hues.length; j++) {
                if (hues[i] !== defs[i].h && hues[j] !== defs[j].h && hueDist(hues[i], hues[j]) < 25) {
                    var orig = defs[i].h;
                    var alt = (hues[i] === (orig + 70) % 360) ? (orig - 70 + 360) % 360 : (orig + 70) % 360;
                    if (hueDist(alt, ah) > 20) hues[i] = alt;
                }
            }
        }
        function hueTintedDark(cr) {
            var ch = rgbToHsl(cr[0], cr[1], cr[2]);
            return hslToHex(ch[0], Math.min(ch[1] + 10, 100), 18);
        }
        function contrastText(colHex, preferWhite) {
            var cr = hexToRgbArr(colHex);
            var L = relativeLuminance(cr[0], cr[1], cr[2]);
            if (preferWhite) return L > 0.55 ? hueTintedDark(cr) : '#ffffff';
            return L < 0.25 ? '#ffffff' : hueTintedDark(cr);
        }
        function elRule(sel, key, tc) {
            return sel + ' .btn-' + key + ',' + sel + ' .btn-' + key + '-gradient,' + sel + ' .badge.bg-' + key + '{color:' + tc + ' !important}';
        }
        var pText = contrastText(hex, true);
        var css = 'html[data-coreui-theme="dark"]{--cui-primary:' + hex + ' !important;--cui-primary-rgb:' + rgb.join(',') + ' !important;';
        var elCss = elRule('html[data-coreui-theme="dark"]', 'primary', pText);
        for (var i = 0; i < defs.length; i++) {
            var d = defs[i], dHex = hslToHex(hues[i], d.s, d.ld), dr = hexToRgbArr(dHex);
            css += '--cui-' + d.key + ':' + dHex + ' !important;--cui-' + d.key + '-rgb:' + dr.join(',') + ' !important;';
            elCss += elRule('html[data-coreui-theme="dark"]', d.key, contrastText(dHex, false));
        }
        css += '}html[data-coreui-theme="light"]{--cui-primary:' + hex + ' !important;--cui-primary-rgb:' + rgb.join(',') + ' !important;';
        elCss += elRule('html[data-coreui-theme="light"]', 'primary', pText);
        for (var i = 0; i < defs.length; i++) {
            var d = defs[i], lHex = hslToHex(hues[i], d.s, d.ll), lr = hexToRgbArr(lHex);
            css += '--cui-' + d.key + ':' + lHex + ' !important;--cui-' + d.key + '-rgb:' + lr.join(',') + ' !important;';
            elCss += elRule('html[data-coreui-theme="light"]', d.key, contrastText(lHex, false));
        }
        css += '}' + elCss;
        var el = document.getElementById('te-accent-live');
        if (!el) { el = document.createElement('style'); el.id = 'te-accent-live'; }
        el.textContent = css;
        document.head.appendChild(el);
    }

    function applyBlurLive() {
        var el = document.getElementById('te-blur-live');
        if (!el) { el = document.createElement('style'); el.id = 'te-blur-live'; }
        el.textContent = 'html[data-coreui-theme="dark"]{--blur:' + (editorState.blur.dark || 'rgba(28,35,48,0.95)') + '}' +
                         'html[data-coreui-theme="light"]{--blur:' + (editorState.blur.light || 'rgba(240,240,240,0.95)') + '}';
        document.head.appendChild(el);
    }

    function sRGBtoLinear(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    function relativeLuminance(r, g, b) { return 0.2126 * sRGBtoLinear(r) + 0.7152 * sRGBtoLinear(g) + 0.0722 * sRGBtoLinear(b); }
    function contrastRatio(hex1, hex2) {
        var a = hexToRgbArr(hex1), b = hexToRgbArr(hex2);
        var L1 = relativeLuminance(a[0], a[1], a[2]), L2 = relativeLuminance(b[0], b[1], b[2]);
        var lighter = Math.max(L1, L2), darker = Math.min(L1, L2);
        return (lighter + 0.05) / (darker + 0.05);
    }
    function compositeHex(bgHex, fgR, fgG, fgB, alpha) {
        var bg = hexToRgbArr(bgHex);
        var r = Math.round(fgR * alpha + bg[0] * (1 - alpha));
        var g = Math.round(fgG * alpha + bg[1] * (1 - alpha));
        var b = Math.round(fgB * alpha + bg[2] * (1 - alpha));
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    function vivifyAccent(hex) {
        var rgb = hexToRgbArr(hex), hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        var h = hsl[0], bestL = 50, lo = 5, hi = 95;
        while (lo <= hi) {
            var mid = Math.round((lo + hi) / 2);
            if (contrastRatio(hslToHex(h, 100, mid), '#ffffff') >= 3) {
                bestL = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return hslToHex(h, 100, bestL);
    }
    function enhanceAccent(accent, bgHex, fgR, fgG, fgB, alpha, dir, target) {
        target = target || 7;
        var card = compositeHex(bgHex, fgR, fgG, fgB, alpha);
        if (contrastRatio(accent, card) >= target) return accent;
        var rgb = hexToRgbArr(accent), hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        var h = hsl[0], s = hsl[1], l = hsl[2];
        while (l > 5 && l < 95 && contrastRatio(hslToHex(h, Math.min(s, 100), l), card) < target) {
            l += dir;
        }
        return hslToHex(h, Math.min(s, 100), Math.max(5, Math.min(95, l)));
    }

    var defaultFilter = { saturate: 130, brightness: 65, contrast: 100 };

    function loadFilterSliders() {
        var mode = filterEditMode === 'both' ? getActiveFilterMode() : filterEditMode;
        var f = editorState.scene['filter_' + mode] || {};
        var sat = f.saturate != null ? f.saturate : defaultFilter.saturate;
        var bri = f.brightness != null ? f.brightness : defaultFilter.brightness;
        var con = f.contrast != null ? f.contrast : defaultFilter.contrast;
        $('#te-filter-sat').val(sat); $('#te-filter-sat-num').val(sat);
        $('#te-filter-bri').val(bri); $('#te-filter-bri-num').val(bri);
        $('#te-filter-con').val(con); $('#te-filter-con-num').val(con);
        $('[data-fmode]').removeClass('active');
        $('#te-filter-mode-' + filterEditMode).addClass('active');
    }

    function applyActiveSceneFilter() {
        var fd = editorState.scene.filter_dark || {};
        var fl = editorState.scene.filter_light || {};
        var dSat = fd.saturate != null ? fd.saturate : defaultFilter.saturate;
        var dBri = fd.brightness != null ? fd.brightness : defaultFilter.brightness;
        var dCon = fd.contrast != null ? fd.contrast : defaultFilter.contrast;
        var lSat = fl.saturate != null ? fl.saturate : defaultFilter.saturate;
        var lBri = fl.brightness != null ? fl.brightness : defaultFilter.brightness;
        var lCon = fl.contrast != null ? fl.contrast : defaultFilter.contrast;
        var el = document.getElementById('te-scene-filter');
        if (el) el.remove();
        el = document.createElement('style');
        el.id = 'te-scene-filter';
        document.head.appendChild(el);
        el.textContent = 'html[data-coreui-theme="dark"] #scene{filter:saturate(' + dSat + '%) brightness(' + dBri + '%) contrast(' + dCon + '%) !important}' +
            'html[data-coreui-theme="light"] #scene{filter:saturate(' + lSat + '%) brightness(' + lBri + '%) contrast(' + lCon + '%) !important}';
    }

    function applyTransform(el, rotation, flipX, flipY, zoom) {
        el.style.rotate = rotation ? rotation + 'deg' : '';
        var z = (zoom && zoom !== 1) ? zoom : 1;
        var sx = (flipX ? -1 : 1) * z, sy = (flipY ? -1 : 1) * z;
        el.style.scale = (sx !== 1 || sy !== 1) ? sx + ' ' + sy : '';
    }

    var $editor = $('#theme-editor');
    var mode = $editor.data('mode') || 'new';
    var config = window.__themeEditorConfig || null;
    var editorState = {
        type: 'parallax',
        mode: 'scene',
        name: '',
        accent: '#FF6B1A',
        scene: {
            background_color: '#1c2330',
            relative_input: true,
            scalar_x: 2, scalar_y: 2,
            friction_x: 0.1, friction_y: 0.1,
            invert_x: true, invert_y: true
        },
        blur: { dark: 'rgba(28,35,48,0.95)', light: 'rgba(240,240,240,0.95)' },
        layer_offset: { left: 0, top: 0 },
        design_ratio: 1.778,
        layers: [],
        theme_id: null,
        forked_from: null,
        dirty: false
    };
    var selectedLayerIdx = null;
    var selectedElementIdx = null;
    var selectedChildIdx = null;
    var parallaxInstance = null;
    var idleTimer = null;
    var zenMode = false;
    var expandedLayers = {};
    var interactInstances = [];
    var parallaxPaused = false;
    var linkedWH = true;
    var aspectRatio = null;
    var undoStack = [];
    var redoStack = [];
    var MAX_UNDO = 30;

    function extractCssProps(el) {
        if (!el.css) return;
        var props = {
            'background-size': 'bgSize',
            'background-position': 'bgPosition',
            'background-repeat': 'bgRepeat',
            'opacity': 'opacity'
        };
        el.css.split(';').forEach(function (part) {
            var p = part.trim();
            if (!p) return;
            var m = p.match(/^([\\w-]+)\\s*:\\s*(.+)$/);
            if (m) {
                var key = props[m[1]];
                if (key && !el[key]) {
                    el[key] = key === 'opacity' ? parseFloat(m[2]) : m[2].trim();
                }
            }
        });
        if (el.children) {
            el.children.forEach(function (c) { extractCssProps(c); });
        }
    }

    // ── Init ──
    function init() {
        // Remove server-rendered style tags so editor's live tags win the cascade
        document.querySelectorAll('style:not([id])').forEach(function(s) {
            var t = s.textContent;
            if (t.indexOf('#scene{filter:') !== -1 || t.indexOf('.btn-primary') !== -1 || t.indexOf('--blur:') !== -1) s.remove();
        });
        var utc = document.getElementById('user-theme-css');
        if (utc) utc.remove();

        if (config) {
            Object.assign(editorState, {
                type: config.type || 'parallax',
                mode: config.mode || 'scene',
                name: config.name || '',
                accent: config.accent || '#FF6B1A',
                scene: Object.assign({}, editorState.scene, config.scene || {}),
                blur: Object.assign({}, editorState.blur, config.blur || {}),
                layer_offset: Object.assign({}, editorState.layer_offset, config.layer_offset || {}),
                design_ratio: config.design_ratio || 1.778,
                layers: (config.layers || []).map(function (l) {
                    var layer = Object.assign({ depth: 0.5, elements: [] }, l);
                    if (layer.image && (!layer.elements || !layer.elements.length)) {
                        layer.elements = [{
                            image: layer.image,
                            x: '-5%', y: '-5%',
                            width: '110%', height: '110%',
                            css: 'background-size:cover;background-position:center;border:none',
                            animation: '', animation_duration: ''
                        }];
                        delete layer.image;
                    }
                    layer.elements.forEach(function (el) { extractCssProps(el); });
                    var fe = layer.elements[0];
                    if (fe && isFullScreenElement(fe)
                        && parseFloat(fe.x) === -5 && parseFloat(fe.y) === -5
                        && parseFloat(fe.width) === 110 && parseFloat(fe.height) === 110) {
                        fe.x = '0%'; fe.y = '0%';
                        fe.width = '100%'; fe.height = '100%';
                    }
                    return layer;
                }),
                theme_id: config.theme_id || null,
                forked_from: config.forked_from || null
            });
            // Auto-expand layers that have elements
            editorState.layers.forEach(function (l, i) {
                if (l.elements && l.elements.length) expandedLayers[i] = true;
            });
        }

        var teNode = document.getElementById('theme-editor');
        var isViewOnly = teNode && teNode.dataset.mode === 'view';

        populateControls();
        renderLayerTree();
        renderScene();
        showPropsFor(null);
        if (!isViewOnly) {
            bindEvents();
            bindKeyboard();
            bindDragDrop();
            bindBeforeUnload();
            resetIdleTimer();
        } else {
            $('#te-parallax-toggle').on('click', function () {
                if (parallaxPaused) resumeParallax(); else pauseParallax();
            });
            $('#te-zen-btn').on('click', function () { toggleZen(true); });
            $('#te-zen-exit').on('click', function () { toggleZen(false); });
            $('#te-exit-btn').on('click', function () { window.history.back(); });
            // Read-only tree navigation (toggle on re-click)
            $(document).on('click', '.te-layer-row', function (e) {
                if ($(e.target).hasClass('te-expand-toggle')) return;
                var idx = parseInt($(this).data('idx'));
                if (selectedLayerIdx === idx && selectedElementIdx === null) {
                    selectedLayerIdx = null; highlightDepth(null); renderLayerTree(); showPropsFor(null);
                } else { selectLayer(idx); }
            });
            $(document).on('click', '.te-child-row[data-el-idx]:not(.te-grandchild-row)', function () {
                var li = parseInt($(this).data('layer-idx'));
                var ei = parseInt($(this).data('el-idx'));
                if (selectedLayerIdx === li && selectedElementIdx === ei && selectedChildIdx === null) {
                    selectedElementIdx = null; highlightDepth(null); renderLayerTree();
                    showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
                } else { selectElement(li, ei); }
            });
            $(document).on('click', '.te-grandchild-row[data-child-idx]', function () {
                var li = parseInt($(this).data('layer-idx'));
                var ei = parseInt($(this).data('el-idx'));
                var ci = parseInt($(this).data('child-idx'));
                if (selectedLayerIdx === li && selectedElementIdx === ei && selectedChildIdx === ci) {
                    selectedChildIdx = null; renderLayerTree();
                    showPropsFor('element');
                } else { selectChild(li, ei, ci); }
            });
            $(document).on('click', '.te-expand-toggle', function (e) {
                e.stopPropagation();
                expandedLayers[parseInt($(this).data('idx'))] = !expandedLayers[parseInt($(this).data('idx'))];
                renderLayerTree();
            });
            $('#te-deselect-layer, #te-deselect-element').on('click', function () {
                selectedElementIdx = null; selectedChildIdx = null;
                highlightDepth(null); renderLayerTree();
                showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
            });
            $(document).on('click', '[data-nav="scene"]', function () {
                selectedLayerIdx = null; selectedElementIdx = null; selectedChildIdx = null;
                highlightDepth(null); renderLayerTree(); showPropsFor(null);
            });
        }
        bindPanelDrag();
        observePanelResize();
        renderShortcutHints();
        restorePanelPositions();
        lastSnapshot = captureSnapshot();
        $('[data-coreui-toggle="tooltip"]').each(function () {
            if (coreui && coreui.Tooltip) new coreui.Tooltip(this, { container: 'body', trigger: 'hover' });
        });
    }

    // ── Populate controls from state ──
    function populateControls() {
        $('#te-title-input').val(editorState.name);
        $('#te-accent-color').val(editorState.accent);
        $('#te-accent-swatch').css('background', editorState.accent);
        if (editorState.accent) applyAccentLive(editorState.accent);
        $('#te-bg-color').val(editorState.scene.background_color);
        $('#te-bg-swatch').css('background', editorState.scene.background_color);
        $('#te-bg-hex').val(editorState.scene.background_color);
        $('#te-blur-dark').val(rgbaToHex(editorState.blur.dark));
        $('#te-blur-light').val(rgbaToHex(editorState.blur.light));
        applyBlurLive();
        $('#te-scalar-x').val(editorState.scene.scalar_x);
        $('#te-scalar-x-num').val(editorState.scene.scalar_x);
        $('#te-scalar-y').val(editorState.scene.scalar_y);
        $('#te-scalar-y-num').val(editorState.scene.scalar_y);
        var fricRaw = Math.round((editorState.scene.friction_x || 0.1) * 100);
        $('#te-friction').val(fricRaw);
        $('#te-friction-num').val(fricRaw);
        $('#te-invert-x').toggleClass('active', editorState.scene.invert_x !== false).attr('data-toggled', editorState.scene.invert_x !== false);
        $('#te-invert-y').toggleClass('active', editorState.scene.invert_y !== false).attr('data-toggled', editorState.scene.invert_y !== false);
        $('#te-offset-left').val(editorState.layer_offset.left);
        $('#te-offset-top').val(editorState.layer_offset.top);

        if (!editorState.scene.filter_dark) {
            editorState.scene.filter_dark = { saturate: defaultFilter.saturate, brightness: defaultFilter.brightness, contrast: defaultFilter.contrast };
        }
        if (!editorState.scene.filter_light) {
            editorState.scene.filter_light = { saturate: defaultFilter.saturate, brightness: defaultFilter.brightness, contrast: defaultFilter.contrast };
        }
        loadFilterSliders();
        applyActiveSceneFilter();

        setToggleActive('#te-type-toggle', editorState.type);

        updateLayerEmptyState();
    }

    function setToggleActive(sel, val) {
        $(sel + ' button').removeClass('active');
        $(sel + ' button[data-val="' + val + '"]').addClass('active');
    }

    function isFullScreenElement(el) {
        var isFullSize = parseFloat(el.width) >= 100 && (el.width || '').indexOf('%') !== -1
            && parseFloat(el.height) >= 100 && (el.height || '').indexOf('%') !== -1;
        if (!isFullSize) return false;
        var css = el.css || '';
        if (css.indexOf('bottom') !== -1) return false;
        if (/background-position\\s*:\\s*(?!center|50%)/.test(css)) return false;
        return true;
    }

    function buildElementDiv(el, layerIdx, elIdx) {
        var div = document.createElement('div');
        div.className = 'te-element' + (el['class'] ? ' ' + el['class'] : '');
        if (el.animation) div.classList.add('te-anim-' + el.animation);
        div.dataset.layerIdx = layerIdx;
        div.dataset.elIdx = elIdx;
        div.style.position = 'absolute';
        if (el.x && el.x !== 'auto') div.style.left = el.x;
        if (el.y && el.y !== 'auto') div.style.top = el.y;
        div.style.width = el.width || '100px';
        div.style.height = el.height || '100px';
        if (el.animation_duration) div.style.animationDuration = el.animation_duration;
        if (el.image) div.style.backgroundImage = 'url(' + el.image + ')';
        div.style.backgroundSize = el.bgSize || 'contain';
        div.style.backgroundRepeat = el.bgRepeat || 'no-repeat';
        if (el.bgPosition) div.style.backgroundPosition = el.bgPosition;
        if (el.opacity != null && el.opacity < 1) div.style.opacity = el.opacity;
        if (el.css) {
            div.style.cssText += ';' + el.css;
        }
        applyTransform(div, el.rotation, el.flipX, el.flipY, el.scale);
        return div;
    }

    // ── Apply cached viewport-sized textures to scene-mode layers ──
    function applyOptimizedTextures() {
        if (editorState.type !== 'parallax' && editorState.type !== 'static') return;
        var scene = document.getElementById('scene');
        if (!scene || !window.indexedDB) return;
        var layers = scene.querySelectorAll('[data-depth]');
        if (layers.length < 2) return;

        var targetW = Math.ceil(window.innerWidth * 1.15);
        var targetH = Math.ceil(window.innerHeight * 1.15);
        var vpBucket = Math.ceil(targetW / 200) * 200 + 'x' + Math.ceil(targetH / 200) * 200;
        var cacheKey = 'editor|' + (editorState.forked_from || editorState.theme_id || 'new') + '|' + vpBucket;

        var req = indexedDB.open('parallax_cache', 3);
        req.onupgradeneeded = function () {
            var db = req.result;
            if (!db.objectStoreNames.contains('textures')) db.createObjectStore('textures');
        };
        req.onsuccess = function () {
            var db = req.result;
            if (!db.objectStoreNames.contains('textures')) return;
            var tx = db.transaction('textures', 'readonly');
            var get = tx.objectStore('textures').get(cacheKey);
            get.onsuccess = function () {
                var data = get.result;
                if (data && data.layers) {
                    data.layers.forEach(function (cached) {
                        var el = layers[cached.idx];
                        if (el) {
                            el.style.backgroundImage = 'url(' + URL.createObjectURL(cached.blob) + ')';
                            el.style.backgroundSize = 'cover';
                        }
                    });
                    return;
                }
                // Not cached — build optimized textures
                var imgLayers = Array.from(layers);
                var cachedEntries = [];
                var done = 0;
                imgLayers.forEach(function (layer, i) {
                    var bg = getComputedStyle(layer).backgroundImage;
                    var m = bg.match(/url\\(["']?([^"']*)["']?\\)/);
                    if (!m || !m[1]) { if (++done === imgLayers.length) saveEditorCache(); return; }
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = function () {
                        var c = document.createElement('canvas');
                        c.width = targetW; c.height = targetH;
                        c.getContext('2d').drawImage(img, 0, 0, targetW, targetH);
                        c.toBlob(function (blob) {
                            if (blob) {
                                layer.style.backgroundImage = 'url(' + URL.createObjectURL(blob) + ')';
                                layer.style.backgroundSize = 'cover';
                                cachedEntries.push({ idx: i, blob: blob });
                            }
                            if (++done === imgLayers.length) saveEditorCache();
                        }, 'image/webp', 0.85);
                    };
                    img.onerror = function () { if (++done === imgLayers.length) saveEditorCache(); };
                    img.src = m[1];
                });

                function saveEditorCache() {
                    if (!cachedEntries.length) return;
                    try {
                        var wtx = db.transaction('textures', 'readwrite');
                        wtx.objectStore('textures').put({
                            origCount: imgLayers.length,
                            layers: cachedEntries
                        }, cacheKey);
                    } catch (e) {}
                }
            };
        };
    }

    // ── Render parallax scene ──
    function renderScene() {
        var scene = document.getElementById('scene');
        if (!scene) return;

        if (parallaxInstance) {
            parallaxInstance.destroy();
            parallaxInstance = null;
        }
        destroyInteract();

        scene.innerHTML = '';
        scene.style.backgroundColor = editorState.scene.background_color;

        var bgCover = document.querySelector('.bg-cover');
        if (bgCover && editorState.design_ratio) {
            bgCover.style.setProperty('--design-ratio', editorState.design_ratio);
        }

        // Inject offset as CSS !important so Parallax.js can't overwrite it
        var existingStyle = document.getElementById('te-offset-style');
        if (existingStyle) existingStyle.remove();
        var ssrOffset = document.getElementById('te-layer-offset-ssr');
        if (ssrOffset) ssrOffset.remove();
        var oL = editorState.layer_offset.left || 0;
        var oT = editorState.layer_offset.top || 0;
        if (oL || oT) {
            var style = document.createElement('style');
            style.id = 'te-offset-style';
            style.textContent = '#scene .te-element-layer{left:' + oL + 'px!important;top:' + oT + 'px!important}';
            document.head.appendChild(style);
        }

        var hasSprites = editorState.layers.some(function (l) {
            return (l.elements || []).some(function (el) {
                return el.animation || el.children && el.children.length || el.tag;
            });
        });

        if (editorState.type === 'parallax' || editorState.type === 'static') {
            editorState.layers.forEach(function (layer, i) {
                var layerDiv = document.createElement('div');
                layerDiv.setAttribute('data-depth', layer.depth);
                layerDiv.className = 'te-element-layer';
                layerDiv.style.position = 'absolute';
                layerDiv.style.width = '100%';
                layerDiv.style.height = '100%';

                (layer.elements || []).forEach(function (el, ei) {
                    var sprite = buildElementDiv(el, i, ei);
                    if (el.hidden) sprite.style.display = 'none';
                    if (el.children && el.children.length) {
                        sprite.style.position = 'relative';
                        if (el.tag === 'img' && el.image) {
                            var img = document.createElement('img');
                            img.src = el.image;
                            img.style.cssText = 'width:100%;display:block;pointer-events:none';
                            sprite.style.backgroundImage = 'none';
                            sprite.appendChild(img);
                        }
                        el.children.forEach(function (child, ci) {
                            var childDiv = buildElementDiv(child, i, ei + '.' + ci);
                            if (child.hidden || el.hidden) childDiv.style.display = 'none';
                            sprite.appendChild(childDiv);
                        });
                    }
                    if (selectedLayerIdx === i && selectedElementIdx === ei) {
                        sprite.classList.add('selected');
                        addHandles(sprite);
                    }
                    layerDiv.appendChild(sprite);
                });
                scene.appendChild(layerDiv);
            });
        }

        scene.setAttribute('data-relative-input', editorState.scene.relative_input ? 'true' : 'false');
        scene.classList.add('te-no-filter');
        applyActiveSceneFilter();

        if (editorState.type === 'parallax' && scene.children.length > 0) {
            try {
                parallaxInstance = new Parallax(scene, {
                    scalarX: editorState.scene.scalar_x || 10,
                    scalarY: editorState.scene.scalar_y || 10,
                    relativeInput: editorState.scene.relative_input !== false,
                    pointerEvents: true
                });
                parallaxInstance.friction(
                    editorState.scene.friction_x || 0.1,
                    editorState.scene.friction_y || 0.1
                );
                if (editorState.scene.invert_x === false || editorState.scene.invert_y === false) {
                    parallaxInstance.invert(
                        editorState.scene.invert_x !== false,
                        editorState.scene.invert_y !== false
                    );
                }
                if (hasSprites) {
                    parallaxInstance.disable();
                    parallaxPaused = true;
                    updateParallaxButton();
                }
            } catch (e) {
                console.warn('Parallax init failed:', e);
            }
        }

        updateMiniPreview();
        var teNode = document.getElementById('theme-editor');
        if (!teNode || teNode.dataset.mode !== 'view') {
            bindSpriteInteractions();
        } else {
            applyOptimizedTextures();
        }
    }

    var sceneRebuildTimer = null;
    function debouncedRenderScene() {
        clearTimeout(sceneRebuildTimer);
        sceneRebuildTimer = setTimeout(renderScene, 200);
    }

    // ── Update element DOM in-place without rebuilding scene ──
    function updateElementInPlace(target) {
        if (!target || selectedLayerIdx === null || selectedElementIdx === null) return;
        var elIdxStr = selectedChildIdx !== null
            ? selectedElementIdx + '.' + selectedChildIdx
            : String(selectedElementIdx);
        var $el = $('#scene .te-element[data-layer-idx="' + selectedLayerIdx + '"][data-el-idx="' + elIdxStr + '"]');
        if (!$el.length) { debouncedRenderScene(); return; }

        var el = $el[0];
        if (target.x && target.x !== 'auto') { el.style.left = target.x; el.style.right = 'auto'; }
        if (target.y && target.y !== 'auto') { el.style.top = target.y; el.style.bottom = 'auto'; }
        if (target.width) el.style.width = target.width;
        if (target.height) el.style.height = target.height;
        if (target.animation_duration) el.style.animationDuration = target.animation_duration;

        // Update animation class
        el.className = el.className.replace(/\\bte-anim-\\S+/g, '');
        if (target.animation) el.classList.add('te-anim-' + target.animation);

        applyTransform(el, target.rotation, target.flipX, target.flipY, target.scale);
        el.style.opacity = (target.opacity != null && target.opacity < 1) ? target.opacity : '';
        el.style.backgroundSize = target.bgSize || 'contain';
        el.style.backgroundPosition = target.bgPosition || '';
        el.style.backgroundRepeat = target.bgRepeat || 'no-repeat';

        updateCoordsReadout($el);
    }

    // ── Update parallax params without rebuild ──
    function updateParallaxParams() {
        if (!parallaxInstance) return;
        try {
            parallaxInstance.scalar(editorState.scene.scalar_x, editorState.scene.scalar_y);
            parallaxInstance.friction(editorState.scene.friction_x, editorState.scene.friction_y);
            parallaxInstance.invert(
                editorState.scene.invert_x !== false,
                editorState.scene.invert_y !== false
            );
        } catch (e) {}
    }

    // ── Mini preview ──
    function updateMiniPreview() {
        var mp = document.getElementById('te-mini-preview');
        if (!mp) return;
        mp.style.background = editorState.scene.background_color;
    }

    function disposeDynamicTooltips() {
        if (!coreui || !coreui.Tooltip) return;
        $('#te-layer-tree [data-coreui-toggle="tooltip"]').each(function () {
            var existing = coreui.Tooltip.getInstance(this);
            if (existing) existing.dispose();
        });
        document.querySelectorAll('body > .tooltip').forEach(function (t) { t.remove(); });
    }

    function refreshDynamicTooltips() {
        if (!coreui || !coreui.Tooltip) return;
        $('#te-layer-tree [data-coreui-toggle="tooltip"]').each(function () {
            new coreui.Tooltip(this, { container: 'body', trigger: 'hover' });
        });
    }

    // ── Layer tree ──
    function renderLayerTree(scrollToSelected) {
        var $tree = $('#te-layer-tree');
        disposeDynamicTooltips();
        $tree.empty();

        editorState.layers.forEach(function (layer, i) {
            var isSelected = selectedLayerIdx === i && selectedElementIdx === null && selectedChildIdx === null;
            var hasElements = layer.elements && layer.elements.length > 0;
            var isExpanded = !!expandedLayers[i];
            var firstElImg = '';
            if (hasElements && layer.elements[0].image) {
                var isBg = isFullScreenElement(layer.elements[0]);
                firstElImg = 'url(' + layer.elements[0].image + ') center/' + (isBg ? 'cover' : 'contain') + ' no-repeat';
            }
            var thumbBg = firstElImg || 'linear-gradient(135deg,#3a4459,#1c2330)';
            var elCount = 0;
            (layer.elements || []).forEach(function(e) { elCount += 1 + (e.children ? e.children.length : 0); });

            var arrowChar = isExpanded ? '▾' : '▸';
            var hiddenClass = layer.hidden ? ' te-layer-hidden' : '';
            var lockedClass = layer.locked ? ' te-layer-locked' : '';
            var eyeIcon = layer.hidden ? '◻' : '◼';
            var lockIcon = layer.locked ? '🔒' : '🔓';
            var $row = $('<div class="te-layer-row' + (isSelected ? ' selected' : '') + hiddenClass + lockedClass + '" data-idx="' + i + '">' +
                '<span class="te-grip te-expand-toggle" data-idx="' + i + '" title="Expand/collapse" data-coreui-toggle="tooltip">' + arrowChar + '</span>' +
                '<span class="te-layer-idx">' + (i + 1) + '</span>' +
                '<span class="te-layer-thumb" style="background:' + thumbBg + '"></span>' +
                '<span class="te-layer-name">' + (layer.name || ('Layer ' + (i + 1))) + ' · <abbr title="Parallax motion depth">' + layer.depth + '</abbr></span>' +
                (elCount ? '<span class="te-layer-count">' + elCount + '</span>' : '') +
                '<span class="te-layer-eye' + (layer.hidden ? ' active' : '') + '" data-idx="' + i + '" title="Toggle visibility" data-coreui-toggle="tooltip">' + eyeIcon + '</span>' +
                '<span class="te-layer-lock' + (layer.locked ? ' active' : '') + '" data-idx="' + i + '" title="Toggle lock" data-coreui-toggle="tooltip">' + lockIcon + '</span>' +
                '</div>');
            $tree.append($row);

            if (isExpanded) {
                var $rail = $('<div class="te-child-rail" data-layer-idx="' + i + '"></div>');
                if (hasElements) {
                    layer.elements.forEach(function (el, ei) {
                        var isElSel = selectedLayerIdx === i && selectedElementIdx === ei && selectedChildIdx === null;
                        var isBgEl = isFullScreenElement(el);
                        var elName = isBgEl ? 'BG' : (el.image ? el.image.split('/').pop().split('_').pop() : 'element');
                        var thumbStyle = el.image ? 'background:url(' + el.image + ') center/contain no-repeat' : '';
                        var hasChildren = el.children && el.children.length > 0;
                        var isContainer = hasChildren || el.tag === 'img';
                        var containerBadge = isContainer ? '<span class="te-container-badge">⊞</span>' : '';
                        var childCountLabel = hasChildren ? ' <span class="te-layer-count">' + el.children.length + '</span>' : '';
                        var animLabel = el.animation || 'none';
                        var elHiddenClass = el.hidden ? ' te-layer-hidden' : '';
                        var elEyeIcon = el.hidden ? '◻' : '◼';
                        var $child = $('<div class="te-child-row' + (isElSel ? ' selected' : '') + (isContainer ? ' te-is-container' : '') + elHiddenClass + '" data-layer-idx="' + i + '" data-el-idx="' + ei + '">' +
                            '<span class="te-el-thumb" style="' + thumbStyle + '"></span>' +
                            containerBadge +
                            '<span class="te-el-name">' + truncate(elName, 12) + '</span>' +
                            '<span class="te-hint" style="flex:1">' + animLabel + childCountLabel + '</span>' +
                            '<span class="te-el-eye' + (el.hidden ? ' active' : '') + '" data-layer-idx="' + i + '" data-el-idx="' + ei + '" title="Toggle visibility" data-coreui-toggle="tooltip">' + elEyeIcon + '</span>' +
                            '</div>');
                        $rail.append($child);

                        // Render grandchildren + add-child row
                        var showGrandRail = hasChildren || isElSel;
                        if (showGrandRail) {
                            var $grandRail = $('<div class="te-grandchild-rail" data-layer-idx="' + i + '" data-el-idx="' + ei + '"></div>');
                            if (hasChildren) {
                                var $railHint = $('<div class="te-grandchild-hint">positioned relative to ' + truncate(elName, 10) + '</div>');
                                $grandRail.append($railHint);
                                el.children.forEach(function (child, ci) {
                                    var isChildSel = selectedLayerIdx === i && selectedElementIdx === ei && selectedChildIdx === ci;
                                    var childName = child.image ? child.image.split('/').pop().split('_').pop() : 'child';
                                    var childThumb = child.image ? 'background:url(' + child.image + ') center/contain no-repeat' : '';
                                    var childAnim = child.animation || 'none';
                                    var gcHiddenClass = child.hidden ? ' te-layer-hidden' : '';
                                    var gcEyeIcon = child.hidden ? '◻' : '◼';
                                    var $gc = $('<div class="te-child-row te-grandchild-row' + (isChildSel ? ' selected' : '') + gcHiddenClass + '" data-layer-idx="' + i + '" data-el-idx="' + ei + '" data-child-idx="' + ci + '">' +
                                        '<span class="te-el-thumb" style="' + childThumb + '"></span>' +
                                        '<span class="te-el-name">' + truncate(childName, 12) + '</span>' +
                                        '<span class="te-hint" style="flex:1">' + childAnim + '</span>' +
                                        '<span class="te-el-eye' + (child.hidden ? ' active' : '') + '" data-layer-idx="' + i + '" data-el-idx="' + ei + '" data-child-idx="' + ci + '" title="Toggle visibility" data-coreui-toggle="tooltip">' + gcEyeIcon + '</span>' +
                                        '</div>');
                                    $grandRail.append($gc);
                                });
                            }
                            var $addChild = $('<div class="te-child-row te-add-element-row te-grandchild-row">' +
                                '<span class="te-hint te-add-upload" data-action="upload-child" data-layer-idx="' + i + '" data-el-idx="' + ei + '">⬆ upload</span>' +
                                '<span class="te-add-sep">&middot;</span>' +
                                '<span class="te-hint te-add-pick" data-action="pick-child" data-layer-idx="' + i + '" data-el-idx="' + ei + '">◫ assets</span></div>');
                            $grandRail.append($addChild);
                            $rail.append($grandRail);
                        }
                    });
                }
                if (selectedLayerIdx === i) {
                    var $addEl = $('<div class="te-child-row te-add-element-row">' +
                        '<span class="te-hint te-add-upload" data-action="upload-element" data-layer-idx="' + i + '">⬆ upload</span>' +
                        '<span class="te-add-sep">&middot;</span>' +
                        '<span class="te-hint te-add-pick" data-action="pick-element" data-layer-idx="' + i + '">◫ assets</span></div>');
                    $rail.append($addEl);
                }
                $tree.append($rail);
            }
        });

        var $addLayer = $('<div class="te-child-row te-add-element-row te-add-layer-inline">' +
            '<span class="te-hint te-add-upload" data-action="upload-layer">⬆ upload layer</span>' +
            '<span class="te-add-sep">&middot;</span>' +
            '<span class="te-hint te-add-pick" data-action="pick-layer">◫ assets</span></div>');
        $tree.append($addLayer);

        updateLayerEmptyState();
        initSortable();
        refreshDynamicTooltips();

        if (scrollToSelected) {
            setTimeout(function () {
                var $sel = $('#te-layer-tree .selected');
                if ($sel.length) {
                    var panel = document.getElementById('te-layer-panel');
                    if (panel) {
                        var selTop = $sel[0].offsetTop;
                        var selH = $sel[0].offsetHeight;
                        var visTop = panel.scrollTop;
                        var visBottom = visTop + panel.clientHeight;
                        if (selTop < visTop || selTop + selH > visBottom) {
                            panel.scrollTop = Math.max(0, selTop - panel.clientHeight / 3);
                        }
                    }
                }
            }, 0);
        }
    }

    function updateLayerEmptyState() {
        var empty = editorState.layers.length === 0;
        $('#te-layer-empty').toggle(empty);
        $('#te-layer-tree').toggle(!empty);
    }

    // ── SortableJS ──
    function initSortable() {
        var el = document.getElementById('te-layer-tree');
        if (!el || !window.Sortable) return;
        Sortable.create(el, {
            handle: '.te-layer-idx',
            animation: 150,
            ghostClass: 'te-sortable-ghost',
            filter: '.te-child-rail, .te-child-row',
            onEnd: function (evt) {
                var from = evt.oldIndex;
                var to = evt.newIndex;
                if (from === to) return;
                var moved = editorState.layers.splice(from, 1)[0];
                editorState.layers.splice(to, 0, moved);
                if (selectedLayerIdx === from) selectedLayerIdx = to;
                else if (selectedLayerIdx !== null) {
                    if (from < selectedLayerIdx && to >= selectedLayerIdx) selectedLayerIdx--;
                    else if (from > selectedLayerIdx && to <= selectedLayerIdx) selectedLayerIdx++;
                }
                markDirty();
                renderLayerTree();
                debouncedRenderScene();
            }
        });
    }

    function moveLayer(fromIdx, dir) {
        var toIdx = fromIdx + dir;
        if (toIdx < 0 || toIdx >= editorState.layers.length) return;
        var moved = editorState.layers.splice(fromIdx, 1)[0];
        editorState.layers.splice(toIdx, 0, moved);
        var expFrom = !!expandedLayers[fromIdx];
        var expTo = !!expandedLayers[toIdx];
        expandedLayers[toIdx] = expFrom;
        expandedLayers[fromIdx + dir] = expTo;
        if (selectedLayerIdx === fromIdx) selectedLayerIdx = toIdx;
        markDirty();
        renderLayerTree();
        debouncedRenderScene();
    }

    function duplicateSelected() {
        if (selectedLayerIdx === null) return;
        if (selectedElementIdx !== null) {
            var layer = editorState.layers[selectedLayerIdx];
            if (selectedChildIdx !== null) {
                var parent = layer.elements[selectedElementIdx];
                var child = JSON.parse(JSON.stringify(parent.children[selectedChildIdx]));
                child.x = (parseFloat(child.x) + 3) + '%';
                child.y = (parseFloat(child.y) + 3) + '%';
                parent.children.splice(selectedChildIdx + 1, 0, child);
                selectChild(selectedLayerIdx, selectedElementIdx, selectedChildIdx + 1);
            } else {
                var el = JSON.parse(JSON.stringify(layer.elements[selectedElementIdx]));
                el.x = (parseFloat(el.x) + 3) + '%';
                el.y = (parseFloat(el.y) + 3) + '%';
                layer.elements.splice(selectedElementIdx + 1, 0, el);
                selectElement(selectedLayerIdx, selectedElementIdx + 1);
            }
        } else {
            var layer = JSON.parse(JSON.stringify(editorState.layers[selectedLayerIdx]));
            layer.name = (layer.name || 'Layer') + ' copy';
            editorState.layers.splice(selectedLayerIdx + 1, 0, layer);
            expandedLayers[selectedLayerIdx + 1] = true;
            selectLayer(selectedLayerIdx + 1);
        }
        markDirty();
        renderLayerTree(true);
        debouncedRenderScene();
    }

    // ── Properties panel ──
    function getSelectedTarget() {
        if (selectedLayerIdx === null || selectedElementIdx === null) return null;
        var el = editorState.layers[selectedLayerIdx] && editorState.layers[selectedLayerIdx].elements
            ? editorState.layers[selectedLayerIdx].elements[selectedElementIdx] : null;
        if (!el) return null;
        if (selectedChildIdx !== null && el.children && el.children[selectedChildIdx]) {
            return el.children[selectedChildIdx];
        }
        return el;
    }

    function updateBreadcrumb() {
        var $bc = $('#te-breadcrumb');
        var parts = ['<span class="te-bc-item" data-nav="scene">Scene</span>'];
        if (selectedLayerIdx !== null) {
            var layerName = editorState.layers[selectedLayerIdx].name || 'Layer ' + (selectedLayerIdx + 1);
            parts.push('<span class="te-bc-sep">▸</span>');
            parts.push('<span class="te-bc-item" data-nav="layer">' + layerName + '</span>');
        }
        if (selectedElementIdx !== null) {
            var el = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            var elName = el && el.image ? el.image.split('/').pop().split('_').pop() : 'element';
            parts.push('<span class="te-bc-sep">▸</span>');
            parts.push('<span class="te-bc-item" data-nav="element">' + elName + '</span>');
        }
        if (selectedChildIdx !== null) {
            var parent = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            var child = parent && parent.children ? parent.children[selectedChildIdx] : null;
            var childName = child && child.image ? child.image.split('/').pop().split('_').pop() : 'child';
            parts.push('<span class="te-bc-sep">▸</span>');
            parts.push('<span class="te-bc-item" data-nav="child">' + childName + '</span>');
        }
        // Mark last item as active
        $bc.html(parts.join(''));
        $bc.find('.te-bc-item').last().addClass('te-bc-active');
    }

    function updateRibbon() {
        var hasSelection = selectedLayerIdx !== null;
        $('#te-action-ribbon').toggle(hasSelection);
        var isElement = selectedElementIdx !== null;
        $('#te-rb-center').toggle(isElement);
    }

    function showPropsFor(what) {
        $('#te-scene-props').hide();
        $('#te-layer-props').hide();
        $('#te-element-props').hide();
        $('#te-coords').hide();
        updateBreadcrumb();
        updateRibbon();

        if (what === null) {
            $('#te-scene-props').show();
        } else if (what === 'layer' && selectedLayerIdx !== null) {
            var layer = editorState.layers[selectedLayerIdx];
            if (!layer) return showPropsFor(null);
            $('#te-layer-props').show();
            $('#te-layer-props-title').text((layer.name || 'Layer ' + (selectedLayerIdx + 1)));
            $('#te-layer-depth').val(Math.round(layer.depth * 100));
            $('#te-layer-depth-val').text(layer.depth.toFixed(2));
        } else if ((what === 'element' || what === 'child') && selectedLayerIdx !== null && selectedElementIdx !== null) {
            var target = getSelectedTarget();
            if (!target) return showPropsFor(null);
            $('#te-element-props').show();
            $('#te-coords').show();
            var targetName = target.image ? target.image.split('/').pop() : 'element';
            var layerName = editorState.layers[selectedLayerIdx].name || 'Layer ' + (selectedLayerIdx + 1);
            var parentEl = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            if (selectedChildIdx !== null) {
                var parentName = parentEl.image ? parentEl.image.split('/').pop().split('_').pop() : 'element';
                $('#te-element-props-title').text(targetName + ' · child of ' + parentName);
            } else {
                $('#te-element-props-title').text(targetName + ' · in ' + layerName);
            }
            $('#te-el-x').val(target.x || '50%');
            $('#te-el-y').val(target.y || '50%');
            $('#te-el-w').val(target.width || '100px');
            $('#te-el-h').val(target.height || '100px');
            var _w = parseFloat(target.width), _h = parseFloat(target.height);
            aspectRatio = (_w && _h) ? _w / _h : null;
            $('#te-el-duration').val(parseInt(target.animation_duration) || 4);
            $('#te-el-duration-val').text((parseInt(target.animation_duration) || 4) + 's');
            var scaleVal = target.scale || 1;
            var scaleInt = Math.round(scaleVal * 100);
            $('#te-el-scale').val(scaleInt);
            $('#te-el-scale-num').val(scaleInt);
            var rotVal = parseFloat(target.rotation) || 0;
            $('#te-el-rotate').val(Math.round(rotVal));
            $('#te-el-rotate-num').val(Math.round(rotVal));
            $('#te-el-flipx').toggleClass('active', !!target.flipX);
            $('#te-el-flipy').toggleClass('active', !!target.flipY);
            var opVal = target.opacity != null ? Math.round(target.opacity * 100) : 100;
            $('#te-el-opacity').val(opVal);
            $('#te-el-opacity-num').val(opVal);
            var bgSize = target.bgSize || 'contain';
            if (['contain', 'cover'].indexOf(bgSize) === -1) {
                $('#te-el-bgsize').val('custom');
                $('#te-el-bgsize-custom').show().val(bgSize);
            } else {
                $('#te-el-bgsize').val(bgSize);
                $('#te-el-bgsize-custom').hide();
            }
            var bgPos = target.bgPosition || '';
            var bgPosOpts = ['', 'center', 'top center', 'bottom center', 'left center', 'right center'];
            if (bgPos && bgPosOpts.indexOf(bgPos) === -1) {
                $('#te-el-bgpos').val('custom');
                $('#te-el-bgpos-custom').show().val(bgPos);
            } else {
                $('#te-el-bgpos').val(bgPos);
                $('#te-el-bgpos-custom').hide();
            }
            $('#te-el-bgrepeat').val(target.bgRepeat || 'no-repeat');
            $('#te-anim-chips .te-chip').removeClass('active');
            $('#te-anim-chips .te-chip[data-anim="' + (target.animation || '') + '"]').addClass('active');

            // Container section + add child — only for elements (not children)
            if (selectedChildIdx === null) {
                var hasChildren = parentEl.children && parentEl.children.length > 0;
                var isTagImg = parentEl.tag === 'img';
                $('#te-container-section').show();
                $('#te-add-child-btn').show();
                $('#te-container-toggle').prop('checked', hasChildren || isTagImg);
                $('#te-container-img-toggle').prop('checked', isTagImg);
                $('#te-container-child-count').text(hasChildren ? parentEl.children.length + ' children' : 'no children');
                $('#te-container-opts').toggle(hasChildren || isTagImg);
            } else {
                $('#te-container-section').hide();
                $('#te-add-child-btn').hide();
            }

            // Prev/next navigation visibility
            var layer = editorState.layers[selectedLayerIdx];
            $('#te-nav-parent').toggle(selectedChildIdx !== null);
            if (selectedChildIdx !== null) {
                var siblings = layer.elements[selectedElementIdx].children || [];
                $('#te-nav-prev').prop('disabled', selectedChildIdx <= 0);
                $('#te-nav-next').prop('disabled', selectedChildIdx >= siblings.length - 1);
            } else {
                var siblings = layer.elements || [];
                $('#te-nav-prev').prop('disabled', selectedElementIdx <= 0);
                $('#te-nav-next').prop('disabled', selectedElementIdx >= siblings.length - 1);
            }
        }
    }

    // ── interact.js — drag + resize for element-mode sprites ──
    function destroyInteract() {
        interactInstances.forEach(function (inst) {
            try { inst.unset(); } catch (e) {}
        });
        interactInstances = [];
    }

    function findSceneElementAt(x, y) {
        var elements = document.querySelectorAll('#scene .te-element');
        var found = null;
        for (var i = elements.length - 1; i >= 0; i--) {
            var rect = elements[i].getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                var li = parseInt(elements[i].dataset.layerIdx);
                if (!isNaN(li) && editorState.layers[li] && editorState.layers[li].locked) continue;
                found = elements[i];
                break;
            }
        }
        return found;
    }

    function bindSpriteInteractions() {
        var anyElements = editorState.layers.some(function (l) { return l.elements && l.elements.length > 0; });
        if (!anyElements) return;

        // Unified interaction handler: click on canvas to select/deselect/drag
        $(document).off('mousedown.tecanvas').on('mousedown.tecanvas', function (e) {
            if (!e.target || !e.target.closest) return;
            var $t = $(e.target);

            // Ignore clicks on editor panels, buttons, inputs
            if ($t.closest('.te-panel, .te-topbar, .te-bottombar, .te-coords, .te-btn, .te-chip, .te-seg, .te-expand-toggle, .te-drop-overlay, .te-3d-overlay, .te-zen-exit, .modal, .modal-backdrop, input, label, select').length) return;

            // If an element is already selected, check handles first, then bounds
            var currentSelected = document.querySelector('#scene .te-element.selected');
            var teEl = null;
            if (currentSelected) {
                // Check handle hit first (handles extend beyond element bounds)
                var earlyHandle = hitTestHandle(e.clientX, e.clientY);
                if (earlyHandle) {
                    teEl = currentSelected;
                } else {
                    var selRect = currentSelected.getBoundingClientRect();
                    var handleMargin = 10;
                    if (e.clientX >= selRect.left - handleMargin && e.clientX <= selRect.right + handleMargin &&
                        e.clientY >= selRect.top - handleMargin && e.clientY <= selRect.bottom + handleMargin) {
                        teEl = currentSelected;
                    }
                }
            }
            if (!teEl) teEl = findSceneElementAt(e.clientX, e.clientY);

            if (teEl) {
                e.preventDefault();
                // Check if clicking a resize/rotate handle on already-selected element
                var handlePos = teEl.classList.contains('selected') ? hitTestHandle(e.clientX, e.clientY) : null;
                if (handlePos) {
                    if (handlePos === 'rotate') {
                        startCanvasRotate(e, teEl);
                    } else {
                        startCanvasResize(e, teEl, handlePos);
                    }
                    return;
                }
                // Only re-select if clicking a different element
                var li = parseInt(teEl.dataset.layerIdx);
                var eiStr = teEl.dataset.elIdx;
                var alreadySelected = teEl.classList.contains('selected');
                if (!alreadySelected) {
                    if (eiStr && eiStr.indexOf('.') !== -1) {
                        var parts = eiStr.split('.');
                        selectChild(li, parseInt(parts[0]), parseInt(parts[1]), true);
                    } else {
                        var ei = parseInt(eiStr);
                        if (!isNaN(li) && !isNaN(ei)) selectElement(li, ei, true);
                    }
                }
                startCanvasDrag(e, teEl);
            } else {
                // Clicked empty canvas → deselect
                if (selectedElementIdx !== null || selectedChildIdx !== null) {
                    selectedElementIdx = null;
                    selectedChildIdx = null;
                    highlightDepth(null);
                    renderLayerTree();
                    showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
                    $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
                }
            }
        });

        $(document).off('mousemove.tecursor').on('mousemove.tecursor', function (e) {
            var selected = document.querySelector('#scene .te-element.selected');
            if (!selected) { document.body.style.cursor = ''; return; }
            var handle = hitTestHandle(e.clientX, e.clientY);
            document.body.style.cursor = handle ? HANDLE_CURSORS[handle] || '' : '';
        });

    }

    var SNAP_PCT = 1;

    function snapPct(val) {
        return Math.round(val / SNAP_PCT) * SNAP_PCT;
    }

    function resolveStartPct(target, teEl, parentW, parentH) {
        var x = target ? parseFloat(target.x) : NaN;
        var y = target ? parseFloat(target.y) : NaN;
        if (isNaN(x) || (target && (target.x === 'auto' || !target.x))) {
            var cs = getComputedStyle(teEl);
            var ml = parseFloat(cs.marginLeft) || 0;
            x = ((teEl.offsetLeft - ml) / parentW) * 100;
        }
        if (isNaN(y) || (target && (target.y === 'auto' || !target.y))) {
            var cs2 = getComputedStyle(teEl);
            var mt = parseFloat(cs2.marginTop) || 0;
            y = ((teEl.offsetTop - mt) / parentH) * 100;
        }
        return { x: x, y: y };
    }

    function stripPositionConflicts(target) {
        if (!target || !target.css) return;
        target.css = target.css
            .replace(/\\bbottom\\s*:\\s*[^;]+;?/g, '')
            .replace(/\\bright\\s*:\\s*[^;]+;?/g, '')
            .replace(/;+/g, ';').replace(/^;|;$/g, '').trim();
    }

    function startCanvasDrag(e, teEl) {
        var $s = $(teEl);
        var startX = e.clientX, startY = e.clientY;
        var moved = false;
        var parentEl = teEl.parentNode;
        var parentW = parentEl ? parentEl.offsetWidth : window.innerWidth;
        var parentH = parentEl ? parentEl.offsetHeight : window.innerHeight;
        var target = getSelectedTarget();
        var resolved = resolveStartPct(target, teEl, parentW, parentH);
        var startPctX = resolved.x;
        var startPctY = resolved.y;

        function onMove(ev) {
            var dx = ev.clientX - startX;
            var dy = ev.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
            if (!moved) return;
            if (!teEl.classList.contains('te-dragging')) {
                teEl.dataset.origAnim = teEl.style.animation || '';
                teEl.style.animation = 'none';
                teEl.classList.add('te-dragging');
            }
            var newPctX = startPctX + (dx / parentW * 100);
            var newPctY = startPctY + (dy / parentH * 100);
            teEl.style.left = newPctX.toFixed(1) + '%';
            teEl.style.top = newPctY.toFixed(1) + '%';
            teEl.style.bottom = 'auto';
            teEl.style.right = 'auto';
            updateCoordsReadout($s);
        }
        function onUp(ev) {
            $(document).off('mousemove.tedrag mouseup.tedrag');
            if (!moved) return;
            var dx = ev.clientX - startX;
            var dy = ev.clientY - startY;
            var pctX = startPctX + (dx / parentW * 100);
            var pctY = startPctY + (dy / parentH * 100);
            // Clamp to safe bounds so elements stay findable
            pctX = Math.max(-20, Math.min(90, pctX));
            pctY = Math.max(-20, Math.min(90, pctY));
            if (!ev.shiftKey) {
                pctX = snapPct(pctX);
                pctY = snapPct(pctY);
            } else {
                pctX = parseFloat(pctX.toFixed(1));
                pctY = parseFloat(pctY.toFixed(1));
            }
            teEl.style.left = pctX + '%';
            teEl.style.top = pctY + '%';
            teEl.style.bottom = 'auto';
            teEl.style.right = 'auto';
            teEl.style.animation = teEl.dataset.origAnim || '';
            delete teEl.dataset.origAnim;
            teEl.classList.remove('te-dragging');
            var target = getSelectedTarget();
            if (target) {
                target.x = pctX + '%';
                target.y = pctY + '%';
                stripPositionConflicts(target);
                markDirty();
                showPropsFor(selectedChildIdx !== null ? 'child' : 'element');
            }
        }
        $(document).on('mousemove.tedrag', onMove).on('mouseup.tedrag', onUp);
    }

    function addHandles($sprite) {
        var el = $sprite.appendChild ? $sprite : $sprite[0];
        ['tl', 'tr', 'bl', 'br', 't', 'b', 'l', 'r', 'rotate'].forEach(function (pos) {
            var h = document.createElement('span');
            h.className = 'te-handle ' + pos;
            h.dataset.handle = pos;
            el.appendChild(h);
        });
    }

    var HANDLE_CURSORS = {
        tl: 'nwse-resize', tr: 'nesw-resize', bl: 'nesw-resize', br: 'nwse-resize',
        t: 'ns-resize', b: 'ns-resize', l: 'ew-resize', r: 'ew-resize',
        rotate: 'grab'
    };

    function hitTestHandle(mx, my) {
        var handles = document.querySelectorAll('#scene .te-handle');
        var hitRadius = 10;
        for (var i = 0; i < handles.length; i++) {
            var r = handles[i].getBoundingClientRect();
            var cx = r.left + r.width / 2;
            var cy = r.top + r.height / 2;
            if (Math.abs(mx - cx) <= hitRadius && Math.abs(my - cy) <= hitRadius) {
                return handles[i].dataset.handle;
            }
        }
        return null;
    }

    function startCanvasResize(e, teEl, handle) {
        var target = getSelectedTarget();
        if (!target) return;
        var startX = e.clientX, startY = e.clientY;
        var parentEl = teEl.parentNode;
        var parentW = parentEl ? parentEl.offsetWidth : window.innerWidth;
        var parentH = parentEl ? parentEl.offsetHeight : window.innerHeight;

        var startW = parseFloat(target.width) || 0;
        var startH = parseFloat(target.height) || 0;
        var resolved = resolveStartPct(target, teEl, parentW, parentH);
        var startElX = resolved.x;
        var startElY = resolved.y;
        var wUnit = (target.width || '').toString().indexOf('%') !== -1 ? '%' : 'px';
        var hUnit = (target.height || '').toString().indexOf('%') !== -1 ? '%' : 'px';
        var xResolved = !target.x || target.x === 'auto' || isNaN(parseFloat(target.x));
        var yResolved = !target.y || target.y === 'auto' || isNaN(parseFloat(target.y));
        var xUnit = xResolved ? '%' : ((target.x || '').toString().indexOf('%') !== -1 ? '%' : 'px');
        var yUnit = yResolved ? '%' : ((target.y || '').toString().indexOf('%') !== -1 ? '%' : 'px');

        var resizesLeft = handle.indexOf('l') !== -1;
        var resizesRight = handle.indexOf('r') !== -1 || handle === 'tr' || handle === 'br';
        var resizesTop = handle.indexOf('t') !== -1;
        var resizesBottom = handle.indexOf('b') !== -1 || handle === 'bl' || handle === 'br';
        var isCorner = handle.length === 2;

        function toDelta(px, total, unit) {
            return unit === '%' ? (px / total * 100) : px;
        }

        function onMove(ev) {
            var dx = ev.clientX - startX;
            var dy = ev.clientY - startY;
            var dw = 0, dh = 0, dex = 0, dey = 0;

            if (resizesRight) dw = toDelta(dx, parentW, wUnit);
            if (resizesLeft) { dw = toDelta(-dx, parentW, wUnit); dex = toDelta(dx, parentW, xUnit); }
            if (resizesBottom) dh = toDelta(dy, parentH, hUnit);
            if (resizesTop) { dh = toDelta(-dy, parentH, hUnit); dey = toDelta(dy, parentH, yUnit); }

            var newW = Math.max(1, startW + dw);
            var newH = Math.max(1, startH + dh);

            if (isCorner && linkedWH && aspectRatio) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    newH = newW / aspectRatio;
                    if (resizesTop) dey = toDelta(-(newH - startH), parentH, yUnit) * (resizesLeft ? -1 : 1);
                    if (resizesTop) dey = startH - newH > 0 ? toDelta(startH - newH, parentH, yUnit) : toDelta(-(newH - startH), parentH, yUnit);
                } else {
                    newW = newH * aspectRatio;
                    if (resizesLeft) dex = startW - newW > 0 ? toDelta(startW - newW, parentW, xUnit) : toDelta(-(newW - startW), parentW, xUnit);
                }
            }

            var finalX = resizesLeft ? startElX + dex : startElX;
            var finalY = resizesTop ? startElY + dey : startElY;

            teEl.style.width = newW.toFixed(1) + wUnit;
            teEl.style.height = newH.toFixed(1) + hUnit;
            if (resizesLeft) teEl.style.left = finalX.toFixed(1) + xUnit;
            if (resizesTop) teEl.style.top = finalY.toFixed(1) + yUnit;
            updateCoordsReadout($(teEl));
        }

        function onUp(ev) {
            $(document).off('mousemove.teresize mouseup.teresize');
            var dx = ev.clientX - startX;
            var dy = ev.clientY - startY;
            var dw = 0, dh = 0, dex = 0, dey = 0;

            if (resizesRight) dw = toDelta(dx, parentW, wUnit);
            if (resizesLeft) { dw = toDelta(-dx, parentW, wUnit); dex = toDelta(dx, parentW, xUnit); }
            if (resizesBottom) dh = toDelta(dy, parentH, hUnit);
            if (resizesTop) { dh = toDelta(-dy, parentH, hUnit); dey = toDelta(dy, parentH, yUnit); }

            var newW = Math.max(1, startW + dw);
            var newH = Math.max(1, startH + dh);

            if (isCorner && linkedWH && aspectRatio) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    newH = newW / aspectRatio;
                    if (resizesTop) dey = startH - newH > 0 ? toDelta(startH - newH, parentH, yUnit) : toDelta(-(newH - startH), parentH, yUnit);
                } else {
                    newW = newH * aspectRatio;
                    if (resizesLeft) dex = startW - newW > 0 ? toDelta(startW - newW, parentW, xUnit) : toDelta(-(newW - startW), parentW, xUnit);
                }
            }

            if (!ev.shiftKey) {
                newW = snapPct(newW);
                newH = snapPct(newH);
            } else {
                newW = parseFloat(newW.toFixed(1));
                newH = parseFloat(newH.toFixed(1));
            }

            target.width = newW + wUnit;
            target.height = newH + hUnit;
            if (resizesLeft) target.x = parseFloat((startElX + dex).toFixed(1)) + xUnit;
            if (resizesTop) target.y = parseFloat((startElY + dey).toFixed(1)) + yUnit;
            if (resizesLeft || resizesTop) stripPositionConflicts(target);

            teEl.style.width = target.width;
            teEl.style.height = target.height;
            if (resizesLeft) { teEl.style.left = target.x; teEl.style.right = 'auto'; }
            if (resizesTop) { teEl.style.top = target.y; teEl.style.bottom = 'auto'; }

            markDirty();
            showPropsFor(selectedChildIdx !== null ? 'child' : 'element');
            updateCoordsReadout($(teEl));
        }

        $(document).on('mousemove.teresize', onMove).on('mouseup.teresize', onUp);
    }

    function startCanvasRotate(e, teEl) {
        var target = getSelectedTarget();
        if (!target) return;
        var rect = teEl.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        var currentRotation = parseFloat(target.rotation) || 0;
        document.body.style.cursor = 'grabbing';

        function onMove(ev) {
            var angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
            var delta = (angle - startAngle) * (180 / Math.PI);
            var newRot = currentRotation + delta;
            if (!ev.shiftKey) {
                newRot = Math.round(newRot);
            } else {
                newRot = Math.round(newRot / 15) * 15;
            }
            applyTransform(teEl, newRot, target.flipX, target.flipY, target.scale);
        }
        function onUp(ev) {
            $(document).off('mousemove.terotate mouseup.terotate');
            document.body.style.cursor = '';
            var angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
            var delta = (angle - startAngle) * (180 / Math.PI);
            var newRot = currentRotation + delta;
            if (!ev.shiftKey) {
                newRot = Math.round(newRot);
            } else {
                newRot = Math.round(newRot / 15) * 15;
            }
            if (newRot > 180) newRot -= 360;
            if (newRot < -180) newRot += 360;
            target.rotation = newRot;
            applyTransform(teEl, newRot, target.flipX, target.flipY, target.scale);
            markDirty();
            showPropsFor(selectedChildIdx !== null ? 'child' : 'element');
        }
        $(document).on('mousemove.terotate', onMove).on('mouseup.terotate', onUp);
    }

    function updateCoordsReadout($s) {
        var p = $s.position();
        $('#te-coord-x').text(Math.round(p.left));
        $('#te-coord-y').text(Math.round(p.top));
        $('#te-coord-w').text(Math.round($s.outerWidth()));
        $('#te-coord-h').text(Math.round($s.outerHeight()));
    }

    function pauseParallax() {
        if (parallaxInstance && parallaxInstance.disable) {
            parallaxInstance.disable();
            parallaxPaused = true;
            updateParallaxButton();
        }
    }

    function resumeParallax() {
        if (parallaxInstance && parallaxInstance.enable) {
            parallaxInstance.enable();
            parallaxPaused = false;
            updateParallaxButton();
        }
    }

    function updateParallaxButton() {
        var $btn = $('#te-parallax-toggle');
        if (!$btn.length) return;
        if (editorState.type === 'static') {
            $btn.html('▪ Static').addClass('te-parallax-paused');
            return;
        }
        if (parallaxPaused) {
            $btn.html('▶ Parallax paused').addClass('te-parallax-paused').removeClass('te-parallax-live');
            $btn.css({ background: 'rgba(var(--cui-danger-rgb),0.25)', borderColor: 'rgba(var(--cui-danger-rgb),0.5)' });
        } else {
            $btn.html('⏸ Parallax live').removeClass('te-parallax-paused').addClass('te-parallax-live');
            $btn.css({ background: 'rgba(var(--cui-success-rgb),0.25)', borderColor: 'rgba(var(--cui-success-rgb),0.5)' });
        }
    }

    function navigateSibling(dir) {
        if (selectedLayerIdx === null || selectedElementIdx === null) return;
        var layer = editorState.layers[selectedLayerIdx];
        if (!layer) return;

        if (selectedChildIdx !== null) {
            // Navigate between children of the same element
            var parent = layer.elements[selectedElementIdx];
            if (!parent || !parent.children) return;
            var next = selectedChildIdx + dir;
            if (next >= 0 && next < parent.children.length) {
                selectChild(selectedLayerIdx, selectedElementIdx, next);
            }
        } else {
            // Navigate between elements in the same layer
            var next = selectedElementIdx + dir;
            if (next >= 0 && next < (layer.elements || []).length) {
                selectElement(selectedLayerIdx, next);
            }
        }
    }

    function highlightDepth(layerIdx) {
        var sceneLayers = document.querySelectorAll('#scene > div');
        if (layerIdx === null) {
            sceneLayers.forEach(function (l) { l.classList.remove('te-depth-dimmed'); });
            return;
        }
        var targetDepth = editorState.layers[layerIdx] ? editorState.layers[layerIdx].depth : null;
        sceneLayers.forEach(function (l, i) {
            var layer = editorState.layers[i];
            if (layer && targetDepth !== null && layer.depth !== targetDepth) {
                l.classList.add('te-depth-dimmed');
            } else {
                l.classList.remove('te-depth-dimmed');
            }
        });
    }

    function selectLayer(idx) {
        selectedLayerIdx = idx;
        selectedElementIdx = null;
        selectedChildIdx = null;
        expandedLayers[idx] = true;
        resumeParallax();
        highlightDepth(null);
        renderLayerTree();
        showPropsFor('layer');
    }

    function selectElement(layerIdx, elIdx, fromCanvas) {
        selectedLayerIdx = layerIdx;
        selectedElementIdx = elIdx;
        selectedChildIdx = null;
        expandedLayers[layerIdx] = true;
        pauseParallax();
        highlightDepth(layerIdx);
        renderLayerTree(!!fromCanvas);
        showPropsFor('element');
        $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
        var $target = $('#scene .te-element[data-layer-idx="' + layerIdx + '"][data-el-idx="' + elIdx + '"]');
        if ($target.length) {
            $target.addClass('selected');
            addHandles($target[0]);
            updateCoordsReadout($target);
        }
    }

    function selectChild(layerIdx, elIdx, childIdx, fromCanvas) {
        selectedLayerIdx = layerIdx;
        selectedElementIdx = elIdx;
        selectedChildIdx = childIdx;
        expandedLayers[layerIdx] = true;
        pauseParallax();
        highlightDepth(layerIdx);
        renderLayerTree(!!fromCanvas);
        showPropsFor('child');
        $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
        var $parent = $('#scene .te-element[data-layer-idx="' + layerIdx + '"][data-el-idx="' + elIdx + '"]');
        if ($parent.length) $parent.addClass('te-parent-highlight');
        var $target = $('#scene .te-element[data-layer-idx="' + layerIdx + '"][data-el-idx="' + elIdx + '.' + childIdx + '"]');
        if ($target.length) {
            $target.addClass('selected');
            addHandles($target[0]);
            updateCoordsReadout($target);
        }
    }

    // ── Events ──
    function bindEvents() {
        // Expand/collapse toggle
        $(document).on('click', '.te-expand-toggle', function (e) {
            e.stopPropagation();
            var idx = parseInt($(this).data('idx'));
            if (isNaN(idx)) return;
            expandedLayers[idx] = !expandedLayers[idx];
            renderLayerTree();
        });

        // Layer tree clicks (on the row itself, not the toggle)
        $(document).on('click', '.te-layer-row', function (e) {
            if ($(e.target).hasClass('te-expand-toggle') || $(e.target).hasClass('te-layer-eye') || $(e.target).hasClass('te-layer-lock') || $(e.target).hasClass('te-el-eye')) return;
            var idx = parseInt($(this).data('idx'));
            if (selectedLayerIdx === idx && selectedElementIdx === null) {
                selectedLayerIdx = null;
                highlightDepth(null);
                renderLayerTree();
                showPropsFor(null);
            } else {
                selectLayer(idx);
            }
        });
        // Click on grandchild (child of element)
        $(document).on('click', '.te-grandchild-row[data-child-idx]', function (e) {
            e.stopPropagation();
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            var ci = parseInt($(this).data('childIdx'));
            if (selectedLayerIdx === li && selectedElementIdx === ei && selectedChildIdx === ci) {
                selectedChildIdx = null;
                highlightDepth(null);
                renderLayerTree();
                showPropsFor('element');
                $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
            } else {
                selectChild(li, ei, ci);
            }
        });
        // Click on element (exclude grandchild rows which also have data-el-idx)
        $(document).on('click', '.te-child-row[data-el-idx]:not(.te-grandchild-row)', function () {
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            if (selectedLayerIdx === li && selectedElementIdx === ei && selectedChildIdx === null) {
                selectedElementIdx = null;
                highlightDepth(null);
                resumeParallax();
                renderLayerTree();
                showPropsFor('layer');
                $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
            } else {
                selectElement(li, ei);
            }
        });
        $(document).on('click', '[data-action="upload-element"]', function () {
            var li = parseInt($(this).data('layerIdx'));
            triggerUpload('element', li);
        });
        $(document).on('click', '[data-action="pick-element"]', function () {
            var li = parseInt($(this).data('layerIdx'));
            showAssetPicker('element', li);
        });
        $(document).on('click', '[data-action="upload-layer"]', function () {
            triggerUpload('new-layer');
        });
        $(document).on('click', '[data-action="pick-layer"]', function () {
            showAssetPicker('new-layer');
        });
        $(document).on('click', '[data-action="upload-child"]', function () {
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            triggerUpload('add-child', li, ei);
        });
        $(document).on('click', '[data-action="pick-child"]', function () {
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            showAssetPicker('add-child', li, ei);
        });

        // Delete child element
        $(document).on('click', '.te-child-delete', function (e) {
            e.stopPropagation();
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            var ci = parseInt($(this).data('childIdx'));
            if (editorState.layers[li] && editorState.layers[li].elements[ei] && editorState.layers[li].elements[ei].children) {
                editorState.layers[li].elements[ei].children.splice(ci, 1);
                selectedChildIdx = null;
                markDirty();
                renderLayerTree();
                debouncedRenderScene();
                showPropsFor('element');
            }
        });

        // Delete layer/element
        $(document).on('click', '.te-layer-delete', function (e) {
            e.stopPropagation();
            if ($(this).data('elIdx') !== undefined) {
                var li = parseInt($(this).data('layerIdx'));
                var ei = parseInt($(this).data('elIdx'));
                editorState.layers[li].elements.splice(ei, 1);
            } else {
                var idx = parseInt($(this).data('idx'));
                editorState.layers.splice(idx, 1);
                if (selectedLayerIdx === idx) { selectedLayerIdx = null; selectedElementIdx = null; }
                else if (selectedLayerIdx !== null && selectedLayerIdx > idx) selectedLayerIdx--;
                delete expandedLayers[idx];
            }
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
            showPropsFor(null);
        });

        // Force native color picker open on click (some browsers need showPicker)
        $(document).on('click', '.te-color-pick', function () {
            if (this.showPicker) {
                try { this.showPicker(); } catch (e) {}
            }
        });

        // Scene property controls
        $('#te-bg-color').on('input', function () {
            editorState.scene.background_color = this.value;
            $('#te-bg-hex').val(this.value);
            document.getElementById('scene').style.backgroundColor = this.value;
            updateMiniPreview();
            markDirty();
        });
        $('#te-bg-hex').on('change', function () {
            if (/^#[0-9a-f]{6}$/i.test(this.value)) {
                editorState.scene.background_color = this.value;
                $('#te-bg-color').val(this.value);
                $('#te-bg-swatch').css('background', this.value);
                document.getElementById('scene').style.backgroundColor = this.value;
                updateMiniPreview();
                markDirty();
            }
        });

        $('#te-scalar-x').on('input', function () {
            var v = parseInt(this.value);
            editorState.scene.scalar_x = v;
            $('#te-scalar-x-num').val(v);
            updateParallaxParams();
        });
        $('#te-scalar-x').on('change', function () { markDirty(); });
        $('#te-scalar-x-num').on('change', function () {
            var v = Math.max(1, Math.min(50, parseInt(this.value) || 1));
            this.value = v; $('#te-scalar-x').val(v);
            editorState.scene.scalar_x = v;
            updateParallaxParams(); markDirty();
        });
        $('#te-scalar-y').on('input', function () {
            var v = parseInt(this.value);
            editorState.scene.scalar_y = v;
            $('#te-scalar-y-num').val(v);
            updateParallaxParams();
        });
        $('#te-scalar-y').on('change', function () { markDirty(); });
        $('#te-scalar-y-num').on('change', function () {
            var v = Math.max(1, Math.min(50, parseInt(this.value) || 1));
            this.value = v; $('#te-scalar-y').val(v);
            editorState.scene.scalar_y = v;
            updateParallaxParams(); markDirty();
        });
        $('#te-friction').on('input', function () {
            var v = parseInt(this.value) / 100;
            editorState.scene.friction_x = v;
            editorState.scene.friction_y = v;
            $('#te-friction-num').val(parseInt(this.value));
            updateParallaxParams();
        });
        $('#te-friction').on('change', function () { markDirty(); });
        $('#te-friction-num').on('change', function () {
            var v = Math.max(1, Math.min(100, parseInt(this.value) || 1));
            this.value = v; $('#te-friction').val(v);
            editorState.scene.friction_x = v / 100;
            editorState.scene.friction_y = v / 100;
            updateParallaxParams(); markDirty();
        });
        $('#te-invert-x').on('click', function () {
            var on = $(this).attr('data-toggled') !== 'true';
            $(this).toggleClass('active', on).attr('data-toggled', on);
            editorState.scene.invert_x = on;
            updateParallaxParams();
            markDirty();
        });
        $('#te-invert-y').on('click', function () {
            var on = $(this).attr('data-toggled') !== 'true';
            $(this).toggleClass('active', on).attr('data-toggled', on);
            editorState.scene.invert_y = on;
            updateParallaxParams();
            markDirty();
        });
        $('#te-offset-left').on('change', function () {
            editorState.layer_offset.left = parseInt(this.value) || 0;
            markDirty();
            debouncedRenderScene();
        });
        $('#te-offset-top').on('change', function () {
            editorState.layer_offset.top = parseInt(this.value) || 0;
            markDirty();
            debouncedRenderScene();
        });

        function updateFilterProp(prop, val) {
            if (filterEditMode === 'both') {
                if (!editorState.scene.filter_dark) editorState.scene.filter_dark = {};
                if (!editorState.scene.filter_light) editorState.scene.filter_light = {};
                editorState.scene.filter_dark[prop] = val;
                editorState.scene.filter_light[prop] = val;
            } else {
                if (!editorState.scene['filter_' + filterEditMode]) editorState.scene['filter_' + filterEditMode] = {};
                editorState.scene['filter_' + filterEditMode][prop] = val;
            }
            applyActiveSceneFilter();
        }
        $('#te-filter-sat').on('input', function () { var v = parseInt(this.value); $('#te-filter-sat-num').val(v); updateFilterProp('saturate', v); });
        $('#te-filter-sat-num').on('change', function () { var v = Math.max(0, Math.min(200, parseInt(this.value) || 0)); this.value = v; $('#te-filter-sat').val(v); updateFilterProp('saturate', v); markDirty(); });
        $('#te-filter-bri').on('input', function () { var v = parseInt(this.value); $('#te-filter-bri-num').val(v); updateFilterProp('brightness', v); });
        $('#te-filter-bri-num').on('change', function () { var v = Math.max(0, Math.min(200, parseInt(this.value) || 0)); this.value = v; $('#te-filter-bri').val(v); updateFilterProp('brightness', v); markDirty(); });
        $('#te-filter-con').on('input', function () { var v = parseInt(this.value); $('#te-filter-con-num').val(v); updateFilterProp('contrast', v); });
        $('#te-filter-con-num').on('change', function () { var v = Math.max(0, Math.min(200, parseInt(this.value) || 0)); this.value = v; $('#te-filter-con').val(v); updateFilterProp('contrast', v); markDirty(); });
        $('#te-filter-sat, #te-filter-bri, #te-filter-con').on('change', function () { markDirty(); });

        $('[data-fmode]').on('click', function () {
            filterEditMode = $(this).data('fmode');
            if (filterEditMode === 'both') {
                var mode = getActiveFilterMode();
                var src = editorState.scene['filter_' + mode] || {};
                var synced = { saturate: src.saturate, brightness: src.brightness, contrast: src.contrast };
                editorState.scene.filter_dark = Object.assign(editorState.scene.filter_dark || {}, synced);
                editorState.scene.filter_light = Object.assign(editorState.scene.filter_light || {}, synced);
                applyActiveSceneFilter();
            }
            loadFilterSliders();
        });

        function updateModeLabel() {
            var isDark = document.documentElement.getAttribute('data-coreui-theme') !== 'light';
            $('#te-mode-icon').text(isDark ? '🌙' : '☀️');
            $('#te-mode-label').text(isDark ? 'Dark' : 'Light');
        }
        updateModeLabel();

        $('#te-preview-mode-toggle').on('click', function () {
            var curr = document.documentElement.getAttribute('data-coreui-theme');
            var next = curr === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-coreui-theme', next);
            if (filterEditMode === 'both') {
                var src = editorState.scene['filter_' + curr] || {};
                var synced = { saturate: src.saturate, brightness: src.brightness, contrast: src.contrast };
                editorState.scene['filter_' + next] = Object.assign(editorState.scene['filter_' + next] || {}, synced);
            }
            applyActiveSceneFilter();
            applyAccentLive(editorState.accent);
            updateModeLabel();
            if (filterEditMode === 'both') loadFilterSliders();
        });

        var blurOn = $('body').hasClass('hwa-enabled');
        $('#te-blur-label').text(blurOn ? 'Blur on' : 'Blur off');
        $('#te-blur-toggle').on('click', function () {
            blurOn = !blurOn;
            $('body').toggleClass('hwa-enabled', blurOn).toggleClass('hwa-disabled', !blurOn);
            $('#te-blur-label').text(blurOn ? 'Blur on' : 'Blur off');
            applyBlurLive();
        });

        $('#te-sample-cards-toggle').on('click', function () {
            var el = document.getElementById('te-sample-cards');
            el.style.display = el.style.display === 'none' ? '' : 'none';
        });
        $('#te-dismiss-samples').on('click', function () {
            document.getElementById('te-sample-cards').style.display = 'none';
        });

        // Blur controls
        $('#te-blur-dark').on('input', function () {
            var alpha = parseInt($('#te-blur-dark-alpha').val()) / 100;
            editorState.blur.dark = hexToRgba(this.value, alpha);
            applyBlurLive(); markDirty();
        });
        $('#te-blur-dark-alpha').on('input', function () {
            var v = parseInt(this.value);
            $('#te-blur-dark-num').val(v);
            editorState.blur.dark = hexToRgba($('#te-blur-dark').val(), v / 100);
            applyBlurLive(); markDirty();
        });
        $('#te-blur-dark-num').on('change', function () {
            var v = Math.max(80, Math.min(100, parseInt(this.value) || 95));
            this.value = v; $('#te-blur-dark-alpha').val(v);
            editorState.blur.dark = hexToRgba($('#te-blur-dark').val(), v / 100);
            applyBlurLive(); markDirty();
        });
        $('#te-blur-light').on('input', function () {
            var alpha = parseInt($('#te-blur-light-alpha').val()) / 100;
            editorState.blur.light = hexToRgba(this.value, alpha);
            applyBlurLive(); markDirty();
        });
        $('#te-blur-light-alpha').on('input', function () {
            var v = parseInt(this.value);
            $('#te-blur-light-num').val(v);
            editorState.blur.light = hexToRgba($('#te-blur-light').val(), v / 100);
            applyBlurLive(); markDirty();
        });
        $('#te-blur-light-num').on('change', function () {
            var v = Math.max(80, Math.min(100, parseInt(this.value) || 95));
            this.value = v; $('#te-blur-light-alpha').val(v);
            editorState.blur.light = hexToRgba($('#te-blur-light').val(), v / 100);
            applyBlurLive(); markDirty();
        });

        // Layer depth slider
        $('#te-layer-depth').on('input', function () {
            if (selectedLayerIdx === null) return;
            var v = parseInt(this.value) / 100;
            editorState.layers[selectedLayerIdx].depth = parseFloat(v.toFixed(2));
            $('#te-layer-depth-val').text(v.toFixed(2));
            markDirty();
            debouncedRenderScene();
            renderLayerTree();
        });

        // Element props
        $('#te-el-x, #te-el-y').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.x = $('#te-el-x').val();
            target.y = $('#te-el-y').val();
            markDirty();
            updateElementInPlace(target);
        });
        $('#te-el-w').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var oldW = parseFloat(target.width);
            var newW = parseFloat(this.value);
            var unit = this.value.replace(/[\\d.]+/, '');
            // Center-preserving: shift x by half the width difference
            if (oldW && newW && target.x) {
                var dx = (oldW - newW) / 2;
                target.x = parseFloat(parseFloat(target.x) + dx).toFixed(1) + (target.x.toString().indexOf('%') !== -1 ? '%' : unit);
                $('#te-el-x').val(target.x);
            }
            target.width = this.value;
            if (linkedWH && aspectRatio) {
                if (newW) {
                    var oldH = parseFloat(target.height);
                    var newH = Math.round(newW / aspectRatio);
                    var dy = (oldH - newH) / 2;
                    if (oldH && target.y) {
                        target.y = parseFloat(parseFloat(target.y) + dy).toFixed(1) + (target.y.toString().indexOf('%') !== -1 ? '%' : unit);
                        $('#te-el-y').val(target.y);
                    }
                    target.height = newH + unit;
                    $('#te-el-h').val(target.height);
                }
            }
            markDirty();
            updateElementInPlace(target);
        });
        $('#te-el-h').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var oldH = parseFloat(target.height);
            var newH = parseFloat(this.value);
            var unit = this.value.replace(/[\\d.]+/, '');
            // Center-preserving: shift y by half the height difference
            if (oldH && newH && target.y) {
                var dy = (oldH - newH) / 2;
                target.y = parseFloat(parseFloat(target.y) + dy).toFixed(1) + (target.y.toString().indexOf('%') !== -1 ? '%' : unit);
                $('#te-el-y').val(target.y);
            }
            target.height = this.value;
            if (linkedWH && aspectRatio) {
                if (newH) {
                    var oldW = parseFloat(target.width);
                    var newW = Math.round(newH * aspectRatio);
                    var dx = (oldW - newW) / 2;
                    if (oldW && target.x) {
                        target.x = parseFloat(parseFloat(target.x) + dx).toFixed(1) + (target.x.toString().indexOf('%') !== -1 ? '%' : unit);
                        $('#te-el-x').val(target.x);
                    }
                    target.width = newW + unit;
                    $('#te-el-w').val(target.width);
                }
            }
            markDirty();
            updateElementInPlace(target);
        });
        // Link W/H toggle
        $('#te-link-wh').on('click', function () {
            linkedWH = !linkedWH;
            $(this).toggleClass('active', linkedWH);
            if (linkedWH) {
                var w = parseFloat($('#te-el-w').val());
                var h = parseFloat($('#te-el-h').val());
                aspectRatio = (w && h) ? w / h : null;
            }
        });

        // Animation chips
        $(document).on('click', '#te-anim-chips .te-chip', function () {
            var target = getSelectedTarget();
            if (!target) return;
            $('#te-anim-chips .te-chip').removeClass('active');
            $(this).addClass('active');
            var anim = $(this).data('anim');
            target.animation = anim || '';
            markDirty();
            updateElementInPlace(target);
        });

        $('#te-el-duration').on('input', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = this.value + 's';
            target.animation_duration = v;
            $('#te-el-duration-val').text(v);
            markDirty();
            updateElementInPlace(target);
        });

        $('#te-el-scale').on('input', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = parseInt(this.value);
            target.scale = v / 100;
            $('#te-el-scale-num').val(v);
            updateElementInPlace(target);
        });
        $('#te-el-scale').on('change', function () { markDirty(); });
        $('#te-el-scale-num').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = Math.max(5, Math.min(500, parseInt(this.value) || 100));
            this.value = v; $('#te-el-scale').val(v);
            target.scale = v / 100;
            updateElementInPlace(target); markDirty();
        });
        $('#te-el-rotate').on('input', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = parseInt(this.value);
            target.rotation = v;
            $('#te-el-rotate-num').val(v);
            updateElementInPlace(target);
        });
        $('#te-el-rotate').on('change', function () { markDirty(); });
        $('#te-el-rotate-num').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = Math.max(-180, Math.min(180, parseInt(this.value) || 0));
            this.value = v; $('#te-el-rotate').val(v);
            target.rotation = v;
            updateElementInPlace(target); markDirty();
        });

        $('#te-el-flipx').on('click', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.flipX = !target.flipX;
            $(this).toggleClass('active', !!target.flipX);
            updateElementInPlace(target);
            markDirty();
        });
        $('#te-el-flipy').on('click', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.flipY = !target.flipY;
            $(this).toggleClass('active', !!target.flipY);
            updateElementInPlace(target);
            markDirty();
        });

        // Opacity
        function syncOpacity(v) {
            var target = getSelectedTarget();
            if (!target) return;
            target.opacity = v / 100;
            updateElementInPlace(target);
        }
        $('#te-el-opacity').on('input', function () {
            var v = parseInt(this.value);
            $('#te-el-opacity-num').val(v);
            syncOpacity(v);
        });
        $('#te-el-opacity').on('change', function () { markDirty(); });
        $('#te-el-opacity-num').on('change', function () {
            var v = Math.max(0, Math.min(100, parseInt(this.value) || 100));
            this.value = v; $('#te-el-opacity').val(v);
            syncOpacity(v); markDirty();
        });

        // Background-size
        $('#te-el-bgsize').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = this.value;
            if (v === 'custom') {
                $('#te-el-bgsize-custom').show().focus();
                return;
            }
            $('#te-el-bgsize-custom').hide();
            target.bgSize = v;
            updateElementInPlace(target); markDirty();
        });
        $('#te-el-bgsize-custom').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.bgSize = this.value || 'contain';
            updateElementInPlace(target); markDirty();
        });

        // Background-position
        $('#te-el-bgpos').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = this.value;
            if (v === 'custom') {
                $('#te-el-bgpos-custom').show().focus();
                return;
            }
            $('#te-el-bgpos-custom').hide();
            target.bgPosition = v;
            updateElementInPlace(target); markDirty();
        });
        $('#te-el-bgpos-custom').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.bgPosition = this.value || '';
            updateElementInPlace(target); markDirty();
        });

        // Background-repeat
        $('#te-el-bgrepeat').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.bgRepeat = this.value;
            updateElementInPlace(target); markDirty();
        });

        // Layer move up/down
        $(document).on('click', '.te-layer-move', function (e) {
            e.stopPropagation();
            moveLayer(parseInt($(this).data('idx')), parseInt($(this).data('dir')));
        });
        // Layer duplicate
        $(document).on('click', '.te-layer-dup', function (e) {
            e.stopPropagation();
            var idx = parseInt($(this).data('idx'));
            selectLayer(idx);
            duplicateSelected();
        });

        // Element move up/down within a layer
        $(document).on('click', '.te-el-move', function (e) {
            e.stopPropagation();
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            var dir = parseInt($(this).data('dir'));
            var els = editorState.layers[li].elements;
            if (!els) return;
            var toIdx = ei + dir;
            if (toIdx < 0 || toIdx >= els.length) return;
            var moved = els.splice(ei, 1)[0];
            els.splice(toIdx, 0, moved);
            if (selectedLayerIdx === li && selectedElementIdx === ei) selectedElementIdx = toIdx;
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
        });
        // Child move up/down within an element
        $(document).on('click', '.te-gc-move', function (e) {
            e.stopPropagation();
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            var ci = parseInt($(this).data('childIdx'));
            var dir = parseInt($(this).data('dir'));
            var children = editorState.layers[li].elements[ei].children;
            if (!children) return;
            var toIdx = ci + dir;
            if (toIdx < 0 || toIdx >= children.length) return;
            var moved = children.splice(ci, 1)[0];
            children.splice(toIdx, 0, moved);
            if (selectedLayerIdx === li && selectedElementIdx === ei && selectedChildIdx === ci) selectedChildIdx = toIdx;
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
        });

        // ── Action ribbon buttons ──
        $('#te-rb-move-up').on('click', function () {
            if (selectedLayerIdx === null) return;
            if (selectedChildIdx !== null) {
                var children = editorState.layers[selectedLayerIdx].elements[selectedElementIdx].children;
                if (!children || selectedChildIdx <= 0) return;
                var m = children.splice(selectedChildIdx, 1)[0];
                children.splice(selectedChildIdx - 1, 0, m);
                selectedChildIdx--;
            } else if (selectedElementIdx !== null) {
                var els = editorState.layers[selectedLayerIdx].elements;
                if (!els || selectedElementIdx <= 0) return;
                var m = els.splice(selectedElementIdx, 1)[0];
                els.splice(selectedElementIdx - 1, 0, m);
                selectedElementIdx--;
            } else {
                moveLayer(selectedLayerIdx, -1);
                return;
            }
            markDirty(); renderLayerTree(); debouncedRenderScene();
        });
        $('#te-rb-move-down').on('click', function () {
            if (selectedLayerIdx === null) return;
            if (selectedChildIdx !== null) {
                var children = editorState.layers[selectedLayerIdx].elements[selectedElementIdx].children;
                if (!children || selectedChildIdx >= children.length - 1) return;
                var m = children.splice(selectedChildIdx, 1)[0];
                children.splice(selectedChildIdx + 1, 0, m);
                selectedChildIdx++;
            } else if (selectedElementIdx !== null) {
                var els = editorState.layers[selectedLayerIdx].elements;
                if (!els || selectedElementIdx >= els.length - 1) return;
                var m = els.splice(selectedElementIdx, 1)[0];
                els.splice(selectedElementIdx + 1, 0, m);
                selectedElementIdx++;
            } else {
                moveLayer(selectedLayerIdx, 1);
                return;
            }
            markDirty(); renderLayerTree(); debouncedRenderScene();
        });
        $('#te-rb-duplicate').on('click', function () {
            if (selectedLayerIdx === null) return;
            duplicateSelected();
        });
        $('#te-rb-center').on('click', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var elIdxStr = selectedChildIdx !== null
                ? selectedElementIdx + '.' + selectedChildIdx
                : String(selectedElementIdx);
            var $el = $('#scene .te-element[data-layer-idx="' + selectedLayerIdx
                + '"][data-el-idx="' + elIdxStr + '"]');
            if (!$el.length) return;
            var el = $el[0];
            var parentEl = el.parentNode;
            var parentW = parentEl ? parentEl.offsetWidth : window.innerWidth;
            var parentH = parentEl ? parentEl.offsetHeight : window.innerHeight;
            var cs = getComputedStyle(el);
            var ml = parseFloat(cs.marginLeft) || 0;
            var mt = parseFloat(cs.marginTop) || 0;
            var centerX = Math.round(((parentW / 2 - el.offsetWidth / 2 - ml) / parentW * 100) * 10) / 10;
            var centerY = Math.round(((parentH / 2 - el.offsetHeight / 2 - mt) / parentH * 100) * 10) / 10;
            target.x = centerX + '%';
            target.y = centerY + '%';
            stripPositionConflicts(target);
            el.style.left = target.x;
            el.style.top = target.y;
            el.style.bottom = 'auto';
            el.style.right = 'auto';
            $('#te-el-x').val(target.x);
            $('#te-el-y').val(target.y);
            markDirty();
            updateElementInPlace(target);
        });
        $('#te-rb-delete').on('click', function () {
            if (selectedLayerIdx === null) return;
            if (selectedChildIdx !== null) {
                var el = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
                if (el && el.children) {
                    el.children.splice(selectedChildIdx, 1);
                    selectedChildIdx = null;
                }
            } else if (selectedElementIdx !== null) {
                editorState.layers[selectedLayerIdx].elements.splice(selectedElementIdx, 1);
                selectedElementIdx = null;
                selectedChildIdx = null;
            } else {
                editorState.layers.splice(selectedLayerIdx, 1);
                selectedLayerIdx = null;
            }
            markDirty(); renderLayerTree(); renderScene(); showPropsFor(null);
        });

        // Layer visibility + lock toggles
        $(document).on('click', '.te-layer-eye', function (e) {
            e.stopPropagation();
            var idx = parseInt($(this).data('idx'));
            var layer = editorState.layers[idx];
            if (!layer) return;
            layer.hidden = !layer.hidden;
            markDirty();
            renderLayerTree();
            var sceneLayer = document.querySelectorAll('#scene > div')[idx];
            if (sceneLayer) sceneLayer.style.display = layer.hidden ? 'none' : '';
        });
        $(document).on('click', '.te-layer-lock', function (e) {
            e.stopPropagation();
            var idx = parseInt($(this).data('idx'));
            var layer = editorState.layers[idx];
            if (!layer) return;
            layer.locked = !layer.locked;
            renderLayerTree();
        });

        // Element/child visibility toggle
        $(document).on('click', '.te-el-eye', function (e) {
            e.stopPropagation();
            var li = parseInt($(this).data('layer-idx'));
            var ei = parseInt($(this).data('el-idx'));
            var ci = $(this).data('child-idx');
            var layer = editorState.layers[li];
            if (!layer) return;
            var target;
            if (ci !== undefined) {
                target = layer.elements[ei] && layer.elements[ei].children ? layer.elements[ei].children[parseInt(ci)] : null;
            } else {
                target = layer.elements ? layer.elements[ei] : null;
            }
            if (!target) return;
            target.hidden = !target.hidden;
            markDirty();
            renderLayerTree();
            var elIdxStr = ci !== undefined ? ei + '.' + ci : String(ei);
            var $sceneEl = $('#scene .te-element[data-layer-idx="' + li + '"][data-el-idx="' + elIdxStr + '"]');
            if ($sceneEl.length) $sceneEl.css('display', target.hidden ? 'none' : '');
            // Cascade: if hiding a parent element, also hide its children in the scene
            if (ci === undefined && target.children && target.children.length) {
                target.children.forEach(function (child, childIdx) {
                    var $childEl = $('#scene .te-element[data-layer-idx="' + li + '"][data-el-idx="' + ei + '.' + childIdx + '"]');
                    if ($childEl.length) $childEl.css('display', target.hidden ? 'none' : (child.hidden ? 'none' : ''));
                });
            }
        });

        // Replace/delete buttons
        $('#te-replace-layer-img').on('click', function () {
            if (selectedLayerIdx !== null) triggerUpload('replace-layer', selectedLayerIdx);
        });
        $('#te-delete-layer').on('click', function () {
            if (selectedLayerIdx === null) return;
            editorState.layers.splice(selectedLayerIdx, 1);
            delete expandedLayers[selectedLayerIdx];
            selectedLayerIdx = null;
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
            showPropsFor(null);
        });
        // Container toggles
        $('#te-container-toggle').on('change', function () {
            if (selectedLayerIdx === null || selectedElementIdx === null || selectedChildIdx !== null) return;
            var el = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            if (this.checked) {
                if (!el.children) el.children = [];
                el.tag = 'img';
                $('#te-container-opts').show();
                $('#te-container-img-toggle').prop('checked', true);
            } else {
                el.children = [];
                delete el.tag;
                $('#te-container-opts').hide();
                $('#te-container-img-toggle').prop('checked', false);
            }
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
        });
        $('#te-container-img-toggle').on('change', function () {
            if (selectedLayerIdx === null || selectedElementIdx === null) return;
            var el = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            if (this.checked) {
                el.tag = 'img';
            } else {
                delete el.tag;
            }
            markDirty();
            debouncedRenderScene();
        });

        $('#te-replace-el-img').on('click', function () {
            if (selectedChildIdx !== null) {
                triggerUpload('replace-child', selectedLayerIdx, selectedElementIdx, selectedChildIdx);
            } else if (selectedLayerIdx !== null && selectedElementIdx !== null) {
                triggerUpload('replace-element', selectedLayerIdx, selectedElementIdx);
            }
        });
        $('#te-delete-el').on('click', function () {
            if (selectedChildIdx !== null) {
                editorState.layers[selectedLayerIdx].elements[selectedElementIdx].children.splice(selectedChildIdx, 1);
                selectedChildIdx = null;
                markDirty();
                renderLayerTree();
                debouncedRenderScene();
                showPropsFor('element');
                return;
            }
            if (selectedLayerIdx === null || selectedElementIdx === null) return;
            editorState.layers[selectedLayerIdx].elements.splice(selectedElementIdx, 1);
            selectedElementIdx = null;
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
            showPropsFor('layer');
        });
        // Breadcrumb navigation
        $(document).on('click', '.te-bc-item:not(.te-bc-active)', function () {
            var nav = $(this).data('nav');
            if (nav === 'scene') {
                selectedLayerIdx = null;
                selectedElementIdx = null;
                selectedChildIdx = null;
                highlightDepth(null);
                resumeParallax();
                renderLayerTree();
                showPropsFor(null);
                $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
            } else if (nav === 'layer') {
                selectedElementIdx = null;
                selectedChildIdx = null;
                highlightDepth(null);
                resumeParallax();
                renderLayerTree();
                showPropsFor('layer');
                $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
            } else if (nav === 'element') {
                selectedChildIdx = null;
                renderLayerTree();
                showPropsFor('element');
                $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
                var $target = $('#scene .te-element[data-layer-idx="' + selectedLayerIdx + '"][data-el-idx="' + selectedElementIdx + '"]');
                if ($target.length) {
                    $target.addClass('selected');
                    addHandles($target[0]);
                }
            }
        });

        $('#te-deselect-layer').on('click', function () {
            selectedLayerIdx = null;
            selectedElementIdx = null;
            selectedChildIdx = null;
            highlightDepth(null);
            resumeParallax();
            renderLayerTree();
            showPropsFor(null);
        });
        // × fully deselects everything → back to Scene
        $('#te-deselect-element').on('click', function () {
            selectedLayerIdx = null;
            selectedElementIdx = null;
            selectedChildIdx = null;
            highlightDepth(null);
            resumeParallax();
            renderLayerTree();
            showPropsFor(null);
            $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
        });
        // ↑ goes from child to parent element
        $('#te-nav-parent').on('click', function () {
            if (selectedChildIdx === null) return;
            selectedChildIdx = null;
            renderLayerTree();
            showPropsFor('element');
            $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
            var $target = $('#scene .te-element[data-layer-idx="' + selectedLayerIdx + '"][data-el-idx="' + selectedElementIdx + '"]');
            if ($target.length) {
                $target.addClass('selected');
                addHandles($target[0]);
                updateCoordsReadout($target);
            }
            return;
        });

        // Toggle buttons
        $(document).on('click', '#te-type-toggle button', function () {
            editorState.type = $(this).data('val');
            setToggleActive('#te-type-toggle', editorState.type);
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
            updateParallaxButton();
        });
        // Mode toggle removed — mode is auto-detected per layer

        // Name + accent
        $('#te-title-input').on('input', function () {
            editorState.name = this.value;
            markDirty();
        });
        $('#te-accent-color').on('input change', function () {
            editorState.accent = this.value;
            $('#te-accent-swatch').css('background', this.value);
            applyAccentLive(this.value);
            markDirty();
        });

        $('#te-accent-enhance').on('click', function () {
            var accent = editorState.accent || '#FF6B1A';
            var enhanced = vivifyAccent(accent);
            if (enhanced !== accent) {
                editorState.accent = enhanced;
                $('#te-accent-color').val(enhanced);
                applyAccentLive(enhanced);
                markDirty();
                try { new Toast('Enhanced', 'now', 'Vivid neon accent applied', { autohide: true, delay: 2000 }).show(); } catch (ex) {}
            } else {
                try { new Toast('Already vivid', 'now', 'Accent is already at peak vibrancy', { autohide: true, delay: 2000 }).show(); } catch (ex) {}
            }
        });

        // Add layer button
        $('#te-add-layer-btn').on('click', function () {
            triggerUpload('new-layer');
        });

        // Add child to element
        // Prev/next element navigation
        $('#te-nav-prev').on('click', function () { navigateSibling(-1); });
        $('#te-nav-next').on('click', function () { navigateSibling(1); });

        $('#te-add-child-btn').on('click', function () {
            if (selectedLayerIdx === null || selectedElementIdx === null) return;
            var el = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            if (!el.children) {
                el.children = [];
                el.tag = 'img';
            }
            triggerUpload('add-child', selectedLayerIdx, selectedElementIdx);
        });

        // 3D peek
        // Parallax pause/resume
        $('#te-parallax-toggle').on('click', function () {
            if (parallaxPaused) resumeParallax();
            else pauseParallax();
        });

        $('#te-3d-btn').on('click', toggle3DPeek);

        // Zen mode
        $('#te-zen-btn').on('click', function () { toggleZen(true); });
        $('#te-zen-exit').on('click', function () { toggleZen(false); });

        // Help
        $('#te-help-btn').on('click', showHelp);

        // Reset panel positions
        $('#te-reset-panels-btn').on('click', function () {
            $('.te-panel').each(function () {
                this.classList.remove('te-panel-dragged');
                this.style.left = '';
                this.style.top = '';
                this.style.right = '';
                this.style.bottom = '';
                this.style.width = '';
            });
            $.post('/api/app/preferences', {
                preference_id: 'theme_editor_panels',
                value: '{}'
            });
            try { new Toast('Panels reset', 'now', 'Panel positions restored to default', { autohide: true, delay: 2000 }).show(); } catch (ex) {}
        });

        // Exit editor
        $('#te-exit-btn').on('click', function () {
            if (!editorState.dirty) { window.location.href = '/dashboard'; return; }
            var d = new Dialog('Unsaved Changes', 'You have unsaved changes. Exit anyway?', 'small');
            d.setButtons([
                { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
                { name: 'Exit', class: 'btn btn-danger', dismiss: true, onClick: function () { editorState.dirty = false; window.location.href = '/dashboard'; } }
            ]);
            d.show();
        });

        // Save / Discard
        $('#te-save-btn').on('click', function () { saveTheme('save'); });
        $('#te-save-apply-btn').on('click', function () { $('#te-save-menu').removeClass('open'); saveTheme('apply'); });
        $('#te-save-exit-btn').on('click', function () { $('#te-save-menu').removeClass('open'); saveTheme('exit'); });
        $('#te-retake-thumb-btn').on('click', function () {
            $('#te-save-menu').removeClass('open');
            $(this).text('Capturing...').prop('disabled', true);
            var $btn = $(this);
            captureThumbnail(function (url) {
                if (url) {
                    new Toast('Thumbnail updated', 'now',
                        '<img src="' + url + '" style="width:100%;max-width:240px;border-radius:6px;margin-top:6px;display:block;">',
                        { autohide: true, delay: 5000 }).show();
                    // Save the new thumbnail to the theme immediately
                    if (editorState.theme_id) {
                        $.post('/api/app/user_themes', {
                            theme_id: editorState.theme_id,
                            config: JSON.stringify({
                                name: editorState.name,
                                type: editorState.type,
                                mode: 'element',
                                scene: editorState.scene,
                                blur: editorState.blur,
                                layer_offset: editorState.layer_offset,
                                design_ratio: editorState.design_ratio,
                                layers: editorState.layers,
                                accent: editorState.accent,
                                thumbnail_url: url
                            })
                        });
                    }
                } else {
                    new Toast('Error', 'now', 'Failed to capture thumbnail', { autohide: true, delay: 3000 }).show();
                }
                $btn.html('&#x1F4F7; Retake Thumbnail').prop('disabled', false);
            });
        });
        $('#te-save-dropdown').on('click', function (e) {
            e.stopPropagation();
            $('#te-save-menu').toggleClass('open');
        });
        $(document).on('click', function () { $('#te-save-menu').removeClass('open'); });
        $('#te-discard-btn').on('click', function () {
            if (!editorState.dirty) { window.location.href = '/dashboard'; return; }
            var d = new Dialog('Discard Changes', 'Discard all unsaved changes?', 'small');
            d.setButtons([
                { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
                { name: 'Discard', class: 'btn btn-danger', dismiss: true, onClick: function () { editorState.dirty = false; window.location.href = '/dashboard'; } }
            ]);
            d.show();
        });

        // Submit for review
        $('#te-submit-review-btn').on('click', function () {
            $('#te-save-menu').removeClass('open');
            if (!editorState.theme_id) {
                saveTheme('save', function () {
                    if (editorState.theme_id) {
                        $('#te-submit-review-btn').trigger('click');
                    } else {
                        new Toast('Error', 'now', 'Save failed — cannot submit', { autohide: true, delay: 3000 }).show();
                    }
                });
                return;
            }
            var submitBody = '<div style="text-align:center;padding:0.5rem 0">' +
                '<div style="font-size:2rem;margin-bottom:0.5rem">🎨</div>' +
                '<p style="margin-bottom:0.75rem">Submit <b>' + (editorState.name || 'your theme') + '</b> for admin review.</p>' +
                '<div class="liquid-rim" style="padding:0.75rem;border-radius:0.5rem;margin-bottom:0.75rem;text-align:left">' +
                    '<div style="font-size:0.85rem"><b>⚡ Jolt Rewards</b></div>' +
                    '<div style="font-size:0.8rem;opacity:0.8;margin-top:0.25rem">Approved themes earn <b>10–1000 ⚡ Jolt</b> based on quality. Great designs earn more!</div>' +
                '</div>' +
                '<div style="font-size:0.8rem;opacity:0.6">You can keep editing while your submission is being reviewed.</div>' +
            '</div>';
            var d = new Dialog('Submit for Review', submitBody, 'medium');
            d.setButtons([
                { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
                { name: '🚀 Submit for Review', class: 'btn btn-primary', dismiss: true, onClick: function () {
                    saveTheme('save', function () {
                        $.post('/api/app/user_themes', { _method: 'SUBMIT', theme_id: editorState.theme_id }, function (resp) {
                            if (resp.result === 'success') {
                                $('#te-save-status').text('pending review');
                                new Toast('Submitted', 'now', 'Theme submitted for review!', { autohide: true, delay: 3000 }).show();
                            } else {
                                new Toast('Error', 'now', resp.error || 'Submit failed').show();
                            }
                        }).fail(function () { new Toast('Error', 'now', 'Submit failed').show(); });
                    });
                }}
            ]);
            d.show();
        });

        // Admin approve (from editor)
        $('#te-admin-approve').on('click', function () {
            var themeId = editorState.theme_id;
            if (!themeId) return;
            var d = new Dialog('Approve Theme', '<div class="mb-3"><label class="form-label">Jolt Reward (0-1000)</label><input type="number" class="form-control" id="ed-approve-reward" min="0" max="1000" value="50"></div><div><label class="form-label">Note (optional)</label><input type="text" class="form-control" id="ed-approve-note" placeholder="Great work!"></div>', 'small');
            d.setButtons([
                { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
                { name: 'Approve & Reward', class: 'btn btn-success', dismiss: true, onClick: function () {
                    var reward = parseInt($('#ed-approve-reward').val()) || 0;
                    var note = $('#ed-approve-note').val();

                    $.post('/api/admin/themes/review', { theme_id: themeId, action: 'approve', reward: reward, note: note }, function (resp) {
                        if (resp.result === 'success') {
                            new Toast('Approved', 'now', resp.message, { autohide: true, delay: 3000 }).show();
                            $('#te-save-status').text('approved');
                        } else {
                            new Toast('Error', 'now', resp.error || 'Failed').show();
                        }
                    });
                }}
            ]);
            d.show();
        });

        // Admin reject (from editor)
        $('#te-admin-reject').on('click', function () {
            var themeId = editorState.theme_id;
            if (!themeId) return;
            var d = new Dialog('Reject Theme', '<div><label class="form-label">Reason</label><input type="text" class="form-control" id="ed-reject-note" placeholder="Needs improvement..."></div>', 'small');
            d.setButtons([
                { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
                { name: 'Reject', class: 'btn btn-danger', dismiss: true, onClick: function () {
                    var note = $('#ed-reject-note').val();

                    $.post('/api/admin/themes/review', { theme_id: themeId, action: 'reject', note: note }, function (resp) {
                        if (resp.result === 'success') {
                            new Toast('Rejected', 'now', resp.message, { autohide: true, delay: 3000 }).show();
                            $('#te-save-status').text('rejected');
                        } else {
                            new Toast('Error', 'now', resp.error || 'Failed').show();
                        }
                    });
                }}
            ]);
            d.show();
        });
    }

    // ── Keyboard ──
    function bindKeyboard() {
        $(document).on('keydown.te', function (e) {
            if (!document.getElementById('theme-editor')) return;
            if (e.key === 'Tab') {
                e.preventDefault();
                toggleZen(!zenMode);
            }
            if (e.key === 'Escape') {
                if (zenMode) { toggleZen(false); return; }
                if (selectedElementIdx !== null || selectedChildIdx !== null) {
                    selectedElementIdx = null;
                    selectedChildIdx = null;
                    highlightDepth(null);
                    resumeParallax();
                    renderLayerTree();
                    showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
                    $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
                    return;
                }
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                saveTheme();
            }
            if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
                e.preventDefault();
                doUndo();
            }
            if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.shiftKey && (e.key === 'z' || e.key === 'Z')))) {
                e.preventDefault();
                doRedo();
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (document.activeElement.tagName === 'INPUT') return;
                if (selectedElementIdx !== null && selectedLayerIdx !== null) {
                    editorState.layers[selectedLayerIdx].elements.splice(selectedElementIdx, 1);
                    selectedElementIdx = null;
                    markDirty();
                    renderLayerTree();
                    debouncedRenderScene();
                    showPropsFor('layer');
                }
            }
            // Ctrl+D duplicate
            if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
                e.preventDefault();
                duplicateSelected();
            }
            // Ctrl+]/[ move layer up/down
            if ((e.metaKey || e.ctrlKey) && e.key === ']' && selectedLayerIdx !== null) {
                e.preventDefault();
                moveLayer(selectedLayerIdx, -1);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === '[' && selectedLayerIdx !== null) {
                e.preventDefault();
                moveLayer(selectedLayerIdx, 1);
            }
            // Arrow key nudge: 1% per press, 0.2% with Shift
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) !== -1) {
                if (document.activeElement.tagName === 'INPUT') return;
                var target = getSelectedTarget();
                if (!target) return;
                e.preventDefault();
                var step = e.shiftKey ? 0.2 : 1;
                var x = parseFloat(target.x) || 0;
                var y = parseFloat(target.y) || 0;
                if (e.key === 'ArrowLeft') x -= step;
                if (e.key === 'ArrowRight') x += step;
                if (e.key === 'ArrowUp') y -= step;
                if (e.key === 'ArrowDown') y += step;
                x = Math.max(-20, Math.min(90, parseFloat(x.toFixed(1))));
                y = Math.max(-20, Math.min(90, parseFloat(y.toFixed(1))));
                target.x = x + '%';
                target.y = y + '%';
                markDirty();
                updateElementInPlace(target);
                // Also update the DOM left/top directly
                var elIdxStr = selectedChildIdx !== null
                    ? selectedElementIdx + '.' + selectedChildIdx
                    : String(selectedElementIdx);
                var $el = $('#scene .te-element[data-layer-idx="' + selectedLayerIdx + '"][data-el-idx="' + elIdxStr + '"]');
                if ($el.length) {
                    $el[0].style.left = target.x;
                    $el[0].style.top = target.y;
                    $el[0].style.bottom = 'auto';
                    $el[0].style.right = 'auto';
                    updateCoordsReadout($el);
                }
                showPropsFor(selectedChildIdx !== null ? 'child' : 'element');
            }
        });
    }

    // ── Zen mode ──
    function toggleZen(on) {
        zenMode = on;
        $editor.toggleClass('zen', on);
        $('#te-zen-exit').toggle(on);
    }

    // ── 3D peek ──
    var peek3DOpen = false;
    function toggle3DPeek() {
        if (peek3DOpen) {
            $('#te-3d-overlay').remove();
            peek3DOpen = false;
            $('#te-3d-btn').removeClass('active');
            return;
        }
        peek3DOpen = true;
        $('#te-3d-btn').addClass('active');

        var $overlay = $('<div id="te-3d-overlay" class="te-3d-overlay">' +
            '<div class="te-3d-viewport">' +
                '<div class="te-3d-stack" id="te-3d-stack"></div>' +
            '</div>' +
            '<div class="te-3d-footer">' +
                '<span class="te-hint">Click a plate to select that layer</span>' +
                '<button class="te-btn te-btn-glass te-btn-sm" id="te-3d-close">Close 3D ✕</button>' +
            '</div>' +
        '</div>');

        var $stack = $overlay.find('#te-3d-stack');
        var total = editorState.layers.length;
        editorState.layers.forEach(function (layer, i) {
            var zOff = i * 30;
            var isSelected = selectedLayerIdx === i;
            var firstImg = '';
            if (layer.elements && layer.elements.length && layer.elements[0].image) {
                firstImg = 'url(' + layer.elements[0].image + ') center/cover';
            }
            var bg = firstImg || 'linear-gradient(135deg, #3a4459, #1c2330)';
            var $plate = $('<div class="te-3d-plate' + (isSelected ? ' selected' : '') + '" data-idx="' + i + '" style="transform:translateZ(' + zOff + 'px);background:' + bg + '">' +
                '<span class="te-3d-plate-label">' + (layer.name || 'Layer ' + (i+1)) + ' · ' + layer.depth + '</span>' +
            '</div>');
            $stack.append($plate);
        });

        $editor.append($overlay);

        $overlay.on('click', '.te-3d-plate', function () {
            selectLayer(parseInt($(this).data('idx')));
            toggle3DPeek();
        });
        $overlay.on('click', '#te-3d-close', function () {
            toggle3DPeek();
        });

        // Drag to rotate 3D view
        var rotX = 40, rotY = -15, zoomScale = 1;
        $overlay.on('mousedown', function (e) {
            if ($(e.target).closest('#te-3d-close').length) return;
            var isPlate = $(e.target).closest('.te-3d-plate').length > 0;
            var startX = e.clientX, startY = e.clientY;
            var startRotX = rotX, startRotY = rotY;
            var moved = false;
            function onMove(ev) {
                var dx = ev.clientX - startX, dy = ev.clientY - startY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
                rotY = startRotY + dx * 0.5;
                rotX = Math.max(5, Math.min(80, startRotX - dy * 0.5));
                $stack.css('transform', 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(' + zoomScale + ')');
            }
            function onUp(ev) {
                $(document).off('mousemove.te3d mouseup.te3d');
                if (!moved && isPlate) {
                    var idx = $(ev.target).closest('.te-3d-plate').data('idx');
                    if (idx !== undefined) { selectLayer(parseInt(idx)); toggle3DPeek(); }
                }
            }
            $(document).on('mousemove.te3d', onMove).on('mouseup.te3d', onUp);
            e.preventDefault();
        });

        // Scroll to zoom
        $overlay.on('wheel', function (e) {
            zoomScale += e.originalEvent.deltaY > 0 ? -0.1 : 0.1;
            zoomScale = Math.max(0.5, Math.min(2.5, zoomScale));
            $stack.css('transform', 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(' + zoomScale + ')');
            e.preventDefault();
        });
    }

    // ── Idle auto-hide ──
    function resetIdleTimer() {
        $editor.removeClass('idle');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
            if (!zenMode) $editor.addClass('idle');
        }, 6000);
    }
    $(document).on('mousemove.teidle', resetIdleTimer);

    // ── Drag & drop uploads ──
    function bindDragDrop() {
        var $overlay = $('#te-drop-overlay');

        document.addEventListener('dragenter', function (e) {
            if (e.dataTransfer.types.includes('Files')) {
                $overlay.show();
            }
        });
        $overlay.on('dragleave', function (e) {
            if (e.target === this) $overlay.hide();
        });
        $overlay.on('dragover', function (e) { e.preventDefault(); });
        $overlay.on('drop', function (e) {
            e.preventDefault();
            $overlay.hide();
            var files = e.originalEvent.dataTransfer.files;
            if (!files.length) return;
            handleFileUpload(files[0], 'new-layer');
        });

        // Also allow drop on layer rows
        $(document).on('dragover', '.te-layer-row', function (e) {
            e.preventDefault();
            $(this).addClass('drop-into');
        });
        $(document).on('dragleave', '.te-layer-row', function () {
            $(this).removeClass('drop-into');
        });
        $(document).on('drop', '.te-layer-row', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('drop-into');
            $overlay.hide();
            var idx = parseInt($(this).data('idx'));
            var files = e.originalEvent.dataTransfer.files;
            if (!files.length) return;
            handleFileUpload(files[0], 'replace-layer', idx);
        });

        // Drop on child rail = nest as element
        $(document).on('dragover', '.te-child-rail', function (e) {
            e.preventDefault();
            $(this).css('background', 'rgba(226,109,92,.1)');
        });
        $(document).on('dragleave', '.te-child-rail', function () {
            $(this).css('background', '');
        });
        $(document).on('drop', '.te-child-rail', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).css('background', '');
            $overlay.hide();
            var li = parseInt($(this).data('layerIdx'));
            var files = e.originalEvent.dataTransfer.files;
            if (!files.length || isNaN(li)) return;
            handleFileUpload(files[0], 'element', li);
        });
    }

    // ── File upload ──
    function triggerUpload(action, layerIdx, elIdx) {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.png,.jpg,.jpeg,.webp,.svg';
        input.onchange = function () {
            if (this.files.length) handleFileUpload(this.files[0], action, layerIdx, elIdx);
        };
        input.click();
    }

    function showAssetPicker(action, layerIdx, elIdx) {
        var d = new Dialog('Pick from Assets',
            '<div class="text-center py-3"><div class="spinner-border spinner-border-sm"></div> Loading assets...</div>',
            'xlarge');
        d.setButtons([{ "name": "Cancel", "class": "btn-secondary", "dismiss": true }]);
        d.setEvents([{
            action: 'shown',
            callback: function (event) {
                var $modal = $(event.data.modal);
                $.get('/api/app/user_files?mode=picker&filter=theme').done(function (html) {
                    $modal.find('.modal-body').html(html);
                    $modal.on('click', '.uf-item', function () {
                        var url = $(this).data('url');
                        var filename = $(this).data('filename');
                        if (url) {
                            d.hide();
                            applyUpload(url, action, layerIdx, elIdx, filename);
                        }
                    });
                    $modal.on('click', '#uf-upload-new', function () {
                        d.hide();
                        triggerUpload(action, layerIdx, elIdx);
                    });
                    // Client-side filter pills
                    $modal.on('click', '.uf-filter-pill', function () {
                        var f = $(this).data('filter');
                        $modal.find('.uf-filter-pill').removeClass('active');
                        $(this).addClass('active');
                        if (f === 'all') {
                            $modal.find('.uf-item').show();
                        } else {
                            $modal.find('.uf-item').hide().filter('[data-feature="' + f + '"]').show();
                        }
                    });
                    $modal.find('.uf-filter-pill[data-filter="theme_layer"]').trigger('click');
                }).fail(function () {
                    $modal.find('.modal-body').html('<div class="text-danger text-center py-3">Failed to load assets.</div>');
                });
            }
        }]);
        d.show();
    }

    function handleFileUpload(file, action, layerIdx, elIdx) {
        if (file.size > 5 * 1024 * 1024) {
            new Toast('Error', 'now', 'Max file size is 5MB', { autohide: true, delay: 3000 }).show();
            return;
        }

        var fd = new FormData();
        fd.append('file', file);
        fd.append('theme_id', editorState.theme_id || 'draft');

        $.ajax({
            url: '/api/app/user_theme_upload',
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            success: function (resp) {
                if (resp.result !== 'success') {
                    new Toast('Error', 'now', resp.error || 'Upload failed').show();
                    return;
                }
                applyUpload(resp.url, action, layerIdx, elIdx, file.name);
            },
            error: function () {
                new Toast('Error', 'now', 'Upload failed').show();
            }
        });
    }

    function applyUpload(url, action, layerIdx, elIdx, filename) {
        if (action === 'new-layer') {
            var depth = 0.5;
            if (editorState.layers.length > 0) {
                var lastDepth = editorState.layers[editorState.layers.length - 1].depth;
                depth = Math.max(0.05, lastDepth - 0.1);
            }
            var newIdx = editorState.layers.length;
            editorState.layers.push({
                depth: parseFloat(depth.toFixed(2)),
                name: filename ? filename.replace(/\\.[^.]+$/, '') : 'Layer',
                elements: [{
                    image: url,
                    x: '-5%', y: '-5%',
                    width: '110%', height: '110%',
                    css: 'background-size:cover;background-position:center;border:none',
                    animation: '', animation_duration: ''
                }]
            });
            expandedLayers[newIdx] = true;
        } else if (action === 'replace-layer' && layerIdx !== undefined) {
            var layer = editorState.layers[layerIdx];
            if (layer.elements && layer.elements.length > 0) {
                layer.elements[0].image = url;
            }
        } else if (action === 'element' && layerIdx !== undefined) {
            if (!editorState.layers[layerIdx].elements) editorState.layers[layerIdx].elements = [];
            editorState.layers[layerIdx].elements.push({
                image: url,
                x: '30%', y: '20%',
                width: '30%', height: '30%',
                animation: '',
                animation_duration: '4s'
            });
            expandedLayers[layerIdx] = true;
        } else if (action === 'replace-element' && layerIdx !== undefined && elIdx !== undefined) {
            editorState.layers[layerIdx].elements[elIdx].image = url;
        } else if (action === 'add-child' && layerIdx !== undefined && elIdx !== undefined) {
            var parentEl = editorState.layers[layerIdx].elements[elIdx];
            if (!parentEl.children) parentEl.children = [];
            parentEl.children.push({
                image: url,
                x: '20%', y: '20%',
                width: '30%', height: '30%',
                animation: '',
                animation_duration: '4s'
            });
        } else if (action === 'replace-child' && layerIdx !== undefined && elIdx !== undefined) {
            var childTarget = editorState.layers[layerIdx].elements[elIdx].children;
            if (childTarget && childTarget[selectedChildIdx]) {
                childTarget[selectedChildIdx].image = url;
            }
        }
        markDirty();
        renderLayerTree(true);
        renderScene();

        // Auto-select newly added element/child so it's immediately editable
        if (action === 'element' && layerIdx !== undefined) {
            var newElIdx = editorState.layers[layerIdx].elements.length - 1;
            selectElement(layerIdx, newElIdx, true);
        } else if (action === 'add-child' && layerIdx !== undefined && elIdx !== undefined) {
            var pe = editorState.layers[layerIdx].elements[elIdx];
            if (pe && pe.children) selectChild(layerIdx, elIdx, pe.children.length - 1, true);
        } else if (action === 'new-layer') {
            selectLayer(editorState.layers.length - 1);
        }
    }

    // ── Save ──
    function showSlotPurchaseDialog(price, used, max, retryAction) {
        var body = '<div style="text-align:center;padding:0.5rem 0">' +
            '<div style="font-size:2rem;margin-bottom:0.5rem">🎨</div>' +
            '<p>' + (max === 1 ? 'Your free theme slot is full.' : 'All <b>' + max + '</b> theme slots are full (' + used + '/' + max + ').') + '</p>' +
            '<div class="liquid-rim" style="padding:0.75rem;border-radius:0.5rem;margin-bottom:0.75rem">' +
                '<div style="font-size:0.9rem"><b>Unlock slot #' + (max + 1) + '</b></div>' +
                '<div style="font-size:1.5rem;font-weight:700;margin:0.25rem 0">' + price + ' ⚡</div>' +
                '<div style="font-size:0.8rem;opacity:0.7">Next slot costs ' + Math.min(price + 50, 500) + ' ⚡ · Max 50 slots</div>' +
            '</div>' +
            '<p style="font-size:0.8rem;opacity:0.6">Or delete an existing theme to free up a slot.</p>' +
        '</div>';
        var d = new Dialog('Theme Slot Full', body, 'small');
        d.setButtons([
            { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
            { name: '⚡ Buy & Save', class: 'btn btn-primary', dismiss: true, onClick: function () {
                $.post('/api/app/user_theme_slot', function (resp) {
                    if (resp.result === 'success') {
                        new Toast('Unlocked', 'now', resp.message, { autohide: true, delay: 2000 }).show();
                        saveTheme(retryAction || 'save');
                    } else {
                        new Toast('Error', 'now', resp.error || 'Purchase failed').show();
                    }
                }).fail(function () { new Toast('Error', 'now', 'Purchase failed').show(); });
            }}
        ]);
        d.show();
    }

    function saveTheme(action, onSaved) {
        action = action || 'save';
        if (!editorState.name.trim()) {
            new Toast('Warning', 'now', 'Please enter a theme name', { autohide: true, delay: 3000 }).show();
            $('#te-title-input').focus();
            return;
        }
        if (editorState.layers.length === 0) {
            new Toast('Warning', 'now', 'Add at least one layer', { autohide: true, delay: 3000 }).show();
            return;
        }

        $('.te-save-action').prop('disabled', true);
        $('#te-save-btn').text('Saving...');

        var bgCover = document.querySelector('.bg-cover');
        if (bgCover && bgCover.offsetWidth && bgCover.offsetHeight) {
            editorState.design_ratio = parseFloat((bgCover.offsetWidth / bgCover.offsetHeight).toFixed(4));
        }

        captureThumbnail(function (thumbnailUrl) {
            var configData = {
                name: editorState.name,
                type: editorState.type,
                mode: 'element',
                scene: editorState.scene,
                blur: editorState.blur,
                layer_offset: editorState.layer_offset,
                design_ratio: editorState.design_ratio,
                layers: editorState.layers,
                accent: editorState.accent,
                forked_from: editorState.forked_from
            };
            if (thumbnailUrl) configData.thumbnail_url = thumbnailUrl;

            var payload = { config: JSON.stringify(configData) };
            if (editorState.theme_id) payload.theme_id = editorState.theme_id;

            $.post('/api/app/user_themes', payload, function (resp) {
                if (resp.result === 'success') {
                    editorState.dirty = false;
                    editorState.theme_id = resp.theme_id || editorState.theme_id;
                    $('#te-save-status').text('saved');
                    // Invalidate IndexedDB texture cache so next page load gets fresh textures
                    try { indexedDB.deleteDatabase('parallax_cache'); } catch (e) {}
                    // Update URL to edit mode so subsequent saves work
                    if (editorState.theme_id && window.history.replaceState) {
                        window.history.replaceState(null, '', '/theme/editor?edit=' + editorState.theme_id);
                    }

                    var thumbPreview = thumbnailUrl
                        ? '<img src="' + thumbnailUrl + '" style="width:100%;max-width:200px;border-radius:6px;margin-top:6px;display:block;">'
                        : '';

                    if (action === 'apply' || action === 'exit') {
                        $.get('/api/app/set_theme?id=custom:' + editorState.theme_id, function () {
                            var msg = (action === 'exit' ? 'Theme applied!' : 'Saved & applied') + thumbPreview;
                            new Toast('Saved', 'now', msg, { autohide: true, delay: thumbPreview ? 4000 : 2000 }).show();
                            if (action === 'exit') {
                                setTimeout(function () { window.location.href = '/dashboard'; }, 1200);
                            }
                        });
                    } else {
                        new Toast('Saved', 'now', 'Theme saved' + thumbPreview, { autohide: true, delay: thumbPreview ? 4000 : 2000 }).show();
                        if (typeof onSaved === 'function') onSaved();
                    }
                } else if (resp.code === 'slot_limit') {
                    showSlotPurchaseDialog(resp.next_price, resp.slots_used, resp.slots_max, action);
                } else {
                    new Toast('Error', 'now', resp.error || 'Save failed').show();
                }
            }).fail(function (xhr) {
                var resp = xhr.responseJSON || {};
                if (resp.code === 'slot_limit') {
                    showSlotPurchaseDialog(resp.next_price, resp.slots_used, resp.slots_max, action);
                } else {
                    new Toast('Error', 'now', resp.error || 'Save failed').show();
                }
            }).always(function () {
                $('.te-save-action').prop('disabled', false);
                $('#te-save-btn').text('Save');
            });
        });
    }

    function captureThumbnail(callback) {
        if (typeof html2canvas !== 'function') {
            callback(null);
            return;
        }
        var scene = document.getElementById('scene');
        if (!scene) { callback(null); return; }

        // Clean scene for screenshot: deselect, clear dim, remove handles, apply saved filter
        $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
        var prevLayer = selectedLayerIdx, prevEl = selectedElementIdx, prevChild = selectedChildIdx;
        selectedElementIdx = null;
        selectedChildIdx = null;
        highlightDepth(null);
        applyActiveSceneFilter();

        var wasZen = zenMode;
        if (!wasZen) toggleZen(true);

        setTimeout(function () {
            html2canvas(scene, {
                scale: 0.5,
                useCORS: true,
                backgroundColor: editorState.scene.background_color || '#000',
                width: window.innerWidth,
                height: window.innerHeight
            }).then(function (fullCanvas) {
                if (!wasZen) toggleZen(false);
                // Restore selection and filter
                selectedLayerIdx = prevLayer;
                selectedElementIdx = prevEl;
                selectedChildIdx = prevChild;
                renderScene();

                // Scale full capture down to thumbnail, applying scene filter
                var thumb = document.createElement('canvas');
                thumb.width = 480;
                thumb.height = Math.round(480 * fullCanvas.height / fullCanvas.width);
                var ctx = thumb.getContext('2d');
                var isDark = document.documentElement.getAttribute('data-coreui-theme') === 'dark';
                var sf = isDark ? (editorState.scene.filter_dark || {}) : (editorState.scene.filter_light || {});
                var sat = sf.saturate != null ? sf.saturate : 100;
                var bri = sf.brightness != null ? sf.brightness : 100;
                var con = sf.contrast != null ? sf.contrast : 100;
                if (sat !== 100 || bri !== 100 || con !== 100) {
                    ctx.filter = 'saturate(' + sat + '%) brightness(' + bri + '%) contrast(' + con + '%)';
                }
                ctx.drawImage(fullCanvas, 0, 0, thumb.width, thumb.height);
                var canvas = thumb;

                canvas.toBlob(function (blob) {
                    if (!blob) { callback(null); return; }
                    var fd = new FormData();
                    fd.append('file', blob, 'thumbnail.jpg');
                    fd.append('theme_id', editorState.theme_id || 'draft');
                    $.ajax({
                        url: '/api/app/user_theme_upload',
                        method: 'POST',
                        data: fd,
                        processData: false,
                        contentType: false,
                        success: function (resp) {
                            callback(resp.result === 'success' ? resp.url : null);
                        },
                        error: function () { callback(null); }
                    });
                }, 'image/jpeg', 0.8);
            }).catch(function () {
                if (!wasZen) toggleZen(false);
                callback(null);
            });
        }, 300);
    }

    // ── Dirty state ──
    var undoTimer = null;
    var lastSnapshot = null;

    function captureSnapshot() {
        return JSON.stringify({
            layers: editorState.layers,
            scene: editorState.scene,
            blur: editorState.blur,
            layer_offset: editorState.layer_offset,
            design_ratio: editorState.design_ratio,
            type: editorState.type,
            name: editorState.name,
            accent: editorState.accent
        });
    }

    function restoreSnapshot(snapshot) {
        var data = JSON.parse(snapshot);
        editorState.layers = data.layers;
        editorState.scene = data.scene;
        editorState.blur = data.blur;
        editorState.layer_offset = data.layer_offset;
        editorState.design_ratio = data.design_ratio || 1.778;
        editorState.type = data.type;
        editorState.name = data.name;
        editorState.accent = data.accent;
    }

    function doUndo() {
        if (!undoStack.length) return;
        redoStack.push(captureSnapshot());
        restoreSnapshot(undoStack.pop());
        lastSnapshot = captureSnapshot();
        selectedElementIdx = null;
        selectedChildIdx = null;
        populateControls();
        renderLayerTree();
        debouncedRenderScene();
        showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
    }

    function doRedo() {
        if (!redoStack.length) return;
        undoStack.push(captureSnapshot());
        restoreSnapshot(redoStack.pop());
        lastSnapshot = captureSnapshot();
        selectedElementIdx = null;
        selectedChildIdx = null;
        populateControls();
        renderLayerTree();
        debouncedRenderScene();
        showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
    }

    function markDirty() {
        // Push undo snapshot (debounced — rapid changes like slider drags batch into one undo step)
        if (!undoTimer) {
            var snap = lastSnapshot || captureSnapshot();
            undoStack.push(snap);
            if (undoStack.length > MAX_UNDO) undoStack.shift();
            redoStack = [];
        }
        clearTimeout(undoTimer);
        undoTimer = setTimeout(function () {
            undoTimer = null;
            lastSnapshot = captureSnapshot();
        }, 500);
        editorState.dirty = true;
        $('#te-save-status').text('unsaved');
    }

    // ── Util ──
    function hexToRgba(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha.toFixed(2) + ')';
    }

    function rgbaToHex(rgba) {
        var m = rgba.match(/[\\d.]+/g);
        if (!m || m.length < 3) return '#000000';
        return '#' + [m[0], m[1], m[2]].map(function (c) {
            return ('0' + parseInt(c).toString(16)).slice(-2);
        }).join('');
    }

    function truncate(s, n) {
        return s.length > n ? s.substring(0, n) + '…' : s;
    }

    function isMac() {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    }

    function renderShortcutHints() {
        var mod = isMac() ? '⌘' : 'Ctrl+';
        $('#te-shortcuts').html(
            '<kbd>' + mod + 'Z</kbd> undo · ' +
            '<kbd>' + mod + '⇧Z</kbd> redo · ' +
            '<kbd>' + mod + 'D</kbd> dup · ' +
            '<kbd>' + mod + 'S</kbd> save · ' +
            '<kbd>Tab</kbd> zen · ' +
            '<kbd>Esc</kbd> deselect'
        );
    }

    function bindPanelDrag() {
        $('.te-panel').each(function () {
            var $panel = $(this);

            $panel.on('mousedown.tepanel', function (e) {
                if ($(e.target).closest('.te-btn, input, select, textarea, a, label, .te-chip, .te-toggle, .te-layer-row, .te-el-row, .te-child-row, .te-add-row, .te-layer-eye, .te-el-eye, .te-anim-chips, .swatch-circle, [type="color"], [type="range"]').length) return;
                // Don't intercept the native resize grip (bottom-right 18px corner)
                var rect = this.getBoundingClientRect();
                if (e.clientX > rect.right - 18 && e.clientY > rect.bottom - 18) return;
                e.preventDefault();
                var startX = e.clientX, startY = e.clientY;
                var panelEl = $panel[0];
                var rect = panelEl.getBoundingClientRect();
                var startLeft = rect.left;
                var startTop = rect.top;

                $panel.addClass('te-panel-dragged');
                panelEl.style.left = startLeft + 'px';
                panelEl.style.top = startTop + 'px';

                function onMove(ev) {
                    panelEl.style.left = (startLeft + ev.clientX - startX) + 'px';
                    panelEl.style.top = (startTop + ev.clientY - startY) + 'px';
                }
                function onUp() {
                    $(document).off('mousemove.tepanel mouseup.tepanel');
                    savePanelPositions();
                }
                $(document).on('mousemove.tepanel', onMove).on('mouseup.tepanel', onUp);
            });
        });
    }

    var panelSaveTimer = null;
    function savePanelPositions() {
        var positions = {};
        $('.te-panel').each(function () {
            var id = this.id;
            if (!id) return;
            var entry = {};
            if (this.classList.contains('te-panel-dragged')) {
                entry.left = this.style.left;
                entry.top = this.style.top;
            }
            var w = this.style.width || this.offsetWidth + 'px';
            if (parseInt(w) !== 300) entry.width = w;
            if (Object.keys(entry).length) positions[id] = entry;
        });
        clearTimeout(panelSaveTimer);
        panelSaveTimer = setTimeout(function () {
            $.post('/api/app/preferences', {
                preference_id: 'theme_editor_panels',
                value: JSON.stringify(positions)
            });
        }, 500);
    }

    function restorePanelPositions() {
        // Positions + widths are rendered server-side via inline styles
    }

    function observePanelResize() {
        if (!window.ResizeObserver) return;
        var ro = new ResizeObserver(function () { savePanelPositions(); });
        $('.te-panel').each(function () { ro.observe(this); });
    }

    function bindBeforeUnload() {
        window.addEventListener('beforeunload', function (e) {
            if (editorState.dirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    // ── Help dialog ──
    function showHelp() {
        $.get('/api/app/theme_help').done(function (html) {
            var d = new Dialog('Theme Editor Guide', html, 'xlarge');
            d.show();

            var $modal = $('#' + d.cloneId);
            var total = $modal.find('.te-help-section').length;
            var current = 0;

            function go(idx) {
                if (idx < 0 || idx >= total) return;
                current = idx;
                $modal.find('.te-help-nav-btn').removeClass('active').filter('[data-idx="' + idx + '"]').addClass('active');
                $modal.find('.te-help-section').removeClass('active').filter('[data-idx="' + idx + '"]').addClass('active');
                $modal.find('.te-help-prev').prop('disabled', idx === 0);
                $modal.find('.te-help-next').prop('disabled', idx === total - 1);
                $modal.find('.te-help-counter').text((idx + 1) + ' / ' + total);
                $modal.find('.te-help-nav-btn.active')[0].scrollIntoView({ block: 'nearest', inline: 'center' });
            }

            $modal.on('click', '.te-help-nav-btn', function () { go(parseInt($(this).data('idx'))); });
            $modal.on('click', '.te-help-prev', function () { go(current - 1); });
            $modal.on('click', '.te-help-next', function () { go(current + 1); });
        });
    }

    // ── Boot ──
    $(document).ready(init);
})();
`;
class rw {
  mount;
  options;
  objectUrls = [];
  scene;
  root;
  restoreEndpoints;
  restoreGlobals;
  constructor(A) {
    this.options = A, this.mount = Aw(A.mount), this.scene = gt(A.value), this.renderShell(), this.restoreGlobals = _B(A), this.restoreEndpoints = A.passthrough ? () => {
    } : $B(A, this.objectUrls, (t) => {
      this.scene = gt(t);
    }), WB();
  }
  getValue() {
    return JSON.parse(JSON.stringify(this.scene));
  }
  destroy() {
    const A = Lt;
    Lt(document).off(".te .tecanvas .tecursor .tedrag .teresize .terotate .tepanel"), A(document).off("click", ".te-layer-row"), A(document).off("click", ".te-child-row"), A(document).off("click", ".te-grandchild-row"), A(document).off("click", ".te-expand-toggle"), this.restoreEndpoints?.(), this.restoreGlobals?.(), this.root?.remove(), this.objectUrls.forEach((t) => URL.revokeObjectURL(t)), this.objectUrls.length = 0;
  }
  renderShell() {
    const A = document.createElement("div");
    A.className = "pss-labs-editor-host", A.innerHTML = PB(this.scene, this.options), this.mount.replaceChildren(A), this.root = A, window.__themeEditorConfig = this.scene, window.__themeEditorMode = this.options.mode || "new", document.documentElement.getAttribute("data-coreui-theme") || document.documentElement.setAttribute("data-coreui-theme", "dark"), document.body.classList.add("hwa-enabled");
  }
}
function _B(e) {
  const A = window, t = {
    $: A.$,
    jQuery: A.jQuery,
    Parallax: A.Parallax,
    Sortable: A.Sortable,
    html2canvas: A.html2canvas,
    coreui: A.coreui,
    Dialog: A.Dialog,
    Toast: A.Toast
  }, n = window.history.replaceState.bind(window.history);
  if (A.$ = Lt, A.jQuery = Lt, A.Parallax = ol, A.Sortable = eA, A.html2canvas = bc, A.coreui = t.coreui || JB(), A.Dialog = zB(), A.Toast = jB(e), e.preservePageUrl !== !1 && (window.history.replaceState = function(s, l, u) {
    typeof u == "string" && u.startsWith("/theme/editor?edit=") || n(s, l, u);
  }), e.onExit) {
    const i = (s) => {
      s.preventDefault(), e.onExit?.();
    };
    window.addEventListener("beforeunload", i, { capture: !0 }), t.__exitListener = i;
  }
  return () => {
    A.$ = t.$, A.jQuery = t.jQuery, A.Parallax = t.Parallax, A.Sortable = t.Sortable, A.html2canvas = t.html2canvas, A.coreui = t.coreui, A.Dialog = t.Dialog, A.Toast = t.Toast, window.history.replaceState = n;
    const i = t.__exitListener;
    typeof i == "function" && window.removeEventListener("beforeunload", i, { capture: !0 });
  };
}
function $B(e, A, t) {
  const n = Lt, i = n.ajax.bind(n), s = n.post.bind(n), l = n.get.bind(n), u = n;
  return u.post = function(g, w, v, U) {
    return typeof g != "string" ? s(g, w, v, U) : GB(g, w, v, e, t) || s(g, w, v, U);
  }, u.get = function(g, w, v, U) {
    return typeof g != "string" ? l(g, w, v, U) : XB(g, w, v, e) || l(g, w, v, U);
  }, u.ajax = function(g) {
    if (typeof g != "object" || g === null) return i(g);
    const w = g;
    return w.url === "/api/app/user_theme_upload" ? VB(w, e, A) : i(g);
  }, () => {
    u.ajax = i, u.post = s, u.get = l;
  };
}
function GB(e, A, t, n, i) {
  const s = A;
  if (e === "/api/app/preferences") {
    const l = String(s?.preference_id || ""), u = String(s?.value ?? ""), f = Promise.resolve(n.onSavePreferences?.(l, u)).then(() => ({ result: "success" }));
    return We(f, t);
  }
  if (e === "/api/app/user_theme_slot")
    return We(Promise.resolve({ result: "success", message: "Theme slot unlocked." }), t);
  if (e === "/api/admin/themes/review")
    return We(Promise.resolve({ result: "success", message: "Review action saved." }), t);
  if (e === "/api/app/user_themes") {
    if (s?._method === "SUBMIT")
      return We(Promise.resolve({ result: "success" }), t);
    const l = typeof s?.config == "string" ? JSON.parse(s.config) : null, u = gt(l || n.value), f = {
      apply: String(s?.action) === "apply" || String(s?.action) === "exit",
      exit: String(s?.action) === "exit",
      themeId: s?.theme_id || u.theme_id,
      thumbnailDataUri: s?.thumbnail_url
    }, g = Promise.resolve(n.onSave?.(u, f)).then((w) => {
      const v = w?.theme_id || f.themeId || "local-demo";
      return i(u), n.onChange?.(u), f.apply && n.onApply && Promise.resolve(n.onApply(v)).catch(() => {
      }), { result: "success", theme_id: v };
    });
    return We(g, t);
  }
  return null;
}
function XB(e, A, t, n) {
  if (e.startsWith("/api/app/user_files")) {
    const i = Promise.resolve(n.getAssetPickerHtml?.() || qB());
    return We(i, t);
  }
  if (e === "/api/app/theme_help") {
    const i = Promise.resolve(n.getHelpHtml?.() || ZB());
    return We(i, t);
  }
  if (e.startsWith("/api/app/set_theme")) {
    const i = new URL(e, window.location.origin).searchParams.get("id") || "", s = Promise.resolve(n.onApply?.(i)).then(() => ({ result: "success" }));
    return We(s, t);
  }
  return null;
}
function VB(e, A, t) {
  const i = (e.data instanceof FormData ? e.data : null)?.get("file"), s = i instanceof File ? YB(i, A, t) : Promise.reject(new Error("No file uploaded."));
  return s.then((l) => (Tn(e.success, l, "success", void 0), Tn(e.complete, void 0, "success"), l)).catch((l) => {
    Tn(e.error, void 0, "error", l.message), Tn(e.complete, void 0, "error");
  }), We(s);
}
async function YB(e, A, t) {
  if (A.onUpload) {
    const i = await A.onUpload(e, { scene: gt(A.value), target: "layer" });
    return { result: "success", url: typeof i == "string" ? i : i.url };
  }
  const n = URL.createObjectURL(e);
  return t.push(n), { result: "success", url: n };
}
function We(e, A) {
  typeof A == "function" && e.then((n) => {
    A(n);
  });
  const t = {
    done(n) {
      return e.then(n), t;
    },
    fail(n) {
      return e.catch(n), t;
    },
    always(n) {
      return e.finally(n), t;
    },
    then(n, i) {
      return e.then(n, i);
    }
  };
  return t;
}
function Tn(e, ...A) {
  if (Array.isArray(e)) {
    e.forEach((t) => Tn(t, ...A));
    return;
  }
  typeof e == "function" && e(...A);
}
function WB() {
  const e = new Function(
    "window",
    "document",
    "$",
    "jQuery",
    "Parallax",
    "Sortable",
    "html2canvas",
    "coreui",
    "Dialog",
    "Toast",
    `${NB}
//# sourceURL=parallax-scene-studio/labs-theme-editor.js`
  ), A = window;
  e(window, document, Lt, Lt, ol, eA, bc, A.coreui, A.Dialog, A.Toast);
}
function JB() {
  class e {
    static getInstance() {
      return null;
    }
    constructor(t, n) {
    }
    dispose() {
    }
  }
  return { Tooltip: e };
}
function jB(e) {
  return class {
    constructor(t, n, i, s) {
      this.title = t, this.message = i, this.toastOptions = s;
    }
    title;
    message;
    toastOptions;
    show() {
      e.notify?.(ew(this.message || this.title), tw(this.title));
      const t = document.createElement("div");
      t.className = "pss-labs-toast", t.innerHTML = `<strong>${Ec(this.title)}</strong><span>${this.message}</span>`, document.body.appendChild(t), this.toastOptions?.autohide !== !1 && window.setTimeout(() => t.remove(), this.toastOptions?.delay || 2400);
    }
  };
}
function zB() {
  return class {
    constructor(A, t, n = "medium") {
      this.title = A, this.body = t, this.size = n;
    }
    title;
    body;
    size;
    cloneId = `pss-labs-dialog-${Math.random().toString(36).slice(2)}`;
    buttons = [];
    events = [];
    setButtons(A) {
      this.buttons = A;
    }
    setEvents(A) {
      this.events = A;
    }
    show() {
      const A = document.createElement("div");
      A.id = this.cloneId, A.className = `modal pss-labs-dialog pss-labs-dialog-${this.size}`, A.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">${Ec(this.title)}</h5><button type="button" class="btn-close" data-dismiss="dialog">×</button></div>
            <div class="modal-body">${this.body}</div>
            <div class="modal-footer"></div>
          </div>
        </div>`;
      const t = A.querySelector(".modal-footer");
      this.buttons.forEach((n) => {
        const i = document.createElement("button");
        i.type = "button", i.className = n.class || "btn btn-secondary", i.textContent = n.name, i.addEventListener("click", () => {
          n.onClick?.(), n.dismiss && this.hide();
        }), t?.appendChild(i);
      }), A.querySelector('[data-dismiss="dialog"]')?.addEventListener("click", () => this.hide()), document.body.appendChild(A), this.events.filter((n) => n.action === "shown").forEach((n) => n.callback({ data: { modal: `#${this.cloneId}` } }));
    }
    hide() {
      document.getElementById(this.cloneId)?.remove();
    }
  };
}
function qB() {
  return '<div class="text-center py-3">No asset picker is configured for this demo. Use upload instead.</div>';
}
function ZB() {
  return '<div class="te-help-dialog"><div class="te-help-body"><div class="te-help-section active"><div class="te-help-text"><p>Select a layer or element, then drag, resize, rotate, and adjust properties from the panels.</p></div></div></div></div>';
}
function Aw(e) {
  const A = typeof e == "string" ? document.querySelector(e) : e;
  if (!A) throw new Error("Parallax Scene Studio mount element was not found.");
  return A;
}
function Ec(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function ew(e) {
  const A = document.createElement("div");
  return A.innerHTML = e, A.textContent || A.innerText || "";
}
function tw(e) {
  const A = e.toLowerCase();
  return A.includes("error") ? "error" : A.includes("warn") ? "warning" : A.includes("saved") || A.includes("success") ? "success" : "info";
}
export {
  rw as LabsThemeEditor,
  nw as ParallaxSceneStudio,
  bd as allowedAnimations,
  rl as cloneScene,
  nl as createDefaultScene,
  Sd as createPointerEngine,
  Ld as getSourceExport,
  il as normalizeElement,
  xd as normalizeLayer,
  gt as normalizeScene,
  Hd as renderParallaxScene,
  Id as validateScene
};
