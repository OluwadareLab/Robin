/**
 * @description A class representing a Protien Reference file.
 */
export class ReferenceFile {
    id:number;
    file?:File|undefined;
    fileName:string;
    userDefinedFileName:string;

    /**
     * 
     * @param {int} id the id of the file 
     * @param {File} file the file itself
     * @param {string} userDefinedFileName optional alternative name for the file
     */
    constructor(id:number,file:File|undefined=undefined,userDefinedFileName:string=""){
        this.id=id;
        this.file=file;
        this.fileName= typeof this.file != 'undefined' ? this.file.name : "";
        this.userDefinedFileName=userDefinedFileName;
    }
}

export interface ResolutionData {
    resolution: number;
    file: File | null;
}

export type fileSet = (ToolData[]|{name:string,file:File}[])

export class ToolData {
    /**
     * @description the main title/identifer of this tool data.
     */
    name:string;
    /**
     * @description (optional) the category of the data used for categorical regression
     */
    category?: string;
    /**
     * @description the resolution's file. 
     * @deprecated dont use this prop, remove when you have time
     * TODO: remove this as it is not really used very much and is not useful.
     */
    file: File | undefined;
    /**
     * @description An array of all the files assisiated with this tool, and their resolutions.
     */
    resolutions: ResolutionData[];

    constructor(name:string, resolutions=[], file:File|undefined=undefined){
        this.name=name;
        this.resolutions=resolutions;
        this.file=file;
    }
}
/**
* @description the data type that we get from the user filling out the form
*/
export interface jobSetupFormData {
   /** @description the value of the title input */
   title: string;
   /** @description the value of the description input */
   description: string;
   /** @description the value of the email input */
   email?: string;
}