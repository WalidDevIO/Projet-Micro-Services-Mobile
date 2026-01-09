package com.example.ubo.ecommapi.repository;

import com.example.ubo.ecommapi.exceptions.FunctionalException;
import dto.ecommapi.CartItem;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CartItemRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public CartItemRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final String SQL_INSERT_CART_ITEM =
            "INSERT INTO cart_items (ID, USER_ID, ARTICLE_ID, QUANTITY, PRICE_AT_ADD, CREATED_AT) " +
                    "VALUES (:id, :userId, :articleId, :quantity, :priceAtAdd, :createdAt);";

    private static final String SQL_SELECT_CART_ITEM =
            "SELECT * FROM cart_items WHERE id = :id;";

    private static final String SQL_DELETE_CART_ITEM =
            "DELETE FROM cart_items WHERE id = :id;";

    private static final String SQL_UPDATE_CART_ITEM =
            "UPDATE cart_items SET QUANTITY = :quantity, PRICE_AT_ADD = :priceAtAdd WHERE id = :id;";

    private static final String SQL_SELECT_CART_ITEMS_BY_USER =
            "SELECT * FROM cart_items WHERE user_id = :userId;";

    private static final String SQL_SELECT_ALL_CART_ITEMS =
            "SELECT * FROM cart_items;";

    private static final String SQL_DELETE_CART_ITEMS_BY_USER =
            "DELETE FROM cart_items WHERE user_id = :userId;";

    public CartItem addCartItem(CartItem cartItem) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", cartItem.getId() != null ? Integer.valueOf(cartItem.getId()) : null);
        params.put("userId", Long.valueOf(cartItem.getUserId()));
        params.put("articleId", Long.valueOf(cartItem.getArticleId()));
        params.put("quantity", cartItem.getQuantity());
        params.put("priceAtAdd", cartItem.getPriceAtAdd());
        params.put("createdAt", cartItem.getCreatedAt() != null ? cartItem.getCreatedAt() : new Timestamp(System.currentTimeMillis()));
        jdbcTemplate.update(SQL_INSERT_CART_ITEM, params);
        return cartItem;
    }

    public CartItem getCartItemById(String id) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        try {
            return jdbcTemplate.queryForObject(SQL_SELECT_CART_ITEM, params, (r, s) -> {
                CartItem cartItem = new CartItem();
                cartItem.setId(String.valueOf(r.getInt("ID")));
                cartItem.setUserId(String.valueOf(r.getLong("USER_ID")));
                cartItem.setArticleId(String.valueOf(r.getLong("ARTICLE_ID")));
                cartItem.setQuantity(r.getInt("QUANTITY"));
                cartItem.setPriceAtAdd(r.getBigDecimal("PRICE_AT_ADD"));
                Timestamp createdAt = r.getTimestamp("CREATED_AT");
                cartItem.setCreatedAt(createdAt != null ? createdAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
                return cartItem;
            });
        } catch (Exception e) {
            throw new FunctionalException(1, "Cart item not found");
        }
    }

    public boolean deleteCartItem(String id) {
        Map<String, Object> params = new HashMap<>();
        try {
            getCartItemById(id);
        } catch (Exception e) {
            return false;
        }
        params.put("id", id);
        jdbcTemplate.update(SQL_DELETE_CART_ITEM, params);
        return true;
    }

    public CartItem updateCartItem(CartItem cartItem) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", cartItem.getId() != null ? Integer.valueOf(cartItem.getId()) : null);
        params.put("quantity", cartItem.getQuantity());
        params.put("priceAtAdd", cartItem.getPriceAtAdd());
        jdbcTemplate.update(SQL_UPDATE_CART_ITEM, params);
        return cartItem;
    }

    public List<CartItem> getCartItemsByUserId(String userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        return jdbcTemplate.query(SQL_SELECT_CART_ITEMS_BY_USER, params, (r, s) -> {
            CartItem cartItem = new CartItem();
            cartItem.setId(String.valueOf(r.getInt("ID")));
            cartItem.setUserId(String.valueOf(r.getLong("USER_ID")));
            cartItem.setArticleId(String.valueOf(r.getLong("ARTICLE_ID")));
            cartItem.setQuantity(r.getInt("QUANTITY"));
            cartItem.setPriceAtAdd(r.getBigDecimal("PRICE_AT_ADD"));
            Timestamp createdAt = r.getTimestamp("CREATED_AT");
            cartItem.setCreatedAt(createdAt != null ? createdAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
            return cartItem;
        });
    }

    public List<CartItem> getAllCartItems() {
        return jdbcTemplate.query(SQL_SELECT_ALL_CART_ITEMS, (r, s) -> {
            CartItem cartItem = new CartItem();
            cartItem.setId(String.valueOf(r.getInt("ID")));
            cartItem.setUserId(String.valueOf(r.getLong("USER_ID")));
            cartItem.setArticleId(String.valueOf(r.getLong("ARTICLE_ID")));
            cartItem.setQuantity(r.getInt("QUANTITY"));
            cartItem.setPriceAtAdd(r.getBigDecimal("PRICE_AT_ADD"));
            Timestamp createdAt = r.getTimestamp("CREATED_AT");
            cartItem.setCreatedAt(createdAt != null ? createdAt.toInstant().atOffset(java.time.ZoneOffset.UTC) : null);
            return cartItem;
        });
    }

    public boolean clearCartByUserId(String userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        int rowsAffected = jdbcTemplate.update(SQL_DELETE_CART_ITEMS_BY_USER, params);
        return rowsAffected > 0;
    }
}