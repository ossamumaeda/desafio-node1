import fs from 'node:fs/promises'

const dbPath = new URL('db.json',import.meta.url)

export class Database{
    #database = {}

    constructor(){
        fs.readFile(dbPath,'utf-8').then(data =>{
            this.#database = JSON.parse(data)
        }).catch(()=>{
            this.#persist()
        })
    }

    #persist(){
        const stringFy = JSON.stringify(this.#database)
        fs.writeFile(dbPath,stringFy)
    }

    select(table,search){
        let data = this.#database[table] ?? []
        // Object.entries(search) ---> [['name','Maeda'] , ['email', 'Maeda']]
        if(search){
            console.log(search)
            data = data.filter(row =>{
                return Object.entries(search).some(([key,value]) =>{
                    return row[key]
                        .toLowerCase()
                        .includes(value.toLowerCase())
                })
            })  
        }

        return data
    }

    insert(table,data){
        if(Array.isArray(this.#database[table])){ // Verifica se esta criado
            this.#database[table].push(data)
        }
        else{
            this.#database[table] = [data]
        }

        this.#persist();

        return data;
    }

    delete(table,id){
        const rowIndex = this.#database[table].findIndex(r => r.id === id)
        if(rowIndex > -1){
            this.#database[table].splice(rowIndex,1)
            this.#persist()
        }
    }

    update(table,id,data){
        const rowIndex = this.#database[table].findIndex(r => r.id === id)
        if(rowIndex > -1){
            this.#database[table][rowIndex] = {id,...data}
            this.#persist()
        }
    }

    patch(table,id){
        const rowIndex = this.#database[table].findIndex(r => r.id === id)
        if(rowIndex > -1){
            const row = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = {...row,completed_at:true}
            this.#persist()
        }
    }

}