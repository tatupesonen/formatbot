import { Container } from '../container/container';
import { logger } from '../util/logger';

const DISCORD_BG_COLOR = '36393F';

export class LaTeXService {
  //@ts-expect-error We might use this container later.
  constructor(private readonly container: Container) {}

  public async format(texContent: string): Promise<string> {
    const encodedTexContent = encodeURIComponent(texContent);

    const url = `https://chart.apis.google.com/chart?cht=tx&chs=60&chf=bg,s,${DISCORD_BG_COLOR}&chco=FFFFFF&chl=${encodedTexContent}`;
    logger.debug(`Requesting ${url}...`);
    return url;
  }
}
