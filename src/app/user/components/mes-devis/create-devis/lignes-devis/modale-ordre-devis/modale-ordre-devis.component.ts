import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modale-ordre-devis',
  templateUrl: './modale-ordre-devis.component.html',
  styleUrls: ['./modale-ordre-devis.component.css']
})
export class ModaleOrdreDevisComponent implements OnInit {

  itemList: any[] = []
  dragStartIndex: number = -1;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ModaleOrdreDevisComponent>) { }

  ngOnInit(): void {
    this.loadList();
    // this.dialogRef.updateSize('80vw')
  }

  loadList() {
    let separators = this.data.separators;
    let subtotals = this.data.subtotals;
    let lines = this.data.lines;

    lines.forEach((line: any) => {
      this.itemList.push(line);
    })

    for (let i = 0; i < subtotals.length; i++) {
      let line = lines[subtotals[i] - 1];
      let ind = this.itemList.findIndex(el => el.titre == line.titre);
      this.itemList.splice(ind + 1, 0, subtotals[i]);
    }

    for (let i = 0; i < separators.length; i++) {
      let line = lines[separators[i].index - 1];
      let ind = this.itemList.findIndex(el => el.titre == line.titre);
      this.itemList.splice(ind + 1, 0, separators[i]);
    }
  }

  getItemText(index: number) {
    let el = this.itemList[index];
    return el > 0 ? `Sous-total` : (el.index ? `Séparateur` + (el.text ? ` : ${el.text}` : '') : el.titre);
  }

  onDragStart(event: DragEvent, index: number) {
    this.dragStartIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', '');
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number) {
    if (this.dragStartIndex >= 0 && dropIndex >= 0 && this.dragStartIndex !== dropIndex) {
      const movedItem = this.itemList[this.dragStartIndex];
      this.itemList.splice(this.dragStartIndex, 1);
      this.itemList.splice(dropIndex, 0, movedItem);
    }
    this.dragStartIndex = -1;
  }

  onDragEnd(event: DragEvent) {
    this.dragStartIndex = -1;
  }

  addSeparator() {
    this.itemList.push({ index: this.itemList.length, text: '' })
  }

  addSubtotal() {
    this.itemList.push(this.itemList.length);
  }

  validate() {
    let lines: any[] = [];
    let seps: any[] = [];
    let subs: any[] = [];

    let sepCount = 0;
    for (let i = 0; i < this.itemList.length; i++) {
      let item = this.itemList[i];
      if (item > 0) {
        if (i != 0) {
          subs.push(i - sepCount);
          sepCount += 1;
        }
      } else if (item.index) {
        if (i != 0) {
          seps.push({ index: i - sepCount, text: item.text ? item.text : '' });
          sepCount += 1;
        }
      } else {
        lines.push(item)
      }
    }

    this.data.lines = lines;
    this.data.separators = seps;
    this.data.subtotals = subs;
    this.dialogRef.close(this.data);
  }

  closePopup() {
    this.dialogRef.close();
  }

}
