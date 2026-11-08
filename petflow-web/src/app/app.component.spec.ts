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
});
