package com.YessGelatinas.sistema_yess.service;

import com.YessGelatinas.sistema_yess.exception.ResourceNotFoundException;
import com.YessGelatinas.sistema_yess.model.DetalleVenta;
import com.YessGelatinas.sistema_yess.model.TipoItemVenta;
import com.YessGelatinas.sistema_yess.repository.DetalleVentaRepository;
import com.YessGelatinas.sistema_yess.repository.ProductoRepository;
import com.YessGelatinas.sistema_yess.repository.RecetaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DetalleVentaService {

    private final DetalleVentaRepository detalleVentaRepository;
    private final RecetaRepository recetaRepository;
    private final ProductoRepository productoRepository;

    public DetalleVentaService(DetalleVentaRepository detalleVentaRepository,
                               RecetaRepository recetaRepository,
                               ProductoRepository productoRepository) {
        this.detalleVentaRepository = detalleVentaRepository;
        this.recetaRepository = recetaRepository;
        this.productoRepository = productoRepository;
    }

    public List<DetalleVenta> findAll() {
        return detalleVentaRepository.findAll();
    }

    public DetalleVenta findById(Integer id) {
        return detalleVentaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Detalle de venta no encontrado: " + id));
    }

    @Transactional
    public DetalleVenta save(DetalleVenta detalleVenta) {
        resolverRelaciones(detalleVenta);
        return detalleVentaRepository.save(detalleVenta);
    }

    @Transactional
    public DetalleVenta update(Integer id, DetalleVenta detalleVenta) {
        DetalleVenta existing = findById(id);
        existing.setCantidad(detalleVenta.getCantidad());
        existing.setPrecioUnitario(detalleVenta.getPrecioUnitario());
        return detalleVentaRepository.save(existing);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!detalleVentaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Detalle de venta no encontrado: " + id);
        }
        detalleVentaRepository.deleteById(id);
    }

    private void resolverRelaciones(DetalleVenta d) {
        if (d.getTipo() == null) d.setTipo(TipoItemVenta.PRODUCTO);

        if (d.getTipo() == TipoItemVenta.RECETA && d.getReceta() != null && d.getReceta().getId() != null) {
            d.setReceta(recetaRepository.findById(d.getReceta().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Receta no encontrada")));
            d.setProducto(null);
        } else if (d.getProducto() != null && d.getProducto().getId() != null) {
            d.setProducto(productoRepository.findById(d.getProducto().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado")));
            d.setReceta(null);
        }
    }
}
