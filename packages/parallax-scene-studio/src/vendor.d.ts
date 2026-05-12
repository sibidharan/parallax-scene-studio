declare module 'parallax-js' {
  export default class Parallax {
    constructor(element: HTMLElement, options?: Record<string, unknown>);
    destroy(): void;
    disable(): void;
    enable(): void;
    scalar(x: number, y: number): void;
    friction(x: number, y: number): void;
    invert(x: boolean, y: boolean): void;
  }
}

declare module '*?raw' {
  const source: string;
  export default source;
}
