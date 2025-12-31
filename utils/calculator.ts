import { PRICES, LABOR_RATES, CITY_COEFFICIENTS, PROJECT_COEFFICIENTS, WARNINGS_LIST } from "../constants";
import { EstimateResult, KitchenType, MaterialItem, UserInputs, QualityLevel, ProjectType } from "../types";

export const calculateEstimate = (inputs: UserInputs): EstimateResult => {
  // 1. Calculate Points (Rule Based)
  
  // General Lighting based on Area (1 per 12-15m2)
  // We subtract utility areas roughly to avoid double counting, or just use total area as base load
  // Prompt Rule: "Area / 12-15" for lighting.
  const baseLighting = Math.ceil(inputs.area / 14);

  // Specific Room Additions
  const bedroomLighting = inputs.bedrooms * 1;
  const bedroomSockets = inputs.bedrooms * 4; // Avg of 3-5

  const kitchenLighting = 2; 
  const kitchenSockets = inputs.kitchenType === KitchenType.HIGH_CONSUMPTION ? 10 : 7; // Avg 6-10

  const bathLighting = inputs.bathrooms * 1;
  const bathSockets = inputs.bathrooms * 1;

  const parkingLighting = inputs.hasParking ? 1 : 0;
  const parkingSockets = inputs.hasParking ? 1 : 0;

  // Total Counts
  // Note: The prompt implies specific rules. We sum them up. 
  // However, "Area / 12-15" usually covers the Living Room + Corridors.
  // We will assume the Area based lighting covers the whole house general lighting, 
  // but we must ensure we have enough specific controls.
  // Let's refine: The prompt lists distinct rules. We will sum them.
  // But wait, if I have a 100m house with 2 bedrooms.
  // 100/14 = 7 lights total based on area.
  // Bedrooms = 2 lights. Kitchen = 2. Bath = 1. Total specific = 5.
  // So we add 2 more for Hall/Corridor. This logic works.
  
  let totalLighting = Math.max(Math.ceil(inputs.area / 14), (bedroomLighting + kitchenLighting + bathLighting + parkingLighting + 2));
  let totalSockets = bedroomSockets + kitchenSockets + bathSockets + parkingSockets + Math.ceil((inputs.area - (inputs.bedrooms*12)) / 20); // Add general sockets for living room

  // Switches usually equal lighting points (some double, some single, let's avg 1:1 for estimation)
  const totalSwitches = totalLighting;
  
  const totalPoints = totalLighting + totalSockets + totalSwitches;

  // 2. Calculate Materials (Prompt Rules)
  
  // Wire
  const wire1_5_Length = totalLighting * 10;
  const wire2_5_Length = totalSockets * 12;
  const totalPhaseNull = wire1_5_Length + wire2_5_Length;
  const earthWireLength = totalPhaseNull * 0.7; // Prompt Rule: 70% of total paths
  
  // Conduit (Pipe)
  // Prompt Rule: 1.2 * Total Wire Lengths. 
  // Engineering Interpretation: The prompt likely means path length.
  // If we take "Total Wire Length" literally (Phase+Null+Earth), the pipe amount is huge.
  // However, if we assume (Wire1.5 + Wire2.5) represents the run length of circuits (Phase/Null pairs),
  // dividing by 2 or 3 gives the tube length.
  // Let's use a standard factor to be helpful but sticking to the Prompt's "1.2 factor".
  // Factor 0.4 of total linear wire meters approximates "3 wires per tube + 20% waste".
  // (1 meter tube holds 3 meters wire. 1m wire needs 0.33m tube. * 1.2 waste = 0.4)
  const pipeLength = Math.ceil((wire1_5_Length + wire2_5_Length + earthWireLength) * 0.4); 

  // Equipment
  const switchCount = totalSwitches;
  const socketCount = totalSockets;
  const boxCount = totalPoints; // Junction boxes/Back boxes
  const fuseBoxLines = Math.max(8, Math.min(12, Math.ceil(totalPoints / 8))); // 8-12 lines rule
  const miniatureFuses = fuseBoxLines; // 1 per line

  // 3. Prices
  
  // Material Unit Prices (Range +/- 15%)
  const getPriceRange = (base: number) => ({ low: base * 0.9, high: base * 1.15 });
  
  // Switch/Socket price based on Quality
  let switchSocketBasePrice = PRICES.SWITCH_SOCKET_STD;
  if (inputs.quality === QualityLevel.ECONOMY) switchSocketBasePrice = PRICES.SWITCH_SOCKET_ECO;
  if (inputs.quality === QualityLevel.PREMIUM) switchSocketBasePrice = PRICES.SWITCH_SOCKET_PRM;

  const materials: MaterialItem[] = [
    {
      name: "سیم ۱.۵ (روشنایی)",
      unit: "متر",
      quantity: wire1_5_Length,
      unitPriceLow: PRICES.WIRE_1_5 * 0.9,
      unitPriceHigh: PRICES.WIRE_1_5 * 1.1,
    },
    {
      name: "سیم ۲.۵ (پریز)",
      unit: "متر",
      quantity: wire2_5_Length,
      unitPriceLow: PRICES.WIRE_2_5 * 0.9,
      unitPriceHigh: PRICES.WIRE_2_5 * 1.1,
    },
    {
      name: "سیم ارت",
      unit: "متر",
      quantity: Math.ceil(earthWireLength),
      unitPriceLow: PRICES.WIRE_EARTH * 0.9,
      unitPriceHigh: PRICES.WIRE_EARTH * 1.1,
    },
    {
      name: "لوله و اتصالات (PVC/فلکسی)",
      unit: "متر",
      quantity: pipeLength,
      unitPriceLow: PRICES.PIPE_PVC * 0.9,
      unitPriceHigh: PRICES.PIPE_PVC * 1.1,
    },
    {
      name: "کلید و پریز (مکانیزم + کادر)",
      unit: "عدد",
      quantity: switchCount + socketCount,
      unitPriceLow: switchSocketBasePrice * 0.9,
      unitPriceHigh: switchSocketBasePrice * 1.2,
    },
    {
      name: "قوطی کلید و پریز",
      unit: "عدد",
      quantity: boxCount,
      unitPriceLow: PRICES.BOX_SWITCH * 0.9,
      unitPriceHigh: PRICES.BOX_SWITCH * 1.1,
    },
    {
      name: "جعبه فیوز کامل",
      unit: "عدد",
      quantity: 1,
      unitPriceLow: PRICES.FUSE_BOX * 0.9,
      unitPriceHigh: PRICES.FUSE_BOX * 1.2,
    },
    {
      name: "فیوز مینیاتوری",
      unit: "عدد",
      quantity: miniatureFuses,
      unitPriceLow: PRICES.MCB_FUSE * 0.9,
      unitPriceHigh: PRICES.MCB_FUSE * 1.15,
    },
  ];

  // Calculate Material Cost Totals
  let matLow = 0;
  let matHigh = 0;
  materials.forEach(m => {
    matLow += m.quantity * m.unitPriceLow;
    matHigh += m.quantity * m.unitPriceHigh;
  });

  // 4. Labor & Time
  
  // Base labor per point * Total Points
  const baseLaborRate = LABOR_RATES[inputs.quality];
  // Coefficients
  const cityCoef = CITY_COEFFICIENTS[inputs.cityType];
  const projectCoef = PROJECT_COEFFICIENTS[inputs.projectType];
  
  const totalLaborBase = totalPoints * baseLaborRate;
  const totalLaborAdjusted = totalLaborBase * cityCoef * projectCoef;

  // Add fixed costs for Fuse Box installation and main cable (approx 15% of points labor)
  const finalLabor = totalLaborAdjusted * 1.15;

  // Time Estimate: Approx 8-10 points per day for a team of 2
  const pointsPerDay = inputs.projectType === ProjectType.RENOVATION ? 6 : 9;
  const days = Math.ceil(totalPoints / pointsPerDay);

  return {
    totalPoints: {
      lighting: totalLighting,
      sockets: totalSockets,
      switches: totalSwitches,
    },
    materials,
    costs: {
      materialsLow: Math.round(matLow),
      materialsHigh: Math.round(matHigh),
      laborLow: Math.round(finalLabor * 0.9),
      laborHigh: Math.round(finalLabor * 1.15),
      totalLow: Math.round(matLow + (finalLabor * 0.9)),
      totalHigh: Math.round(matHigh + (finalLabor * 1.15)),
    },
    timeEstimateDays: days,
    warnings: WARNINGS_LIST,
  };
};