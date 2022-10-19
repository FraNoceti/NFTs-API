import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';

export type TokenData = {
  tokenAccount?: {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
  };
  metaplexData?: { pubkey: PublicKey; data: Metadata } | null;
};

export type Attribute = {
  trait_type: string;
  value: string;
};

export type AssetInfo = {
  name: string;
  image: string;
  description: string;
  symbol: string;
  external_url?: string;
  attributes?: Attribute[];
  animation_url?: string;
};
