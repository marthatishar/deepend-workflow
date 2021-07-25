const { join } = require('path');
const { readdirSync, statSync, readFileSync } = require('fs');
const {mkdirSync, writeFileSync, readFile, promises} = require('fs');
const {execSync} = require('child_process');

try {


  mkdirSync('./deependRepos/dep', { recursive: true });
  mkdirSync('./deependRepos/dev', { recursive: true });
  
  const getAllFiles = (dir, extn, files, result, regex) => {
      files = files || readdirSync(dir);
      result = result || [];
      regex = regex || new RegExp(`\\${extn}$`)
  
      for (let i = 0; i < files.length; i++) {
          let file = join(dir, files[i]);
          if (statSync(file).isDirectory()) {
              try {
                  result = getAllFiles(file, extn, readdirSync(file), result, regex);
              } catch (error) {
                  continue;
              }
          } else {
              if (regex.test(file) && !file.includes('deependRepos')) {
                  result.push(file);
              }
          }
      }
      return result;
  }
  
  const makeDirectories = async (file) => {
    console.log(file);
    const depExtension = './deependRepos/dep/' + file;
    const devExtension = './deependRepos/dev/' + file;

    readFile(file, (err, data) => {
      if (err) throw err;
      const dep = JSON.parse(data);
      const dev = JSON.parse(data);
      if(dev['dependencies']){
        dev['dependencies'] = {}
      }
      if(dep['devDependencies']){
        dep['devDependencies'] = {}
      }
      writeFileSync(depExtension, JSON.stringify(dep), (err) => {
        if (err) throw err;
        });
      writeFileSync(devExtension, JSON.stringify(dev), (err) => {
      if (err) throw err;
      });
    });
  }
  
  
  const result = getAllFiles('./', 'package.json');
  
  
  result.map(makeDirectories);
  
  
  
  const yarn = readFileSync('yarn.lock');
  writeFileSync('./deependRepos/dev/yarn.lock', yarn, (err) => {
    if (err) throw err;
  });
  writeFileSync('./deependRepos/dep/yarn.lock', yarn, (err) => {
    if (err) throw err;
  });
  
} catch (error) {
  // core.setFailed(error.message);
  console.log(error);
}