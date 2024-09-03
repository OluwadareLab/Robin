import { Selector, t } from "testcafe";
import { Page } from "./page";

/**
 * @description a class representing the home page
 */
export class AboutPage extends Page {
    identifyer: Selector = Selector("#AboutPage")

}