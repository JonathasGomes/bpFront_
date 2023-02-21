import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService } from '@app/services';
import { BpService } from '@app/services/bp.service';

@Component({ templateUrl: 'list.component.html', styleUrls: ['./list.component.css'] })
export class ListComponent implements OnInit {
    users?: any[];
    pessoas?: any[];

    constructor(private userService: UserService, private bpService: BpService) {}

    ngOnInit() {
       this.obterPessoas();
    }

    deletarPessoa(id: any) {
        this.bpService.RemoverPessoa(id)
            //Chamar e atualizar a lista
            .subscribe(() => this.obterPessoas());
    }

    obterPessoas(){
        this.bpService.ObterPessoas().subscribe(pessoa => this.pessoas = pessoa)    
    }
}