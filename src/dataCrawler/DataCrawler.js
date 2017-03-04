/**
 * Pivot builder class
 */
class PivotBuilder {
    constructor () {
    }

    /**
     * Builds Array of Rows or Columns with values of corresponding names
     * @param data {Object[]} - input data [ {year:2016, fruit: "Apples"} ... { } ]
     * @param rowNames {String[]} - names array, like ['year','fruit']
     * @returns {String[][]} - it's line [['2014', 'Apples'] ... ['2017', 'Bananas']]
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
     * Find and returns data items witch fields values matches every input fields values
     * @param data {Object[]}
     * @param fields {String[]}
     * @param values {String[]}
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
                    objectFound = false;
                    break;
                }
            }
            if (objectFound) result.push(item);
        }
        return result
    }

    /**
     * Gets pivot table, each cell contains array of matched data items
     * @param data {Object[]} - input data
     * @param rowNames {String[]} - names array, like ['year','fruit']
     * @param colNames {String[]} - names array, like ['year','fruit']
     * @returns {Any[][]} - result like [[[{dataItem},...], ... ], ... ]
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
     * Calculate result using raw array of results for each pivot cell
     * @param rawResultsTable {Any[][]} - like [ [ [ {dataItem},... ], ... ], ... ]
     * @param callback {Function} - function that takes cell items array as parameter and expected to return single value
     * @returns {Array[]} - calculated results for each cell, like: [ [ [45], ... ], ... ]
     */
    calculateResults (rawResultsTable, callback) {
        let refinedResults = [];
        for (let rowId in rawResultsTable) {
            refinedResults[rowId] = [];
            for (let colId in rawResultsTable[rowId]) {
                let matchedItems = rawResultsTable[rowId][colId];
                refinedResults[rowId][colId] = callback(matchedItems);
            }
        }
        return refinedResults
    }

    /**
     * Main method, returns resulted HTMLElement with calculated Pivot table
     * @param data {Object[]} - input data
     * @param rowNames {String[]} - names array, like ['year','fruit']
     * @param colNames {String[]} - names array, like ['year','fruit']
     * @param calculateResultCallback {Function} - function that takes cell items array as parameter and expected
     * to return single value
     * @returns {HTMLElement}
     */
    renderFknTable (data, rowNames, colNames, calculateResultCallback) {

        let resultsRaw = this.pivotResultsRaw(data, rowNames, colNames);
        let results = this.calculateResults(resultsRaw, calculateResultCallback);

        let rows = this.getRowsArray(data, rowNames);
        let cols = this.getRowsArray(data, colNames);

        let $table = document.createElement('table');
        $table.classList.add('pivot-table');
        let $thead = document.createElement('thead');
        let $tbody = document.createElement('tbody');

        // assemble table head
        for (let colInnerIdx in colNames) {
            let $row = document.createElement('tr');
            for (let col of rowNames) { // header names columns
                $row.appendChild(document.createElement('th'));
            }
            $row.appendChild(document.createElement('th'));
            let colspan = 1;
            cols.map((rowVal, i) => { // header prop values
                let nextColVal = (cols[i + 1]) ? cols[i + 1][colInnerIdx] : undefined;
                let curColVal = rowVal[colInnerIdx];

                let $th = document.createElement('th');
                $th.innerText = rowVal[colInnerIdx];
                if (nextColVal === curColVal) {
                    // if next value is the same then increment colspan and pass
                    colspan++;
                } else {
                    // else add cell and reset colspan
                    $th.setAttribute('colspan', colspan);
                    colspan = 1;
                    $row.appendChild($th);
                }
            });
            $thead.appendChild($row);
        }
        // assemble table body
        let rowspan = 1;
        for (let rowIdx in results) {
            rowIdx = +rowIdx;
            let $row = document.createElement('tr');
            // headers
            let cellToSpan = null;
            for (let rowColIdx in rows[rowIdx]) {
                rowColIdx = +rowColIdx;
                let prevRowVal = (rows[rowIdx - 1]) ? rows[rowIdx - 1][rowColIdx] : undefined;
                let nextRowVal = (rows[rowIdx + 1]) ? rows[rowIdx + 1][rowColIdx] : undefined;
                let currRowVal = rows[rowIdx][rowColIdx];

                let $td = document.createElement('td');
                $td.innerText = rows[rowIdx][rowColIdx];
                $td.classList.add('rowLabel');
                if (currRowVal === nextRowVal && currRowVal !== prevRowVal) {
                    if (rowspan === 1) {
                        $row.appendChild($td);
                        cellToSpan = $td;
                    }
                    rowspan++;
                } else if (currRowVal === prevRowVal) {
                    rowspan++;
                } else {
                    rowspan++;
                    if (cellToSpan) cellToSpan.setAttribute('rowspan', rowspan);
                    rowspan = 1;
                    $row.appendChild($td);
                }
                if (rows[rowIdx].length === rowColIdx + 1) {
                    $td.setAttribute('colspan', 2);
                }
            }

            // results
            for (let result of results[rowIdx]) {
                let $td = document.createElement('td');
                $td.innerText = result || '';
                $td.classList.add('cell');
                $row.appendChild($td);
            }

            $tbody.appendChild($row);
        }

        $table.appendChild($thead);
        $table.appendChild($tbody);
        return $table;
    }
}

export {PivotBuilder}

