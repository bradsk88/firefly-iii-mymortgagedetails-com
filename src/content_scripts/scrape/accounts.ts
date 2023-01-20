import {OpeningBalance} from "../../background/firefly_export";
import {priceFromString} from "../../common/prices";

// TODO: add to base project if not already
export function getButtonDestination(): Element {
    const sideBar = document.getElementById("side-root")!;
    return sideBar.querySelector("[data-role='navbar']")!
}

export function getAccountElements(): Element[] {
    return [document.getElementById('google_Pipeline_Content_Customer')!]
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