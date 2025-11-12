import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../../services/produto.service';

@Component({
selector: 'app-produto-form',
templateUrl: './produto-form.component.html',
styleUrls: ['./produto-form.component.css']
})
export class ProdutoFormComponent implements OnInit {

produtoForm: FormGroup;
isEditMode = false;
isLoading = false;
errorMessage: string | null = null;
private produtoId: number | null = null;

constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // UC04 - Formulário com campos pertinentes [cite: 70, 222-251]
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      precoCusto: [null, [Validators.required, Validators.min(0)]],
      precoVenda: [null, [Validators.required, Validators.min(0.01)]],
      qtdEstoque: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      // MODO EDIÇÃO
      this.isEditMode = true;
      this.produtoId = +idParam;
      this.loadProdutoData();
    }
  }

  loadProdutoData(): void {
    if (!this.produtoId) return;

    this.isLoading = true;
    this.produtoService.getProdutoById(this.produtoId).subscribe({
      next: (produto) => {
        this.isLoading = false;
        this.produtoForm.patchValue(produto);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Produto não encontrado.";
        this.router.navigate(['/admin/produtos']);
      }
    });
  }

  onSubmit(): void {
    if (this.produtoForm.invalid) {
      this.errorMessage = "Por favor, corrija os erros no formulário.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const produtoData = this.produtoForm.value;

    const saveOperation = this.isEditMode
      ? this.produtoService.updateProduto(this.produtoId!, produtoData)
      : this.produtoService.createProduto(produtoData);

    saveOperation.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/produtos']);
      },
      error: (err) => {
        this.isLoading = false;
        // Validação de nome duplicado
        this.errorMessage = err.error?.erro || "Erro ao salvar produto.";
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/produtos']);
  }
}