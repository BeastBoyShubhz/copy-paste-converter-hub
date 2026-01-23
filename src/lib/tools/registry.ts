import { timestampContent } from '../content/timestamp';
import { jsonFormatterContent } from '../content/json-formatter';
import { jsonToCsvContent } from '../content/json-to-csv';
import { jwtContent } from '../content/jwt';
import { wordCounterContent } from '../content/word-counter';

export type ToolCategory = 'converters' | 'formatters' | 'encoders' | 'text' | 'dev-utils';

export interface ToolMetadata {
    slug: string;
    title: string;
    description: string;
    category: ToolCategory;
    keywords: string[];
    faqs: { question: string; answer: string }[];
    howItWorks: string; // HTML string or Markdown
}

export const tools: ToolMetadata[] = [
    {
        slug: 'timestamp-converter',
        title: 'Timestamp to Date Converter',
        description: 'Free online tool to convert Unix timestamps (seconds & milliseconds) to human-readable dates. RFC 2822 & ISO 8601 formatting. Client-side only.',
        category: 'converters',
        keywords: ['unix timestamp', 'epoch converter', 'timestamp to date', 'date to timestamp', 'online converter'],
        faqs: [
            {
                question: 'What is a Unix timestamp?',
                answer: 'A Unix timestamp is a way to track time as a running total of seconds. It counts the number of seconds that have elapsed since the Unix Epoch: January 1st, 1970 at UTC. This format is widely used in operating systems and file formats.'
            },
            {
                question: 'Does this handle milliseconds?',
                answer: 'Yes. The tool automatically detects if your input is in seconds (10 digits) or milliseconds (13 digits) and converts it correctly without you needing to toggle a switch.'
            },
            {
                question: 'Is my timezone detected?',
                answer: 'Yes. We show the converted date in both your local timezone (detected from your browser) and UTC/GMT for reference.'
            }
        ],
        howItWorks: timestampContent
    },
    {
        slug: 'json-formatter',
        title: 'JSON Formatter & Validator',
        description: 'Beautify minified JSON, validate syntax, and debug errors instantly. Free online JSON parser that runs 100% in your browser for privacy.',
        category: 'formatters',
        keywords: ['json formatter', 'json beautifier', 'json validator', 'lint json', 'pretty print json'],
        faqs: [
            {
                question: 'Is my JSON data sent to a server?',
                answer: 'No. This tool runs entirely in your web browser using JavaScript. No data is ever sent to our servers, ensuring your API keys and private data remain secure.'
            },
            {
                question: 'Why is my JSON invalid?',
                answer: 'Common reasons include missing quotes around keys, trailing commas (which are not allowed in standard JSON), or using single quotes instead of double quotes.'
            },
            {
                question: 'Can I format large files?',
                answer: 'Yes. Since we process data locally, we can handle significantly larger files than server-based tools without timing out, limited only by your browser\'s memory.'
            }
        ],
        howItWorks: jsonFormatterContent
    },
    {
        slug: 'base64-encode-decode',
        title: 'Base64 Encoder / Decoder',
        description: 'Convert text to Base64 or decode Base64 strings back to text. fast, client-side, and handles UTF-8 characters correctly.',
        category: 'encoders',
        keywords: ['base64 encode', 'base64 decode', 'string to base64', 'base64 converter'],
        faqs: [
            { question: 'What characters are used in Base64?', answer: 'Base64 uses A-Z, a-z, 0-9, +, and /.' },
            { question: 'Is Base64 encryption?', answer: 'No, it is an encoding scheme, not encryption. It can be easily decoded.' }
        ],
        howItWorks: `<p>Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is designed to carry data stored in binary formats across channels that only reliably support text content.</p>
        <p><strong>Common Uses:</strong></p>
        <ul>
            <li>Embedding images directly into HTML or CSS files.</li>
            <li>Encoding binary data for email attachments (MIME).</li>
            <li>Storing complex data in URLs.</li>
        </ul>`
    },
    {
        slug: 'url-encode-decode',
        title: 'URL Encoder / Decoder',
        description: 'Escape special characters in URLs (percent-encoding) or decode them back. Essential for debugging query parameters and API strings.',
        category: 'encoders',
        keywords: ['url encode', 'url decode', 'percent encoding', 'uri component'],
        faqs: [
            { question: 'Why do URLs need encoding?', answer: 'URLs can only send ASCII characters. Special characters like spaces, "&", or "?" have special meanings and must be escaped to be treated as data.' },
            { question: 'What is the difference between encodeURI and encodeURIComponent?', answer: 'encodeURIComponent encodes characters like "&", "+", and "=" which usually separate query parameters, making it safer for encoding values.' }
        ],
        howItWorks: `<p>URL Encoding (Percent-encoding) converts characters into a format that can be transmitted over the Internet. It replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits.</p>`
    },
    {
        slug: 'word-counter',
        title: 'Word & Character Counter',
        description: 'Count words, characters, sentences, and paragraphs in real-time. Includes reading time estimation. Perfect for essays, tweets, and SEO.',
        category: 'text',
        keywords: ['word counter', 'character count', 'sentence counter', 'reading time', 'text length'],
        faqs: [
            { question: 'Does it count spaces?', answer: 'We provide two counts: one with spaces and one without. Most platforms (like Twitter) count spaces towards the limit.' },
            { question: 'How is reading time calculated?', answer: 'We assume an average reading speed of 200 words per minute, which is standard for adult readers.' }
        ],
        howItWorks: wordCounterContent
    },
    {
        slug: 'json-to-csv',
        title: 'JSON to CSV Converter',
        description: 'Convert nested JSON arrays to CSV format for Excel or Google Sheets. flattens objects and handles headers automatically.',
        category: 'converters',
        keywords: ['json to csv', 'json2csv', 'convert json to excel', 'flatten json'],
        faqs: [
            { question: 'How are nested objects handled?', answer: 'This tool attempts to flatten simple nested objects. Deeply nested structures will be stringified to fit into a single CSV cell.' },
            { question: 'Can I open the result in Excel?', answer: 'Yes. The output is a standard CSV file which can be opened natively by Excel, Numbers, or Google Sheets.' }
        ],
        howItWorks: jsonToCsvContent
    },
    {
        slug: 'jwt-decoder',
        title: 'JWT Decoder (Debug Only)',
        description: 'Decode JSON Web Tokens (JWT) to inspect headers and payloads. Client-side only for security - no secret keys required.',
        category: 'dev-utils',
        keywords: ['jwt decoder', 'decode jwt', 'jwt inspector', 'debug jwt', 'json web token'],
        faqs: [
            { question: 'Do you verify the signature?', answer: 'No. To verify a signature, we would need your private secret key. For security, we never ask for your secret key. This tool is for inspecting the payload only.' },
            { question: 'Is it safe to paste my production token?', answer: 'Yes. The decoding happens entirely in your browser memory. We validly never send your tokens to any external server.' }
        ],
        howItWorks: jwtContent
    },
    {
        slug: 'uuid-generator',
        title: 'UUID Generator (v4)',
        description: 'Generate secure, random UUIDs (Universally Unique Identifiers) version 4 locally in your browser. Bulk generation supported.',
        category: 'dev-utils',
        keywords: ['uuid generator', 'guid generator', 'random uuid', 'uuid v4', 'bulk uuid'],
        faqs: [
            { question: 'Are these UUIDs unique?', answer: 'Yes. Version 4 UUIDs use 122 bits of randomness. The probability of collision is astronomically low.' },
            { question: 'How many can I generate at once?', answer: 'You can generate up to 50 UUIDs at a time with this tool.' }
        ],
        howItWorks: `<p>A UUID (Universally Unique Identifier) is a 128-bit number used to identify information in computer systems. This tool generates Version 4 UUIDs, which are constructed using random numbers.</p>
        <p><strong>Format:</strong> <code>xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code></p>
        <ul>
            <li><strong>x</strong> is any hexadecimal digit.</li>
            <li><strong>4</strong> indicates version 4 (random).</li>
            <li><strong>y</strong> is one of 8, 9, A, or B.</li>
        </ul>
        <p>Because it uses the browser's cryptographic <code>crypto.randomUUID()</code> API, it is suitable for production use cases.</p>`
    },
    {
        slug: 'html-escape-unescape',
        title: 'HTML Entity Escape / Unescape',
        description: 'Escape special characters to HTML entities (e.g. < to &lt;) or unescape them back. Prevent XSS and format code for display.',
        category: 'dev-utils',
        keywords: ['html escape', 'html encode', 'sanitize html', 'xss prevention', 'xml escape'],
        faqs: [
            { question: 'Why do I need to escape HTML?', answer: 'If you display user input directly on a webpage, a malicious user could inject Javascript (XSS). Escaping converts special characters like < and > into safe text representations.' },
            { question: 'What characters are escaped?', answer: 'The standard set includes: & (&amp;), < (&lt;), > (&gt;), " (&quot;), and \' (&#39;).' }
        ],
        howItWorks: `<p>HTML escaping replaces "unsafe" characters with "HTML entities". This tells the browser to treat them as text content rather than code to be executed.</p>
        <p><strong>Common Developer Use Cases:</strong></p>
        <ul>
            <li>Displaying code snippets on a blog (so <code>&lt;div&gt;</code> shows up as text instead of creating a div).</li>
            <li>Sanitizing user input before saving to a database or rendering.</li>
            <li>Preventing Cross-Site Scripting (XSS) attacks.</li>
        </ul>`
    }
];

export const getToolBySlug = (slug: string) => tools.find(t => t.slug === slug);
