import { MinimarketEntityBase } from '../MinimarketEntityBase';
import type { MinimarketSDK } from '../MinimarketSDK';
import type { Control } from '../types';
import type { Producto, ProductoLoadMatch, ProductoCreateData, ProductoUpdateData, ProductoRemoveMatch } from '../MinimarketTypes';
declare class ProductoEntity extends MinimarketEntityBase<Producto> {
    constructor(client: MinimarketSDK, entopts: any);
    make(this: ProductoEntity): ProductoEntity;
    load(this: any, reqmatch?: ProductoLoadMatch, ctrl?: Control): Promise<ProductoEntity>;
    create(this: any, reqdata?: ProductoCreateData, ctrl?: Control): Promise<ProductoEntity>;
    update(this: any, reqdata?: ProductoUpdateData, ctrl?: Control): Promise<ProductoEntity>;
    remove(this: any, reqmatch?: ProductoRemoveMatch, ctrl?: Control): Promise<ProductoEntity>;
}
export { ProductoEntity };
