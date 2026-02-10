// icon.module
// Third Example - icon module
import { NgModule } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MaterialModules } from './material.module';
import { MatIconRegistry } from '@angular/material/icon';
@NgModule({
  imports: [MaterialModules],
})
export class IconModule {
  private iconPath = '../../assets/logo';
  constructor(
    private domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry
  ) {
    this.registerIcons();
  }

  private registerIcons() {
    this.matIconRegistry.addSvgIcon(
      'accueil',
      this.setPath(`${this.iconPath}/accueil.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'sharing',
      this.setPath(`${this.iconPath}/002-sharing-content_blc.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'arrow-right',
      this.setPath(`${this.iconPath}/double-arrow-right-icon.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'arrow-left',
      this.setPath(`${this.iconPath}/double-arrow-left-icon.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'arborescence',
      this.setPath(`${this.iconPath}/arborescence.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'biblo',
      this.setPath(`${this.iconPath}/Bibliothèque de médias.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'pers morale_blc',
      this.setPath(`${this.iconPath}/pers morale_blc.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      '003-research_blc',
      this.setPath(`${this.iconPath}/003-research_blc.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'mon-compte',
      this.setPath(`${this.iconPath}/mon compte.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'surface1',
      this.setPath(`${this.iconPath}/surface1.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'deconnexion',
      this.setPath(`${this.iconPath}/deconnexion.svg`)
    );
   
    


  }
  private setPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
