import { Component, OnInit } from '@angular/core';
import { ApexChart, ApexDataLabels, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { DashboardUserComponent } from 'src/app/user/components/accueil/dashboard/dashboard.component';

@Component({
  selector: 'app-four-dashboard',
  templateUrl: './four-dashboard.component.html',
  styleUrls: ['./four-dashboard.component.css']
})
export class FourDashboardComponent extends DashboardUserComponent {

  constructor() {
    super()
  }

  override chartSeries: ApexNonAxisChartSeries = [67, 5, 25]
  override chartDetails: ApexChart = {
    type: 'donut',
  };
  override chartDataLabels: ApexDataLabels = {
    enabled: true
  };
  override chartLabels = ['<50%', '>50%', '>80%'];

  // Estimate Table (Devis)
  override estimateLabels = ['Référence', 'Création', 'Etat', "Prix HT"];
  override loadEstimateData() {
    // Mock table
    this.estimateMap.set('A00520', { creationDate: '11/02/2023', status: 'Annulé', price: 250.00 });
    this.estimateMap.set('A00521', { creationDate: '11/02/2023', status: 'Validé', price: 250.00 });
    this.estimateMap.set('A00522', { creationDate: '12/02/2023', status: 'En cours', price: 220.00 });
    this.estimateMap.set('A00523', { creationDate: '12/02/2023', status: 'Annulé', price: 15000.00 });
    this.estimateMap.set('A00524', { creationDate: '13/02/2023', status: 'Validé', price: 250.00 });
    this.estimateMap.set('A00525', { creationDate: '13/02/2023', status: 'En cours', price: 220.00 });
    this.estimateMap.set('A00526', { creationDate: '13/02/2023', status: 'Annulé', price: 15000.00 });

    this.loaded = true;
  }
}
