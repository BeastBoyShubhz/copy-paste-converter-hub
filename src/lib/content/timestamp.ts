export const timestampContent = `
<article class="prose">
  <p class="lead">Unix timestamps are the heartbeat of modern computing, but they are impossible for humans to read. This tool bridges the gap, instantly accurately converting between Epoch time and human-readable dates in your local timezone and UTC.</p>

  <h3>What is a Unix Timestamp?</h3>
  <p>A Unix timestamp (also known as Epoch time or POSIX time) is a system for tracking time as a running total of seconds. It counts the number of seconds that have elapsed since the <strong>Unix Epoch</strong>: 00:00:00 UTC on 1 January 1970.</p>
  
  <div class="callout info">
    <strong>💡 Why 1970?</strong>
    Unix time was developed in the late 60s at Bell Labs. 1970 was chosen as a convenient round start date for the new system. It is unaffected by timezones or Daylight Saving Time (DST).
  </div>

  <h3>Real-World Use Cases</h3>
  <ul>
    <li>
      <strong>Debugging Server Logs:</strong> Server logs (like Nginx or Apache) often record events in Epoch time. When a server crashes at <code>1703059200</code>, you need to know exactly when that was in your local time to correlate it with other events.
    </li>
    <li>
      <strong>Database Management:</strong> Databases store timestamps as integers for efficiency. When querying raw data, you might see a "created_at" column full of numbers like <code>1672531200</code>.
    </li>
    <li>
      <strong>API Development:</strong> Many APIs (like Stripe or Slack) use Unix timestamps for fields like <code>expires_at</code> or <code>event_time</code>.
    </li>
  </ul>

  <h3>Technical Deep Dive: How It Works</h3>
  <p>Under the hood, this conversion relies on the fundamental way computers handle time. When you provide a timestamp:</p>
  <ol>
    <li>
      <strong>Detection:</strong> The tool automatically detects if you've pasted <strong>Seconds</strong> (10 digits) or <strong>Milliseconds</strong> (13 digits).
    </li>
    <li>
      <strong>Normalization:</strong> It converts everything to milliseconds, which is the internal requirement for the JavaScript <code>Date</code> object.
    </li>
    <li>
      <strong>Formatting:</strong> It uses the browser's 5<code>Intl.DateTimeFormat</code> API to output the date string in your specific local timezone.
    </li>
  </ol>

  <div class="callout warning">
    <strong>⚠️ Common Mistake: Year 2038 Problem</strong>
    On January 19, 2038, valid timestamps will exceed the maximum value for a 32-bit signed integer (<code>2,147,483,647</code>). Legacy systems may crash. Modern 64-bit systems are safe for billions of years.
  </div>

  <h3>Common Mistakes Developers Make</h3>
  <p><strong>Confusing Seconds and Milliseconds:</strong> This is the #1 error. Python's <code>time.time()</code> returns seconds (float), while JavaScript's <code>Date.now()</code> returns milliseconds (integer).</p>
  
  <p><strong>Ignoring Timezones:</strong> A timestamp is absolute (UTC), but "Midnight" is relative. Always remember that <code>1700000000</code> happened at the same moment everywhere, but the clock time differed by location.</p>
</article>
`;
