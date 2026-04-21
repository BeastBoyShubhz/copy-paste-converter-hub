---
title: "JWTs Are Not Encrypted — Here's What That Actually Means"
description: "A JWT looks random, but anyone can decode it. A practical breakdown of what JWTs protect, what they don't, and the mistakes that lead to breaches."
date: "2026-04-21"
author: "Shubham Singla"
tags: ["jwt", "security", "auth", "tokens"]
---

Every few months, someone in a security channel posts a screenshot of a JWT they found in a production URL, panicking because "anyone can read the payload". The answer is always the same: yes, that's how they work. JWTs are **signed**, not **encrypted**. If you're treating them like a black box, you have a bug waiting to happen.

Here's the actual mental model, plus the mistakes I see most often in code review.

## The three parts, plainly

A JWT is three base64url-encoded chunks separated by dots: `header.payload.signature`. If you paste one into our [JWT decoder](/tools/jwt-decoder), you'll see the first two chunks are just JSON. The third is a signature computed over the first two, using a secret (for HMAC algorithms) or a private key (for RSA/ECDSA).

What the signature gives you:

- **Integrity**: the payload wasn't modified after it was issued.
- **Authenticity**: it was issued by someone who holds the secret/private key.

What the signature does **not** give you:

- **Confidentiality.** The payload is plain JSON, base64-encoded. Anyone who sees the token can read it.

This distinction matters because people routinely put things in JWT payloads that shouldn't be visible: internal user IDs, email addresses, plan tiers, feature flags. Those aren't exactly secrets, but they're information you probably don't want handed to any browser extension or proxy that can see the Authorization header.

## The classic mistakes

Let me list the ones I've actually seen break production systems.

### 1. Trusting the payload without verifying the signature

The JWT libraries generally give you two functions: a `decode` that parses the JSON, and a `verify` that parses *and* checks the signature. Calling `decode` on a user-supplied token and then trusting the `sub` field is equivalent to asking the user what their user ID is and believing them. It happens, usually in middleware code that "just needs to know the user".

### 2. The `alg: "none"` attack

Some libraries historically honored a `"none"` algorithm in the header, which says "no signature, trust me". If you pass a token with `{ "alg": "none" }` and an empty signature to such a library, it returns the payload as valid. Modern libraries reject this, but if you're on an old version of a JWT package, check.

### 3. Algorithm confusion (HS256 vs RS256)

If your server is configured with an RSA public key to verify RS256 tokens, a classic attack is to forge a token using that *public* key as the HMAC secret for HS256. A misconfigured library that uses whatever algorithm the token claims will happily verify it. Always pin the expected algorithm on the verifier, not the token.

### 4. No expiry, or a very long expiry

`exp` is optional in the JWT spec, and some developers omit it for convenience. A token with no expiry is a password that can never be rotated. If a client device is ever compromised, the attacker has permanent access until you change the signing key — which invalidates *every* user's session. Short-lived access tokens plus refresh tokens exist for a reason.

### 5. Storing JWTs in localStorage

`localStorage` is accessible to any JavaScript running on your origin. If you have a single XSS vulnerability anywhere on your site — including in a third-party script you include — your JWTs are exfiltrated. `httpOnly` cookies with `SameSite=Strict` are harder to misuse.

## When JWTs are the wrong tool

JWTs are great for stateless authentication across services, especially when you don't want every request to hit a central session store. They're *not* great for:

- **Sessions where you need to revoke.** Once issued, a JWT is valid until it expires, full stop. You can build a denylist, but that defeats the main advantage of JWTs — you're back to a stateful lookup per request. In that case, just use session IDs.
- **Anything with PII you don't want exposed.** Again: signed ≠ encrypted. If you need confidentiality, use JWE (JSON Web Encryption), or just don't put that data in the token.
- **Very short-lived actions.** For one-shot things like email verification or password resets, a random opaque token backed by a database row is simpler, more revocable, and less surface area.

## A useful habit

When you're debugging an auth problem, paste the token into our [JWT decoder](/tools/jwt-decoder) and look at the payload. You'll often spot the issue in seconds: wrong issuer, stale `exp`, missing claim. It's client-side only, so it's safe to use on production tokens — though of course, if you paste a token into *any* website, you should consider it burned. Good practice: generate a test token with equivalent claims instead of pasting the live one.

## TL;DR

JWTs are signed, not encrypted. The payload is readable by anyone. Pin the algorithm, check `exp`, keep tokens short-lived, and don't store them in localStorage. Everything else is details.
