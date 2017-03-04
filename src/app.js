import {PivotBuilder} from './dataCrawler/DataCrawler';
import './app.css';

let pivot = new PivotBuilder();

window.pivotTabe = pivot.renderFknTable.bind(pivot);

