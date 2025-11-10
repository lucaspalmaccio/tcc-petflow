import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientePerfilService, ClientePerfil, Pet, AlterarSenha } from '../../../../core/services/cliente-perfil.service';

@Component({
selector: 'app-cliente-perfil',
templateUrl: './cliente-perfil.component.html',
styleUrls: ['./cliente-perfil.component.css']
})
export class ClientePerfilComponent implements OnInit {
perfilForm!: FormGroup;
senhaForm!: FormGroup;
petForm!: FormGroup;

perfil: ClientePerfil | null = null;
pets: Pet[] = [];

editandoPerfil = false;
editandoSenha = false;
adicionandoPet = false;
editandoPet: Pet | null = null;

mensagem = '';
erro = '';

constructor(
    private fb: FormBuilder,
    private perfilService: ClientePerfilService
  ) {}

  ngOnInit(): void {
    this.criarFormularios();
    this.carregarDados();
  }

  criarFormularios(): void {
    this.perfilForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      endereco: ['']
    });

    this.senhaForm = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarNovaSenha: ['', Validators.required]
    });

    this.petForm = this.fb.group({
      nome: ['', Validators.required],
      especie: ['', Validators.required],
      raca: ['', Validators.required]
    });
  }

  carregarDados(): void {
    this.perfilService.buscarMeuPerfil().subscribe({
      next: (perfil) => {
        this.perfil = perfil;
        this.perfilForm.patchValue(perfil);
      },
      error: () => this.mostrarErro('Erro ao carregar perfil')
    });

    this.carregarPets();
  }

  carregarPets(): void {
    this.perfilService.listarMeusPets().subscribe({
      next: (pets) => (this.pets = pets),
      error: () => this.mostrarErro('Erro ao carregar pets')
    });
  }

  editarPerfil(): void {
    this.editandoPerfil = true;
  }

  cancelarEdicaoPerfil(): void {
    this.editandoPerfil = false;
    if (this.perfil) this.perfilForm.patchValue(this.perfil);
  }

  salvarPerfil(): void {
    if (!this.perfilForm.valid || !this.perfil) return;

    const perfilAtualizado = { ...this.perfil, ...this.perfilForm.value };
    this.perfilService.atualizarMeuPerfil(perfilAtualizado).subscribe({
      next: (perfil) => {
        this.perfil = perfil;
        this.editandoPerfil = false;
        this.mostrarMensagem('Perfil atualizado com sucesso!');
      },
      error: () => this.mostrarErro('Erro ao atualizar perfil')
    });
  }

  abrirAlterarSenha(): void {
    this.editandoSenha = true;
    this.senhaForm.reset();
  }

  cancelarAlterarSenha(): void {
    this.editandoSenha = false;
    this.senhaForm.reset();
  }

  alterarSenha(): void {
    if (!this.senhaForm.valid) return;
    const dados: AlterarSenha = this.senhaForm.value;

    if (dados.novaSenha !== dados.confirmarNovaSenha) {
      this.mostrarErro('As senhas não coincidem');
      return;
    }

    this.perfilService.alterarSenha(dados).subscribe({
      next: () => {
        this.editandoSenha = false;
        this.senhaForm.reset();
        this.mostrarMensagem('Senha alterada com sucesso!');
      },
      error: () =>
        this.mostrarErro('Erro ao alterar senha. Verifique a senha atual.')
    });
  }

  abrirAdicionarPet(): void {
    this.adicionandoPet = true;
    this.editandoPet = null;
    this.petForm.reset();
  }

  abrirEditarPet(pet: Pet): void {
    this.editandoPet = pet;
    this.adicionandoPet = true;
    this.petForm.patchValue(pet);
  }

  cancelarPet(): void {
    this.adicionandoPet = false;
    this.editandoPet = null;
    this.petForm.reset();
  }

  salvarPet(): void {
    if (!this.petForm.valid) return;
    const pet: Pet = this.petForm.value;

    const request = this.editandoPet?.id
      ? this.perfilService.atualizarPet(this.editandoPet.id, pet)
      : this.perfilService.criarPet(pet);

    request.subscribe({
      next: () => {
        this.carregarPets();
        this.cancelarPet();
        this.mostrarMensagem(
          this.editandoPet ? 'Pet atualizado com sucesso!' : 'Pet adicionado com sucesso!'
        );
      },
      error: () => this.mostrarErro('Erro ao salvar pet')
    });
  }

  deletarPet(pet: Pet): void {
    if (pet.id && confirm(`Deseja realmente deletar ${pet.nome}?`)) {
      this.perfilService.deletarPet(pet.id).subscribe({
        next: () => {
          this.carregarPets();
          this.mostrarMensagem('Pet removido com sucesso!');
        },
        error: () => this.mostrarErro('Erro ao deletar pet')
      });
    }
  }

  mostrarMensagem(msg: string): void {
    this.mensagem = msg;
    this.erro = '';
    setTimeout(() => (this.mensagem = ''), 3000);
  }

  mostrarErro(msg: string): void {
    this.erro = msg;
    this.mensagem = '';
    setTimeout(() => (this.erro = ''), 3000);
  }
}
