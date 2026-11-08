import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Ao enviar um formulário com erro, leva o foco ao primeiro campo marcado
 * com aria-invalid="true" (WCAG 3.3.1). Usar em <form>.
 *
 * O componente deve marcar os campos como "touched" no envio para que
 * aria-invalid seja renderizado antes de o foco ser movido.
 */
@Directive({
  selector: 'form[appFocusInvalid]',
  standalone: true
})
export class FocusInvalidDirective {
  constructor(private form: ElementRef<HTMLFormElement>) {}

  @HostListener('submit')
  onSubmit(): void {
    // setTimeout: espera a detecção de mudanças aplicar aria-invalid.
    setTimeout(() => {
      this.form.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  }
}
