/**
 * Kill The Royals - Audio Store
 * Background music management with mobile autoplay compliance
 */

import { writable } from 'svelte/store';
import type { AudioState } from '$lib/types';

const AUDIO_FILE_PATH = '/audio/background-music.mp3';
const FADE_IN_DURATION = 1000; // 1 second
const FADE_OUT_DURATION = 300; // 300ms for mute toggle

/**
 * AudioManager - Singleton class for managing background music
 * Uses HTML5 Audio + Web Audio API hybrid for smooth fade effects
 */
class AudioManager {
	private audio: HTMLAudioElement | null = null;
	private audioContext: AudioContext | null = null;
	private source: MediaElementAudioSourceNode | null = null;
	private gainNode: GainNode | null = null;
	private fadeTimeout: number | null = null;

	/**
	 * Initialize audio system on first user interaction
	 * Required for mobile browser autoplay policies
	 */
	init(): void {
		if (this.audio) return; // Already initialized

		try {
			// Create HTML5 Audio element
			this.audio = new Audio(AUDIO_FILE_PATH);
			this.audio.loop = true;

			// Create Web Audio API context for fade effects
			this.audioContext = new AudioContext();
			this.source = this.audioContext.createMediaElementSource(this.audio);
			this.gainNode = this.audioContext.createGain();

			// Connect audio graph: source -> gain -> destination
			this.source.connect(this.gainNode).connect(this.audioContext.destination);

			// Set initial volume to 0 (will fade in when playing)
			this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

			// Handle audio errors
			this.audio.addEventListener('error', () => {
				console.warn('[Audio] Failed to load background music');
				audioState.update((s) => ({ ...s, isInitialized: false }));
			});

			audioState.update((s) => ({ ...s, isInitialized: true }));
		} catch (error) {
			console.warn('[Audio] Failed to initialize audio:', error);
			audioState.update((s) => ({ ...s, isInitialized: false }));
		}
	}

	/**
	 * Fade in and start playback
	 * Only plays if user has unmuted (respects mute preference)
	 */
	async fadeIn(duration: number): Promise<void> {
		if (!this.audio || !this.audioContext || !this.gainNode) return;

		// Clear any existing fade timeout
		if (this.fadeTimeout) {
			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;
		}

		try {
			// Resume AudioContext if suspended (iOS Safari requirement)
			if (this.audioContext.state === 'suspended') {
				await this.audioContext.resume();
			}

			// Start playback
			await this.audio.play();

			// Fade in volume
			const currentTime = this.audioContext.currentTime;
			this.gainNode.gain.cancelScheduledValues(currentTime);
			this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, currentTime);
			this.gainNode.gain.linearRampToValueAtTime(1, currentTime + duration / 1000);

			audioState.update((s) => ({ ...s, isPlaying: true }));
		} catch (error) {
			console.warn('[Audio] Failed to play audio:', error);
		}
	}

	/**
	 * Fade out and pause playback
	 */
	fadeOut(duration: number): void {
		if (!this.audio || !this.audioContext || !this.gainNode) return;

		// Clear any existing fade timeout
		if (this.fadeTimeout) {
			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;
		}

		// Fade out volume
		const currentTime = this.audioContext.currentTime;
		this.gainNode.gain.cancelScheduledValues(currentTime);
		this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, currentTime);
		this.gainNode.gain.linearRampToValueAtTime(0, currentTime + duration / 1000);

		// Pause after fade completes
		this.fadeTimeout = window.setTimeout(() => {
			if (this.audio) {
				this.audio.pause();
				audioState.update((s) => ({ ...s, isPlaying: false }));
			}
		}, duration);
	}

	/**
	 * Stop playback immediately (no fade)
	 */
	stop(): void {
		if (this.fadeTimeout) {
			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;
		}

		if (this.audio) {
			this.audio.pause();
			audioState.update((s) => ({ ...s, isPlaying: false }));
		}
	}

	/**
	 * Check if audio is currently playing
	 */
	isPlaying(): boolean {
		return this.audio ? !this.audio.paused : false;
	}

	/**
	 * Cleanup audio resources
	 */
	cleanup(): void {
		if (this.fadeTimeout) {
			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;
		}

		if (this.audio) {
			this.audio.pause();
			this.audio = null;
		}

		if (this.audioContext) {
			this.audioContext.close();
			this.audioContext = null;
		}

		this.source = null;
		this.gainNode = null;
	}
}

// Singleton instance
let audioManager: AudioManager | null = null;

// Initialize audio state store - muted by default
export const audioState = writable<AudioState>({
	isInitialized: false,
	isPlaying: false,
	isMuted: true
});

/**
 * Toggle mute state - initializes audio on first unmute
 * Starts music when unmuted, stops when muted
 */
export function toggleMute(): void {
	audioState.update((state) => {
		const newMutedState = !state.isMuted;

		if (newMutedState) {
			// Muting - fade out and pause
			if (audioManager) {
				audioManager.fadeOut(FADE_OUT_DURATION);
			}
		} else {
			// Unmuting - initialize audio if needed, then fade in and play
			if (!audioManager) {
				audioManager = new AudioManager();
				audioManager.init();
			}
			audioManager.fadeIn(FADE_IN_DURATION);
		}

		return { ...state, isMuted: newMutedState };
	});
}
