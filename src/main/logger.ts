import pc from 'picocolors';

/** 태그별 색상 (Vite 스타일) */
const TAG_COLORS: Record<string, (s: string) => string> = {
  Hono: pc.cyan,
  db: pc.yellow,
  API: pc.magenta,
  main: pc.green,
  electron: pc.blue,
};

function getTagStyle(tag: string): (s: string) => string {
  return TAG_COLORS[tag] ?? pc.white;
}

function formatTime(): string {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  return pc.dim(`${h}:${m}:${s}`);
}

function formatTag(tag: string): string {
  return pc.bold(getTagStyle(tag)(`[${tag}]`));
}

/**
 * 메인 프로세스용 예쁜 로그 (Vite 스타일).
 * 태그는 색상으로, 시간은 dim으로 출력합니다.
 */
export const logger = {
  log(tag: string, ...args: unknown[]): void {
    console.log(`${formatTime()} ${formatTag(tag)}`, ...args);
  },

  warn(tag: string, ...args: unknown[]): void {
    console.warn(`${formatTime()} ${pc.bold(pc.yellow(`[${tag}]`))}`, ...args);
  },

  error(tag: string, ...args: unknown[]): void {
    console.error(`${formatTime()} ${pc.bold(pc.red(`[${tag}]`))}`, ...args);
  },
};

/**
 * 고정 태그로 로거를 만듭니다.
 * 예: createTaggedLogger('Hono') -> log('Listening...')
 */
export function createTaggedLogger(tag: string): typeof logger {
  return {
    log: (...args: unknown[]) => logger.log(tag, ...args),
    warn: (...args: unknown[]) => logger.warn(tag, ...args),
    error: (...args: unknown[]) => logger.error(tag, ...args),
  };
}
