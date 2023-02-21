import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViacepService {
  private readonly VIACEP_URL = 'https://viacep.com.br/ws/';
  
  constructor(private http: HttpClient) {}

  public queryCEP(cep: string) {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(`${this.VIACEP_URL}${cep}/json`, { headers: headers });
  }

  ExistsCEPValidate() {

    return (control: AbstractControl) => {

      const address = control['_parent']['controls']['endereco']; 
      const district = control['_parent']['controls']['bairro']; 
      const city = control['_parent']['controls']['cidade']; 
      const state = control['_parent']['controls']['estado']; 

      return control.valueChanges.pipe(
        map((cep) => {
          this.queryCEP(cep).subscribe({
            error: (err) => {
              address.setValue("")
                district.setValue("")
                city.setValue("")
                state.setValue("")
              control.setErrors({ cep: true });
              return { cep: true };
            },
            next: (data : any ) => {
              if (data && !data.hasOwnProperty('erro')) {
                address.setValue(data?.logradouro)
                district.setValue(data?.bairro)
                city.setValue(data?.localidade)
                state.setValue(data?.uf)
                control.setErrors(null);

                return null;
              } else {
                address.setValue("")
                district.setValue("")
                city.setValue("")
                state.setValue("")
                control.setErrors({ cep: true });
                return { cep: true };
              }
            },
          });
        })
      );
    };
   }

   
   
}