export default function TopBar({ titulo, subtitulo, accion }) {
  return (
    <header className="sticky top-0 z-30">
      <div className="bg-awning text-paper px-4 pt-[calc(env(safe-area-inset-top)+14px)] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl leading-tight tracking-tight">{titulo}</h1>
          {subtitulo && <p className="text-paper/70 text-xs font-body mt-0.5">{subtitulo}</p>}
        </div>
        {accion}
      </div>
      <div className="ticket-edge" />
    </header>
  );
}
