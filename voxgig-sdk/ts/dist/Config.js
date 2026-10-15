"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_PLUGINS = exports.config = void 0;
const TestFeature_1 = require("./feature/test/TestFeature");
const FEATURE_CLASS = {
    test: TestFeature_1.TestFeature,
};
const FEATURE_PLUGINS = {};
exports.FEATURE_PLUGINS = FEATURE_PLUGINS;
class Config {
    makeFeature(fn) {
        const fc = FEATURE_CLASS[fn];
        const fi = new fc();
        return fi;
    }
    // False for a feature added at runtime via options.extend (station's
    // adopt path) - the constructor uses this to skip makeFeature for names
    // no generated class backs.
    hasFeature(fn) {
        return null != FEATURE_CLASS[fn];
    }
    main = {
        name: 'Minimarket',
        slug: "minimarket",
        version: "0.0.1",
        target: "ts",
    };
    feature = {
        test: {
            "options": {
                "active": false
            },
            "optspec": {
                "entity": "`$MAP`",
                "net": "`$MAP`"
            },
            "strict": false,
            "transport": "base"
        },
    };
    options = {
        base: "{base}",
        server: {
            "base": "http://127.0.0.1:18765",
        },
        auth: {
            prefix: 'Bearer',
        },
        headers: {
            "content-type": "application/json"
        },
        entity: {
            producto: {},
        }
    };
    entity = {
        "producto": {
            "fields": [
                {
                    "name": "categoria",
                    "title": "Categoria",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "embedded",
                    "title": "Embedded",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "id",
                    "title": "Id",
                    "type": "`$INTEGER`",
                    "format": "int64"
                },
                {
                    "name": "links",
                    "title": "Links",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "nombre",
                    "title": "Nombre",
                    "type": "`$STRING`"
                },
                {
                    "name": "precio",
                    "title": "Precio",
                    "type": "`$NUMBER`",
                    "format": "double"
                },
                {
                    "name": "stock",
                    "title": "Stock",
                    "type": "`$INTEGER`"
                }
            ],
            "id": {
                "field": "id",
                "name": "id"
            },
            "name": "producto",
            "op": {
                "create": {
                    "input": "data",
                    "name": "create",
                    "points": [
                        {
                            "kind": "http",
                            "method": "POST",
                            "orig": "/api/productos",
                            "segments": [
                                {
                                    "lit": "api"
                                },
                                {
                                    "lit": "productos"
                                }
                            ],
                            "parts": [
                                "api",
                                "productos"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {},
                            "select": {},
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                },
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/api/productos/{id}",
                            "segments": [
                                {
                                    "lit": "api"
                                },
                                {
                                    "lit": "productos"
                                },
                                {
                                    "var": "id"
                                }
                            ],
                            "parts": [
                                "api",
                                "productos",
                                "{id}"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "params": [
                                    {
                                        "name": "id",
                                        "orig": "id",
                                        "type": "`$INTEGER`",
                                        "kind": "param",
                                        "reqd": true
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "id"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        },
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/api/productos",
                            "segments": [
                                {
                                    "lit": "api"
                                },
                                {
                                    "lit": "productos"
                                }
                            ],
                            "parts": [
                                "api",
                                "productos"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {},
                            "select": {},
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                },
                "remove": {
                    "input": "data",
                    "name": "remove",
                    "points": [
                        {
                            "kind": "http",
                            "method": "DELETE",
                            "orig": "/api/productos/{id}",
                            "segments": [
                                {
                                    "lit": "api"
                                },
                                {
                                    "lit": "productos"
                                },
                                {
                                    "var": "id"
                                }
                            ],
                            "parts": [
                                "api",
                                "productos",
                                "{id}"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "params": [
                                    {
                                        "name": "id",
                                        "orig": "id",
                                        "type": "`$INTEGER`",
                                        "kind": "param",
                                        "reqd": true
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "id"
                                ]
                            }
                        }
                    ]
                },
                "update": {
                    "input": "data",
                    "name": "update",
                    "points": [
                        {
                            "kind": "http",
                            "method": "PUT",
                            "orig": "/api/productos/{id}",
                            "segments": [
                                {
                                    "lit": "api"
                                },
                                {
                                    "lit": "productos"
                                },
                                {
                                    "var": "id"
                                }
                            ],
                            "parts": [
                                "api",
                                "productos",
                                "{id}"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "params": [
                                    {
                                        "name": "id",
                                        "orig": "id",
                                        "type": "`$INTEGER`",
                                        "kind": "param",
                                        "reqd": true
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "id"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        }
    };
}
const config = new Config();
exports.config = config;
//# sourceMappingURL=Config.js.map