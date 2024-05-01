import tinycolor from "tinycolor2";

export abstract class UTIL {
    static lastClr: any | undefined;
    static timesSpun: number = 0;

    /**
     * @description get a set of random {x,y} value dicts
     * @param length length of the array
     * @param range math.random will be multiplied by this.
     */
    static getRandomXyDataset(length=100,range=100){
        return Array.from({ length: length }, () => ({
            x: Math.random()*range,
            y: Math.random()*range,
          }));
    }

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

    /**
     * @description get all combinations of an array of values
     * with:
     * No repeats
     * Order does not matter.
     */
    static getCombinations(valuesArray)
    {

        var combi = [];
        var temp = [];
        var slent = Math.pow(2, valuesArray.length);

        for (var i = 0; i < slent; i++)
        {
            temp = [];
            for (var j = 0; j < valuesArray.length; j++)
            {
                if ((i & Math.pow(2, j)))
                {
                    temp.push(valuesArray[j]);
                }
            }
            if (temp.length > 0)
            {
                combi.push(temp);
            }
        }
        
        combi.sort((a, b) => a.length - b.length);
        console.log(combi.join("\n"));
        return combi;
    }

    /** @description ment to be used with .filter IE: array.filter(UTIL.onlyUnique) */
    static onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
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