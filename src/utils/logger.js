import i18n from '../utils/language';

export class Logger {

  static logs = [];
  static maxLogs = 200;

  // 内部自动翻译
  static translate(key, params = {}) {
    return i18n.t(key, params);
  }

  static info(message, params = {}) {
    this.addLog(message, params, null);
  }

  static error(message, params = {}, errorMessage) {
    this.addLog(message, params, errorMessage);
  }

  static addLog(message, params = {}, errorMessage) {
    const time = new Date().toLocaleTimeString();
    this.logs = [{ time, msg: message, params: params, errorMessage }, ...this.logs].slice(0, this.maxLogs);
  }

  static all() {
    return this.logs;
  }

  /** 清空日志 */
  static clear() {
    this.logs = [];
  }
}