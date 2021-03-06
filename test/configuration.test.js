const fs = require('fs-extra')

const watcher = require('../lib')

const {prepareFixtureDir, reportLogs, cleanupFixtureDir} = require('./helper')

describe('configuration', function () {
  let fixtureDir, mainLogFile, workerLogFile

  beforeEach(async function () {
    ({fixtureDir, mainLogFile, workerLogFile} = await prepareFixtureDir())
  })

  afterEach(async function () {
    await reportLogs(this.currentTest, mainLogFile, workerLogFile)
    await cleanupFixtureDir(fixtureDir)
  })

  it('validates its arguments', async function () {
    await assert.isRejected(watcher.configure(), /requires an option object/)
  })

  it('configures the main thread logger', async function () {
    await watcher.configure({mainLog: mainLogFile})

    const contents = await fs.readFile(mainLogFile)
    assert.match(contents, /FileLogger opened/)
  })

  it('configures the worker thread logger', async function () {
    await watcher.configure({workerLog: workerLogFile})

    const contents = await fs.readFile(workerLogFile)
    assert.match(contents, /FileLogger opened/)
  })
})
