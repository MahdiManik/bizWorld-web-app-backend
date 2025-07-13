// Minimal declaration file for minimatch
declare module 'minimatch' {
  function minimatch(filename: string, pattern: string, options?: minimatch.IOptions): boolean;

  namespace minimatch {
    interface IOptions {
      debug?: boolean;
      nobrace?: boolean;
      noglobstar?: boolean;
      dot?: boolean;
      noext?: boolean;
      nocase?: boolean;
      nonull?: boolean;
      matchBase?: boolean;
      nocomment?: boolean;
      escape?: boolean;
      noquantifiers?: boolean;
      pathname?: boolean;
      flipNegate?: boolean;
      partial?: boolean;
      [key: string]: any;
    }

    class Minimatch {
      constructor(pattern: string, options?: IOptions);
      match(filename: string): boolean;
      matchOne(file: string[], pattern: string[]): boolean;
    }

    function filter(pattern: string, options?: IOptions): (filename: string) => boolean;
    function makeRe(pattern: string, options?: IOptions): RegExp | false;
  }

  export = minimatch;
}
