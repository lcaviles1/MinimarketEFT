"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('ProductoEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when MINIMARKET_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('MINIMARKET_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.MinimarketSDK.test();
        const ent = testsdk.Producto();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.MinimarketSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Producto().load({ "id": "x" }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.MINIMARKET_TEST_LIVE;
        for (const op of ['create', 'update', 'load', 'remove']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'producto.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "categoria": { "a": true, "h": "Categoria", "n": "categoria", "r": false, "t": "`$OBJECT`", "key$": "categoria", "index$": 0 }, "embedded": { "a": true, "h": "Embedded", "n": "embedded", "r": false, "t": "`$OBJECT`", "key$": "embedded", "index$": 1 }, "id": { "a": true, "fo": "int64", "h": "Id", "n": "id", "r": false, "t": "`$INTEGER`", "key$": "id", "index$": 2 }, "links": { "a": true, "h": "Links", "n": "links", "r": false, "t": "`$OBJECT`", "key$": "links", "index$": 3 }, "nombre": { "a": true, "h": "Nombre", "n": "nombre", "r": false, "t": "`$STRING`", "key$": "nombre", "index$": 4 }, "precio": { "a": true, "fo": "double", "h": "Precio", "n": "precio", "r": false, "t": "`$NUMBER`", "key$": "precio", "index$": 5 }, "stock": { "a": true, "h": "Stock", "n": "stock", "r": false, "t": "`$INTEGER`", "key$": "stock", "index$": 6 } }, "id": { "field": "id", "name": "id" }, "name": "producto", "op": { "create": { "input": "data", "name": "create", "points": [{ "a": true, "bf": ["categoria", "id", "links", "nombre", "precio", "stock"], "co": { "id": "POST /api/productos", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "POST", "o": "/api/productos", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "productos" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "create" }, "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /api/productos/{id}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "id", "r": true, "t": "`$INTEGER`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/api/productos/{id}", "q": { "exist": ["id"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "productos" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }, { "a": true, "co": { "id": "GET /api/productos", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "GET", "o": "/api/productos", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "productos" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 1 }], "key$": "load" }, "remove": { "input": "data", "name": "remove", "points": [{ "a": true, "co": { "id": "DELETE /api/productos/{id}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "id", "r": true, "t": "`$INTEGER`", "index$": 0 }] }, "k": "http", "m": "DELETE", "o": "/api/productos/{id}", "q": { "exist": ["id"] }, "r": {}, "s": [{ "lit": "api" }, { "lit": "productos" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "remove" }, "update": { "input": "data", "name": "update", "points": [{ "a": true, "bf": ["categoria", "id", "links", "nombre", "precio", "stock"], "co": { "id": "PUT /api/productos/{id}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "id", "r": true, "t": "`$INTEGER`", "index$": 0 }] }, "k": "http", "m": "PUT", "o": "/api/productos/{id}", "q": { "exist": ["id"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "productos" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "update" } }, "relations": { "ancestors": [] }, "key$": "producto", "name__orig": "producto", "Name": "Producto", "name_": "producto", "name-": "producto", "NAME": "PRODUCTO", "index$": 0 }, { "active": true, "entity": "producto", "key$": "BasicProductoFlow", "kind": "basic", "name": "BasicProductoFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "producto_ref01" }, "m": {}, "o": "create", "s": [], "v": [] }, { "a": true, "d": {}, "i": { "ref": "producto_ref01", "srcdatavar": "producto_ref01_data", "suffix": "_up0", "textfield": "nombre" }, "m": {}, "o": "update", "s": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-producto_ref01" } }], "v": [] }, { "a": true, "d": {}, "i": { "ref": "producto_ref01", "srcdatavar": "producto_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-producto_ref01" } }] }, { "a": true, "d": {}, "i": { "ref": "producto_ref01", "suffix": "_rm0" }, "m": { "id": "producto01" }, "o": "remove", "s": [], "v": [] }] }, 'Producto', { "POST /api/productos": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "id": { "type": "integer", "format": "int64", "key$": "id" }, "nombre": { "type": "string", "key$": "nombre" }, "precio": { "type": "number", "format": "double", "key$": "precio" }, "stock": { "type": "integer", "key$": "stock" }, "categoria": { "type": "object", "properties": { "id": { "type": "integer", "format": "int64" }, "nombre": { "type": "string" } }, "x-ref": "#/components/schemas/Categoria", "key$": "categoria" }, "_links": { "type": "object", "additionalProperties": true, "key$": "_links" } }, "x-ref": "#/components/schemas/Producto", "index$": 1 } } } }, "parameters": [] }, "GET /api/productos/{id}": { "protocol": "http", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "integer", "format": "int64" }, "index$": 0 }] }, "GET /api/productos": { "protocol": "http", "parameters": [] }, "DELETE /api/productos/{id}": { "protocol": "http", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "integer", "format": "int64" }, "index$": 0 }] }, "PUT /api/productos/{id}": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "id": { "type": "integer", "format": "int64", "key$": "id" }, "nombre": { "type": "string", "key$": "nombre" }, "precio": { "type": "number", "format": "double", "key$": "precio" }, "stock": { "type": "integer", "key$": "stock" }, "categoria": { "type": "object", "properties": { "id": { "type": "integer", "format": "int64" }, "nombre": { "type": "string" } }, "x-ref": "#/components/schemas/Categoria", "key$": "categoria" }, "_links": { "type": "object", "additionalProperties": true, "key$": "_links" } }, "x-ref": "#/components/schemas/Producto", "index$": 1 } } } }, "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "integer", "format": "int64" }, "index$": 0 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const producto_ref01_ent = client.Producto();
        let producto_ref01_data = setup.data.new.producto['producto_ref01'];
        producto_ref01_data = (await producto_ref01_ent.create(producto_ref01_data)).data();
        (0, node_assert_1.default)(null != producto_ref01_data.id);
        // UPDATE
        const producto_ref01_data_up0 = {};
        producto_ref01_data_up0.id = producto_ref01_data.id;
        const producto_ref01_markdef_up0 = { name: 'nombre', value: 'Mark01-producto_ref01_' + setup.now };
        producto_ref01_data_up0[producto_ref01_markdef_up0.name] = producto_ref01_markdef_up0.value;
        const producto_ref01_resdata_up0 = (await producto_ref01_ent.update(producto_ref01_data_up0)).data();
        (0, node_assert_1.default)(producto_ref01_resdata_up0.id === producto_ref01_data_up0.id);
        (0, node_assert_1.default)(producto_ref01_resdata_up0[producto_ref01_markdef_up0.name] === producto_ref01_markdef_up0.value);
        // LOAD
        const producto_ref01_match_dt0 = {};
        producto_ref01_match_dt0.id = producto_ref01_data.id;
        const producto_ref01_data_dt0 = (await producto_ref01_ent.load(producto_ref01_match_dt0)).data();
        (0, node_assert_1.default)(producto_ref01_data_dt0.id === producto_ref01_data.id);
        // REMOVE
        const producto_ref01_match_rm0 = { id: producto_ref01_data.id };
        await producto_ref01_ent.remove(producto_ref01_match_rm0);
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/producto/ProductoTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.MinimarketSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['producto01', 'producto02', 'producto03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'MINIMARKET_TEST_PRODUCTO_ENTID': idmap,
        'MINIMARKET_TEST_LIVE': 'FALSE',
        'MINIMARKET_TEST_EXPLAIN': 'FALSE',
        'MINIMARKET_APIKEY': '',
        'MINIMARKET_SERVER_BASE': "http://127.0.0.1:18765",
    });
    idmap = env['MINIMARKET_TEST_PRODUCTO_ENTID'];
    const live = 'TRUE' === env.MINIMARKET_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['MINIMARKET_TEST_PRODUCTO_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.MinimarketSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {
                apikey: env.MINIMARKET_APIKEY,
                server: {
                    base: env.MINIMARKET_SERVER_BASE,
                },
            },
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
    }
    const setup = {
        idmap,
        env,
        options,
        client,
        struct,
        data: entityData,
        explain: 'TRUE' === env.MINIMARKET_TEST_EXPLAIN,
        live,
        transport,
        now: Date.now(),
    };
    return setup;
}
//# sourceMappingURL=ProductoEntity.test.js.map