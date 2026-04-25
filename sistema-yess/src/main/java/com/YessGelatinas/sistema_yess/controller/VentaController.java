package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.model.Venta;
import com.YessGelatinas.sistema_yess.service.VentaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @PostMapping
    public ResponseEntity<Venta> create(@RequestBody Venta venta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ventaService.save(venta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> update(@PathVariable Integer id, @RequestBody Venta venta) {
        return ResponseEntity.ok(ventaService.update(id, venta));
    }

    @GetMapping
    public ResponseEntity<List<Venta>> getAll() {
        return ResponseEntity.ok(ventaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ventaService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        ventaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
