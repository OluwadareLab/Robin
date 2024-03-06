import tinycolor from "tinycolor2";

export abstract class UTIL {
    static lastClr: any | undefined;
    static timesSpun: number = 0;

    static getColor(){
        if(this.lastClr){
            return this.getComplementaryColor() || "";
        } else {
            return this.getRandomRGBA() || "";
        }
    }

    static getRandomRGBA() {
        // Generate random values for red, green, and blue channels
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
      
      
        // Return the color in RGBA format
        let clr = tinycolor.random();
        this.lastClr = clr;
        return clr?.toRgbString()
    }

  
    
    
    static getComplementaryColor(rgbColor=this.lastClr) {
        UTIL.timesSpun++
        if(UTIL.timesSpun>3) {
            UTIL.timesSpun=0;
            this.lastClr = undefined;
        }
        if(rgbColor){
     
            // Calculate complementary color by inverting each channel's value
            const clr = tinycolor(rgbColor)
            const complementent = clr?.spin(90)
  
        
            // Return the complementary color in RGB format
            return complementent?.toRgbString();
        }
        
      }
}