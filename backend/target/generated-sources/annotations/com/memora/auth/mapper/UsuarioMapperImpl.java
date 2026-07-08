package com.memora.auth.mapper;

import com.memora.auth.dto.PerfilResponse;
import com.memora.auth.entity.Usuario;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-08T08:44:53-0300",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class UsuarioMapperImpl implements UsuarioMapper {

    @Override
    public PerfilResponse toPerfilResponse(Usuario usuario) {
        if ( usuario == null ) {
            return null;
        }

        UUID id = null;
        String nome = null;
        String email = null;
        String nomeDaPet = null;
        String corTema = null;

        id = usuario.getId();
        nome = usuario.getNome();
        email = usuario.getEmail();
        nomeDaPet = usuario.getNomeDaPet();
        corTema = usuario.getCorTema();

        PerfilResponse perfilResponse = new PerfilResponse( id, nome, email, nomeDaPet, corTema );

        return perfilResponse;
    }
}
