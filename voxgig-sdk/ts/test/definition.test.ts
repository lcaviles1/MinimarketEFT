import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "producto",
    "accessor": "Producto",
    "op": "create",
    "method": "POST",
    "path": "/api/productos",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": 1,
      "nombre": "x",
      "precio": 1,
      "stock": 1,
      "categoria": {
        "id": 1,
        "nombre": "x"
      },
      "_links": {}
    },
    "idField": "id"
  },
  {
    "entity": "producto",
    "accessor": "Producto",
    "op": "load",
    "method": "GET",
    "path": "/api/productos/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": 1,
      "nombre": "x",
      "precio": 1,
      "stock": 1,
      "categoria": {
        "id": 1,
        "nombre": "x"
      },
      "_links": {}
    },
    "idField": "id"
  },
  {
    "entity": "producto",
    "accessor": "Producto",
    "op": "load",
    "method": "GET",
    "path": "/api/productos",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "_embedded": {
        "productoList": [
          {
            "id": 1,
            "nombre": "x",
            "precio": 1,
            "stock": 1,
            "categoria": {
              "id": 1,
              "nombre": "x"
            },
            "_links": {}
          }
        ]
      },
      "_links": {}
    },
    "idField": "id"
  },
  {
    "entity": "producto",
    "accessor": "Producto",
    "op": "remove",
    "method": "DELETE",
    "path": "/api/productos/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 204,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "producto",
    "accessor": "Producto",
    "op": "update",
    "method": "PUT",
    "path": "/api/productos/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": 1,
      "nombre": "x",
      "precio": 1,
      "stock": 1,
      "categoria": {
        "id": 1,
        "nombre": "x"
      },
      "_links": {}
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
