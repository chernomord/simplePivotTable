# Simple Pivot Table

[Live Examle](https://chernomord.github.io/simplePivotTable/)

## Usage

1. Download [app.js](https://chernomord.github.io/simplePivotTable/js/app.js)
2. Link to your page `<script type="text/javascript" src="js/app.js"></script>`
3. load any table data in JSON format into variable
4. use pivotTable global function with the data
```
pivotTabe(data, [rowNames...], [colNames...], callbackFun(items) {
    let result = 0;
        for (let item of items) {
            result += +item['propertyForSummation']
        }
        return result;
})
```

## Browser support

Latest Chrome and FireFox

## Build

```
npm i
npm build
```

## Unit Tests

```
npm test
```
