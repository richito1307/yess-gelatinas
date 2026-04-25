package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.model.Imagen;
import com.YessGelatinas.sistema_yess.model.response.ProductImageResponse;
import com.YessGelatinas.sistema_yess.service.ImagenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/imagenes")
public class ImagenController {

    private final ImagenService imagenService;

    public ImagenController(ImagenService imagenService) {
        this.imagenService = imagenService;
    }

    @PostMapping
    public ResponseEntity<Imagen> create(@RequestBody Imagen imagen) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imagenService.save(imagen));
    }

    @PostMapping(value = "/uploadProductImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductImageResponse> uploadProductImage(
            @RequestParam("imagen") MultipartFile file,
            @RequestParam("id") Integer id
    ) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(imagenService.saveProductImage(file, id));
    }

    @GetMapping
    public ResponseEntity<List<Imagen>> getAll() {
        return ResponseEntity.ok(imagenService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Imagen> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(imagenService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        imagenService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
