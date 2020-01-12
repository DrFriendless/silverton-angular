import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayerCommodityComponent } from './player-commodity/player-commodity.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerCommodityComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
