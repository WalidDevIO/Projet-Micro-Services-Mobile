package com.example.ubo.ecommapi.business;

import com.example.ubo.ecommapi.entity.CartItemEntity;
import com.example.ubo.ecommapi.mapper.CartItemMapper;
import com.example.ubo.ecommapi.repository.ArticleRepository;
import com.example.ubo.ecommapi.repository.CartItemRepository;
import jakarta.inject.Inject;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

import static com.example.ubo.ecommapi.mapper.CartItemMapper.toDto;
import static com.example.ubo.ecommapi.mapper.CartItemMapper.toEntity;

@Component
public class CartItemBusiness {

    @Inject
    private CartItemRepository cartItemRepository;

    @Inject
    private ArticleRepository articleRepository;

    public CartItemEntity createCartItem(CartItemEntity cartItem) {
        var article = articleRepository.getArticleById(cartItem.getArticleId());
        if(article == null) return null;
        cartItem.setPriceAtAdd(BigDecimal.ZERO); //TODO: Check if priceAtAdd have a real interest (fixed or dynamic pricing ?)
        return toEntity(cartItemRepository.addCartItem(toDto(cartItem)));
    }

    public CartItemEntity getCartItemById(String id) {
        return toEntity(cartItemRepository.getCartItemById(id));
    }

    public boolean deleteCartItem(String id) {
        return cartItemRepository.deleteCartItem(id);
    }

    public CartItemEntity updateCartItem(CartItemEntity cartItem) {
        return toEntity(cartItemRepository.updateCartItem(toDto(cartItem)));
    }

    public List<CartItemEntity> getCartItemsByUserId(String userId) {
        return cartItemRepository.getCartItemsByUserId(userId).stream()
                .map(CartItemMapper::toEntity)
                .toList();
    }

    public List<CartItemEntity> getAllCartItems() {
        return cartItemRepository.getAllCartItems().stream()
                .map(CartItemMapper::toEntity)
                .toList();
    }

    public boolean clearCartByUserId(String userId) {
        return cartItemRepository.clearCartByUserId(userId);
    }
}