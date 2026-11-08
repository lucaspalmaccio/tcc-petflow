import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormA11yDirective } from './form-a11y.directive';
import { PageTitleStrategy } from './page-title.strategy';
import { TitleStrategy } from '@angular/router';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormA11yDirective],
  template: `
    <form [formGroup]="form" appFormA11y>
      <div class="form-group">
        <label for="nome">Nome</label>
        <input id="nome" formControlName="nome">
      </div>
      <div class="form-group">
        <label for="senha">Senha</label>
        <input id="senha" formControlName="senha">
        <small class="text-muted">Mínimo 6 caracteres</small>
      </div>
      <div class="form-group">
        <label for="obs">Observação</label>
        <input id="obs" formControlName="obs">
      </div>
      <button type="submit">Enviar</button>
    </form>`
})
class FormHostComponent {
  form = new FormBuilder().group({
    nome: ['', Validators.required],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    obs: ['']
  });
}

describe('FormA11yDirective', () => {
  function create() {
    const fixture = TestBed.configureTestingModule({ imports: [FormHostComponent] })
      .createComponent(FormHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    return fixture;
  }

  it('indica campos obrigatórios em texto e com aria-required', () => {
    const fixture = create();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('#nome')!.getAttribute('aria-required')).toBe('true');
    expect(root.querySelector('label[for="nome"]')!.textContent).toContain('(obrigatório)');
    expect(root.querySelector('#obs')!.hasAttribute('aria-required')).toBeFalse();
    expect(root.querySelector('label[for="obs"]')!.textContent).not.toContain('obrigatório');
    root.remove();
  });

  it('no envio, marca erros, liga mensagem ao campo e foca o primeiro inválido', async () => {
    const fixture = create();
    const root: HTMLElement = fixture.nativeElement;
    root.querySelector('form')!.dispatchEvent(new Event('submit'));
    await new Promise(resolve => setTimeout(resolve));
    fixture.detectChanges();

    const nome = root.querySelector<HTMLInputElement>('#nome')!;
    expect(nome.getAttribute('aria-invalid')).toBe('true');
    const errorId = nome.getAttribute('aria-describedby')!;
    expect(root.querySelector('#' + errorId)!.textContent).toContain('Campo obrigatório');
    expect(document.activeElement).toBe(nome);

    const senha = root.querySelector('#senha')!;
    expect(senha.getAttribute('aria-describedby')!.split(' ').length).toBe(2); // dica + erro
    root.remove();
  });

  it('remove o erro quando o campo fica válido', () => {
    const fixture = create();
    const root: HTMLElement = fixture.nativeElement;
    fixture.componentInstance.form.markAllAsTouched();
    fixture.detectChanges();
    expect(root.querySelector('[data-a11y-error]')).not.toBeNull();
    fixture.componentInstance.form.patchValue({ nome: 'Ana', senha: '123456' });
    fixture.detectChanges();
    expect(root.querySelector('[data-a11y-error]')).toBeNull();
    expect(root.querySelector('#nome')!.hasAttribute('aria-invalid')).toBeFalse();
    root.remove();
  });
});

describe('PageTitleStrategy', () => {
  it('define o título da aba como "Página | PetFlow" a cada navegação', async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'agenda', title: 'Agenda', children: [] }])],
      providers: [{ provide: TitleStrategy, useClass: PageTitleStrategy }]
    });
    await TestBed.inject(Router).navigateByUrl('/agenda');
    expect(TestBed.inject(Title).getTitle()).toBe('Agenda | PetFlow');
  });
});
