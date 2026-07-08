package com.memora.auth.mapper;

import com.memora.auth.dto.PerfilResponse;
import com.memora.auth.entity.Usuario;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    PerfilResponse toPerfilResponse(Usuario usuario);
}
