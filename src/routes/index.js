import { Database } from '../middlewares/dataBase.js';
import { buildRoutePath } from '../utils/build-route-path.js'
import {randomUUID} from 'node:crypto'
import {parse} from 'csv-parse';

const dataBase = new Database();

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/task"),
        handler: (req, res) => {

            const {search} = req.query

            // const r = dataBase.select('tasks', search ?{
            //     name:search,
            //     email:search
            // }:null)
            const r = dataBase.select('tasks')
            return res
                .setHeader('Content-type', 'application/json')
                .end(JSON.stringify(r))
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/task"),
        handler: (req, res) => {
            const {
                title,
                description,
                completed_at,
                created_at,
                updated_at
            } = req.body
            console.log("POST")

            const task = {
                id:randomUUID(),
                title,
                description,
                completed_at,
                created_at,
                updated_at
            }
            dataBase.insert('tasks', task);
            return res.writeHead(201).end()
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/task/:id"),
        handler: (req, res) => {
            console.log("DELETE")
            dataBase.delete('tasks', req.params.id)
            return res
                .writeHead(204)
                .end()
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/task/:id"),
        handler: (req, res) => {
            console.log("PUT")
            const {id} = req.params
            const {
                title,
                description,
                completed_at,
                created_at,
                updated_at
            } = req.body

            dataBase.update('tasks', id,{
                title,
                description,
                completed_at,
                created_at,
                updated_at
            })
            return res
                .writeHead(204)
                .end()
        }
    },
    {
        method: "PATCH",
        path: buildRoutePath("/task/:id"),
        handler: (req, res) => {
            console.log("PATCH")
            const {id} = req.params

            dataBase.patch('tasks', id)
            return res
                .writeHead(204)
                .end()
        }
    }
]