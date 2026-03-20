/* GabomaGPT · ambientLight.ts
   SmartANDJ AI Technologies · Constitution Zion Core
   Fondateur : Daniel Jonathan ANDJ
   Lumière ambiante — les cartes réfléchissent la souris.
   Usage Svelte : <div use:ambientLight class="metric-card">
   Appliquer à : admin metric cards, conversation cards, pricing cards, suggestions */

import { gsap } from 'gsap';

export function ambientLight(node: HTMLElement) {
	node.style.transformStyle = 'preserve-3d';
	node.style.transition = 'transform 0.1s ease';

	function onMouseMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		const tiltX = y * -8;
		const tiltY = x * 8;

		node.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

		node.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%,
			rgba(255,255,255,0.04) 0%, transparent 60%), var(--bg-surface)`;
	}

	function onMouseLeave() {
		gsap.to(node, {
			rotateX: 0,
			rotateY: 0,
			duration: 0.6,
			ease: 'elastic.out(1, 0.5)'
		});
		node.style.background = 'var(--bg-surface)';
	}

	node.addEventListener('mousemove', onMouseMove);
	node.addEventListener('mouseleave', onMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mousemove', onMouseMove);
			node.removeEventListener('mouseleave', onMouseLeave);
		}
	};
}
