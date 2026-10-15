

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { MinimarketSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('ProductoEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when MINIMARKET_TEST_LIVE=TRUE.
  afterEach(liveDelay('MINIMARKET_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = MinimarketSDK.test()
    const ent = testsdk.Producto()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = MinimarketSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Producto().load({"id":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.MINIMARKET_TEST_LIVE
    for (const op of ['create', 'update', 'load', 'remove']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'producto.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"categoria":{"a":true,"h":"Categoria","n":"categoria","r":false,"t":"`$OBJECT`","key$":"categoria","index$":0},"embedded":{"a":true,"h":"Embedded","n":"embedded","r":false,"t":"`$OBJECT`","key$":"embedded","index$":1},"id":{"a":true,"fo":"int64","h":"Id","n":"id","r":false,"t":"`$INTEGER`","key$":"id","index$":2},"links":{"a":true,"h":"Links","n":"links","r":false,"t":"`$OBJECT`","key$":"links","index$":3},"nombre":{"a":true,"h":"Nombre","n":"nombre","r":false,"t":"`$STRING`","key$":"nombre","index$":4},"precio":{"a":true,"fo":"double","h":"Precio","n":"precio","r":false,"t":"`$NUMBER`","key$":"precio","index$":5},"stock":{"a":true,"h":"Stock","n":"stock","r":false,"t":"`$INTEGER`","key$":"stock","index$":6}},"id":{"field":"id","name":"id"},"name":"producto","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["categoria","id","links","nombre","precio","stock"],"co":{"id":"POST /api/productos","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/api/productos","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"productos"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /api/productos/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"GET","o":"/api/productos/{id}","q":{"exist":["id"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"productos"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0},{"a":true,"co":{"id":"GET /api/productos","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/api/productos","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"productos"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":1}],"key$":"load"},"remove":{"input":"data","name":"remove","points":[{"a":true,"co":{"id":"DELETE /api/productos/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"DELETE","o":"/api/productos/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"api"},{"lit":"productos"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"},"update":{"input":"data","name":"update","points":[{"a":true,"bf":["categoria","id","links","nombre","precio","stock"],"co":{"id":"PUT /api/productos/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"PUT","o":"/api/productos/{id}","q":{"exist":["id"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"productos"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"producto","name__orig":"producto","Name":"Producto","name_":"producto","name-":"producto","NAME":"PRODUCTO","index$":0}, {"active":true,"entity":"producto","key$":"BasicProductoFlow","kind":"basic","name":"BasicProductoFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"producto_ref01"},"m":{},"o":"create","s":[],"v":[]},{"a":true,"d":{},"i":{"ref":"producto_ref01","srcdatavar":"producto_ref01_data","suffix":"_up0","textfield":"nombre"},"m":{},"o":"update","s":[{"apply":"TextFieldMark","def":{"mark":"Mark01-producto_ref01"}}],"v":[]},{"a":true,"d":{},"i":{"ref":"producto_ref01","srcdatavar":"producto_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-producto_ref01"}}]},{"a":true,"d":{},"i":{"ref":"producto_ref01","suffix":"_rm0"},"m":{"id":"producto01"},"o":"remove","s":[],"v":[]}]}, 'Producto', {"POST /api/productos":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","key$":"id"},"nombre":{"type":"string","key$":"nombre"},"precio":{"type":"number","format":"double","key$":"precio"},"stock":{"type":"integer","key$":"stock"},"categoria":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"nombre":{"type":"string"}},"x-ref":"#/components/schemas/Categoria","key$":"categoria"},"_links":{"type":"object","additionalProperties":true,"key$":"_links"}},"x-ref":"#/components/schemas/Producto","index$":1}}}},"parameters":[]},"GET /api/productos/{id}":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"},"index$":0}]},"GET /api/productos":{"protocol":"http","parameters":[]},"DELETE /api/productos/{id}":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"},"index$":0}]},"PUT /api/productos/{id}":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","key$":"id"},"nombre":{"type":"string","key$":"nombre"},"precio":{"type":"number","format":"double","key$":"precio"},"stock":{"type":"integer","key$":"stock"},"categoria":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"nombre":{"type":"string"}},"x-ref":"#/components/schemas/Categoria","key$":"categoria"},"_links":{"type":"object","additionalProperties":true,"key$":"_links"}},"x-ref":"#/components/schemas/Producto","index$":1}}}},"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const producto_ref01_ent = client.Producto()
    let producto_ref01_data = setup.data.new.producto['producto_ref01']

    producto_ref01_data = (await producto_ref01_ent.create(producto_ref01_data)).data()
    assert(null != producto_ref01_data.id)


    // UPDATE
    const producto_ref01_data_up0: any = {}
    producto_ref01_data_up0.id = producto_ref01_data.id

    const producto_ref01_markdef_up0 = { name: 'nombre', value: 'Mark01-producto_ref01_' + setup.now }
    ;(producto_ref01_data_up0 as any)[producto_ref01_markdef_up0.name] = producto_ref01_markdef_up0.value

    const producto_ref01_resdata_up0 = (await producto_ref01_ent.update(producto_ref01_data_up0)).data()
    assert(producto_ref01_resdata_up0.id === producto_ref01_data_up0.id)

    assert((producto_ref01_resdata_up0 as any)[producto_ref01_markdef_up0.name] === producto_ref01_markdef_up0.value)


    // LOAD
    const producto_ref01_match_dt0: any = {}
    producto_ref01_match_dt0.id = producto_ref01_data.id
    const producto_ref01_data_dt0 = (await producto_ref01_ent.load(producto_ref01_match_dt0)).data()
    assert(producto_ref01_data_dt0.id === producto_ref01_data.id)


    // REMOVE
    const producto_ref01_match_rm0: any = { id: producto_ref01_data.id }
    await producto_ref01_ent.remove(producto_ref01_match_rm0)
  

  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/producto/ProductoTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = MinimarketSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['producto01','producto02','producto03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'MINIMARKET_TEST_PRODUCTO_ENTID': idmap,
    'MINIMARKET_TEST_LIVE': 'FALSE',
    'MINIMARKET_TEST_EXPLAIN': 'FALSE',
    'MINIMARKET_APIKEY': '',
    'MINIMARKET_SERVER_BASE': "http://127.0.0.1:18765",
  })

  idmap = env['MINIMARKET_TEST_PRODUCTO_ENTID']

  const live = 'TRUE' === env.MINIMARKET_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['MINIMARKET_TEST_PRODUCTO_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new MinimarketSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
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
    ]))
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
  }

  return setup
}
  
