class DataCrawler {
    constructor () {
    }

    /**
     *
     * @param data {Object}
     * @param rowNames {Array}
     * @returns {Array}
     */
    getRowsArray (data, rowNames) {
        let result = [];
        for (let item of data) {
            let dummy = [];
            for (let name of rowNames) {
                dummy.push(item[name]);
            }
            if (JSON.stringify(result).indexOf(JSON.stringify(dummy)) < 0) {
                result.push(dummy);
            }
        }
        result.sort((a, b) => {
            for (let i = 0; i < a.length; ++i) {
                if (a[i] < b[i]) return -1;
                if (a[i] > b[i]) return 1;
            }
            return 0
        });
        return result;
    }

    /**
     *
     * @param data {Array}
     * @param fields {Array}
     * @param values {Array}
     * @returns {Array}
     */
    findMatched (data, fields, values) {
        let result = [];
        for (let item of data) { // iterate data array
            let objectFound = false;
            let obj = {};
            for (let prop in fields) { // iterate array of searched props names
                let field = fields[prop];
                let value = values[prop];
                obj[field] = value;
                if (item[field] === value) {
                    objectFound = true
                } else {
                    objectFound = false; break;
                }
            }
            if (objectFound) result.push(item);
        }
        return result
    }

    /**
     *
     * @param data {Array}
     * @param rowNames {Array}
     * @param colNames {Array}
     * @returns {Array}
     */
    pivotResultsRaw (data, rowNames, colNames) {
        let result = [];
        let allProps = rowNames.concat(colNames);
        let rowProps = this.getRowsArray(data, rowNames);
        let colProps = this.getRowsArray(data, colNames);
        for (let rowIdx in rowProps) { // iterate rows values
            result[rowIdx] = [];
            for (let colIdx in colProps) { // iterate cols values
                let allValues = rowProps[rowIdx].concat(colProps[colIdx]);
                result[rowIdx][colIdx] = this.findMatched(data, allProps, allValues);
            }
        }

        return result;
    }

    /**
     *
     * @param rawResultsTable {Array[]}
     * @param callback {Function}
     * @returns {Array}
     */
    calculateResults(rawResultsTable, callback) {
        let refinedResults = [];
        for (let rowId in rawResultsTable) {
            refinedResults[rowId] = [];
            for (let colId in rawResultsTable[rowId]) {
                // refinedResults[rowId][colId] = [];
                let matchedItems = rawResultsTable[rowId][colId];
                refinedResults[rowId][colId] = callback(matchedItems);
            }
        }
        return refinedResults
    }

    /**
     *
     * @param data {Array}
     * @param rowNames {Array}
     * @param colNames {Array}
     * @param calculateResultCallback {Function}
     */
    renderFknTable (data, rowNames, colNames, calculateResultCallback) {
        let TABLE = document.createElement('table');
        let THEAD = document.createElement('thead');
        let TBODY = document.createElement('tbody');
    }
}

export {DataCrawler}

