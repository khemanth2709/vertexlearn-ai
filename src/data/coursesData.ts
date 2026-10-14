import { Course } from '../types/lms';

export const OFFICIAL_COURSES: Course[] = [
  {
    id: 'c_frontend',
    title: 'Frontend Development',
    code: 'FE-101',
    category: 'Frontend',
    level: 'Beginner',
    description: 'Master modern client-side engineering: HTML5, CSS3, modern JavaScript, component lifecycles, and high-performance DOM manipulation with Core Web Vitals optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_001',
    instructorName: 'Dr. Elena Vance',
    instructorTitle: 'Distinguished Professor & Frontend Lead',
    estimatedHours: 24,
    rating: 4.9,
    tags: ['Frontend', 'React', 'HTML5', 'CSS3', 'Web APIs', 'UI/UX'],
    enrolledCount: 612,
    referenceUrl: 'https://www.youtube.com/watch?v=T55Kb8rrH1g&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH',
    modules: [
      {
        id: 'mod_fe_1',
        title: 'Lesson 1: Modern Frontend Architecture & DOM Pipeline',
        type: 'video',
        duration: '22:15',
        url: 'https://www.youtube.com/watch?v=T55Kb8rrH1g&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH',
        resourceUrl: 'https://www.youtube.com/watch?v=T55Kb8rrH1g&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH',
        resourceType: 'video',
        description: 'Comprehensive walkthrough of client rendering pipelines, DOM event delegation, and responsive layouts.'
      },
      {
        id: 'mod_fe_2',
        title: 'Lesson 2: Component Architecture & State Modeling with React',
        type: 'pdf',
        duration: '20 min read',
        resourceUrl: 'https://www.youtube.com/watch?v=T55Kb8rrH1g&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH',
        resourceType: 'video',
        content: `### Frontend Architecture & Virtual DOM

Frontend engineering bridges user intent with distributed web services. In this module, we dissect modern client architectures.

#### 1. The Rendering Pipeline
1. **DOM Tree Construction**: HTML parsing into memory nodes.
2. **CSSOM Generation**: CSS rule matching and style resolution.
3. **Render Tree & Layout**: Geometric bounding box calculations.
4. **Painting & Compositing**: GPU rasterization across composite layers.

#### 2. Virtual DOM & Reconciliation
React uses an in-memory Virtual DOM to calculate diffs using a heuristic $O(n)$ algorithm, minimizing expensive real-DOM reflows.

#### 3. Core Web Vitals
- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **INP (Interaction to Next Paint)**: Target < 200ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1`
      },
      {
        id: 'mod_fe_3',
        title: 'Lesson 3: Automated Frontend Mastery Quiz',
        type: 'quiz',
        duration: '12 min quiz',
        passingScore: 75,
        questions: [
          {
            id: 'fe_q1',
            question: 'Which browser metric measures responsiveness to user interactions, replacing FID in Core Web Vitals?',
            type: 'MCQ',
            options: ['FCP (First Contentful Paint)', 'INP (Interaction to Next Paint)', 'CLS (Cumulative Layout Shift)', 'TTFB (Time to First Byte)'],
            correctAnswer: 1,
            explanation: 'INP (Interaction to Next Paint) assesses overall responsiveness by tracking the latency of all user interactions throughout the page lifecycle.',
            points: 25
          },
          {
            id: 'fe_q2',
            question: 'What is the default direction of event propagation in the standard DOM event model?',
            type: 'MCQ',
            options: ['Capturing phase first, followed by Target, then Bubbling phase', 'Bubbling phase only', 'Direct dispatch without propagation', 'Tunneling phase'],
            correctAnswer: 0,
            explanation: 'DOM events first travel downwards from window during the Capturing phase, hit the Target element, and bubble upwards back to the window.',
            points: 25
          }
        ]
      }
    ]
  },
  {
    id: 'c_backend',
    title: 'Backend Development',
    code: 'BE-201',
    category: 'Backend',
    level: 'Intermediate',
    description: 'Construct resilient server architectures, RESTful/gRPC microservices, relational database transactions, and scalable API gateways.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_002',
    instructorName: 'Prof. Alan Turing',
    instructorTitle: 'Chair of Distributed Systems & Algorithms',
    estimatedHours: 28,
    rating: 4.8,
    tags: ['Backend', 'Node.js', 'Express', 'Databases', 'APIs', 'Security'],
    enrolledCount: 540,
    referenceUrl: 'https://www.youtube.com/watch?v=kkOuRJ69BRY&list=PLbtI3_MArDOk_A-GnYHPOiHSxlK2Vd3Zn',
    modules: [
      {
        id: 'mod_be_1',
        title: 'Lesson 1: Server Event Loops & Non-Blocking Asynchronous I/O',
        type: 'video',
        duration: '24:10',
        url: 'https://www.youtube.com/watch?v=kkOuRJ69BRY&list=PLbtI3_MArDOk_A-GnYHPOiHSxlK2Vd3Zn',
        resourceUrl: 'https://www.youtube.com/watch?v=kkOuRJ69BRY&list=PLbtI3_MArDOk_A-GnYHPOiHSxlK2Vd3Zn',
        resourceType: 'video',
        description: 'Deep dive into event loop mechanics, thread pool allocation, and handling concurrent network connections.'
      },
      {
        id: 'mod_be_2',
        title: 'Lesson 2: Database Connection Pooling & ACID Transactions',
        type: 'pdf',
        duration: '22 min read',
        resourceUrl: 'https://www.youtube.com/watch?v=kkOuRJ69BRY&list=PLbtI3_MArDOk_A-GnYHPOiHSxlK2Vd3Zn',
        resourceType: 'video',
        content: `### Backend Architecture: Reliability & Scalability

Analyze server concurrency, database connection pools, and caching layers.

#### 1. Connection Pool Sizing
Sizing database connections avoids CPU thrashing and exhausted sockets.

#### 2. ACID Transactions
- **Atomicity**: All or nothing operations.
- **Consistency**: Invariants preserved across states.
- **Isolation**: Concurrent transactions execute deterministically.
- **Durability**: Committed data survives system failures.`
      }
    ]
  },
  {
    id: 'c_mern',
    title: 'MERN Stack Development',
    code: 'MERN-301',
    category: 'MERN Stack',
    level: 'Intermediate',
    description: 'Build enterprise single-page applications utilizing MongoDB, Express.js, React.js, and Node.js with state management, aggregation pipelines, and secure JWT authentication.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_003',
    instructorName: 'Dr. Ada Lovelace',
    instructorTitle: 'Lead Full-Stack Architect',
    estimatedHours: 36,
    rating: 4.9,
    tags: ['MERN', 'MongoDB', 'Express', 'React', 'Node.js', 'Full Stack'],
    enrolledCount: 520,
    referenceUrl: 'https://www.youtube.com/watch?v=rklidcZ-aLU&list=PL78RhpUUKSwfYr_bKHq7SWfTCBGad_xxP',
    modules: [
      {
        id: 'mod_mern_1',
        title: 'Lesson 1: MERN Monorepo Architecture & API Contract',
        type: 'video',
        duration: '31:45',
        url: 'https://www.youtube.com/watch?v=rklidcZ-aLU&list=PL78RhpUUKSwfYr_bKHq7SWfTCBGad_xxP',
        resourceUrl: 'https://www.youtube.com/watch?v=rklidcZ-aLU&list=PL78RhpUUKSwfYr_bKHq7SWfTCBGad_xxP',
        resourceType: 'video',
        description: 'End-to-end full-stack integration with MongoDB schemas, Express routers, and React state.'
      },
      {
        id: 'mod_mern_2',
        title: 'Lesson 2: State Management & Token Verification',
        type: 'pdf',
        duration: '25 min read',
        resourceUrl: 'https://www.youtube.com/watch?v=rklidcZ-aLU&list=PL78RhpUUKSwfYr_bKHq7SWfTCBGad_xxP',
        resourceType: 'video',
        content: `### MERN Stack Full Architecture
Examine how React client state synchronizes with Express API gateways and MongoDB collections using secure HTTP-only cookies and JWT authorization headers.`
      }
    ]
  },
  {
    id: 'c_mean',
    title: 'MEAN Stack Development',
    code: 'MEAN-302',
    category: 'MEAN Stack',
    level: 'Advanced',
    description: 'Enterprise single-page application engineering utilizing MongoDB, Express.js, Angular, and Node.js with strict TypeScript typings and RxJS reactive streams.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_004',
    instructorName: 'Prof. Linus Torvalds',
    instructorTitle: 'Systems Architect & Open Source Pioneer',
    estimatedHours: 38,
    rating: 4.8,
    tags: ['MEAN', 'MongoDB', 'Express', 'Angular', 'Node.js', 'RxJS', 'TypeScript'],
    enrolledCount: 430,
    referenceUrl: 'https://www.youtube.com/watch?v=1biOTNHgJqs&list=PL1fhe5A01vQEGcHsPyQk3otWTrq6b9XXB',
    modules: [
      {
        id: 'mod_mean_1',
        title: 'Lesson 1: Angular Component Hierarchies & RxJS Streams',
        type: 'video',
        duration: '28:30',
        url: 'https://www.youtube.com/watch?v=1biOTNHgJqs&list=PL1fhe5A01vQEGcHsPyQk3otWTrq6b9XXB',
        resourceUrl: 'https://www.youtube.com/watch?v=1biOTNHgJqs&list=PL1fhe5A01vQEGcHsPyQk3otWTrq6b9XXB',
        resourceType: 'video',
        description: 'Explore reactive programming with RxJS observables, Angular dependency injection, and Express REST services.'
      }
    ]
  },
  {
    id: 'c_dsa',
    title: 'Data Structures and Algorithms (DSA)',
    code: 'DSA-201',
    category: 'Data Structures and Algorithms (DSA)',
    level: 'Advanced',
    description: 'Master asymptotic complexity, dynamic programming, graph traversals (Dijkstra, Tarjan), heap invariants, and technical coding interview problems.',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_rohit',
    instructorName: 'Rohit Verma',
    instructorTitle: 'Working Professional & Lead DSA Instructor',
    estimatedHours: 42,
    rating: 5.0,
    tags: ['DSA', 'Algorithms', 'Trees', 'Graphs', 'Dynamic Programming', 'Complexity'],
    enrolledCount: 780,
    referenceUrl: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt',
    modules: [
      {
        id: 'mod_dsa_1',
        title: 'Lesson 1: Asymptotic Analysis & Algorithmic Complexities',
        type: 'video',
        duration: '35:20',
        url: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt',
        resourceUrl: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt',
        resourceType: 'video',
        description: 'Rigorous derivation of Big-O, Big-Omega, and Big-Theta notations across iterative and recursive algorithms.'
      },
      {
        id: 'mod_dsa_2',
        title: 'Lesson 2: Graph Traversal & Shortest Path Algorithms',
        type: 'pdf',
        duration: '28 min read',
        resourceUrl: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt',
        resourceType: 'video',
        content: `### Graph Theory & Algorithmic Traversal

Graphs model networked relationships, routing topologies, and dependency DAGs.

#### 1. Breadth-First Search (BFS) vs Depth-First Search (DFS)
- BFS uses a FIFO queue: Finds shortest unweighted path in $O(V + E)$ time.
- DFS uses a LIFO call stack: Explores depth, detects cycles, and generates topological ordering.

#### 2. Dijkstra's Shortest Path
Greedy algorithm utilizing a Min-Heap priority queue to guarantee minimum distance in $O((V + E) \\log V)$.`
      }
    ]
  },
  {
    id: 'c_java',
    title: 'Java Programming',
    code: 'JAVA-202',
    category: 'Java',
    level: 'Intermediate',
    description: 'Enterprise Java engineering, JVM memory model (Heap/Stack/Metaspace), garbage collection algorithms, multithreading concurrency, and Spring foundations.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_rohit',
    instructorName: 'Rohit Verma',
    instructorTitle: 'Working Professional & Systems Engineer',
    estimatedHours: 32,
    rating: 4.9,
    tags: ['Java', 'JVM', 'Concurrency', 'OOP', 'Spring Boot', 'Enterprise'],
    enrolledCount: 650,
    referenceUrl: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt',
    modules: [
      {
        id: 'mod_java_1',
        title: 'Lesson 1: JVM Architecture & Memory Model',
        type: 'video',
        duration: '32:10',
        url: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt',
        resourceUrl: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt',
        resourceType: 'video',
        description: 'Understand bytecode execution, class loaders, heap generations, and garbage collection mechanisms.'
      }
    ]
  },
  {
    id: 'c_python',
    title: 'Python Programming',
    code: 'PY-102',
    category: 'Python',
    level: 'Beginner',
    description: 'Master core language syntax, object-oriented design, functional paradigms, data processing, list comprehensions, decorators, and scripting for modern software systems.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_005',
    instructorName: 'Dr. Grace Hopper',
    instructorTitle: 'Computer Pioneer & Language Architect',
    estimatedHours: 26,
    rating: 4.9,
    tags: ['Python', 'OOP', 'Data Structures', 'Scripting', 'Automation'],
    enrolledCount: 890,
    referenceUrl: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
    modules: [
      {
        id: 'mod_py_1',
        title: 'Lesson 1: Python Core Foundations & Idiomatic Syntax',
        type: 'video',
        duration: '26:40',
        url: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
        resourceUrl: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
        resourceType: 'video',
        description: 'Explore collections, comprehension syntaxes, scoping rules, and memory management in CPython.'
      }
    ]
  },
  {
    id: 'c_data_analytics',
    title: 'Data Analytics',
    code: 'DA-205',
    category: 'Data Analytics',
    level: 'Intermediate',
    description: 'Exploratory data analysis, statistical hypothesis testing, SQL query aggregation, data storytelling, and dashboard visualization tools.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_006',
    instructorName: 'Dr. Katherine Johnson',
    instructorTitle: 'Senior Data Scientist & Analytics Lead',
    estimatedHours: 28,
    rating: 4.8,
    tags: ['Data Analytics', 'Pandas', 'SQL', 'Visualization', 'Statistics', 'BI'],
    enrolledCount: 570,
    referenceUrl: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
    modules: [
      {
        id: 'mod_da_1',
        title: 'Lesson 1: Statistical Distributions & Exploratory Analysis',
        type: 'video',
        duration: '30:15',
        url: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
        resourceUrl: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
        resourceType: 'video',
        description: 'Learn foundational statistics, variance analysis, hypothesis testing, and clean data cleaning pipelines.'
      }
    ]
  },
  {
    id: 'c_data_engineering',
    title: 'Data Engineering',
    code: 'DE-305',
    category: 'Data Engineering',
    level: 'Advanced',
    description: 'Design distributed ETL/ELT pipelines, streaming architectures with Kafka, data warehousing, partitioned lakes, and automated orchestration.',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_007',
    instructorName: 'Prof. Donald Knuth',
    instructorTitle: 'Distinguished Fellow of Computer Systems',
    estimatedHours: 35,
    rating: 4.9,
    tags: ['Data Engineering', 'ETL', 'Pipelines', 'Distributed Systems', 'Kafka', 'SQL'],
    enrolledCount: 460,
    referenceUrl: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
    modules: [
      {
        id: 'mod_de_1',
        title: 'Lesson 1: Distributed Pipeline Architecture & Streaming',
        type: 'video',
        duration: '34:00',
        url: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
        resourceUrl: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti',
        resourceType: 'video',
        description: 'Architecting batch and real-time streaming architectures with fault-tolerant checkpointing.'
      }
    ]
  },
  {
    id: 'c_machine_learning',
    title: 'Machine Learning',
    code: 'ML-401',
    category: 'Machine Learning',
    level: 'Advanced',
    description: 'Implement supervised and unsupervised machine learning algorithms, gradient descent optimization, feature engineering, and model evaluation metrics.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_001',
    instructorName: 'Dr. Elena Vance',
    instructorTitle: 'Distinguished Professor & AI Lead',
    estimatedHours: 36,
    rating: 4.9,
    tags: ['Machine Learning', 'Gradient Descent', 'Scikit-Learn', 'Feature Engineering', 'Supervised Learning'],
    enrolledCount: 710,
    referenceUrl: 'https://www.youtube.com/watch?v=1L420xXpDTg&list=PLaldQ9PzZd9qT0KsKJ7yCq70iFFP3MFJ5',
    modules: [
      {
        id: 'mod_ml_1',
        title: 'Lesson 1: Mathematical Foundations & Gradient Descent',
        type: 'video',
        duration: '38:10',
        url: 'https://www.youtube.com/watch?v=1L420xXpDTg&list=PLaldQ9PzZd9qT0KsKJ7yCq70iFFP3MFJ5',
        resourceUrl: 'https://www.youtube.com/watch?v=1L420xXpDTg&list=PLaldQ9PzZd9qT0KsKJ7yCq70iFFP3MFJ5',
        resourceType: 'video',
        description: 'Mathematical intuition behind cost surfaces, learning rate decay, and stochastic gradient optimization.'
      }
    ]
  },
  {
    id: 'c_ai',
    title: 'Artificial Intelligence',
    code: 'AI-402',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    description: 'Deep neural networks, heuristic search algorithms, agent-based reasoning systems, reinforcement learning, and transformers.',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_001',
    instructorName: 'Dr. Elena Vance',
    instructorTitle: 'Distinguished Professor & AI Lead',
    estimatedHours: 40,
    rating: 5.0,
    tags: ['AI', 'Neural Networks', 'Transformers', 'Search Algorithms', 'Agents', 'Deep Learning'],
    enrolledCount: 840,
    referenceUrl: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
    modules: [
      {
        id: 'mod_ai_1',
        title: 'Lesson 1: AI Foundations & Autonomous Agent Architectures',
        type: 'video',
        duration: '40:15',
        url: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
        resourceUrl: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
        resourceType: 'video',
        description: 'Explore neural attention mechanisms, agentic decision trees, and intelligent reasoning pipelines.'
      }
    ]
  },
  {
    id: 'c_data_science',
    title: 'Data Science',
    code: 'DS-303',
    category: 'Data Science',
    level: 'Intermediate',
    description: 'Integrate statistical inference, exploratory computation, machine learning modeling, and domain insights to solve complex data challenges.',
    thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_006',
    instructorName: 'Dr. Katherine Johnson',
    instructorTitle: 'Senior Data Scientist & Analytics Lead',
    estimatedHours: 34,
    rating: 4.8,
    tags: ['Data Science', 'Statistics', 'Predictive Modeling', 'Python', 'Jupyter', 'Metrics'],
    enrolledCount: 620,
    referenceUrl: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
    modules: [
      {
        id: 'mod_ds_1',
        title: 'Lesson 1: The End-to-End Data Science Lifecycle',
        type: 'video',
        duration: '33:45',
        url: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
        resourceUrl: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
        resourceType: 'video',
        description: 'Hypothesis generation, experimental design, cross-validation, and data-driven business impact.'
      }
    ]
  },
  {
    id: 'c_web_dev',
    title: 'Web Development',
    code: 'WEB-100',
    category: 'Web Development',
    level: 'Beginner',
    description: 'Comprehensive web architecture covering how the Internet works, DNS, TCP/IP, HTTP/3, responsive layouts, web security fundamentals, and modern application lifecycle.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800',
    instructorId: 'usr_inst_003',
    instructorName: 'Dr. Ada Lovelace',
    instructorTitle: 'Lead Full-Stack Architect',
    estimatedHours: 30,
    rating: 4.9,
    tags: ['Web Dev', 'HTTP', 'DNS', 'Responsive Design', 'Security', 'Browsers'],
    enrolledCount: 760,
    referenceUrl: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
    modules: [
      {
        id: 'mod_web_1',
        title: 'Lesson 1: Web Architecture, Protocols & Browser Internals',
        type: 'video',
        duration: '29:50',
        url: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
        resourceUrl: 'https://www.youtube.com/watch?v=9tbaiFIm0HU',
        resourceType: 'video',
        description: 'Understand the journey of an HTTP request, client DNS lookup, TCP/TLS handshake, and browser rendering lifecycle.'
      }
    ]
  }
];

// Helper to look up course by ID or legacy aliases
export function findCourseById(id: string | null | undefined): Course | undefined {
  if (!id) return undefined;
  const match = OFFICIAL_COURSES.find(c => c.id === id);
  if (match) return match;

  // Legacy alias lookups
  const aliasMap: Record<string, string> = {
    c_frontend_dev: 'c_frontend',
    c_backend_dev: 'c_backend',
    c_mern_stack: 'c_mern',
    c_mean_stack: 'c_mean',
    c_dsa_dev: 'c_dsa',
    c_python_dev: 'c_python',
    c_python_prog: 'c_python',
    c_java_dev: 'c_java',
    c_javascript: 'c_frontend',
    c_html: 'c_frontend',
    c_css: 'c_frontend'
  };

  const targetId = aliasMap[id];
  return targetId ? OFFICIAL_COURSES.find(c => c.id === targetId) : undefined;
}
