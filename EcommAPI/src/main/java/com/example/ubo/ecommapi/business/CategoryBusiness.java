package com.example.ubo.ecommapi.business;

import com.example.ubo.ecommapi.entity.CategoryEntity;
import com.example.ubo.ecommapi.exceptions.FunctionalException;
import com.example.ubo.ecommapi.mapper.CategoryMapper;
import com.example.ubo.ecommapi.repository.CategoryRepository;
import jakarta.inject.Inject;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.example.ubo.ecommapi.mapper.CategoryMapper.toDto;
import static com.example.ubo.ecommapi.mapper.CategoryMapper.toEntity;

@Component
public class CategoryBusiness {

    @Inject
    private CategoryRepository categoryRepository;

    public CategoryEntity createCategory(CategoryEntity category) {
        return toEntity(categoryRepository.addCategory(toDto(category)));
    }

    public CategoryEntity getCategoryById(String id) {
        return toEntity(categoryRepository.getCategoryById(id));
    }

    public boolean deleteCategory(String id) {
        return categoryRepository.deleteCategory(id);
    }

    public CategoryEntity updateCategory(CategoryEntity category) {
        if(category.getId() == null || categoryRepository.getCategoryById(category.getId()) == null) {
            throw new FunctionalException(404, "Category not found");
        }
        return toEntity(categoryRepository.updateCategory(toDto(category)));
    }

    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.getAllCategories().stream()
                .map(CategoryMapper::toEntity)
                .toList();
    }
}