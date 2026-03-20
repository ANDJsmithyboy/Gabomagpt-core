import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['panther', { pattern: /data-theme-.+/ }],
	theme: {
		extend: {
			colors: {
				gabon: {
					green: '#22C55E',
					blue: '#38BDF8',
					yellow: '#FACC15',
					red: '#EF4444',
					purple: '#7C3AED',
					gold: '#D4A417',
					neon: '#00FF87',
					orange: '#FF6B00'
				},
				surface: {
					primary: 'var(--bg-primary)',
					DEFAULT: 'var(--bg-surface)',
					2: 'var(--bg-surface-2)',
					3: 'var(--bg-surface-3)'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)'
				},
				border: {
					DEFAULT: 'var(--border)',
					hover: 'var(--border-hover)',
					focus: 'var(--border-focus)'
				},
				txt: {
					primary: 'var(--text-primary)',
					secondary: 'var(--text-secondary)',
					tertiary: 'var(--text-tertiary)'
				}
			},
			fontFamily: {
				display: ['Outfit', 'sans-serif'],
				body: ['Sora', 'sans-serif'],
				mono: ['JetBrains Mono', 'Space Mono', 'monospace']
			},
			borderRadius: {
				'2xl': '16px',
				'3xl': '24px',
				'4xl': '32px'
			},
			spacing: {
				18: '4.5rem',
				88: '22rem'
			},
			transitionDuration: {
				DEFAULT: '200ms'
			},
			transitionTimingFunction: {
				'ios': 'cubic-bezier(0.32, 0.72, 0, 1)',
				'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)'
			},
			boxShadow: {
				'sm': '0 1px 2px rgba(0,0,0,0.4)',
				'md': '0 4px 16px rgba(0,0,0,0.5)',
				'lg': '0 12px 40px rgba(0,0,0,0.6)',
				'accent': '0 4px 20px color-mix(in srgb, var(--accent) 40%, transparent)',
				'glow-gold': '0 0 24px rgba(212,164,23,0.3)',
				'glow-neon': '0 0 24px rgba(0,255,135,0.2)'
			},
			animation: {
				'blink': 'blink 1.4s ease-in-out infinite',
				'slide-up': 'slide-up 300ms cubic-bezier(0.32, 0.72, 0, 1)',
				'slide-down': 'slide-down 300ms cubic-bezier(0.32, 0.72, 0, 1)',
				'fade-in': 'fade-in 200ms ease',
				'scale-in': 'scale-in 200ms ease',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite'
			},
			keyframes: {
				blink: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.3' }
				},
				'slide-up': {
					from: { transform: 'translateY(16px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					from: { transform: 'translateY(-8px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 4px 20px color-mix(in srgb, var(--accent) 40%, transparent)' },
					'50%': { boxShadow: '0 4px 30px color-mix(in srgb, var(--accent) 55%, transparent)' }
				}
			},
			typography: {
				DEFAULT: {
					css: {
						pre: false,
						code: false,
						'pre code': false,
						'code::before': false,
						'code::after': false
					}
				}
			},
			padding: {
				'safe-bottom': 'env(safe-area-inset-bottom)'
			},
			transitionProperty: {
				width: 'width'
			}
		}
	},
	plugins: [
		typography,
		containerQueries,
		plugin(function ({ addVariant }) {
			addVariant('panther', 'body.panther &');
		})
	]
};
