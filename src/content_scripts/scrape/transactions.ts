import {TransactionStore, TransactionTypeProperty} from "firefly-iii-typescript-sdk-fetch";
import {AccountRead} from "firefly-iii-typescript-sdk-fetch/dist/models/AccountRead";
import {getAccountElements, getAccountNumber, getOpeningBalance} from "./accounts";
import {priceFromString} from "../../common/prices";

// TODO: add to base project if not already
export function getButtonDestination(): Element {
    const sideBar = document.getElementById("side-root")!;
    return sideBar.querySelector("[data-role='navbar']")!
}

/**
 * @param accounts The first page of account in your Firefly III instance
 */
export async function getCurrentPageAccount(
    accounts: AccountRead[],
): Promise<AccountRead> { // TODO: Considering adding this to base projecxt
    const accountNumber = getAccountNumber(getAccountElements()[0])
    // Use that to find the Firefly III account ID from the provided list.
    return accounts.find(
        acct => acct.attributes.accountNumber === accountNumber,
    )!;
}

/**
 * @param pageAccount The Firefly III account for the current page
 */
export function scrapeTransactionsFromPage(
    pageAccount: AccountRead, // TODO: Consider changing in base
): TransactionStore[] {
    const oldBal = priceFromString(pageAccount.attributes.currentBalance!);
    const pageBal = getOpeningBalance(getAccountElements()[0])?.balance;
    const diff = Number(- oldBal - pageBal!).toFixed(2);
    return [{
        errorIfDuplicateHash: true,
        transactions: [{
            type: TransactionTypeProperty.Deposit,
            description: "Balance update",
            destinationId: pageAccount.id,
            amount: `${diff}`,
            date: new Date(),
        }]
    }];
}