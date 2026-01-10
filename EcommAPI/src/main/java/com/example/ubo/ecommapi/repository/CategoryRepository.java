package com.example.ubo.ecommapi.repository;

import com.example.ubo.ecommapi.exceptions.FunctionalException;
import dto.ecommapi.Category;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CategoryRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public CategoryRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final String SQL_INSERT_CATEGORY =
            "INSERT INTO categories (NAME, DESCRIPTION) VALUES (:name, :description);";

    private static final String SQL_SELECT_CATEGORY =
            "SELECT * FROM categories WHERE id = :id;";

    private static final String SQL_DELETE_CATEGORY =
            "DELETE FROM categories WHERE id = :id;";

    private static final String SQL_UPDATE_CATEGORY =
            "UPDATE categories SET NAME = :name, DESCRIPTION = :description WHERE id = :id;";

    private static final String SQL_SELECT_ALL_CATEGORIES =
            "SELECT * FROM categories;";

    public Category addCategory(Category category) {
        Map<String, Object> params = new HashMap<>();
        params.put("name", category.getName());
        params.put("description", category.getDescription());
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(SQL_INSERT_CATEGORY, new MapSqlParameterSource(params), keyHolder);
        return getCategoryById(String.valueOf(keyHolder.getKey().intValue()));
    }

    public Category getCategoryById(String id) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        try {
            return jdbcTemplate.queryForObject(SQL_SELECT_CATEGORY, params, (r, s) -> {
                Category category = new Category();
                category.setId(String.valueOf(r.getInt("ID")));
                category.setName(r.getString("NAME"));
                category.setDescription(r.getString("DESCRIPTION"));
                Timestamp createdAt = r.getTimestamp("CREATED_AT");
                category.setCreatedAt(createdAt != null ? createdAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
                return category;
            });
        } catch (Exception e) {
            throw new FunctionalException(1, "Category not found");
        }
    }

    public boolean deleteCategory(String id) {
        Map<String, Object> params = new HashMap<>();
        try {
            getCategoryById(id);
        } catch (Exception e) {
            return false;
        }
        params.put("id", id);
        jdbcTemplate.update(SQL_DELETE_CATEGORY, params);
        return true;
    }

    public Category updateCategory(Category category) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", category.getId() != null ? Integer.valueOf(category.getId()) : null);
        params.put("name", category.getName());
        params.put("description", category.getDescription());
        jdbcTemplate.update(SQL_UPDATE_CATEGORY, params);
        return getCategoryById(category.getId());
    }

    public List<Category> getAllCategories() {
        return jdbcTemplate.query(SQL_SELECT_ALL_CATEGORIES, (r, s) -> {
            Category category = new Category();
            category.setId(String.valueOf(r.getInt("ID")));
            category.setName(r.getString("NAME"));
            category.setDescription(r.getString("DESCRIPTION"));
            Timestamp createdAt = r.getTimestamp("CREATED_AT");
            category.setCreatedAt(createdAt != null ? createdAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
            return category;
        });
    }
}