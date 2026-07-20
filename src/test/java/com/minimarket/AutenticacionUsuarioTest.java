package com.minimarket;

import com.minimarket.entity.Rol;
import com.minimarket.entity.Usuario;
import com.minimarket.repository.UsuarioRepository;
import com.minimarket.security.service.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutenticacionUsuarioTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void autenticacionValidaRetornaUsuarioConRol() {
        Usuario usuario = new Usuario();
        usuario.setUsername("admin");
        usuario.setPassword("claveEncriptada");
        usuario.setRoles(Set.of(new Rol("ADMIN")));

        when(usuarioRepository.findByUsername("admin")).thenReturn(Optional.of(usuario));

        UserDetails resultado = customUserDetailsService.loadUserByUsername("admin");

        assertEquals("admin", resultado.getUsername());
        assertEquals("claveEncriptada", resultado.getPassword());
        assertTrue(resultado.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    void autenticacionInvalidaLanzaExcepcion() {
        when(usuarioRepository.findByUsername("desconocido")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername("desconocido"));
    }
}
