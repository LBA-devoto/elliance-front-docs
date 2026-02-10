import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DevisStatusEnum } from '../create-devis.component';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ArticleManuscritDevisComponent } from '../article-manuscrit-devis/article-manuscrit-devis.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-outils-devis',
  templateUrl: './outils-devis.component.html',
  styleUrls: ['./outils-devis.component.css']
})
export class OutilsDevisComponent implements OnInit {
  allStatus = [DevisStatusEnum.SENT, DevisStatusEnum.LOST, DevisStatusEnum.COMMAND, DevisStatusEnum.DRAFT, DevisStatusEnum.DELETED];
  colors = ['#20d450', '#d42020', '#f0c3fa', '#0acaf5', '#000'];
  @Input() status: DevisStatusEnum = DevisStatusEnum.DRAFT;
  @Input() selectedLines: any;
  @Input() lines: any;
  quantity: number = 1;
  vat: number = 20;
  numero: number = 1;
  discount: number = 0;
  discountTaux: number = 0;
  switchTool = false;

  prixApproche: number = 0;
  prixVente: number = 100;
  coefMarge: number = 1;
  separator: number = 1;
  separatorText: string = '';
  subTotal: number = 1;
  comment: string = '';
  multiLinesCoef: number = 1;
  discountModeTaux: boolean = true;

  // 0: Prix public 
  // 1: Prix coef 
  // 2: Prix vente perso 
  prixVenteType = 0;

  @Input() resetpp: EventEmitter<boolean> = new EventEmitter();

  @Output() statusChange: EventEmitter<any> = new EventEmitter();
  @Output() switch: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<boolean> = new EventEmitter();
  @Output() qtt: EventEmitter<number> = new EventEmitter();
  @Output() num: EventEmitter<number> = new EventEmitter();
  @Output() vatChange: EventEmitter<number> = new EventEmitter();
  @Output() discountChange: EventEmitter<{taux: number, montant: number}> = new EventEmitter();
  @Output() commentChange: EventEmitter<string> = new EventEmitter();
  @Output() priceChange: EventEmitter<any> = new EventEmitter();
  @Output() multiPriceChange: EventEmitter<any> = new EventEmitter();
  @Output() publicPriceChange: EventEmitter<any> = new EventEmitter();
  @Output() hidePriceEvent: EventEmitter<any> = new EventEmitter();

  @Output() separatorIndex: EventEmitter<any> = new EventEmitter();
  @Output() subTotalIndex: EventEmitter<any> = new EventEmitter();

  @Output() newArticle: EventEmitter<any> = new EventEmitter();


  displayNumChange = false;
  displayPriceChange = false;
  displayQttChange = false;
  displayVATChange = false;
  displayDiscountChange = false;
  displayComment = false;
  displaySeparator = false;
  displaySubTotal = false;
  displayCoefPrice = false;
  displayPublicPrice = false;

  get prixPublic() {
    return this.decimalPipe.transform(this.selectedLines[0].prixVente, '0.2') + '€';
  }

  get prixCoef() {
    return this.decimalPipe.transform(this.coefMarge * this.selectedLines[0].prixAchat, '0.2') + '€';
  }

  get prixAchat() {
    return this.decimalPipe.transform(this.selectedLines[0].prixAchat, '0.2') + '€';
  }

  get indexOfStatus() {
    return this.allStatus.findIndex(el => el === this.status);
  }

  get initialLinesCount() {
    return this.lines.length;
  }

  get noLines() {
    return this.selectedLines.length == 0;
  }

  get oneLine() {
    return this.selectedLines.length == 1;
  }

  get uncorrectQtt() {
    return this.quantity < 1;
  }

  get uncorrectIndex() {
    return this.separator > this.lines.length || this.separator < 1;
  }

  get uncorrectSubTotalIndex() {
    return this.subTotal > this.lines.length || this.subTotal < 1;
  }

  get uncorrectPrice() {
    return (this.prixVente < 0 || this.prixApproche < 0 || this.coefMarge < 0);
  }

  get uncorrectVAT() {
    return this.vat < 0 || this.vat > 100;
  }

  get uncorrectNum() {
    return this.numero < 1
  }

  get uncorrectDiscount() {
    return this.discount < 0
  }

  get uncorrectCoef() {
    return this.multiLinesCoef < 0
  }

  constructor(private decimalPipe: DecimalPipe, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.resetpp.subscribe(() => {
      this.resetPopups();
    })
  }

  resetPopups() {
    this.displayNumChange = false;
    this.displayPriceChange = false;
    this.displayQttChange = false;
    this.displayVATChange = false;
    this.displayDiscountChange = false;
    this.displayComment = false;
    this.displaySeparator = false;
    this.displaySubTotal = false;
    this.displayCoefPrice = false;
    this.displayPublicPrice = false;
  }

  deleteLines() {
    this.delete.emit(true);
  };

  hidePrice() {
    this.hidePriceEvent.emit(true);
  }

  validateQtt() {
    this.qtt.emit(this.quantity);
    this.resetPopups();
  }
  validateNum() {
    this.num.emit(this.numero);
    this.resetPopups();
  }

  validateVAT() {
    this.vatChange.emit(this.vat);
    this.resetPopups();
  }

  validateDiscount() {
    let resp = {taux: this.discountTaux, montant: this.discount};
    this.discountModeTaux ? resp.montant = 0 : resp.taux = 0;
    this.discountChange.emit(resp);
    this.resetPopups();
  }

  validatePrice() {
    if (this.prixVenteType == 0) this.prixVente = this.priceToNumber(this.prixPublic);
    if (this.prixVenteType == 1) this.prixVente = this.priceToNumber(this.prixCoef);

    this.priceChange.emit({ approche: this.prixApproche, marge: this.coefMarge, prixVente: this.prixVente });
    this.resetPopups();
  }

  validateCoefPrice() {
    this.multiPriceChange.emit(this.multiLinesCoef);
    this.resetPopups();
  }

  validatePublicPrice() {
    this.publicPriceChange.emit(true);
    this.resetPopups();
  }

  priceToNumber(text: string): number{
    let arr = text.split('.');
    for(let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].replace(',', '').replace('€', '');
    }    
    return parseFloat(arr.join('.'))
  }

  validateComment() {
    this.commentChange.emit(this.comment);
    this.resetPopups();
  }

  validateSeparator() {
    this.separatorIndex.emit({ index: this.separator, text: this.separatorText });
    this.resetPopups();
  }

  validateSubTotal() {
    this.subTotalIndex.emit(this.subTotal);
    this.resetPopups();
  }

  switchPosition() {
    this.switch.emit(this.switchTool);
  }

  addArticle() {
    this.dialog.open(ArticleManuscritDevisComponent).afterClosed().pipe(
      tap((newArticle) => {
        this.newArticle.emit(newArticle)
      })
    ).subscribe();
  }
}
