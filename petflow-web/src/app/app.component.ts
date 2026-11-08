import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';

const READING_PREFERENCES = 'petflow.reading-preferences';

interface Preset {
  key: string;
  label: string;
  description: string;
  fontSize: number;
  options: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fontSize = 100;
  readonly fontSizes = [100, 115, 130, 150];
  readonly options = [
    { key: 'spacing', label: 'Mais espaçamento entre linhas' },
    { key: 'wordSpacing', label: 'Mais espaço entre palavras' },
    { key: 'bold', label: 'Texto em negrito' },
    { key: 'narrowLine', label: 'Linhas de texto mais curtas' },
    { key: 'leftAlign', label: 'Alinhar texto à esquerda' },
    { key: 'dyslexia', label: 'Fonte para dislexia (Atkinson Hyperlegible)' },
    { key: 'mask', label: 'Máscara de leitura' },
    { key: 'maskLarge', label: 'Máscara de leitura mais larga' },
    { key: 'highlight', label: 'Realçar títulos e links' },
    { key: 'underline', label: 'Sublinhar títulos e links' },
    { key: 'colorVision', label: 'Paleta com padrões e ícones' }
  ];
  /** Agrupamento das opções no painel do Hub. */
  readonly groups = [
    { title: 'Texto', keys: ['spacing', 'wordSpacing', 'bold', 'narrowLine', 'leftAlign'] },
    { title: 'Dislexia e leitura', keys: ['dyslexia', 'mask', 'maskLarge'] },
    { title: 'Destaques e cores', keys: ['highlight', 'underline', 'colorVision'] }
  ];
  /** Atalhos que combinam várias opções de uma vez. */
  readonly presets: Preset[] = [
    {
      key: 'lowVision', label: 'Baixa visão',
      description: 'Texto maior, negrito, mais espaço e realce',
      fontSize: 150, options: ['bold', 'spacing', 'highlight', 'underline']
    },
    {
      key: 'dyslexia', label: 'Dislexia',
      description: 'Fonte própria, espaço entre palavras e linhas curtas',
      fontSize: 115, options: ['dyslexia', 'spacing', 'wordSpacing', 'narrowLine', 'leftAlign', 'mask']
    }
  ];

  activeOptions = new Set<string>();
  open = false;

  @ViewChild('toggle') private toggle?: ElementRef<HTMLButtonElement>;
  @ViewChild('panel') private panel?: ElementRef<HTMLElement>;

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
    this.savePreferences();
  }

  optionLabel(key: string): string {
    return this.options.find(option => option.key === key)?.label ?? key;
  }

  isOptionEnabled(key: string): boolean {
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
    if (!this.options.some(option => option.key === key)) return;
    if (enabled) {
      this.activeOptions.add(key);
    } else {
      this.activeOptions.delete(key);
    }
    this.savePreferences();
  }

  applyPreset(preset: Preset): void {
    this.fontSize = preset.fontSize;
    this.activeOptions = new Set(preset.options);
    this.savePreferences();
  }

  resetPreferences(): void {
    this.fontSize = 100;
    this.activeOptions.clear();
    this.savePreferences();
  }

  // --- Hub (painel flutuante) ---

  toggleHub(): void {
    this.open ? this.closeHub() : this.openHub();
  }

  openHub(): void {
    this.open = true;
    // Aguarda o painel existir no DOM para mover o foco para dentro dele.
    setTimeout(() => this.panel?.nativeElement.querySelector<HTMLElement>('select, input, button')?.focus());
  }

  closeHub(): void {
    this.open = false;
    this.toggle?.nativeElement.focus();
  }

  /** Atalho de página: leva o foco para um ponto da página e fecha o painel. */
  goTo(id: string): void {
    this.open = false;
    const target = this.document.getElementById(id);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.scrollIntoView?.();
    }
  }

  /** Há na página o destino de um atalho? (o cadastro público não tem menu) */
  hasTarget(id: string): boolean {
    return !!this.document.getElementById(id);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      this.toggleHub();
    } else if (event.key === 'Escape' && this.open) {
      this.closeHub();
    }
  }

  private applyPreferences(): void {
    const root = this.document.documentElement;
    root.classList.remove('reading-contrast');
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
        options: [...this.activeOptions]
      }));
    } catch {
      // Keep preferences in memory for the current session.
    }
  }
}
