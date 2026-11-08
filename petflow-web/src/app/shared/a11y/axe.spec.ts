import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import * as axe from 'axe-core';

import { AppComponent } from '../../app.component';
import { LoginComponent } from '../../features/admin/auth/login/login.component';
import { PetFormModalComponent } from '../../features/admin/components/pet-form-modal/pet-form-modal.component';
import { FocusInvalidDirective } from './focus-invalid.directive';
import { ModalA11yDirective } from './modal-a11y.directive';
import { ReadingMaskComponent } from './reading-mask.component';
import { RouteAnnouncerComponent } from './route-announcer.component';

/**
 * Verificação automática com axe-core (regras WCAG 2.0/2.1 A e AA) das telas
 * principais. Não substitui testes manuais com leitores de tela (NVDA,
 * VoiceOver, TalkBack): ver petflow-web/ACESSIBILIDADE.md.
 */
async function violations(root: HTMLElement): Promise<string[]> {
  const results = await axe.run(root, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    // O jsdom/Karma não renderiza a página inteira: regras de página (landmark,
    // region, título) são cobertas na validação do app completo.
    rules: { region: { enabled: false }, 'page-has-heading-one': { enabled: false } }
  });
  return results.violations.map(v => `${v.id}: ${v.help} -> ${v.nodes.map(n => n.target.join(' ')).join(' | ')}`);
}

function mount<T>(fixture: ComponentFixture<T>): HTMLElement {
  document.body.appendChild(fixture.nativeElement);
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('Acessibilidade automática (axe-core)', () => {
  it('login sem violações, vazio e com erros de validação', async () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FocusInvalidDirective]
    }).createComponent(LoginComponent);
    const root = mount(fixture);
    expect(await violations(root)).toEqual([]);

    fixture.componentInstance.onSubmit();
    fixture.detectChanges();
    expect(root.querySelector('#email')!.getAttribute('aria-invalid')).toBe('true');
    expect(root.querySelector('#email')!.getAttribute('aria-describedby')).toBe('email-erro');
    expect(root.querySelector('[role="alert"]')).not.toBeNull();
    expect(await violations(root)).toEqual([]);
    root.remove();
  });

  it('modal de pet sem violações e com erros ligados aos campos', async () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [PetFormModalComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, ModalA11yDirective, FocusInvalidDirective]
    }).createComponent(PetFormModalComponent);
    fixture.componentInstance.clienteId = 1;
    const root = mount(fixture);
    expect(await violations(root)).toEqual([]);

    fixture.componentInstance.submitForm();
    fixture.detectChanges();
    expect(root.querySelector('#pet-nome')!.getAttribute('aria-invalid')).toBe('true');
    expect(root.querySelector('[role="dialog"]')!.getAttribute('aria-labelledby')).toBe('pet-modal-titulo');
    expect(await violations(root)).toEqual([]);
    root.remove();
  });

  it('Hub de acessibilidade aberto sem violações', async () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, RouteAnnouncerComponent, ReadingMaskComponent]
    }).createComponent(AppComponent);
    const root = mount(fixture);
    const toggle = root.querySelector<HTMLButtonElement>('#hub-toggle')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('[role="dialog"]')).not.toBeNull();
    expect(await violations(root)).toEqual([]);

    fixture.componentInstance.closeHub();
    fixture.detectChanges();
    expect(root.querySelector('#hub-painel')).toBeNull();
    root.remove();
  });
});
