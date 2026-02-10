import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { HttpClient } from '@angular/common/http';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Image } from 'src/app/shared/entities/image';
import { TemplateService } from 'src/app/services/template.service';
import { UserService } from 'src/app/admin/core/services/user.service';
import { type } from 'os';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() data: any;
  value: any = {};
  selectedFile: File | null;
  imagesMap: Image[] = [];
  uploadPath: string;
  uploadUrl: string;
  image: any = {};
  typeName: any;
  isEditMode: boolean = false;
  constructor(
    private httpclientService: HttpclientService,
    private templateService: TemplateService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.imagesMap.forEach(image => {
      image.url = image.url.replace('http://', 'https://');
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config.id = '4';
      this.config = changes['config'].currentValue;
      this.typeName = this.config.typeName;

      if (this.config.images) {
        this.imagesMap = this.config.images;
        this.imagesMap.forEach(image => {
          image.url = image.url.replace('http://', 'https://');
        });
      }
      if (this.config.value) {
        this.image = this.config?.value;
      }
      if (this.config.editMode) {
        this.isEditMode = this.config.editMode;
      }
      this.isEditMode = this.config.editMode;

      this.uploadPath = this.config.uploadPath;
      this.uploadUrl = this.config.uploadUrl;
    }
  }
  uploadImageLayout(event: any) {
    this.selectedFile = event.target.files[0];
    if (!this.selectedFile) {
      return;
    }

    this.uploadPath = this.uploadPath;
    this.uploadUrl = this.config.uploadUrl;

    this.uploadMultipleImageLayout(event.target.files, 0);
  }

  removeImageLayout(valueImage: any) {
    let id = valueImage.id;
    let url = `image/delete/${id}`;

    if (this.config.singleImageMode) {
      this.deleteSingleImageLayout(valueImage);
    } else {
      this.deleteImageLayout(valueImage);
    }
  }

  // uploadSingleImageLayout(formData: FormData, headers: any) {
  //   this.httpclientService
  //     .postWithHeader(formData, headers, this.uploadUrl)
  //     .subscribe((res: any) => {
  //       this.image = res;
  //       this.config.value = res;
  //     });
  // }

  uploadMultipleImageLayout(files: any[], index: number) {
    if (index >= 0 && index < files.length) {
      const formData = new FormData();
      const headers = {};
      formData.append('path', this.uploadPath);
      formData.append('file', files[index]);

      this.httpclientService
        .postWithHeader(formData, headers, this.uploadUrl)
        .subscribe(
          (response) => {
            //
            // Assuming the response contains the uploaded image URL
            const nom = response.nom;

            // Add the image URL to the imagesMap
            this.imagesMap.push(response);

            this.uploadMultipleImageLayout(files, index + 1);
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
    }
  }

  // deleteImageLayout(valueImage: any) {
  //   let id = valueImage.id;
  //   let url = `image/delete/${id}`;

  //   this.templateService.deleteImage(url).subscribe(() => {
  //     this.imagesMap = Object.values(this.imagesMap)
  //       .filter((image) => image.id !== id)
  //       .reduce((obj: { [key: string]: Image }, image) => {
  //         obj[image.id] = image;
  //         return obj;
  //       }, {});
  //     // Perform any additional logic here
  //   });
  // }

  deleteImageLayout(valueImage: any) {
    let id = valueImage.id;
    let url = `image/delete/${id}`;

    this.templateService.deleteImage(url).subscribe(() => {
      this.imagesMap = this.imagesMap.filter((image) => image.id !== id);
      // Perform any additional logic here
    });
  }

  deleteSingleImageLayout(valueImage: any) {
    let id = valueImage.id;
    let url = `image/delete/${id}`;

    this.templateService.deleteImage(url).subscribe(() => {
      this.image = {};
      this.config.value = {};

      // Perform any additional logic here
    });
  }
}
