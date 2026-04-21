---
title: "Stop Copy-Pasting Unix Timestamps Wrong"
description: "Seconds vs. milliseconds, UTC vs. local, leap seconds, the 2038 problem — a practical field guide for developers who deal with timestamps every day."
date: "2026-04-20"
author: "Shubham Singla"
tags: ["unix", "timestamps", "dates", "debugging"]
---

You pull a log line out of a service, paste `1700000000` into a converter, and get back a date. Easy. Then a day later you paste `1700000000000` and get back a date from the year 55,902. What happened? You just hit the single most common timestamp bug in the wild: **seconds versus milliseconds**.

Most developers learn this the hard way, usually at 2am on an on-call shift. Here is the short list of every gotcha I've run into working with timestamps across Postgres, Kafka, browser code, and a few questionable third-party APIs.

## Seconds or milliseconds — and why it matters

Unix time is "seconds since 1970-01-01 UTC". The problem is that JavaScript decided to use milliseconds for `Date.now()` and everyone else mostly kept seconds, so you end up with two numbers that look almost identical but differ by 1000x.

Quick check:

- **10 digits** (e.g. `1700000000`) → seconds. Maps to ~2023.
- **13 digits** (e.g. `1700000000000`) → milliseconds. Maps to the same instant in 2023.
- **16+ digits** → microseconds (common in Python's `time.time_ns()` divided by 1000) or nanoseconds. Postgres `TIMESTAMP` internals use microseconds.

If you're reading a timestamp from an unfamiliar system, look at the length first. If it's ambiguous — say, a 10-digit value from a system you don't control — check the current value: anything in seconds for "now" will start with `17` in 2024–2025 and `18` in 2026. Our [timestamp converter](/tools/timestamp-converter) detects this automatically, but it's worth knowing how to eyeball it.

## UTC vs. local time

Unix timestamps are *always* UTC. They don't carry a timezone. A timestamp is a single instant on the globe; the timezone is presentation-layer concern.

This sounds obvious, but here's where it bites people:

1. You log `new Date('2025-01-15')` in JavaScript. The browser interprets that as midnight UTC. The same code in a server in India logs the same string, but `new Date('2025-01-15 00:00:00')` (with a time component) is interpreted as *local* time. Always include `Z` or a timezone offset in ISO strings you parse.
2. You run `SELECT NOW()` in Postgres and get back `2025-01-15 12:34:56+00`. That `+00` is doing real work — drop it, and you've thrown away the timezone anchor.
3. A user picks "Jan 15, 2025" in a date picker in Tokyo. You store it as a Unix timestamp. Months later, a user in New York reads that timestamp back and sees it as "Jan 14". That's correct! But confusing.

Rule of thumb: **store UTC, convert at render time**. If you find yourself storing local time in a database, stop and rethink.

## The 2038 problem is still real

32-bit signed integers overflow at `2147483647`, which happens to be 2038-01-19 03:14:07 UTC. If you're writing new code in 2026, this probably doesn't affect you — modern platforms use 64-bit integers everywhere. But embedded systems, old C code, and some legacy databases still use 32-bit `time_t`. If you work on anything long-lived (IoT, financial systems, archival formats), audit your storage sizes now, not in 2037.

## Leap seconds are probably not your problem

Every few years, the IERS inserts a leap second into UTC to keep clocks aligned with Earth's rotation. Unix time technically ignores them — a Unix timestamp represents "seconds since epoch as if every day were exactly 86,400 seconds". For 99% of applications, this is fine. If you're writing high-frequency trading systems, GPS software, or scientific timing code, you already know this and you already have a plan. The rest of us can safely pretend leap seconds don't exist. (The IERS actually voted to phase them out by 2035, so this is becoming even less of a concern.)

## Things I always double-check in a PR

When I'm reviewing code that touches timestamps, I look for:

- **`Date.now() / 1000` without a `Math.floor`.** Passing a float with milliseconds-as-fractional-seconds to an API that expects integer seconds is a subtle source of off-by-one bugs.
- **`new Date(userInput)` without validation.** Date parsing in JavaScript is notoriously permissive and has accepted invalid strings silently for years. Use a parser like `date-fns`.
- **String comparison on ISO 8601.** Works for UTC timestamps because the format is lexicographically sortable. Doesn't work if someone mixed in timezone offsets (`2025-01-15T00:00:00+05:30` sorts incorrectly against `2025-01-15T00:00:00Z`).
- **`SELECT *` on tables with `TIMESTAMP WITHOUT TIME ZONE` columns.** Postgres silently assumes your session timezone. Use `TIMESTAMPTZ` unless you have a very specific reason not to.

## TL;DR

Store UTC. Include the `Z` on ISO strings. Check digit length before parsing raw integers. And when in doubt, paste it into a [timestamp converter](/tools/timestamp-converter) and look at it with your eyes — that five-second sanity check has saved me more debugging time than I'd like to admit.
