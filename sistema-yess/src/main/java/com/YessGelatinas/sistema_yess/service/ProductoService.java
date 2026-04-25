package com.YessGelatinas.sistema_yess.service;

import com.YessGelatinas.sistema_yess.exception.ResourceNotFoundException;
import com.YessGelatinas.sistema_yess.model.Imagen;
import com.YessGelatinas.sistema_yess.model.Producto;
import com.YessGelatinas.sistema_yess.model.UnidadMedida;
import com.YessGelatinas.sistema_yess.model.request.ProductoRequest;
import com.YessGelatinas.sistema_yess.repository.ImagenRepository;
import com.YessGelatinas.sistema_yess.repository.ProductoRepository;
import com.YessGelatinas.sistema_yess.repository.UnidadMedidaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductoService {

    private static final Logger log = LoggerFactory.getLogger(ProductoService.class);

    private final ProductoRepository productoRepository;
    private final UnidadMedidaRepository unidadMedidaRepository;
    private final ImagenRepository imagenRepository;

    public ProductoService(ProductoRepository productoRepository,
                           UnidadMedidaRepository unidadMedidaRepository,
                           ImagenRepository imagenRepository) {
        this.productoRepository = productoRepository;
        this.unidadMedidaRepository = unidadMedidaRepository;
        this.imagenRepository = imagenRepository;
    }

    @Transactional
    public Producto guardarProducto(ProductoRequest request) throws IOException {
        UnidadMedida unidadMedida = unidadMedidaRepository.findById(request.getUnidadMedidaId())
                .orElseThrow(() -> new ResourceNotFoundException("Unidad de medida no encontrada: " + request.getUnidadMedidaId()));

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setCantidad(request.getCantidad());
        producto.setUnidadMedida(unidadMedida);
        producto.setPrecio(request.getPrecio());

        if (request.getImagen() != null && !request.getImagen().isEmpty()) {
            Imagen imagen = new Imagen();
            imagen.setImagen(request.getImagen().getBytes());
            imagenRepository.save(imagen);
            producto.setImagen(imagen);
        }

        log.info("Producto guardado: {}", request.getNombre());
        return productoRepository.save(producto);
    }

    @Transactional
    public Producto actualizarProducto(Integer id, ProductoRequest request) throws IOException {
        Producto producto = findById(id);
        UnidadMedida unidadMedida = unidadMedidaRepository.findById(request.getUnidadMedidaId())
                .orElseThrow(() -> new ResourceNotFoundException("Unidad de medida no encontrada: " + request.getUnidadMedidaId()));

        producto.setNombre(request.getNombre());
        producto.setCantidad(request.getCantidad());
        producto.setUnidadMedida(unidadMedida);
        producto.setPrecio(request.getPrecio());
        producto.setFechaActualizacion(LocalDateTime.now());

        if (request.getImagen() != null && !request.getImagen().isEmpty()) {
            Imagen imagen = new Imagen();
            imagen.setImagen(request.getImagen().getBytes());
            imagenRepository.save(imagen);
            producto.setImagen(imagen);
        }

        log.info("Producto actualizado: id={}", id);
        return productoRepository.save(producto);
    }

    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    public Producto findById(Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado: " + id);
        }
        productoRepository.deleteById(id);
        log.info("Producto eliminado: id={}", id);
    }
}
