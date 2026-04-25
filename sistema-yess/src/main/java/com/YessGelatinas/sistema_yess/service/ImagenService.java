package com.YessGelatinas.sistema_yess.service;

import com.YessGelatinas.sistema_yess.exception.ResourceNotFoundException;
import com.YessGelatinas.sistema_yess.model.Imagen;
import com.YessGelatinas.sistema_yess.model.Producto;
import com.YessGelatinas.sistema_yess.model.response.ProductImageResponse;
import com.YessGelatinas.sistema_yess.repository.ImagenRepository;
import com.YessGelatinas.sistema_yess.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ImagenService {

    private final ImagenRepository imagenRepository;
    private final ProductoRepository productoRepository;

    public ImagenService(ImagenRepository imagenRepository, ProductoRepository productoRepository) {
        this.imagenRepository = imagenRepository;
        this.productoRepository = productoRepository;
    }

    public List<Imagen> findAll() {
        return imagenRepository.findAll();
    }

    public Imagen findById(Integer id) {
        return imagenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Imagen no encontrada: " + id));
    }

    @Transactional
    public Imagen save(Imagen imagen) {
        return imagenRepository.save(imagen);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!imagenRepository.existsById(id)) {
            throw new ResourceNotFoundException("Imagen no encontrada: " + id);
        }
        imagenRepository.deleteById(id);
    }

    @Transactional
    public ProductImageResponse saveProductImage(MultipartFile file, Integer id) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo de imagen está vacío");
        }

        Imagen imagen = new Imagen();
        imagen.setImagen(file.getBytes());
        Imagen saved = imagenRepository.save(imagen);

        Producto prd = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
        prd.setImagen(saved);
        productoRepository.save(prd);

        return ProductImageResponse.builder()
                .imageId(saved.getId())
                .productId(prd.getId())
                .productName(prd.getNombre())
                .uploadDate(saved.getFechaSubida())
                .build();
    }
}
