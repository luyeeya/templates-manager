import fs from 'fs-extra';
import path from 'path';
import { loadConfig } from './config.js';

// 加载指定模板的元数据
export const loadTemplateMeta = (repoPath, template) => {
  const metaFile = path.join(repoPath, '.meta', `${template}.json`);
  return fs.existsSync(metaFile) ? fs.readJsonSync(metaFile) : null;
};

// 保存指定模板的元数据
export const saveTemplateMeta = (repoPath, template, meta) => {
  const metaDir = path.join(repoPath, '.meta');
  const metaFile = path.join(metaDir, `${template}.json`);
  
  fs.ensureDirSync(metaDir);
  fs.writeJsonSync(metaFile, {
    ...meta,
    updated: new Date().toISOString()
  });
};

// 获取所有模板的元数据
export const getAllMetas = (repoPath) => {
  const metaDir = path.join(repoPath, '.meta');
  if (!fs.existsSync(metaDir)) return [];
  
  return fs.readdirSync(metaDir)
    .filter(f => f.endsWith('.json'))
    .map(f => fs.readJsonSync(path.join(metaDir, f)));
};