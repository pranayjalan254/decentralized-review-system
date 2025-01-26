import { Account, Aptos } from "@aptos-labs/ts-sdk";
export declare const burnTransaction: (aptos: Aptos, sender: Account, from: string, amount: number) => Promise<void>;
export declare const burn: (burnAddress: string, burnAmount: number) => Promise<void>;
