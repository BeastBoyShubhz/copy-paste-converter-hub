export const wordCounterContent = `
<article class="prose">
  <p class="lead">Counting words seems simple, but in the digital world, "length" defines everything: Google meta descriptions, tweet limits, database columns, and academic essays.</p>

  <h3>Why Precision Matters</h3>
  <p>Different platforms measure text differently. </p>
  <ul>
    <li><strong>Database Limits:</strong> A standard MySQL <code>VARCHAR(255)</code> column has a hard limit of 255 <em>characters</em>, not words. If you try to save 256, it truncates or crashes.</li>
    <li><strong>SEO Meta Data:</strong> Google truncates visual title tags after roughly 60px (approx 60 chars) and descriptions after 160 chars.</li>
    <li><strong>Social Media:</strong> Twitter (X) allows 280 characters.</li>
  </ul>

  <div class="callout info">
    <strong>💡 How We Count</strong>
    <ul>
      <li><strong>Words:</strong> specific split by word boundaries, filtering empty spaces.</li>
      <li><strong>Characters (with space):</strong> Raw string length. Important for databases.</li>
      <li><strong>Reading Time:</strong> Word count / 200 (Average words per minute).</li>
    </ul>
  </div>

  <h3>Edge Cases in Text Processing</h3>
  <p><strong>Multilingual Input:</strong> Languages like Chinese or Japanese typically do not split words with spaces. A simple space-splitter will fail.</p>
  
  <p><strong>Hyphenated Words:</strong> Is "long-term" one word or two? Most style guides (and our tool) treat it as one word if there are no spaces.</p>

  <div class="callout warning">
    <strong>⚠️ Privacy First</strong>
    If you are pasting a confidential legal draft or proprietary code to check its length, you don't want it uploaded to a server. This counter runs locally in your RAM.
  </div>
</article>
`;
