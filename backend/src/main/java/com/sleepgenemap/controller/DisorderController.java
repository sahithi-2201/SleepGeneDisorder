package com.sleepgenemap.controller;

import com.sleepgenemap.model.Disorder;
import com.sleepgenemap.service.DisorderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing endpoints for Sleep Disorders.
 */
@RestController
@RequestMapping("/api/disorders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DisorderController {

    private final DisorderService disorderService;

    @GetMapping
    public ResponseEntity<List<Disorder>> getAllDisorders(
            @RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(disorderService.getDisordersByCategory(category));
        }
        return ResponseEntity.ok(disorderService.getAllDisorders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disorder> getDisorderById(@PathVariable Long id) {
        return disorderService.getDisorderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
