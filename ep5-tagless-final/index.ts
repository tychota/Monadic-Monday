// Thread here https://twitter.com/YuriyBogomolov/status/1122892243596140545
// by https://twitter.com/YuriyBogomolov
import { Type, URIS } from 'fp-ts/lib/HKT';

// In TypeScript we don't have proper support for higher-kinded types,
// so we need to use some hacks. So we start with defining an "HKT"
// synonym which will adhere to Functor and Monad interfaces.

export interface ProgramSyntax<F extends URIS, A> {
  // A functor have a map
  map: <B>(f: (a: A) => B) => _<F, B>;
  // And a monad have a chain
  chain: <B>(f: (a: A) => _<F, B>) => _<F, B>;
}

export type _<F extends URIS, A> = Type<F, A> & ProgramSyntax<F, A>;

// Next we'll define a few algebras – sets of operations of type `A => F A`,
// which will be building blocks of our eDSL – i.e., expressions we can use
// to build the final program.

export interface Program<F extends URIS> {
  /** Exit the program with some message or code
   */
  terminate: <A>(a: A) => _<F, A>;
}

export interface Console<F extends URIS> {
  /** Print a line of some kind of console
   */
  print: (message: string) => _<F, void>;
  /** Read a line from console
   */
  read: _<F, string>;
}

export interface Random<F extends URIS> {
  /** Get a reandom number in [0, upper) bounds
   */
  nextInt: (upper: number) => _<F, number>;
}

export type Main<F extends URIS> = Program<F> & Console<F> & Random<F>;

//I would like to split the program's logic in small functions to show
// the core idea of TF style: you can "summon" only those parts of
// functionality you really use!

const generateRandom = <F extends URIS>(F: Program<F> & Random<F>) => (
  upper: number
) => F.nextInt(upper);

const getUpperStr = <F extends URIS>(F: Program<F> & Console<F>) =>
  F.print('Enter random upper bound:').chain(() => F.read);
