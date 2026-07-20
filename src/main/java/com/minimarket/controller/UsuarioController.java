package com.minimarket.controller;

import com.minimarket.entity.Usuario;
import com.minimarket.service.UsuarioService;
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
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Microservicio para administrar usuarios y roles del sistema")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Obtiene todos los usuarios registrados. Requiere rol ADMIN.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuarios listados correctamente"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permisos")
    })
    public CollectionModel<EntityModel<Usuario>> listarUsuarios() {
        List<EntityModel<Usuario>> usuarios = usuarioService.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(usuarios,
                linkTo(methodOn(UsuarioController.class).listarUsuarios()).withSelfRel(),
                linkTo(methodOn(UsuarioController.class).guardarUsuario(new Usuario())).withRel("crear-usuario"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar usuario por ID", description = "Obtiene un usuario registrado por ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<EntityModel<Usuario>> obtenerUsuarioPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.findById(id);
        return usuario.map(value -> ResponseEntity.ok(toModel(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear usuario", description = "Registra un nuevo usuario del sistema. Requiere rol ADMIN.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario creado correctamente"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permisos")
    })
    public EntityModel<Usuario> guardarUsuario(@RequestBody Usuario usuario) {
        return toModel(usuarioService.save(usuario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente.")
    public ResponseEntity<EntityModel<Usuario>> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        Optional<Usuario> usuarioExistente = usuarioService.findById(id);
        if (usuarioExistente.isPresent()) {
            usuario.setId(id);
            return ResponseEntity.ok(toModel(usuarioService.save(usuario)));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema por ID.")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.findById(id);
        if (usuario.isPresent()) {
            usuarioService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private EntityModel<Usuario> toModel(Usuario usuario) {
        return EntityModel.of(usuario,
                linkTo(methodOn(UsuarioController.class).obtenerUsuarioPorId(usuario.getId())).withSelfRel(),
                linkTo(methodOn(UsuarioController.class).listarUsuarios()).withRel("usuarios"),
                linkTo(methodOn(CarritoController.class).listarCarrito()).withRel("carrito"),
                linkTo(methodOn(ProductoController.class).listarProductos()).withRel("productos"));
    }
}
