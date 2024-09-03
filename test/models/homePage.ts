import { Selector } from "testcafe";
import { Page } from "./page";

/**
 * @description a class representing the home page
 */
export class HomePage extends Page {
    identifyer: Selector = Selector("#homePage");
    
    /** the button to navigate to the submit page */
    submitJobBtn: Selector = Selector("#submitAJob").child("a");

    /** the button to navigate to the doc page */
    documentationLink: Selector = Selector("#documentationLink");

    /** the button to navigate to the olab page */
    olabLink:Selector = Selector("#oLabLink");

    /** the button to toggle dark mode */
    darkModeToggle:Selector = Selector("#darkModeToggle");
}