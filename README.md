# `csv-to-xml`

`csv-to-xml` is an easy-to-use library that quickly converts any CSV data in a string or file to its equivalent XML representation.

## Usage

### CSV file

`data.csv`

```txt
Color,Maximum Speed,Age
red,120,2
blue,150,4;
```

### CSV to XML Conversion

`index.js`

```js
import csvToXml from 'csv-to-xml';
import fs from 'fs/promises';

const csv = await fs.readFile('data.csv', {
  encoding: 'utf-8',
});

const xml = csvToXml(csv, {
  headerList: ['color', 'maxSpeed', 'age'],
});

console.log(xml);
```

### Output

```xml
<row>
<color>red</color>
<maxSpeed>120</maxSpeed>
<age>2</age>
</row>
<row>
<color>blue</color>
<maxSpeed>150</maxSpeed>
<age>4</age>
</row>
```

## API

### `csvToXml(csv: string, options: CSVToXMLOptions): string`

Takes string containing CSV data and returns string containing equivalent XML data.

### `CSVToXMLOptions`

- `eol`: character to be treated as end of a line. If unspecified, EOL character will be auto-detected.

  Type: `string`\
  Default: `undefined`

- `separator`: character used to separate each CSV column.

  Type: `string`\
  Default: `','`

- `rowName`: name given to XML element wrapping column XML elements.

  Type: `string`\
  Default: `'row'`

- `headerList`: List of custom header names to use for the CSV.

  Type: `string[]`\
  Default: `[]`

- `header`: Whether the CSV data contains a header row or not.

  Type: `boolean`\
  Default: `true`
