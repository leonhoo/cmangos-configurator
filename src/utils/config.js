import yaml from 'js-yaml';
import { Logger } from './logger';

// 支持的所有配置文件
export const CONFIG_TYPES = {
  mangosd: 'mangosd.conf',
  realmd: 'realmd.conf',
  ahbot: 'ahbot.conf',
  anticheat: 'anticheat.conf'
};

// 动态加载对应语言的 YAML
export async function loadConfig(lang = 'en', type = 'mangosd') {
  const fileName = CONFIG_TYPES[type];
  try {
    const module = await import(`../assets/${lang}/${fileName}.yaml?raw`);
    const raw = module.default;
    const groups = yaml.load(raw);

    // 转成页面可用结构：带 group + desc
    return groups.map(g => ({
      name: g.name,
      type: type,
      items: g.items.map(it => ({
        key: it.key,
        value: it.value,
        desc: it.desc,
        group: g.name,
        type: type
      }))
    }));
  } catch (e) {
    Logger.error('loadFail');
    console.error('加载配置失败', e);
    return [];
  }
}

// 导出配置文本
export function exportConfig(groupedConfig) {
  return groupedConfig
    .flatMap(g => g.items)
    .map(it => `${it.key}=${it.value}`)
    .join('\n');
}

// 解析导入的 conf
export function parseImportedConfig(text) {
  const result = {};
  text.split('\n').forEach(line => {
    const trim = line.trim();
    if (!trim || trim.startsWith('#')) return;
    const [k, ...v] = trim.split('=');
    if (k) result[k.trim()] = v.join('=').trim();
  });
  return result;
}

// 合并导入值到当前配置
export function mergeImported(groupedConfig, imported) {
  const copy = JSON.parse(JSON.stringify(groupedConfig));
  copy.forEach(g => {
    g.items.forEach(it => {
      if (imported[it.key]) it.value = imported[it.key];
    });
  });
  return copy;
}

/**
 * 
 * @param {Array} transformToGroup - 分组配置数组
 * @returns {Object}
 */
export function transformToGroupObject(groups, transformToGroup) {
  // 将分组配置数组 => 分组对象 { 分组名: { key: value } }
  const transformed = {};
  transformToGroup.forEach(group => {
    const groupName = group.name;
    transformed[groupName] = {};

    group.items.forEach(item => {
      transformed[groupName][item.key] = item.value;
    });
  });

  // 将原值合并到新配置中，保留修改的值
  const merged = JSON.parse(JSON.stringify(groups));
  merged.forEach(item => {
    item.items.forEach(it => {
      if (Object.prototype.hasOwnProperty.call(transformed, item.name) && Object.prototype.hasOwnProperty.call(transformed[item.name], it.key)) {
        it.value = transformed[item.name][it.key];
      }
    });
  });
  return merged;
} 