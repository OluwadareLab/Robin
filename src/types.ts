export enum TrackType {
    // /** https://docs.higlass.io/track_types.html#linking-value-scales */
    // LinkingValueScales="linkingValueScales",
    // /** https://docs.higlass.io/track_types.html#bed-like */
    // BedLike="bedlike",
    // /** https://docs.higlass.io/track_types.html#empty */
    // Empty="empty",
    // /** https://docs.higlass.io/track_types.html#gene-annotations */
    // GeneAnnotation="geneAnnotate",
    // /**https://docs.higlass.io/track_types.html#heatmap */
    // HeatMap="heatmap",
    // /** https://docs.higlass.io/track_types.html#rotated-2d-heatmap */
    // Rotated2DHeatMap="rot2dHeatMap",
    // /**
    //  *  https://docs.higlass.io/track_types.html#d-rectangle-domain 
    //  * used for our bedpe results files rendering
    //  * */
    Rectangle2DDomain="linear-2d-rectangle-domains",
    /**https://docs.higlass.io/track_types.html#line */
    Line="line"
    /**
     * there are more see:
     * https://docs.higlass.io/track_types.html
     * I just didnt copy them all since we dont need them all
     */
  
  
  
  
  
  }
  
  export type Track = {
    filetype:string
    server:string
    /** the tileset to load from the server */
    tilesetUid:string
    type:TrackType
    /** uqiune arbitrary id of the track (optional) */
    uid?:string
    /** higlass options obj too much to redocument here as a type, see: https://docs.higlass.io/track_types.html */
    options:any
  
    width:number,
    height:number,
  }