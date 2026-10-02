export const site = {
  name: 'Form',
  tagline: 'An architecture studio for thresholds, shadows and public rooms.',
  description: 'A fictional architecture studio site with project case studies and a browser-local proposal brief.',
  repo: 'https://github.com/CelsianJs/what-starter-form',
  expectedUrl: 'https://what-starter-form-fae244da.vura.app',
};

export const projects = [
  { slug: 'north-arcade', title: 'North Arcade Housing', type: 'housing', location: 'fictional river edge', year: '2026', summary: 'A mixed-use threshold with winter gardens, shared laundries and a public arcade cut through the ground floor.', brief: 'Convert a hard riverfront block into porous housing without erasing the industrial grid.', moves: ['Lift the arcade to catch low winter sun', 'Stack shared rooms at every third landing', 'Use brick fins as both shade and address'], accent: '#d94b35' },
  { slug: 'linea-library', title: 'Linea Library Annex', type: 'civic', location: 'fictional hill town', year: '2025', summary: 'A quiet reading annex organized by long light shelves, public tables and a stair that behaves like street furniture.', brief: 'Add study rooms and public workshops to a constrained civic lot without hiding the original library.', moves: ['Keep the old cornice visible from the square', 'Pull maker rooms to the noisy edge', 'Let the stair double as informal seating'], accent: '#111111' },
  { slug: 'sill-workshop', title: 'Sill Workshop', type: 'workplace', location: 'fictional rail spur', year: '2024', summary: 'A compact studio and fabrication hall defined by deep window sills, roof monitors and a washable central table.', brief: 'Make a small production building feel generous without adding conditioned floor area.', moves: ['Use roof monitors instead of perimeter glass', 'Make the central table the social condenser', 'Expose service rails as wayfinding'], accent: '#9f2d21' },
];

export const proposalDefaults = {
  client: 'Civic Works Trust',
  site: 'Warehouse at the east viaduct',
  scope: 'Feasibility study, public-room strategy and two renovation options.',
  budget: '$1.8m concept range',
};

export const routes = [
  { path: '/', title: 'Form architecture studio' },
  { path: '/projects', title: 'Project studies' },
  { path: '/studio', title: 'Studio method' },
  { path: '/proposal', title: 'Proposal brief' },
  { path: '/build', title: 'Build journal' },
  ...projects.map((project) => ({ path: `/projects/${project.slug}`, title: project.title })),
  { path: '/404', title: 'Not found' },
];
