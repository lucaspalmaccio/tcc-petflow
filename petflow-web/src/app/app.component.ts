import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';

const READING_PREFERENCES = 'petflow.reading-preferences';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  fontSize = 100;
  readonly fontSizes = [100, 115, 130, 150, 200];
  readonly options = [
    { key: 'spacing', label: 'Mais espaçamento' },
    { key: 'contrast', label: 'Alto contraste' },
    { key: 'bold', label: 'Texto em negrito' },
    { key: 'highlight', label: 'Realçar títulos e links' },
    { key: 'underline', label: 'Sublinhar títulos e links' },
    { key: 'colorVision', label: 'Paleta com padrões e ícones' }
  ];
  activeOptions = new Set<string>();
  private readonly systemContrast: MediaQueryList | undefined;
  private contrastOverride: boolean | null = null;
  private readonly syncContrast = () => this.applyPreferences();


  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.systemContrast = this.document.defaultView?.matchMedia('(prefers-contrast: more)');
    this.systemContrast?.addEventListener('change', this.syncContrast);
    try {
      const saved = JSON.parse(this.document.defaultView?.localStorage.getItem(READING_PREFERENCES) ?? 'null');
      if (this.fontSizes.includes(saved?.fontSize)) {
        this.fontSize = saved.fontSize;
      }
      if (typeof saved?.contrastOverride === 'boolean') {
        this.contrastOverride = saved.contrastOverride;
      } else if (saved?.contrastOverride === undefined && Array.isArray(saved?.options) && saved.options.includes('contrast')) {
        this.contrastOverride = true;
      }
      if (Array.isArray(saved?.options)) {
        this.activeOptions = new Set(this.options.map(option => option.key).filter(key => saved.options.includes(key)));
      }
    } catch {
      // Reading controls also work when storage is unavailable.
    }
    this.applyPreferences();
  }

  ngOnDestroy(): void {
    this.systemContrast?.removeEventListener('change', this.syncContrast);
  }

  isOptionEnabled(key: string): boolean {
    if (key === 'contrast') {
      return this.contrastOverride ?? this.systemContrast?.matches ?? false;
    }
    return this.activeOptions.has(key);
  }

  setFontSize(value: string): void {
    const size = Number(value);
    if (this.fontSizes.includes(size)) {
      this.fontSize = size;
      this.savePreferences();
    }
  }

  setOption(key: string, enabled: boolean): void {
    if (key === 'contrast') {
      this.contrastOverride = enabled;
    } else if (enabled) {
      this.activeOptions.add(key);
    } else {
      this.activeOptions.delete(key);
    }
    this.savePreferences();
  }

  resetPreferences(): void {
    this.fontSize = 100;
    this.activeOptions.clear();
    this.contrastOverride = null;
    this.savePreferences();
  }

  private applyPreferences(): void {
    const root = this.document.documentElement;
    root.style.fontSize = `${this.fontSize}%`;
    for (const option of this.options) {
      root.classList.toggle(`reading-${option.key}`, this.isOptionEnabled(option.key));
    }
  }

  private savePreferences(): void {
    this.applyPreferences();
    try {
      this.document.defaultView?.localStorage.setItem(READING_PREFERENCES, JSON.stringify({
        fontSize: this.fontSize,
        options: [...this.activeOptions],
        contrastOverride: this.contrastOverride
      }));
    } catch {
      // Keep preferences in memory for the current session.
    }
  }
}
