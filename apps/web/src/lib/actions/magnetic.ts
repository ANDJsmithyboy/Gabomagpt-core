/* GabomaGPT · magnetic.ts
   SmartANDJ AI Technologies · Constitution Zion Core
   Fondateur : Daniel Jonathan ANDJ
   Curseur magnétique — les boutons attirent le pointeur.
   Usage Svelte : <button use:magnetic>Send</button>
   Appliquer à : Send button, Mode switch pills, CTA, Login button */

import { gsap } from 'gsap';

export function magnetic(node: HTMLElement) {
	const strength = 0.3;
	const radius = 80;

	function onMouseMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = e.clientX - cx;
		const dy = e.clientY - cy;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist < radius) {
			const pull = (1 - dist / radius) * strength;
			gsap.to(node, {
				x: dx * pull,
				y: dy * pull,
				duration: 0.3,
				ease: 'power2.out'
			});
		} else {
			gsap.to(node, {
				x: 0,
				y: 0,
				duration: 0.5,
				ease: 'elastic.out(1, 0.5)'
			});
		}
	}

	function onMouseLeave() {
		gsap.to(node, {
			x: 0,
			y: 0,
			duration: 0.5,
			ease: 'elastic.out(1, 0.5)'
		});
	}

	window.addEventListener('mousemove', onMouseMove);
	node.addEventListener('mouseleave', onMouseLeave);

	return {
		destroy() {
			window.removeEventListener('mousemove', onMouseMove);
			node.removeEventListener('mouseleave', onMouseLeave);
		}
	};
}
