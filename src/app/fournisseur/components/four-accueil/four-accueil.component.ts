import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-four-accueil',
  templateUrl: './four-accueil.component.html',
  styleUrls: ['./four-accueil.component.css']
})
export class FourAccueilComponent implements OnInit {
  name: any;

  constructor() {
  }

  ngOnInit(): void {
    this.setName();
  }

  setName() {
    let prenom = localStorage.getItem('name') ? localStorage.getItem('name') : sessionStorage.getItem('name') ? sessionStorage.getItem('name') : '';
    let nom = localStorage.getItem('surname') ? localStorage.getItem('surname') : sessionStorage.getItem('surname') ? sessionStorage.getItem('surname') : '';

    this.name = `${prenom} ${nom}`;
  }

}
