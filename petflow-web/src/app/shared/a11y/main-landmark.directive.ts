import { Directive, ElementRef, OnInit } from '@angular/core';

/**
 * Marca o elemento como landmark principal (role="main", id="conteudo-principal")
 * quando a página não está dentro de um layout que já tenha <main>.
 * Serve às páginas do cliente e ao cadastro público, que não usam layout, sem
 * duplicar o <main> do layout administrativo (WCAG 1.3.1 e 2.4.1).
 */
@Directive({
  selector: '[appMainLandmark]',
  standalone: true
})
export class MainLandmarkDirective implements OnInit {
  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const el = this.host.nativeElement;
    if (el.parentElement?.closest('main, [role="main"]')) {
      return;
    }
    el.setAttribute('role', 'main');
    if (!el.id) {
      el.id = 'conteudo-principal';
    }
    el.setAttribute('tabindex', '-1');
  }
}
