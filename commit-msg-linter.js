// commit-msg-linter.js
const fs = require('fs');

const message = fs.readFileSync(process.argv[2], 'utf-8').trim();

const pattern = /^(feat|fix|docs|style|refactor|test|bugfix|other): (.*)$/;

if (!pattern.test(message)) {
  console.error('Error: Commit message does not match the required pattern.');
  console.error('Commit messages must start with \'feat:\', \'refactor:\', \'test:\', or \'bugfix:\' followed by a space and a message.');
  process.exit(1);
}
