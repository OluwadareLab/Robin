import { t } from "testcafe";

export class Page{
    /** @description a selector that can identify the current page */
    identifyer:Selector
    

    constructor(){

    }

    /**
     * @description expect currently on a page by checking if its identifyer is visible
     * @param bool {boolean} if set to false expect not on page
     * @returns 
     */
    async onPage(bool=true){
        return await t.expect(this.identifyer.exists).eql(bool);
    }
}