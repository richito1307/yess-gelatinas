package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.model.DetalleVenta;
import com.YessGelatinas.sistema_yess.service.DetalleVentaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-venta")
public class DetalleVentaController {

    private final DetalleVentaService detalleVentaService;

    public DetalleVentaController(DetalleVentaService detalleVentaService) {
        this.detalleVentaService = detalleVentaService;
    }

    @PostMapping
    public ResponseEntity<DetalleVenta> create(@RequestBody DetalleVenta detalleVenta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(detalleVentaService.save(detalleVenta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetalleVenta> update(@PathVariable Integer id, @RequestBody DetalleVenta detalleVenta) {
        return ResponseEntity.ok(detalleVentaService.update(id, detalleVenta));
    }

    @GetMapping
    public ResponseEntity<List<DetalleVenta>> getAll() {
        return ResponseEntity.ok(detalleVentaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleVenta> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(detalleVentaService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        detalleVentaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
