import {TransactionStore} from "firefly-iii-typescript-sdk-fetch";
import {AccountRead} from "firefly-iii-typescript-sdk-fetch/dist/models/AccountRead";
import {getAccountElements, getAccountNumber} from "./accounts";

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
export function isPageReadyForScraping(): boolean {
    // TODO: Some banks load content slowly. Find an element on the page that
    //  is only present once the page is fully loaded.
    return !!document.querySelector('app-account-transactions')
}

export function getRowElements(): Element[] {
    // TODO: Find a list of DOM elements where each one represents a single
    //  transaction on the page. Example below.
    return Array.from(document.querySelectorAll(
        'div.table-container table tbody tr'
    ).values());
}

export function getRowDate(el: Element): Date {
    // TODO: Get the date from the row element. Example below.
    const date = el.querySelector('td.date span:nth-child(1)');
    return parseDate(date!.textContent!);
}

function isRowLoading(r: Element): boolean {
    // TODO: If possible, inspect the row to determine if it's ready to be
    //  scraped. Return false if it's not possible to detect this.
    return false;
}

export function getRowAmount(r: Element): number {
    if (isRowLoading(r)) {
        throw new Error("Page is not ready for scraping")
    }
    // TODO: Get the amount from the row element. Example below.
    const amountDiv = r.querySelector("div.amount");
    return priceFromString(amountDiv!.textContent!);
}

export function getRowDesc(r: Element): string {
    // TODO: Get the description from the row element. Example below.
    return r.querySelector(
        'td.description span.description-text',
    )!.textContent!
}

export function findBackToAccountsPageButton(): HTMLElement {
    // TODO: Once a single account's transactions have been scraped, we need to
    //  go back to the main accounts page to finish the auto run. Find an
    //  element on the page that we can click on to go back. Example below.
    return document.querySelector('button.btn-icon-back')!;
}