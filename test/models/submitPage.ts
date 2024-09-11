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

    /**
     * @description fill out the nth tool box with data
     * @param n 
     * @param name 
     * @param res 
     * @param files 
     */
    async fillOutNthToolBox(n:number, name:string, res:string, files:string[]){
        await t
            .click(this.toolNameInputs.nth(n))
            .typeText(this.toolNameInputs.nth(n), name)

            .click(this.toolResolutionInputs.nth(n))
            .typeText(this.toolResolutionInputs.nth(n), res)

            .setFilesToUpload(this.toolFileInputs.nth(n), files)
            .click(this.toolFileInputs.nth(n))
    }

    async fillOutNthProtienBox(n:number,name:string, files:string[]){
        await t
            .setFilesToUpload(this.protienFilesInputs.nth(n), files)
            .click(this.protienFilesInputs.nth(n))

            .click(this.protienNamesInputs.nth(n))
            .typeText(this.protienNamesInputs.nth(n),name)

    }

    /**
     * @description type the title into the title field
     * @param title 
     */
    async typeTitle(title){
        await t
            .click(this.jobTitleField)
            .typeText(this.jobTitleField,title)
    }

    /**
     * @description type the desc into the desc field
     * @param desc 
     */
    async typeDesc(desc){
        await t
            .click(this.jobDescField)
            .typeText(this.jobDescField, desc);

    }

    /** @description toggle higlass on or off */
    async toggleHiglass(){
        await t
            .click(this.higlassToggle)
    }

    /** @description press submit and upload job and validate that it was submitted */
    async pressSubmitJob(){
        await t
            .setNativeDialogHandler(() => true)
            .click(this.submitBtn)
            .expect(Selector("h3").filter(selector=>selector.innerHTML.includes("files")).visible).ok();
    }

    /** submit a job clicking on all the menus and filling out forms on the submit page */
    async submitMockJob(title="generic Title", desc="generic description"){
        await this.typeTitle(title);
        await this.typeDesc(desc);
        await this.fillOutNthToolBox(0,"tool1","5000",["../mockData/lasca/GM12878_5k.txt"]);
        await this.fillOutNthToolBox(1,"tool2","5000",["../mockData/lasca/GM12878_5k.txt"]);
        await this.fillOutNthProtienBox(0, "h3k27ac", ["../mockData/h3k27ac/h3k27ac_5k.txt"]);
        await this.toggleHiglass();
        await this.pressSubmitJob();
    }
}