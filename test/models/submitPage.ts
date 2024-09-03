import { Selector, t } from "testcafe";
import { Page } from "./page";

/**
 * @description a class representing the home page
 */
export class SubmitPage extends Page {
    identifyer: Selector = Selector("#mainForm")

    /** the title field */
    jobTitleField: Selector = Selector("#formInput_JobTitle");

    /** the description field */
    jobDescField: Selector = Selector("#formInput_Description");

    /** all tool name inputs */
    toolNameInputs:Selector = Selector(".entryWithRemove");

    toolFileInputs:Selector = Selector(".toolFileInput");

    /** all tool resolutions inputs */
    toolResolutionInputs:Selector = Selector(".resolutionInput");

    protienNamesInputs:Selector = Selector(".nameInput");

    protienFilesInputs:Selector = Selector(".fileInput");

    higlassToggle:Selector = Selector("label").withAttribute("for","higlass");

    submitBtn:Selector = Selector("button#fileUploadBtn");

    /**
     * @description get the nth tool container on the page
     * @param n 
     * @returns 
     */
    getNthTool(n:number):Selector {
        return Selector(`#ToolContainer-${n}`);
    }

    async submitMockJob(title="generic Title", desc="generic description"){
        await t
            .click(this.jobTitleField)
            .typeText(this.jobTitleField,title)
            .click(this.jobDescField)
            .typeText(this.jobDescField, desc)

            .click(this.toolNameInputs.nth(0))
            .typeText(this.toolNameInputs.nth(0), "tool1")

            .click(this.toolResolutionInputs.nth(0))
            .typeText(this.toolResolutionInputs.nth(0), "5000")

            .setFilesToUpload(this.toolFileInputs.nth(0), [
                "../mockData/lasca/GM12878_5k.txt"
            ])
            .click(this.toolFileInputs.nth(0))


            .click(this.toolNameInputs.nth(1))
            .typeText(this.toolNameInputs.nth(1), "tool2")

            .click(this.toolResolutionInputs.nth(1))
            .typeText(this.toolResolutionInputs.nth(1), "5000")

            .setFilesToUpload(this.toolFileInputs.nth(1), [
                "../mockData/lasca/GM12878_5k.txt"
            ])
            .click(this.toolFileInputs.nth(1))


            .setFilesToUpload(this.protienFilesInputs.nth(0), [
                "../mockData/h3k27ac/h3k27ac_5k.txt"
            ])
            .click(this.protienFilesInputs.nth(0))

            .click(this.protienNamesInputs.nth(0))
            .typeText(this.protienNamesInputs.nth(0),"h3k27ac")


            .click(this.higlassToggle)
            .setNativeDialogHandler(() => true)
            .click(this.submitBtn)
            .expect(Selector("h3").filter(selector=>selector.innerHTML.includes("files")).visible).ok();

    }


}