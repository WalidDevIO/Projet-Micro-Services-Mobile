package com.example.ubo.ecommapi.mapper;

import com.example.ubo.ecommapi.entity.ArticleEntity;
import dto.ecommapi.Article;

public class ArticleMapper {

    private ArticleMapper() {
        // Prevent instantiation
    }

    public static ArticleEntity toEntity(Article article) {
        if (article == null) {
            return null;
        }

        ArticleEntity entity = new ArticleEntity();
        entity.setId(article.getId());
        entity.setName(article.getName());
        entity.setDescription(article.getDescription());
        entity.setPrice(article.getPrice());
        entity.setStock(article.getStock());
        entity.setCategoryId(article.getCategoryId());
        entity.setImageUrl(article.getImageUrl());
        entity.setCreatedAt(article.getCreatedAt());
        entity.setUpdatedAt(article.getUpdatedAt());

        return entity;
    }

    public static Article toDto(ArticleEntity entity) {
        if (entity == null) {
            return null;
        }

        Article article = new Article();
        article.setId(entity.getId());
        article.setName(entity.getName());
        article.setDescription(entity.getDescription());
        article.setPrice(entity.getPrice());
        article.setStock(entity.getStock());
        article.setCategoryId(entity.getCategoryId());
        article.setImageUrl(entity.getImageUrl());
        article.setCreatedAt(entity.getCreatedAt());
        article.setUpdatedAt(entity.getUpdatedAt());

        return article;
    }
}