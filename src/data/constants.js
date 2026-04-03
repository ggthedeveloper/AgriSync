export const PLANS = {
  free:    { price: 0,   color: "#64748b", features: ["Basic weather", "MSP prices", "Community", "1 diagnosis/month"] },
  basic:   { price: 99,  color: "#1d8a3c", features: ["Full weather", "Soil monitoring", "Analytics", "5 diagnoses/month", "Market prices"] },
  premium: { price: 199, color: "#7c3aed", features: ["All Basic", "AI pest control", "Predictive yield", "Unlimited diagnosis", "Priority support"] },
};
export const PORDER = ["free", "basic", "premium"];
export const PAGEPLANS = {
  dashboard: ["free","basic","premium"],
  diagnose:  ["basic","premium"],
  advisor:   ["basic","premium"],
  market:    ["free","basic","premium"],
  community: ["free","basic","premium"],
  hub:       ["basic","premium"],
  health:    ["free","basic","premium"],
};

export const SCHEMES = [
  { name:"PM-KISAN",           benefit:"₹6,000/year",          deadline:"31 Dec 2025", url:"https://pmkisan.gov.in",                       desc:"Direct income support of ₹6,000/year in 3 installments to farmer families.",                  docs:["Aadhaar card","Bank passbook","Land records","Linked mobile"] },
  { name:"Fasal Bima Yojana",  benefit:"Insurance up to ₹2L",  deadline:"15 Jan 2026", url:"https://pmfby.gov.in",                         desc:"Financial support against crop loss from natural calamities, pests and diseases.",            docs:["Aadhaar","Bank details","Land sown certificate","Crop declaration"] },
  { name:"Kisan Credit Card",  benefit:"Credit up to ₹3L @ 4%",deadline:"Open",        url:"https://www.nabard.org/content1.aspx?id=572",  desc:"Short-term credit at 4% interest for crop cultivation and farm needs.",                       docs:["Aadhaar","Land ownership proof","Photo","Bank account"] },
  { name:"Soil Health Card",   benefit:"Free test + ₹500",     deadline:"Open",        url:"https://soilhealth.dac.gov.in",                desc:"Free soil testing and fertilizer recommendations to improve yield.",                           docs:["Farmer ID","Land holding details","Visit nearest KVK"] },
  { name:"PM Kisan Maan Dhan", benefit:"₹3,000/month pension", deadline:"Open",        url:"https://maandhan.in",                          desc:"Monthly pension of ₹3,000 after age 60 for small and marginal farmers.",                       docs:["Aadhaar","Bank account","Land records"] },
  { name:"eNAM",               benefit:"Online mandi access",  deadline:"Open",        url:"https://www.enam.gov.in",                      desc:"National Agriculture Market – sell produce at best prices across India.",                       docs:["Aadhaar / KYC","Bank account","Register at FPO"] },
];

export const LOANS = [
  { name:"Kisan Credit Card (KCC)",  rate:"4% p.a.",   max:"₹3 Lakh",   tenure:"12 months", url:"https://www.nabard.org/content1.aspx?id=572", desc:"Short-term credit for crop cultivation, post-harvest and allied activities." },
  { name:"Agriculture Gold Loan",    rate:"7–9% p.a.", max:"₹10 Lakh",  tenure:"36 months", url:"https://www.nabard.org",                       desc:"Gold-collateralized agri loan with flexible tenure from NABARD." },
  { name:"Allied Activities Loan",   rate:"9–12% p.a.",max:"₹20 Lakh",  tenure:"60 months", url:"https://www.nabard.org",                       desc:"For poultry, fishery, animal husbandry and allied activities." },
  { name:"Farm Infrastructure Loan", rate:"6–8% p.a.", max:"₹1 Crore",  tenure:"10 years",  url:"https://www.nabard.org",                       desc:"For irrigation, cold storage, warehouse, and farm machinery." },
];

export const INS_SCH = [
  { name:"PMFBY – Kharif",      premium:"₹840–2,400/acre", coverage:"Up to ₹40,000/acre", url:"https://pmfby.gov.in",   desc:"Covers paddy, cotton, maize, groundnut during Kharif season." },
  { name:"PMFBY – Rabi",        premium:"₹500–1,500/acre", coverage:"Up to ₹30,000/acre", url:"https://pmfby.gov.in",   desc:"Covers wheat, mustard, chana, sunflower during Rabi season." },
  { name:"Weather Based WBCIS", premium:"₹300–900/acre",   coverage:"Weather risk only",  url:"https://pmfby.gov.in",   desc:"Index-based insurance triggered by rainfall or temperature deviation." },
  { name:"Livestock Insurance", premium:"3–4% of value",   coverage:"Full animal value",  url:"https://dahd.nic.in",    desc:"Covers cattle, buffalo, sheep, goat from accidental death or disease." },
];

export const LCROPS = {
  Guntur:     [{ name:"Paddy",     s:96, profit:"₹45,000/acre", water:"High",   season:"Kharif", c:"#16a34a" },{ name:"Cotton",    s:88, profit:"₹38,000/acre", water:"Medium", season:"Kharif", c:"#7c3aed" },{ name:"Chilli",    s:85, profit:"₹72,000/acre", water:"Medium", season:"Kharif", c:"#dc2626" },{ name:"Groundnut", s:74, profit:"₹52,000/acre", water:"Low",    season:"Rabi",   c:"#d97706" }],
  Warangal:   [{ name:"Cotton",    s:92, profit:"₹40,000/acre", water:"Medium", season:"Kharif", c:"#7c3aed" },{ name:"Paddy",     s:84, profit:"₹44,000/acre", water:"High",   season:"Kharif", c:"#16a34a" },{ name:"Soybean",   s:80, profit:"₹36,000/acre", water:"Low",    season:"Kharif", c:"#65a30d" },{ name:"Turmeric",  s:71, profit:"₹65,000/acre", water:"Medium", season:"Rabi",   c:"#d97706" }],
  Vijayawada: [{ name:"Paddy",     s:94, profit:"₹46,000/acre", water:"High",   season:"Kharif", c:"#16a34a" },{ name:"Sugarcane", s:83, profit:"₹55,000/acre", water:"High",   season:"Annual", c:"#0d9488" },{ name:"Maize",     s:77, profit:"₹30,000/acre", water:"Medium", season:"Rabi",   c:"#d97706" },{ name:"Groundnut", s:72, profit:"₹50,000/acre", water:"Low",    season:"Rabi",   c:"#b45309" }],
  Hyderabad:  [{ name:"Vegetables",s:88, profit:"₹60,000/acre", water:"Medium", season:"Annual", c:"#16a34a" },{ name:"Maize",     s:82, profit:"₹32,000/acre", water:"Medium", season:"Kharif", c:"#d97706" },{ name:"Cotton",    s:79, profit:"₹38,000/acre", water:"Medium", season:"Kharif", c:"#7c3aed" },{ name:"Sunflower", s:75, profit:"₹28,000/acre", water:"Low",    season:"Rabi",   c:"#ca8a04" }],
  Delhi:      [{ name:"Wheat",     s:92, profit:"₹30,000/acre", water:"Medium", season:"Rabi",   c:"#d97706" },{ name:"Mustard",   s:85, profit:"₹25,000/acre", water:"Low",    season:"Rabi",   c:"#ca8a04" },{ name:"Potato",    s:80, profit:"₹40,000/acre", water:"Medium", season:"Rabi",   c:"#b45309" },{ name:"Vegetables",s:75, profit:"₹50,000/acre", water:"Medium", season:"Annual", c:"#16a34a" }],
  default:    [{ name:"Paddy",     s:80, profit:"₹40,000/acre", water:"High",   season:"Kharif", c:"#16a34a" },{ name:"Wheat",     s:76, profit:"₹28,000/acre", water:"Medium", season:"Rabi",   c:"#d97706" },{ name:"Cotton",    s:72, profit:"₹36,000/acre", water:"Medium", season:"Kharif", c:"#7c3aed" },{ name:"Vegetables",s:68, profit:"₹48,000/acre", water:"Medium", season:"Annual", c:"#16a34a" }],
};

export const WEATHER = {
  Guntur:     { t:32, h:68, w:12, c:"Partly Cloudy",  r:30, f:[["Mon",32,"sun"],["Tue",30,"cloud"],["Wed",27,"rain"],["Thu",33,"sun"],["Fri",31,"cloud"]] },
  Warangal:   { t:34, h:72, w:14, c:"Hot & Humid",    r:45, f:[["Mon",34,"cloud"],["Tue",29,"rain"],["Wed",31,"cloud"],["Thu",28,"rain"],["Fri",33,"sun"]] },
  Vijayawada: { t:33, h:65, w:10, c:"Clear Sky",      r:20, f:[["Mon",33,"sun"],["Tue",34,"sun"],["Wed",31,"cloud"],["Thu",28,"rain"],["Fri",32,"sun"]] },
  Hyderabad:  { t:31, h:60, w:16, c:"Breezy",         r:15, f:[["Mon",31,"cloud"],["Tue",33,"sun"],["Wed",34,"sun"],["Thu",30,"cloud"],["Fri",28,"rain"]] },
  default:    { t:30, h:60, w:14, c:"Partly Cloudy",  r:25, f:[["Mon",30,"cloud"],["Tue",32,"sun"],["Wed",28,"rain"],["Thu",30,"cloud"],["Fri",31,"sun"]] },
};

export const AP_REG  = ["Guntur","Vijayawada","Warangal","Hyderabad","Nalgonda","Kurnool","Tirupati","Vizag","Rajahmundry","Nellore","Ongole","Karimnagar","Nizamabad","Khammam"];
export const OT_REG  = ["Mumbai","Delhi","Pune","Chennai","Bengaluru","Kolkata","Jaipur","Lucknow","Patna","Bhopal","Nagpur","Surat","Ahmedabad"];
export const MANDIS  = [
  { m:"Guntur",     p:2240, co:7150, g:5800, d:12,  tr:216  },
  { m:"Vijayawada", p:2190, co:7080, g:5650, d:45,  tr:810  },
  { m:"Warangal",   p:2210, co:7200, g:5720, d:92,  tr:1656 },
  { m:"Hyderabad",  p:2260, co:7300, g:5900, d:145, tr:2610 },
  { m:"Nalgonda",   p:2195, co:7050, g:5600, d:78,  tr:1404 },
];
export const DIAG = [
  { disease:"Late Blight",       full:"Phytophthora infestans", tx:"Apply Mancozeb 75% WP @ 2g/L. Remove affected leaves. Improve drainage. Use copper oxychloride.",              conf:94, sev:"High"   },
  { disease:"Leaf Rust",         full:"Puccinia triticina",     tx:"Apply Propiconazole 25% EC @ 1ml/L. Ensure spacing for air circulation. Avoid overhead irrigation.",             conf:87, sev:"Medium" },
  { disease:"Aphid Infestation", full:"Aphis gossypii",         tx:"Spray Imidacloprid 17.8% SL @ 0.5ml/L. Use neem oil as organic alternative. Introduce ladybird beetles.",       conf:91, sev:"Medium" },
];
export const GODOWNS = [
  { name:"NAFED Cold Storage",   loc:"Guntur",     d:8,  cap:"2,000 MT",  temp:"2-8°C",   rate:15, ok:true  },
  { name:"AP State Warehousing", loc:"Vijayawada", d:42, cap:"5,000 MT",  temp:"Ambient", rate:8,  ok:true  },
  { name:"Private Cold Chain",   loc:"Guntur",     d:14, cap:"800 MT",    temp:"0-4°C",   rate:22, ok:false },
  { name:"FCI Godown",           loc:"Tenali",     d:28, cap:"10,000 MT", temp:"Ambient", rate:6,  ok:true  },
];
export const POSTS0 = [
  { id:1, av:"GV", author:"Gaurav",       time:"2h ago", text:"Using neem cake improved my paddy yield by 20% this season. Visible difference within 10 days.", likes:42, liked:false, comments:[{ a:"Suresh",  t:"Works great for cotton too!" }], crop:"Paddy",     loc:"Guntur"   },
  { id:2, av:"LD", author:"Lakshmi Devi", time:"5h ago", text:"AI drone spraying covered 10 acres in 2 hours. Uniform coverage and reduced chemical usage.",   likes:67, liked:false, comments:[],                                                  crop:"Cotton",    loc:"Warangal"  },
  { id:3, av:"SR", author:"Suresh Reddy", time:"1d ago", text:"Soil test showed potassium deficiency. Applied MOP at 25 kg/acre — visible improvement in 2 weeks.", likes:31, liked:false, comments:[{ a:"Lakshmi", t:"How much per acre?" }],    crop:"Groundnut", loc:"Nalgonda"  },
];
export const USERS = [
  { ph:"9999999999", pw:"farmer123", name:"Gaurav",       acres:"12", loc:"Guntur",   soil:"Black", wsrc:"Canal",    farm:"Gaurav's Farm" },
  { ph:"8888888888", pw:"kisan456",  name:"Lakshmi Devi", acres:"8",  loc:"Warangal", soil:"Red",   wsrc:"Borewell", farm:"Green Acres"   },
];
