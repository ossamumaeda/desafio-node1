import { Readable, Writable, pipeline } from 'node:stream';
import { parse } from 'csv';
import { Database } from '../middlewares/dataBase.js';
import { randomUUID } from 'node:crypto'
import * as fs from 'node:fs';
const dataBase = new Database();

class CSVReadableStream extends Readable {
    constructor(filePath) {
        super({ objectMode: true });
        this.filePath = filePath;
    }
    _read() {
        fs.createReadStream(this.filePath)
            .pipe(parse({ delimiter: ';', from_line: 1 })) // Ensure from_line: 1 to process data rows correctly
            .on('data', (row) => {
                if (this.headerSkipped) {
                    this.push(row);
                } else {
                    this.headerSkipped = true;
                }
            })
            .on('end', () => this.push(null)); // Signal end of stream
    }
}

class writeCreateTask extends Writable {
    constructor() {
        super({ objectMode: true });
    }
    async _write(chunk, encoding, callback) {
        const title = chunk[0];
        const description = chunk[1];
        const task = {
            id: randomUUID(),
            title,
            description,
            completed_at: null ,
            created_at: new Date(),
            updated_at: new Date() 
        }
        dataBase.insert('tasks', task).then(r =>{

            callback()
        }
        )
    }
}

export async function createTask() { // Will read the file and create tasks
    const csvStream = new CSVReadableStream('./Tasks.csv');
    const multiplyStream = new writeCreateTask();

    pipeline(
        csvStream,
        multiplyStream,
        (err) => {
            if (err) {
                console.error('Pipeline failed.', err);
            } else {
                console.log('Pipeline succeeded.');
            }
        }
    )
}