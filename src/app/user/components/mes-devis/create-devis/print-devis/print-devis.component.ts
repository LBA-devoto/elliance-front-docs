import { AfterContentInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FournisseurService } from 'src/app/services/fournisseur.service';

@Component({
  selector: 'app-print-devis',
  templateUrl: './print-devis.component.html',
  styleUrls: ['./print-devis.component.css'],
})
export class PrintDevisComponent implements OnInit, AfterContentInit {
  protected printForm: FormGroup;

  get docTechniqueActive() {
    return this.printForm.get('docTechnique')?.value;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fournisseursService: FournisseurService
  ) {
    this.printForm = new FormGroup({
      associe: new FormControl('', [Validators.required]),
      interlocuteur: new FormControl('', [Validators.required]),
      numero: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required]),
      recherche: new FormControl('', []),
      civilite: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      societe: new FormControl('', [Validators.required]),
      adresse: new FormControl('', [Validators.required]),
      codePostal: new FormControl('', [Validators.required]),
      ville: new FormControl('', [Validators.required]),
      pageGarde: new FormControl('', []),
      conditionsGenerales: new FormControl('', []),
      devisDetail: new FormControl('', []),
      cacherRef: new FormControl('', []),
      cacherMarques: new FormControl('', []),
      docTechnique: new FormControl('', []),
      ficheTechnique: new FormControl('', []),
      masquerPrix: new FormControl('', []),
      afficherImages: new FormControl('', []),
      conditionsReglement: new FormControl('', []),
      conditionsFacturation: new FormControl('', []),
      garanties: new FormControl('', []),
      autres: new FormControl('', []),
      coordonneesBancaires: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    //
  }

  ngAfterContentInit(): void {
    this.fillForm();
    this.setDisabledFormControls();
  }

  setDisabledFormControls() {
    this.printForm.get('associe')?.disable();
    this.printForm.get('interlocuteur')?.disable();
    this.printForm.get('numero')?.disable();
  }

  fillForm() {
    // this.printForm.get('associe')?.setValue();
    let prenom = localStorage.getItem('name');
    let nom = localStorage.getItem('surname');
    this.printForm.get('interlocuteur')?.setValue(`${nom} ${prenom}`);
    this.printForm.get('numero')?.setValue(this.data.titre);

    this.loadClientInfos();

    this.printForm.get('pageGarde')?.setValue(true);
    this.printForm.get('conditionsGenerales')?.setValue(true);
    this.printForm.get('docTechnique')?.setValue(true);
    this.printForm.get('afficherImages')?.setValue(true);
    if (this.docTechniqueActive) {
      this.printForm.get('masquerPrix')?.setValue(true);
    }
  }

  loadClientInfos() {
    this.fournisseursService
      .getFournisseursAutocomplete(this.data.infos.presta)
      .then((res: any) => {
        this.fournisseursService
          .getFournisseurById(res.content[0].id)
          .then((four: any) => {
            this.printForm.get('client')?.setValue(four.codefour);
            this.printForm.get('societe')?.setValue(four.enseigne);
            this.printForm
              .get('adresse')
              ?.setValue(four.addresses[0].adresseligne[0]);
            this.printForm
              .get('codePostal')
              ?.setValue(four.addresses[0].codepostal.valeur);
            this.printForm
              .get('ville')
              ?.setValue(four.addresses[0].ville.titre);
          });
      });
  }

  save() {}
}
