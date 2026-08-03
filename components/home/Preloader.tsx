/**
 * Markup del preloader (la animación vive en HomeFx). Server component:
 * se server-renderiza para que el primer paint sea crema, sin flash.
 * ⚠️ El trazo del isologo F es provisorio: reemplazar el path por el SVG
 * oficial del logo cuando el cliente entregue el vectorial.
 */
export default function Preloader() {
  return (
    <>
      <noscript>
        <style>{`#preloader,#counter{display:none}#hero h1 .w span{transform:none}`}</style>
      </noscript>
      <div id="preloader">
        <svg className="fmark" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M78 14 H34 Q14 14 14 34 V72 Q14 86 28 86 H66 Q80 86 84 74 M34 38 H66 M34 38 V72 M34 56 H58" />
        </svg>
      </div>
      <div id="counter">0</div>
    </>
  );
}
