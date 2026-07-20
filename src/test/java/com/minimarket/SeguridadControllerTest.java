package com.minimarket;

import com.minimarket.controller.InventarioController;
import com.minimarket.controller.ProductoController;
import com.minimarket.controller.UsuarioController;
import com.minimarket.controller.VentaController;
import com.minimarket.entity.Inventario;
import com.minimarket.entity.Producto;
import com.minimarket.entity.Usuario;
import com.minimarket.entity.Venta;
import com.minimarket.security.config.SecurityConfig;
import com.minimarket.security.service.CustomUserDetailsService;
import com.minimarket.service.InventarioService;
import com.minimarket.service.ProductoService;
import com.minimarket.service.UsuarioService;
import com.minimarket.service.VentaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {
        ProductoController.class,
        InventarioController.class,
        VentaController.class,
        UsuarioController.class
})
@Import(SecurityConfig.class)
class SeguridadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductoService productoService;

    @MockBean
    private InventarioService inventarioService;

    @MockBean
    private VentaService ventaService;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void listarProductosSinAutenticacionDebeSerRechazado() throws Exception {
        mockMvc.perform(get("/api/productos")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void administradorPuedeModificarProducto() throws Exception {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Arroz");
        producto.setPrecio(1490.0);
        producto.setStock(30);

        when(productoService.findById(eq(1L))).thenReturn(producto);
        when(productoService.save(any(Producto.class))).thenReturn(producto);

        mockMvc.perform(put("/api/productos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre": "Arroz grado 1",
                                  "precio": 1590,
                                  "stock": 25
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CAJERO")
    void cajeroNoPuedeModificarProducto() throws Exception {
        mockMvc.perform(put("/api/productos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre": "Arroz grado 1",
                                  "precio": 1590,
                                  "stock": 25
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void administradorPuedeRegistrarMovimientoInventario() throws Exception {
        Inventario inventario = new Inventario();
        inventario.setId(1L);
        inventario.setCantidad(10);
        inventario.setTipoMovimiento("Entrada");
        inventario.setFechaMovimiento(new Date());

        when(inventarioService.save(any(Inventario.class))).thenReturn(inventario);

        mockMvc.perform(post("/api/inventario")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "cantidad": 10,
                                  "tipoMovimiento": "Entrada",
                                  "fechaMovimiento": "2026-06-28T10:00:00.000+00:00"
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void clienteNoPuedeRegistrarMovimientoInventario() throws Exception {
        mockMvc.perform(post("/api/inventario")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "cantidad": 10,
                                  "tipoMovimiento": "Entrada",
                                  "fechaMovimiento": "2026-06-28T10:00:00.000+00:00"
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CAJERO")
    void cajeroPuedeGenerarVenta() throws Exception {
        Venta venta = new Venta();
        venta.setId(1L);
        venta.setFecha(new Date());

        when(ventaService.save(any(Venta.class))).thenReturn(venta);

        mockMvc.perform(post("/api/ventas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fecha": "2026-06-28T10:00:00.000+00:00"
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void clienteNoPuedeGenerarVenta() throws Exception {
        mockMvc.perform(post("/api/ventas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fecha": "2026-06-28T10:00:00.000+00:00"
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void administradorPuedeConsultarUsuario() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setUsername("admin");
        usuario.setPassword("password");

        when(usuarioService.findById(eq(1L))).thenReturn(Optional.of(usuario));

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isOk());
    }
}
