import { ExecutionResult, LogEntry } from '../types';

export function runJavaScriptCode(code: string): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const logs: LogEntry[] = [];
    const startTime = performance.now();

    const formatValue = (val: any): string => {
      if (val === undefined) return 'undefined';
      if (val === null) return 'null';
      if (typeof val === 'symbol') return val.toString();
      if (typeof val === 'function') return val.toString();
      if (typeof val === 'bigint') return `${val}n`;
      if (val instanceof Error) return `${val.name}: ${val.message}`;
      if (Number.isNaN(val)) return 'NaN';
      if (val === Infinity) return 'Infinity';
      if (val === -Infinity) return '-Infinity';
      if (Object.is(val, -0)) return '-0';
      if (typeof val === 'object') {
        try {
          return JSON.stringify(val, (k, v) => {
            if (typeof v === 'bigint') return `${v}n`;
            if (typeof v === 'undefined') return 'undefined';
            if (typeof v === 'function') return v.name ? `[Function: ${v.name}]` : '[Function]';
            if (Number.isNaN(v)) return 'NaN';
            if (v === Infinity) return 'Infinity';
            if (v === -Infinity) return '-Infinity';
            return v;
          }, 2);
        } catch (e) {
          return Object.prototype.toString.call(val);
        }
      }
      return String(val);
    };

    const customConsole = {
      log: (...args: any[]) => {
        logs.push({
          type: 'log',
          content: args.map(formatValue).join(' '),
          timestamp: performance.now() - startTime,
        });
      },
      info: (...args: any[]) => {
        logs.push({
          type: 'info',
          content: args.map(formatValue).join(' '),
          timestamp: performance.now() - startTime,
        });
      },
      warn: (...args: any[]) => {
        logs.push({
          type: 'warn',
          content: args.map(formatValue).join(' '),
          timestamp: performance.now() - startTime,
        });
      },
      error: (...args: any[]) => {
        logs.push({
          type: 'error',
          content: args.map(formatValue).join(' '),
          timestamp: performance.now() - startTime,
        });
      }
    };

    try {
      // Create a function context with sandboxed console
      // Using AsyncFunction or standard Function wrapper
      const wrapped = new Function(
        'console',
        `
        try {
          ${code.trim().startsWith('return ') ? code : `${code}`}
        } catch (err) {
          console.error(err);
          throw err;
        }
        `
      );

      const result = wrapped(customConsole);

      if (result instanceof Promise) {
        // If async, wait with 2000ms max timeout
        const timeout = setTimeout(() => {
          resolve({
            logs,
            returnValue: '[Promise pending/timeout]',
            executionTimeMs: Math.round(performance.now() - startTime),
          });
        }, 2000);

        result
          .then((val) => {
            clearTimeout(timeout);
            resolve({
              logs,
              returnValue: val !== undefined ? formatValue(val) : undefined,
              executionTimeMs: Math.round(performance.now() - startTime),
            });
          })
          .catch((err) => {
            clearTimeout(timeout);
            resolve({
              logs,
              error: err instanceof Error ? err.message : String(err),
              executionTimeMs: Math.round(performance.now() - startTime),
            });
          });
      } else {
        resolve({
          logs,
          returnValue: result !== undefined ? formatValue(result) : undefined,
          executionTimeMs: Math.round(performance.now() - startTime),
        });
      }
    } catch (err: any) {
      resolve({
        logs,
        error: err instanceof Error ? err.message : String(err),
        executionTimeMs: Math.round(performance.now() - startTime),
      });
    }
  });
}
