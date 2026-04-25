package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.model.Producto;
import com.YessGelatinas.sistema_yess.model.request.ProductoRequest;
import com.YessGelatinas.sistema_yess.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Producto> crear(@Valid @ModelAttribute ProductoRequest request) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.guardarProducto(request));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Producto> actualizar(@PathVariable Integer id,
                                               @Valid @ModelAttribute ProductoRequest request) throws IOException {
        return ResponseEntity.ok(productoService.actualizarProducto(id, request));
    }

    @GetMapping
    public ResponseEntity<List<Producto>> getAll() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(productoService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
