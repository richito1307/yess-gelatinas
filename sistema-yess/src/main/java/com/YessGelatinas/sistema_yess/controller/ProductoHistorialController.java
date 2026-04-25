package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.model.ProductoHistorial;
import com.YessGelatinas.sistema_yess.service.ProductoHistorialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos-historial")
public class ProductoHistorialController {

    private final ProductoHistorialService productoHistorialService;

    public ProductoHistorialController(ProductoHistorialService productoHistorialService) {
        this.productoHistorialService = productoHistorialService;
    }

    @PostMapping
    public ResponseEntity<ProductoHistorial> create(@RequestBody ProductoHistorial productoHistorial) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoHistorialService.save(productoHistorial));
    }

    @GetMapping
    public ResponseEntity<List<ProductoHistorial>> getAll() {
        return ResponseEntity.ok(productoHistorialService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoHistorial> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(productoHistorialService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        productoHistorialService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
