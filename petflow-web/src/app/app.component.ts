import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

const READING_PREFERENCES = 'petflow.reading-preferences';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fontSize = 100;
  readonly fontSizes = [100, 115, 130, 150];
  readonly options = [
    { key: 'spacing', label: 'Mais espaçamento' },
    { key: 'contrast', label: 'Alto contraste' },
    { key: 'bold', label: 'Texto em negrito' },
    { key: 'highlight', label: 'Realçar títulos e links' },
    { key: 'underline', label: 'Sublinhar títulos e links' },
    { key: 'colorVision', label: 'Paleta com padrões e ícones' }
  ];
  activeOptions = new Set<string>();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    try {
      const saved = JSON.parse(this.document.defaultView?.localStorage.getItem(READING_PREFERENCES) ?? 'null');
      if (this.fontSizes.includes(saved?.fontSize)) {
        this.fontSize = saved.fontSize;
      }
      if (Array.isArray(saved?.options)) {
        this.activeOptions = new Set(this.options.map(option => option.key).filter(key => saved.options.includes(key)));
      }
    } catch {
      // Reading controls also work when storage is unavailable.
    }
    this.applyPreferences();
  }

  setFontSize(value: string): void {
    const size = Number(value);
    if (this.fontSizes.includes(size)) {
      this.fontSize = size;
      this.savePreferences();
    }
  }

  setOption(key: string, enabled: boolean): void {
    if (enabled) {
      this.activeOptions.add(key);
    } else {
      this.activeOptions.delete(key);
    }
    this.savePreferences();
  }

  resetPreferences(): void {
    this.fontSize = 100;
    this.activeOptions.clear();
    this.savePreferences();
  }

  private applyPreferences(): void {
    const root = this.document.documentElement;
    root.style.fontSize = `${this.fontSize}%`;
    for (const option of this.options) {
      root.classList.toggle(`reading-${option.key}`, this.activeOptions.has(option.key));
    }
  }

  private savePreferences(): void {
    this.applyPreferences();
    try {
      this.document.defaultView?.localStorage.setItem(READING_PREFERENCES, JSON.stringify({
        fontSize: this.fontSize,
        options: [...this.activeOptions]
      }));
    } catch {
      // Keep preferences in memory for the current session.
    }
  }
}
