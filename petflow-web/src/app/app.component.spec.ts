import { AppComponent } from './app.component';

describe('Reading preferences', () => {
  const key = 'petflow.reading-preferences';
  let root: HTMLElement;
  let storage: Map<string, string>;
  let documentStub: Document;

  beforeEach(() => {
    root = document.createElement('html');
    storage = new Map();
    documentStub = {
      documentElement: root,
      defaultView: {
        localStorage: {
          getItem: (name: string) => storage.get(name) ?? null,
          setItem: (name: string, value: string) => storage.set(name, value)
        }
      }
    } as unknown as Document;
  });

  it('migrates removed settings without discarding valid preferences', () => {
    storage.set(key, JSON.stringify({fontSize: 200, options: ['contrast', 'bold'], contrastOverride: true}));
    root.classList.add('reading-contrast');
    const app = new AppComponent(documentStub);
    expect(app.fontSize).toBe(100);
    expect(root.classList.contains('reading-contrast')).toBeFalse();
    expect(root.classList.contains('reading-bold')).toBeTrue();
    expect(JSON.parse(storage.get(key)!)).toEqual({fontSize: 100, options: ['bold']});
  });

  it('persists valid sizes and ignores removed controls', () => {
    const app = new AppComponent(documentStub);
    app.setFontSize('150');
    app.setFontSize('200');
    app.setOption('contrast', true);
    expect(new AppComponent(documentStub).fontSize).toBe(150);
    expect(root.style.fontSize).toBe('150%');
    expect(app.activeOptions.has('contrast')).toBeFalse();
  });

  it('restores the default appearance', () => {
    const app = new AppComponent(documentStub);
    app.setFontSize('130');
    app.setOption('highlight', true);
    app.resetPreferences();
    expect(root.style.fontSize).toBe('100%');
    expect(root.className).toBe('');
    expect(JSON.parse(storage.get(key)!)).toEqual({fontSize: 100, options: []});
  });

  it('works with corrupt or unavailable storage', () => {
    storage.set(key, '{invalid');
    expect(() => new AppComponent(documentStub)).not.toThrow();
    Object.defineProperty(documentStub.defaultView, 'localStorage', {
      get: () => { throw new Error('Storage unavailable'); }
    });
    const app = new AppComponent(documentStub);
    expect(() => app.setFontSize('115')).not.toThrow();
    expect(root.style.fontSize).toBe('115%');
  });

  it('applies the dyslexia and low-vision presets and persists new options', () => {
    const app = new AppComponent(documentStub);
    app.applyPreset(app.presets.find(p => p.key === 'dyslexia')!);
    expect(root.style.fontSize).toBe('115%');
    expect(root.classList.contains('reading-dyslexia')).toBeTrue();
    expect(root.classList.contains('reading-mask')).toBeTrue();
    expect(new AppComponent(documentStub).isOptionEnabled('wordSpacing')).toBeTrue();
    app.applyPreset(app.presets.find(p => p.key === 'lowVision')!);
    expect(root.style.fontSize).toBe('150%');
    expect(root.classList.contains('reading-dyslexia')).toBeFalse();
  });

  it('enables width, alignment and mask size controls individually', () => {
    const app = new AppComponent(documentStub);
    ['narrowLine', 'leftAlign', 'maskLarge'].forEach(key => app.setOption(key, true));
    ['narrowLine', 'leftAlign', 'maskLarge'].forEach(key =>
      expect(root.classList.contains('reading-' + key)).toBeTrue());
    app.setOption('narrowLine', false);
    expect(root.classList.contains('reading-narrowLine')).toBeFalse();
  });

  it('opens and closes the hub with the keyboard shortcut and Esc', () => {
    const app = new AppComponent(documentStub);
    const shortcut = new KeyboardEvent('keydown', { key: 'A', altKey: true, shiftKey: true, cancelable: true });
    app.onKeydown(shortcut);
    expect(app.open).toBeTrue();
    expect(shortcut.defaultPrevented).toBeTrue();
    app.onKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(app.open).toBeFalse();
  });
});
