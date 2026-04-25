package com.YessGelatinas.sistema_yess.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class BackupService {

    private static final Logger log = LoggerFactory.getLogger(BackupService.class);
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm");

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${app.backup.folder}")
    private String backupFolder;

    @Value("${app.backup.mysqldump-path:mysqldump}")
    private String mysqldumpPath;

    // Todos los dias a las 2 AM
    @Scheduled(cron = "0 0 2 * * *")
    public void backupScheduled() {
        try {
            String archivo = backup();
            log.info("Backup automatico creado: {}", archivo);
        } catch (Exception e) {
            log.error("Backup automatico fallo: {}", e.getMessage());
        }
    }

    public String backup() {
        File folder = new File(backupFolder);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        String dbName = extraerNombreBD(datasourceUrl);
        String timestamp = LocalDateTime.now().format(FMT);
        String archivo = backupFolder + "/yess_backup_" + timestamp + ".sql";

        ProcessBuilder pb = new ProcessBuilder(
                mysqldumpPath,
                "-u", dbUser,
                "-p" + dbPassword,
                "--databases", dbName,
                "--result-file=" + archivo
        );
        pb.redirectErrorStream(true);

        try {
            Process proceso = pb.start();
            int codigo = proceso.waitFor();
            if (codigo != 0) {
                throw new RuntimeException("mysqldump termino con codigo " + codigo);
            }
            return archivo;
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Error ejecutando mysqldump: " + e.getMessage(), e);
        }
    }

    private String extraerNombreBD(String url) {
        // jdbc:mysql://localhost:3306/YessGelatinas?...
        String sinProtocolo = url.split("//")[1];
        String conDb = sinProtocolo.split("/")[1];
        return conDb.split("\\?")[0];
    }
}
