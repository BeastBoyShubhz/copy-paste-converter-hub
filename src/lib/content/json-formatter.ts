export const jsonFormatterContent = `
<article class="prose">
  <p class="lead">JSON (JavaScript Object Notation) is the language of the web. It's concise, readable, and powerful. But when it's minified or broken, it's a nightmare. This tool is your instant fix for unreadable or invalid JSON.</p>

  <h3>Why Do We Need a JSON Formatter?</h3>
  <p>Computers love <strong>Minified JSON</strong>—JSON with all whitespace removed. It saves bandwidth and loads faster. API responses often look like this:</p>
  <pre><code>{"status":"ok","data":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}</code></pre>
  <p>Humans, however, cannot read this efficiently. This tool acts as a "Beautifier" that adds proper indentation (whitespace) and newlines to turn that blob into a structured, readable tree.</p>

  <div class="callout warning">
    <strong>⚠️ Common Syntax Errors</strong>
    JSON is stricter than standard JavaScript objects.
    <ul>
      <li><strong>Keys must be quoted:</strong> <code>{ name: "Alice" }</code> is valid JS but invalid JSON. It must be <code>{ "name": "Alice" }</code>.</li>
      <li><strong>No Trailing Commas:</strong> <code>[1, 2, 3, ]</code> typically crashes a JSON parser.</li>
      <li><strong>Strict Types:</strong> Strings must use double quotes (<code>"</code>). Single quotes (<code>'</code>) are forbidden.</li>
    </ul>
  </div>

  <h3>Real-World Use Cases</h3>
  <ul>
    <li>
      <strong>API Integration:</strong> When connecting to a third-party API (like Stripe, Twilio, or AWS), you will often copy the response body from your terminal or logs. Pasting it here helps you understand the structure immediately.
    </li>
    <li>
      <strong>Configuration Files:</strong> Many developer tools (VS Code, ESLint, Prettier) use <code>.json</code> config files. A missing comma or mismatched brace effectively breaks your environment.
    </li>
  </ul>

  <h3>Technical Deep Dive: BigInt Precision</h3>
  <p>Standard JSON has a limitation with numbers. It uses 64-bit floating point numbers (IEEE 754). This means very large integers (bigger than 2<sup>53</sup> - 1) might lose precision.</p>
  <p>For example, a Tweet ID like <code>1500000000000000001</code> might get rounded to <code>1500000000000000000</code>. If exact precision is critical for massive integers, ensure you handle them as strings in your application code.</p>

  <div class="callout info">
    <strong>🔒 Security: Why Client-Side Matters</strong>
    Many online formatters send your data to their backend to process it. If you paste a production API key or customer PII, that server could log it.
    <br><br>
    <strong>This tool is different.</strong> It runs 100% in your browser using <code>JSON.parse()</code>. Your data never leaves your device.
  </div>
</article>
`;
