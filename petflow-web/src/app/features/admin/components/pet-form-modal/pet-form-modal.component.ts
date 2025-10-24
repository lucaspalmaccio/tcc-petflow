import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { Pet, PetDTO } from '../../models/pet.model';

@Component({
selector: 'app-pet-form-modal',
templateUrl: './pet-form-modal.component.html',
styleUrls: ['./pet-form-modal.component.css']
})
export class PetFormModalComponent implements OnChanges {
// --- Entradas e Saídas ---
@Input() clienteId: number | null = null; // ID do dono do pet
@Input() pet: Pet | null = null;         // Pet (se for edição)
@Output() closeModal = new EventEmitter<void>();
@Output() saveSuccess = new EventEmitter<void>(); // Avisa o pai que salvou

// --- Estado ---
petForm: FormGroup;
isEditMode = false;
isLoading = false;
errorMessage: string | null = null;

constructor(
    private fb: FormBuilder,
    private petService: PetService
  ) {
    this.petForm = this.fb.group({
      nome: ['', Validators.required],
      especie: ['', Validators.required],
      raca: ['', Validators.required]
    });
  }

  /**
   * Detecta quando o @Input 'pet' muda (ao abrir o modal para edição).
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pet'] && this.pet) {
      // Modo Edição
      this.isEditMode = true;
      this.petForm.patchValue(this.pet);
    } else {
      // Modo Criação
      this.isEditMode = false;
      this.petForm.reset();
    }
  }

  /**
   * Salva o Pet (Criação ou Edição)
   * UC03 - Fluxo "Adicionar Pet" ou "Editar Pet"
   */
  submitForm(): void {
    if (this.petForm.invalid || !this.clienteId) {
      this.errorMessage = "Todos os campos são obrigatórios.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const petData: PetDTO = {
      ...this.petForm.value,
      clienteId: this.clienteId
    };

    const saveOperation = this.isEditMode && this.pet
      ? this.petService.updatePet(this.pet.id, petData)
      : this.petService.createPet(petData);

    saveOperation.subscribe({
      next: () => {
        this.isLoading = false;
        this.saveSuccess.emit(); // Emite o evento de sucesso
        this.onClose();          // Fecha o modal
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.erro || "Erro ao salvar o pet.";
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