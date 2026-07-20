package com.minimarket.controller;

import com.minimarket.entity.Categoria;
import com.minimarket.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorías", description = "Microservicio para administrar categorías de productos")
@SecurityRequirement(name = "bearerAuth")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    @Operation(summary = "Listar categorías", description = "Obtiene todas las categorías registradas con enlaces HATEOAS.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Categorías obtenidas correctamente")})
    public CollectionModel<EntityModel<Categoria>> listarCategorias() {
        List<EntityModel<Categoria>> categorias = categoriaService.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(categorias,
                linkTo(methodOn(CategoriaController.class).listarCategorias()).withSelfRel(),
                linkTo(methodOn(CategoriaController.class).guardarCategoria(new Categoria())).withRel("crear-categoria"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar categoría por ID", description = "Obtiene una categoría específica por ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoría encontrada"),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    })
    public ResponseEntity<EntityModel<Categoria>> obtenerCategoriaPorId(@PathVariable Long id) {
        Categoria categoria = categoriaService.findById(id);
        return (categoria != null) ? ResponseEntity.ok(toModel(categoria)) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Crear categoría", description = "Registra una nueva categoría de productos.")
    public EntityModel<Categoria> guardarCategoria(@RequestBody Categoria categoria) {
        return toModel(categoriaService.save(categoria));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar categoría", description = "Actualiza una categoría existente.")
    public ResponseEntity<EntityModel<Categoria>> actualizarCategoria(@PathVariable Long id, @RequestBody Categoria categoria) {
        Categoria categoriaExistente = categoriaService.findById(id);
        if (categoriaExistente != null) {
            categoria.setId(id);
            return ResponseEntity.ok(toModel(categoriaService.save(categoria)));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar categoría", description = "Elimina una categoría por ID.")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        Categoria categoria = categoriaService.findById(id);
        if (categoria != null) {
            categoriaService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private EntityModel<Categoria> toModel(Categoria categoria) {
        return EntityModel.of(categoria,
                linkTo(methodOn(CategoriaController.class).obtenerCategoriaPorId(categoria.getId())).withSelfRel(),
                linkTo(methodOn(CategoriaController.class).listarCategorias()).withRel("categorias"),
                linkTo(methodOn(ProductoController.class).listarProductos()).withRel("productos"));
    }
}
