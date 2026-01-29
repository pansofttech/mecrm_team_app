const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const angularJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../angular.json'), 'utf8')
);

const projectName = angularJson.defaultProject;
const outputPath =
  angularJson.projects[projectName].architect.build.options.outputPath;

const dist = path.join(__dirname, '..', outputPath);

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(dist);

// Only obfuscate app code >>> main.*.js and common.*.js
const SAFE_PATTERNS = [/main\..*\.js$/, /common\..*\.js$/];

files.forEach(file => {
  const fileName = path.basename(file);

  // Skip vendor & runtime & polyfills
  if (!SAFE_PATTERNS.some(regex => regex.test(fileName))) {
    console.log("Skipping:", fileName);
    return;
  }

  console.log("Obfuscating:", fileName);

  const code = fs.readFileSync(file, 'utf8');
  const obfuscated = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: false,   // <— IMPORTANT
    deadCodeInjection: false,       // <— IMPORTANT
    identifierNamesGenerator: 'hexadecimal',
    stringArray: true,
    stringArrayThreshold: 0.8
  }).getObfuscatedCode();

  fs.writeFileSync(file, obfuscated, 'utf8');
});
