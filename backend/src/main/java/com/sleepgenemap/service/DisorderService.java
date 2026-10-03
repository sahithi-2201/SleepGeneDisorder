package com.sleepgenemap.service;

import com.sleepgenemap.model.Disorder;
import com.sleepgenemap.repository.DisorderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DisorderService {

    private final DisorderRepository disorderRepository;

    @Transactional(readOnly = true)
    public List<Disorder> getAllDisorders() {
        return disorderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Disorder> getDisorderById(Long id) {
        return disorderRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Disorder> getDisordersByCategory(String category) {
        return disorderRepository.findByCategoryIgnoreCase(category);
    }

    @Transactional(readOnly = true)
    public List<Disorder> searchDisorders(String query) {
        return disorderRepository.searchDisorders(query);
    }
}
