class GenomicRange {
    chromosome:string;
    start:number;
    end:number;

    constructor(chromosome, start, end) {
      this.chromosome = chromosome;
      this.start = start;
      this.end = end;
    }
  
    overlaps(otherRange) {
      return this.chromosome === otherRange.chromosome &&
             !(this.end < otherRange.start || this.start > otherRange.end);
    }
  
    contains(position) {
      return this.start <= position && position <= this.end;
    }
  }

  /** @description a wrapper for multiple ranges */
  class GenomicRanges {
    ranges:GenomicRange[];

    constructor(ranges:GenomicRange[]){
        this.ranges=ranges;
    }

    overlap(other:GenomicRanges){
        let overlaps:any[] = [];
        for (let index = 0; index < this.ranges.length; index++) {
            const thisRange = this.ranges[index];
            const thatRange = other.ranges[index];
            overlaps.push(thisRange.overlaps(thatRange));
        }
    }
  }
  
  // Example usage
  const range1 = new GenomicRange("chr1", 1000, 2000);
  const range2 = new GenomicRange("chr1", 1500, 2500);
  
  console.log(range1.overlaps(range2)); // true
  console.log(range1.contains(1800));    // true