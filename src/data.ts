import { CategoryItem, ToolItem, BlogPost, SEOSettings } from "./types";

export const CATEGORIES: CategoryItem[] = [
  {
    id: "ai-tools",
    name: "AI Tools",
    description: "Smart AI-powered text generators and assistants",
    icon: "Sparkles",
    color: "blue"
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    description: "Manage, convert, and format PDF documents",
    icon: "FileText",
    color: "orange"
  },
  {
    id: "image-tools",
    name: "Image Tools",
    description: "Compress, resize, and edit images instantly",
    icon: "Image",
    color: "green"
  },
  {
    id: "text-tools",
    name: "Text Tools",
    description: "Format, convert, clean, and analyze text strings",
    icon: "Type",
    color: "blue"
  },
  {
    id: "seo-tools",
    name: "SEO Tools",
    description: "Analyze, optimize, and generate meta tags",
    icon: "Search",
    color: "green"
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description: "Format JSON, encode/decode, generate UUIDs and QR codes",
    icon: "Code",
    color: "orange"
  },
  {
    id: "student-tools",
    name: "Student Tools",
    description: "Calculators and conversion assistants for school work",
    icon: "GraduationCap",
    color: "blue"
  },
  {
    id: "finance-calculators",
    name: "Finance Calculators",
    description: "Calculate loans, interests, percentages, and currencies",
    icon: "Coins",
    color: "green"
  },
  {
    id: "unit-converters",
    name: "Unit Converters",
    description: "Convert speeds, lengths, temperatures, and data units",
    icon: "RefreshCw",
    color: "orange"
  }
];

export const INITIAL_TOOLS: ToolItem[] = [
  {
    id: "pdf-merger",
    name: "PDF Merger",
    description: "Combine multiple PDF documents into a single file with custom page orders.",
    detailedDescription: "Load multiple PDF files, view their layouts, dynamically arrange the order of your files, and compile them into a single high-quality PDF in seconds. Perfect for compiling chapters, combining receipts, or merging reports completely local.",
    category: "pdf-tools",
    path: "pdf-merger",
    icon: "FileText",
    isPopular: true,
    faqs: [
      {
        question: "Is there a limit on file size or number of files?",
        answer: "No, since merging occurs entirely client-side in your local browser, there are no file-size limits or bandwidth restrictions. Only your local system memory determines the speed!"
      },
      {
        question: "Are my documents secure?",
        answer: "Absolutely. Your PDF files are never uploaded to our servers or processed remotely. Everything remains strictly inside your browser tab."
      }
    ]
  },
  {
    id: "pdf-splitter",
    name: "PDF Splitter & Page Extractor",
    description: "Extract specific page ranges or split select sections from a PDF document.",
    detailedDescription: "Extract individual pages or ranges (e.g. 1-3, 5) from a PDF into a brand new document. Features a visual selector showing all page counts, plus range fields for instant separation completely offline.",
    category: "pdf-tools",
    path: "pdf-splitter",
    icon: "Scissors",
    isPopular: true,
    faqs: [
      {
        question: "Can I extract specific non-sequential pages?",
        answer: "Yes, you can input exact pages like '1-3, 5, 12' or click on page cards in our visual grid to select exactly which pages you want to keep."
      }
    ]
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF Converter",
    description: "Convert PNG, JPEG, and WebP images into formatted PDF documents.",
    detailedDescription: "Transform multiple image assets into a beautiful PDF publication. Adjust layout formatting, orientation (Auto, Portrait, Landscape), and padding/margins. Excellent for digitizing documents or compiling presentation slides.",
    category: "pdf-tools",
    path: "image-to-pdf",
    icon: "FileImage",
    isPopular: true,
    faqs: [
      {
        question: "What image formats are supported?",
        answer: "You can convert PNG, JPEG, and WebP images instantly into PDF pages."
      }
    ]
  },
  {
    id: "text-to-pdf",
    name: "Text to PDF Document Generator",
    description: "Convert plain text notes, letters, and articles into formatted multi-page PDFs.",
    detailedDescription: "Compose documents or paste text, select premium layout styles (Corporate, Editorial, Technical Draft), modify fonts, and compile them with running page numbers. Automatically breaks long pages.",
    category: "pdf-tools",
    path: "text-to-pdf",
    icon: "Type",
    isPopular: false,
    faqs: [
      {
        question: "Does it support long documents?",
        answer: "Yes, our generation engine splits your text lines dynamically and creates page breaks automatically whenever it detects a page boundary overflow."
      }
    ]
  },
  {
    id: "pdf-page-organizer",
    name: "PDF Page Organizer & Rotator",
    description: "Visually rearrange pages, rotate skewed pages, and delete unneeded sections.",
    detailedDescription: "Upload a PDF document to view pages as an interactive canvas. Easily rotate crooked pages by 90-degree increments, drag/click to reorder page sequences, delete unwanted pages, and download the perfect final layout.",
    category: "pdf-tools",
    path: "pdf-page-organizer",
    icon: "LayoutGrid",
    isPopular: true,
    faqs: [
      {
        question: "Does rotating pages lose PDF text quality?",
        answer: "No, our tool modifies the rotation property at the document structure level, meaning images and text characters retain 100% of their original high-resolution vector sharpness."
      }
    ]
  },
  {
    id: "pdf-metadata-editor",
    name: "PDF Metadata Editor",
    description: "Inspect and update PDF tags, authors, titles, and SEO keywords.",
    detailedDescription: "Enhance your document search engine optimization (SEO) by modifying embedded PDF details. Add keywords, update authors, set custom titles, or change the creation application completely client-side.",
    category: "pdf-tools",
    path: "pdf-metadata-editor",
    icon: "Edit3",
    isPopular: false,
    faqs: [
      {
        question: "Why should I update PDF metadata?",
        answer: "Search engines parse the internal title, description, and keywords of PDFs to rank them in search results. Properly configured metadata greatly improves indexing popularity."
      }
    ]
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate beautiful, high-quality QR codes for URLs, text, Wi-Fi networks, and contact cards.",
    detailedDescription: "Generate fully customizable QR codes with options to change foreground and background colors, size, and margin. Ideal for marketing materials, restaurant menus, product packaging, and easy text/URL sharing. The generated code can be downloaded instantly in PNG format or copied as a data URL.",
    category: "developer-tools",
    path: "qr-code-generator",
    icon: "QrCode",
    isPopular: true,
    faqs: [
      {
        question: "What is a QR Code?",
        answer: "A QR code (Quick Response code) is a two-dimensional matrix barcode that can be scanned by smartphones and cameras to instantly redirect users to websites, share contact info, or perform actions."
      },
      {
        question: "Are these QR codes safe to use?",
        answer: "Yes! They are generated entirely client-side in your browser. No data is sent to our servers, making them 100% private and secure."
      },
      {
        question: "Do QR codes expire?",
        answer: "No, static QR codes never expire. They contain the direct text or URL hardcoded inside, meaning they will work indefinitely as long as the destination URL remains active."
      }
    ]
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Create highly secure, randomized passwords with customizable length and character sets.",
    detailedDescription: "Protect your online accounts with cryptographically secure passwords. Customize length (up to 128 characters), toggle uppercase letters, lowercase letters, numbers, and symbols, and exclude confusing characters like l, 1, o, and 0. Features an instant password strength meter and a copy button.",
    category: "developer-tools",
    path: "password-generator",
    icon: "Key",
    isPopular: true,
    faqs: [
      {
        question: "What makes a password secure?",
        answer: "A secure password is long (12+ characters), completely random, and includes a mix of uppercase and lowercase letters, numbers, and special symbols. It should never contain dictionary words or personal information."
      },
      {
        question: "Are my passwords stored?",
        answer: "No, passwords are generated locally using the Web Crypto API or random math. We never store or transmit your passwords to any server."
      }
    ]
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs in real-time, plus check reading time.",
    detailedDescription: "An advanced writing assistant that analyzes your text as you type. It calculates word count, character count (with and without spaces), paragraph count, sentence count, and estimates the reading and speaking times. Perfect for essays, blog posts, tweets, and social media constraints.",
    category: "text-tools",
    path: "word-counter",
    icon: "FileText",
    isPopular: true,
    faqs: [
      {
        question: "What is the average reading speed used?",
        answer: "We use a standard reading speed of 220 words per minute (WPM) and speaking speed of 130 words per minute to calculate the estimates."
      },
      {
        question: "Is there a limit to the text size?",
        answer: "No, you can paste large articles, chapters, or entire books. The text analysis is done completely client-side in milliseconds."
      }
    ]
  },
  {
    id: "character-counter",
    name: "Character Counter",
    description: "An optimized tool focusing specifically on character and syllable density, ideal for social media limits.",
    detailedDescription: "Keep track of strict social media character limits. Features custom templates for Twitter (280), Meta Ads, Google SEO titles (60), and meta descriptions (160). It alerts you with clean color indicators when you exceed the limits.",
    category: "text-tools",
    path: "character-counter",
    icon: "AlignLeft",
    isPopular: false,
    faqs: [
      {
        question: "What are the common limits for social media?",
        answer: "Twitter limits tweets to 280 characters. Google search titles are optimal at 50-60 characters, and meta descriptions are best kept under 160 characters."
      }
    ]
  },
  {
    id: "text-case-converter",
    name: "Text Case Converter",
    description: "Instantly transform text between UPPERCASE, lowercase, Title Case, Sentence Case, and more.",
    detailedDescription: "Quickly format any text block. Supports conversion to UPPERCASE, lowercase, Title Case (capitalize starting letter of each major word), Sentence Case (capitalize the first letter of each sentence), camelCase, kebab-case, snake_case, or alternating case.",
    category: "text-tools",
    path: "text-case-converter",
    icon: "ALargeSmall",
    isPopular: true,
    faqs: [
      {
        question: "What is Kebab-Case and Snake-Case?",
        answer: "kebab-case separates words with hyphens (e.g., text-case-converter), commonly used in URLs. snake_case separates words with underscores (e.g., text_case_converter), commonly used in programming databases."
      }
    ]
  },
  {
    id: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    description: "Clean up list text by deleting repetitive rows and organizing them alphabetically.",
    detailedDescription: "A powerful tool to deduplicate lists, clean code rows, or sanitize records. Options include trimming whitespace on individual lines, ignoring casing difference, sorting output alphabetically, and displaying exactly how many duplicates were detected and removed.",
    category: "text-tools",
    path: "remove-duplicate-lines",
    icon: "Filter",
    isPopular: false,
    faqs: [
      {
        question: "Can I ignore case when removing duplicates?",
        answer: "Yes, you can toggle the 'Ignore Case' option to treat 'Apple' and 'apple' as duplicates, preserving only the first occurrence."
      }
    ]
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Prettify, minify, validate, and clean up JSON strings instantly with syntax error detection.",
    detailedDescription: "A fully developer-oriented JSON playground. Paste raw minified JSON to beautify it with customizable indentation spacing (2 or 4 spaces), minify it to a single line, validate for syntax correctness, or catch JSON structural errors with helpful error message indicators.",
    category: "developer-tools",
    path: "json-formatter",
    icon: "Braces",
    isPopular: true,
    faqs: [
      {
        question: "What is JSON?",
        answer: "JSON (JavaScript Object Notation) is a lightweight format for storing and transporting data, commonly used when data is sent from a server to a web page."
      },
      {
        question: "How does the syntax validation work?",
        answer: "It parses the input using native JavaScript engines and returns detailed line errors if the syntax is broken (such as missing commas, brackets, or incorrect quoting)."
      }
    ]
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder",
    description: "Securely encode standard text strings or data streams into a robust Base64 format.",
    detailedDescription: "Convert regular string characters into safe Base64 representation. Perfect for transmitting binary data over text-based protocols, embedding image data directly into CSS or HTML files, or encoding URL query parameters securely.",
    category: "developer-tools",
    path: "base64-encoder",
    icon: "Lock",
    isPopular: false,
    faqs: [
      {
        question: "What is Base64 encoding?",
        answer: "Base64 is a binary-to-text encoding scheme that translates binary data into a set of 64 characters, making it highly compatible with internet protocols."
      }
    ]
  },
  {
    id: "base64-decoder",
    name: "Base64 Decoder",
    description: "Decode Base64 encoded strings back into readable, human-friendly text format.",
    detailedDescription: "Reverse any Base64 string back into plain readable characters. Automatically detects and alerts you if the input string is not a valid Base64 format, saving debugging time.",
    category: "developer-tools",
    path: "base64-decoder",
    icon: "Unlock",
    isPopular: false,
    faqs: [
      {
        question: "Will my decoded data remain secure?",
        answer: "Absolutely. Just like our other utilities, the decoding occurs 100% inside your local browser tab, without uploading anything online."
      }
    ]
  },
  {
    id: "url-encoder",
    name: "URL Encoder",
    description: "Encode query parameters, paths, or URLs into safe browser-compliant percentage-encoded formats.",
    detailedDescription: "Convert unsafe URL characters (like spaces, ampersands, and brackets) into safe standard percent-encoded values. Crucial for web development, API requests, and creating query strings.",
    category: "developer-tools",
    path: "url-encoder",
    icon: "CornerDownRight",
    isPopular: false,
    faqs: [
      {
        question: "Why do I need to encode URLs?",
        answer: "URLs can only contain certain safe characters from the ASCII character set. Special characters like spaces or question marks have special meanings and must be escaped to prevent broken URL links."
      }
    ]
  },
  {
    id: "url-decoder",
    name: "URL Decoder",
    description: "Decode URL-percent-encoded strings back into standard, readable text characters.",
    detailedDescription: "Convert percent-escaped text (such as %20 or %2F) back into clear spaces, slashes, and symbols. Perfect for analyzing browser history paths, raw logs, or web API responses.",
    category: "developer-tools",
    path: "url-decoder",
    icon: "CornerDownLeft",
    isPopular: false,
    faqs: [
      {
        question: "What characters get decoded?",
        answer: "Any string containing '%' followed by two hexadecimal digits is decoded into its corresponding ASCII or UTF-8 character representation."
      }
    ]
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "Generate single or batch cryptographically secure RFC4122 Version 4 UUIDs.",
    detailedDescription: "Generate universally unique identifiers (UUIDv4) that are fully compliant with RFC 4122 standards. Supports bulk generation (up to 100 UUIDs at once), customizable options for uppercase letters, dashes inclusion, and instant bulk download or copying.",
    category: "developer-tools",
    path: "uuid-generator",
    icon: "Binary",
    isPopular: false,
    faqs: [
      {
        question: "What is a UUIDv4?",
        answer: "A Universally Unique Identifier version 4 is a 128-bit number represented as 32 hexadecimal characters, randomly generated to provide virtually zero probability of collision."
      }
    ]
  },
  {
    id: "color-picker",
    name: "Color Picker",
    description: "An interactive canvas color picker with RGB, HEX, HSL, and CMYK formats, and a built-in contrast checker.",
    detailedDescription: "A fully interactive tool for designers and developers. Pick colors via visual sliders, input specific HEX, RGB, HSL, or CMYK codes, and analyze contrast ratio according to WCAG 2.1 standards for text legibility.",
    category: "developer-tools",
    path: "color-picker",
    icon: "Palette",
    isPopular: true,
    faqs: [
      {
        question: "What is the WCAG contrast requirement?",
        answer: "For AA standard, body text needs a contrast ratio of at least 4.5:1. For AAA standard, it needs at least 7:1. Large headers can be 3:1 (AA) or 4.5:1 (AAA)."
      }
    ]
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index (BMI) using metric or imperial values, with instant health class results.",
    detailedDescription: "Determine body mass index (BMI) quickly for adults. Supports both Metric units (kilograms/centimeters) and Imperial units (pounds/inches). Displays standard weight categories (Underweight, Normal, Overweight, Obese) with visual sliders and healthy weight target indicators.",
    category: "student-tools",
    path: "bmi-calculator",
    icon: "Activity",
    isPopular: false,
    faqs: [
      {
        question: "What is BMI?",
        answer: "Body Mass Index is a simple calculation of a person's weight divided by the square of their height, indicating whether a person is in a healthy weight range."
      },
      {
        question: "Is BMI accurate for everyone?",
        answer: "While BMI is a useful general screening tool, it does not directly measure body fat or muscle mass. Athletes, pregnant women, and the elderly may have different weight indicators."
      }
    ]
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age down to months, weeks, days, hours, and minutes based on birth date.",
    detailedDescription: "A fun and highly precise calculation tool. Choose a birthdate and calculate exactly how old a person, event, or object is, measured in years, months, days, weeks, hours, and minutes. Also shows the exact day of the week you were born and days remaining until your next birthday.",
    category: "student-tools",
    path: "age-calculator",
    icon: "Calendar",
    isPopular: true,
    faqs: [
      {
        question: "How is leap year accounted for?",
        answer: "Our engine uses native JavaScript Date libraries, which accurately calculate leap years and precise calendar month differences."
      }
    ]
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Solve three distinct percentage operations: simple percent, fraction percent, and value change.",
    detailedDescription: "Perform percentage math with zero effort. Features three separate calculators: 1) What is X% of Y? 2) X is what percentage of Y? 3) What is the percentage increase or decrease from X to Y? Perfect for financial modeling, sales margins, and homework.",
    category: "finance-calculators",
    path: "percentage-calculator",
    icon: "Percent",
    isPopular: false,
    faqs: [
      {
        question: "How is percentage increase calculated?",
        answer: "It is calculated by taking the difference between the new value and original value, dividing by the original value, and multiplying by 100."
      }
    ]
  },
  {
    id: "binary-converter",
    name: "Binary Converter",
    description: "Convert text or decimal numbers to binary representations and vice versa instantly.",
    detailedDescription: "Perfect for students and computer science enthusiasts. Convert readable English text into 8-bit binary blocks, binary strings back to text, decimal numbers to binary, and binary sequences to decimal digits.",
    category: "developer-tools",
    path: "binary-converter",
    icon: "Cpu",
    isPopular: false,
    faqs: [
      {
        question: "What is 8-bit binary representation?",
        answer: "Each letter is represented by an 8-bit binary byte that maps to its ASCII/Unicode character value. For instance, 'A' is 01000001."
      }
    ]
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    description: "Convert exchange rates between major global currencies with live API feeds and robust offline fallback.",
    detailedDescription: "Exchange currency values instantly. Includes fully live currency price updates via open API feeds for major rates like USD, EUR, GBP, JPY, CAD, AUD, INR, and others, with reliable offline backups.",
    category: "finance-calculators",
    path: "currency-converter",
    icon: "DollarSign",
    isPopular: true,
    faqs: [
      {
        question: "Where do the exchange rates come from?",
        answer: "The currency converter fetches live prices directly from open-source exchange rate feeds. It updates prices daily or acts with smart offline defaults."
      }
    ]
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Reduce image file sizes (PNG, JPEG, WebP) by adjusting compression ratio, entirely in your browser.",
    detailedDescription: "An exceptional image optimizer. Load images and compress them dynamically using canvas elements. Customize compression levels (10% to 100%), preview the compressed file size beforehand, and download your optimized image. Extremely fast with no upload bandwidth needed.",
    category: "image-tools",
    path: "image-compressor",
    icon: "ChevronsDown",
    isPopular: true,
    faqs: [
      {
        question: "Is there a limit on image upload?",
        answer: "No, because the images are compressed directly on your computer. No files are uploaded to our servers, meaning you can optimize massive files completely privately."
      },
      {
        question: "Will I lose image quality?",
        answer: "By choosing a high-quality range (such as 75-80%), you can significantly shrink file size (often by 50-70%) with almost no visible difference in quality."
      }
    ]
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize image dimensions (width and height) by pixel values or percentage ratio while keeping aspect ratio.",
    detailedDescription: "Easily adjust pixel dimensions of any image. Set custom widths and heights, lock the aspect ratio to prevent stretching, scale images up or down by percentage ratios, and download your resized file instantly.",
    category: "image-tools",
    path: "image-resizer",
    icon: "Maximize",
    isPopular: false,
    faqs: [
      {
        question: "Can I resize PNG and JPEG?",
        answer: "Yes, our canvas resizer fully supports JPEG, PNG, and WebP formats, maintaining transparent backdrops when exporting PNGs."
      }
    ]
  },
  {
    id: "youtube-seo",
    name: "YouTube SEO & Tag Generator",
    description: "Evaluate your video title and description against ranking indicators, generate high-intent tags, and build emotional high-CTR hooks.",
    detailedDescription: "Maximize your search traffic by optimizing video metadata. This tool audits your video titles for length and click-driving power words, analyzes descriptions for keyword density, and generates an optimized tag set based on your primary keywords to power high rankings.",
    category: "seo-tools",
    path: "youtube-seo",
    icon: "Search",
    isPopular: true,
    faqs: [
      {
        question: "How does YouTube SEO work?",
        answer: "YouTube's search algorithm reads your video title, description, and tags to understand what your video is about. High alignment of search intent with clear metadata helps index your video for correct audience buckets."
      },
      {
        question: "Are tags still important for YouTube ranking?",
        answer: "While YouTube states tags are primarily useful for correcting common misspellings, they still play a crucial role in topical associations, grouping videos into search results, and populating sidebar recommendations."
      }
    ]
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube Thumbnail Extractor",
    description: "Extract and download high-resolution cover thumbnails directly from any YouTube video URL.",
    detailedDescription: "Instantly retrieve the official cover art thumbnails associated with any YouTube video in four different qualities (Ultra HD 720p, Standard High, Medium, and Default). Perfect for studying competitor thumbnail styles, graphic references, or offline presentation slide materials.",
    category: "image-tools",
    path: "youtube-thumbnail",
    icon: "Image",
    isPopular: true,
    faqs: [
      {
        question: "Why can't I load the Ultra HD resolution thumbnail?",
        answer: "Ultra HD (1280x720) thumbnails are only available if the creator uploaded a high-resolution custom thumbnail. If they uploaded a small image or used a default capture frame, standard High or Medium quality is the maximum available."
      },
      {
        question: "Is extracting and using thumbnails legal?",
        answer: "Extracting thumbnail images for personal reference, education, or critique is generally considered fair use. Re-uploading them directly for commercial purposes may infringe the copyright of the original content creator."
      }
    ]
  },
  {
    id: "youtube-analytics",
    name: "YouTube Analytics & CPM Calculator",
    description: "Project channel revenue based on views and CPM, calculate video engagement scores, and model subscriber trend charts.",
    detailedDescription: "A fully comprehensive creator simulator dashboard. Run revenue modeling projections based on target CPM bids, analyze total audience engagement rates against YouTube baseline averages, and project subscription acquisitions over several months with smooth trend charts.",
    category: "seo-tools",
    path: "youtube-analytics",
    icon: "DollarSign",
    isPopular: true,
    faqs: [
      {
        question: "What is CPM vs RPM?",
        answer: "CPM (Cost Per Mille) represents the price advertisers pay to place 1,000 ads on your video. RPM (Revenue Per Mille) represents your actual earnings per 1,000 views, after the standard 45% YouTube platform split and ad-skipped views are calculated."
      },
      {
        question: "What is a good organic video engagement rate?",
        answer: "An average YouTube engagement rate (likes + comments + shares divided by views) ranges between 1% and 3.5%. Tiers above 3.5% represent high interactive community interest, which significantly triggers algorithm discovery waves."
      }
    ]
  }
];

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "Why Client-Side Utility Tools Are the Future of Web Productivity",
    slug: "client-side-utility-tools-future",
    content: "When using online tools, privacy and speed are the most important parameters. Historically, converting a PDF or compressing an image required uploading your files to a distant remote server, which was slow, consumed mobile data, and raised massive privacy risks. \n\nToday, modern Web APIs like HTML5 Canvas, Web Cryptography, and local Web Assembly modules let browsers execute complex tasks directly on your laptop or smartphone. This means 100% offline security, zero file retention, and instant execution. At ToolMora, we construct all 20 of our utility tools to operate fully inside your browser tab. Your files never leave your device.",
    excerpt: "Discover how modern browser technologies allow complex image compression, password generation, and document handling to occur safely client-side.",
    date: "July 7, 2026",
    author: "Elena Vance",
    category: "Developer Tools",
    readTime: "4 min read",
    tags: ["Privacy", "Web Development", "Productivity"]
  },
  {
    id: "2",
    title: "10 Essential Security Practices for Developers in 2026",
    slug: "essential-security-practices-2026",
    content: "Security is no longer an afterthought. With a massive rise in automated cyber attacks, developers must build systems that are secure by default. This includes using cryptographically secure randomized generators for keys and passwords, ensuring clean JSON payload validation, escaping URL inputs to avoid injection, and using secure HTTPS boundaries. \n\nOur built-in Password Generator uses the browser's cryptographic window.crypto engine, creating high-entropy passwords that are impossible to predict. Read on to learn how to keep your systems protected against modern threat profiles.",
    excerpt: "Learn how to secure user credentials, validate inputs, and use secure browser APIs to build robust, modern web projects.",
    date: "July 5, 2026",
    author: "Marcus Aurelius",
    category: "Developer Tools",
    readTime: "6 min read",
    tags: ["Security", "Coding", "Systems"]
  },
  {
    id: "3",
    title: "Understanding Body Mass Index and Healthy Living Standards",
    slug: "understanding-bmi-healthy-living",
    content: "Maintaining a balanced lifestyle starts with understanding basic health metrics. The Body Mass Index (BMI) is a simple, internationally-recognized mathematical formula used to screen for weight categories. \n\nWhile BMI does not measure body fat percentage directly, it serves as a helpful baseline for the average adult. In this guide, we break down what each BMI category signifies, how to calculate healthy weight ranges, and how tools like our Age and BMI Calculators can assist in tracking personal wellness targets.",
    excerpt: "Demystifying body mass index calculations and exploring practical steps to maintain a healthy weight and lifestyle.",
    date: "June 28, 2026",
    author: "Dr. Sarah Chen",
    category: "Student Tools",
    readTime: "5 min read",
    tags: ["Health", "Calculators", "Wellness"]
  }
];

export const DEFAULT_SEO_SETTINGS: SEOSettings = {
  metaTitle: "ToolMora – Free Online Multi-Tools for Everyone",
  metaDescription: "Access 20 free, high-performance online utility tools including QR Code Generator, Image Compressor, JSON Formatter, Calculators and more. 100% Client-Side & Secure.",
  keywords: "free online tools, qr code generator, image compressor, password generator, text case converter, JSON formatter, currency converter, BMI calculator",
  robotsTxt: `User-agent: *
Disallow: /admin
Allow: /

Sitemap: https://toolmora.com/sitemap.xml`,
  sitemapXml: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://toolmora.com/</loc>
    <lastmod>2026-07-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://toolmora.com/all-tools</loc>
    <lastmod>2026-07-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://toolmora.com/categories</loc>
    <lastmod>2026-07-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
};
