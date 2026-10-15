export interface Producto {
    categoria?: Record<string, any>;
    embedded?: Record<string, any>;
    id?: number;
    links?: Record<string, any>;
    nombre?: string;
    precio?: number;
    stock?: number;
}
export interface ProductoLoadMatch {
    id: number;
}
export interface ProductoCreateData {
    categoria?: Record<string, any>;
    embedded?: Record<string, any>;
    id?: number;
    links?: Record<string, any>;
    nombre?: string;
    precio?: number;
    stock?: number;
}
export interface ProductoUpdateData {
    id: number;
    categoria?: Record<string, any>;
    embedded?: Record<string, any>;
    links?: Record<string, any>;
    nombre?: string;
    precio?: number;
    stock?: number;
}
export interface ProductoRemoveMatch {
    id: number;
}
