import {parse} from 'csv'
import * as fs from 'node:fs'

fs.createReadStream('Book1.csv')
  .pipe(parse({ delimiter: ';', columns: true }))
  .on('data', (row) => {
    console.log(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  })
  .on('error', (err) => {
    console.error(err);
  });