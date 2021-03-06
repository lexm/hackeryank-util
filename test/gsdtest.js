'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const addCode = require(__dirname + '/../lib/addcode.js');
const getScriptData = addCode.getScriptData;
const mock = require('mock-fs');
const home = process.env.HOME;
const repo = process.env.HACKERRANK_REPO || home + '/hackerrank-code/';

const fileData = {
  "progName": "Compute the Average",
  "pathArray": [ 'Linux_Shell', 'Bash' ],
  "message": "Linux Shell > Bash > Compute the Average",
  "filename": "bash-tutorials---compute-the-average.sh",
  "allCode": "read N\nTOTAL=0\nCOUNT=$N\nwhile [ $COUNT -gt 0 ]; do\n  read INT\n  let TOTAL+=$INT\n  let COUNT-=1\ndone\nprintf \"%.3f\\n\" $(echo \" $TOTAL / $N \" | bc -l)\n"
}

describe('getScriptData', function() {
  before(function(done) {
    mock({
      'downloads': {
        'file01.json': 'I am not a JSON file!',
        'file02.json': '{"name": "unknown field","pi": 3.14, "not_hyk": true}',
        'file03.json': JSON.stringify(fileData),
        'file04.json': JSON.stringify(fileData)
      }
    });
    done();
  });
  after(function(done) {
    mock.restore();
    done();
  });
  describe('when download file does not exist', function() {
    it('should throw an ENOENT error', function(done) {
      expect(function() {
        getScriptData('downloads/file00.json');
      }).to.throw('ENOENT');
      done();
    });
  });
  describe('when download file is not JSON', function() {
    it('should throw an error', function(done) {
      expect(function() {
        getScriptData('downloads/file01.json');
      }).to.throw('Unexpected token');
      done();
    });
  });
  describe('when download file is incorrect JSON', function() {
    it('should throw an error', function(done) {
      expect(function() {
        getScriptData('downloads/file02.json');
      }).to.throw();
      done();
    });
  });
  describe('when download file is correct JSON', function() {
    let scriptData;
    it('should not throw an error', function(done) {
      expect(function() {
        scriptData = getScriptData('downloads/file03.json');
      }).to.not.throw();
      done();
    });
    describe('scriptData', function() {
      it('should have correct type/value for scriptData.progName', function(done) {
        expect(scriptData.progName).to.be.a('string');
        expect(scriptData.progName).to.equal('Compute the Average');
        done();
      });
      it('should have correct type/value for scriptData.pathArray', function(done) {
        expect(scriptData.pathArray.length).to.equal(2);
        expect(scriptData.pathArray[0]).to.equal('Linux_Shell');
        expect(scriptData.pathArray[1]).to.equal('Bash');
        done();
      });
      it('should have correct type/value for scriptData.fullMessage', function(done) {
        expect(scriptData.fullMessage).to.be.a('string');
        expect(scriptData.fullMessage).to.equal('Solution to Linux Shell > Bash > Compute the Average');
        done();
      });
      it('should have correct type/value for scriptData.filename', function(done) {
        expect(scriptData.filename).to.be.a('string');
        expect(scriptData.filename).to.equal('bash-tutorials---compute-the-average.sh');
        done();
      });
      it('should have correct type/value for scriptData.allCode', function(done) {
        expect(scriptData.allCode).to.be.a('string');
        expect(scriptData.allCode).to.equal('read N\nTOTAL=0\nCOUNT=$N\nwhile [ $COUNT -gt 0 ]; do\n  read INT\n  let TOTAL+=$INT\n  let COUNT-=1\ndone\nprintf \"%.3f\\n\" $(echo \" $TOTAL / $N \" | bc -l)\n');
        done();
      });
      it('should have correct type/value for scriptData.fullPath', function(done) {
        expect(scriptData.fullPath).to.be.a('string');
        expect(scriptData.fullPath).to.equal(repo + 'Linux_Shell/Bash/');
        done();
      });
    });
  });
  describe('when download file is correct JSON and parameter is 1', function() {
    let scriptData;
    it('should not throw an error', function(done) {
      expect(function() {
        scriptData = getScriptData('downloads/file04.json', 1);
      }).to.not.throw();
      done();
    });
    describe('scriptData', function() {
      it('should have correct type/value for scriptData.fullMessage', function(done) {
        expect(scriptData.fullMessage).to.be.a('string');
        expect(scriptData.fullMessage).to.equal('Attempt 1: Linux Shell > Bash > Compute the Average');
        done();
      });
    });
  });
});
