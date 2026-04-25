package com.YessGelatinas.sistema_yess.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageResponse {

    private Integer imageId;
    private Integer productId;
    private String productName;
    private LocalDateTime uploadDate;
}
