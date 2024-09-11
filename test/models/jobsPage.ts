import { Selector, t } from "testcafe";
import { Page } from "./page";

/**
 * @description a class representing the home page
 */
export class JobsPage extends Page {
    identifyer: Selector = Selector("#jobsPage")
    /** selector for all cards */
    jobDisplay: Selector = Selector(".card")

    adminBtnsCss:string = ".adminBtn";
    adminBtns:Selector = Selector(this.adminBtnsCss);
    viewJobBtns:Selector = Selector(".viewJobBtn");
    viewIncorectJobBtns:Selector = Selector(".viewIncorectJobBtn");
    closeBtns:Selector = Selector(".closeBtn");
    rerunBtns:Selector = Selector(".rerunBtn");
    addToQueBtns:Selector = Selector(".addToQueBtn");
    forceViewBtns:Selector = Selector(".forceViewBtn");


    /**
     * @description check that atleast 1 job displays
     */
    async expectAtleastOneJob(){
        await t.expect(await this.jobDisplay.count).gt(0,"at least 1 job must display");
    }
}