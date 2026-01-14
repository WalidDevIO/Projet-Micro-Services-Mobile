package com.example.ubo.ecommapi.business;

import com.example.ubo.ecommapi.entity.CategoryEntity;
import com.example.ubo.ecommapi.repository.CategoryRepository;
import dto.ecommapi.Category;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.example.ubo.ecommapi.mapper.CategoryMapper.toDto;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CategoryBusinessTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryBusiness categoryBusiness;

    @Test
    public void testCreateCategoryOk() {
        Category category = new Category()
                .name("Tech")
                .description("Objet technique");
        when(categoryRepository.addCategory(any())).thenReturn(category);

        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setName("Tech");
        categoryEntity.setDescription("Objet technique");

        categoryEntity = categoryBusiness.createCategory(categoryEntity);

        assertEquals(category, toDto(categoryEntity));
    }

}
