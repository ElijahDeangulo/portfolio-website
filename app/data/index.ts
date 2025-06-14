import { Project, ProjectId } from '../types'

export const projectDetails: Record<ProjectId, Project> = {
  'ar-automation': {
    title: 'AR Automation Platform',
    logo: '/images/logos/palantir.jpg',
    description: 'End-to-end accounts receivable automation using multi-agent LLM orchestration, RAG techniques, and real-time payment processing.',
    fullDescription: 'A comprehensive AI-powered platform that revolutionizes accounts receivable processes through intelligent automation. The system leverages multi-agent LLM orchestration to handle complex business logic, RAG techniques for contextual decision-making, and real-time payment processing.',
    technologies: ['PySpark', 'LLM', 'RAG', 'Foundry', 'TypeScript', 'Python', 'Apache Kafka'],
    features: [
      'Multi-agent LLM orchestration for complex workflows',
      'RAG-based contextual decision making',
      'Real-time payment processing and reconciliation',
      'Enterprise-scale data processing with PySpark',
      'Automated invoice matching and dispute resolution'
    ],
    impact: 'Reduced manual processing time by 85% and improved cash flow by $2.3M annually',
    github: 'https://github.com/ElijahDeangulo',
    website: undefined
  },
  'pricing-intelligence': {
    title: 'Pricing Intelligence Platform',
    logo: '/images/logos/palantir.jpg',
    description: 'Bayesian optimization models with demand curve simulation and real-time anomaly detection. Drove $10M+ in projected revenue impact.',
    fullDescription: 'An advanced ML-driven pricing platform that uses Bayesian optimization to determine optimal pricing strategies. The system simulates demand curves, detects market anomalies in real-time, and provides actionable insights.',
    technologies: ['Bayesian Optimization', 'Python', 'Real-time Analytics', 'ML Models', 'TensorFlow', 'Redis'],
    features: [
      'Bayesian optimization for price discovery',
      'Real-time demand curve simulation',
      'Market anomaly detection and alerts',
      'A/B testing framework for pricing strategies',
      'Revenue impact forecasting'
    ],
    impact: 'Generated $10M+ in projected revenue impact with 23% improvement in pricing accuracy',
    github: 'https://github.com/ElijahDeangulo',
    website: undefined
  },
  'revenue-intelligence': {
    title: 'Revenue Intelligence Suite',
    logo: '/images/logos/inselligence.jpg',
    description: 'ML-driven sales forecasting and CRM optimization platform improving pipeline hygiene and customer engagement.',
    fullDescription: 'A comprehensive revenue intelligence platform that combines ML-driven sales forecasting with CRM optimization. The system analyzes customer behavior patterns and predicts sales outcomes.',
    technologies: ['ML Forecasting', 'CRM', 'Python', 'API Integration', 'Salesforce', 'React'],
    features: [
      'Predictive sales forecasting with 92% accuracy',
      'Customer behavior analysis and segmentation',
      'Pipeline health scoring and recommendations',
      'Automated lead qualification and routing',
      'Real-time sales performance dashboards'
    ],
    impact: 'Improved forecast accuracy by 34% and increased sales team productivity by 28%',
    github: 'https://github.com/ElijahDeangulo'
  },
  'special-miracle': {
    title: 'Non-Profit Organization',
    logo: '/images/logos/asm.jpg',
    description: 'Founded a non-profit organization focused on community impact and social good initiatives. Supporting families with children with Down Syndrome.',
    fullDescription: 'A Special Miracle is a non-profit organization dedicated to supporting families with children with Down Syndrome. The platform provides resources, community support, and educational content.',
    technologies: ['Leadership', 'Non-Profit', 'Community Impact', 'React', 'Node.js'],
    features: [
      'Community support forums and resources',
      'Educational content and guides',
      'Event planning and coordination',
      'Volunteer management system',
      'Donation processing and tracking'
    ],
    impact: 'Supported 150+ families and organized 25+ community events',
    website: 'https://aspecialmiracle.org'
  }
}

// Simplified skills data structure
export const skillsData = {
  'Programming Languages': [
    { name: 'Python', categories: ['backend', 'data-science', 'ml'] },
    { name: 'TypeScript', categories: ['frontend', 'backend'] },
    { name: 'JavaScript', categories: ['frontend', 'backend'] },
    { name: 'Java', categories: ['backend'] },
    { name: 'R', categories: ['data-science', 'ml'] },
    { name: 'SQL', categories: ['backend', 'data-science'] }
  ],
  'AI/ML & Data Science': [
    { name: 'Machine Learning', categories: ['ml', 'data-science'] },
    { name: 'TensorFlow', categories: ['ml'] },
    { name: 'Keras', categories: ['ml'] },
    { name: 'scikit-learn', categories: ['ml', 'data-science'] },
    { name: 'Pandas', categories: ['data-science', 'backend'] },
    { name: 'NumPy', categories: ['data-science', 'ml'] },
    { name: 'PySpark', categories: ['data-science', 'backend'] },
    { name: 'NLP', categories: ['ml', 'data-science'] },
    { name: 'RAG', categories: ['ml'] },
    { name: 'LLM', categories: ['ml'] }
  ],
  'Frontend Development': [
    { name: 'React.js', categories: ['frontend'] },
    { name: 'Next.js', categories: ['frontend'] },
    { name: 'HTML/CSS', categories: ['frontend'] },
    { name: 'Tailwind CSS', categories: ['frontend'] }
  ],
  'Backend & Cloud': [
    { name: 'Node.js', categories: ['backend'] },
    { name: 'Flask', categories: ['backend'] },
    { name: 'AWS', categories: ['backend', 'cloud'] },
    { name: 'Apache Spark', categories: ['backend', 'data-science'] },
    { name: 'Docker', categories: ['backend', 'devops'] },
    { name: 'Redis', categories: ['backend'] }
  ],
  'Tools & Platforms': [
    { name: 'Git/GitHub', categories: ['tools'] },
    { name: 'Tableau', categories: ['data-science', 'visualization'] },
    { name: 'Power BI', categories: ['data-science', 'visualization'] },
    { name: 'Foundry', categories: ['data-science', 'backend'] },
    { name: 'Salesforce', categories: ['tools'] },
    { name: 'API Integration', categories: ['backend', 'tools'] }
  ],
  'Specialized Skills': [
    { name: 'Prompt Engineering', categories: ['ml'] },
    { name: 'Bayesian Optimization', categories: ['ml', 'data-science'] },
    { name: 'Financial Modeling', categories: ['finance'] },
    { name: 'SEO/A/B Testing', categories: ['marketing'] },
    { name: 'CRM Analytics', categories: ['data-science'] }
  ],
  'AI Agents & Protocols': [
    { name: 'Multi-Agent Systems', categories: ['ml', 'ai-agents'] },
    { name: 'LLM Orchestration', categories: ['ml', 'ai-agents'] },
    { name: 'MCP (Model Context Protocol)', categories: ['ml', 'ai-agents', 'backend'] },
    { name: 'Agent Workflow Design', categories: ['ml', 'ai-agents'] },
    { name: 'Tool Calling & Function Execution', categories: ['ml', 'ai-agents', 'backend'] },
    { name: 'Claude MCP Integration', categories: ['ml', 'ai-agents'] }
  ]
}

export const skillCategories = [
  { id: 'all', name: 'All Skills' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'ml', name: 'AI/ML' },
  { id: 'data-science', name: 'Data Science' },
  { id: 'tools', name: 'Tools' },
  { id: 'cloud', name: 'Cloud' },
  { id: 'devops', name: 'DevOps' }
] 