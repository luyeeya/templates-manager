#!/usr/bin/env node
import { program } from 'commander';
import addCommand from '../src/commands/add.js';
import newCommand from '../src/commands/new.js';
import listCommand from '../src/commands/list.js';
import infoCommand from '../src/commands/info.js';
import removeCommand from '../src/commands/remove.js';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

program
  .version('1.0.0')
  .description('Templates Manager')
  .addCommand(addCommand())
  .addCommand(newCommand())
  .addCommand(listCommand())
  .addCommand(infoCommand())
  .addCommand(removeCommand())
  .parse(process.argv);