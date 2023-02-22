import {AccountRead} from "firefly-iii-typescript-sdk-fetch/dist/models/AccountRead";
import {getAccountElements, getAccountNumber, getOpeningBalance} from "./accounts";
import {priceFromString} from "../../common/prices";

export function getButtonDestination(): Element {
    const sideBar = document.getElementById("side-root")!;
    return sideBar.querySelector("[data-role='navbar']")!
}

/**
 * @param accounts The first page of account in your Firefly III instance
 */
export async function getCurrentPageAccount(
    accounts: AccountRead[],
): Promise<AccountRead> {
    const accountNumber = getAccountNumber(getAccountElements()[0])
    // Use that to find the Firefly III account ID from the provided list.
    return accounts.find(
        acct => acct.attributes.accountNumber === accountNumber,
    )!;
}

export function isPageReadyForScraping(): boolean {
    return true;
}

export function getRowElements(): Element[] {
    return [undefined!]; // No transactions. But we need a row to process.
}

export function getRowDate(el: Element): Date {
    return new Date();
}

function isRowLoading(r: Element): boolean {
    return false;
}

export function getRowAmount(r: Element, pageAccount: AccountRead): number {
    if (isRowLoading(r)) {
        throw new Error("Page is not ready for scraping")
    }
    const oldBal = priceFromString(pageAccount.attributes.currentBalance!);
    const pageBal = getOpeningBalance(getAccountElements()[0])?.balance;
    return -oldBal - pageBal!;
}

export function getRowDesc(r: Element): string {
    return "Balance update";
}

export function findBackToAccountsPageButton(): HTMLElement {
    return undefined!; // Not used
}