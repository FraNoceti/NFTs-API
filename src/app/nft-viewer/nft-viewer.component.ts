import { Component, Input, OnInit } from '@angular/core';
import { NftProviderService } from 'src/services/nft-provider.service';
import { TokenData } from 'src/types/TokenData';

@Component({
  selector: 'app-nft-viewer',
  templateUrl: './nft-viewer.component.html',
  styleUrls: ['./nft-viewer.component.scss'],
})
export class NftViewerComponent implements OnInit {
  @Input() address: string = '';

  nftList: TokenData[] = [];

  constructor(private nftProvider: NftProviderService) {}

  ngOnInit(): void {
    this.getTokenList();
  }

  async getTokenList(): Promise<void> {
    this.nftList = await this.nftProvider.getTokensOfOwner(this.address);
    console.log(this.nftList);
  }
}
