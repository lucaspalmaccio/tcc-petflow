import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicoService } from '../../../services/servico.service';

@Component({
selector: 'app-servico-form',
templateUrl: './servico-form.component.html',
// Reutilizaremos o CSS do cliente-form
styleUrls: ['../../clientes/cliente-form/cliente-form.component.css']
})
export class ServicoFormComponent implements OnInit {

servicoForm: FormGroup;
isEditMode = false;
isLoading = false;
errorMessage: string | null = null;
private servicoId: number | null = null;

constructor(
    private fb: FormBuilder,
    private servicoService: ServicoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    [cite_start]// UC04 [cite: 409] - Formulário com campos pertinentes
    this.servicoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      preco: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      // MODO EDIÇÃO
      this.isEditMode = true;
      this.servicoId = +idParam;
      this.loadServicoData();
    }
  }

  loadServicoData(): void {
    if (!this.servicoId) return;

    this.isLoading = true;
    this.servicoService.getServicoById(this.servicoId).subscribe({
      next: (servico) => {
        this.isLoading = false;
        this.servicoForm.patchValue(servico);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Serviço não encontrado.";
        this.router.navigate(['/admin/servicos']);
      }
    });
  }

  onSubmit(): void {
    if (this.servicoForm.invalid) {
      this.errorMessage = "Por favor, corrija os erros no formulário.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const servicoData = this.servicoForm.value;

    const saveOperation = this.isEditMode
      ? this.servicoService.updateServico(this.servicoId!, servicoData)
      : this.servicoService.createServico(servicoData);

    saveOperation.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/servicos']);
      },
      error: (err) => {
        this.isLoading = false;
        // Validação de nome duplicado
        this.errorMessage = err.error?.erro || "Erro ao salvar serviço.";
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/servicos']);
  }
}