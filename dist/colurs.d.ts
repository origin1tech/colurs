import './extens';
import { IColurs, IColursInstance, IColurOptions } from './interfaces';
declare function createInstance(options?: IColurOptions): IColurs;
declare const Colurs: IColursInstance & IColurs;
declare const get: (options?: IColurOptions) => IColurs;
export { get, createInstance as init, Colurs };
