import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { PetService } from '../../../services/pet.service';
import { Cliente } from '../../../models/cliente.model';
import { Pet } from '../../../models/pet.model';

@Component({
selector: 'app-cliente-form',
templateUrl: './cliente-form.component.html',
styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
clienteForm: FormGroup;
isEditMode = false;
isLoading = false;
errorMessage: string | null = null;

public clienteId: number | null = null;
public cliente: Cliente | null = null; // Para listar os pets

public isPetModalOpen = false;
public currentPetToEdit: Pet | null = null;

constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private petService: PetService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]], // só obrigatório na criação
      cpf: ['', [Validators.required, this.cpfValidator]],
      telefone: ['', [Validators.required, this.telefoneValidator]],
      endereco: ['', [Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.clienteId = +idParam;
      this.loadClienteData();

      // senha não obrigatória em edição
      this.clienteForm.get('senha')?.clearValidators();
      this.clienteForm.get('senha')?.updateValueAndValidity();
    }
  }

  loadClienteData(): void {
    if (!this.clienteId) return;
    this.isLoading = true;

    this.clienteService.getClienteById(this.clienteId).subscribe({
      next: (cliente) => {
        this.isLoading = false;
        this.cliente = cliente;
        this.clienteForm.patchValue({
          nome: cliente.nome,
          email: cliente.email,
          cpf: cliente.cpf,
          telefone: cliente.telefone,
          endereco: cliente.endereco
        });
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "Cliente não encontrado.";
        this.router.navigate(['/admin/clientes']);
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.errorMessage = "Por favor, corrija os erros no formulário.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const formValue = this.clienteForm.value;

    const saveOperation = this.isEditMode
      ? this.clienteService.updateCliente(this.clienteId!, {
          nome: formValue.nome,
          cpf: formValue.cpf,
          telefone: formValue.telefone,
          endereco: formValue.endereco
        })
      : this.clienteService.createCliente(formValue);

    saveOperation.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/clientes']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.erro || "Erro ao salvar cliente. Verifique o CPF e E-mail.";
      }
    });
  }

  // ===== Validação de CPF =====
  cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value.replace(/\D/g, '');
    if (!cpf || cpf.length !== 11) {
      return { invalidCpf: 'CPF inválido. Deve conter 11 números.' };
    }
    return null;
  }

  // ===== Validação de Telefone =====
  telefoneValidator(control: AbstractControl): ValidationErrors | null {
    const telefone = control.value.replace(/\D/g, '');
    if (!telefone || (telefone.length !== 10 && telefone.length !== 11)) {
      return { invalidTelefone: 'Telefone inválido. Deve conter 10 ou 11 números.' };
    }
    return null;
  }

  openPetModal(pet: Pet | null = null): void {
    this.currentPetToEdit = pet;
    this.isPetModalOpen = true;
  }

  closePetModal(): void {
    this.isPetModalOpen = false;
    this.currentPetToEdit = null;
  }

  handlePetSave(): void {
    this.loadClienteData(); // Atualiza a lista de pets
  }

  onDeletePet(pet: Pet): void {
    if (confirm(`Tem certeza que deseja excluir o pet "${pet.nome}"?`)) {
      this.petService.deletePet(pet.id).subscribe({
        next: () => this.loadClienteData(),
        error: () => alert("Erro ao excluir pet.")
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/clientes']);
  }
}
