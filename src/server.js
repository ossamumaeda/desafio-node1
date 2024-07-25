import http from 'node:http'
import { routes } from './routes/index.js';
import {json} from '../src/middlewares/json.js';
const server = http.createServer(async (req,res) =>{
    const { method, url } = req

    await json(req, res)

    const route = routes.find((r) => r.method===method && r.path.test(url))
    if(route){
        const routeParams  = req.url.match(route.path)
        
        const {query, ...params} = routeParams.groups

        req.params = params
        
        req.query = query ? extractQueryParams(query) : {};
        return route.handler(req,res)
    }

    return res
        .writeHead(401)
        .end('Not found')
})

server.listen(3334)