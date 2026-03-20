/* GabomaGPT · stagger.ts
   SmartANDJ AI Technologies · Constitution Zion Core
   Fondateur : Daniel Jonathan ANDJ
   Stagger reveal — les éléments enfants apparaissent en cascade.
   Utilisé pour : conversation list, messages, admin table rows, suggestions. */

import { gsap } from 'gsap';

/** Stagger Reveal — enfants du container apparaissent en séquence */
export const staggerReveal = (container: string | Element) => {
	const selector = typeof container === 'string' ? `${container} > *` : container.children;

	gsap.fromTo(
		selector,
		{ opacity: 0, y: 8 },
		{
			opacity: 1,
			y: 0,
			duration: 0.35,
			stagger: 0.045,
			ease: 'power2.out'
		}
	);
};

/** Stagger Fade — version plus subtile pour les listes longues */
export const staggerFade = (container: string | Element, delay = 0) => {
	const selector = typeof container === 'string' ? `${container} > *` : container.children;

	gsap.fromTo(
		selector,
		{ opacity: 0 },
		{
			opacity: 1,
			duration: 0.3,
			stagger: 0.03,
			delay,
			ease: 'power1.out'
		}
	);
};
