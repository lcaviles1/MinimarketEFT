package com.minimarket.config;

import com.minimarket.entity.Categoria;
import com.minimarket.entity.Producto;
import com.minimarket.entity.Rol;
import com.minimarket.entity.Usuario;
import com.minimarket.repository.CategoriaRepository;
import com.minimarket.repository.ProductoRepository;
import com.minimarket.repository.RolRepository;
import com.minimarket.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner cargarDatosIniciales(
            RolRepository rolRepository,
            UsuarioRepository usuarioRepository,
            CategoriaRepository categoriaRepository,
            ProductoRepository productoRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            Rol admin = obtenerOCrearRol(rolRepository, "ADMIN");
            Rol cajero = obtenerOCrearRol(rolRepository, "CAJERO");
            Rol cliente = obtenerOCrearRol(rolRepository, "CLIENTE");

            crearUsuarioSiNoExiste(usuarioRepository, passwordEncoder, "admin", "admin123", admin);
            crearUsuarioSiNoExiste(usuarioRepository, passwordEncoder, "cajero", "cajero123", cajero);
            crearUsuarioSiNoExiste(usuarioRepository, passwordEncoder, "cliente", "cliente123", cliente);

            if (categoriaRepository.findAll().isEmpty()) {
                Categoria abarrotes = new Categoria();
                abarrotes.setNombre("Abarrotes");
                categoriaRepository.save(abarrotes);

                Producto arroz = new Producto();
                arroz.setNombre("Arroz 1kg");
                arroz.setPrecio(1590.0);
                arroz.setStock(50);
                arroz.setCategoria(abarrotes);
                productoRepository.save(arroz);
            }
        };
    }

    private Rol obtenerOCrearRol(RolRepository rolRepository, String nombre) {
        return rolRepository.findAll().stream()
                .filter(rol -> rol.getNombre().equals(nombre))
                .findFirst()
                .orElseGet(() -> rolRepository.save(new Rol(nombre)));
    }

    private void crearUsuarioSiNoExiste(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, String username, String password, Rol rol) {
        boolean existe = usuarioRepository.findAll().stream()
                .anyMatch(usuario -> usuario.getUsername().equals(username));
        if (!existe) {
            Usuario usuario = new Usuario();
            usuario.setUsername(username);
            usuario.setPassword(passwordEncoder.encode(password));
            usuario.setRoles(Set.of(rol));
            usuarioRepository.save(usuario);
        }
    }
}
