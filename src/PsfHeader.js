const le32 = require('./Utils').le32;

module.exports = class PsfHeader {
    constructor(bites) {
        this.data = bites;
        this.magic = le32(bites.slice(0, 4));
        this.rfu000 = le32(bites.slice(4, 8));
        this.labelPtr = bites.slice(8, 12);
        this.dataPtr = bites.slice(12, 16);
        this.sectionTotal = bites.slice(16, 20);
    }
}