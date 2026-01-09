package com.example.ubo.ecommapi.mapper;

import com.example.ubo.ecommapi.entity.CategoryEntity;
import dto.ecommapi.Category;

public class CategoryMapper {

    private CategoryMapper() {
        // Prevent instantiation
    }

    public static CategoryEntity toEntity(Category category) {
        if (category == null) {
            return null;
        }

        CategoryEntity entity = new CategoryEntity();
        entity.setId(category.getId());
        entity.setName(category.getName());
        entity.setDescription(category.getDescription());
        entity.setCreatedAt(category.getCreatedAt());

        return entity;
    }

    public static Category toDto(CategoryEntity entity) {
        if (entity == null) {
            return null;
        }

        Category category = new Category();
        category.setId(entity.getId());
        category.setName(entity.getName());
        category.setDescription(entity.getDescription());
        category.setCreatedAt(entity.getCreatedAt());

        return category;
    }
}