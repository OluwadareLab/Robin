import { Selector, t } from "testcafe";
import { Page } from "./page";

/**
 * @description a class representing the home page
 */
export class ResultPage extends Page {
    identifyer: Selector = Selector("#resultsMainPage")

}