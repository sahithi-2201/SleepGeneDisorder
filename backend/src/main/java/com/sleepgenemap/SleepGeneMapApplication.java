package com.sleepgenemap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application entry point for SleepGeneMap.
 * 
 * @SpringBootApplication marks this class as a configuration class,
 * enables automatic configuration, and triggers component scanning for
 * controllers, services, and repositories in com.sleepgenemap.
 */
@SpringBootApplication
public class SleepGeneMapApplication {

    public static void main(String[] args) {
        SpringApplication.run(SleepGeneMapApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" SleepGeneMap Spring Boot Backend started on :8080");
        System.out.println("=================================================");
    }
}
