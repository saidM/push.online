'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai'),
      expect = chai.expect,
      chaiAsPromised = require('chai-as-promised'),
      sinon = require('sinon')

const fs = require('fs'),
      configFile = require('../config_file')

chai.use(chaiAsPromised)

describe('Config file', () => {
  beforeEach(() => {
    // Remove the config file before each test
    const exists = fs.existsSync('.statik.run.test')
    if (exists === true) fs.unlink('.statik.run.test')
  })

  describe('exists()', () => {
    it('returns false if there is no config file in the working directory', () => {
      expect(configFile.exists()).to.be.false
    })

    it('returns true if there is a config file in the working directory', () => {
      // Create the file first
      fs.openSync('.statik.run.test', 'w')

      expect(configFile.exists()).to.be.true
    })
  })

  describe('read()', () => {
    context('when the file does not exist', () => {
      it('rejects the promise', () => {
        return expect(configFile.read()).to.be.rejectedWith('COULD_NOT_READ_CONFIG_FILE')
      })
    })
    
    context('when the file does exist', () => {
      it('it returns the subdomain and the secret key in the callback', () => {
        fs.writeFileSync('.statik.run.test', 'hello-world\n123')
        
        return configFile.read().then(data => {
          const {subdomain, secretKey} = data
          expect(subdomain).to.equal('hello-world')
          expect(secretKey).to.equal('123')
        })
      })
    })
  })

  describe('create(subdomain, secretKey)', () => {
    it('creates a file and stores the subdomain and the secret key inside it', () => {
      return configFile.create('hello', '123').then(data => {
        const {subdomain, secretKey} = data
        expect(subdomain).to.equal('hello')
        expect(secretKey).to.equal('123')
      })
    })
  })

  describe('credentials()', () => {
    context('when there is no config file', () => {
      it('creates the file and returns the credentials', () => {
        return configFile.credentials().then(data => {
          const {subdomain, secretKey} = data
          
          expect(subdomain).not.to.be.undefined
          expect(secretKey).not.to.be.undefined
        })
      })
    })
    
    context('when there is a config file', () => {
      it('returns the credentials from the file', () => {
        fs.writeFileSync('.statik.run.test', 'hello-world\n123')

        return configFile.credentials().then(data => {
          const {subdomain, secretKey} = data
          
          expect(subdomain).to.equal('hello-world')
          expect(secretKey).to.equal('123')
        })
      })
    })
  })
})
