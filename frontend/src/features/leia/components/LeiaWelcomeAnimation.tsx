interface LeiaWelcomeAnimationProps {
  /** Tamanho em px (largura = altura, a animação é quadrada). */
  size?: number;
  className?: string;
}

/**
 * Clipe animado da Leia usado nas telas públicas (login, registro,
 * recuperar senha) como boas-vindas — substitui o LeiaMascot estático
 * do AuthLayout por um vídeo curto em loop (webm com fallback mp4).
 *
 * O vídeo é mudo, autoplay e em loop, então funciona como um "gif":
 * nenhuma interação do usuário é necessária para reproduzi-lo.
 */
export function LeiaWelcomeAnimation({ size = 128, className }: LeiaWelcomeAnimationProps) {
  return (
    <video
      className={className}
      style={{ width: size, height: size }}
      autoPlay
      loop
      muted
      playsInline
      disablePictureInPicture
      aria-label="Animação de boas-vindas da Leia"
    >
      <source src="/leia/leia-boas-vindas.webm" type="video/webm" />
      <source src="/leia/leia-boas-vindas.mp4" type="video/mp4" />
    </video>
  );
}
