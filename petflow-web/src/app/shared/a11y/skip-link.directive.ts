import { Directive, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Link "Pular para o conteúdo" (WCAG 2.4.1). Move o foco para o elemento de id
 * informado sem alterar a URL, evitando conflito com o roteador/<base href>.
 */
@Directive({
  selector: 'a[appSkipLink]',
  standalone: true
})
export class SkipLinkDirective {
  @Input('appSkipLink') targetId = 'conteudo-principal';

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    const target = this.doc.getElementById(this.targetId);
    if (target) {
      target.focus();
      target.scrollIntoView();
    }
  }
}
