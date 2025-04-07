import { execa } from 'execa';
import { loadConfig, getTempDir } from './config.js';

// 克隆模板仓库
export const cloneCentralRepo = async () => {
  const config = loadConfig();
  const tempDir = getTempDir();
  
  await execa('git', [
    'clone',
    '--depth=1',
    config.centralRepo,
    tempDir
  ]);
  
  return tempDir;
};

// 更新模板
export const pushChanges = async (repoPath) => {
  // 显式添加元数据目录
  await execa('git', ['add', '.meta'], { cwd: repoPath });
  
  // 添加常规文件
  await execa('git', ['add', '.'], { cwd: repoPath });
  
  // 检查是否有变更需要提交
  const { stdout: status } = await execa('git', ['status', '--porcelain'], { cwd: repoPath });
  
  if (status) {
    await execa('git', ['commit', '-m', 'Update template'], { cwd: repoPath });
    await execa('git', ['push', '-f', 'origin', 'main'], { cwd: repoPath });
  } else {
    console.log(chalk.yellow('没有检测到文件变更，跳过提交'));
  }
};