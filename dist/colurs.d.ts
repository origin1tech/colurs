import { IColurs, IColursInstance, IColurOptions } from './interfaces';
declare function createInstance(options?: IColurOptions): IColurs;
declare const Colurs: IColursInstance & IColurs;
export { createInstance as get, Colurs };
