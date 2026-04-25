package com.YessGelatinas.sistema_yess.service;

import com.YessGelatinas.sistema_yess.exception.ResourceNotFoundException;
import com.YessGelatinas.sistema_yess.model.ProductoHistorial;
import com.YessGelatinas.sistema_yess.repository.ProductoHistorialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoHistorialService {

    private final ProductoHistorialRepository productoHistorialRepository;

    public ProductoHistorialService(ProductoHistorialRepository productoHistorialRepository) {
        this.productoHistorialRepository = productoHistorialRepository;
    }

    public List<ProductoHistorial> findAll() {
        return productoHistorialRepository.findAll();
    }

    public ProductoHistorial findById(Integer id) {
        return productoHistorialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Historial no encontrado: " + id));
    }

    @Transactional
    public ProductoHistorial save(ProductoHistorial productoHistorial) {
        return productoHistorialRepository.save(productoHistorial);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!productoHistorialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Historial no encontrado: " + id);
        }
        productoHistorialRepository.deleteById(id);
    }
}
