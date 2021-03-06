'use strict'

const chai = require('chai'),
      expect = chai.expect,
      chaiAsPromised = require('chai-as-promised'),
      nock = require('nock'),
      fs = require('fs')

chai.use(chaiAsPromised)

const utils = require('../utils')

describe('Upload()', () => {
  it('resolves the promise', () => {
    let files = []
    for (let i = 0; i < 3; i++) files.push({ filename: `file-${i}.html`, content: `Content of file #${i}` }) 
    
    const request1 = nock('http://hello.statik.run').put(`/${files[0].filename}`, { content: files[0].content }).reply(200)
    const request2 = nock('http://hello.statik.run').put(`/${files[1].filename}`, { content: files[1].content }).reply(200)
    const request3 = nock('http://hello.statik.run').put(`/${files[2].filename}`, { content: files[2].content }).reply(200)
    
    const promise = utils.upload('hello', '123', files)
    return expect(promise).to.eventually.be.fulfilled
  })

  it('makes a PUT request for each file', () => {

    let files = []
    for (let i = 0; i < 3; i++) files.push({ filename: `file-${i}.html`, content: `Content of file #${i}` }) 
    
    const request1 = nock('http://hello.statik.run').put(`/${files[0].filename}`, { content: files[0].content }).reply(200)
    const request2 = nock('http://hello.statik.run').put(`/${files[1].filename}`, { content: files[1].content }).reply(200)
    const request3 = nock('http://hello.statik.run').put(`/${files[2].filename}`, { content: files[2].content }).reply(200)

    utils.upload('hello', '123', files).then(() => {
      request1.done()
      request2.done()
      request3.done()
    })
  })
})
