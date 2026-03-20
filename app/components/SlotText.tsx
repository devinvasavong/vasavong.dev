"use client";
import { useEffect, useState } from "react";

const CHARS = "abcdefghijklmnopqrstuvwxyz";

function randomChar() {
	return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface SlotTextProps {
	text: string;
	className?: string;
	duration?: number;
}

export function SlotText({ text, className, duration = 900 }: SlotTextProps) {
	const [chars, setChars] = useState(() =>
		text.split("").map((c) => (c === " " ? " " : randomChar()))
	);

	useEffect(() => {
		const target = text.split("");
		const FRAME_MS = 40;

		// Each character settles left-to-right across the duration
		const settleAt = target.map((char, i) => {
			if (char === " ") return 0;
			return (i / Math.max(target.length - 1, 1)) * duration;
		});

		let elapsed = 0;

		const interval = setInterval(() => {
			elapsed += FRAME_MS;

			setChars(
				target.map((char, i) => {
					if (char === " ") return " ";
					if (elapsed >= settleAt[i]) return char;
					return randomChar();
				})
			);

			if (elapsed > duration) clearInterval(interval);
		}, FRAME_MS);

		return () => clearInterval(interval);
	}, [text, duration]);

	return (
		<span className={className} suppressHydrationWarning>
			{chars.join("")}
		</span>
	);
}
