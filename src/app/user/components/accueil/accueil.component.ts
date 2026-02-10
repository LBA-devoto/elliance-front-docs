import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  @ViewChild('searchProduct') searchProduct: any;
  name: any;

  hasNews?: boolean;
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

  setNews(event: any) {
    this.hasNews = event;    
  }
}
