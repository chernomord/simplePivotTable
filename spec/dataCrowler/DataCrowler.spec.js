import {PivotBuilder} from '../../src/dataCrawler/DataCrawler';
import CarsData from '../../src/dataExample/Cars';

describe('Data Crawler', () => {
    const cars = CarsData;
    it('should get rows fields', () => {
        let data = new PivotBuilder();
        let rowsFields = data.getRowsArray(cars, ['year', 'department', 'brand']);
        console.log(rowsFields);
        expect(rowsFields.length).toBe(27);
        expect(rowsFields[9][0]).toBe(2015);
    });
    it('should return matched items', () => {
        let data = new PivotBuilder();
        let matched = data.findMatched(cars, ['year', 'department', 'brand', 'type'], [2014, 'Moscow', 'Honda', 'sedan']);
        expect(matched.length).toBe(1);
        expect(matched[0].price).toBe('24000');
    });
    it('should get pivot result as a 2d array of matched data items array', () => {
        let data = new PivotBuilder();
        let results = data.pivotResultsRaw(cars, ['year', 'department'], ['brand', 'type']);
        expect(results[0][0].length).toBe(1);
        expect(results[0][0][0].price).toBe('24000');
    });
    it('should calculate results in 2d array with passed callback function', () => {
        let data = new PivotBuilder();
        let resultsTable = data.pivotResultsRaw(cars, ['year', 'department'], ['brand', 'type']);
        let summ = function (matchedItems) {
            let result = 0;
            for (let item of matchedItems) {
                result += +item.price
            }
            return result;
        };
        let refactoredResults = data.calculateResults(resultsTable, summ);
        expect(refactoredResults[0][0]).toBe(24000);
        expect(refactoredResults[6][2]).toBe(141000);
    });
});