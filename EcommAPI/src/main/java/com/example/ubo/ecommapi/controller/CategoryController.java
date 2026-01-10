package com.example.ubo.ecommapi.controller;

import com.example.ubo.ecommapi.business.CategoryBusiness;
import com.example.ubo.ecommapi.entity.CategoryEntity;
import com.example.ubo.ecommapi.filters.AdminRequired;
import com.example.ubo.ecommapi.filters.AuthenticationRequired;
import com.example.ubo.ecommapi.mapper.CategoryMapper;
import dto.ecommapi.Category;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Controller;

import static com.example.ubo.ecommapi.mapper.CategoryMapper.toDto;
import static com.example.ubo.ecommapi.mapper.CategoryMapper.toEntity;

@Controller
@Path("/")
public class CategoryController {

    private final CategoryBusiness categoryBusiness;

    public CategoryController(CategoryBusiness categoryBusiness) {
        this.categoryBusiness = categoryBusiness;
    }

    // ==================== PUBLIC ROUTES ====================

    @GET
    @Path("/categories")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategories() {
        var categories = categoryBusiness
                .getAllCategories()
                .stream()
                .map(CategoryMapper::toDto)
                .toList();
        return Response.ok(categories).build();
    }

    @GET
    @Path("/categories/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCategoryById(@PathParam("id") String id) {
        CategoryEntity category = this.categoryBusiness.getCategoryById(id);
        return Response.ok(toDto(category)).build();
    }

    // ==================== ADMIN ROUTES ====================

    @POST
    @Path("/admin/categories")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @AuthenticationRequired
    @AdminRequired
    public Response createCategory(Category category) {
        //Read POST request of CartItemController or ArticleController to understand this double mapping
        var created = toDto(this.categoryBusiness.createCategory(toEntity(category)));
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/admin/categories/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @AuthenticationRequired
    @AdminRequired
    public Response updateCategory(@PathParam("id") String id, Category category) {
        CategoryEntity updatedCategory = this.categoryBusiness.updateCategory(toEntity(category));
        return Response.ok(toDto(updatedCategory)).build();
    }

    @DELETE
    @Path("/admin/categories/{id}")
    @AuthenticationRequired
    @AdminRequired
    public Response deleteCategory(@PathParam("id") String id) {
        boolean deleted = this.categoryBusiness.deleteCategory(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}