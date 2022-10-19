import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NftViewerComponent } from './nft-viewer/nft-viewer.component';
import { NftCardComponent } from './nft-viewer/nft-card/nft-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NftViewerComponent,
    NftCardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
