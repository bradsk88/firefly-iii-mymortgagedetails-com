import {OpeningBalance} from "../../background/firefly_export";
import {priceFromString} from "../../common/prices";

// TODO: add to base project if not already
export function getButtonDestination(): Element {
    const sideBar = document.getElementById("side-root")!;
    return sideBar.querySelector("[data-role='navbar']")!
}

export function isPageReadyForScraping(): boolean {
    // TODO: Some banks load accounts in slowly. Find a DOM element that is
    //  only present on the page once the accounts are fully loaded.
    return !!document.querySelector('span.account__details-number');
}

export function getAccountElements(): Element[] {
    return [document.getElementById('google_Pipeline_Content_Customer')!]
}

export function shouldSkipScrape(accountElement: Element): boolean {
    // TODO: If there are some types of accounts on the page that can't be
    //  scraped, return true for those here and they will be skipped.
    return false;
}

export function getAccountNumber(
    accountElement: Element,
): string {
    const div = accountElement.querySelector("[id^='divApplication_']")
    return div!.id.split("divApplication_")[1];
}

export function getAccountName(
    accountElement: Element,
): string {
    return accountElement.querySelector("span.myAccountTitle")!.textContent!
}


export function getOpeningBalance(
    accountElement: Element,
): OpeningBalance | undefined {
    const topRow = accountElement.querySelector("table[id^='L22_'] > tbody > tr > td:last-child")!;
    const balance = topRow.querySelector("table > tbody > tr > td:last-child")!.textContent!;
    return {
        accountName: getAccountName(accountElement),
        accountNumber: getAccountNumber(accountElement),
        balance: priceFromString(balance),
        date: new Date(),
    }
}