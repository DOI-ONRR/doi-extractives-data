/*
 * This is a shorthand for yargs().describe(...) that uses
 * a configuration object instead of function calls, and
 * automatically handles the --help/-h case. Usage:
 *
 * var argv = require('./lib/args')({
 *   usage: '$0 [options] blah',
 *   o: {
 *     desc: 'Write output to this file',
 *     default: '/dev/stdout'
 *   },
 *   f: {
 *     desc: 'force it to do something',
 *     bool: true
 *   }
 * });
 */
module.exports = function(options) {
  var yargs = require('yargs');

  if (options.usage) {
    yargs.usage(options.usage);
    delete options.usage;
  }

  if (options.wrap) {
    yargs.wrap(options.wrap);
    delete options.wrap;
  }

  if (options) {
    for (var key in options) {
      var opt = options[key];
      if (typeof opt === 'object') {
        yargs
        yargs.describe(key, opt.desc || opt.help);

        if (opt.default) {
          yargs.default(key, opt.default || opt.def);
        }

        if (opt.type) {
          yargs[opt.type](key);
        } else if (opt.boolean) {
          yargs.boolean(key);
        }

        if (Array.isArray(opt.alias)) {
          opt.alias.forEach(function(k) {
            yargs.alias(k, key);
          });
        } else if (opt.alias) {
          yargs.alias(opt.alias, key);
        }
      } else {
        yargs.describe(key, opt);
      }
    }
  }
  
  var argv = yargs
    .alias('h', 'help')
    .argv;

  if (argv.help) {
    yargs.showHelp();
    return process.exit(1);
  }

  return argv;
};
