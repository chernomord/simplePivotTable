class DataCrawler {
    constructor () {
    }

    /**
     *
     * @param data {Object}
     * @param rowNames {Array}
     * @returns {Array}
     */
    getRowsArray(data, rowNames) {
        let result = [];
        for (let row in rowNames) {
            let rowName = rowNames[row];
            let dummy = {};
            result.push([]);
            for (let item of data) {
                dummy[item[rowName]] = item[rowName];
            }
            for (let item in dummy) {
                result[row].push(item);
            }
        }
        return result
    }
}

export {DataCrawler}

