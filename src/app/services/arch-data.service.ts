import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Monument } from '../interfaces/monument';

@Injectable({
  providedIn: 'root'
})
export class ArchDataService {

  data: Monument[];

  constructor() { }

  getProducts() { 
    let url = 'assets/archData.json'; 

    fetch('../assets/archdata.json').then(res => res.json())
    .then(json => {
      this.data = json.results;
      console.log(this.data[0]);
    });
}

}
