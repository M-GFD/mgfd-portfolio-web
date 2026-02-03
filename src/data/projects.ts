import { Project } from '@/types/portfolio';

export const projects: Project[] = [
  {
    id: 1,
    title: '1190 Sports',
    subtitle: 'Sports Betting Platform',
    description: 'A modern sports betting platform with real-time odds and live betting features.',
    fullDescription: `1190 Sports is a comprehensive sports betting platform that brings together the thrill of live sports with cutting-edge technology.

The platform features:
- Real-time odds updates for multiple sports including football, basketball, tennis, and more
- Live betting capabilities with instant market updates
- User-friendly interface optimized for both desktop and mobile devices
- Secure payment processing with multiple payment options
- Advanced analytics and betting statistics
- Personalized betting history and favorites

Built with performance and scalability in mind, the platform handles thousands of concurrent users while maintaining fast response times and reliability.

The design follows a clean, modern aesthetic with high-contrast elements for easy readability during fast-paced betting scenarios.`,
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    tags: ['Web App', 'Betting', 'Real-time'],
    reversed: false,
  },
  {
    id: 2,
    title: 'Novogas',
    subtitle: 'Energy Management System',
    description: 'An energy management system for gas stations with real-time monitoring and analytics.',
    fullDescription: `Novogas is an enterprise-grade energy management system designed for gas station chains and fuel distributors.

Key features include:
- Real-time monitoring of fuel levels across multiple stations
- Automated inventory management with low-stock alerts
- Sales analytics and reporting with customizable dashboards
- Integration with POS systems for seamless transaction processing
- Multi-location management with centralized control
- Predictive maintenance scheduling based on usage patterns
- Compliance tracking and regulatory reporting

The system provides operators with comprehensive visibility into their operations, enabling data-driven decisions that optimize efficiency and profitability.

The interface is designed for ease of use by station staff while providing management with detailed insights into business performance.`,
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    tags: ['Dashboard', 'Analytics', 'Energy'],
    reversed: true,
  },
  {
    id: 3,
    title: 'POLI Studio',
    subtitle: 'Creative Agency Website',
    description: 'A modern creative agency website with stunning visuals and interactive elements.',
    fullDescription: `POLI Studio represents the perfect blend of creativity and technology in website design.

This project showcases:
- Stunning hero section with smooth parallax effects
- Interactive portfolio gallery with filtering capabilities
- Smooth animations and micro-interactions throughout
- Mobile-first responsive design optimized for all devices
- Fast loading times with optimized assets
- Accessibility compliance with WCAG standards
- SEO-friendly structure for maximum visibility

The design philosophy emphasizes bold typography, generous whitespace, and strategic use of color to create an engaging user experience that reflects the agency's creative spirit.

Every interaction has been carefully crafted to delight users while maintaining intuitive navigation and clear calls-to-action.`,
    technologies: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'TypeScript'],
    tags: ['Portfolio', 'Agency', 'Animation'],
    reversed: false,
  },
  {
    id: 4,
    title: 'Freelance Works',
    subtitle: 'Collection of Personal Projects',
    description: 'A curated collection of freelance projects showcasing diverse skills and industries.',
    fullDescription: `Freelance Works is a personal portfolio showcasing the diversity and depth of project experience across multiple industries.

Featured projects include:
- E-commerce platforms with custom integrations
- SaaS applications with complex business logic
- Mobile applications with cross-platform compatibility
- Landing pages optimized for conversion
- Dashboard interfaces for data visualization
- API integrations and third-party service connections

Each project demonstrates specific strengths in problem-solving, user experience design, and technical implementation. The collection highlights adaptability across different business domains and technical requirements.

The portfolio serves as both a showcase of completed work and a testament to the ability to deliver high-quality solutions across varied challenges and industries.`,
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    tags: ['Portfolio', 'Freelance', 'Diverse'],
    reversed: true,
  },
];