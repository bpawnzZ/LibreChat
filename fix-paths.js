const fs = require('fs');
const path = require('path');

function fixPaths(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  // Map of path aliases to their relative paths
  const pathMappings = {
    '~/server': '../server',
    '~/models': '../models',
    '~/config': '../config',
    '~/cache': '../cache',
    '~/app': '../app',
    '~/lib': '../lib',
    '~/utils': '../utils',
    '~/data': '../data',
    '~/strategies': '../strategies'
  };

  // For each file, calculate the correct relative path based on its location
  Object.entries(pathMappings).forEach(([alias, defaultPath]) => {
    const relativePath = path.relative(
      path.dirname(filePath),
      path.resolve('api', alias.replace('~/', ''))
    ).replace(/\\/g, '/');

    // Replace both require and import statements
    newContent = newContent.replace(
      new RegExp(`require\\(['"]${alias}(/[^'"]*)?['"]\\)`, 'g'),
      (match, subPath = '') => `require('${relativePath}${subPath}')`
    );
    newContent = newContent.replace(
      new RegExp(`from ['"]${alias}(/[^'"]*)?['"]`, 'g'),
      (match, subPath = '') => `from '${relativePath}${subPath}'`
    );
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed paths in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
      fixPaths(filePath);
    }
  });
}

// Directories to process
const directories = [
  'api/server',
  'api/models',
  'api/cache',
  'api/app',
  'api/lib',
  'api/utils',
  'api/strategies',
  'api/config'
];

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir);
  } else {
    console.log(`Directory not found: ${dir}`);
  }
});
