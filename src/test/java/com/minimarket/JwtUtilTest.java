package com.minimarket;

import com.minimarket.security.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtUtilTest {

    private final JwtUtil jwtUtil = new JwtUtil();

    @Test
    void generarTokenPermiteExtraerUsername() {
        UserDetails userDetails = User.withUsername("admin")
                .password("password")
                .roles("ADMIN")
                .build();

        String token = jwtUtil.generateToken(userDetails);

        assertEquals("admin", jwtUtil.extractUsername(token));
    }

    @Test
    void tokenValidoParaUsuarioCorrecto() {
        UserDetails userDetails = User.withUsername("cajero")
                .password("password")
                .roles("CAJERO")
                .build();

        String token = jwtUtil.generateToken(userDetails);

        assertTrue(jwtUtil.isTokenValid(token, userDetails));
    }

    @Test
    void tokenNoEsValidoParaOtroUsuario() {
        UserDetails cajero = User.withUsername("cajero")
                .password("password")
                .roles("CAJERO")
                .build();
        UserDetails cliente = User.withUsername("cliente")
                .password("password")
                .roles("CLIENTE")
                .build();

        String token = jwtUtil.generateToken(cajero);

        assertFalse(jwtUtil.isTokenValid(token, cliente));
    }
}
