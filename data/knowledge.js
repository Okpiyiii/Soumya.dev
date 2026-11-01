/* ============================================================
   soumya.dev — knowledge base for the "Ask about Soumya" assistant.

   Retrieval only: the assistant matches a question against these
   entries and replies with `answer` verbatim. There is no model
   generating text, so it cannot invent facts.

   Every answer below is derived from copy that already appears on
   this site. Nothing was invented.

   ── Adding an entry ─────────────────────────────────────────
     id        unique key
     q         phrasings a visitor might type  (indexed)
     keywords  extra matching terms            (indexed)
     tags      grouping / boost terms          (indexed)
     answer    the reply, shown verbatim
     related   ids offered as follow-up chips

   Bump `version` whenever you edit this file — it invalidates the
   cached embedding vectors.
   ============================================================ */
window.SOUMYA_KB = {
  version: 3,

  /* Tappable chips shown when the panel first opens. */
  starters: ['role', 'techstack', 'projects-overview', 'skills-ml', 'contact'],

  entries: [
    /* ---------- about ---------- */
    {
      id: 'role',
      q: [
        'what do you do',
        'what are you',
        'your role',
        'who are you',
        'who is soumya',
        'tell me about yourself',
        'introduce yourself',
        'what is your job',
        'what do you work on',
      ],
      keywords: ['ml', 'ai', 'engineer', 'developer', 'full-stack', 'fullstack', 'generative', 'genai'],
      tags: ['about'],
      answer:
        "I'm Soumya — a full-stack developer and ML/AI engineer. From model training to production deployment, I build intelligent systems that learn, adapt and deliver real-world impact, plus the web applications that house them.",
      related: ['skills-ml', 'projects-overview', 'contact'],
    },
    {
      id: 'bio',
      q: ['about you', 'your background', 'your story', 'what is he like', 'describe yourself'],
      keywords: ['bio', 'background', 'story', 'person', 'personality', 'react', 'tailwind'],
      tags: ['about'],
      answer:
        "Hey, I'm Soumya. I spend most of my time talking to AI models and convincing them to do cool things. My main gig is Generative AI, but when I'm not playing AI whisperer, I build sleek, interactive web applications to house those models. I basically make the robots smart, and then use React and Tailwind to make them look good.",
      related: ['role', 'interests', 'stats'],
    },
    {
      id: 'interests',
      q: ['hobbies', 'what do you do for fun', 'outside of work', 'free time', 'your interests'],
      keywords: ['hobby', 'hobbies', 'fun', 'momos', 'photography', 'mountains', 'photos', 'afk'],
      tags: ['about'],
      answer:
        "If I'm AFK, I'm probably surviving off a plate of fried momos or freezing my hands off taking photos in the mountains.",
      related: ['bio', 'contact'],
    },
    {
      id: 'stats',
      q: ['how many projects have you done', 'how many hackathons', 'your numbers'],
      keywords: ['hackathons', 'projects', 'shipped', 'count', 'stats', 'numbers'],
      tags: ['about'],
      answer: "So far that's 4+ hackathons and 6+ projects shipped.",
      related: ['projects-overview', 'contact'],
    },

    /* ---------- services ---------- */
    {
      id: 'skills-ml',
      q: [
        'do you do machine learning',
        'do you do ai',
        'machine learning experience',
        'what machine learning can you do',
        'deep learning',
        'genai work',
        'nlp work',
      ],
      keywords: [
        'ml', 'ai', 'deep', 'learning', 'neural', 'cnn', 'rnn', 'ann', 'nlp', 'langchain',
        'embeddings', 'genai', 'scikit-learn', 'scikitlearn', 'pandas', 'matplotlib', 'plotly',
        'pipelines', 'llm', 'llms', 'tensorflow', 'numpy',
      ],
      tags: ['skills'],
      answer:
        'ML & AI Engineering — building intelligent systems end-to-end, from data pipelines and classical ML to deep learning architectures and production-ready GenAI applications powered by large language models. Tools: Scikit-Learn, Pandas, Matplotlib, Plotly, RNN, CNN, ANN, NLP, LangChain, Embeddings, GenAI.',
      related: ['techstack', 'project-ambient-habit', 'skills-web'],
    },
    {
      id: 'skills-web',
      q: [
        'do you do web development',
        'do you do frontend',
        'do you do backend',
        'can you build a website',
        'full stack work',
        'do you build apps',
      ],
      keywords: [
        'web', 'frontend', 'front-end', 'backend', 'back-end', 'html', 'css', 'javascript',
        'tailwind', 'fastapi', 'render', 'firebase', 'supabase', 'sql', 'nosql', 'api', 'apis',
        'database', 'databases', 'react', 'next.js', 'nextjs', 'node',
      ],
      tags: ['skills'],
      answer:
        'Web Stack — crafting full-stack web experiences from pixel-perfect frontends to robust backend APIs and scalable cloud databases, all deployed and production-ready. Tools: HTML, CSS, JavaScript, Tailwind, FastAPI, Render, Firebase, Supabase, SQL, NoSQL.',
      related: ['skills-ml', 'projects-overview', 'contact'],
    },
    {
      id: 'skills-code',
      q: ['do you write clean code', 'code quality', 'how do you structure code', 'your practices'],
      keywords: [
        'clean', 'architecture', 'maintainable', 'efficient', 'rest', 'apis', 'version', 'control',
        'git', 'ci', 'cd', 'cicd', 'practices', 'scalable', 'production',
      ],
      tags: ['skills'],
      answer:
        'Scalable Code — writing clean, maintainable, and efficient code using modern development practices, built to scale from prototype to production without breaking a sweat. Tools: Clean Architecture, REST APIs, Version Control, Git, CI/CD.',
      related: ['skills-web', 'skills-ml', 'contact'],
    },
    {
      id: 'techstack',
      q: [
        'what is your tech stack',
        'what technologies do you use',
        'what tools do you use',
        'what are you working with',
      ],
      keywords: [
        'stack', 'tech', 'technologies', 'technology', 'tools', 'languages', 'python', 'numpy',
        'tensorflow', 'scikit-learn', 'postgresql', 'mongodb', 'git', 'react', 'node',
      ],
      tags: ['skills'],
      answer:
        'On the ML/AI side: Python, Pandas, NumPy, TensorFlow, Scikit-Learn, Matplotlib, Plotly, LangChain, plus GenAI and NLP. On the web side: HTML, CSS, JavaScript, Tailwind, FastAPI, Firebase, Supabase, PostgreSQL, MongoDB, Render and Git.',
      related: ['skills-ml', 'skills-web', 'projects-overview'],
    },

    /* ---------- projects ---------- */
    {
      id: 'projects-overview',
      q: [
        'what have you built',
        'show me your projects',
        'your projects',
        'your work',
        'your portfolio',
        'case studies',
      ],
      keywords: ['projects', 'work', 'built', 'case', 'studies', 'shipped', 'apps', 'made'],
      tags: ['projects'],
      answer:
        'Three featured case studies: Ambient Habit (a Next.js + OpenAI habit tracker), Flowline CRM (a React + Node CRM and analytics platform for traders) and ClusterCart (a React + Web3 e-commerce dashboard with intelligent product clustering).',
      links: [
        { label: 'Ambient Habit', href: 'https://ambient-habit.vercel.app/' },
        { label: 'Flowline CRM', href: 'https://saas-flow-sigma.vercel.app/' },
        { label: 'ClusterCart', href: 'https://clustercart-mfw7.vercel.app/' },
        { label: 'GitHub', href: 'https://github.com/Okpiyiii' },
      ],
      related: ['project-ambient-habit', 'project-flowline-crm', 'project-clustercart'],
    },
    {
      id: 'project-ambient-habit',
      q: ['ambient habit', 'the habit tracker', 'what is ambient habit', 'tell me about ambient habit'],
      keywords: ['ambient', 'habit', 'tracker', 'habits', 'next.js', 'nextjs', 'openai', 'vercel', 'sdk', 'postgresql'],
      tags: ['projects'],
      answer:
        'Ambient Habit (001 / Full-Stack) — an aesthetically focused, minimalist web application designed to help users track daily habits and build consistency through a clean, distraction-free interface. Built with Next.js, OpenAI, the Vercel AI SDK and PostgreSQL.',
      links: [{ label: 'Open Ambient Habit', href: 'https://ambient-habit.vercel.app/' }],
      related: ['project-flowline-crm', 'project-clustercart', 'contact'],
    },
    {
      id: 'project-flowline-crm',
      q: ['flowline', 'flowline crm', 'the crm', 'tell me about flowline'],
      keywords: ['flowline', 'crm', 'saas', 'traders', 'trading', 'analytics', 'csv', 'redis', 'mongodb', 'node.js'],
      tags: ['projects'],
      answer:
        'Flowline CRM (002 / SaaS) — a sleek, minimalist CRM and analytics platform designed specifically for traders, featuring interactive data visualizations and seamless CSV import capabilities. Built with React, Node.js, MongoDB and Redis.',
      links: [{ label: 'Open Flowline CRM', href: 'https://saas-flow-sigma.vercel.app/' }],
      related: ['project-ambient-habit', 'project-clustercart', 'contact'],
    },
    {
      id: 'project-clustercart',
      q: ['clustercart', 'the dashboard', 'tell me about clustercart'],
      keywords: ['clustercart', 'dashboard', 'web3', 'ecommerce', 'e-commerce', 'cart', 'clustering', 'd3', 'graphql'],
      tags: ['projects'],
      answer:
        'ClusterCart (003 / Web3) — a modern, high-performance e-commerce web application featuring intelligent product clustering, dynamic cart management and an ultra-clean, minimalist interface. Built with React, Web3.js, D3.js and GraphQL.',
      links: [{ label: 'Open ClusterCart', href: 'https://clustercart-mfw7.vercel.app/' }],
      related: ['project-ambient-habit', 'project-flowline-crm', 'contact'],
    },
    {
      id: 'this-site',
      q: ['how did you build this website', 'what is this site built with', 'how was this site made'],
      keywords: ['site', 'website', 'canvas', 'vanilla', 'framework', 'theme', 'animation'],
      tags: ['projects'],
      answer:
        'This site is hand-written HTML, CSS and vanilla JavaScript — no framework. The hero runs a canvas neural-network animation, the tech marquee is generated in JS, and it has light and dark themes plus a scrollspy nav.',
      links: [{ label: 'GitHub', href: 'https://github.com/Okpiyiii' }],
      related: ['role', 'techstack', 'contact'],
    },

    /* ---------- contact ---------- */
    {
      id: 'contact',
      q: [
        'how do i contact you',
        'your email',
        'email address',
        'get in touch',
        'how do i reach you',
        'your github',
        'your linkedin',
      ],
      keywords: ['contact', 'email', 'mail', 'github', 'linkedin', 'reach', 'message'],
      tags: ['contact'],
      answer:
        "Easiest is email — soumyadeeppal4211@gmail.com. I'm also on GitHub (@Okpiyiii) and LinkedIn (Soumyadeep Pal).",
      links: [
        { label: 'Email', href: 'mailto:soumyadeeppal4211@gmail.com' },
        { label: 'GitHub', href: 'https://github.com/Okpiyiii' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/soumyadeep-pal-1a9929380' },
      ],
      related: ['links', 'availability', 'resume'],
    },
    {
      id: 'links',
      q: [
        'your links',
        'share your links',
        'send me your links',
        'where can i find you',
        'your profiles',
        'all your links',
        'your socials',
      ],
      keywords: ['links', 'link', 'profiles', 'profile', 'socials', 'social', 'find', 'connect'],
      tags: ['contact'],
      answer:
        'Here they are — the three live projects plus GitHub, LinkedIn and email:',
      links: [
        { label: 'Ambient Habit', href: 'https://ambient-habit.vercel.app/' },
        { label: 'Flowline CRM', href: 'https://saas-flow-sigma.vercel.app/' },
        { label: 'ClusterCart', href: 'https://clustercart-mfw7.vercel.app/' },
        { label: 'GitHub', href: 'https://github.com/Okpiyiii' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/soumyadeep-pal-1a9929380' },
        { label: 'Email', href: 'mailto:soumyadeeppal4211@gmail.com' },
      ],
      related: ['contact', 'projects-overview', 'resume'],
    },

    /* ---------- credentials (from the résumé) ---------- */
    {
      id: 'name',
      q: ['what is your full name', 'what is your name', 'your full name'],
      keywords: ['name', 'called', 'full', 'soumyadeep', 'pal'],
      tags: ['about'],
      answer: 'My full name is Soumyadeep Pal — Soumya for short.',
      related: ['role', 'contact'],
    },
    {
      id: 'availability',
      q: [
        'are you available for work',
        'are you open to work',
        'can i hire you',
        'do you freelance',
        'are you looking for a job',
        'are you available',
      ],
      keywords: ['available', 'availability', 'hire', 'hiring', 'freelance', 'job', 'opportunity', 'immediately'],
      tags: ['contact'],
      answer:
        "Yes — I'm available right now and open to opportunities. Email me at soumyadeeppal4211@gmail.com and I'll get back to you.",
      links: [{ label: 'Email me', href: 'mailto:soumyadeeppal4211@gmail.com' }],
      related: ['contact', 'resume', 'location'],
    },
    {
      id: 'location',
      q: ['where are you based', 'where do you live', 'your location', 'where are you from', 'what timezone'],
      keywords: ['location', 'located', 'based', 'live', 'city', 'country', 'kolkata', 'india', 'timezone', 'remote'],
      tags: ['contact'],
      answer: "I'm based in Kolkata, India.",
      related: ['contact', 'education', 'availability'],
    },
    {
      id: 'education',
      q: [
        'where did you study',
        'your education',
        'what did you study',
        'your degree',
        'which college',
        'what are you studying',
      ],
      keywords: [
        'education', 'study', 'studied', 'studying', 'degree', 'college', 'university', 'school',
        'course', 'btech', 'b.tech', 'ece', 'electronics', 'communication', 'academy', 'technology',
      ],
      tags: ['about'],
      answer:
        "I'm in my final year of a B.Tech in Electronics and Communication Engineering at the Academy of Technology, Kolkata, and I graduate in July 2027.",
      related: ['learning', 'skills-embedded', 'contact'],
    },
    {
      id: 'experience-years',
      q: [
        'how many years of experience',
        'how long have you been coding',
        'your experience',
        'have you worked anywhere',
      ],
      keywords: ['experience', 'years', 'seniority', 'fresher', 'internship', 'tcs', 'offer', 'timeline'],
      tags: ['about'],
      answer:
        "I'm a fresher — no full-time industry experience yet, though I do have an offer from TCS. Alongside that: 4+ hackathons, 6+ projects shipped, and a final-year project built on TinyML.",
      related: ['stats', 'education', 'contact'],
    },
    {
      id: 'resume',
      q: ['can i see your resume', 'your cv', 'download resume', 'do you have a resume'],
      keywords: ['resume', 'cv', 'download', 'pdf', 'attach'],
      tags: ['contact'],
      answer:
        "The résumé isn't hosted on the site yet — email me at soumyadeeppal4211@gmail.com and I'll send it over. Short version: final-year ECE student at the Academy of Technology, Kolkata, working across ML/AI and embedded ML, with projects spanning ML sales prediction, a trader CRM, a fraud-detection hackathon app and a TinyML predictive-maintenance final-year project.",
      links: [{ label: 'Email me', href: 'mailto:soumyadeeppal4211@gmail.com' }],
      related: ['contact', 'education', 'projects-overview'],
    },
    {
      id: 'learning',
      q: ['what are you learning', 'what are you currently learning', 'what are you studying right now'],
      keywords: ['learning', 'currently', 'improving', 'deep', 'advanced', 'growing'],
      tags: ['about'],
      answer:
        "Right now I'm going deeper on advanced machine learning and deep learning, and picking up React on the web side.",
      related: ['skills-ml', 'skills-web', 'education'],
    },

    /* ---------- skills & projects (from the résumé) ---------- */
    {
      id: 'skills-languages',
      q: [
        'what programming languages do you know',
        'what languages can you code in',
        'do you know c++',
      ],
      keywords: [
        'languages', 'programming', 'c++', 'python', 'javascript', 'sql', 'mysql', 'matlab',
        'simulink', 'arduino', 'proteus', 'seaborn', 'matplotlib',
      ],
      tags: ['skills'],
      answer:
        'Languages I work in: C, C++, Python, HTML, CSS, JavaScript and SQL (MySQL). Tooling: MATLAB, Simulink, Arduino and microcontrollers, and Proteus. Data/ML libraries: NumPy, Pandas, Matplotlib, Seaborn and Scikit-learn.',
      related: ['skills-embedded', 'techstack', 'skills-ml'],
    },
    {
      id: 'skills-embedded',
      q: [
        'do you know embedded systems',
        'do you know arduino',
        'electronics experience',
        'do you know iot',
      ],
      keywords: [
        'embedded', 'arduino', 'microcontroller', 'microcontrollers', 'matlab', 'simulink',
        'proteus', 'i2c', 'spi', 'sensor', 'interfacing', 'iot', 'electronics', 'hardware',
        'dsp', 'signal',
      ],
      tags: ['skills'],
      answer:
        'From my Electronics and Communication background: C and C++, MATLAB and Simulink, Arduino and microcontrollers, Proteus, the I2C and SPI protocols, sensor interfacing and basic control systems. My coursework covered digital signal processing, control systems, microprocessors, embedded systems, data structures, OOP in C++ and DBMS.',
      related: ['education', 'project-predictive-maintenance', 'skills-languages'],
    },
    {
      id: 'project-predictive-maintenance',
      q: [
        'what is your final year project',
        'tell me about your final year project',
        'predictive maintenance',
        'tinyml project',
      ],
      keywords: [
        'final', 'year', 'predictive', 'maintenance', 'tinyml', 'random', 'forest', 'edge',
        'anomaly', 'industrial',
      ],
      tags: ['projects'],
      answer:
        'My final-year project is a Predictive Maintenance System — an edge-AI solution for industrial systems built on TinyML. I implemented a Random Forest model optimised to run on low-power microcontrollers and detect system anomalies in real time, aiming to cut downtime and maintenance costs by predicting hardware failure before it happens.',
      related: ['skills-embedded', 'skills-ml', 'projects-overview'],
    },
    {
      id: 'project-bitrise',
      q: ['bitrise', 'fraud checker', 'fraud detection project', 'hackathon project'],
      keywords: ['bitrise', 'fraud', 'checker', 'detection', 'suspicious'],
      tags: ['projects'],
      answer:
        'BitRise is a fraud-detection app I built at a hackathon. I led the frontend — a responsive interface for monitoring suspicious activity — and helped with the backend integration so the detection logic and the UI flowed together.',
      related: ['projects-overview', 'skills-web', 'sih'],
    },
    {
      id: 'sih',
      q: ['smart india hackathon', 'sih', 'did you do any hackathons'],
      keywords: ['sih', 'smart', 'india', 'hackathon', 'hackathons', 'screening', 'prototype'],
      tags: ['about'],
      answer:
        'I cleared the college-level screening for the Smart India Hackathon (SIH), building a solution prototype under time constraints.',
      related: ['project-bitrise', 'stats', 'contact'],
    },
  ],
};
