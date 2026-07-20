package com.minimarket.controller;

import com.minimarket.entity.Venta;
import com.minimarket.service.VentaService;
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
@RequestMapping("/api/ventas")
@Tag(name = "Ventas", description = "Microservicio para registrar y consultar ventas del minimarket")
@SecurityRequirement(name = "bearerAuth")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @GetMapping
    @Operation(summary = "Listar ventas", description = "Obtiene todas las ventas registradas con enlaces HATEOAS.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ventas obtenidas correctamente"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
    })
    public CollectionModel<EntityModel<Venta>> listarVentas() {
        List<EntityModel<Venta>> ventas = ventaService.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(ventas,
                linkTo(methodOn(VentaController.class).listarVentas()).withSelfRel(),
                linkTo(methodOn(VentaController.class).guardarVenta(new Venta())).withRel("registrar-venta"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar venta por ID", description = "Obtiene una venta específica por su identificador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Venta encontrada"),
            @ApiResponse(responseCode = "404", description = "Venta no encontrada")
    })
    public ResponseEntity<EntityModel<Venta>> obtenerVentaPorId(@PathVariable Long id) {
        Venta venta = ventaService.findById(id);
        return (venta != null) ? ResponseEntity.ok(toModel(venta)) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Registrar venta", description = "Registra una nueva venta. Requiere rol CAJERO o ADMIN.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Venta registrada correctamente"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permisos para registrar ventas")
    })
    public EntityModel<Venta> guardarVenta(@RequestBody Venta venta) {
        return toModel(ventaService.save(venta));
    }

    private EntityModel<Venta> toModel(Venta venta) {
        return EntityModel.of(venta,
                linkTo(methodOn(VentaController.class).obtenerVentaPorId(venta.getId())).withSelfRel(),
                linkTo(methodOn(VentaController.class).listarVentas()).withRel("ventas"),
                linkTo(methodOn(ProductoController.class).listarProductos()).withRel("productos"),
                linkTo(methodOn(CarritoController.class).listarCarrito()).withRel("carrito"));
    }
}
