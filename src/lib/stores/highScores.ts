/**
 * High Scores State Management
 * Manages high score persistence using localStorage
 */

import { writable } from 'svelte/store';
import type { HighScoreEntry } from '$lib/types';

const STORAGE_KEY = 'killTheRoyals:highScores';
const MAX_ENTRIES = 50;

/**
 * Load high scores from localStorage
 * Returns empty array if localStorage is unavailable or data is invalid
 */
function loadHighScores(): HighScoreEntry[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const parsed = JSON.parse(stored);
		if (!Array.isArray(parsed)) return [];

		return parsed.sort(sortHighScores).slice(0, MAX_ENTRIES);
	} catch {
		console.warn('Failed to load high scores from localStorage');
		return [];
	}
}

/**
 * Sort high scores by:
 * 1. Score (descending - higher is better)
 * 2. Timestamp (ascending - earlier wins)
 */
function sortHighScores(a: HighScoreEntry, b: HighScoreEntry): number {
	if (b.score !== a.score) return b.score - a.score;
	return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
}

/**
 * Save high scores to localStorage
 * Fails silently if localStorage is unavailable
 */
function saveToLocalStorage(entries: HighScoreEntry[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
	} catch {
		console.warn('Failed to save high scores to localStorage');
	}
}

// Main high scores store (auto-loads from localStorage on init)
export const highScores = writable<HighScoreEntry[]>(loadHighScores());

/**
 * Save a new high score
 * Automatically sorts and trims to MAX_ENTRIES
 */
export function saveHighScore(score: number) {
	highScores.update((scores) => {
		const newEntry: HighScoreEntry = {
			id: `${Date.now()}-${Math.random()}`,
			score,
			timestamp: new Date().toISOString()
		};

		const updated = [...scores, newEntry].sort(sortHighScores).slice(0, MAX_ENTRIES);

		saveToLocalStorage(updated);
		return updated;
	});
}

/**
 * Format a timestamp for display
 * Shows relative time for recent scores, absolute date for older ones
 */
export function formatScoreDate(timestamp: string): string {
	const date = new Date(timestamp);
	const now = new Date();
	const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

	if (daysDiff === 0) return 'Today';
	if (daysDiff === 1) return 'Yesterday';
	if (daysDiff < 7) return `${daysDiff} days ago`;

	return new Intl.DateTimeFormat('default', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	}).format(date);
}
