import {DataCrawler} from '../../src/dataCrawler/DataCrawler';
import CarsData from '../../src/dataExample/Cars';

describe('Data Crawler', () => {
    const cars = CarsData;
    it('should get rows fields', () => {
        let data = new DataCrawler();
        let rowsFields = data.getRowsArray(cars, ['year', 'department', 'brand']);
        expect(rowsFields.length).toBe(27);
        expect(rowsFields[9][0]).toBe(2015);
    });
    it('should return matched items', () => {
       let data = new DataCrawler();
       let matched = data.findMatched(cars, ['year', 'department', 'brand', 'type'], [2014, 'Moscow', 'Honda', 'sedan']);
       expect(matched.length).toBe(1);
       expect(matched[0].price).toBe('24000');
    });
    it('should get pivot result as a dict of arrays of the fields not included in rows and cols', () => {
        let data = new DataCrawler();
        let results = data.pivotResultsRaw(cars, ['year', 'department'], ['brand', 'type']);
        expect(results[0][0].length).toBe(1);
        expect(results[0][0][0].price).toBe('24000');
    })
});