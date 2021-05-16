/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         npm-release.js
 * Last modified:     18/03/2021, 16:08
 ******************************************************************************/
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const target = process.argv[2];

function command() {
  const file = fs.readFileSync(path.join(__dirname, '../../workspace.json'));
  const ws = JSON.parse(file.toString());
  const rootProjects = ws.projects || {};

  if (!rootProjects) {
    return;
  }

  try {
    shell.exec(`rm -rf dist`);
  } catch (e) {
    //
  }

  // Build
  for (let key in rootProjects) {
    const value = rootProjects[key];
    if (value.projectType === 'library') {
      shell.exec(`nx run ${key}:build --with-deps`);
    }
  }

  // Publish
  for (let key in rootProjects) {
    const value = rootProjects[key];
    if (value.projectType === 'library' && key !== 'gateway') {
      shell.exec(`cd dist/libs/${key} && npm publish --access public`);
      shell.exec('cd ../../../');
    }
  }
}

command();