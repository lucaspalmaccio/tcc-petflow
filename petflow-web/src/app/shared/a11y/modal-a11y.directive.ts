import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Fundos (overlay/backdrop) continuam clicáveis para fechar o modal. */
const BACKDROP = '.modal-overlay, .modal-backdrop';

/**
 * Torna um elemento um diálogo modal acessível (WCAG 2.1.1, 2.4.3 e 4.1.2):
 * role/aria-modal/aria-labelledby, foco inicial, foco preso, fundo inerte,
 * Esc para fechar e retorno do foco a quem abriu o modal.
 *
 * Uso: <div class="modal" appModal appModalLabelledby="titulo-id" (appModalClose)="fechar()">
 */
@Directive({
  selector: '[appModal]',
  standalone: true
})
export class ModalA11yDirective implements AfterViewInit, OnDestroy {
  @Input() appModalLabelledby: string | null = null;
  @Output() appModalClose = new EventEmitter<void>();

  @HostBinding('attr.role') readonly role = 'dialog';
  @HostBinding('attr.aria-modal') readonly ariaModal = 'true';
  @HostBinding('attr.tabindex') readonly tabindex = '-1';
  @HostBinding('attr.aria-labelledby') get labelledby(): string | null {
    return this.appModalLabelledby;
  }

  private opener: HTMLElement | null;
  private inerted: HTMLElement[] = [];

  constructor(
    private host: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private doc: Document
  ) {
    // Ainda não houve mudança de foco: o elemento ativo é quem abriu o modal.
    const active = doc.activeElement;
    this.opener = active instanceof HTMLElement && active !== doc.body ? active : null;
  }

  ngAfterViewInit(): void {
    this.makeBackgroundInert();
    const el = this.host.nativeElement;
    const target = el.querySelector<HTMLElement>('[autofocus]') ?? this.focusables()[0] ?? el;
    target.focus();
  }

  ngOnDestroy(): void {
    this.inerted.forEach(node => node.removeAttribute('inert'));
    this.inerted = [];
    if (this.opener && this.doc.contains(this.opener)) {
      this.opener.focus();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.appModalClose.emit();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }

    const items = this.focusables();
    if (items.length === 0) {
      event.preventDefault();
      this.host.nativeElement.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = this.doc.activeElement;

    if (event.shiftKey && (active === first || active === this.host.nativeElement)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusables(): HTMLElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE))
      .filter(node => node.getClientRects().length > 0);
  }

  /** Marca como inerte tudo o que não é o modal (ou o fundo clicável) até o <body>. */
  private makeBackgroundInert(): void {
    let node: HTMLElement | null = this.host.nativeElement;
    while (node && node !== this.doc.body) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) {
        break;
      }
      Array.from(parent.children).forEach(sibling => {
        if (
          sibling !== node &&
          sibling instanceof HTMLElement &&
          !sibling.hasAttribute('inert') &&
          !sibling.matches(BACKDROP) &&
          !['SCRIPT', 'STYLE', 'LINK'].includes(sibling.tagName)
        ) {
          sibling.setAttribute('inert', '');
          this.inerted.push(sibling);
        }
      });
      node = parent;
    }
  }
}
