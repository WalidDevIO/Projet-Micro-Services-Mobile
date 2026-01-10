package com.example.ubo.ecommapi.business;

import com.example.ubo.ecommapi.entity.ArticleEntity;
import com.example.ubo.ecommapi.exceptions.FunctionalException;
import com.example.ubo.ecommapi.mapper.ArticleMapper;
import com.example.ubo.ecommapi.repository.ArticleRepository;
import jakarta.inject.Inject;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.example.ubo.ecommapi.mapper.ArticleMapper.toDto;
import static com.example.ubo.ecommapi.mapper.ArticleMapper.toEntity;

@Component
public class ArticleBusiness {

    @Inject
    private ArticleRepository articleRepository;

    public ArticleEntity createArticle(ArticleEntity article) {
        return toEntity(articleRepository.addArticle(toDto(article)));
    }

    public ArticleEntity getArticleById(String id) {
        return toEntity(articleRepository.getArticleById(id));
    }

    public boolean deleteArticle(String id) {
        return articleRepository.deleteArticle(id);
    }

    public ArticleEntity updateArticle(ArticleEntity article) {
        if(article.getId() == null || articleRepository.getArticleById(article.getId()) == null) {
            throw new FunctionalException(404, "Article not found");
        }
        return toEntity(articleRepository.updateArticle(toDto(article)));
    }

    public List<ArticleEntity> getAllArticles() {
        return articleRepository.getAllArticles().stream()
                .map(ArticleMapper::toEntity)
                .toList();
    }

    public List<ArticleEntity> getArticlesByCategory(String categoryId) {
        return articleRepository.getArticlesByCategory(categoryId).stream()
                .map(ArticleMapper::toEntity)
                .toList();
    }
}