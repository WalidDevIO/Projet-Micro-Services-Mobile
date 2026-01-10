package com.example.ubo.ecommapi.controller;

import com.example.ubo.ecommapi.business.CartItemBusiness;
import com.example.ubo.ecommapi.entity.CartItemEntity;
import com.example.ubo.ecommapi.filters.AuthenticationRequired;
import com.example.ubo.ecommapi.mapper.CartItemMapper;
import dto.ecommapi.CartItem;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.springframework.stereotype.Controller;

import static com.example.ubo.ecommapi.mapper.CartItemMapper.toDto;
import static com.example.ubo.ecommapi.mapper.CartItemMapper.toEntity;

@Controller
@Path("/cart")
@AuthenticationRequired
public class CartItemController {

    private final CartItemBusiness cartItemBusiness;

    public CartItemController(CartItemBusiness cartItemBusiness) {
        this.cartItemBusiness = cartItemBusiness;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCart(@Context SecurityContext securityContext) {
        String userId = securityContext.getUserPrincipal().getName();

        var cartItems = cartItemBusiness
                .getCartItemsByUserId(userId)
                .stream()
                .map(CartItemMapper::toDto)
                .toList();

        return Response.ok(cartItems).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addToCart(@Context SecurityContext securityContext, CartItem cartItem) {
        String userId = securityContext.getUserPrincipal().getName();
        cartItem.setUserId(userId);

        //Another time instructions are instructions
        var created = toDto(this.cartItemBusiness.createCartItem(toEntity(cartItem)));
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{cartItemId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCartItem(
            @Context SecurityContext securityContext,
            @PathParam("cartItemId") String cartItemId,
            CartItem cartItem) {

        String userId = securityContext.getUserPrincipal().getName();
        cartItem.setId(cartItemId);
        cartItem.setUserId(userId);

        CartItemEntity updatedCartItem = this.cartItemBusiness.updateCartItem(toEntity(cartItem));
        return Response.ok(toDto(updatedCartItem)).build();
    }

    @DELETE
    @Path("/{cartItemId}")
    public Response deleteCartItem(
            @Context SecurityContext securityContext,
            @PathParam("cartItemId") String cartItemId) {

        boolean deleted = this.cartItemBusiness.deleteCartItem(cartItemId);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @DELETE
    public Response clearCart(@Context SecurityContext securityContext) {
        String userId = securityContext.getUserPrincipal().getName();
        boolean cleared = this.cartItemBusiness.clearCartByUserId(userId);

        if (cleared) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}