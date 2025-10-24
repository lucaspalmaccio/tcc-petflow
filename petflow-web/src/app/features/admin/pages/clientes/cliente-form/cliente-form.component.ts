import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { PetService } from '../../../services/pet.service';
import { Cliente }
from '../../../models/cliente.model';
import { Pet } from '../../../models/pet.model';

@Component({
selector: 'app-cliente-form',
templateUrl: './cliente-form.component.html',
styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
// --- Estado do Componente ---
clienteForm: FormGroup;
isEditMode = false;
isLoading = false;
errorMessage: string | null = null;

// --- Dados do Cliente e Pets ---
private clienteId: number | null = null;
public cliente: Cliente | null = null; // Para listar os pets

// --- Estado do Modal de Pet ---
public isPetModalOpen = false;
public currentPetToEdit: Pet | null = null;

constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private petService: PetService,
    private router: Router,
    private route: ActivatedRoute // Para ler o :id da URL
  ) {
    // UC02 [130] - Formulário com campos: Nome, CPF, Telefone, Endereço
    // e dados de acesso (E-mail, Senha) [131]
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]], // Obrigatório só na criação
      cpf: ['', [Validators.required]], // (Validação de CPF pode ser adicionada)
      telefone: ['', Validators.required],
      endereco: ['']
    });
  }

  ngOnInit(): void {
    // Verifica se há um 'id' nos parâmetros da rota
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      // MODO EDIÇÃO
      this.isEditMode = true;
      this.clienteId = +idParam; // Converte string para número

      // UC02 [133c] - Sistema exibe os dados do cliente
      this.loadClienteData();

      // Em modo de edição, a senha não é obrigatória (nem deve ser alterada aqui)
      this.clienteForm.get('senha')?.clearValidators();
      this.clienteForm.get('senha')?.updateValueAndValidity();
    }
    // else: MODO CRIAÇÃO (formulário já está pronto)
  }

  /**
   * Carrega os dados do cliente (usado no modo de edição).
   */
  loadClienteData(): void {
    if (!this.clienteId) return;

    this.isLoading = true;
    this.clienteService.getClienteById(this.clienteId).subscribe({
      next: (cliente) => {
        this.isLoading = false;
        this.cliente = cliente; // Armazena o cliente (para listar os pets)
        // Preenche o formulário com os dados
        this.clienteForm.patchValue({
          nome: cliente.nome,
          email: cliente.email, // (Desabilitar e-mail em edição seria uma boa prática)
          cpf: cliente.cpf,
          telefone: cliente.telefone,
          endereco: cliente.endereco
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Cliente não encontrado.";
        this.router.navigate(['/admin/clientes']);
      }
    });
  }

  /**
   * Salva o Cliente (Criação ou Edição)
   * UC02 [131] ou [134]
   */
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
        // (Adicionar Toast de sucesso)
        this.router.navigate(['/admin/clientes']);
      },
      error: (err) => {
        this.isLoading = false;
        // UC02 [137] - Dados Inválidos/Duplicados
        this.errorMessage = err.error?.erro || "Erro ao salvar cliente. Verifique o CPF e E-mail.";
      }
    });
  }

  // --- Funções de Controle do Modal de Pet (UC03) ---

  /**
   * UC03 [135] - Administrador seleciona "Adicionar Pet"
   */
  openPetModal(pet: Pet | null = null): void {
    this.currentPetToEdit = pet;
    this.isPetModalOpen = true;
  }

  closePetModal(): void {
    this.isPetModalOpen = false;
    this.currentPetToEdit = null;
  }

  /**
   * Chamado quando o modal de pet emite 'saveSuccess'.
   * Recarrega os dados do cliente para exibir o pet novo/atualizado.
   */
  handlePetSave(): void {
    this.loadClienteData(); // Recarrega o cliente e sua lista de pets
  }

  /**
   * UC03 (Implícito) - Excluir Pet
   */
  onDeletePet(pet: Pet): void {
    if (confirm(`Tem certeza que deseja excluir o pet "${pet.nome}"?`)) {
      this.petService.deletePet(pet.id).subscribe({
        next: () => this.loadClienteData(), // Recarrega
        error: (err) => alert("Erro ao excluir pet.")
      });
    }
  }

  /**
   * Navega de volta para a lista.
   */
  goBack(): void {
    this.router.navigate(['/admin/clientes']);
  }
}