import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-article-manuscrit-devis',
  templateUrl: './article-manuscrit-devis.component.html',
  styleUrls: ['./article-manuscrit-devis.component.css'],
})
export class ArticleManuscritDevisComponent implements OnInit {
  articleForm: FormGroup;
  photoFilename: string = '';
  constructor(private dialogRef: MatDialogRef<ArticleManuscritDevisComponent>) {
    this.articleForm = new FormGroup({
      codeArticle: new FormControl('', [Validators.required]),
      libelle: new FormControl('', [Validators.required]),
      nomFournisseur: new FormControl('', [Validators.required]),
      prixAchat: new FormControl('', [Validators.required]),
      prixVente: new FormControl('', [Validators.required]),
      ecoParticipation: new FormControl(''),
      tva: new FormControl('20'),
      photo: new FormControl(),
    });
  }

  ngOnInit(): void {}

  loadPhoto(event: any) {
    const htmlElement = event.target as HTMLInputElement;
    if (htmlElement.files) {
      const file = htmlElement.files[0];

      this.articleForm.get('photo')?.patchValue(file);
      this.articleForm.get('photo')?.updateValueAndValidity();
      this.photoFilename = file.name;
    }
  }

  save() {
    this.dialogRef.close(this.articleForm.value);
  }
}
