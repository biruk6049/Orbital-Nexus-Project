import { CelestialBody, TourStop, ExoplanetConfig } from './types';

export const SOLAR_SYSTEM: CelestialBody[] = [
  {
    id: 'mercury',
    name: 'MERCURY',
    type: 'rocky',
    diameter: 4879,
    color: '#8c8c8c',
    secondaryColor: '#5c5c5c',
    distanceFromSun: 39, // in 0.1 AU
    orbitalPeriod: 88,
    rotationPeriod: 1407.6,
    moonsCount: 0,
    gravity: 3.7,
    temperature: '-180°C to 430°C',
    atmosphere: ['Helium', 'Sodium', 'Oxygen', 'Potassium'],
    description: 'The smallest planet in our solar system and nearest to the Sun. It experiences extreme temperature differentials, swinging from furnace-like heat to global deep-freeze.',
    funFact: 'A year on Mercury is just 88 Earth days, but a single day-night cycle takes 176 Earth days.',
    hasRings: false,
    coreStructure: [
      {
        name: 'Crust / Surface',
        thickness: '35 - 45 km',
        composition: 'Silicate rocky dust',
        color: '#a3a3a3',
        description: 'Pockmarked with countless impact craters, similar to our Moon.'
      },
      {
        name: 'Solid Mantle',
        thickness: '500 - 600 km',
        composition: 'Rocky silicates',
        color: '#6b6b6b',
        description: 'A rocky mantle covering the massive iron core.'
      },
      {
        name: 'Metallic Core',
        thickness: '2,020 km (radius)',
        composition: 'Molten Iron and Nickel',
        color: '#f97316',
        description: 'Unusually massive core containing more iron than any other major planet.'
      }
    ]
  },
  {
    id: 'venus',
    name: 'VENUS',
    type: 'rocky',
    diameter: 12104,
    color: '#eab308',
    secondaryColor: '#ca8a04',
    distanceFromSun: 72,
    orbitalPeriod: 224.7,
    rotationPeriod: -5832.5, // retrograde
    moonsCount: 0,
    gravity: 8.87,
    temperature: '462°C (Constant)',
    atmosphere: ['Carbon Dioxide (96%)', 'Nitrogen (3.5%)', 'Sulfur Dioxide'],
    description: 'Often called Earth\'s sister planet, Venus is wrapped in a high-density greenhouse blanket. The atmospheric pressure on the surface is 92 times that of Earth.',
    funFact: 'Venus rotates backwards on its axis compared to most planets (retrograde rotation).',
    hasRings: false,
    coreStructure: [
      {
        name: 'Crust',
        thickness: '30 - 50 km',
        composition: 'Basaltic rock',
        color: '#fbbf24',
        description: 'Vast lava plains and volcanic mountain peaks.'
      },
      {
        name: 'Silicate Mantle',
        thickness: '3,000 km',
        composition: 'Rocky silicates',
        color: '#d97706',
        description: 'Dense rocky layer constituting the bulk of Venus\'s volume.'
      },
      {
        name: 'Metallic Liquid Core',
        thickness: '3,000 km (radius)',
        composition: 'Iron-Nickel alloy',
        color: '#ea580c',
        description: 'Molten iron alloy core, without a solid inner center.'
      }
    ]
  },
  {
    id: 'earth',
    name: 'EARTH',
    type: 'rocky',
    diameter: 12742,
    color: '#3b82f6',
    secondaryColor: '#10b981',
    distanceFromSun: 100,
    orbitalPeriod: 365.25,
    rotationPeriod: 24,
    moonsCount: 1,
    gravity: 9.81,
    temperature: '-89°C to 58°C',
    atmosphere: ['Nitrogen (78%)', 'Oxygen (21%)', 'Argon (0.9%)', 'Carbon Dioxide'],
    description: 'Our homeworld is the only known celestial body to support life. Liquid oceans, dynamic tectonic currents, and a rich atmosphere maintain a perfect biological balance.',
    funFact: 'Earth is the only planet in the solar system not named after a mythological god.',
    hasRings: false,
    coreStructure: [
      {
        name: 'Oceanic & Continental Crust',
        thickness: '5 - 70 km',
        composition: 'Basalt and Granite rock',
        color: '#10b981',
        description: 'Subdivided into tectonic plates that shift and float on the mantle.'
      },
      {
        name: 'Convective Mantle',
        thickness: '2,890 km',
        composition: 'Silicate rock, high magnesium/iron',
        color: '#ef4444',
        description: 'Semi-solid rock layer that slowly circulates, driving plate tectonics.'
      },
      {
        name: 'Liquid Outer Core',
        thickness: '2,260 km',
        composition: 'Molten Iron and Nickel',
        color: '#f97316',
        description: 'Liquid electrical currents generate the planet\'s magnetic field.'
      },
      {
        name: 'Solid Inner Core',
        thickness: '1,220 km (radius)',
        composition: 'Crystalline Solid Iron',
        color: '#fef08a',
        description: 'Superheated dome under intense gravitational pressure.'
      }
    ]
  },
  {
    id: 'mars',
    name: 'MARS',
    type: 'rocky',
    diameter: 6779,
    color: '#ef4444',
    secondaryColor: '#991b1b',
    distanceFromSun: 152,
    orbitalPeriod: 687,
    rotationPeriod: 24.6,
    moonsCount: 2,
    gravity: 3.71,
    temperature: '-143°C to 35°C',
    atmosphere: ['Carbon Dioxide (95%)', 'Nitrogen (2.8%)', 'Argon', 'Oxygen'],
    description: 'The Red Planet is a cold desert world. Its rust-red iron oxide dust, ancient dry flood-beds, and extinct hyper-volcanoes suggest a warm and wet primordial past.',
    funFact: 'Mars is home to Olympus Mons, the largest volcano in the solar system, three times taller than Mount Everest.',
    hasRings: false,
    coreStructure: [
      {
        name: 'Iron Crust',
        thickness: '50 - 100 km',
        composition: 'Iron-rich basalt',
        color: '#b91c1c',
        description: 'Highly oxidized layer of rust-like dust and rocky basalt.'
      },
      {
        name: 'Silicate Mantle',
        thickness: '1,600 km',
        composition: 'Rocky silicates',
        color: '#7f1d1d',
        description: 'Quiescent mantle layer with minimal convective action.'
      },
      {
        name: 'Solid Nickel-Iron Core',
        thickness: '1,800 km (radius)',
        composition: 'Iron, Nickel and Sulfur fluid',
        color: '#ea580c',
        description: 'Partially frozen core that no longer drives a planetary magnetic dynamo.'
      }
    ]
  },
  {
    id: 'jupiter',
    name: 'JUPITER',
    type: 'gas_giant',
    diameter: 139820,
    color: '#f97316',
    secondaryColor: '#eab308',
    distanceFromSun: 520,
    orbitalPeriod: 4333,
    rotationPeriod: 9.9,
    moonsCount: 95,
    gravity: 24.79,
    temperature: '-108°C (Average)',
    atmosphere: ['Hydrogen (90%)', 'Helium (10%)', 'Methane', 'Ammonia'],
    description: 'A colossal storm-brewing gas giant twice as massive as all other planets combined. Featuring iconic atmospheric bands and the centuries-old, giant Great Red Spot cyclonic storm system.',
    funFact: 'Jupiter rotates so rapidly that its day is only 10 hours long, causing a visible equatorial bulge.',
    hasRings: true,
    ringColor: 'rgba(249, 115, 22, 0.2)',
    coreStructure: [
      {
        name: 'Gaseous Atmosphere',
        thickness: '5,000 km',
        composition: 'Gaseous Hydrogen and Helium',
        color: '#f97316',
        description: 'Layer of dense clouds containing trace water and ammonia ice crystals.'
      },
      {
        name: 'Liquid Metallic Hydrogen Mantle',
        thickness: '40,000 km',
        composition: 'Electrically conducting Metallic Hydrogen',
        color: '#ca8a04',
        description: 'Immense pressure crushes molecular hydrogen to a liquid metallic superconductor.'
      },
      {
        name: 'Heavy Dense Core',
        thickness: '14,000 km (radius)',
        composition: 'Dense Silicates, Iron, and Ices',
        color: '#451a03',
        description: 'A rocky core under tens of millions of atmospheres of pressure.'
      }
    ]
  },
  {
    id: 'saturn',
    name: 'SATURN',
    type: 'gas_giant',
    diameter: 116460,
    color: '#fde047',
    secondaryColor: '#ca8a04',
    distanceFromSun: 958,
    orbitalPeriod: 10759,
    rotationPeriod: 10.7,
    moonsCount: 146,
    gravity: 10.44,
    temperature: '-139°C (Average)',
    atmosphere: ['Hydrogen (96%)', 'Helium (3%)', 'Methane', 'Ethane'],
    description: 'Adorned with an extensive, highly reflective ring system composed of pure ice particles, cosmic dust, and rocky debris sweeping over a golden hydrogen atmosphere.',
    funFact: 'Saturn has a density so low that it could theoretically float on a giant body of water.',
    hasRings: true,
    ringColor: 'rgba(253, 224, 71, 0.45)',
    coreStructure: [
      {
        name: 'Gaseous Envelope',
        thickness: '1,000 km',
        composition: 'Molecular Hydrogen and Helium',
        color: '#fef08a',
        description: 'Atmospheric top layers with subtle yellow/beige hurricane currents.'
      },
      {
        name: 'Fluid Metallic Hydrogen Mantle',
        thickness: '30,000 km',
        composition: 'Metallic Hydrogen and Helium rain',
        color: '#eab308',
        description: 'Encircled by magnetic active currents driving planetary radio emissions.'
      },
      {
        name: 'Rocky/Icy Core',
        thickness: '12,000 km (radius)',
        composition: 'Silicates, Iron, Rock, and Water Ices',
        color: '#1e1b4b',
        description: 'Extremely dense, heavy element rock heart containing 15 Earth masses.'
      }
    ]
  },
  {
    id: 'uranus',
    name: 'URANUS',
    type: 'icy_giant',
    diameter: 50724,
    color: '#22d3ee',
    secondaryColor: '#0891b2',
    distanceFromSun: 1920,
    orbitalPeriod: 30687,
    rotationPeriod: -17.2, // retrograde
    moonsCount: 28,
    gravity: 8.69,
    temperature: '-224°C (Average)',
    atmosphere: ['Hydrogen (83%)', 'Helium (15%)', 'Methane (2.3%)'],
    description: 'An icy gas giant with a distinct pale cyan color caused by atmospheric methane. Famously tilted nearly 98 degrees on its axis, literally rolling through its solar orbit on its side.',
    funFact: 'Because of its extreme axial tilt, a single pole of Uranus experiences 42 years of continuous sunlight.',
    hasRings: true,
    ringColor: 'rgba(34, 211, 238, 0.3)',
    coreStructure: [
      {
        name: 'Upper Gaseous Atmosphere',
        thickness: '5,000 km',
        composition: 'Hydrogen, Helium, and Methane gas',
        color: '#67e8f9',
        description: 'The methane absorbs red light, giving the giant its beautiful cyan-blue tone.'
      },
      {
        name: 'Super-Ionic Water Mantle',
        thickness: '10,000 km',
        composition: 'Water, Ammonia, and Methane Ices',
        color: '#0e7490',
        description: 'A hot, dense fluid ocean of liquid water and metallic ion soup.'
      },
      {
        name: 'Rocky/Silicate Core',
        thickness: '5,000 km (radius)',
        composition: 'Iron and Rocky Silicates',
        color: '#0f172a',
        description: 'Small core of iron and stone where heavy-element sediment deposits reside.'
      }
    ]
  },
  {
    id: 'neptune',
    name: 'NEPTUNE',
    type: 'icy_giant',
    diameter: 49244,
    color: '#3b82f6',
    secondaryColor: '#1d4ed8',
    distanceFromSun: 3005,
    orbitalPeriod: 60190,
    rotationPeriod: 16.1,
    moonsCount: 16,
    gravity: 11.15,
    temperature: '-201°C (Average)',
    atmosphere: ['Hydrogen (80%)', 'Helium (19%)', 'Methane (1.5%)'],
    description: 'Dark, cold, and whipped by supersonic orbital gales reaching up to 2,100 km/h. Neptune marks the quiet outer boundary of our celestial planetary layout.',
    funFact: 'Neptune was the first planet discovered entirely through mathematical predictions before being observed with a telescope.',
    hasRings: true,
    ringColor: 'rgba(59, 130, 246, 0.25)',
    coreStructure: [
      {
        name: 'Suppressed Atmosphere',
        thickness: '5,000 km',
        composition: 'Hydrogen, Helium, and Methane cloud layers',
        color: '#60a5fa',
        description: 'Active storm systems like the Great Dark Spot race through these upper limits.'
      },
      {
        name: 'Icy Ionic Mantle',
        thickness: '10,000 km',
        composition: 'Water-Ammonia-Methane Ice Ocean',
        color: '#1d4ed8',
        description: 'Superheated liquid electric mantle where ice crystals and diamonds may rain down.'
      },
      {
        name: 'Dense Silicate Core',
        thickness: '5,000 km (radius)',
        composition: 'Silicates, Nickel, and Iron rock',
        color: '#1e293b',
        description: 'Deep nickel-iron core containing pressure-sealed heavy silicates.'
      }
    ]
  }
];

export const GUIDED_TOURS: TourStop[] = [
  {
    id: 'system_overview',
    title: 'Solar System Boundary',
    planetId: 'system',
    cameraOffset: { x: 0, y: 15, z: 25 },
    commentary: 'Welcome to the Orbital Nexus 3D platform. Here we observe the Solar Hub—a precision grid measuring orbital paths, relative distance envelopes, and telemetry matrices.'
  },
  {
    id: 'mercury_forge',
    title: 'The Solar Crucible',
    planetId: 'mercury',
    cameraOffset: { x: 0, y: 0.5, z: 2 },
    commentary: 'Our first stop is Mercury. Hanging closely to the sun, this scorched rock experiences massive tidal gravitational heating and is stripped of most outer crust materials.'
  },
  {
    id: 'venus_greenhouse',
    title: 'Venutian Furnace',
    planetId: 'venus',
    cameraOffset: { x: 1, y: 0.5, z: 2.2 },
    commentary: 'Hovering over Venus, we observe a world suffocating under dense carbon dioxide streams. Surface thermal envelopes are locked constantly at 462°C.'
  },
  {
    id: 'earth_sanctuary',
    title: 'Earth Magneto Shield',
    planetId: 'earth',
    cameraOffset: { x: 1.2, y: 0.8, z: 2.5 },
    commentary: 'Earth, our biological sanctuary. Deep convective forces within its molten outer iron core generate the magnetosphere that shields its atmosphere and life from ionizing solar winds.'
  },
  {
    id: 'mars_rusty',
    title: 'Martian Desolation',
    planetId: 'mars',
    cameraOffset: { x: -1, y: 0.3, z: 1.8 },
    commentary: 'Mars, the rusty desert. Lacking an active internal core dynamo, its ancient crust took on its signature crimson hue as vital planetary water evaporated under solar radiation.'
  },
  {
    id: 'jupiter_giant',
    title: 'Colossus Jupiter',
    planetId: 'jupiter',
    cameraOffset: { x: 0, y: 1.5, z: 4 },
    commentary: 'Behold Jupiter, the king. Beneath its swirling bands and continuous storms, the pressure is so intense that molecular hydrogen is crushed into a superconductor metallic sea.'
  },
  {
    id: 'saturn_gems',
    title: 'Saturn Ring Plane',
    planetId: 'saturn',
    cameraOffset: { x: 2, y: 1, z: 4.5 },
    commentary: 'Exploring Saturn\'s magnificent icy flat plane. Billions of reflective crystalline ice particles collide to create the universe\'s most elegant planetary rings.'
  },
  {
    id: 'uranus_tilted',
    title: 'Rotational Anomaly',
    planetId: 'uranus',
    cameraOffset: { x: -1.5, y: -0.5, z: 3.5 },
    commentary: 'Uranus rotates almost perpendicular to its orbital path. Some great ancient celestial impact is theorized to have knocked it onto its side, along with its rings.'
  },
  {
    id: 'neptune_supersonic',
    title: 'Abyssal Winds',
    planetId: 'neptune',
    cameraOffset: { x: 0.8, y: 1.2, z: 3 },
    commentary: 'Lastly, Neptune. Home to supersonic winds of water-ammonia ices, this cyan-ultramarine world wraps up our main solar system guide at 30 AU.'
  }
];

export const PRESET_EXOPLANETS: ExoplanetConfig[] = [
  {
    name: 'Kepler-186f',
    colorPrimary: '#ef4444',
    colorSecondary: '#eab308',
    size: 1.1,
    atmosphereDensity: 0.85,
    rotationSpeed: 1.2,
    orbitalPeriod: 130,
    ringStyle: 'none',
    starType: 'm-class'
  },
  {
    name: 'WASP-12b',
    colorPrimary: '#ec4899',
    colorSecondary: '#3b82f6',
    size: 2.1,
    atmosphereDensity: 0.95,
    rotationSpeed: 3.5,
    orbitalPeriod: 1.1,
    ringStyle: 'dense',
    starType: 'o-class'
  },
  {
    name: 'Epsilon Eridani b',
    colorPrimary: '#06b6d4',
    colorSecondary: '#10b981',
    size: 1.5,
    atmosphereDensity: 0.2,
    rotationSpeed: 0.8,
    orbitalPeriod: 250,
    ringStyle: 'thin',
    starType: 'g-class'
  }
];
