package com.example.ubo.ecommapi.controller;

import com.example.ubo.ecommapi.business.ArticleBusiness;
import com.example.ubo.ecommapi.entity.ArticleEntity;
import com.example.ubo.ecommapi.filters.AdminRequired;
import com.example.ubo.ecommapi.mapper.ArticleMapper;
import dto.ecommapi.Article;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Controller;

import java.util.List;

import static com.example.ubo.ecommapi.mapper.ArticleMapper.toDto;
import static com.example.ubo.ecommapi.mapper.ArticleMapper.toEntity;

@Controller
@Path("/")
public class ArticleController {

    private final ArticleBusiness articleBusiness;

    public ArticleController(ArticleBusiness articleBusiness) {
        this.articleBusiness = articleBusiness;
    }

    // ==================== PUBLIC ROUTES ====================

    @GET
    @Path("/articles")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllArticles(@QueryParam("categoryId") String categoryId) {
        List<ArticleEntity> articles;

        if (categoryId != null && !categoryId.isEmpty()) {
            articles = articleBusiness.getArticlesByCategory(categoryId);
        } else {
            articles = articleBusiness.getAllArticles();
        }

        var articlesDto = articles.stream()
                .map(ArticleMapper::toDto)
                .toList();

        return Response.ok(articlesDto).build();
    }

    @GET
    @Path("/articles/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getArticleById(@PathParam("id") String id) {
        ArticleEntity article = this.articleBusiness.getArticleById(id);
        return Response.ok(toDto(article)).build();
    }

    // ==================== ADMIN ROUTES ====================

    @POST
    @Path("/admin/articles")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @AdminRequired
    public Response createArticle(Article article) {
        this.articleBusiness.createArticle(toEntity(article));
        return Response.status(Response.Status.CREATED).entity(article).build();
    }

    @PUT
    @Path("/admin/articles/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @AdminRequired
    public Response updateArticle(@PathParam("id") String id, Article article) {
        ArticleEntity updatedArticle = this.articleBusiness.updateArticle(toEntity(article));
        return Response.ok(toDto(updatedArticle)).build();
    }

    @DELETE
    @Path("/admin/articles/{id}")
    @AdminRequired
    public Response deleteArticle(@PathParam("id") String id) {
        boolean deleted = this.articleBusiness.deleteArticle(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}