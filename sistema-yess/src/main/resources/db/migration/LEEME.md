# Migraciones de BD — Flyway

## Cómo funciona

Flyway corre automáticamente al arrancar el backend.
Lee los archivos `V{numero}__{descripcion}.sql` en orden y aplica solo los que no ha aplicado antes.
El historial queda en la tabla `flyway_schema_history` en la BD.

## Regla de oro

**NUNCA edites un archivo V ya existente.** Flyway lo detecta y falla.
Para cualquier cambio: crea un archivo V nuevo con el siguiente número.

## Cuándo crear una migración

| Cambio en Java | SQL necesario |
|----------------|---------------|
| Nueva `@Entity` | `CREATE TABLE ...` |
| Nuevo campo nullable | `ALTER TABLE X ADD COLUMN y TYPE NULL;` |
| Nuevo campo NOT NULL | `ALTER TABLE X ADD COLUMN y TYPE NOT NULL DEFAULT 'valor';` |
| Borrar campo Java (columna queda en BD) | No se necesita SQL (Flyway/Hibernate no borran columnas) |
| Cambiar tipo de columna | `ALTER TABLE X MODIFY COLUMN y NUEVO_TIPO;` |

## Ejemplo de migración nueva

```sql
-- V3__agregar_notas_a_productos.sql
ALTER TABLE productos ADD COLUMN notas TEXT NULL;
```

Nombre del archivo: `V{siguiente_numero}__{descripcion_breve}.sql`
- V3 si el último es V2
- V4 si el último es V3
- etc.

## Versiones existentes

| Versión | Descripción |
|---------|-------------|
| V1 | Schema inicial completo (todas las tablas) |
| V2 | Fix: detalle_venta.producto_id pasa a nullable |
