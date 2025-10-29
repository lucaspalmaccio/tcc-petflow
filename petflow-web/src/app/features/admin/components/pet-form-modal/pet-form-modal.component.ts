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

@Input() clienteId: number | null = null;
@Input() pet: Pet | null = null;

@Output() closeModal = new EventEmitter<void>();
@Output() saveSuccess = new EventEmitter<void>();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pet'] && this.pet) {
      this.isEditMode = true;
      this.petForm.patchValue({
        nome: this.pet.nome,
        especie: this.pet.especie,
        raca: this.pet.raca
      });
    } else {
      this.isEditMode = false;
      this.petForm.reset();
    }
  }

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
        this.saveSuccess.emit();
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.erro || "Erro ao salvar o pet.";
      }
    });
  }

  /** Fecha o modal */
  close(): void {
    this.petForm.reset();
    this.errorMessage = null;
    this.isEditMode = false;
    this.closeModal.emit();
  }

  /** Fecha ao clicar no overlay */
  onOverlayClick(event: MouseEvent): void {
    event.stopPropagation();
    this.close();
  }
}
