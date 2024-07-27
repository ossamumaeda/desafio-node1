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

    async #persist(){
        const stringFy = JSON.stringify(this.#database)
        await fs.writeFile(dbPath,stringFy)
    }

    async select(table,search){
        this.#database =  JSON.parse(await fs.readFile(dbPath,'utf-8'));
        let data = this.#database[table] ?? []

        if(search && !Object.keys(search).length === 0){
            data = data.filter(row =>{
                return Object.entries(search).some(([key,value]) =>{
                    return row[key]
                        .toLowerCase()
                        .includes(value.toLowerCase())
                })
            })  
        }
        console.log(data)
        return data
    }

    async insert(table,data){
        this.#database =  JSON.parse(await fs.readFile(dbPath,'utf-8'));
        if(Array.isArray(this.#database[table])){ // Verifica se esta criado
            this.#database[table].push(data)
        }
        else{
            this.#database[table] = [data]
        }
        await this.#persist();
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
        if(!(data.title && data.description)){
            console.log("Campos faltando")
            return {message: "Campos faltando",error:true}
        }
        
        const rowIndex = this.#database[table].findIndex(r => r.id === id)
        if(rowIndex > -1){
            this.#database[table][rowIndex] = {...this.#database[table][rowIndex],...data}
            this.#persist()
            return {message:"Registro alterado com sucessos", error: false}
        }
        return {message: "Id não encontrado",error:true}
    }

    patch(table,id){
        const rowIndex = this.#database[table].findIndex(r => r.id === id)
        if(rowIndex > -1){
            let row = this.#database[table][rowIndex];
            let completed_at = null
            if(!row.completed_at){
                completed_at = new Date()
            }
            this.#database[table][rowIndex] = {...row,completed_at}
            this.#persist()
            return {message:"Registro alterado com sucessos", error: false}
        }else{
            console.log("Id inexistente")
            return {message: "Id inexistente",error:true}
        }
    }

}