var child_process = require('child_process');
var chokidar = require('chokidar')

// Run the given command with the given args in the given directory.
//
// Returns a Promise that resolves once the command is finished, or
// rejects if the process errored or exited with a non-zero status code.
function run(cwd, command, args) {
  var cmdline = `${cwd}/${command} ${args.join(' ')}`;
  return new Promise((resolve, reject) => {
    console.log(`Running ${cmdline}.`);
    const child = child_process.spawn(command, args, {
      cwd: cwd,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(`${cmdline} exited with code ${code}!`);
      }
    });
  });
}

function runJekyll() {
  return run('/doi', 'jekyll', ['build', '--incremental'])
}

// Make it easy for Docker to terminate us.
process.on('SIGTERM', () => {
  // TODO: Consider waiting for children and/or terminating them.
  process.exit(0);
});

var opts =  {
  ignored: /(^|[\/\\])\..|_site|node_modules|sass|css|img|js|nrrd-design-system|styleguide|test/,
  usePolling: true
}

var watcher = chokidar.watch('/doi', opts)

runJekyll().catch(e => console.error(e))
watcher.on('change', (path, event) => {
  console.log(`Change recognized: ${path}`)
  runJekyll().catch(e => console.error(e))
})
