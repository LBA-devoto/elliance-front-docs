import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { environment } from 'src/environments/environment';
import { ExtranetService } from '../../services/extranet.service';
import { Extranet, ExtranetClient } from '../../entities/extranet';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tab-extranet',
  templateUrl: './tab-extranet.component.html',
  styleUrls: ['./tab-extranet.component.css']
})
export class TabExtranetComponent implements OnInit {
  form: FormGroup;
  champTexte: string = ''; // En cas de texte sur la partie gauche
  saving = false;
  picto?= false;
  defaultProdElements = [
    {
      element: 'pictogramme',
      data: true
    },
    {
      element: 'favoris',
      data: true,
    },
    {
      element: 'image',
      data: true
    },
    {
      element: 'champs',
      data: [
        {
          champ: null,
          css: null,
          extension: null,
          displayLabel: true,
        }
      ],
    },
  ];
  defaultFournisseurElements = [
    {
      element: 'image',
      data: true
    },
    {
      element: 'champs',
      data: [
        {
          champ: null,
          css: null,
          extension: null,
          displayLabel: true
        }
      ],
    },
  ];

  tabs: Extranet[] = [
    {
      ref: 'detail',
      title: 'Page détail produit',
      entite: 'produit',
      elements: [
        {
          element: 'titre',
          data: null,
          picto: false
        },
        {
          element: 'principale-gauche',
          data: 'images', // 'images' ou 'texte'
        },
        {
          element: 'principale-droite',
          data: [
            {
              champ: null,
              css: null,
              extension: null,
              displayLabel: true
            }
          ],
        },
        {
          element: 'carac',
          data: [
            {
              onglet: 'Descriptif',
              content: []
            },
            {
              onglet: 'Caractéristiques techniques',
              content: []
            },
            {
              onglet: 'Documents',
              content: []
            }
          ]
        }
      ]
    },
    {
      ref: 'produit',
      title: 'Composant produit',
      entite: 'produit',
      elements: this.defaultProdElements
    },
    {
      ref: 'fournisseur',
      title: 'Composant fournisseur',
      entite: 'personnemorale',
      elements: this.defaultFournisseurElements
    }
  ];

  mapChamps: Map<string, any> = new Map();
  tabInputIndex = -1;

  get prodPictoValue() {
    return this.tabs[1].elements[0] ? (this.tabs[1].elements[0].data ? 'true' : 'false') : 'false';
  }

  get prodFavValue() {
    return this.tabs[1].elements[1] ? (this.tabs[1].elements[1].data ? 'true' : 'false') : 'false';
  }

  get prodImageValue() {
    return this.tabs[1].elements[2] ? (this.tabs[1].elements[2].data ? 'true' : 'false') : 'false';
  }

  get fournisseurImageValue() {
    return this.tabs[2].elements[0] ? (this.tabs[2].elements[0].data ? 'true' : 'false') : 'false';
  }

  constructor(private entityService: EntityService, private extranetService: ExtranetService) {
    this.form = new FormGroup({
      detailTitre: new FormControl(''),
      detailGauche: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.loadChamps();

    this.extranetService.getExtranet(environment.client).then((resp: Extranet[]) => {
      if (resp) {
        this.tabs = resp;
        this.form.get('detailTitre')?.setValue(this.tabs[0].elements[0].data);
        this.form.get('detailGauche')?.setValue(this.tabs[0].elements[1].data != 'images' ? 'texte' : 'images');
        this.picto = this.tabs[0].elements[0].picto;
      } else {
        this.form.get('detailTitre')?.setValue('titre');
        this.form.get('detailGauche')?.setValue('images');
      }
    });
  }

  loadChamps() {
    this.tabs.forEach((tab) => {
      this.getChamps(tab, 2);
    })
  }

  // getChamps(tab: any, tries: number) {
  //   if (tries > 0) {
  //     this.entityService
  //     .recouperChampsdEntite(tab.entite)
  //     .subscribe((res: any) => {
  //       if (res.waiting) {
  //         setTimeout(() => {
  //           this.getChamps(tab, tries - 1);
  //         }, 1000)
  //       } else {
  //         this.mapChamps.set(tab.ref, res);
  //         this.entityService.setReqMap(tab.entite, res);
  //       }
        
        
  //     })
  //   }

  // }
  async getChamps(tab: any, tries: number) {
    if (tries > 0) {
      try {
        const res = await this.entityService.recouperChampsdEntite(tab.entite);
  
        this.mapChamps.set(tab.ref, res);
        this.entityService.setReqMap(tab.entite, res);
      } catch (error) {
        console.error('Error getting entity fields:', error);
      }
    }
  }
  
  setPicto(event: any) {
    this.picto = event.value == 'true';
  }

  setChampTexte(event: any) {
    this.champTexte = event;
  }

  removeCaracTab(i: number) {
    this.tabs[0].elements[3].data.splice(i, 1)
  }

  removeDroiteData(i: number, k?: number) {
    let elementVal = (k == 2) ? 1 : ((k == 1) ? 3 : 2);
    this.tabs[k ? k : 0].elements[elementVal].data.splice(i, 1)
  }

  raiseDroiteData(i: number, k?: number) {
    let elementVal = (k == 2) ? 1 : ((k == 1) ? 3 : 2);
    moveItemInArray(this.tabs[k ? k : 0].elements[elementVal].data, i, i - 1)
  }

  addDetailChamp(k?: number) {

    let elementVal = (k == 2) ? 1 : ((k == 1) ? 3 : 2);

    this.tabs[k ? k : 0].elements[elementVal]?.data.push(
      {
        champ: null,
        css: null,
        extension: null,
        displayLabel: true
      }
    )
  }

  setDetailChamp(i: number, event: any, k?: number) {
    let elementVal = (k == 2) ? 1 : ((k == 1) ? 3 : 2);
    this.tabs[k ? k : 0].elements[elementVal].data[i].champ = event;
  }

  setDetailCSS(i: number, event: any, k?: number) {
    let elementVal = (k == 2) ? 1 : ((k == 1) ? 3 : 2);
    this.tabs[k ? k : 0].elements[elementVal].data[i].css = event.target.value;
  }

  setDetailExtension(i: number, event: any, k?: number) {
    let elementVal = (k == 2) ? 1 : ((k == 1) ? 3 : 2);
    this.tabs[k ? k : 0].elements[elementVal].data[i].extension = event.target.value;
  }

  setDetailLabel(i: number, event: any, k?: number) {
    let elementVal = (k == 2) ? 1 : ((k == 1) ? 3 : 2);
    this.tabs[k ? k : 0].elements[elementVal].data[i].displayLabel = event.value === 'true';
  }

  addDetailSeparateur(k?: number) {
    let elementVal = (k == 2) ? 1 : ((k == 1) ? 3 : 2);
    this.tabs[k ? k : 0].elements[elementVal]?.data.push(
      'sep'
    )
  }

  addCaracTab() {
    this.tabs[0].elements[3].data.push(
      {
        onglet: null,
        content: []
      }
    );
  }

  addCaracChamp(i: number) {
    this.tabs[0].elements[3].data[i].content.push(
      {
        champ: null,
        css: null,
        extension: null,
        displayLabel: true
      }
    );
  }

  addCaracSeparateur(i: number) {
    this.tabs[0].elements[3].data[i].content.push(
      'sep'
    );
  }

  trackByFn(index: number, item: any) {
    return item.champ;
  }

  moveCaracTab(index: number) {
    moveItemInArray(this.tabs[0].elements[3].data, index, index - 1)
  }

  removeCaracData(tabIndex: number, elementIndex: number) {
    this.tabs[0].elements[3].data[tabIndex].content.splice(elementIndex, 1);
  }

  raiseCaracData(tabIndex: number, elementIndex: number) {
    moveItemInArray(this.tabs[0].elements[3].data[tabIndex].content, elementIndex, elementIndex - 1);
  }

  setCaracChamp(tabIndex: number, elementIndex: number, event: any) {
    this.tabs[0].elements[3].data[tabIndex].content[elementIndex].champ = event;
  }

  setCaracCSS(tabIndex: number, elementIndex: number, event: any) {
    this.tabs[0].elements[3].data[tabIndex].content[elementIndex].css = event.target.value;
  }

  setCaracExtension(tabIndex: number, elementIndex: number, event: any) {
    this.tabs[0].elements[3].data[tabIndex].content[elementIndex].extension = event.target.value;
  }

  setCaracLabel(tabIndex: number, elementIndex: number, event: any) {
    this.tabs[0].elements[3].data[tabIndex].content[elementIndex].displayLabel = event.value === 'true';
  }

  addName(event: any) {
    let i = event.index;

    if (!this.tabs[0].elements[3].data[i].onglet) {
      this.tabInputIndex = i;
    }
  }

  saveName(i: number, event: Event) {
    
    if(event.target instanceof HTMLInputElement)
      this.tabs[0].elements[3].data[i].onglet = event?.target?.value;
    this.tabInputIndex = -1;
  }


  setProdData(index: number, event: any) {
    if (this.tabs[1].elements[index]) {
      this.tabs[1].elements[index].data = event.value == 'true';
    } else {
      this.tabs[1].elements = this.defaultProdElements;
      this.tabs[1].elements[index].data = event.value == 'true';
    }
  }

  setFournisseurData(index: number, event: any) {
    if (this.tabs[2].elements[index]) {
      this.tabs[2].elements[index].data = event.value == 'true';
    } else {
      this.tabs[2].elements = this.defaultFournisseurElements;
      this.tabs[2].elements[index].data = event.value == 'true';
    }
  }

  save() {
    this.saving = true;
    this.tabs[0].elements[0].data = this.form.get('detailTitre')?.value;
    this.tabs[0].elements[0].picto = this.picto;
    this.tabs[0].elements[1].data = this.form.get('detailGauche')?.value == 'images' ? 'images' : { champ: this.champTexte };

    let extranet = new ExtranetClient();
    extranet.client = environment.client;
    extranet.extranet = this.tabs;

    this.extranetService.saveExtranet(extranet).then((resp) => {
      this.saving = false;
    }).catch((err) => {
      this.saving = false;
    });

  }
}
