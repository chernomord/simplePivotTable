import {PivotBuilder} from './dataCrawler/DataCrawler';
import data from './dataExample/Cars';

let pivot = new PivotBuilder();

window.pivotTabe = pivot.renderFknTable.bind(pivot);

let container = document.body;

let table = pivotTabe(data, ['year', 'department'], ['brand', 'model'], (items) => {
    let result = 0;
    for (let item of items) {
        result += +item.price
    }
    return result;
});

container.appendChild(table);