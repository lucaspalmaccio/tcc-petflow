import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Pet } from '../../../admin/models/pet.model';
import { Servico } from '../../../admin/models/servico.model';
import { PetService } from '../../../admin/services/pet.service';
import { ServicoService } from '../../../admin/services/servico.service';
import { AgendamentoService } from '../../../admin/services/agendamento.service';
import { AgendamentoRequestDTO } from '../../../admin/models/agendamento.model';

@Component({
selector: 'app-agendamento-modal',
templateUrl: './agendamento-modal.component.html',
// Reutiliza o CSS do modal de Pet (são muito parecidos)
styleUrls: ['../../../admin/components/pet-form-modal/pet-form-modal.component.css']
})
export class AgendamentoModalComponent implements OnInit {

// Eventos de saída
@Output() closeModal = new EventEmitter<void>();
@Output() saveSuccess = new EventEmitter<void>();

// Observables para carregar os dados
public pets$: Observable<Pet[]>;
public servicos$: Observable<Servico[]>;

// Formulário
agendamentoForm: FormGroup;
isLoading = false;
errorMessage: string | null = null;
totalCalculado: number = 0;

private allServicos: Servico[] = []; // Armazena os serviços para cálculo

constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private servicoService: ServicoService,
    private agendamentoService: AgendamentoService
  ) {
    // UC05 - Fluxo de seleção
    this.agendamentoForm = this.fb.group({
      petId: [null, Validators.required],
      dataHora: ['', Validators.required], // (Um seletor de data/hora real seria melhor)
      servicoIds: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // UC05 [Fluxo 3] - Carrega os pets do cliente
    this.pets$ = this.petService.getMeusPets();

    // UC05 [Fluxo 4] - Carrega os serviços disponíveis
    this.servicos$ = this.servicoService.getAllServicos();
    this.servicos$.subscribe(data => this.allServicos = data);

    // Recalcula o total sempre que os serviços mudarem
    this.agendamentoForm.get('servicoIds')?.valueChanges.subscribe(ids => {
      this.calculateTotal(ids);
    });
  }

  /**
   * UC05 [Fluxo 4] - Lógica para o <select multiple>
   */
  onServicoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedIds = Array.from(selectElement.options)
      .filter(option => option.selected)
      .map(option => Number(option.value));

    this.agendamentoForm.get('servicoIds')?.setValue(selectedIds);
  }

  /**
   * UC05 [Fluxo 7] - Calcula e exibe o valor total
   */
  calculateTotal(selectedIds: number[]): void {
    this.totalCalculado = this.allServicos
      .filter(s => selectedIds.includes(s.id))
      .reduce((sum, s) => sum + s.preco, 0);
  }

  /**
   * UC05 [Fluxo 8] - Confirma o agendamento
   */
  submitForm(): void {
    if (this.agendamentoForm.invalid) {
      this.errorMessage = "Todos os campos são obrigatórios.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValue = this.agendamentoForm.value;

    const dto: AgendamentoRequestDTO = {
      clienteId: null, // O back-end identifica o cliente pelo token
      petId: Number(formValue.petId),
      dataHora: formValue.dataHora, // Garante formato ISO (ex: 2025-10-22T14:30)
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
        // UC05 [Fluxo 5a] - Horário Indisponível (CT03.2)
        this.errorMessage = err.error?.erro || "Erro ao salvar agendamento.";
      }
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
