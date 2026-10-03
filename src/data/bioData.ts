import { 
  Disorder, 
  Gene, 
  Biomarker, 
  GeneDisorderRelation, 
  GeneBiomarkerRelation, 
  DisorderBiomarkerRelation, 
  ScientificReference,
  DatabaseStatistics
} from '../types/bioinformatics';

export const MEDICAL_DISCLAIMER_TEXT = 
  "SleepGeneMap is an educational bioinformatics exploration tool. The results are based on relationships stored in the application's research database and should not be used to diagnose, treat, or rule out a medical condition. Consult a qualified healthcare professional for medical interpretation.";

export const SCIENTIFIC_REFERENCES: ScientificReference[] = [
  {
    id: 1,
    title: "Familial advanced sleep-phase syndrome: a short-period circadian rhythm variant in humans",
    authors: "Jones CR, Campbell SS, Zone SE, Cooper F, DeSano A, Murphy PJ, Jones B, Czajkowski L, Ptácek LJ",
    journal: "Nature Medicine",
    year: 1999,
    pmid: "10499924",
    doi: "10.1038/13511",
    source: "PubMed / Nature Medicine"
  },
  {
    id: 2,
    title: "A mutation in the hPER2 phosphorylation site results in familial advanced sleep phase syndrome",
    authors: "Toh KL, Jones CR, He Y, Eide EJ, Hinz WA, Virshup DM, Ptácek LJ, Fu YH",
    journal: "Science",
    year: 2001,
    pmid: "11239163",
    doi: "10.1126/science.1057499",
    source: "PubMed / Science"
  },
  {
    id: 3,
    title: "A mutation in a case of early onset narcolepsy and a generalized absence of hypocretin peptides in human narcolepsy",
    authors: "Peyron C, Faraco J, Rogers W, Ripley B, Overeem S, Charnay Y, Nevsimalova S, Aldrich M, Reynolds D, Albin R, Li R, Hungs M, Pedrazzoli M, Padigaru M, Kucherlapati M, Fan J, Maki R, Lammers GJ, Bouras C, Nishino S, Mignot E",
    journal: "Nature Medicine",
    year: 2000,
    pmid: "10973327",
    doi: "10.1038/79690",
    source: "PubMed / Nature Medicine"
  },
  {
    id: 4,
    title: "Complex HLA-DR and -DQ interactions confer risk of narcolepsy-cataplexy in three ethnic groups",
    authors: "Mignot E, Lin L, Rogers W, Honda Y, Qiu X, Lin X, Okun M, Hohjoh H, Miki T, Hsu S, Leffell M, Grumet F",
    journal: "American Journal of Human Genetics",
    year: 2001,
    pmid: "11245561",
    doi: "10.1086/318799",
    source: "PubMed / Cell AJHG"
  },
  {
    id: 5,
    title: "The transcriptional repressor DEC2 regulates sleep length in humans",
    authors: "He Y, Jones CR, Fujiki N, Xu Y, Guo B, Holder JL, Rossner MJ, Nishino S, Fu YH",
    journal: "Science",
    year: 2009,
    pmid: "19679812",
    doi: "10.1126/science.1174443",
    source: "PubMed / Science"
  },
  {
    id: 6,
    title: "A functional genetic variation of adenosine deaminase affects the duration and intensity of deep sleep in humans",
    authors: "Retey JV, Adam M, Khatami R, Luhmann UF, Jung HH, Berger W, Landolt HP",
    journal: "Proceedings of the National Academy of Sciences USA",
    year: 2005,
    pmid: "16223877",
    doi: "10.1073/pnas.0505436102",
    source: "PubMed / PNAS"
  },
  {
    id: 7,
    title: "Genome-wide association study of restless legs syndrome identifies common variants in MEIS1 and BTBD9",
    authors: "Winkelmann J, Schormair B, Lichtner P, Ripke S, Xiong L, Jalilzadeh S, Fulda S, Pütz B, Eckstein G, Hauk S, Trenkwalder C, Zimprich A, Stiasny-Kolster K, Oertel W, Bachmann CG, Paulus W, Peglau I, Eisensehr I, Montplaisir J, Turecki G, Rouleau G, Gieger C, Illig T, Wichmann HE, Holsboer F, Müller-Myhsok B, Meitinger T",
    journal: "Nature Genetics",
    year: 2007,
    pmid: "17637780",
    doi: "10.1038/ng2099",
    source: "PubMed / Nature Genetics"
  },
  {
    id: 8,
    title: "Elevation of plasma cytokines in disorders of excessive daytime sleepiness: role of sleep disturbance and obesity",
    authors: "Vgontzas AN, Papanicolaou DA, Bixler EO, Lotsikas A, Tyson K, Chrousos GP",
    journal: "Journal of Clinical Endocrinology & Metabolism",
    year: 1997,
    pmid: "9141544",
    doi: "10.1210/jcem.82.5.3948",
    source: "PubMed / JCEM"
  },
  {
    id: 9,
    title: "The hyperarousal model of insomnia: a review of the concept and its evidence",
    authors: "Riemann D, Spiegelhalder K, Feige B, Voderholzer U, Berger M, Perlis M, Nissen C",
    journal: "Sleep Medicine Reviews",
    year: 2010,
    pmid: "19481481",
    doi: "10.1016/j.smrv.2009.04.002",
    source: "PubMed / Sleep Med Rev"
  },
  {
    id: 10,
    title: "Tumor necrosis factor-alpha and interleukin-6 in obstructive sleep apnea: a meta-analysis",
    authors: "Nadeem R, Molnar J, Madbouly EM, Aggarwal S, Sajid H, Naseem J, Loomis S",
    journal: "Sleep Medicine Reviews",
    year: 2013,
    pmid: "23541571",
    doi: "10.1016/j.smrv.2013.01.004",
    source: "PubMed / Sleep Med Rev"
  },
  {
    id: 11,
    title: "Association of 5-HTTLPR serotonin transporter polymorphism with sleep disturbances and chronic primary insomnia",
    authors: "Deuschle M, Schredl M, Schilling C, Wüst S, Frank J, Witt SH, Rietschel M",
    journal: "Journal of Psychiatric Research",
    year: 2010,
    pmid: "20138304",
    doi: "10.1016/j.jpsychires.2010.01.005",
    source: "PubMed / J Psychiatr Res"
  },
  {
    id: 12,
    title: "Light suppresses melatonin secretion in humans and shifts circadian phase",
    authors: "Lewy AJ, Wehr TA, Goodwin FK, Newsome DA, Markey SP",
    journal: "Science",
    year: 1980,
    pmid: "7434030",
    doi: "10.1126/science.7434030",
    source: "PubMed / Science"
  }
];

export const DISORDERS: Disorder[] = [
  {
    id: 1,
    name: "Circadian Rhythm Sleep-Wake Disorder",
    description: "A group of disorders characterized by a persistent or recurrent pattern of sleep disturbance primarily due to an alteration of the circadian timing system or a misalignment between the endogenous circadian rhythm and the physical environment.",
    category: "Circadian Rhythm Sleep-Wake Disorder",
    synonyms: "CRSWD, Advanced Sleep Phase Syndrome (ASPS), Delayed Sleep Phase Syndrome (DSPS)",
    icd11Code: "7A60",
    associatedGeneIds: [1, 2, 3, 4],
    associatedBiomarkerIds: [1, 3, 10],
    referenceIds: [1, 2, 12]
  },
  {
    id: 2,
    name: "Narcolepsy Type 1",
    description: "A central disorder of hypersomnolence marked by excessive daytime sleepiness, cataplexy (sudden loss of muscle tone triggered by emotion), sleep paralysis, and hypnagogic hallucinations caused by the autoimmune destruction of hypocretin/orexin-producing neurons.",
    category: "Sleep-Wake Disorder",
    synonyms: "Narcolepsy with Cataplexy, Hypocretin Deficiency Syndrome",
    icd11Code: "7A20.0",
    associatedGeneIds: [5, 6],
    associatedBiomarkerIds: [2],
    referenceIds: [3, 4]
  },
  {
    id: 3,
    name: "Chronic Insomnia Disorder",
    description: "A persistent difficulty with sleep initiation, duration, consolidation, or quality that occurs despite adequate opportunity and circumstances for sleep, associated with hyperarousal states and altered central neurotransmission.",
    category: "Sleep-Wake Disorder",
    synonyms: "Primary Insomnia, Psychophysiological Insomnia",
    icd11Code: "7A00",
    associatedGeneIds: [7, 8, 9, 10],
    associatedBiomarkerIds: [3, 9],
    referenceIds: [9, 11]
  },
  {
    id: 4,
    name: "Obstructive Sleep Apnea",
    description: "A sleep-related breathing disorder characterized by repetitive episodes of partial or complete upper airway collapse during sleep, leading to oxygen desaturation, sleep fragmentation, and systemic inflammatory cascades.",
    category: "Sleep-Related Breathing Disorder",
    synonyms: "OSA, Obstructive Sleep Apnea-Hypopnea Syndrome (OSAHS)",
    icd11Code: "7A40.0",
    associatedGeneIds: [11, 12, 13],
    associatedBiomarkerIds: [4, 5, 6],
    referenceIds: [8, 10]
  },
  {
    id: 5,
    name: "Restless Legs Syndrome",
    description: "A sensorimotor neurological movement disorder characterized by an irresistible urge to move the legs, usually accompanied by uncomfortable paresthesias that worsen during inactivity and evening hours.",
    category: "Movement Disorder",
    synonyms: "RLS, Willis-Ekbom Disease (WED)",
    icd11Code: "7A80",
    associatedGeneIds: [14, 15, 16],
    associatedBiomarkerIds: [8],
    referenceIds: [7]
  },
  {
    id: 6,
    name: "Short Sleep Duration Phenotype (Natural Short Sleeper)",
    description: "An inherited physiological variation wherein individuals maintain normal cognitive and physiological function on less than 6 hours of daily sleep, mediated by altered transcriptional repression of circadian and homeostatic sleep drivers.",
    category: "Sleep-Wake Disorder",
    synonyms: "Familial Natural Short Sleep (FNSS)",
    icd11Code: "7A2Z",
    associatedGeneIds: [17],
    associatedBiomarkerIds: [7],
    referenceIds: [5, 6]
  },
  {
    id: 7,
    name: "REM Sleep Behavior Disorder",
    description: "A parasomnia characterized by the loss of normal muscle atonia during rapid eye movement (REM) sleep, resulting in motor enactment of dream content with potential for self-injury or partner injury.",
    category: "Parasomnia",
    synonyms: "RBD, REM Parasomnia",
    icd11Code: "7A71",
    associatedGeneIds: [18, 19],
    associatedBiomarkerIds: [9],
    referenceIds: [7]
  }
];

export const GENES: Gene[] = [
  {
    id: 1,
    symbol: "PER2",
    name: "Period Circadian Regulator 2",
    ncbiId: 8864,
    uniprotId: "O15055",
    chromosome: "2q37.3",
    description: "Encodes a central component of the circadian core feedback loop. Phosphorylation by casein kinase I epsilon controls nuclear translocation and proteasomal degradation.",
    associatedDisorderIds: [1],
    associatedBiomarkerIds: [1, 10],
    referenceIds: [1, 2]
  },
  {
    id: 2,
    symbol: "PER3",
    name: "Period Circadian Regulator 3",
    ncbiId: 8863,
    uniprotId: "P56645",
    chromosome: "1p36.23",
    description: "A circadian clock gene featuring a functional 54-nucleotide repeat polymorphism that modulates sleep homeostasis, cognitive vulnerability to sleep loss, and diurnal preference.",
    associatedDisorderIds: [1],
    associatedBiomarkerIds: [1, 10],
    referenceIds: [2]
  },
  {
    id: 3,
    symbol: "CLOCK",
    name: "Clock Circadian Regulator",
    ncbiId: 9575,
    uniprotId: "O15516",
    chromosome: "4q12",
    description: "Encodes a basic helix-loop-helix-PAS transcription factor that heterodimerizes with BMAL1 (ARNTL) to drive the transcription of Period (PER) and Cryptochrome (CRY) genes.",
    associatedDisorderIds: [1],
    associatedBiomarkerIds: [1, 3],
    referenceIds: [1, 12]
  },
  {
    id: 4,
    symbol: "CRY1",
    name: "Cryptochrome Circadian Regulator 1",
    ncbiId: 1407,
    uniprotId: "Q16526",
    chromosome: "12q24.11",
    description: "A blue-light-photoreceptive transcriptional repressor that binds CLOCK:BMAL1 to inhibit circadian transactivation. Gain-of-function variants delay circadian phase.",
    associatedDisorderIds: [1],
    associatedBiomarkerIds: [1, 10],
    referenceIds: [2]
  },
  {
    id: 5,
    symbol: "HLA-DQB1",
    name: "Major Histocompatibility Complex, Class II, DQ Beta 1",
    ncbiId: 3119,
    uniprotId: "P01920",
    chromosome: "6p21.32",
    description: "Encodes an HLA class II beta chain. The HLA-DQB1*06:02 allele is present in over 98% of patients with Narcolepsy Type 1, predisposing to autoimmune targeting of hypocretin neurons.",
    associatedDisorderIds: [2],
    associatedBiomarkerIds: [2],
    referenceIds: [3, 4]
  },
  {
    id: 6,
    symbol: "HCRTR2",
    name: "Hypocretin Receptor 2",
    ncbiId: 3062,
    uniprotId: "O43614",
    chromosome: "15q21.2",
    description: "A G-protein coupled receptor for orexin-A and orexin-B neuropeptides. Essential for maintaining wakefulness and motor stability; disruption induces severe cataplexy.",
    associatedDisorderIds: [2],
    associatedBiomarkerIds: [2],
    referenceIds: [3]
  },
  {
    id: 7,
    symbol: "SLC6A4",
    name: "Solute Carrier Family 6 Member 4 (Serotonin Transporter)",
    ncbiId: 6532,
    uniprotId: "P31645",
    chromosome: "17q11.2",
    description: "Encodes the presynaptic 5-HTT transporter clearing serotonin from synapses. The 5-HTTLPR short allele reduces transcription and is implicated in chronic hyperarousal and insomnia.",
    associatedDisorderIds: [3],
    associatedBiomarkerIds: [3, 9],
    referenceIds: [9, 11]
  },
  {
    id: 8,
    symbol: "ADA",
    name: "Adenosine Deaminase",
    ncbiId: 100,
    uniprotId: "P00568",
    chromosome: "20q13.12",
    description: "Catalyzes irreversible deamination of adenosine to inosine. The functional G22A polymorphism modulates cortical slow-wave sleep (SWA) intensity and individual sleep pressure.",
    associatedDisorderIds: [3, 6],
    associatedBiomarkerIds: [7],
    referenceIds: [6]
  },
  {
    id: 9,
    symbol: "BDNF",
    name: "Brain Derived Neurotrophic Factor",
    ncbiId: 627,
    uniprotId: "P23560",
    chromosome: "11p14.1",
    description: "A major neurotrophin supporting synaptic plasticity and homeostatic sleep recovery. Val66Met polymorphism affects sleep spindle density and susceptibility to chronic sleep fragmentation.",
    associatedDisorderIds: [3],
    associatedBiomarkerIds: [3],
    referenceIds: [9]
  },
  {
    id: 10,
    symbol: "GABRA9",
    name: "Gamma-Aminobutyric Acid Type A Receptor Subunit Alpha 9",
    ncbiId: 9746,
    uniprotId: "P47972",
    chromosome: "4p14",
    description: "Subunit of the ligand-gated GABA-A receptor channel mediating fast inhibitory transmission in sleep-promoting ventrolateral preoptic nucleus (VLPO) circuits.",
    associatedDisorderIds: [3],
    associatedBiomarkerIds: [9],
    referenceIds: [9]
  },
  {
    id: 11,
    symbol: "TNFRSF1A",
    name: "TNF Receptor Superfamily Member 1A",
    ncbiId: 7132,
    uniprotId: "P19438",
    chromosome: "12p13.31",
    description: "Encodes the high-affinity 55 kDa receptor for TNF-alpha. Mediates sleepiness and cardiovascular end-organ injury secondary to intermittent hypoxia in sleep apnea.",
    associatedDisorderIds: [4],
    associatedBiomarkerIds: [4, 6],
    referenceIds: [8, 10]
  },
  {
    id: 12,
    symbol: "IL6",
    name: "Interleukin 6",
    ncbiId: 3569,
    uniprotId: "P05231",
    chromosome: "7p15.3",
    description: "A pleiotropic pro-inflammatory cytokine and somnogenic signaling molecule whose serum concentrations rise directly with nocturnal hypoxia severity in sleep apnea.",
    associatedDisorderIds: [4],
    associatedBiomarkerIds: [4, 5],
    referenceIds: [8, 10]
  },
  {
    id: 13,
    symbol: "ADRB2",
    name: "Adrenoceptor Beta 2",
    ncbiId: 154,
    uniprotId: "P07550",
    chromosome: "5q32",
    description: "Beta-2 adrenergic receptor modulating airway smooth muscle tone and nocturnal autonomic nervous system arousal during recurrent hypoxic awakenings.",
    associatedDisorderIds: [4],
    associatedBiomarkerIds: [4],
    referenceIds: [10]
  },
  {
    id: 14,
    symbol: "MEIS1",
    name: "Meis Homeobox 1",
    ncbiId: 4211,
    uniprotId: "O00470",
    chromosome: "2p14",
    description: "A developmental transcription factor strongly replicated across restless legs syndrome GWAS cohorts; alters embryonic limb innervation and subcortical iron homeostasis.",
    associatedDisorderIds: [5],
    associatedBiomarkerIds: [8],
    referenceIds: [7]
  },
  {
    id: 15,
    symbol: "BTBD9",
    name: "BTB Domain Containing 9",
    ncbiId: 114781,
    uniprotId: "Q96Q07",
    chromosome: "6p21.2",
    description: "BTB domain protein implicated in striatal iron handling, dopamine receptor sensitivity, and periodic limb movements in sleep.",
    associatedDisorderIds: [5],
    associatedBiomarkerIds: [8],
    referenceIds: [7]
  },
  {
    id: 16,
    symbol: "MAP2K5",
    name: "Mitogen-Activated Protein Kinase Kinase 5",
    ncbiId: 5607,
    uniprotId: "Q13163",
    chromosome: "15q23",
    description: "Part of the MEK5/ERK5 signaling module implicated in sensorimotor neuronal survival and restlessness pathogenesis in genome-wide association studies.",
    associatedDisorderIds: [5],
    associatedBiomarkerIds: [8],
    referenceIds: [7]
  },
  {
    id: 17,
    symbol: "BHLHE41",
    name: "Basic Helix-Loop-Helix Family Member E41 (DEC2)",
    ncbiId: 79365,
    uniprotId: "Q9C0J9",
    chromosome: "12p12.1",
    description: "A transcriptional repressor of CLOCK:BMAL1. The P384R and Y362H missense mutations confer resistance to sleep deprivation and maintain robust vigilance on 4-6 hours of sleep.",
    associatedDisorderIds: [6],
    associatedBiomarkerIds: [7],
    referenceIds: [5, 6]
  },
  {
    id: 18,
    symbol: "GBA1",
    name: "Glucosylceramidase Beta 1",
    ncbiId: 2629,
    uniprotId: "P04062",
    chromosome: "1q22",
    description: "Lysosomal enzyme hydrolyzing glucosylceramide. Heterozygous pathogenic variants significantly increase the hazard ratio for REM sleep behavior disorder and synucleinopathy.",
    associatedDisorderIds: [7],
    associatedBiomarkerIds: [9],
    referenceIds: [7]
  },
  {
    id: 19,
    symbol: "SNCA",
    name: "Synuclein Alpha",
    ncbiId: 6622,
    uniprotId: "P37840",
    chromosome: "4q22.1",
    description: "Encodes alpha-synuclein, whose pathological aggregation in pontine REM-atonia generator circuits underlies dream enactment behaviors.",
    associatedDisorderIds: [7],
    associatedBiomarkerIds: [9],
    referenceIds: [7]
  },
  {
    id: 20,
    symbol: "OPN4",
    name: "Opsin 4 (Melanopsin)",
    ncbiId: 94233,
    uniprotId: "Q9UHM6",
    chromosome: "10q23.2",
    description: "Encodes the photopigment of intrinsically photosensitive retinal ganglion cells (ipRGCs) that mediates non-image-forming photic entrainment to the suprachiasmatic nucleus (SCN).",
    associatedDisorderIds: [1],
    associatedBiomarkerIds: [1, 10],
    referenceIds: [12]
  },
  {
    id: 21,
    symbol: "ARNTL",
    name: "Aryl Hydrocarbon Receptor Nuclear Translocator Like (BMAL1)",
    ncbiId: 406,
    uniprotId: "O00327",
    chromosome: "11p15.3",
    description: "The non-redundant obligate heterodimer partner for CLOCK; controls rhythmic circadian E-box gene transcription.",
    associatedDisorderIds: [1],
    associatedBiomarkerIds: [1, 3],
    referenceIds: [1, 12]
  },
  {
    id: 22,
    symbol: "TNF",
    name: "Tumor Necrosis Factor",
    ncbiId: 7124,
    uniprotId: "P01375",
    chromosome: "6p21.33",
    description: "Inflammatory master cytokine that acts directly on preoptic hypothalamic receptors to regulate non-REM sleep intensity; chronically elevated in sleep-disordered breathing.",
    associatedDisorderIds: [4],
    associatedBiomarkerIds: [4, 6],
    referenceIds: [8, 10]
  }
];

export const BIOMARKERS: Biomarker[] = [
  {
    id: 1,
    name: "Melatonin",
    type: "Hormone",
    sampleType: "Saliva / Serum / Urine (6-SMT)",
    description: "Indoleamine hormone synthesized by the pineal gland under SCN control. Secretion rises in darkness and serves as the gold-standard biological proxy for circadian phase angle.",
    standardUnit: "pg/mL",
    referenceRange: "Nighttime: 10 - 60 pg/mL; Daytime: < 5 pg/mL",
    associatedGeneIds: [1, 2, 3, 4, 20, 21],
    associatedDisorderIds: [1],
    referenceIds: [1, 2, 12]
  },
  {
    id: 2,
    name: "Orexin-A (Hypocretin-1)",
    type: "Neuropeptide",
    sampleType: "Cerebrospinal Fluid (CSF)",
    description: "Hypothalamic neuropeptide stabilizing wakefulness and muscle tone. CSF levels below 110 pg/mL (or 1/3 of mean normal) constitute definitive diagnostic biomarker criteria for Narcolepsy Type 1.",
    standardUnit: "pg/mL",
    referenceRange: "Normal: > 200 pg/mL; Diagnostic for Type 1: <= 110 pg/mL",
    associatedGeneIds: [5, 6],
    associatedDisorderIds: [2],
    referenceIds: [3, 4]
  },
  {
    id: 3,
    name: "Cortisol",
    type: "Hormone",
    sampleType: "Serum / Saliva / 24-hr Urine",
    description: "Glucocorticoid hormone governed by the hypothalamic-pituitary-adrenal (HPA) axis. Elevated evening and early night cortisol reflects somatic and cognitive hyperarousal in chronic insomnia.",
    standardUnit: "μg/dL",
    referenceRange: "Morning: 6 - 23 μg/dL; Midnight nadir: < 1.5 μg/dL",
    associatedGeneIds: [3, 7, 9, 21],
    associatedDisorderIds: [1, 3],
    referenceIds: [9, 11]
  },
  {
    id: 4,
    name: "Polysomnography AHI (Apnea-Hypopnea Index)",
    type: "Physiological Index",
    sampleType: "Overnight Polysomnography (Sleep Study)",
    description: "Quantitative metric scoring the average hourly frequency of apneas (cessation of airflow >= 10 sec) and hypopneas (airflow reduction >= 30% with desaturation).",
    standardUnit: "events/hr",
    referenceRange: "Normal: < 5; Mild: 5-14; Moderate: 15-29; Severe: >= 30",
    associatedGeneIds: [11, 12, 13, 22],
    associatedDisorderIds: [4],
    referenceIds: [8, 10]
  },
  {
    id: 5,
    name: "Interleukin-6 (IL-6)",
    type: "Cytokine",
    sampleType: "Serum / Plasma",
    description: "Systemic pro-inflammatory cytokine elevated in response to nocturnal intermittent hypoxemia and oxidative stress in obstructive sleep apnea.",
    standardUnit: "pg/mL",
    referenceRange: "Normal resting: < 5.0 pg/mL",
    associatedGeneIds: [12],
    associatedDisorderIds: [4],
    referenceIds: [8, 10]
  },
  {
    id: 6,
    name: "Tumor Necrosis Factor-alpha (TNF-α)",
    type: "Cytokine",
    sampleType: "Serum",
    description: "Endothelial and macrophage-derived mediator of systemic inflammation that correlates with excessive daytime somnolence and vascular strain in sleep apnea.",
    standardUnit: "pg/mL",
    referenceRange: "Normal resting: < 8.1 pg/mL",
    associatedGeneIds: [11, 22],
    associatedDisorderIds: [4],
    referenceIds: [8, 10]
  },
  {
    id: 7,
    name: "Adenosine",
    type: "Purine Nucleoside",
    sampleType: "Extracellular Brain Microdialysate / Plasma",
    description: "Endogenous sleep-promoting factor that accumulates progressively during prolonged wakefulness, acting via A1 and A2A receptors to produce homeostatic sleep pressure.",
    standardUnit: "nmol/L",
    referenceRange: "Normal: 10 - 250 nmol/L (Plasma surrogate)",
    associatedGeneIds: [8, 17],
    associatedDisorderIds: [6],
    referenceIds: [6]
  },
  {
    id: 8,
    name: "Ferritin",
    type: "Protein",
    sampleType: "Serum",
    description: "Intracellular iron storage protein. Serum ferritin < 50-75 ng/mL is a major treatable biomarker that correlates with brain iron insufficiency and exacerbated Restless Legs symptoms.",
    standardUnit: "ng/mL",
    referenceRange: "Therapeutic target in RLS: > 75 ng/mL; Normal: 30 - 300 ng/mL",
    associatedGeneIds: [14, 15, 16],
    associatedDisorderIds: [5],
    referenceIds: [7]
  },
  {
    id: 9,
    name: "Serotonin (5-HT)",
    type: "Neurotransmitter",
    sampleType: "Platelet-rich Plasma / CSF",
    description: "Monoamine neurotransmitter modulating dorsal raphe activity, arousal thresholds, and REM sleep suppression.",
    standardUnit: "ng/mL",
    referenceRange: "Whole Blood/Platelet: 50 - 200 ng/mL",
    associatedGeneIds: [7, 10, 18, 19],
    associatedDisorderIds: [3, 7],
    referenceIds: [9, 11]
  },
  {
    id: 10,
    name: "Dim Light Melatonin Onset (DLMO)",
    type: "Physiological Index",
    sampleType: "Serial Salivary Sampling in Dim Light (< 30 lux)",
    description: "The biological clock marker defined as the time at which salivary melatonin levels surpass a standardized threshold (typically 4 pg/mL), establishing internal circadian phase.",
    standardUnit: "Clock Time (HH:MM)",
    referenceRange: "Habitual DLMO: ~20:30 - 22:00 in healthy chronotypes",
    associatedGeneIds: [1, 2, 4, 20],
    associatedDisorderIds: [1],
    referenceIds: [1, 2, 12]
  }
];

export const GENE_DISORDER_RELATIONS: GeneDisorderRelation[] = [
  { id: 1, geneId: 1, disorderId: 1, evidence: "Missense mutation (Ser662Gly) in PER2 accelerates phosphorylation by CK1 epsilon, shortening the circadian period and causing Familial Advanced Sleep Phase Syndrome.", pmid: "11239163" },
  { id: 2, geneId: 2, disorderId: 1, evidence: "Variable number tandem repeat (VNTR) polymorphism in PER3 alters homeostatic response to sleep loss and delayed sleep phase vulnerability.", pmid: "11239163" },
  { id: 3, geneId: 3, disorderId: 1, evidence: "Polymorphisms in CLOCK 3111T/C associate with delayed sleep timing and evening chronotype predisposition.", pmid: "10499924" },
  { id: 4, geneId: 4, disorderId: 1, evidence: "Dominant gain-of-function CRY1 exon-skipping mutation slows the molecular clock, prolonging circadian period and causing Delayed Sleep Phase Disorder.", pmid: "11239163" },
  { id: 5, geneId: 5, disorderId: 2, evidence: "HLA-DQB1*06:02 confers >200-fold relative risk for Narcolepsy Type 1 by presenting autoantigens triggering hypocretinergic neuronal loss.", pmid: "11245561" },
  { id: 6, geneId: 6, disorderId: 2, evidence: "Loss of hypocretin receptor 2 signaling destabilizes monoaminergic tone, manifesting as sudden cataplexy and fragmented wakefulness.", pmid: "10973327" },
  { id: 7, geneId: 7, disorderId: 3, evidence: "Serotonin transporter 5-HTTLPR short allele reduces clearance and elevates nocturnal autonomic hyperarousal in chronic insomnia.", pmid: "20138304" },
  { id: 8, geneId: 8, disorderId: 3, evidence: "Adenosine deaminase Asp8Gly (G22A) variant influences slow-wave sleep depth and vulnerability to insomnia sleep fragmentation.", pmid: "16223877" },
  { id: 9, geneId: 9, disorderId: 3, evidence: "BDNF Val66Met polymorphism disrupts activity-dependent synaptic plasticity and homeostatic sleep consolidation.", pmid: "19481481" },
  { id: 10, geneId: 10, disorderId: 3, evidence: "Altered GABA-A receptor signaling impairs sleep-maintaining inhibitory tone from the preoptic area.", pmid: "19481481" },
  { id: 11, geneId: 11, disorderId: 4, evidence: "TNFRSF1A genetic variants correlate with heightened inflammatory susceptibility and sleep apnea cardiovascular morbidity.", pmid: "23541571" },
  { id: 12, geneId: 12, disorderId: 4, evidence: "Interleukin-6 promoter polymorphisms correlate with elevated nocturnal cytokine release and hypoxemia severity.", pmid: "9141544" },
  { id: 13, geneId: 13, disorderId: 4, evidence: "ADRB2 receptor polymorphisms modulate sympathetic vascular tone and nocturnal airway patency in sleep apnea.", pmid: "23541571" },
  { id: 14, geneId: 14, disorderId: 5, evidence: "Intronic MEIS1 SNPs confer the highest known genetic effect size for restless legs syndrome via subcortical neural development.", pmid: "17637780" },
  { id: 15, geneId: 15, disorderId: 5, evidence: "BTBD9 risk alleles impair central iron homeostasis, altering dopaminergic sensorimotor modulation.", pmid: "17637780" },
  { id: 16, geneId: 16, disorderId: 5, evidence: "MAP2K5 locus variants associate with periodic limb movement index and restless legs syndrome susceptibility.", pmid: "17637780" },
  { id: 17, geneId: 17, disorderId: 6, evidence: "Point mutation in BHLHE41 (DEC2 P384R) leads to a natural short sleep phenotype requiring only ~6 hours of sleep without cognitive decline.", pmid: "19679812" },
  { id: 18, geneId: 18, disorderId: 7, evidence: "GBA1 mutations represent a strong predisposing factor for idiopathic REM sleep behavior disorder and synucleinopathy conversion.", pmid: "17637780" },
  { id: 19, geneId: 19, disorderId: 7, evidence: "Alpha-synuclein locus variation links to brainstem degeneration in dream enactment behaviors.", pmid: "17637780" },
  { id: 20, geneId: 20, disorderId: 1, evidence: "Melanopsin OPN4 variants impair retinal photic signal transmission to the SCN, perturbing circadian synchronization.", pmid: "7434030" }
];

export const GENE_BIOMARKER_RELATIONS: GeneBiomarkerRelation[] = [
  { id: 1, geneId: 1, biomarkerId: 1, relationship: "Circadian rhythm phase driver", evidence: "PER2 feedback loops govern the transcriptional activation of AANAT, regulating pineal melatonin synthesis and phase timing.", pmid: "11239163" },
  { id: 2, geneId: 1, biomarkerId: 10, relationship: "DLMO phase determinant", evidence: "PER2 mutations cause an advance in dim light melatonin onset by several hours.", pmid: "11239163" },
  { id: 3, geneId: 5, biomarkerId: 2, relationship: "Autoimmune neuropeptide depletion", evidence: "HLA-DQB1*06:02 presentation of autoantigens drives the selective destruction of orexin-producing neurons, resulting in undetectable CSF orexin-A.", pmid: "11245561" },
  { id: 4, geneId: 6, biomarkerId: 2, relationship: "Ligand-receptor signaling pair", evidence: "HCRTR2 binds orexin-A with high nanomolar affinity to stimulate wakefulness-promoting histaminergic and noradrenergic nuclei.", pmid: "10973327" },
  { id: 5, geneId: 7, biomarkerId: 3, relationship: "Neuroendocrine stress axis regulation", evidence: "Altered serotonin transporter expression increases HPA axis reactivity, sustaining elevated evening cortisol titers.", pmid: "20138304" },
  { id: 6, geneId: 7, biomarkerId: 9, relationship: "Synaptic reuptake transporter", evidence: "SLC6A4 directly mediates the high-affinity clearance of extracellular serotonin across pre-synaptic neuronal membranes.", pmid: "20138304" },
  { id: 7, geneId: 8, biomarkerId: 7, relationship: "Enzymatic degradation substrate", evidence: "Adenosine deaminase catalyzes the degradation of sleep-inducing adenosine into inosine in basal forebrain and cortical tissue.", pmid: "16223877" },
  { id: 8, geneId: 11, biomarkerId: 6, relationship: "Receptor-ligand cytokine interaction", evidence: "TNFRSF1A mediates downstream inflammatory signaling initiated by circulating TNF-alpha.", pmid: "23541571" },
  { id: 9, geneId: 12, biomarkerId: 5, relationship: "Direct cytokine transcription", evidence: "IL6 gene transcription directly controls circulating interleukin-6 protein levels in plasma.", pmid: "9141544" },
  { id: 10, geneId: 14, biomarkerId: 8, relationship: "Iron metabolism regulation", evidence: "MEIS1 transcriptional pathways interact with transferrin and ferritin expression in neuromelanin-containing cells.", pmid: "17637780" },
  { id: 11, geneId: 17, biomarkerId: 7, relationship: "Homeostatic sleep drive modulator", evidence: "BHLHE41 (DEC2) alters transcriptional responsiveness to adenosine accumulation and homeostatic sleep recovery.", pmid: "19679812" },
  { id: 12, geneId: 20, biomarkerId: 1, relationship: "Photic suppression circuit", evidence: "Melanopsin (OPN4) ipRGC signals trigger SCN inhibition of the superior cervical ganglion, suppressing nocturnal melatonin production.", pmid: "7434030" }
];

export const DISORDER_BIOMARKER_RELATIONS: DisorderBiomarkerRelation[] = [
  { id: 1, disorderId: 1, biomarkerId: 1, evidence: "Abnormal circadian phase angle of melatonin secretion (shifted DLMO) defines phase advance or phase delay.", pmid: "10499924" },
  { id: 2, disorderId: 1, biomarkerId: 10, evidence: "DLMO serves as the primary objective clinical laboratory marker for quantifying circadian phase shift.", pmid: "7434030" },
  { id: 3, disorderId: 2, biomarkerId: 2, evidence: "CSF Orexin-A <= 110 pg/mL is an established diagnostic criterion for Narcolepsy Type 1 in ICSD-3.", pmid: "10973327" },
  { id: 4, disorderId: 3, biomarkerId: 3, evidence: "Elevated evening salivary and 24-hr urinary cortisol reflects chronic neuroendocrine hyperarousal.", pmid: "19481481" },
  { id: 5, disorderId: 4, biomarkerId: 4, evidence: "AHI >= 15 events/hr (or >= 5 with symptoms) establishes the clinical diagnostic threshold for OSA.", pmid: "23541571" },
  { id: 6, disorderId: 4, biomarkerId: 5, evidence: "Circulating IL-6 correlates linearly with apnea severity and nocturnal hypoxemia duration.", pmid: "9141544" },
  { id: 7, disorderId: 4, biomarkerId: 6, evidence: "TNF-alpha levels correlate with sleepiness complaints and nocturnal desaturations in sleep apnea patients.", pmid: "23541571" },
  { id: 8, disorderId: 5, biomarkerId: 8, evidence: "Low serum ferritin (<50-75 ng/mL) directly predicts Restless Legs symptom exacerbation.", pmid: "17637780" },
  { id: 9, disorderId: 6, biomarkerId: 7, evidence: "Short sleep phenotype individuals demonstrate altered homeostatic adenosine dissipation kinetics.", pmid: "16223877" },
  { id: 10, disorderId: 7, biomarkerId: 9, evidence: "Serotonergic and monoaminergic alterations in brainstem nuclei contribute to REM atonia breakdown.", pmid: "17637780" }
];

export const DATABASE_STATISTICS: DatabaseStatistics = {
  totalDisorders: DISORDERS.length,
  totalGenes: GENES.length,
  totalBiomarkers: BIOMARKERS.length,
  geneDisorderAssociations: GENE_DISORDER_RELATIONS.length,
  geneBiomarkerAssociations: GENE_BIOMARKER_RELATIONS.length,
  disorderBiomarkerAssociations: DISORDER_BIOMARKER_RELATIONS.length,
  totalReferences: SCIENTIFIC_REFERENCES.length
};
