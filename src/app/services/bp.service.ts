import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PessoaApi } from '@app/models/pessoa-api';
import { Observable } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class BpService {

  private readonly baseURL : string = "https://localhost:7204/api"

  constructor(private httpClient : HttpClient) { }
  
  //GET
  ObterPessoas() : Observable<any[]> 
  {
    return this.httpClient.get<PessoaApi[]>(`${this.baseURL}/Pessoa`)
  }

  //POST
  AddPessoa(pessoa : any){
    return this.httpClient.post(`${this.baseURL}/Pessoa`, pessoa)
  }

  //GET ID
  ObterPessoaPorID(id : any){
    return this.httpClient.get(`${this.baseURL}/Pessoa/${id}`)
  }

  //PUT
  AtualizarPessoa(pessoa : any){
    return this.httpClient.put(`${this.baseURL}/Pessoa`, pessoa)
  }

  //DELETE
  RemoverPessoa(id : any){
    return this.httpClient.delete(`${this.baseURL}/Pessoa/${id}`)
  }
}
