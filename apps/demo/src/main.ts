import { ParallaxSceneStudio, type ParallaxScene } from 'parallax-scene-studio';
import 'parallax-scene-studio/style.css';
import './style.css';

const stored = localStorage.getItem('pss-demo-scene');
const initialScene = stored ? JSON.parse(stored) as ParallaxScene : createDemoScene();
const app = document.querySelector<HTMLDivElement>('#app');

if (!app) throw new Error('Demo mount not found.');

const shell = document.createElement('div');
const banner = document.createElement('header');
const mount = document.createElement('div');
const status = document.createElement('span');

shell.className = 'demo-shell';
banner.className = 'demo-banner';
mount.id = 'studio';
status.className = 'demo-status';
status.textContent = 'Changes are stored in this browser.';

banner.innerHTML = `
  <div>
    <strong>Parallax Scene Studio</strong>
    <span>A WYSIWYG editor for layered parallax scenes.</span>
  </div>
`;
banner.append(status);
shell.append(banner, mount);
app.append(shell);

new ParallaxSceneStudio({
  mount,
  value: initialScene,
  showSourceCard: true,
  sourceCardDefaultOpen: false,
  onChange(scene) {
    localStorage.setItem('pss-demo-scene', JSON.stringify(scene));
    status.textContent = 'Saved locally.';
  },
  onSave(scene) {
    localStorage.setItem('pss-demo-scene', JSON.stringify(scene));
    status.textContent = 'Saved locally.';
  },
  notify(message, level = 'info') {
    status.textContent = `${level}: ${message}`;
  }
});

function createDemoScene(): ParallaxScene {
  return {
    schema_version: 1,
    name: 'Aurora Ridge',
    type: 'parallax',
    mode: 'scene',
    accent: '#39d98a',
    design_ratio: 1.778,
    scene: {
      background_color: '#091522',
      relative_input: true,
      scalar_x: 14,
      scalar_y: 10,
      friction_x: 0.12,
      friction_y: 0.12,
      invert_x: true,
      invert_y: true
    },
    blur: {
      dark: 'rgba(9, 21, 34, 0.92)',
      light: 'rgba(238, 246, 250, 0.92)'
    },
    layer_offset: { left: 0, top: 0 },
    layers: [
      {
        name: 'Sky',
        depth: 0.12,
        elements: [{
          image: svgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
              <defs>
                <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
                  <stop stop-color="#091522"/>
                  <stop offset=".55" stop-color="#163c52"/>
                  <stop offset="1" stop-color="#2a1f58"/>
                </linearGradient>
                <radialGradient id="glow" cx="68%" cy="24%" r="38%">
                  <stop stop-color="#88ffd7" stop-opacity=".85"/>
                  <stop offset=".35" stop-color="#38a3ff" stop-opacity=".28"/>
                  <stop offset="1" stop-color="#091522" stop-opacity="0"/>
                </radialGradient>
              </defs>
              <rect width="1600" height="900" fill="url(#sky)"/>
              <rect width="1600" height="900" fill="url(#glow)"/>
              <circle cx="1180" cy="170" r="84" fill="#f6fbff" opacity=".76"/>
            </svg>
          `),
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
      },
      {
        name: 'Ridge',
        depth: 0.38,
        elements: [{
          image: svgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
              <path d="M0 610 C160 560 260 500 420 548 C560 590 650 450 810 490 C970 530 1080 405 1220 468 C1370 535 1480 480 1600 430 L1600 900 L0 900 Z" fill="#1a3040"/>
              <path d="M0 710 C210 630 360 720 530 642 C720 554 850 700 1040 610 C1240 516 1390 590 1600 520 L1600 900 L0 900 Z" fill="#0f2430"/>
            </svg>
          `),
          x: '-7%',
          y: '12%',
          width: '114%',
          height: '98%',
          bgSize: 'cover',
          bgPosition: 'bottom center',
          bgRepeat: 'no-repeat',
          animation: '',
          animation_duration: '4s'
        }]
      },
      {
        name: 'Foreground',
        depth: 0.72,
        elements: [{
          image: svgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
              <path d="M0 760 C180 700 300 780 470 718 C650 650 800 795 980 712 C1180 620 1370 720 1600 660 L1600 900 L0 900 Z" fill="#07121c"/>
              <g opacity=".85" fill="#39d98a">
                <circle cx="220" cy="704" r="8"/>
                <circle cx="260" cy="724" r="4"/>
                <circle cx="1260" cy="674" r="7"/>
                <circle cx="1322" cy="708" r="5"/>
              </g>
            </svg>
          `),
          x: '-8%',
          y: '24%',
          width: '116%',
          height: '90%',
          bgSize: 'cover',
          bgPosition: 'bottom center',
          bgRepeat: 'no-repeat',
          animation: '',
          animation_duration: '4s'
        }]
      }
    ]
  };
}

function svgDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;
}

