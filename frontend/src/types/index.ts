export interface UnidadMedida {
  id: number
  nombre: string
  tipo: 'masa' | 'volumen'
  factorConversion: number
}

export interface Imagen {
  id: number
  imagen: string
  fechaSubida: string
}

export interface Receta {
  id: number
  nombrePostre: string
  descripcion: string
  precio: number
  imagen?: Imagen
}

export interface Producto {
  id: number
  nombre: string
  cantidad: number
  unidadMedida: UnidadMedida
  precio: number
  fechaActualizacion: string
  imagen?: Imagen
  receta?: Receta
}

export interface Cliente {
  id: number
  nombre: string
  telefono?: string
  email?: string
  notas?: string
  fechaRegistro: string
  activo: boolean
}

export interface Direccion {
  id: number
  cliente: Cliente
  alias?: string
  calle: string
  colonia?: string
  ciudad: string
  estado?: string
  codigoPostal?: string
  referencias?: string
  esPrincipal: boolean
}

export interface Venta {
  id: number
  fecha: string
  total: number
  cliente?: Cliente
}

export interface DetalleVenta {
  id: number
  venta: Venta
  tipo: 'RECETA' | 'PRODUCTO'
  receta?: Receta
  producto?: Producto
  cantidad: number
  precioUnitario: number
}

export interface IngredienteReceta {
  id: number
  receta: Receta
  producto: Producto
  cantidad: number
  unidadMedida: UnidadMedida
}

export interface ProductoHistorial {
  id: number
  producto: Producto
  precioAnterior: number
  precioNuevo: number
  fechaCambio: string
}

export interface ProductImageResponse {
  imageId: number
  productId: number
  productName: string
  uploadDate: string
}

export interface ErrorResponse {
  status: number
  mensaje: string
  timestamp: string
  errores?: Record<string, string>
}

export interface ItemCarrito {
  tipo: 'RECETA' | 'PRODUCTO'
  id: number
  nombre: string
  precio: number
  cantidad: number
  imagen?: Imagen | undefined
}

export type ItemCarritoInput = Omit<ItemCarrito, 'cantidad'>
