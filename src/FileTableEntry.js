const struct = require('python-struct');

module.exports = class FileTableEntry {
    constructor(pkg_file) {
        let data = struct.unpack('>IIIIII8x', pkg_file, 'hex');
        this.type = data[0];
        this.unk1 = data[1];
        this.flags1 = data[2];
        this.flags2 = data[3];
        this.offset = data[4];
        this.size = data[5];
    }
}