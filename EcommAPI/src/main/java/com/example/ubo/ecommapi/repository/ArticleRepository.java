package com.example.ubo.ecommapi.repository;

import com.example.ubo.ecommapi.exceptions.FunctionalException;
import dto.ecommapi.Article;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ArticleRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public ArticleRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final String SQL_INSERT_ARTICLE =
            "INSERT INTO articles (NAME, DESCRIPTION, PRICE, STOCK, CATEGORY_ID, IMAGE_URL) " +
                    "VALUES (:name, :description, :price, :stock, :categoryId, :imageUrl);";

    private static final String SQL_SELECT_ARTICLE =
            "SELECT * FROM articles WHERE id = :id;";

    private static final String SQL_DELETE_ARTICLE =
            "DELETE FROM articles WHERE id = :id;";

    private static final String SQL_UPDATE_ARTICLE =
            "UPDATE articles SET NAME = :name, DESCRIPTION = :description, PRICE = :price, STOCK = :stock, " +
                    "CATEGORY_ID = :categoryId, IMAGE_URL = :imageUrl, UPDATED_AT = :updatedAt WHERE id = :id;";

    private static final String SQL_SELECT_ALL_ARTICLES =
            "SELECT * FROM articles;";

    private static final String SQL_SELECT_ARTICLES_BY_CATEGORY =
            "SELECT * FROM articles WHERE category_id = :categoryId;";

    public Article addArticle(Article article) {
        Map<String, Object> params = new HashMap<>();
        params.put("name", article.getName());
        params.put("description", article.getDescription());
        params.put("price", article.getPrice());
        params.put("stock", article.getStock());
        params.put("categoryId", article.getCategoryId() != null ? Integer.valueOf(article.getCategoryId()) : null);
        params.put("imageUrl", article.getImageUrl());
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(SQL_INSERT_ARTICLE, new MapSqlParameterSource(params), keyHolder);
        return getArticleById(String.valueOf(keyHolder.getKey().intValue()));
    }

    public Article getArticleById(String id) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        try {
            return jdbcTemplate.queryForObject(SQL_SELECT_ARTICLE, params, (r, s) -> {
                Article article = new Article();
                article.setId(String.valueOf(r.getInt("ID")));
                article.setName(r.getString("NAME"));
                article.setDescription(r.getString("DESCRIPTION"));
                article.setPrice(r.getBigDecimal("PRICE"));
                article.setStock(r.getInt("STOCK"));
                article.setCategoryId(r.getObject("CATEGORY_ID") != null ? String.valueOf(r.getLong("CATEGORY_ID")) : null);
                article.setImageUrl(r.getString("IMAGE_URL"));
                Timestamp createdAt = r.getTimestamp("CREATED_AT");
                article.setCreatedAt(createdAt != null ? createdAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
                Timestamp updatedAt = r.getTimestamp("UPDATED_AT");
                article.setUpdatedAt(updatedAt != null ? updatedAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
                return article;
            });
        } catch (Exception e) {
            throw new FunctionalException(1, "Article not found");
        }
    }

    public boolean deleteArticle(String id) {
        Map<String, Object> params = new HashMap<>();
        try {
            getArticleById(id);
        } catch (Exception e) {
            return false;
        }
        params.put("id", id);
        jdbcTemplate.update(SQL_DELETE_ARTICLE, params);
        return true;
    }

    public Article updateArticle(Article article) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", article.getId() != null ? Integer.valueOf(article.getId()) : null);
        params.put("name", article.getName());
        params.put("description", article.getDescription());
        params.put("price", article.getPrice());
        params.put("stock", article.getStock());
        params.put("categoryId", article.getCategoryId() != null ? Long.valueOf(article.getCategoryId()) : null);
        params.put("imageUrl", article.getImageUrl());
        params.put("updatedAt", new Timestamp(System.currentTimeMillis()));
        jdbcTemplate.update(SQL_UPDATE_ARTICLE, params);
        return getArticleById(article.getId());
    }

    public List<Article> getAllArticles() {
        return jdbcTemplate.query(SQL_SELECT_ALL_ARTICLES, (r, s) -> {
            Article article = new Article();
            article.setId(String.valueOf(r.getInt("ID")));
            article.setName(r.getString("NAME"));
            article.setDescription(r.getString("DESCRIPTION"));
            article.setPrice(r.getBigDecimal("PRICE"));
            article.setStock(r.getInt("STOCK"));
            article.setCategoryId(r.getObject("CATEGORY_ID") != null ? String.valueOf(r.getLong("CATEGORY_ID")) : null);
            article.setImageUrl(r.getString("IMAGE_URL"));
            Timestamp createdAt = r.getTimestamp("CREATED_AT");
            article.setCreatedAt(createdAt != null ? createdAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
            Timestamp updatedAt = r.getTimestamp("UPDATED_AT");
            article.setUpdatedAt(updatedAt != null ? updatedAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
            return article;
        });
    }

    public List<Article> getArticlesByCategory(String categoryId) {
        Map<String, Object> params = new HashMap<>();
        params.put("categoryId", categoryId);
        return jdbcTemplate.query(SQL_SELECT_ARTICLES_BY_CATEGORY, params, (r, s) -> {
            Article article = new Article();
            article.setId(String.valueOf(r.getInt("ID")));
            article.setName(r.getString("NAME"));
            article.setDescription(r.getString("DESCRIPTION"));
            article.setPrice(r.getBigDecimal("PRICE"));
            article.setStock(r.getInt("STOCK"));
            article.setCategoryId(r.getObject("CATEGORY_ID") != null ? String.valueOf(r.getLong("CATEGORY_ID")) : null);
            article.setImageUrl(r.getString("IMAGE_URL"));
            Timestamp createdAt = r.getTimestamp("CREATED_AT");
            article.setCreatedAt(createdAt != null ? createdAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
            Timestamp updatedAt = r.getTimestamp("UPDATED_AT");
            article.setUpdatedAt(updatedAt != null ? updatedAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
            return article;
        });
    }
}