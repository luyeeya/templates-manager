import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { cloneCentralRepo, pushChanges } from '../git-utils.js';
import { saveTemplateMeta } from '../meta.js';

export default () => {
  const command = new Command('add')
    .description('添加当前目录为模板')
    .argument('<name>', '模板名称')
    .option('-d, --desc <description>', '模板描述')
    .action(async (name, options) => {
      console.log(`正在添加模板: ${name}`);
      const tempDir = await cloneCentralRepo();

      // 复制文件
      const targetDir = path.join(tempDir, name);
      fs.emptyDirSync(targetDir);
      fs.copySync(process.cwd(), targetDir, {
        filter: src => !src.includes('.git') && !src.includes('node_modules')
      });

      // 收集元数据
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'description',
          message: '模板描述：',
          when: !options.desc,
          validate: input => !!input.trim()
        }
      ]);

      // 保存元数据
      saveTemplateMeta(tempDir, name, {
        name,
        description: options.desc || answers.description,
        created: new Date().toISOString()
      });

      // 推送更新
      await pushChanges(tempDir);
      fs.removeSync(tempDir);

      console.log(chalk.green.bold(`✓ 模板 ${name} 添加成功！`));
    });

  return command;
};