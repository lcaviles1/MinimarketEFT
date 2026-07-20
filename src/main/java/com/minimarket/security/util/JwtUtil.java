package com.minimarket.security.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JwtUtil {

    private static final String SECRET = "MiniMarketPlusEFT2026ClaveSeguraParaJWT";
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final long EXPIRATION_SECONDS = 60 * 60 * 4;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateToken(UserDetails userDetails) {
        try {
            long now = Instant.now().getEpochSecond();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            Map<String, Object> header = new HashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            Map<String, Object> payload = new HashMap<>();
            payload.put("sub", userDetails.getUsername());
            payload.put("roles", roles);
            payload.put("iat", now);
            payload.put("exp", now + EXPIRATION_SECONDS);

            String encodedHeader = encodeJson(header);
            String encodedPayload = encodeJson(payload);
            String unsignedToken = encodedHeader + "." + encodedPayload;
            String signature = sign(unsignedToken);

            return unsignedToken + "." + signature;
        } catch (Exception e) {
            throw new IllegalStateException("No fue posible generar el token JWT", e);
        }
    }

    public String extractUsername(String token) {
        return extractPayload(token).get("sub").toString();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token) && isSignatureValid(token);
    }

    public List<String> extractRoles(String token) {
        Object roles = extractPayload(token).get("roles");
        if (roles instanceof List<?> listaRoles) {
            return listaRoles.stream().map(Object::toString).toList();
        }
        return List.of();
    }

    private boolean isTokenExpired(String token) {
        Object expiration = extractPayload(token).get("exp");
        long exp = Long.parseLong(expiration.toString());
        return Instant.now().getEpochSecond() > exp;
    }

    private boolean isSignatureValid(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }
        String unsignedToken = parts[0] + "." + parts[1];
        return sign(unsignedToken).equals(parts[2]);
    }

    private Map<String, Object> extractPayload(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Token JWT inválido");
            }
            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            return objectMapper.readValue(decoded, new TypeReference<>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("No fue posible leer el token JWT", e);
        }
    }

    private String encodeJson(Map<String, Object> data) throws Exception {
        byte[] json = objectMapper.writeValueAsBytes(data);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(json);
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec keySpec = new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            mac.init(keySpec);
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("No fue posible firmar el token JWT", e);
        }
    }
}
