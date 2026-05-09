import i18n from '../utils/language';

export class Logger {

  static logs = [];
  static maxLogs = 200;

  // 内部自动翻译
  static translate(key, params = {}) {
    return i18n.t(key, params);
  }

  static info(message, params = {}) {
    this.addLog(message, params, false);
  }

  static error(message, params = {}) {
    console.log("error: " + message);
    this.addLog(message, params, true);
  }

  static addLog(message, params = {}, isError = false) {
    const time = new Date().toLocaleTimeString();
    this.logs = [{ time, msg: message, params: params, isError }, ...this.logs].slice(0, this.maxLogs);
  }

  static all() {
    return this.logs;
  }

  /** 清空日志 */
  static clear() {
    this.logs = [];
  }
}