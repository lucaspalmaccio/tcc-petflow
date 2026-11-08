import { AfterViewChecked, Directive, ElementRef, HostListener } from '@angular/core';
import { AbstractControl, FormGroupDirective, ValidationErrors, Validators } from '@angular/forms';

let nextId = 0;

/** Mensagem padrão por tipo de erro quando o template não traz uma própria. */
function describeErrors(errors: ValidationErrors): string {
  if (errors['required']) return 'Campo obrigatório.';
  if (errors['email']) return 'E-mail inválido.';
  if (errors['min']) return `Valor mínimo: ${errors['min'].min}.`;
  if (errors['max']) return `Valor máximo: ${errors['max'].max}.`;
  if (errors['minlength']) return `Informe pelo menos ${errors['minlength'].requiredLength} caracteres.`;
  if (errors['maxlength']) return `Informe no máximo ${errors['maxlength'].requiredLength} caracteres.`;
  if (errors['pattern']) return 'Formato inválido.';
  return 'Valor inválido.';
}

/**
 * Acessibilidade automática para formulários reativos (WCAG 3.3.1, 3.3.2, 4.1.3):
 * - aria-required e "(obrigatório)" no rótulo dos campos com Validators.required;
 * - aria-invalid + aria-describedby ligando o campo à mensagem de erro (usa a
 *   mensagem do template, se houver; senão cria uma);
 * - no envio, marca todos os campos como tocados e leva o foco ao primeiro inválido.
 *
 * Uso: <form [formGroup]="f" appFormA11y>. Os campos precisam de formControlName
 * estático e de um contêiner .form-group (ou .mb-3).
 */
@Directive({
  selector: 'form[appFormA11y]',
  standalone: true
})
export class FormA11yDirective implements AfterViewChecked {
  private readonly uid = nextId++;

  constructor(
    private readonly host: ElementRef<HTMLFormElement>,
    private readonly group: FormGroupDirective
  ) {}

  @HostListener('submit')
  onSubmit(): void {
    this.group.control.markAllAsTouched();
    setTimeout(() => {
      this.sync();
      this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  }

  ngAfterViewChecked(): void {
    this.sync();
  }

  /** Foca o primeiro campo inválido; útil para formulários sem botão submit. */
  focusFirstInvalid(): void {
    this.group.control.markAllAsTouched();
    this.sync();
    this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }

  private sync(): void {
    this.host.nativeElement.querySelectorAll<HTMLElement>('[formControlName]').forEach(field => {
      const control = this.group.control.get(field.getAttribute('formControlName') ?? '');
      if (!control) return;
      this.syncRequired(field, control);
      this.syncError(field, control);
    });
  }

  private syncRequired(field: HTMLElement, control: AbstractControl): void {
    if (!control.hasValidator(Validators.required)) return;
    setAttr(field, 'aria-required', 'true');
    const label = field.id ? this.host.nativeElement.querySelector(`label[for="${field.id}"]`) : null;
    if (label && !label.querySelector('.required-hint')) {
      const hint = document.createElement('span');
      hint.className = 'required-hint';
      hint.textContent = ' (obrigatório)';
      label.appendChild(hint);
    }
  }

  private syncError(field: HTMLElement, control: AbstractControl): void {
    const box = field.closest<HTMLElement>('.form-group, .mb-3') ?? field.parentElement;
    if (!box) return;
    const invalid = control.touched && control.invalid;
    const ownMessage = box.querySelector<HTMLElement>('[data-a11y-error]');
    // Mensagem do próprio template (visível só quando há erro).
    const templateMessage = Array.from(
      box.querySelectorAll<HTMLElement>('.error-message, .text-danger, small:not(.text-muted)')
    ).find(node => !node.hasAttribute('data-a11y-error'));
    const hint = box.querySelector<HTMLElement>('small.text-muted');

    let message = templateMessage ?? null;
    if (invalid && !message) {
      const generated = ownMessage ?? document.createElement('div');
      generated.setAttribute('data-a11y-error', '');
      generated.className = 'error-message field-error';
      generated.textContent = describeErrors(control.errors ?? {});
      if (!ownMessage) box.appendChild(generated);
      message = generated;
    } else if (!invalid) {
      ownMessage?.remove();
    }

    if (message && !message.id) {
      message.id = `fa11y-${this.uid}-${field.getAttribute('formControlName')}-erro`;
    }
    if (hint && !hint.id) {
      hint.id = `fa11y-${this.uid}-${field.getAttribute('formControlName')}-dica`;
    }

    setAttr(field, 'aria-invalid', invalid ? 'true' : null);
    const describedBy = [hint?.id, invalid ? message?.id : null].filter(Boolean).join(' ');
    setAttr(field, 'aria-describedby', describedBy || null);
  }
}

function setAttr(el: HTMLElement, name: string, value: string | null): void {
  if (value === null) {
    if (el.hasAttribute(name)) el.removeAttribute(name);
  } else if (el.getAttribute(name) !== value) {
    el.setAttribute(name, value);
  }
}
