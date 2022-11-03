import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';

export const enum LogLevel {
  ERROR = 5,
  DEBUG = 4,
  WARN = 3,
  INFO = 2,
  TRACE = 1,
}

type LogFn = (...params: unknown[]) => void;

export type Logger = {
  error: LogFn;
  debug: LogFn;
  warn: LogFn;
  info: LogFn;
  trace: LogFn;
};

/**
 * Made this out of annoyance at the lack of typescript/electron logging
 * libs which don't cause instant npm errors. Feel free to replace.
 */
export class BasicLogger implements Logger {
  private level: LogLevel;
  constructor() {
    // TODO: make this changeable in user preferences
    this.level = LogLevel.INFO;
  }

  error(...params: unknown[]) {
    params.forEach((param) => this.log(param, LogLevel.ERROR));
  }

  debug(...params: unknown[]) {
    params.forEach((param) => this.log(param, LogLevel.DEBUG));
  }

  warn(...params: unknown[]) {
    params.forEach((param) => this.log(param, LogLevel.WARN));
  }

  info(...params: unknown[]) {
    params.forEach((param) => this.log(param, LogLevel.INFO));
  }

  trace(...params: unknown[]) {
    params.forEach((param) => this.log(param, LogLevel.TRACE));
  }

  private log(param: unknown, level: LogLevel) {
    if (level >= this.level) {
      console.log(`${this.printLogLevelName(level)}: ${param}`);
    }
  }

  printLogLevelName(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
        return 'ERROR';
      case LogLevel.DEBUG:
        return 'DEBUG';
      case LogLevel.WARN:
        return 'WARN';
      case LogLevel.INFO:
        return 'INFO';
      case LogLevel.TRACE:
        return 'TRACE';
      default:
        throw new ExhaustivenessFailureError(level);
    }
  }
}
