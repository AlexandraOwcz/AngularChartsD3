import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
