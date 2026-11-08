import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalA11yDirective } from './modal-a11y.directive';
import { FocusInvalidDirective } from './focus-invalid.directive';
import { SkipLinkDirective } from './skip-link.directive';

@Component({
  standalone: true,
  imports: [NgIf, ModalA11yDirective],
  template: `
    <div id="fundo"><button id="abrir" (click)="aberto = true">Abrir</button></div>
    <div id="backdrop" class="modal-backdrop"></div>
    <div *ngIf="aberto" id="dialogo" appModal appModalLabelledby="titulo" (appModalClose)="fechou = true; aberto = false">
      <h2 id="titulo">Título</h2>
      <button id="primeiro">Primeiro</button>
      <button id="ultimo">Último</button>
    </div>`
})
class ModalHostComponent {
  aberto = false;
  fechou = false;
}

@Component({
  standalone: true,
  imports: [FocusInvalidDirective],
  template: `
    <form appFocusInvalid>
      <input id="ok">
      <input id="ruim" aria-invalid="true">
      <button id="enviar" type="submit">Enviar</button>
    </form>`
})
class FormHostComponent {}

@Component({
  standalone: true,
  imports: [SkipLinkDirective],
  template: `
    <a id="pular" href="#principal" appSkipLink="principal">Pular</a>
    <main id="principal" tabindex="-1">Conteúdo</main>`
})
class SkipHostComponent {}

function key(el: HTMLElement, k: string, shiftKey = false): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: k, shiftKey, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

describe('ModalA11yDirective', () => {
  let fixture: ComponentFixture<ModalHostComponent>;
  let root: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({ imports: [ModalHostComponent] })
      .createComponent(ModalHostComponent);
    root = fixture.nativeElement;
    document.body.appendChild(root);
    fixture.detectChanges();
    root.querySelector<HTMLElement>('#abrir')!.focus();
    fixture.componentInstance.aberto = true;
    fixture.detectChanges();
  });

  afterEach(() => root.remove());

  it('define role, aria-modal e aria-labelledby', () => {
    const dialog = root.querySelector('#dialogo')!;
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('titulo');
  });

  it('move o foco para dentro do modal ao abrir', () => {
    expect(document.activeElement?.id).toBe('primeiro');
  });

  it('prende o foco com Tab e Shift+Tab', () => {
    const dialog = root.querySelector<HTMLElement>('#dialogo')!;
    root.querySelector<HTMLElement>('#ultimo')!.focus();
    expect(key(dialog, 'Tab').defaultPrevented).toBeTrue();
    expect(document.activeElement?.id).toBe('primeiro');
    expect(key(dialog, 'Tab', true).defaultPrevented).toBeTrue();
    expect(document.activeElement?.id).toBe('ultimo');
  });

  it('torna o fundo inerte, preservando o backdrop clicável', () => {
    expect(root.querySelector('#fundo')!.hasAttribute('inert')).toBeTrue();
    expect(root.querySelector('#backdrop')!.hasAttribute('inert')).toBeFalse();
  });

  it('fecha com Esc', () => {
    key(root.querySelector<HTMLElement>('#dialogo')!, 'Escape');
    expect(fixture.componentInstance.fechou).toBeTrue();
  });

  it('devolve o foco ao elemento que abriu e remove o inert ao fechar', () => {
    key(root.querySelector<HTMLElement>('#dialogo')!, 'Escape');
    fixture.detectChanges();
    expect(root.querySelector('#fundo')!.hasAttribute('inert')).toBeFalse();
    expect(document.activeElement?.id).toBe('abrir');
  });
});

describe('FocusInvalidDirective', () => {
  it('foca o primeiro campo com aria-invalid ao enviar', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [FormHostComponent] })
      .createComponent(FormHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await new Promise(resolve => setTimeout(resolve));
    expect(document.activeElement?.id).toBe('ruim');
    fixture.nativeElement.remove();
  });
});

describe('SkipLinkDirective', () => {
  it('move o foco para o conteúdo principal sem navegar', () => {
    const fixture = TestBed.configureTestingModule({ imports: [SkipHostComponent] })
      .createComponent(SkipHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('#pular') as HTMLElement;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBeTrue();
    expect(document.activeElement?.id).toBe('principal');
    fixture.nativeElement.remove();
  });
});
