import { NgModule } from '@angular/core';
// import { GoogleMapsModule } from '@angular/google-maps';
import { NbCardModule } from '@nebular/theme';

import { MapsRoutingModule, routedComponents } from './maps-routing.module';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ThemeModule } from 'src/app/@theme/theme.module';

@NgModule({
  imports: [
    ThemeModule,
    // GoogleMapsModule,
    // LeafletModule,
    MapsRoutingModule,
    // NgxEchartsModule,
    NbCardModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
  ],
})
export class MapsModule { }
