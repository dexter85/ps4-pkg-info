const ReadStream = require('fs-readstream-seek')
const struct = require('python-struct');
const PsfSection = require('./PsfSection');
const PsfHeader = require('./PsfHeader');
const FileTableEntry = require('./FileTableEntry');
const le16 = require('./Utils').le16;
const le32 = require('./Utils').le32;


module.exports.extract = function (filePath) {
    return new Promise((resolve, reject) => {
        let resolveData = {};

        let pkgFile = new ReadStream(filePath);
        pkgFile.once('data', chunk => {
            let fileCheckData = chunk.toString('utf-8', 0, 4);
            if (fileCheckData !== '\x7FCNT') {
                reject("No pkg file");
            }

            pkgFile.seek(0x10)
            pkgFile.once('data', chunk => {

                let totalTableEntry = struct.unpack(">I", chunk, 'hex')[0];

                pkgFile.seek(0x18)
                pkgFile.once('data', chunk => {
                    let offsetTableEntry = struct.unpack(">I", chunk, 'hex')[0];

                    let currentIndexTableEntry = 0;
                    getTableEntry(pkgFile, offsetTableEntry, totalTableEntry, currentIndexTableEntry).then(tableEntry => {

                        pkgFile.seek(tableEntry.offset)
                        pkgFile.once('data', data => {
                            let index = 20;
                            let psfHeader = new PsfHeader(data.slice(0, tableEntry.size));
                            let psfLabels = data.slice(le32(psfHeader.labelPtr), tableEntry.size);
                            let psfData = data.slice(le32(psfHeader.dataPtr), tableEntry.size);

                            for (let i = 0; i < le32(psfHeader.sectionTotal); i++) {

                                let psfSection = new PsfSection(data.slice(index, tableEntry.size));
                                let label = psfLabels.toString('utf-8', le16(psfSection.labelOffset), psfLabels.length).split("\u0000")[0];
                                let value;
                                switch (psfSection.dataType) {
                                    case 2:
                                        value = psfData.toString('utf-8', le32(psfSection.dataOffset), (le32(psfSection.dataOffset) + le32(psfSection.usedDataField) - 1));
                                        break;
                                    case 4:
                                        value = le32(psfData.slice(le32(psfSection.dataOffset), (le32(psfSection.dataOffset) + le32(psfSection.usedDataField))));
                                        break;
                                    default:

                                        break;
                                }
                                resolveData[label] = value;
                                index += 16
                            }
                            pkgFile.close();
                            pkgFile.destroy();
                            resolve(resolveData);
                        })
                    }).catch(error => {
                        reject(error);
                    });
                })
            })
        })
    });
}

function getTableEntry(pkg_file, offsetTableEntry, totalTableEntry, currentIndexTableEntry) {
    return new Promise((resolve, reject) => {
        let offSet = 32;
        pkg_file.seek(offsetTableEntry);
        pkg_file.once('data', chunk => {

            let tableEntry = new FileTableEntry(chunk);
            if (tableEntry.type === 0x1000) {
                resolve(tableEntry);
            }
            ++currentIndexTableEntry;
            if (currentIndexTableEntry === totalTableEntry) {
                reject();
            } else {
                offsetTableEntry = offsetTableEntry + offSet;
                return getTableEntry(pkg_file, offsetTableEntry, totalTableEntry, currentIndexTableEntry).then(data => resolve(data)).catch(error => reject(error));
            }
        });
    });
}