import { Component, OnInit } from '@angular/core';
import { PATHS } from 'src/app/app-routing.module';
import { DevisService } from 'src/app/shared/services/devis.service';
import { ExportService } from 'src/app/shared/services/export.service';

@Component({
  selector: 'app-mes-devis',
  templateUrl: './mes-devis.component.html',
  styleUrls: ['./mes-devis.component.css'],
})
export class MesDevisComponent implements OnInit {
  recherche: string;

  dataSource: any[] = [];
  displayedColumns = [
    'titre',
    'creationDate',
    'elaborePar',
    'commercial',
    'etat',
    'client',
    'clientFacturation',
    'prixHT',
    'prixTTC',
    'actions',
  ];
  actions = [
    {
      actionTitle: 'Visualiser',
      action: () => {},
    },
    {
      actionTitle: 'Imprimer',
      action: () => {},
    },
    {
      actionTitle: 'Reprendre',
      action: () => {},
    },
    {
      actionTitle: 'Dupliquer',
      action: () => {},
    },
    {
      actionTitle: 'Nouvelle version',
      action: () => {},
    },
    {
      actionTitle: 'Statut: Envoyé',
      action: () => {},
    },
    {
      actionTitle: 'Statut: Perdu',
      action: () => {},
    },
    {
      actionTitle: 'Archiver',
      action: () => {},
    },
    {
      actionTitle: 'Exporter',
      action: () => {},
    },
  ];

  get getActions() {
    return this.actions;
  }

  get createRoute() {
    return `/${PATHS.devis}/create`;
  }

  constructor(
    private devisService: DevisService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.loadDevis();
  }

  loadDevis() {
    this.devisService
      .getDevis()
      .then((res: any) => {
        this.dataSource = res;
      })
      .catch((err) => {});
  }

  displayResult(event: any) {
    this.recherche = event;
  }

  rechercheDevis(event: any) {}

  export() {}
}
