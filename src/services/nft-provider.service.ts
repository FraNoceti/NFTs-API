import * as spl from '@solana/spl-token';
import { Injectable } from '@angular/core';
import { Connection, PublicKey } from '@solana/web3.js';
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NftProviderService {
  connection: Connection;

  constructor() {
    this.connection = new Connection(environment.RPC_ENDPOINT, {
      disableRetryOnRateLimit: true,
    });
  }

  findMetadataAccount(mint: PublicKey): [PublicKey, number] {
    return findProgramAddressSync(
      [
        Buffer.from('metadata', 'utf8'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
  }

  async getTokensOfOwner(address: string): Promise<void> {
    const pubkey = new PublicKey(address);
    const allTokenAccounts =
      await this.connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: spl.TOKEN_PROGRAM_ID,
      });

    const tokenAccounts = allTokenAccounts.value
      .filter(
        (tokenAccount) =>
          tokenAccount.account.data.parsed.info.tokenAmount.uiAmount > 0
      )
      .sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()));

    const metaplexIds = await Promise.all(
      tokenAccounts.map(
        async (tokenAccount) =>
          this.findMetadataAccount(
            new PublicKey(tokenAccount.account.data.parsed.info.mint)
          )[0]
      )
    );

    console.log(tokenAccounts);
  }
}
