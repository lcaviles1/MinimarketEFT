package com.minimarket.controller;

import com.minimarket.entity.DetalleVenta;
import com.minimarket.service.DetalleVentaService;
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
@RequestMapping("/api/detalle-ventas")
@Tag(name = "Detalle de ventas", description = "Microservicio para consultar y administrar el detalle de cada venta")
@SecurityRequirement(name = "bearerAuth")
public class DetalleVentaController {

    @Autowired
    private DetalleVentaService detalleVentaService;

    @GetMapping
    @Operation(summary = "Listar detalle de ventas", description = "Obtiene los detalles de ventas registrados con enlaces HATEOAS.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Detalles obtenidos correctamente")})
    public CollectionModel<EntityModel<DetalleVenta>> listarDetalleVentas() {
        List<EntityModel<DetalleVenta>> detalles = detalleVentaService.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(detalles,
                linkTo(methodOn(DetalleVentaController.class).listarDetalleVentas()).withSelfRel(),
                linkTo(methodOn(DetalleVentaController.class).guardarDetalleVenta(new DetalleVenta())).withRel("crear-detalle"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar detalle de venta por ID", description = "Obtiene un detalle de venta específico.")
    public ResponseEntity<EntityModel<DetalleVenta>> obtenerDetalleVentaPorId(@PathVariable Long id) {
        DetalleVenta detalleVenta = detalleVentaService.findById(id);
        return (detalleVenta != null) ? ResponseEntity.ok(toModel(detalleVenta)) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Crear detalle de venta", description = "Registra productos, cantidades y precios asociados a una venta.")
    public EntityModel<DetalleVenta> guardarDetalleVenta(@RequestBody DetalleVenta detalleVenta) {
        return toModel(detalleVentaService.save(detalleVenta));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar detalle de venta", description = "Actualiza un detalle de venta existente.")
    public ResponseEntity<EntityModel<DetalleVenta>> actualizarDetalleVenta(@PathVariable Long id, @RequestBody DetalleVenta detalleVenta) {
        DetalleVenta existente = detalleVentaService.findById(id);
        if (existente != null) {
            detalleVenta.setId(id);
            return ResponseEntity.ok(toModel(detalleVentaService.save(detalleVenta)));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar detalle de venta", description = "Elimina un detalle de venta por ID.")
    public ResponseEntity<Void> eliminarDetalleVenta(@PathVariable Long id) {
        DetalleVenta detalleVenta = detalleVentaService.findById(id);
        if (detalleVenta != null) {
            detalleVentaService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private EntityModel<DetalleVenta> toModel(DetalleVenta detalleVenta) {
        return EntityModel.of(detalleVenta,
                linkTo(methodOn(DetalleVentaController.class).obtenerDetalleVentaPorId(detalleVenta.getId())).withSelfRel(),
                linkTo(methodOn(DetalleVentaController.class).listarDetalleVentas()).withRel("detalle-ventas"),
                linkTo(methodOn(VentaController.class).listarVentas()).withRel("ventas"),
                linkTo(methodOn(ProductoController.class).listarProductos()).withRel("productos"));
    }
}
