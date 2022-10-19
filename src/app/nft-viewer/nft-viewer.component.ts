import { Component, Input, OnInit } from '@angular/core';
import { NftProviderService } from 'src/services/nft-provider.service';

@Component({
  selector: 'app-nft-viewer',
  templateUrl: './nft-viewer.component.html',
  styleUrls: ['./nft-viewer.component.scss'],
})
export class NftViewerComponent implements OnInit {
  @Input() address: string = '';

  constructor(private nftProvider: NftProviderService) {}

  ngOnInit(): void {
    this.nftProvider.getTokensOfOwner(this.address);
  }
}
