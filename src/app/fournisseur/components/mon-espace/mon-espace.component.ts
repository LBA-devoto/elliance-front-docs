import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mon-espace',
  templateUrl: './mon-espace.component.html',
  styleUrls: ['./mon-espace.component.css']
})
export class MonEspaceComponent implements OnInit {
  recherche: string = '';
  constructor() { }

  ngOnInit(): void {
  }
  displayResult(event: any) {
    this.recherche = event;
  }
}
