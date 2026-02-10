import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Personnephysique } from 'src/app/shared/entities/personnephysique';
import { Tables } from 'src/app/shared/entities/tables';

@Component({
  selector: 'app-suppression-personnephysique',
  templateUrl: './dialog-host.html',
  styleUrls: ['./dialog-host.css'],
})
export class DiaologHostComponent implements OnInit {
  message: string;
  title: string;
  tab: Tables;
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

  confirm() {
    this.dialogRef.close(true);
  }

  fermer() {
    this.dialogRef.close();
  }
}
