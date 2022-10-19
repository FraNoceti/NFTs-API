import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.scss'],
})
export class NftCardComponent implements OnInit {
  @Input() name = 'The Coldest Sunset';
  @Input() description = 'Undefined';
  @Input() image = '/img/card-top.jpg';

  constructor() {}

  ngOnInit(): void {}
}
