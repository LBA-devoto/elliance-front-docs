import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-changer-mot-de-passe',
  templateUrl: './changer-mot-de-passe.component.html',
  styleUrls: ['./changer-mot-de-passe.component.css']
})
export class ChangerMotDePasseComponent implements OnInit {
  password: string = '';
  hide: boolean = true;
  client:String="-"+environment.client;

  constructor() { }

  ngOnInit(): void {
  }
  valider(){}
}

