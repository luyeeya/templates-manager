import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import { loadTemplateMeta } from '../meta.js';
import { cloneCentralRepo } from '../git-utils.js';

export default () => {
  const command = new Command('info')
    .description('显示模板详细信息')
    .argument('<name>', '模板名称')
    .action(async (name) => {
      const tempDir = await cloneCentralRepo();
      const meta = loadTemplateMeta(tempDir, name);

      if (!meta) {
        console.error(chalk.red(`模板 ${name} 不存在`));
        return;
      }

      console.log(chalk.cyan.bold(`模板：${meta.name}`));
      console.log(`描述：${meta.description}`);
      console.log(`创建时间：${new Date(meta.created).toLocaleString()}`);
      console.log(`最后更新：${new Date(meta.updated).toLocaleString()}`);

      fs.removeSync(tempDir);
    });

  return command;
};