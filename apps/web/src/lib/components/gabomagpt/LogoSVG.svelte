<script lang="ts">
	/* GabomaGPT · LogoSVG.svelte · SmartANDJ AI Technologies
	   Logo 5 pétales SVG — Panthère, Perroquet, Dauphin, Masque, Éléphant */
	export let size: number = 32;
	export let animate: boolean = false;
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 32 32"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={animate ? 'animate-float' : ''}
	aria-label="Logo GabomaGPT"
>
	<!-- 5 pétales — couleurs officielles GabomaGPT -->
	<ellipse cx="16" cy="7" rx="7" ry="9" fill="#22C55E" opacity=".92" transform="rotate(-18 16 7)" />
	<ellipse cx="25" cy="16" rx="7" ry="9" fill="#38BDF8" opacity=".92" transform="rotate(54 25 16)" />
	<ellipse cx="21" cy="26" rx="7" ry="9" fill="#7C3AED" opacity=".92" transform="rotate(126 21 26)" />
	<ellipse cx="11" cy="26" rx="7" ry="9" fill="#EF4444" opacity=".92" transform="rotate(198 11 26)" />
	<ellipse cx="7" cy="16" rx="7" ry="9" fill="#FACC15" opacity=".92" transform="rotate(270 7 16)" />
	<!-- Centre lumineux -->
	<circle cx="16" cy="16" r="4.5" fill="white" opacity=".96" />
</svg>

<style>
	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-6px); }
	}
	.animate-float {
		animation: float 3s ease-in-out infinite;
	}
</style>
