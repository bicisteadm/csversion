module.exports = function (args) {
  var fs = args.fs;
  var log = args.log;
  var argv = require('minimist')(args.argv.slice(2));
  var path = require('path');
  var readline = require('readline');

  log.runner = 'csversion';

  var csprojPath = argv._[0] || argv.cs;
  var csProjDir = path.dirname(csprojPath);
  var versionFile = argv._[1] || argv.vf || 'version.txt';
  var buildCommonFile = 'BuildCommon.targets';

  function createVersionFile() {
    log.info('\nCreating ' + versionFile + ' in ' + csProjDir);

    if (fs.existsSync(csProjDir + '/' + versionFile)) {
      log.warn('[SKIPPED]');
    }
    else {
      var version = argv._[2] || argv.v || '0.1.0';
      fs.writeFileSync(csProjDir + '/' + versionFile, version);
      log.success('[DONE]');
    }
  }

  function copyBuildCommon() {
    log.info('\nCopying ' + buildCommonFile + ' to ' + process.cwd() + '\\build');

    if (fs.existsSync('build/' + buildCommonFile)) {
      log.warn('[SKIPPED]');
    }
    else {
      var buildCommonSourcePath = __dirname + '/../targets/' + buildCommonFile;
      var buildCommonContent = fs.readFileSync(buildCommonSourcePath, 'utf8');
      buildCommonContent = buildCommonContent.replace("{versionFile}", versionFile);
      if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
      }
      fs.writeFileSync('build/' + buildCommonFile, buildCommonContent);
      log.success('[DONE]');
    }
  }

  function addTargetsReference() {
    log.info('\nAdding targets reference to project file ' + csprojPath);

    var pattern = /\n\<\/Project\>/;
    var importBuildCommonTag = '<Import Project="..\\..\\build\\' + buildCommonFile + '" />';
    var csprojContent = fs.readFileSync(csprojPath, 'utf8');

    if (csprojContent.indexOf(importBuildCommonTag) > -1) {
      log.warn('[SKIPPED]');
    }
    else {
      csprojContent = csprojContent.replace(pattern, '  ' + importBuildCommonTag + '\n</Project>')
      fs.writeFileSync(csprojPath, csprojContent);
      log.success('[DONE]');
    }
  }

  function commentOutVersionAttributes() {
    log.info('\nCommenting out version related attributes from ' + csProjDir + '\\Properties\\AssemblyInfo.cs');

    var readLine = readline.createInterface({
      input: fs.createReadStream(csProjDir + '/Properties/AssemblyInfo.cs'),
      output: null
    });

    var versionAttributeRegex = /\[[ ]{0,}assembly:[ ]{0,}Assembly((File|Informational){0,1})*Version[ ]{0,}\("[\w.*-]+"\)[ ]{0,}\]/;
    var commentRegex = /\/\//;
    var assemblyInfoContent = '';

    readLine.on('line', function (line) {
      if (versionAttributeRegex.test(line)) {
        log.info('\nCommenting out: ' + line);
        if (commentRegex.test(line)) {
          log.warn('[SKIPPED]');
        }
        else {
          line = '// ' + line;
          log.success('[DONE]');
        }
      }
      assemblyInfoContent += line + '\n';
    });

    readLine.on('close', function () {
      fs.writeFileSync(csProjDir + '/Properties/AssemblyInfo.cs', assemblyInfoContent);
      log.success('\n\n[FINISHED]');
    });
  }

  return {
    createVersionFile: createVersionFile,
    copyBuildCommon: copyBuildCommon,
    addTargetsReference: addTargetsReference,
    commentOutVersionAttributes: commentOutVersionAttributes
  };
}