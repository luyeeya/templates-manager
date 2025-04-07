import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { cloneCentralRepo, pushChanges } from '../git-utils.js';

export default () => {
  const command = new Command('remove')
    .description('删除指定模板')
    .argument('<name>', '模板名称')
    .action(async (template) => {
      try {
        // 1. 克隆中央仓库到临时目录
        const tempDir = await cloneCentralRepo();

        // 2. 验证模板是否存在
        const templatePath = path.join(tempDir, template);
        const metaPath = path.join(tempDir, '.meta', `${template}.json`);

        if (!fs.existsSync(templatePath)) {
          console.error(chalk.red(`错误：模板 ${template} 不存在`));
          fs.removeSync(tempDir);
          process.exit(1);
        }

        // 3. 确认删除
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `确定要删除模板 ${chalk.yellow(template)} 吗？此操作不可恢复！`,
            default: false
          }
        ]);

        if (!confirm) {
          console.log(chalk.yellow('已取消删除操作'));
          fs.removeSync(tempDir);
          return;
        }

        // 4. 执行删除操作
        console.log(chalk.blue('开始删除模板...'));

        // 删除模板目录
        fs.removeSync(templatePath);
        console.log(chalk.green(`✓ 删除模板目录: ${template}`));

        // 删除元数据文件
        if (fs.existsSync(metaPath)) {
          fs.removeSync(metaPath);
          console.log(chalk.green(`✓ 删除元数据文件: ${path.basename(metaPath)}`));
        }

        // 5. 提交并推送变更
        await pushChanges(tempDir);
        console.log(chalk.green.bold('✔ 模板删除完成！'));

        // 6. 清理临时目录
        fs.removeSync(tempDir);

      } catch (error) {
        console.error(chalk.red('删除过程中发生错误：'));
        console.error(error);
        process.exit(1);
      }
    });

  return command;
};