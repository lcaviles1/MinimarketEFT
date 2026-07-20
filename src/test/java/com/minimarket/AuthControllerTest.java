package com.minimarket;

import com.minimarket.controller.AuthController;
import com.minimarket.security.model.JwtResponse;
import com.minimarket.security.model.LoginRequest;
import com.minimarket.security.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private Authentication authentication;

    @Test
    void loginValidoRetornaJwt() {
        UserDetails userDetails = User.withUsername("admin")
                .password("admin123")
                .roles("ADMIN")
                .build();

        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("admin123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("token-jwt-prueba");

        AuthController controller = new AuthController(authenticationManager, jwtUtil);
        ResponseEntity<JwtResponse> response = controller.login(request);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("token-jwt-prueba", response.getBody().getToken());
        assertEquals("Bearer", response.getBody().getTipo());
        assertEquals("admin", response.getBody().getUsername());
    }
}
