import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Personnephysique } from 'src/app/shared/entities/personnephysique';
import { Tables } from 'src/app/shared/entities/tables';
import { DiaologHostComponent } from '../dialog-host/dialog-host';

@Component({
  selector: 'app-close-popup',
  templateUrl: './close-popup.component.html',
  styleUrls: ['./close-popup.component.css']
})
export class ClosePopupComponent implements OnInit {

  message: string;
  title: string;
  @Input() tab: Tables;
  success: boolean = false;
  errorProcess: boolean = false;
  process: boolean = false;
  personnephysique: Personnephysique = new Personnephysique();
  statut: string;
  constructor(
    private httpClientService: HttpclientService,
    private dialogRef: MatDialogRef<DiaologHostComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.message = this.data.msg;
    this.title = this.data.title;
    this.tab = this.data.tab;
  }
  fermer() {
    this.dialogRef.close();
  }
}