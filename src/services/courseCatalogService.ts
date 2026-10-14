/**
 * VertexLearn AI - Course Catalog Service & Data Configuration
 * 
 * Defines the definitive list of all 13 official courses:
 * 1. Frontend
 * 2. Backend
 * 3. MERN Stack
 * 4. MEAN Stack
 * 5. Data Structures and Algorithms (DSA)
 * 6. Java
 * 7. Python
 * 8. Data Analytics
 * 9. Data Engineering
 * 10. Machine Learning
 * 11. Artificial Intelligence
 * 12. Data Science
 * 13. Web Development
 */

export interface CourseCatalogEntry {
  id: string;
  slug: string;
  shortTitle: string;
  title: string;
  code: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string; // Exact configured YouTube video / playlist resource URL
  description: string;
  shortDescription: string;
  estimatedHours: number;
  modulesCount: number;
  tags: string[];
  instructorName: string;
  thumbnail: string;
  keyTopics: string[];
  learningOutcomes: string[];
  rating: number;
}

export const PROVIDED_COURSES_CONFIG: CourseCatalogEntry[] = [
  {
    id: 'c_frontend',
    slug: 'frontend',
    shortTitle: 'Frontend',
    title: 'Frontend Development',
    code: 'FE-101',
    category: 'Frontend',
    level: 'Beginner',
    url: 'https://www.youtube.com/watch?v=T55Kb8rrH1g&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH',
    description: 'Master modern client-side engineering: HTML5, CSS3, JavaScript ES6+, React component lifecycles, and high-performance DOM manipulation with Core Web Vitals optimization.',
    shortDescription: 'Modern client-side engineering, React lifecycles, and high-performance DOM manipulation.',
    estimatedHours: 24,
    modulesCount: 3,
    rating: 4.9,
    tags: ['Frontend', 'React', 'HTML5', 'CSS3', 'Web APIs', 'UI/UX'],
    instructorName: 'Dr. Elena Vance',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['DOM Tree Construction & CSSOM', 'Virtual DOM & Fiber Reconciliation', 'Core Web Vitals (LCP, INP, CLS)', 'State Hydration & Event Bubbling'],
    learningOutcomes: [
      'Architect modular, accessible UI component hierarchies with React',
      'Optimize critical rendering path to achieve sub-2.5s LCP',
      'Build responsive layouts and interactive web applications'
    ]
  },
  {
    id: 'c_backend',
    slug: 'backend',
    shortTitle: 'Backend',
    title: 'Backend Development',
    code: 'BE-201',
    category: 'Backend',
    level: 'Intermediate',
    url: 'https://www.youtube.com/watch?v=kkOuRJ69BRY&list=PLbtI3_MArDOk_A-GnYHPOiHSxlK2Vd3Zn',
    description: 'Construct resilient server architectures, RESTful/gRPC microservices, relational database transactions, and scalable API gateways with enterprise security.',
    shortDescription: 'Resilient server architectures, database pooling, REST/gRPC microservices, and security.',
    estimatedHours: 28,
    modulesCount: 2,
    rating: 4.8,
    tags: ['Backend', 'Node.js', 'Express', 'Databases', 'APIs', 'Security'],
    instructorName: 'Prof. Alan Turing',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['libuv Event Loop & Asynchronous I/O', 'Database Connection Pooling & ACID', 'JWT Authentication & RBAC Middleware', 'Rate Limiting & Horizontal Scaling'],
    learningOutcomes: [
      'Design RESTful API gateways handling concurrent requests',
      'Execute ACID database transactions with connection pool tuning',
      'Implement zero-trust authorization middleware and rate limits'
    ]
  },
  {
    id: 'c_mern',
    slug: 'mern-stack',
    shortTitle: 'MERN Stack',
    title: 'MERN Stack Development',
    code: 'MERN-301',
    category: 'MERN Stack',
    level: 'Intermediate',
    url: 'https://www.youtube.com/watch?v=rklidcZ-aLU&list=PL78RhpUUKSwfYr_bKHq7SWfTCBGad_xxP',
    description: 'Build enterprise single-page applications utilizing MongoDB, Express.js, React.js, and Node.js with state management, aggregation pipelines, and secure JWT authentication.',
    shortDescription: 'End-to-end full-stack development leveraging MongoDB, Express, React, and Node.js.',
    estimatedHours: 36,
    modulesCount: 2,
    rating: 4.9,
    tags: ['MERN', 'MongoDB', 'Express', 'React', 'Node.js', 'Full Stack'],
    instructorName: 'Dr. Ada Lovelace',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['MERN Monorepo & Client-Server Hydration', 'MongoDB Aggregation Pipelines & Schemas', 'JWT Bearer State Management', 'Full-Stack Deployment & CI/CD'],
    learningOutcomes: [
      'Build production full-stack web applications from database to UI',
      'Create multi-stage aggregation pipelines in MongoDB',
      'Deploy scalable React frontends communicating with Express backends'
    ]
  },
  {
    id: 'c_mean',
    slug: 'mean-stack',
    shortTitle: 'MEAN Stack',
    title: 'MEAN Stack Development',
    code: 'MEAN-302',
    category: 'MEAN Stack',
    level: 'Advanced',
    url: 'https://www.youtube.com/watch?v=1biOTNHgJqs&list=PL1fhe5A01vQEGcHsPyQk3otWTrq6b9XXB',
    description: 'Enterprise single-page application engineering utilizing MongoDB, Express.js, Angular, and Node.js with strict TypeScript typings and RxJS reactive streams.',
    shortDescription: 'Enterprise SPA engineering using MongoDB, Express, Angular, and Node.js with RxJS.',
    estimatedHours: 38,
    modulesCount: 2,
    rating: 4.8,
    tags: ['MEAN', 'MongoDB', 'Express', 'Angular', 'Node.js', 'RxJS', 'TypeScript'],
    instructorName: 'Prof. Linus Torvalds',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['Angular Dependency Injection & Decorators', 'RxJS Observables & Reactive State Streams', 'Angular Router Guards & Interceptors', 'Express REST Service Integration'],
    learningOutcomes: [
      'Architect robust enterprise dashboards with Angular and TypeScript',
      'Manage complex asynchronous state streams using RxJS pipeable operators',
      'Integrate MongoDB Atlas with resilient Node.js backends'
    ]
  },
  {
    id: 'c_dsa',
    slug: 'dsa',
    shortTitle: 'DSA',
    title: 'Data Structures and Algorithms (DSA)',
    code: 'DSA-201',
    category: 'Data Structures and Algorithms (DSA)',
    level: 'Advanced',
    url: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt',
    description: 'Master asymptotic complexity, dynamic programming, graph traversals (Dijkstra, Tarjan), heap invariants, and technical coding interview problems.',
    shortDescription: 'Asymptotic complexity, dynamic programming, graphs, trees, and technical problem solving.',
    estimatedHours: 42,
    modulesCount: 2,
    rating: 5.0,
    tags: ['DSA', 'Algorithms', 'Trees', 'Graphs', 'Dynamic Programming', 'Complexity'],
    instructorName: 'Rohit Verma',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['Asymptotic Complexity & Big-O Notation', 'Dynamic Programming & Memoization', 'Graph Traversals: BFS, DFS & Dijkstra', 'Self-Balancing Trees & Min/Max Heaps'],
    learningOutcomes: [
      'Solve competitive programming and technical interview problems',
      'Derive tight upper and lower bounds for complex algorithms',
      'Architect memory-optimal data pipelines using advanced tree and graph models'
    ]
  },
  {
    id: 'c_java',
    slug: 'java',
    shortTitle: 'Java',
    title: 'Java Programming',
    code: 'JAVA-202',
    category: 'Java',
    level: 'Intermediate',
    url: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt',
    description: 'Enterprise Java engineering, JVM memory model (Heap/Stack/Metaspace), garbage collection algorithms, multithreading concurrency, and Spring Boot foundations.',
    shortDescription: 'JVM architecture, memory management, multithreading, and enterprise OOP.',
    estimatedHours: 32,
    modulesCount: 2,
    rating: 4.9,
    tags: ['Java', 'JVM', 'Concurrency', 'OOP', 'Spring Boot', 'Enterprise'],
    instructorName: 'Rohit Verma',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['JVM Architecture: Bytecode, ClassLoaders & JIT', 'Heap Memory Management & Garbage Collection', 'Multithreading Concurrency & Thread Pools', 'Generics, Collections Framework & Streams API'],
    learningOutcomes: [
      'Optimize JVM performance and memory footprints for server apps',
      'Write safe multi-threaded concurrent programs using java.util.concurrent',
      'Design clean enterprise software applying SOLID principles in Java'
    ]
  },
  {
    id: 'c_python',
    slug: 'python',
    shortTitle: 'Python',
    title: 'Python Programming',
    code: 'PY-102',
    category: 'Python',
    level: 'Beginner',
    url: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
    description: 'Master core language syntax, object-oriented design, functional paradigms, data processing, list comprehensions, decorators, and scripting for modern software systems.',
    shortDescription: 'Python syntax, OOP, functional paradigms, generators, and data processing.',
    estimatedHours: 26,
    modulesCount: 2,
    rating: 4.9,
    tags: ['Python', 'OOP', 'Data Structures', 'Scripting', 'Automation'],
    instructorName: 'Dr. Grace Hopper',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['Core Python Syntax & Built-in Collections', 'Object-Oriented Design & Magic Methods', 'Generators, Iterators & Decorators', 'File I/O & Exception Handling'],
    learningOutcomes: [
      'Write clean, idiomatic, PEP 8-compliant Python code',
      'Implement memory-efficient generators for large datasets',
      'Develop modular object-oriented software architectures'
    ]
  },
  {
    id: 'c_data_analytics',
    slug: 'data-analytics',
    shortTitle: 'Data Analytics',
    title: 'Data Analytics',
    code: 'DA-205',
    category: 'Data Analytics',
    level: 'Intermediate',
    url: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
    description: 'Exploratory data analysis, statistical hypothesis testing, SQL query aggregation, data storytelling, and dashboard visualization tools.',
    shortDescription: 'Exploratory data analysis, statistical testing, SQL aggregations, and business metrics.',
    estimatedHours: 28,
    modulesCount: 2,
    rating: 4.8,
    tags: ['Data Analytics', 'Pandas', 'SQL', 'Visualization', 'Statistics', 'BI'],
    instructorName: 'Dr. Katherine Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['Statistical Distributions & Confidence Intervals', 'SQL Window Functions & Aggregations', 'Pandas DataFrame Wrangling', 'Data Storytelling & Executive Visuals'],
    learningOutcomes: [
      'Clean messy datasets and extract meaningful business signals',
      'Formulate and evaluate rigorous hypothesis tests',
      'Build informative analytical dashboards and executive summaries'
    ]
  },
  {
    id: 'c_data_engineering',
    slug: 'data-engineering',
    shortTitle: 'Data Engineering',
    title: 'Data Engineering',
    code: 'DE-305',
    category: 'Data Engineering',
    level: 'Advanced',
    url: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
    description: 'Design distributed ETL/ELT pipelines, streaming architectures with Kafka, data warehousing, partitioned lakes, and automated orchestration.',
    shortDescription: 'Distributed ETL/ELT pipelines, streaming with Kafka, and scalable lake architectures.',
    estimatedHours: 35,
    modulesCount: 2,
    rating: 4.9,
    tags: ['Data Engineering', 'ETL', 'Pipelines', 'Distributed Systems', 'Kafka', 'SQL'],
    instructorName: 'Prof. Donald Knuth',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['Distributed Stream Processing & Kafka Brokers', 'Data Lakehouse Storage & Partitioning', 'ETL Pipeline Orchestration with DAGs', 'Columnar File Formats (Parquet, ORC)'],
    learningOutcomes: [
      'Architect robust streaming and batch processing pipelines',
      'Prevent schema drift and data degradation in distributed systems',
      'Optimize multi-terabyte query performance in data warehouses'
    ]
  },
  {
    id: 'c_machine_learning',
    slug: 'machine-learning',
    shortTitle: 'Machine Learning',
    title: 'Machine Learning',
    code: 'ML-401',
    category: 'Machine Learning',
    level: 'Advanced',
    url: 'https://www.youtube.com/watch?v=1L420xXpDTg&list=PLaldQ9PzZd9qT0KsKJ7yCq70iFFP3MFJ5',
    description: 'Implement supervised and unsupervised machine learning algorithms, gradient descent optimization, feature engineering, and model evaluation metrics.',
    shortDescription: 'Supervised & unsupervised learning, gradient descent, feature engineering, and metrics.',
    estimatedHours: 36,
    modulesCount: 2,
    rating: 4.9,
    tags: ['Machine Learning', 'Gradient Descent', 'Scikit-Learn', 'Feature Engineering', 'Supervised Learning'],
    instructorName: 'Dr. Elena Vance',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['Mathematical Formulations of Loss Functions', 'Gradient Descent & Convergence Guarantees', 'Feature Scaling & Dimensionality Reduction', 'Precision, Recall, ROC-AUC Evaluation'],
    learningOutcomes: [
      'Formulate and train machine learning models from mathematical principles',
      'Apply appropriate cross-validation strategies to prevent data leakage',
      'Deploy models with real-time inference and drift monitoring'
    ]
  },
  {
    id: 'c_ai',
    slug: 'artificial-intelligence',
    shortTitle: 'Artificial Intelligence',
    title: 'Artificial Intelligence',
    code: 'AI-402',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    url: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
    description: 'Deep neural networks, heuristic search algorithms, agent-based reasoning systems, reinforcement learning, and transformers.',
    shortDescription: 'Neural networks, heuristic search, agent reasoning, transformers, and deep learning.',
    estimatedHours: 40,
    modulesCount: 2,
    rating: 5.0,
    tags: ['AI', 'Neural Networks', 'Transformers', 'Search Algorithms', 'Agents', 'Deep Learning'],
    instructorName: 'Dr. Elena Vance',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['Neural Network Backpropagation & Weight Updates', 'Attention Mechanisms & Transformer Architecture', 'Autonomous Agent Goal-Seeking Pipelines', 'Heuristic A* Search & Minimax Trees'],
    learningOutcomes: [
      'Understand foundational deep learning architectures and transformers',
      'Design autonomous multi-step reasoning agents',
      'Optimize AI compute pipelines for production throughput'
    ]
  },
  {
    id: 'c_data_science',
    slug: 'data-science',
    shortTitle: 'Data Science',
    title: 'Data Science',
    code: 'DS-303',
    category: 'Data Science',
    level: 'Intermediate',
    url: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
    description: 'Integrate statistical inference, exploratory computation, machine learning modeling, and domain insights to solve complex data challenges.',
    shortDescription: 'Statistical inference, exploratory computing, machine learning, and business impact.',
    estimatedHours: 34,
    modulesCount: 2,
    rating: 4.8,
    tags: ['Data Science', 'Statistics', 'Predictive Modeling', 'Python', 'Jupyter', 'Metrics'],
    instructorName: 'Dr. Katherine Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['Data Science Lifecycle & Problem Framing', 'Parametric & Non-Parametric Modeling', 'High-Dimensional Feature Spaces', 'A/B Testing & Causal Inference'],
    learningOutcomes: [
      'Lead end-to-end data science projects from raw data to decision making',
      'Design randomized experiments and assess statistical power',
      'Communicate data science findings clearly to executive stakeholders'
    ]
  },
  {
    id: 'c_web_dev',
    slug: 'web-development',
    shortTitle: 'Web Development',
    title: 'Web Development',
    code: 'WEB-100',
    category: 'Web Development',
    level: 'Beginner',
    url: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
    description: 'Comprehensive web architecture covering how the Internet works, DNS, TCP/IP, HTTP/3, responsive layouts, web security fundamentals, and modern application lifecycle.',
    shortDescription: 'Internet protocols, DNS, responsive design, browser security, and modern web architectures.',
    estimatedHours: 30,
    modulesCount: 2,
    rating: 4.9,
    tags: ['Web Dev', 'HTTP', 'DNS', 'Responsive Design', 'Security', 'Browsers'],
    instructorName: 'Dr. Ada Lovelace',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800',
    keyTopics: ['Internet Infrastructure: DNS, TLS & HTTP/3', 'Full-Stack Architecture & Multi-Tier Systems', 'Responsive Web Design & Mobile-First Layouts', 'Web Security: CORS, CSRF & XSS Defenses'],
    learningOutcomes: [
      'Understand the full lifecycle of browser URL dispatch to screen paint',
      'Build responsive multi-device websites with clean semantic markup',
      'Implement modern web security safeguards against common vulnerabilities'
    ]
  }
];

class CourseCatalogService {
  private courses: CourseCatalogEntry[] = PROVIDED_COURSES_CONFIG;

  public getAllCourses(): CourseCatalogEntry[] {
    return this.courses;
  }

  public getCourseById(id: string): CourseCatalogEntry | undefined {
    return this.courses.find(c => c.id === id);
  }

  public getCategories(): string[] {
    const categories = Array.from(new Set(this.courses.map(c => c.category)));
    return ['All', ...categories];
  }

  public filterCourses(params: {
    query?: string;
    category?: string;
    level?: string;
  }): CourseCatalogEntry[] {
    let result = [...this.courses];

    if (params.category && params.category !== 'All') {
      result = result.filter(c => c.category.toLowerCase() === params.category?.toLowerCase());
    }

    if (params.level && params.level !== 'All') {
      result = result.filter(c => c.level === params.level);
    }

    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) ||
        c.shortTitle.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public getStats() {
    return {
      totalCourses: this.courses.length,
      categoriesCount: new Set(this.courses.map(c => c.category)).size,
      totalHours: this.courses.reduce((acc, c) => acc + c.estimatedHours, 0)
    };
  }
}

export const courseCatalogService = new CourseCatalogService();
