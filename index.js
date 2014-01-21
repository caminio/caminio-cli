#!/usr/bin/env node

var program     = require('commander')
  , pkg         = require('./package')

var project     = require('./lib/project')
  , gear        = require('./lib/gear')
  , generator   = require('./lib/generator');

program
  .version(pkg.version)

program
  .option('gear <name>', 'Create a new caminio gear' )
  .option('--no-api', 'Skip api creation for gear')
  .on( 'gear', gear.create );

program
  .option('project <name>', 'Create a new caminio project' )
  .on( 'project', project.create );

program
  .option('controller <name>', 'Generate a controller named <name>')
  .on('controller', generator.controller )

program
  .option('model <name>', 'Generate a model named <name>')
  .on('model', generator.model )

program.parse(process.argv);