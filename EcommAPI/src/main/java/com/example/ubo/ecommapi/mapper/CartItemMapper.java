package com.example.ubo.ecommapi.mapper;

import com.example.ubo.ecommapi.entity.CartItemEntity;
import dto.ecommapi.CartItem;

public class CartItemMapper {

    private CartItemMapper() {
        // Prevent instantiation
    }

    public static CartItemEntity toEntity(CartItem cartItem) {
        if (cartItem == null) {
            return null;
        }

        CartItemEntity entity = new CartItemEntity();
        entity.setId(cartItem.getId());
        entity.setUserId(cartItem.getUserId());
        entity.setArticleId(cartItem.getArticleId());
        entity.setQuantity(cartItem.getQuantity());
        entity.setPriceAtAdd(cartItem.getPriceAtAdd());
        entity.setCreatedAt(cartItem.getCreatedAt());

        return entity;
    }

    public static CartItem toDto(CartItemEntity entity) {
        if (entity == null) {
            return null;
        }

        CartItem cartItem = new CartItem();
        cartItem.setId(entity.getId());
        cartItem.setUserId(entity.getUserId());
        cartItem.setArticleId(entity.getArticleId());
        cartItem.setQuantity(entity.getQuantity());
        cartItem.setPriceAtAdd(entity.getPriceAtAdd());
        cartItem.setCreatedAt(entity.getCreatedAt());

        return cartItem;
    }
}