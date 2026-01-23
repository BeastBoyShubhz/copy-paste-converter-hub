export const jsonToCsvContent = `
<article class="prose">
  <p class="lead">Data formats run exactly opposite to each other: APIs speak JSON (nested, tree-like), while business analysts favor CSV (flat, rows and columns). This tool is such a translation layer, flattening complex data arrays into spreadsheets ready for Excel.</p>

  <h3>The Problem: Hierarchical vs. Flat Data</h3>
  <p>JSON represents data as trees. An object can contain a list, which contains objects. Spreadsheets are 2-dimensional grids. Converting between them requires <strong>flattening</strong>.</p>
  
  <div class="callout info">
    <strong>💡 How Flattening Works</strong>
    If you have <code>{"user": {"name": "Alice"}}</code>, standard flattening creates a column named <code>user.name</code> with the value "Alice". This tool handles this automatically for simple nested objects.
  </div>

  <h3>How This Tool Works</h3>
  <p>Our converter focuses on the most common use case: an <strong>Array of Objects</strong>.</p>
  <ol>
    <li>
      <strong>Header Extraction:</strong> It scans every object in your array, not just the first one. If the 50th item has a unique field "error_log", the tool detects it.
    </li>
    <li>
      <strong>Normalization:</strong> It ensures every row has a value for every header column.
    </li>
    <li>
      <strong>Escaping:</strong> If your data contains a comma, a newline, or a double quote, it breaks the CSV structure. The tool automatically wraps these fields in quotes (e.g., <code>"London, UK"</code>) to preserve integrity.
    </li>
  </ol>

  <h3>Real-World Use Cases</h3>
  <ul>
    <li>
      <strong>Reporting:</strong> You query your MongoDB database and get a JSON dump of users. Your Boss wants a report. You use this tool to turn that JSON into a CSV and open it in Excel to make charts.
    </li>
    <li>
      <strong>Data Migration:</strong> You are moving data from a NoSQL system (Firebase) to a SQL database (PostgreSQL). You export JSON, convert to CSV, and use the SQL <code>COPY</code> or <code>IMPORT</code> command.
    </li>
  </ul>

  <div class="callout warning">
    <strong>⚠️ Limitation: Deep Nesting</strong>
    If your JSON involves arrays inside arrays (e.g., a user has a list of 5 addresses), flattening becomes messy. In these cases, the tool may <em>stringify</em> the inner array into a single cell content, which is usually the safest option for Excel.
  </div>
</article>
`;
