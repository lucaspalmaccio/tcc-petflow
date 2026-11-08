import { TestBed } from '@angular/core/testing';
import { ReadingMaskComponent } from './reading-mask.component';

describe('ReadingMaskComponent', () => {
  const root = document.documentElement;

  afterEach(() => root.classList.remove('reading-mask', 'reading-maskLarge'));

  function create() {
    const fixture = TestBed.configureTestingModule({ imports: [ReadingMaskComponent] })
      .createComponent(ReadingMaskComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const wait = () => new Promise(resolve => setTimeout(resolve));

  it('fica oculta até a classe reading-mask ser ativada e não bloqueia cliques', async () => {
    const host = create();
    expect(getComputedStyle(host).display).toBe('none');
    root.classList.add('reading-mask');
    await wait();
    expect(getComputedStyle(host).display).toBe('block');
    host.querySelectorAll('.band').forEach(band => {
      expect(getComputedStyle(band).pointerEvents).toBe('none');
      expect(band.getAttribute('aria-hidden')).toBe('true');
    });
    host.remove();
  });

  it('a faixa livre acompanha o mouse e fica maior na versão larga', async () => {
    const host = create();
    root.classList.add('reading-mask');
    await wait();
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 300 }));
    const top = host.querySelector<HTMLElement>('.band.top')!;
    const bottom = host.querySelector<HTMLElement>('.band.bottom')!;
    expect(top.style.blockSize).toBe('260px'); // 300 - 80/2
    expect(bottom.style.insetBlockStart).toBe('340px'); // 300 + 80/2

    root.classList.add('reading-maskLarge');
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 300 }));
    expect(top.style.blockSize).toBe('220px'); // 300 - 160/2
    host.remove();
  });

  it('Alt + seta para baixo desloca a faixa', async () => {
    const host = create();
    root.classList.add('reading-mask');
    await wait();
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 300 }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true }));
    expect(host.querySelector<HTMLElement>('.band.top')!.style.blockSize).toBe('300px'); // 340 - 40
    host.remove();
  });
});
