package com.minimarket.controller;

import com.minimarket.entity.Carrito;
import com.minimarket.service.CarritoService;
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
@RequestMapping("/api/carrito")
@Tag(name = "Carrito", description = "Microservicio para gestionar productos agregados al carrito de compra")
@SecurityRequirement(name = "bearerAuth")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @GetMapping
    @Operation(summary = "Listar carrito", description = "Obtiene los productos agregados al carrito con enlaces HATEOAS.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Carrito obtenido correctamente")})
    public CollectionModel<EntityModel<Carrito>> listarCarrito() {
        List<EntityModel<Carrito>> carrito = carritoService.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(carrito,
                linkTo(methodOn(CarritoController.class).listarCarrito()).withSelfRel(),
                linkTo(methodOn(CarritoController.class).agregarProductoAlCarrito(new Carrito())).withRel("agregar-producto"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar ítem del carrito", description = "Obtiene un registro del carrito por ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ítem encontrado"),
            @ApiResponse(responseCode = "404", description = "Ítem no encontrado")
    })
    public ResponseEntity<EntityModel<Carrito>> obtenerCarritoPorId(@PathVariable Long id) {
        Carrito carrito = carritoService.findById(id);
        return (carrito != null) ? ResponseEntity.ok(toModel(carrito)) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Agregar producto al carrito", description = "Agrega un producto al carrito de compra.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Producto agregado al carrito")})
    public EntityModel<Carrito> agregarProductoAlCarrito(@RequestBody Carrito carrito) {
        return toModel(carritoService.save(carrito));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar producto del carrito", description = "Elimina un ítem del carrito por ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Ítem eliminado"),
            @ApiResponse(responseCode = "404", description = "Ítem no encontrado")
    })
    public ResponseEntity<Void> eliminarProductoDelCarrito(@PathVariable Long id) {
        Carrito carrito = carritoService.findById(id);
        if (carrito != null) {
            carritoService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar carrito", description = "Actualiza la cantidad o producto de un ítem del carrito.")
    public ResponseEntity<EntityModel<Carrito>> actualizarCarrito(@PathVariable Long id, @RequestBody Carrito carrito) {
        Carrito existente = carritoService.findById(id);
        if (existente != null) {
            carrito.setId(id);
            return ResponseEntity.ok(toModel(carritoService.save(carrito)));
        }
        return ResponseEntity.notFound().build();
    }

    private EntityModel<Carrito> toModel(Carrito carrito) {
        return EntityModel.of(carrito,
                linkTo(methodOn(CarritoController.class).obtenerCarritoPorId(carrito.getId())).withSelfRel(),
                linkTo(methodOn(CarritoController.class).listarCarrito()).withRel("carrito"),
                linkTo(methodOn(ProductoController.class).listarProductos()).withRel("productos"));
    }
}
