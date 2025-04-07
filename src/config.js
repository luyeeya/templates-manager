import { homedir } from 'os';
import path from 'path';
import fs from 'fs-extra';

const configDir = path.join(homedir(), '.templates-manager');
const defaultConfig = {
  centralRepo: 'git@github.com:luyeeya/templates.git',
  cacheDir: path.join(configDir, 'cache'),
  metaDir: path.join(configDir, 'meta')
};

// 加载配置文件
export const loadConfig = () => {
  const configPath = path.join(configDir, 'config.json');
  
  if (!fs.existsSync(configDir)) {
    fs.mkdirpSync(configDir);
    fs.writeJsonSync(configPath, defaultConfig);
  }
  
  return fs.readJsonSync(configPath);
};

// 获取临时目录
export const getTempDir = () => {
  return path.join(configDir, 'temp', `tmp_${Date.now()}`);
};