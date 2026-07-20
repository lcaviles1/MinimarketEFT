package com.minimarket.controller;

import com.minimarket.entity.Inventario;
import com.minimarket.service.InventarioService;
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
@RequestMapping("/api/inventario")
@Tag(name = "Inventario", description = "Microservicio para registrar y consultar movimientos de stock")
@SecurityRequirement(name = "bearerAuth")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @GetMapping
    @Operation(summary = "Listar movimientos de inventario", description = "Obtiene todos los movimientos de entrada y salida de stock.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Movimientos obtenidos correctamente")})
    public CollectionModel<EntityModel<Inventario>> listarMovimientosDeInventario() {
        List<EntityModel<Inventario>> movimientos = inventarioService.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(movimientos,
                linkTo(methodOn(InventarioController.class).listarMovimientosDeInventario()).withSelfRel(),
                linkTo(methodOn(InventarioController.class).registrarMovimiento(new Inventario())).withRel("registrar-movimiento"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar movimiento por ID", description = "Obtiene un movimiento de inventario específico.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Movimiento encontrado"),
            @ApiResponse(responseCode = "404", description = "Movimiento no encontrado")
    })
    public ResponseEntity<EntityModel<Inventario>> obtenerMovimientoPorId(@PathVariable Long id) {
        Inventario inventario = inventarioService.findById(id);
        return (inventario != null) ? ResponseEntity.ok(toModel(inventario)) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Registrar movimiento de inventario", description = "Registra una entrada o salida de stock. Requiere rol ADMIN.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Movimiento registrado correctamente"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permisos")
    })
    public EntityModel<Inventario> registrarMovimiento(@RequestBody Inventario inventario) {
        return toModel(inventarioService.save(inventario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar movimiento", description = "Actualiza un movimiento de inventario existente.")
    public ResponseEntity<EntityModel<Inventario>> actualizarMovimiento(@PathVariable Long id, @RequestBody Inventario inventario) {
        Inventario existente = inventarioService.findById(id);
        if (existente != null) {
            inventario.setId(id);
            return ResponseEntity.ok(toModel(inventarioService.save(inventario)));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar movimiento", description = "Elimina un movimiento de inventario por ID.")
    public ResponseEntity<Void> eliminarMovimiento(@PathVariable Long id) {
        Inventario inventario = inventarioService.findById(id);
        if (inventario != null) {
            inventarioService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private EntityModel<Inventario> toModel(Inventario inventario) {
        return EntityModel.of(inventario,
                linkTo(methodOn(InventarioController.class).obtenerMovimientoPorId(inventario.getId())).withSelfRel(),
                linkTo(methodOn(InventarioController.class).listarMovimientosDeInventario()).withRel("inventario"),
                linkTo(methodOn(ProductoController.class).listarProductos()).withRel("productos"));
    }
}
