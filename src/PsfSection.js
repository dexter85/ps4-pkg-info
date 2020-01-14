module.exports = class PsfSection {
    constructor(bits) {
        this.data = bits;
        this.labelOffset = bits.slice(0, 2)
        this.rfu001 = bits.slice(2, 3);
        this.dataType = parseInt(bits.toString('hex', 3, 4)); //# string = 2, integer = 4, binary = 0
        this.usedDataField = bits.slice(4, 8);
        this.sizeDataField = bits.slice(8, 12);
        this.dataOffset = bits.slice(12, 16);
    }
}