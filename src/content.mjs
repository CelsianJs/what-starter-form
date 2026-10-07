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

const studyDetails = [
  { area: '4,800 m² concept study', program: '36 homes, shared winter gardens, laundry rooms and a public ground-floor arcade', materials: ['Reclaimed clay brick', 'Timber window frames', 'Exposed concrete stair cores'], rationale: ['The river edge is treated as a public route rather than a private frontage. Two narrow building volumes preserve the industrial rhythm while a sheltered arcade connects the quay to the neighborhood behind it. The common rooms face that route so everyday use, not signage, gives the entrance its address.', 'Deep brick fins reduce summer glare but keep winter light available to the gardens. Their spacing changes at entries, making the same construction system carry both environmental and wayfinding work. The study tests this section before fixing an elevation.'], tradeoff: 'A porous ground floor gives up rentable area. The study keeps services compact and measures shared rooms by daily use rather than treating them as residual circulation.' },
  { area: '920 m² concept study', program: 'Reading hall, four study rooms, maker workshop and public stair seating', materials: ['Limewashed masonry', 'Birch plywood shelving', 'Reused stone thresholds'], rationale: ['The annex sits behind the original cornice so the library remains the familiar civic address. A low connecting room contains the workshop; the quiet reading hall rises farther from the square, where roof light can reach tables without exposing readers to street noise.', 'The stair is wide enough to act as a small gathering place, but a separate accessible route serves every level. Storage is built into the light shelves instead of scattered through the hall, keeping the central tables available for different forms of study.'], tradeoff: 'Roof light needs maintenance access and careful glare control. The study uses north-facing openings and reachable internal shades, not a fully glazed roof.' },
  { area: '610 m² concept study', program: 'Fabrication hall, shared studio, tool store and wash-down work table', materials: ['Corrugated steel roof', 'Timber roof monitors', 'Hard-wearing mineral floor'], rationale: ['The rail-side shell is retained as the organizing frame. Roof monitors bring diffuse light over the work benches while perimeter walls remain available for tools, extraction ducts and storage. Generosity comes from a clear shared center rather than more conditioned area.', 'A long washable table links assembly, drawing reviews and meals. Service rails remain exposed above it so the building can accept new equipment without cutting finished walls. Deep window sills provide small places to work away from the production floor.'], tradeoff: 'An open hall carries sound across work zones. The concept places enclosed review rooms on the quiet edge and treats acoustic absorption as part of the roof section.' },
];
projects.forEach((project, index) => Object.assign(project, studyDetails[index]));

export const routes = [
  { path: '/', title: 'Form architecture studio' },
  { path: '/projects', title: 'Project studies' },
  { path: '/studio', title: 'Studio method' },
  { path: '/proposal', title: 'Proposal brief' },
  { path: '/build', title: 'Build journal' },
  ...projects.map((project) => ({ path: `/projects/${project.slug}`, title: project.title })),
  { path: '/404', title: 'Not found' },
];
