import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cgu-popup',
  templateUrl: './cgu-popup.component.html',
  styleUrls: ['./cgu-popup.component.css']
})
export class CguPopupComponent implements OnInit {
  message = `Bienvenue sur l'application DevisChef V2, pour continuer veuillez accepter les conditions générales d'utilisations.`;
  checkValue = false;
  constructor(private dialogRef: MatDialogRef<CguPopupComponent>) { }

  ngOnInit(): void {
  }

  setCGU() {
    localStorage.setItem('cgu', 'accepted');
    this.dialogRef.close(true);
  }

}
