import { createTask } from '../controllers/create-task.js';
import { Database } from '../middlewares/dataBase.js';
import { buildRoutePath } from '../utils/build-route-path.js'
import { randomUUID } from 'node:crypto'
const dataBase = new Database();

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/task"),
        handler: async (req, res) => {

            const query = req.query
            console.log(req.query)
            const search = {
                ...(query.title && { title: query.title }),
                ...(query.description && { description: query.description })
            };
            const r = await dataBase.select('tasks', search)
            return res
                .setHeader('Content-type', 'application/json')
                .end(JSON.stringify(r))
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/task"),
        handler: async (req, res) => {
            const {
                title,
                description,
            } = req.body
            console.log("POST")

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }
            await dataBase.insert('tasks', task);
            return res.writeHead(201).end()
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/task/csv"),
        handler: async (req, res) => {
            await createTask(req)
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
            const { id } = req.params
            const {
                title,
                description,
                completed_at,
                created_at,
                updated_at
            } = req.body

            dataBase.update('tasks', id, {
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
            const { id } = req.params

            dataBase.patch('tasks', id)
            return res
                .writeHead(204)
                .end()
        }
    }
]