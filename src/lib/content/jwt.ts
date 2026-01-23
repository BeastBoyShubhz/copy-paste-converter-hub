export const jwtContent = `
<article class="prose">
  <p class="lead">JSON Web Tokens (JWTs) are the industry standard for stateless authentication. But they are opaque strings until you decode them. This tool lets you inspect the contents of a token locally—without exposing your secrets.</p>

  <h3>What is a JWT?</h3>
  <p>A JWT is a compact, URL-safe means of representing claims to be transferred between two parties.</p>
  <p>It consists of three parts separated by dots (<code>.</code>):</p>
  <ol>
    <li><strong>Header:</strong> Describes the algorithm (e.g., HS256) and type.</li>
    <li><strong>Payload:</strong> The data! Contains claims like user ID (\`sub\`), expiration (\`exp\`), and roles.</li>
    <li><strong>Signature:</strong> A cryptographic hash validating that the token hasn't been tampered with.</li>
  </ol>

  <div class="callout danger">
    <strong>⚠️ Security Warning: Decoder vs. Validator</strong>
    This tool is a <strong>Decoder</strong>, not a <strong>Validator</strong>.
    <br><br>
    <strong>Decoding</strong> simply reverses the Base64 encoding. Anyone can do this. A JWT is like a postcard: signed, but readable by anyone. Do not put secrets (passwords) inside a JWT.
    <br><br>
    <strong>Validating</strong> requires a secret key. We do NOT ask for your secret key. Therefore, we cannot tell you if the token is <em>trusted</em>, only what it <em>says</em>.
  </div>

  <h3>Common JWT Claims</h3>
  <ul>
    <li><code>sub</code> (Subject): Who this token is about (usually User ID).</li>
    <li><code>iat</code> (Issued At): When the token was created.</li>
    <li><code>exp</code> (Expiration): When the token dies. Most APIs reject tokens after this second.</li>
    <li><code>iss</code> (Issuer): Who created this token.</li>
  </ul>

  <h3>How Base64Url Works</h3>
  <p>JWTs use a variant of Base64 called <strong>Base64Url</strong>. Standard Base64 uses <code>+</code> and <code>/</code>, which are not safe in URLs. Base64Url replaces them with <code>-</code> and <code>_</code> and removes padding (<code>=</code>). This allows JWTs to be easily passed in URL query parameters.</p>
</article>
`;
