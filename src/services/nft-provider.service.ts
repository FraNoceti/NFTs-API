import * as spl from '@solana/spl-token';
import { Injectable } from '@angular/core';
import {
  AccountInfo,
  Commitment,
  Connection,
  GetMultipleAccountsConfig,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js';
import {
  Metadata,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { environment } from 'src/environments/environment';
import { TokenData } from 'src/types/TokenData';

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

  async getBatchedMultipleAccounts(
    connection: Connection,
    ids: PublicKey[],
    config?: GetMultipleAccountsConfig,
    batchSize = 100
  ): Promise<(AccountInfo<Buffer | ParsedAccountData> | null)[]> {
    const batches: PublicKey[][] = [[]];
    ids.forEach((id) => {
      const batch = batches[batches.length - 1];
      if (batch) {
        if (batch.length >= batchSize) {
          batches.push([id]);
        } else {
          batch.push(id);
        }
      }
    });
    const batchAccounts = await Promise.all(
      batches.map((b) =>
        b.length > 0
          ? connection.getMultipleAccountsInfo(b, config as Commitment)
          : []
      )
    );
    return batchAccounts.flat();
  }

  async getTokensOfOwner(address: string): Promise<TokenData[]> {
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

    const metaplexAccountInfos = await this.getBatchedMultipleAccounts(
      this.connection,
      metaplexIds
    );

    const metaplexData = metaplexAccountInfos.reduce(
      (acc, accountInfo, i) => {
        try {
          acc[tokenAccounts[i]!.pubkey.toString()] = {
            pubkey: metaplexIds[i]!,
            ...accountInfo,
            data: Metadata.deserialize(accountInfo?.data as Buffer, 0)[0],
          };
        } catch (e) {}
        return acc;
      },
      {} as {
        [tokenAccountId: string]: {
          pubkey: PublicKey;
          data: Metadata;
        };
      }
    );

    const tokens: TokenData[] = tokenAccounts.map((tokenAccount) => ({
      tokenAccount,
      metaplexData: metaplexData[tokenAccount.pubkey.toString()],
    }));

    return tokens;
  }
}
