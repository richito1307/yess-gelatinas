package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.service.BackupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/backup")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService) {
        this.backupService = backupService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> backup() {
        String archivo = backupService.backup();
        return ResponseEntity.ok(Map.of(
                "archivo", archivo,
                "mensaje", "Backup creado exitosamente"
        ));
    }
}
