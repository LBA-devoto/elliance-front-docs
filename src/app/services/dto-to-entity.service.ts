import { Injectable } from '@angular/core';
import { CategorieDto } from '../shared/dto/categorie-dto';
import { Categorie } from '../shared/entities/categorie';
import { Image } from '../shared/entities/image';

@Injectable({
  providedIn: 'root'
})
export class DtoToEntityService {

  constructor() { }

  /*fromDtoToCategorie(categorieDto:CategorieDto){
    categorie: Categorie ;
    categorie.imagesmap=
  }*/

  fromCategorieToDto(categorie:Categorie){
    let categorieDto: CategorieDto = new CategorieDto();
    if (categorie.imagesmap !== undefined && categorie.imagesmap !== null && categorie.imagesmap.size > 0) {
      categorie.imagesmap.forEach((value: Image, key: string, map: Map<any, Image>) => {
        categorieDto.imagesmap[key]=null;
      });
    }
    
    categorieDto.code=categorie.code;
    categorieDto.id=categorie.id;
    categorieDto.mapdescriptioncourte=categorie.mapdescriptioncourte;
    categorieDto.mapdescriptionlongue=categorie.mapdescriptionlongue;
    categorieDto.maplocaletitre=categorie.maplocaletitre;
    categorieDto.ordre=categorie.ordre;
    categorieDto.perecode=categorie.perecode;
    categorieDto.titre=categorie.titre;
    categorieDto.titre1=categorie.texte1;
    categorieDto.titre2=categorie.texte2;
    categorieDto.titre3=categorie.texte3;    
    categorieDto.topcode=categorie.topcode;

    return categorieDto;


  }
}
