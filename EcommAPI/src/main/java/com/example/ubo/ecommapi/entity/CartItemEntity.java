package com.example.ubo.ecommapi.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Objects;

public class CartItemEntity {

    private String id;
    private String userId;
    private String articleId;
    private Integer quantity;
    private BigDecimal priceAtAdd;
    private OffsetDateTime createdAt;

    // Constructeur vide
    public CartItemEntity() {
    }

    // Constructeur full
    public CartItemEntity(String id, String userId, String articleId,
                          Integer quantity, BigDecimal priceAtAdd, OffsetDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.articleId = articleId;
        this.quantity = quantity;
        this.priceAtAdd = priceAtAdd;
        this.createdAt = createdAt;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getArticleId() {
        return articleId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getPriceAtAdd() {
        return priceAtAdd;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setArticleId(String articleId) {
        this.articleId = articleId;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setPriceAtAdd(BigDecimal priceAtAdd) {
        this.priceAtAdd = priceAtAdd;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartItemEntity that = (CartItemEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(userId, that.userId) &&
                Objects.equals(articleId, that.articleId) &&
                Objects.equals(quantity, that.quantity) &&
                Objects.equals(priceAtAdd, that.priceAtAdd) &&
                Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId, articleId, quantity, priceAtAdd, createdAt);
    }

    // toString
    @Override
    public String toString() {
        return "CartItemEntity{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", articleId='" + articleId + '\'' +
                ", quantity=" + quantity +
                ", priceAtAdd=" + priceAtAdd +
                ", createdAt=" + createdAt +
                '}';
    }
}