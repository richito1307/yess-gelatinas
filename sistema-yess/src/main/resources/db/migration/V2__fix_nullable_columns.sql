-- Detalle_Venta: producto_id pasa a nullable.
-- Las ventas pueden ser sobre recetas (tipo=RECETA, producto_id=NULL)
-- o sobre productos directos (tipo=PRODUCTO, receta_id=NULL).
ALTER TABLE detalle_venta MODIFY COLUMN producto_id INT NULL;
