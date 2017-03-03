import {DataCrawler} from '../../src/dataCrawler/DataCrawler';
import CarsData from '../../src/dataExample/Cars';

describe('Data Crawler', () => {
    const cars = CarsData;
    it('should get rows fields', () => {
        let data = new DataCrawler();
        let rowsFields = data.getRowsArray(cars, ['year', 'department', 'brand']);
        console.log(rowsFields);
        expect(rowsFields.length).toBe(3);
        expect(rowsFields[2][1]).toBe('Honda');
    });
    it('should get pivot result as a dict of arrays of the fields not included in rows and cols', () => {
        let data = new DataCrawler();
        let results = data.pivotResultsRaw(cars, ['year', 'department'], ['brand', 'type']);
        console.log(results);

    })
});