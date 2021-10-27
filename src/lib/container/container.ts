export const DITypes = {
  uploader: 'uploader',
  formatter: 'formatter',
  detector: 'detector',
  client: 'client',
  parser: 'parser',
  formatService: 'formatService',
  latexService: 'latexService',
} as const;

export type Constr<T> = new (...args: unknown[]) => T;
export type Dependency<T = unknown> = Constr<T>;
export class Container {
  private readonly _deps: Record<string, unknown> = {};

  getDependencies() {
    return this._deps;
  }

  set<T>(dep: T, key?: string) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    key ??= (dep as unknown as Function)?.name;
    if (this._deps[key]) {
      throw new Error(`${key} already exists in the container`);
    }

    this._deps[key] = dep;
  }

  get<T>(dep: Dependency<T>, key?: string): T {
    key ??= dep.name;
    const dependency = this._deps[key];

    if (!dependency) {
      throw new Error(`${key} does not exist in the container.`);
    }

    return dependency as T;
  }

  getByKey<T>(key: keyof typeof DITypes): T {
    const dependency = this._deps[key];

    if (!dependency) {
      throw new Error(`${key} does not exist in the container.`);
    }

    return dependency as T;
  }
}
