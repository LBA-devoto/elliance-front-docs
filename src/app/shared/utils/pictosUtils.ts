export class PictosUtils {

  public static toLabel(pictoName: string): string {
    switch (pictoName) {
      case '2PEHD':
        return 'Matière 2PEHD';
      case '4_plaques_horizontales':
        return '4 plaques horizontales';
      case '4_plaques_verticales':
        return '4 plaques verticales';
      case '5_plaques':
        return '5 plaques';
      case '5pp':
        return 'Matière 5PP';
      case '6_plaques_horizontales':
        return '6 plaques horizontales';
      case '6_plaques_verticales':
        return '6 plaques verticales';
      case '6ps':
        return 'Matière 6PS';
      case '7_plaques':
        return '7 plaques';
      case '8_plaques':
        return '8 plaques';
      case '10_plaques':
        return '10 plaques';
      case '11_plaques':
        return '11 plaques';
      case 'avec-porte-chromos':
        return 'Avec porte-chromos';
      case 'Brillant':
        return 'Brillant';
      case 'Mat':
        return 'Mat';
      case 'Granité':
        return 'Granité';
      case 'injecte':
        return 'Injecté';
      case 'colorama':
        return 'Colorama';
      case 'drainage':
        return 'Irrigation';
      case 'etoile':
        return 'Étoile'
      case 'NIR':
        return 'NIR';
      case 'nouveaute':
        return 'Nouveauté';
      case 'pcr':
        return 'PCR';
      case 'Picto_matiere_4_PEBD':
        return 'Matière 4 PEBD';
      case 'Picto_Soparco_Bio':
        return 'Soparco Bio';
      case 'plaque-eco':
        return 'Plaque ECO';
      case 'plaque-reutilisable':
        return 'Plaque réutilisable';
      case 'plaque-roll-cc':
        return 'Plaque Roll CC';
      case 'prise':
        return 'Fourche';
      case 'tarif-5':
        return 'Tarif 5%';
      case 'thermoforme':
        return 'Thermoformé';
    }
    return pictoName;
  }
}