import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PessoaScrap } from '@app/models/pessoa-scrap';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrapForDevsService {

 
  private readonly baseURL : string = "https://scrap4devs.matheusmuniz.dev/"

  constructor(private httpClient : HttpClient) { }
  
  //GET
  GerarPessoa() : Observable<any> 
  {
    return this.httpClient.get<PessoaScrap[]>(`${this.baseURL}scraper/generate/person`)
  }

}
