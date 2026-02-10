import { NgModule } from '@angular/core';
import { LoadingDirective } from '../directives/loading.directive';
import { LoadingSpinnerComponent } from '../components/dialogs/loading-spinner/loading.spinner.component';
import { AppDynamicComponent } from '../components/dynamic-component-shared/app-dynamic.component';
import { AppUIBuilderComponent } from '../app-ui-builder/app-ui-builder.component';
import { TableComponent } from '../components/dynamic-component-shared/table/table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MaterialModules } from './material.module';
import { AuthenticationService } from '../services/authentication.service';
import { EntiteDirective } from '../directives/entite.directives';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { LoadingInterceptor } from '../core/loading-interceptor';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert-service';
import { DialogComponent } from '../components/dialogs/dialog.component';

@NgModule({
  imports: [MaterialModules],
  declarations: [
    LoadingDirective,
    LoadingSpinnerComponent,
    AppDynamicComponent,
    AppUIBuilderComponent,
  ],
  exports: [
    LoadingDirective,
    LoadingSpinnerComponent,
    AppDynamicComponent,
    AppUIBuilderComponent,
  ],
  providers: [
    LoadingService,
    AlertService,
    AuthenticationService,
    EntityService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
})
export class SharedModule {}
