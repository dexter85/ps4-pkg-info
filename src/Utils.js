function baseConvert(num) {
    return {
        from: function (baseFrom) {
            return {
                to: function (baseTo) {
                    return parseInt(num, baseFrom).toString(baseTo);
                }
            };
        }
    };
}


module.exports.le32 = function (bits) {
    let result = 0;
    let offset = 0
    for (let i = 0; i < 4; i++) {
        let byte = baseConvert(bits.slice(i, (i + 1)).toString("hex")).from(16).to(10);
        result |= byte << offset
        offset += 8

    }
    return parseInt(result);
}


module.exports.le16 = function (bits) {
    let byteA = baseConvert(bits.slice(0, 1).toString('hex')).from(16).to(10);
    let byteB = baseConvert(bits.slice(1, 2).toString('hex')).from(16).to(10);
    return parseInt((byteA | byteB << 8))
}

module.exports.baseConvert = baseConvert;