
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { MinimarketSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = MinimarketSDK.test()
    equal(testsdk instanceof MinimarketSDK, true,
      'MinimarketSDK.test() must return a client synchronously')
  })

})
