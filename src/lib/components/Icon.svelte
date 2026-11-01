<script lang="ts" module>
	// 24x24 stroke icons, drawn with currentColor
	const PATHS = {
		rules:
			'M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 7h6M9 10.5h6',
		trophy:
			'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3.5 4M16 6h3a3 3 0 0 1-3.5 4M12 13v4M8 21h8M9.5 17h5v4h-5z',
		eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z',
		sound: 'M4 9h4l5-4v14l-5-4H4zM16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11',
		muted: 'M4 9h4l5-4v14l-5-4H4zM17 9.5l5 5M22 9.5l-5 5',
		restart: 'M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v4.5H9',
		undo: 'M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
		crown: 'M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z',
		deck: 'M8 3h10a2 2 0 0 1 2 2v13M5 6h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
		star: 'M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.3-5.5-2.9-5.5 2.9 1-6.3L3 9.7l6.2-.9z',
		alert: 'M12 3 22 20H2zM12 10v4.5M12 17v.5',
		loading: 'M12 3a9 9 0 1 0 9 9',
		flag: 'M5 21V4M5 4h12l-2.5 4.5L17 13H5'
	} as const;

	export type IconName = keyof typeof PATHS;
</script>

<script lang="ts">
	interface Props {
		name: IconName;
		size?: number;
		filled?: boolean; // Fill the shape as well as stroking it
	}

	let { name, size = 22, filled = false }: Props = $props();
</script>

<svg
	class="icon"
	class:spin={name === 'loading'}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill={filled ? 'currentColor' : 'none'}
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d={PATHS[name]} />
</svg>

<style>
	.icon {
		flex-shrink: 0;
	}

	.spin {
		animation: spin 0.9s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
