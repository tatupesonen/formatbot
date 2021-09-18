import { Container } from '../../../src/lib/container/container';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FakeDep {}
export class Dep implements FakeDep {}

const key = 'Dep';

describe('container', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  test('is defined', () => {
    expect(container).toBeDefined();
  });

  test('can insert Dependency', () => {
    container.set<FakeDep>(Dep, key);

    expect(container.getDependencies()).toHaveProperty(key);
  });

  describe('when getting a dependency', () => {
    test('then can get by constructor name', () => {
      container.set<FakeDep>(Dep);
      expect(container.get<FakeDep>(Dep)).toBe(Dep);
    });

    test('then cannot insert duplicate Dependency', () => {
      container.set<FakeDep>(Dep, key);

      expect(() => container.set<FakeDep>(Dep, key)).toThrowError(
        'Dep already exists in the container'
      );
    });
  });

  describe('when getting a Dependency by key', () => {
    test('then we do not receive a Dependency when it does not exist', () => {
      container.set<FakeDep>(Dep, key);
      expect(() => container.getByKey<FakeDep>('client')).toThrow();
    });

    test('then we receive a Dependency', () => {
      container.set<FakeDep>(Dep);

      expect(container.getByKey<FakeDep>(key as any)).toBe(Dep);
    });
  });
});
