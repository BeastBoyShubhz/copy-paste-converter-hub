---
title: "Base64 Encoding Explained: What Developers Actually Need to Know"
description: "Base64 is everywhere — data URIs, JWTs, email attachments, API signatures — but half the bugs around it come from people treating it like encryption. Here's the real picture."
date: "2026-04-23"
author: "Shubham Singla"
tags: ["base64", "encoding", "security"]
---

If you've ever looked at a JWT, an email MIME part, a data URL in CSS, or the result of `openssl` calls in a shell script, you've seen Base64. It's the duct tape of the internet: a way to carry arbitrary binary data through pipes that were only designed to handle text. And yet, in code review after code review, I see the same misconceptions — treating Base64 as encryption, skipping padding "because it usually works," or confusing the standard and URL-safe variants at an API boundary. This post is the mental model that makes those bugs stop happening.

## TL;DR

- Base64 is encoding, not encryption. Anyone can decode it in one line.
- Every 3 bytes of input produces 4 bytes of output. That's a fixed 33% size overhead.
- The standard alphabet uses `+` and `/`. The URL-safe alphabet uses `-` and `_`. Never mix them.
- Padding with `=` is part of the spec. Some dialects drop it; interop requires agreement.
- When in doubt, round-trip through our [Base64 encoder/decoder](/tools/base64-encode-decode) and read the bytes.

## What Base64 actually does

Base64 is an algorithm that turns any sequence of bytes into a string of ASCII characters drawn from a 64-character alphabet. The rules are fixed by [RFC 4648](https://www.rfc-editor.org/rfc/rfc4648), and the core idea is geometric: you take three 8-bit bytes (24 bits total), regroup them into four 6-bit values, and look up each 6-bit value in the alphabet.

```
Input bytes:   M         a         n
               01001101  01100001  01101110

Regrouped:     010011  010110  000101  101110
                  |       |       |       |
Base64 index:    19      22       5      46

Alphabet[19] = 'T'
Alphabet[22] = 'W'
Alphabet[5]  = 'F'
Alphabet[46] = 'u'

Output: "TWFu"
```

That's it. Three bytes in, four bytes out. Always. The [MDN explanation of Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64) covers this at the same level of detail if you want a second read.

When the input length isn't a multiple of three, the algorithm pads the last group. You append `=` to signal "the last group was short," so a decoder knows where real data ends. One `=` means the final group encoded two input bytes; two `==` mean it encoded one. You will never see three `=` in valid Base64.

### The 33% overhead

Four output characters for every three input bytes is a 4:3 ratio, so Base64-encoded data is about 33% larger than the original. That matters when you're making decisions about where to embed it.

- For inline images as data URIs, the tradeoff is an extra HTTP round-trip vs. a 33% bigger HTML document. For icons under 2 KB, the data URI usually wins.
- For API payloads, Base64-encoding a 1 MB file means you're sending 1.33 MB plus JSON overhead. For most APIs, a separate `multipart/form-data` upload is cheaper.
- For database storage, Base64-in-a-TEXT-column is more expensive than a `BYTEA`/`BLOB` by the same 33%. Use the native binary column when the database supports it.

## Standard vs URL-safe Base64

This is the single most common source of Base64 bugs I see, so it deserves its own section.

The standard alphabet uses `A-Z`, `a-z`, `0-9`, `+`, `/` (64 characters), plus `=` for padding. The `+` and `/` characters cause problems in two places specifically:

- **URLs**, where `/` is a path separator and `+` often becomes a space in `application/x-www-form-urlencoded` bodies.
- **Filenames**, where `/` is a directory separator on Unix and most filesystems reject `+` in some contexts.

So RFC 4648 also defines a URL-safe variant: `-` in place of `+`, `_` in place of `/`. Padding is the same. Every other byte is the same.

The catch: a URL-safe Base64 string fed into a standard decoder will fail (or worse, decode to garbage). You must know which variant you're dealing with at the boundary between systems. JWTs, for instance, are always URL-safe and usually unpadded. Standard file attachments are usually standard with padding.

If you're building an API that returns Base64-encoded data, document the variant. If you're consuming one, check the documentation — or if you can't, look at the string: if you see `-` or `_`, it's URL-safe; if you see `+` or `/`, it's standard.

Related: if you're also doing URL-encoding on top (percent-encoding `/` as `%2F`, for example), you're double-encoding. Use our [URL encoder/decoder](/tools/url-encode-decode) to see the layers separately.

## Where Base64 shows up in real code

Once you've internalized the encoding, you start seeing it everywhere. A short tour of where it matters and why.

### Data URIs

Inline images and fonts in HTML, CSS, and JavaScript:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEA..." />
```

The browser parses the data URI, decodes the Base64 after the comma, and renders the result. The tradeoff is one HTTP request traded for a slightly larger document. Browsers cache data URIs poorly compared to standalone files, so reserve them for tiny assets.

### JWTs

A [JWT](https://www.rfc-editor.org/rfc/rfc7519) is three URL-safe Base64 strings joined by dots. The header and payload are JSON, then Base64-encoded; the signature is bytes, then Base64-encoded. JWTs are usually unpadded — any `=` would be ambiguous next to the dot separator. If you paste a JWT into our [JWT decoder](/tools/jwt-decoder), you can see all three parts decoded side by side.

### HTTP Basic Auth

The `Authorization: Basic <credentials>` header is standard Base64 of `username:password`. It's not encryption — it's obfuscation. Always use HTTPS in transit.

### Email attachments (MIME)

SMTP was designed for 7-bit ASCII. Any binary attachment — image, PDF, zip — is Base64-encoded in a MIME part before it goes over the wire. This is why your 5 MB PDF becomes a 6.6 MB email.

### Key material

Private keys, public keys, TLS certificates — all usually distributed as "PEM" format, which is just Base64 inside `-----BEGIN ...-----` delimiters. When someone posts a certificate in a support ticket, that's Base64.

## Base64 is not encryption

Every team eventually has this moment: someone Base64-encodes a sensitive value, commits it, and later argues it's "obfuscated." It isn't. Base64 is a lookup table. A decoder is two lines of Python. A browser's `atob()` is a function call. If a secret is in a Base64 string anywhere a non-trusted party can read, that secret is compromised.

What Base64 is for: carrying bytes through a text channel. What it is not for: authentication, confidentiality, tamper-detection, password storage, or anything else your security team cares about.

If you need confidentiality, encrypt with a real algorithm (AES-GCM, ChaCha20-Poly1305). If you need tamper-detection, sign with HMAC or Ed25519. Then Base64-encode the ciphertext or signature for transport if you must — encoding on top of real crypto is fine. Encoding *instead of* real crypto is a resume-generating event.

## Common mistakes

- **Assuming a "Base64 string" is one specific variant.** Always ask: standard or URL-safe? Padded or unpadded?
- **Forgetting padding.** A 20-character Base64 string is impossible — the length must be a multiple of 4 with padding, or a valid unpadded length. If a string has a length that's `1 mod 4` (e.g., 21 characters), it's corrupted.
- **Re-encoding already-Base64 data.** Double-Base64 is a real bug. You'll see a string that looks like gibberish but decodes to more Base64. Decode once, work with bytes, then encode once.
- **Treating Base64 output as UTF-8 text.** The output is ASCII, always. Forcing a UTF-8 encoding on decoded bytes corrupts any non-text data.
- **Using Base64 in place of proper encoding in URLs.** Raw `+` and `/` from standard Base64 break URL parsers. Use URL-safe Base64 or percent-encode the result.
- **Losing the file extension on data URIs.** The MIME type before the comma matters — `data:image/png;base64,...` vs `data:application/octet-stream;base64,...` changes how browsers treat the bytes.

## FAQ

### Is Base64 encryption?

No. Base64 is an encoding, meaning a reversible, keyless transformation. Anyone who has the encoded string can decode it in one line of code. Encryption requires a key and is not reversible without it. Never use Base64 to hide secrets.

### What is the difference between Base64 and Base64URL?

They use slightly different alphabets. Standard Base64 uses `+` and `/`; URL-safe Base64 (per RFC 4648) uses `-` and `_` instead, so the strings are safe to place in URLs and filenames. Everything else — the 3-to-4 byte ratio, the padding, the lookup — is identical.

### Why is there a trailing equals sign in my Base64 string?

That's padding. Base64 groups input bytes into chunks of 3; when the final chunk has 1 or 2 bytes instead, `=` is appended to signal that. One `=` means one byte of padding, two means two. You'll never see three.

### Can I encode a file with Base64 and paste it into JSON?

Yes, that's a standard pattern for small files in APIs that don't support multipart uploads. Read the file as bytes, Base64-encode, set the JSON field to the resulting string. On the receiving end, decode back to bytes. Remember the 33% size overhead — for large files, prefer a multipart upload or a presigned storage URL.

### How do I decode a Base64 string in the browser without a server?

Use `atob()` for decoding and `btoa()` for encoding. Both are built into every browser. Note that they work on Latin-1 strings — for UTF-8 text, combine with `TextEncoder`/`TextDecoder`. Or paste the string into our client-side [Base64 encoder/decoder](/tools/base64-encode-decode) to avoid writing the code.

### Is Base64 safe for binary data like images and PDFs?

Yes. Base64 is byte-exact: decode, and you get the original bytes back, bit for bit. This is exactly why it's used for email attachments and data URIs. The only cost is the 33% size overhead during transport.

## Wrapping up

Base64 is a tiny, well-specified, boring algorithm, and that's its virtue: once you understand it at the byte level, you can reason about every place it shows up in your stack. Know which variant you're using at each boundary, don't mistake it for encryption, and don't round-trip it more times than necessary. The bugs go away.
