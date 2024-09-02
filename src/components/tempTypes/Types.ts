/**
 *  A class representing a Protien Reference file.
 */
export class ReferenceFile {
    /** the id? */
    id:number;
    /** optional file obj */
    file?:File|undefined;
    /** file name */
    fileName:string;
    /** user defined name */
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

/**
 * @description a dataset for chart.js
 */
export type DataSet = {
    data:any[];
    category:string;
}

export type resultData = {
    recoveryDatasets: any;
    remData: any[];
    loopSizes: any;
    regressionPoints;
    kbVsRes: any;
    binVsRes: any;
    binVsResVsKbVsResDataset: any;
    overlapData:any;
    higlassUids:any;
    /** the raw data obj that the above were parsed from */
    raw:any
}

export type FileAndName = {
    file:File,
    name:string
}

export class ChromFile {
    file?:File;
    chromName:string;
    fileName:string;

    constructor(file=undefined,chromName=""){
        this.file=file;
        this.chromName=chromName;
    }

    /** create nwe ChromFile from existing */
    fromExisting(chromFile:ChromFile){
        this.file=chromFile.file;
        this.chromName=chromFile.chromName;
        this.fileName=chromFile.fileName;
        return this;
    }

    /** check if this chrom file has vaild data */
    isValid(){
        return this.file instanceof File && this.chromName;
    }

}

/**
 *  a type for representing the overlap data for venn diagrams
 */
export type OverlapDataObj = {
    /** the raw data read from the file, this is a csv in string form */
    data:string,
    /** the resolution of this data */
    resolution:string,
    /** a string of the files combined in this diagram seperated by ':'s */
    fileCombo:string
  }

/**
 *  a array of overlapDataObjs
 */
export type OverlapDataSet = OverlapDataObj[];

export interface ResolutionData {
    resolution: number | undefined;
    file: File | null;
    /**if truthy this resolution input cannot be removed */
    cannotBeRemoved?:boolean;
}

export type fileSet = (ToolData[]|{name:string,file:File}[])

/**
 * the type of a resolution file upload field
 */
export type ResolutionFIle = {
    resolution: 0,
    file: null
}

export class ToolData {
    /**
     *  the main title/identifer of this tool data.
     */
    name:string;
    /**
     *  (optional) the category of the data used for categorical regression
     */
    category?: string;
    /**
     *  the resolution's file. 
     * @deprecated dont use this prop, remove when you have time
     * TODO: remove this as it is not really used very much and is not useful.
     */
    file: File | undefined;
    /**
     *  An array of all the files assisiated with this tool, and their resolutions.
     */
    resolutions: ResolutionData[];

    /**optional, if truthy then this field cannot be removed */
    cannotBeRemoved?:boolean;

    constructor(name:string, resolutions:ResolutionData[]=[{file:null,resolution:undefined}], file:File|undefined=undefined){
        this.name=name;
        this.resolutions=resolutions;
        this.file=file;
    }

    /**
     *  set the cannotBeRemoved value and return self
     * @param bool 
     * @returns self
     */
    setCannotBeRemoved(bool){
        this.cannotBeRemoved=bool;
        return this;
    }
    
    /**
     *  set the cannotBeRemoved value on a resolution of index n and return self
     * @param bool 
     */
    setResolutionCannotBeRemoved(bool, n){
        this.resolutions[n].cannotBeRemoved=bool;
        return this;
    }
}
/**
*  the data type that we get from the user filling out the form
*/
export interface jobSetupFormData {
   /**  the value of the title input */
   title: string;
   /**  the value of the description input */
   description: string;
   /**  the value of the email input */
   email?: string;
   /** optinoal wether to use higlass */
   higlassToggle?:number;
}