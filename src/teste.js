import {parse} from 'csv'
import * as fs from 'node:fs'

let delay = 0;

createReadStream('Book')
  .pipe(parse({ delimiter: ';', columns: true }))
  .on('data', (row) => {
    delay += 500; // Delay of 500 milliseconds
    setTimeout(() => {
      console.log(row);
    }, delay);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  })
  .on('error', (err) => {
    console.error(err);
  });