import { ProductoEntity } from './entity/ProductoEntity';
export type * from './MinimarketTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { MinimarketEntityBase } from './MinimarketEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
type DirectResult = {
    ok: false;
    err: any;
    status?: undefined;
    headers?: undefined;
    data?: undefined;
} | {
    ok: boolean;
    status: number;
    headers: any;
    data: any;
    err?: any;
};
declare class MinimarketSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<DirectResult>;
    _rawRequest(fetchargs?: any): Promise<DirectResult>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Producto(entopts?: Record<string, any>): ProductoEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): MinimarketSDK;
    tester(testopts?: any, sdkopts?: any): MinimarketSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof MinimarketSDK;
export { stdutil, config, BaseFeature, MinimarketEntityBase, MinimarketSDK, SDK, };
export type { DirectResult };
