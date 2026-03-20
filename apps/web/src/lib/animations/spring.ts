/* GabomaGPT · spring.ts
   SmartANDJ AI Technologies · Constitution Zion Core
   Fondateur : Daniel Jonathan ANDJ
   Animations spring physics — niveau Apple.
   Chaque élément rebondit légèrement au-delà de sa cible. */

import { gsap } from 'gsap';

/** Spring In — apparition élastique (messages, cards, modals, sidebar items) */
export const springIn = (el: Element) => {
	gsap.fromTo(
		el,
		{ opacity: 0, y: 12, scale: 0.95 },
		{
			opacity: 1,
			y: 0,
			scale: 1,
			duration: 0.5,
			ease: 'elastic.out(1, 0.6)'
		}
	);
};

/** Spring Out — disparition avec compression */
export const springOut = (el: Element) => {
	gsap.to(el, {
		opacity: 0,
		y: -8,
		scale: 0.96,
		duration: 0.25,
		ease: 'power2.in'
	});
};

/** Spring Button — compression au mousedown, rebond élastique au mouseup */
export const springButton = (el: Element) => {
	const htmlEl = el as HTMLElement;

	const onDown = () => {
		gsap.to(htmlEl, { scale: 0.96, duration: 0.08, ease: 'power2.out' });
	};

	const onUp = () => {
		gsap.to(htmlEl, {
			scale: 1,
			duration: 0.4,
			ease: 'elastic.out(1.2, 0.5)'
		});
	};

	htmlEl.addEventListener('mousedown', onDown);
	htmlEl.addEventListener('mouseup', onUp);
	htmlEl.addEventListener('mouseleave', onUp);
	htmlEl.addEventListener('touchstart', onDown, { passive: true });
	htmlEl.addEventListener('touchend', onUp, { passive: true });

	return {
		destroy() {
			htmlEl.removeEventListener('mousedown', onDown);
			htmlEl.removeEventListener('mouseup', onUp);
			htmlEl.removeEventListener('mouseleave', onUp);
			htmlEl.removeEventListener('touchstart', onDown);
			htmlEl.removeEventListener('touchend', onUp);
		}
	};
};

/** Spring Scale — animation de scale pour les toggles / switches */
export const springScale = (el: Element, from = 0.85) => {
	gsap.fromTo(
		el,
		{ scale: from, opacity: 0 },
		{
			scale: 1,
			opacity: 1,
			duration: 0.45,
			ease: 'elastic.out(1, 0.5)'
		}
	);
};
