import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';
import { ApexDataLabels, ChartComponent } from 'ng-apexcharts/public_api';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardUserComponent implements OnInit {
  // Chart
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  chartSeries: ApexNonAxisChartSeries = [67, 5, 25, 3];
  chartDetails: ApexChart = {
    type: 'donut',
  };
  chartDataLabels: ApexDataLabels = {
    enabled: true,
  };
  chartLabels = ['Commandé', 'Perdu', 'Envoyé', 'Annulé'];

  // Estimate Table (Devis)
  estimateLabels = ['Numéro', 'Création', 'Etat', 'Client', 'Prix HT'];
  estimateMap: Map<string, any> = new Map();
  loaded = false;

  get estimateEntries() {
    return Array.from(this.estimateMap.entries());
  }

  constructor() {
    this.setChartOptions();
  }

  ngOnInit(): void {
    this.loadChartData();
    this.loadEstimateData();
  }

  setChartOptions() {
    this.chartOptions = {
      series: [67, 5, 25, 3],
      chart: {
        type: 'donut',
      },
      labels: ['Commandé', 'Perdu', 'Envoyé', 'Annulé'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'right',
            },
          },
        },
      ],
    };
  }

  loadChartData() {
    // Requête via service pour peupler les séries et labels du graphique.
  }

  loadEstimateData() {
    // Requête via service pour peupler la table des derniers devis.

    // Mock table
    this.estimateMap.set('A00520', {
      creationDate: '11/02/2023',
      status: 'Accepté',
      client: 'EX123',
      price: 250.0,
    });
    this.estimateMap.set('A00521', {
      creationDate: '11/02/2023',
      status: 'Refusé',
      client: 'EX456',
      price: 250.0,
    });
    this.estimateMap.set('A00522', {
      creationDate: '12/02/2023',
      status: 'En attente',
      client: 'EX456',
      price: 220.0,
    });
    this.estimateMap.set('A00523', {
      creationDate: '12/02/2023',
      status: 'Accepté',
      client: 'EX123',
      price: 15000.0,
    });
    this.estimateMap.set('A00524', {
      creationDate: '13/02/2023',
      status: 'Refusé',
      client: 'EX456',
      price: 250.0,
    });
    this.estimateMap.set('A00525', {
      creationDate: '13/02/2023',
      status: 'En attente',
      client: 'EX456',
      price: 220.0,
    });
    this.estimateMap.set('A00526', {
      creationDate: '13/02/2023',
      status: 'Accepté',
      client: 'EX123',
      price: 15000.0,
    });

    this.loaded = true;
  }
}
