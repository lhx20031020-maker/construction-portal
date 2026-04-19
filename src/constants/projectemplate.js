import libraryData from './master_dataset.json';

// 1. THE DEFINITIVE PROJECT STRUCTURE
const PROJECT_MAP = {
  "Substructure": ["Excavation", "Piling & Shoring", "Foundations", "Water Proofing", "Retaining Wall"],
  "Superstructure": ["Columns & Beams", "Floor Slab", "Core Construction", "Roof structure"],
  "Building Envelope": ["External Wall", "Roofing", "Glazing", "Windows & Doors"],
  "First Install": ["Fire-Stopping", "Internal Partitioning", "MEP Rough-in", "Fire Sprinklers", "Elevators"],
  "Second Install": ["Internal Plastering", "Ceiling Installation", "Bathroom Installation", "Kitchen & Appliances", "Second Fix MEP", "Joinery", "Flooring", "Electrical Installation", "Internal Finishes"],
  "External Works": ["Landscaping"],
  "Testing, Commissioning & Handover": ["Testing & Balancing", "Electrical Certification", "Snagging", "Final Inspection", "Practical Completion"]
};

// 2. THE DRIVER ASSIGNMENT (Keeping the logic separate from the data)
const getDriverForTask = (taskName) => {
  const wallTasks = ["External Wall", "Building Envelope"];
  const windowTasks = ["Glazing", "Windows & Doors"];
  const storeyTasks = ["Electrical Installation", "Bathroom Installation", "Kitchen & Appliances", "Second Fix MEP", "Fire Sprinklers", "Elevators", "Internal Partitioning"];
  
  if (wallTasks.includes(taskName)) return "wallArea";
  if (windowTasks.includes(taskName)) return "windowArea";
  if (storeyTasks.includes(taskName)) return "storeys";
  return "gia"; 
};

export const generateSmartTemplate = () => {
  const template = {};

  Object.entries(PROJECT_MAP).forEach(([phase, tasks]) => {
    template[phase] = {};
    
    tasks.forEach(taskName => {
      // SURGICAL MATCH: Find items where item.Task is EXACTLY the taskName
      const matchingItems = libraryData.filter(item => item.Task === taskName);

      if (matchingItems.length > 0) {
        // Take 1/4 of the products as requested
        const sampleSize = Math.max(1, Math.floor(matchingItems.length * 0.25));
        const sampled = matchingItems.slice(0, sampleSize);

        template[phase][taskName] = sampled.map(item => ({
          code: item.Code,
          name: item.Identifier,
          unit: item["U.M."],
          price: item["Price (€)"],
          driver: getDriverForTask(taskName),
          factor: 1.0 
        }));
      } else {
        // This will tell us EXACTLY which tasks are failing to find their data
        console.error(`DATA MISMATCH: Task "${taskName}" has 0 products in master_dataset.json`);
      }
    });
  });

  return template;
};

export const BASE_PROJECT_TEMPLATE = generateSmartTemplate();

export const getInitialQuantities = (projectData) => {
  const initialQty = {};
  Object.values(BASE_PROJECT_TEMPLATE).forEach(phase => {
    Object.values(phase).forEach(taskItems => {
      taskItems.forEach(item => {
        const multiplier = projectData[item.driver] || projectData.gia;
        initialQty[item.code] = multiplier * (item.factor || 1);
      });
    });
  });
  return initialQty;
};

export default getInitialQuantities;
