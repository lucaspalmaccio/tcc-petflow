import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Anuncia a troca de página a leitores de tela (WCAG 4.1.3) e leva o foco ao
 * conteúdo principal quando há navegação (WCAG 2.4.3). A primeira carga não
 * move o foco.
 */
@Component({
  selector: 'app-route-announcer',
  standalone: true,
  template: `<div class="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{{ message }}</div>`,
  styles: [`
    .visually-hidden {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
  `]
})
export class RouteAnnouncerComponent implements OnDestroy {
  message = '';
  private first = true;
  private readonly subscription: Subscription;

  constructor(router: Router, @Inject(DOCUMENT) private readonly doc: Document) {
    this.subscription = router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        // Espera o título e a página renderizarem.
        setTimeout(() => this.announce());
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private announce(): void {
    const title = this.doc.title.replace(/\s*\|\s*PetFlow$/, '');
    this.message = title ? `Página carregada: ${title}` : '';
    if (this.first) {
      this.first = false;
      return;
    }
    this.doc.getElementById('conteudo-principal')?.focus({ preventScroll: true });
  }
}
