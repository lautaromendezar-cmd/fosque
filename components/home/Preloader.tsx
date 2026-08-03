import { ISO_D, ISO_VB } from '@/components/logo/paths';

/**
 * Markup del preloader (la animación vive en HomeFx). Server component:
 * se server-renderiza para que el primer paint sea crema, sin flash.
 * Usa el isologo F oficial vectorizado del manual de marca.
 */
export default function Preloader() {
  return (
    <>
      <noscript>
        <style>{`#preloader,#counter{display:none}#hero h1 .w span{transform:none}`}</style>
      </noscript>
      <div id="preloader">
        <svg className="fmark" viewBox={ISO_VB} aria-hidden="true">
          <path d={ISO_D} fillRule="evenodd" />
        </svg>
      </div>
      <div id="counter">0</div>
    </>
  );
}
