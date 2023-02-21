import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService, AlertService } from '@app/services';
import { BpService } from '../services/bp.service';
import { ScrapForDevsService } from '../services/scrap-for-devs.service';
import { distinctUntilChanged, empty, finalize, switchMap } from 'rxjs';
import { ViacepService } from '../services/viacep.service';
import { PessoaScrap } from '../models/pessoa-scrap';

import { Directive, forwardRef, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
  form!: FormGroup;
  id?: string;
  title: string = 'Registrando';
  loading = false;
  submitting = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bpService: BpService,
    private alertService: AlertService,
    private scrapService: ScrapForDevsService,
    private viacepService: ViacepService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) this.iniciarEditarPessoa();

    this.iniciarFormulario();
  }

  iniciarEditarPessoa() {
    this.title = 'Editando';
    this.loading = true;
    this.bpService.ObterPessoaPorID(this.id).subscribe((data: any) => {
      this.form.patchValue({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        cpf: data.cpf,
        rg: data.rg,
        dataNascimento: data.dataNascimento,
        nomePai: data.nomePai,
        nomeMae: data.nomeMae,
        cep: data.cep,
        endereco: data.endereco,
        numero: data.numero,
        cidade: data.cidade,
        estado: data.estado,
        bairro: data.bairro,
      });
      this.loading = false;
    });
  }

  iniciarFormulario() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      rg: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      nomePai: ['', Validators.required],
      nomeMae: ['', Validators.required],
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      bairro: ['', Validators.required],
    });
    this.cepValidator();
  }

  public limparDados() {
    this.form.reset();
  }

  get f() {
    return this.form.controls;
  }

  salvarPessoa() {
    this.submitted = true;
    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    this.submitting = true;

    if (this.id) {
      const form = this.form.value;
      form.id = this.id;

      this.bpService.AtualizarPessoa(form).subscribe({
        next: () => {
          this.alertService.success('Pessoa salva com sucesso', {
            keepAfterRouteChange: true,
          });
          this.router.navigateByUrl('/users');
        },
        error: (error) => {
          this.alertService.error(error);
          this.submitting = false;
        },
      });
    } else {
      this.bpService.AddPessoa(this.form.value).subscribe({
        next: () => {
          this.alertService.success('Pessoa salva com sucesso', {
            keepAfterRouteChange: true,
          });
          this.router.navigateByUrl('/users');
        },
        error: (error) => {
          this.alertService.error(error);
          this.submitting = false;
        },
      });
    }
  }

  gerarDados() {
    this.loading = true;
    this.scrapService.GerarPessoa().subscribe((data: PessoaScrap) => {
      this.form.patchValue({
        nome: data.name,
        telefone: data.phone,
        email: data.email,
        cpf: data.cpf,
        rg: data.rg,
        dataNascimento: data.birthdate,
        nomePai: data.father,
        nomeMae: data.mother,
        cep: data.cep,
        endereco: data.address,
        numero: data.number,
        cidade: data.city,
        bairro: data.district,
      });
      this.loading = false;
    });
  }

  cepValidator() {
    this.form
      .get('cep')
      ?.statusChanges.pipe(
        distinctUntilChanged(),
        switchMap((status) =>
          status === 'VALID'
            ? this.viacepService.queryCEP(this.form.get('cep')?.value)
            : empty()
        )
      )
      .subscribe((dados) => (dados ? this.autoCompleteCEP(dados) : {}));
  }

  autoCompleteCEP(dados: any) {
    this.form.patchValue({
      endereco: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
    });
  }

}

