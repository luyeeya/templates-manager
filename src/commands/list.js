import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import { getAllMetas } from '../meta.js';
import { cloneCentralRepo } from '../git-utils.js';

export default () => {
    const command = new Command('list')
        .description('列出所有模板')
        .option('-v, --verbose', '显示所有模板信息')
        .action(async (options) => {
            const tempDir = await cloneCentralRepo();
            const metas = getAllMetas(tempDir);
            if (metas.length === 0) {
                console.log('[]');
                fs.removeSync(tempDir);
                return;
            }

            if (options.verbose) {
                console.log(chalk.cyan.bold('模板列表：'));
                metas.forEach(meta => {
                    console.log(`${chalk.green(meta.name)}`);
                    console.log(`描述：${meta.description}`);
                    console.log(`更新：${new Date(meta.updated).toLocaleDateString()}`);
                    console.log('--------------------------------');
                });
            } else {
                console.log(chalk.cyan.bold('模板列表：'));
                metas.forEach(meta => {
                    console.log(`• ${chalk.green(meta.name)} - ${meta.description}`);
                });
            }

            fs.removeSync(tempDir);
        });

    return command;
};