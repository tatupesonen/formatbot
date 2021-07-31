export class CouldNotFormatError extends Error {
  constructor(m: string) {
    super(m);
    this.name = 'CouldNotFormatError';
  }
}
