/**
 * High Scores State Management
 * Manages high score persistence using localStorage
 */

import { writable } from 'svelte/store';
import type { HighScoreEntry } from '$lib/types';

const STORAGE_KEY = 'killTheRoyals:highScores';
const STORAGE_VERSION = 1; // Increment when schema changes
const MAX_ENTRIES = 50;

/**
 * Validate that an entry matches the HighScoreEntry interface
 */
function isValidEntry(entry: unknown): entry is HighScoreEntry {
	if (typeof entry !== 'object' || entry === null) return false;

	const e = entry as Record<string, unknown>;
	return (
		typeof e.id === 'string' &&
		typeof e.score === 'number' &&
		typeof e.timestamp === 'string' &&
		!isNaN(e.score) &&
		isFinite(e.score) &&
		e.score >= 0 &&
		!isNaN(new Date(e.timestamp).getTime())
	);
}

/**
 * Load high scores from localStorage
 * Returns empty array if localStorage is unavailable or data is invalid
 * Handles both legacy format (array) and new format (versioned object)
 */
function loadHighScores(): HighScoreEntry[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const parsed = JSON.parse(stored);

		// Handle legacy format (direct array)
		if (Array.isArray(parsed)) {
			console.info('[HighScores] Migrating from legacy format');
			const validEntries = parsed.filter((entry) => {
				if (!isValidEntry(entry)) {
					console.warn('[HighScores] Skipping invalid entry:', entry);
					return false;
				}
				return true;
			});
			const sorted = validEntries.sort(sortHighScores).slice(0, MAX_ENTRIES);
			// Save in new format
			saveToLocalStorage(sorted);
			return sorted;
		}

		// Handle new versioned format
		if (
			typeof parsed === 'object' &&
			parsed !== null &&
			typeof parsed.version === 'number' &&
			Array.isArray(parsed.entries)
		) {
			if (parsed.version !== STORAGE_VERSION) {
				console.warn(
					`[HighScores] Version mismatch: stored=${parsed.version}, current=${STORAGE_VERSION}`
				);
				// Could add migration logic here if needed
			}

			const validEntries = parsed.entries.filter((entry: unknown) => {
				if (!isValidEntry(entry)) {
					console.warn('[HighScores] Skipping invalid entry:', entry);
					return false;
				}
				return true;
			});

			return validEntries.sort(sortHighScores).slice(0, MAX_ENTRIES);
		}

		console.warn('[HighScores] Invalid data format in localStorage');
		return [];
	} catch (error) {
		console.warn('[HighScores] Failed to load high scores:', error);
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
 * Save high scores to localStorage with versioning
 * Handles quota exceeded errors gracefully
 */
function saveToLocalStorage(entries: HighScoreEntry[]): boolean {
	try {
		const data = {
			version: STORAGE_VERSION,
			entries
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		return true;
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'QuotaExceededError') {
				console.error('[HighScores] Storage quota exceeded - clearing old entries');
				// Try saving with fewer entries
				try {
					const reduced = {
						version: STORAGE_VERSION,
						entries: entries.slice(0, Math.floor(MAX_ENTRIES / 2))
					};
					localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
					return true;
				} catch {
					console.error('[HighScores] Failed to save even with reduced entries');
					return false;
				}
			}
		}
		console.warn('[HighScores] Failed to save high scores:', error);
		return false;
	}
}

// Main high scores store (auto-loads from localStorage on init)
export const highScores = writable<HighScoreEntry[]>(loadHighScores());

/**
 * Save a new high score
 * Automatically sorts and trims to MAX_ENTRIES
 * Validates score before saving
 */
export function saveHighScore(score: number): boolean {
	// Validate score
	if (typeof score !== 'number' || isNaN(score) || !isFinite(score) || score < 0) {
		console.error('[HighScores] Invalid score:', score);
		return false;
	}

	let saveSuccess = false;

	highScores.update((scores) => {
		const newEntry: HighScoreEntry = {
			id: `${Date.now()}-${Math.random()}`,
			score,
			timestamp: new Date().toISOString()
		};

		const updated = [...scores, newEntry].sort(sortHighScores).slice(0, MAX_ENTRIES);

		saveSuccess = saveToLocalStorage(updated);
		return updated;
	});

	return saveSuccess;
}

/**
 * Format a timestamp for display
 * Shows relative time for recent scores, absolute date for older ones
 * Returns fallback text if timestamp is invalid
 */
export function formatScoreDate(timestamp: string): string {
	const date = new Date(timestamp);

	// Check if date is invalid
	if (isNaN(date.getTime())) {
		console.warn('[HighScores] Invalid timestamp:', timestamp);
		return 'Unknown date';
	}

	const now = new Date();
	const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

	if (daysDiff === 0) return 'Today';
	if (daysDiff === 1) return 'Yesterday';
	if (daysDiff < 7 && daysDiff > 0) return `${daysDiff} days ago`;

	try {
		return new Intl.DateTimeFormat('default', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(date);
	} catch (error) {
		console.warn('[HighScores] Failed to format date:', error);
		return 'Unknown date';
	}
}
