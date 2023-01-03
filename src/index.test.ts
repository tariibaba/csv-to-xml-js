import csvToXml from '.';

it('converts basic CSV to XML', () => {
  const csv = `color,maxSpeed,age
"red",120,2
"blue",150,4`;

  const xml = csvToXml(csv);
  expect(xml).toBe(
    `<row>
    <color>"red"</color>
    <maxSpeed>120</maxSpeed>
    <age>2</age>
</row>
<row>
    <color>"blue"</color>
    <maxSpeed>150</maxSpeed>
    <age>4</age>
</row>
`
  );
});

it('accepts custom separator', () => {
  const csv = `color|maxSpeed|age
"red"|120|2`;

  const xml = csvToXml(csv, { separator: '|' });
  expect(xml).toBe(
    `<row>
    <color>"red"</color>
    <maxSpeed>120</maxSpeed>
    <age>2</age>
</row>
`
  );
});

it('accepts custom rowName', () => {
  const csv = `color,maxSpeed,age
"red",120,2`;

  const xml = csvToXml(csv, { rowName: 'car' });
  expect(xml).toBe(
    `<car>
    <color>"red"</color>
    <maxSpeed>120</maxSpeed>
    <age>2</age>
</car>
`
  );
});

it('accepts custom headerList', () => {
  const csv = `Color,Max Speed,Age
"red",120,2`;

  const xml = csvToXml(csv, { headerList: ['color', 'maxSpeed', 'age'] });
  expect(xml).toBe(
    `<row>
    <color>"red"</color>
    <maxSpeed>120</maxSpeed>
    <age>2</age>
</row>
`
  );
});

it('accepts CSV with no headers', () => {
  const csv = `"red",120,2`;

  const xml = csvToXml(csv, { header: false });
  expect(xml).toBe(
    `<row>
    <col1>"red"</col1>
    <col2>120</col2>
    <col3>2</col3>
</row>
`
  );
});

it('accepts custom EOL', () => {
  const csv = `color,maxSpeed,age\r
"red",120,2`;

  const xml = csvToXml(csv, { eol: '\r\n' });
  expect(xml).toBe(
    `<row>
    <color>"red"</color>
    <maxSpeed>120</maxSpeed>
    <age>2</age>
</row>
`
  );
});

it('accepts custom indentation', () => {
  const csv = `color,maxSpeed,age
"red",120,2`;

  const xml = csvToXml(csv, { indentation: 0 });
  expect(xml).toBe(
    `<row>
<color>"red"</color>
<maxSpeed>120</maxSpeed>
<age>2</age>
</row>
`
  );

  const xml2 = csvToXml(csv, { indentation: 2 });
  expect(xml2).toBe(
    `<row>
  <color>"red"</color>
  <maxSpeed>120</maxSpeed>
  <age>2</age>
</row>
`
  );

  const xml3 = csvToXml(csv, { indentation: ' ' });
  expect(xml3).toBe(
    `<row>
 <color>"red"</color>
 <maxSpeed>120</maxSpeed>
 <age>2</age>
</row>
`
  );
});

describe('accepts CSV with quotes', () => {
  const csv = `color,maxSpeed,age
    "red, yellow",'120',2`;

  const csv2 = `color,maxSpeed,age
"red",'120',2`;
  it('double', () => {
    const xml = csvToXml(csv, { quote: 'double' });
    expect(xml).toBe(
      `<row>
    <color>red, yellow</color>
    <maxSpeed>'120'</maxSpeed>
    <age>2</age>
</row>
`
    );
  });

  it('single', () => {
    const xml2 = csvToXml(csv2, { quote: 'single' });
    expect(xml2).toBe(
      `<row>
    <color>"red"</color>
    <maxSpeed>120</maxSpeed>
    <age>2</age>
</row>
`
    );
  });

  it('none', () => {
    const xml3 = csvToXml(csv2, { quote: 'none' });
    expect(xml3).toBe(
      `<row>
    <color>"red"</color>
    <maxSpeed>'120'</maxSpeed>
    <age>2</age>
</row>
`
    );
  });

  it('all', () => {
    const xml4 = csvToXml(csv2, { quote: 'all' });
    expect(xml4).toBe(
      `<row>
    <color>red</color>
    <maxSpeed>120</maxSpeed>
    <age>2</age>
</row>
`
    );
  });

  it('custom regex', () => {
    const csv5 = `color,maxSpeed,age
    (red, yellow),'120',2`;
    const xml5 = csvToXml(csv5, { quote: /[\(|\)]/ });
    expect(xml5).toBe(
      `<row>
    <color>red, yellow</color>
    <maxSpeed>'120'</maxSpeed>
    <age>2</age>
</row>
`
    );
  });
});
