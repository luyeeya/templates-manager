import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { cloneCentralRepo } from '../git-utils.js';

export default () => {
  const command = new Command('new')
    .description('创建新项目')
    .argument('<projectName>', '项目名称')
    .option('-t, --template <name>', '模板名称')
    .action(async (projectName, options) => {
      console.log(`正在创建项目: ${projectName}`);
      const tempDir = await cloneCentralRepo();

      const templatePath = path.join(tempDir, options.template);
      if (!fs.existsSync(templatePath)) {
        console.error(chalk.red(`模板 ${options.template} 不存在`));
        process.exit(1);
      }

      fs.copySync(templatePath, path.resolve(projectName));
      fs.removeSync(tempDir);

      console.log(chalk.green.bold(`✓ 项目 ${projectName} 创建成功！`));
    });

  return command;
};