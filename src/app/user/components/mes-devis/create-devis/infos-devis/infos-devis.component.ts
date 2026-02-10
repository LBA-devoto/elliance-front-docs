import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FournisseurService } from 'src/app/services/fournisseur.service';

@Component({
  selector: 'app-infos-devis',
  templateUrl: './infos-devis.component.html',
  styleUrls: ['./infos-devis.component.css']
})
export class InfosDevisComponent implements OnInit {
  displayForm = false;
  infosForm: FormGroup;

  $presta: Subject<any> = new Subject();
  $factu: Subject<any> = new Subject();
  $comm: Subject<any> = new Subject();

  prestaAClist: any = [];
  factuAClist: any = [];

  @Output()
  infos: EventEmitter<any> = new EventEmitter();

  constructor(private fournisseurService: FournisseurService) {
    this.infosForm = new FormGroup({
      client: new FormControl('', []),
      clientFacturation: new FormControl('', []),
      commercial: new FormControl('', []),
    })
  }

  ngOnInit(): void {
    this.loadPipes();
  }

  loadPipes() {
    this.$presta.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((name) => {
      this.autocomplete(0, name);
    });

    this.$factu.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((name) => {
      this.autocomplete(1, name);
    });
  }

  autocomplete(inputIndex: number, text: string) {
    this.fournisseurService.getFournisseursAutocomplete(text)
      .then((res: any) => {
        if (inputIndex === 0 && res.content.length > 0) {
          this.prestaAClist = res.content
        } else if (inputIndex === 1 && res.content.length > 0) {
          this.factuAClist = res.content
        } else {
          this.prestaAClist = [];
          this.factuAClist = [];
        }
      })
  }

  prestationAC(event: any) {
    this.$presta.next(event.target.value)
  }

  facturationAC(event: any) {
    this.$factu.next(event.target.value)
  }

  commercialAC(event: any) {
    // this.$presta.next(event.target.value)
  }

  selectPresta(nom: string) {
    this.infosForm.get('client')?.setValue(nom);
    this.prestaAClist = [];
    this.emitInfos();
  }

  selectFactu(nom: string) {
    this.infosForm.get('clientFacturation')?.setValue(nom);
    this.factuAClist = [];
    this.emitInfos();
  }

  emitInfos() {
    this.infos.emit({presta: this.infosForm.get('client')?.value, factu: this.infosForm.get('clientFacturation')?.value, commercial: this.infosForm.get('commercial')?.value})
  }


}
