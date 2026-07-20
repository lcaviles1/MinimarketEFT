package com.minimarket.controller;

import com.minimarket.entity.Producto;
import com.minimarket.service.ProductoService;
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
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "Microservicio para la gestión de productos del minimarket")
@SecurityRequirement(name = "bearerAuth")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    @Operation(summary = "Listar productos", description = "Obtiene todos los productos registrados e incluye enlaces HATEOAS para navegar la API.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado de productos obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
    })
    public CollectionModel<EntityModel<Producto>> listarProductos() {
        List<EntityModel<Producto>> productos = productoService.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(productos,
                linkTo(methodOn(ProductoController.class).listarProductos()).withSelfRel(),
                linkTo(methodOn(ProductoController.class).guardarProducto(new Producto())).withRel("crear-producto"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar producto por ID", description = "Obtiene un producto específico por su identificador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto encontrado"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    public ResponseEntity<EntityModel<Producto>> obtenerProductoPorId(@PathVariable Long id) {
        Producto producto = productoService.findById(id);
        return (producto != null) ? ResponseEntity.ok(toModel(producto)) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Crear producto", description = "Registra un nuevo producto. Requiere rol ADMIN.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto creado correctamente"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permisos para crear productos")
    })
    public EntityModel<Producto> guardarProducto(@RequestBody Producto producto) {
        Producto guardado = productoService.save(producto);
        return toModel(guardado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto", description = "Actualiza un producto existente. Requiere rol ADMIN.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permisos")
    })
    public ResponseEntity<EntityModel<Producto>> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        Producto productoExistente = productoService.findById(id);
        if (productoExistente != null) {
            producto.setId(id);
            return ResponseEntity.ok(toModel(productoService.save(producto)));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar producto", description = "Elimina un producto por ID. Requiere rol ADMIN.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Producto eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permisos")
    })
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        Producto producto = productoService.findById(id);
        if (producto != null) {
            productoService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private EntityModel<Producto> toModel(Producto producto) {
        return EntityModel.of(producto,
                linkTo(methodOn(ProductoController.class).obtenerProductoPorId(producto.getId())).withSelfRel(),
                linkTo(methodOn(ProductoController.class).listarProductos()).withRel("productos"),
                linkTo(methodOn(CarritoController.class).listarCarrito()).withRel("carrito"),
                linkTo(methodOn(InventarioController.class).listarMovimientosDeInventario()).withRel("inventario"));
    }
}
