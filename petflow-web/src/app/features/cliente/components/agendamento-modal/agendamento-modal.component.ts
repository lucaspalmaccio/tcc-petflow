import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, catchError, of } from 'rxjs';
import { Pet } from '../../../admin/models/pet.model';
import { Servico } from '../../../admin/models/servico.model';
import { AgendamentoService } from '../../../admin/services/agendamento.service';
import { AgendamentoRequestDTO } from '../../../admin/models/agendamento.model';
import { ServicoService } from '../../../admin/services/servico.service'; // Import corrigido

@Component({
selector: 'app-agendamento-modal',
templateUrl: './agendamento-modal.component.html',
styleUrls: ['./agendamento-modal.component.css']
})
export class AgendamentoModalComponent implements OnInit {

// Dados recebidos do componente pai
@Input() petsCliente$!: Observable<Pet[]>;
@Input() servicosDisponiveis$!: Observable<Servico[]>;
@Output() closeModal = new EventEmitter<void>();
@Output() saveSuccess = new EventEmitter<void>();

// Estado do componente
agendamentoForm: FormGroup;
isLoading = false;
errorMessage: string | null = null;
public valorTotal = 0;
private servicosCache: Servico[] = []; // Cache para cálculo do valor

// Propriedade para o input de data
public minDate: string;

constructor(
    private fb: FormBuilder,
    private agendamentoService: AgendamentoService,
    private servicoService: ServicoService // Injetar para pegar os preços
  ) {
    this.agendamentoForm = this.fb.group({
      petId: [null, Validators.required],
      dataHora: ['', Validators.required],
      servicoIds: this.fb.array([], Validators.required) // Array de checkboxes
    });

    // Define a data/hora mínima como o momento atual
    // Formato (YYYY-MM-DDTHH:mm) é necessário para o input datetime-local
    const now = new Date();
    // Ajusta para o fuso horário local
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // Converte para o formato ISO e corta os segundos/milissegundos
    this.minDate = now.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    // Carrega o cache de serviços para cálculo do preço
    this.servicosDisponiveis$.subscribe(servicos => this.servicosCache = servicos);
  }

  get servicosFormArray(): FormArray {
    return this.agendamentoForm.get('servicoIds') as FormArray;
  }

  // Função para lidar com a mudança nos checkboxes de serviço
  onServicoChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const servicoId = parseInt(checkbox.value, 10);

    if (checkbox.checked) {
      this.servicosFormArray.push(this.fb.control(servicoId));
    } else {
      const index = this.servicosFormArray.controls.findIndex(x => x.value === servicoId);
      if (index !== -1) {
        this.servicosFormArray.removeAt(index);
      }
    }
    this.calcularValorTotal();
  }

  // Calcula o valor total com base nos serviços selecionados
  calcularValorTotal(): void {
    this.valorTotal = this.servicosFormArray.value.reduce((total: number, servicoId: number) => {
      const servico = this.servicosCache.find(s => s.id === servicoId);
      return total + (servico?.preco || 0);
    }, 0);
  }

  /**
   * Envia o formulário para criar o agendamento
   * UC05 - Fluxo Principal [150] a [152]
   */
  submitForm(): void {
    if (this.agendamentoForm.invalid || this.servicosFormArray.length === 0) {
      this.errorMessage = "Selecione o pet, a data/hora e pelo menos um serviço.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValue = this.agendamentoForm.value;

    // Ajusta o formato da data/hora para ISO String (YYYY-MM-DDTHH:mm:ss)
    const dataHoraISO = new Date(formValue.dataHora).toISOString().slice(0, 19);

    const dto: AgendamentoRequestDTO = {
      clienteId: null, // O back-end pega do token do cliente
      petId: formValue.petId,
      dataHora: dataHoraISO,
      servicoIds: formValue.servicoIds
    };

    this.agendamentoService.createAgendamento(dto).subscribe({
      next: () => {
        this.isLoading = false;
        this.saveSuccess.emit();
        this.onClose();
      },
      error: (err) => {
        this.isLoading = false;
        // UC05 - Fluxo de Exceção [153] (Horário Indisponível)
        this.errorMessage = err.error?.erro || "Erro ao criar agendamento. Verifique a data/hora.";
        console.error("Erro ao criar agendamento:", err);
      }
    });
  }

  /**
   * Emite o evento para fechar o modal.
   */
  onClose(): void {
    this.closeModal.emit();
  }
}

