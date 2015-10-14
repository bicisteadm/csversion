var assert = require('assert');
var sinon = require('sinon');
var log = require('verbalize');
var fs = require('fs');
var csversion = require('../lib/csversion.js');

var quietLog = {
  info: function () { },
  success: function () { },
  warn: function () { }
};

var argv = ['foo', 'bar', 'fake.csproj'];
var args;

beforeEach(function () {
  args = {
    argv: argv,
    log: quietLog,
    fs: fs
  };
});

afterEach(function () {
  sinon.restore(log);
  sinon.restore(fs);
});

describe('csversion', function () {

  it('should create version.txt if non-existent', function () {
    sinon.stub(fs, 'existsSync').returns(false);
    var mock = sinon.mock(fs).expects('writeFileSync').once();

    csversion(args).createVersionFile();

    mock.verify();
  });

  it('should not create version.txt if exists', function () {
    sinon.stub(fs, 'existsSync').returns(true);
    var mock = sinon.mock(fs).expects('writeFileSync').never();

    csversion(args).createVersionFile();

    mock.verify();
  });

  it('should create build/BuildCommon.targets file if non-existent', function () {
    sinon.stub(fs, 'existsSync').returns(false);
    sinon.stub(fs, 'readFileSync').returns('');
    var stub = sinon.stub(fs, 'mkdirSync');
    var mock = sinon.mock(fs).expects('writeFileSync').once();

    csversion(args).copyBuildCommon();

    mock.verify();
    assert(stub.calledOnce);
  });

  it('should not create build/BuildCommon.targets file if exists', function () {
    sinon.stub(fs, 'existsSync').returns(true);
    var mock = sinon.mock(fs).expects('writeFileSync').never();

    csversion(args).copyBuildCommon();

    mock.verify();
  });

  it('should add build/BuildCommon.targets reference to project file if non-existent', function () {
    sinon.stub(fs, 'readFileSync')
      .returns('<Import Project="..\\..\\build\\BuildCommon.targets" />');
    var mock = sinon.mock(fs).expects('writeFileSync').never();

    csversion(args).addTargetsReference();

    mock.verify();
  });

  it('should not add build/BuildCommon.targets reference to project file if exists', function () {
    sinon.stub(fs, 'readFileSync').returns('');
    var mock = sinon.mock(fs).expects('writeFileSync').once();

    csversion(args).addTargetsReference();

    mock.verify();
  });

});