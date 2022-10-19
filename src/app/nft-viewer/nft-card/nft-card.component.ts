import { Component, Input, OnInit } from '@angular/core';
import { AssetInfo, TokenData } from 'src/types/TokenData';

@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.scss'],
})
export class NftCardComponent implements OnInit {
  @Input() token: TokenData | null = null;
  tokenInfo: AssetInfo | null = null;

  constructor() {}

  ngOnInit(): void {
    this.fetchInfo();
  }

  async fetchInfo(): Promise<void> {
    const dataURI = this.token?.metaplexData?.data?.data?.uri;
    if (dataURI) {
      this.tokenInfo = (await (await fetch(dataURI)).json()) as AssetInfo;
      console.log(this.tokenInfo);
    }
  }
}
