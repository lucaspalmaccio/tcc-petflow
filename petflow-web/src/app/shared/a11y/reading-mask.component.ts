import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostBinding, Inject, NgZone, OnDestroy, OnInit } from '@angular/core';

const OPEN_HEIGHT = 80;
const OPEN_HEIGHT_LARGE = 160;
const KEY_STEP = 40;

/**
 * Máscara de leitura: escurece a tela e deixa livre só uma faixa horizontal
 * que acompanha o mouse, o toque ou o foco do teclado (Alt + setas ↑/↓ também
 * movem a faixa). É ativada pela classe "reading-mask" no <html>
 * (controlada pelo Hub de acessibilidade) e não captura cliques.
 */
@Component({
  selector: 'app-reading-mask',
  standalone: true,
  template: `
    <div class="band top" aria-hidden="true"></div>
    <div class="band bottom" aria-hidden="true"></div>
  `,
  styles: [`
    :host { display: none; }
    :host(.on) { display: block; }
    .band {
      position: fixed;
      inset-inline: 0;
      z-index: 800;
      background: rgb(0 0 0 / 72%);
      pointer-events: none;
    }
    .top { inset-block-start: 0; }
    .bottom { inset-block-end: 0; }
    @media (forced-colors: active) {
      .band { background: CanvasText; opacity: 0.72; }
    }
  `]
})
export class ReadingMaskComponent implements OnInit, OnDestroy {
  @HostBinding('class.on') active = false;

  private y = 0;
  private observer?: MutationObserver;
  private readonly cleanups: Array<() => void> = [];

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly zone: NgZone,
    @Inject(DOCUMENT) private readonly doc: Document
  ) {}

  ngOnInit(): void {
    const view = this.doc.defaultView;
    if (!view) return;
    this.y = view.innerHeight / 2;

    this.zone.runOutsideAngular(() => {
      const listen = <K extends keyof DocumentEventMap>(type: K, handler: (e: DocumentEventMap[K]) => void) => {
        this.doc.addEventListener(type, handler as EventListener, { passive: true });
        this.cleanups.push(() => this.doc.removeEventListener(type, handler as EventListener));
      };
      listen('mousemove', e => this.moveTo(e.clientY));
      listen('touchmove', e => e.touches[0] && this.moveTo(e.touches[0].clientY));
      listen('touchstart', e => e.touches[0] && this.moveTo(e.touches[0].clientY));
      listen('focusin', e => {
        const target = e.target;
        if (target instanceof HTMLElement && this.isActive()) {
          const rect = target.getBoundingClientRect();
          this.moveTo(rect.top + rect.height / 2);
        }
      });
      listen('keydown', e => {
        if (!this.isActive() || !e.altKey) return;
        if (e.key === 'ArrowUp') this.moveTo(this.y - KEY_STEP);
        if (e.key === 'ArrowDown') this.moveTo(this.y + KEY_STEP);
      });

      this.observer = new MutationObserver(() => this.refresh());
      this.observer.observe(this.doc.documentElement, { attributes: true, attributeFilter: ['class'] });
    });
    this.refresh();
  }

  ngOnDestroy(): void {
    this.cleanups.forEach(fn => fn());
    this.observer?.disconnect();
  }

  private isActive(): boolean {
    return this.doc.documentElement.classList.contains('reading-mask');
  }

  private refresh(): void {
    const on = this.isActive();
    this.host.nativeElement.classList.toggle('on', on);
    this.active = on;
    this.render();
  }

  private moveTo(y: number): void {
    const max = this.doc.defaultView?.innerHeight ?? y;
    this.y = Math.min(Math.max(y, 0), max);
    if (this.isActive()) this.render();
  }

  private render(): void {
    const large = this.doc.documentElement.classList.contains('reading-maskLarge');
    const half = (large ? OPEN_HEIGHT_LARGE : OPEN_HEIGHT) / 2;
    const [top, bottom] = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.band'));
    if (top) top.style.blockSize = `${Math.max(0, this.y - half)}px`;
    if (bottom) bottom.style.insetBlockStart = `${this.y + half}px`;
  }
}
