// Typed models for the Minimarket SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Producto {
  categoria?: Record<string, any>
  embedded?: Record<string, any>
  id?: number
  links?: Record<string, any>
  nombre?: string
  precio?: number
  stock?: number
}

export interface ProductoLoadMatch {
  id: number
}

export interface ProductoCreateData {
  categoria?: Record<string, any>
  embedded?: Record<string, any>
  id?: number
  links?: Record<string, any>
  nombre?: string
  precio?: number
  stock?: number
}

export interface ProductoUpdateData {
  id: number
  categoria?: Record<string, any>
  embedded?: Record<string, any>
  links?: Record<string, any>
  nombre?: string
  precio?: number
  stock?: number
}

export interface ProductoRemoveMatch {
  id: number
}

