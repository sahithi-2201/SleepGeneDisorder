-- =====================================================================
-- SleepGeneMap Starter Dataset Seed Script
-- Database: sleepgenemap
-- =====================================================================

USE sleepgenemap;

-- 1. Insert Scientific Literature References
INSERT INTO scientific_references (id, title, authors, journal, publication_year, pmid, doi, source) VALUES
(1, 'Familial advanced sleep-phase syndrome: a short-period circadian rhythm variant in humans', 'Jones CR, Campbell SS, et al.', 'Nature Medicine', 1999, '10499924', '10.1038/13511', 'PubMed'),
(2, 'A mutation in the hPER2 phosphorylation site results in familial advanced sleep phase syndrome', 'Toh KL, Jones CR, He Y, Ptacek LJ, Fu YH, et al.', 'Science', 2001, '11239163', '10.1126/science.1057499', 'PubMed'),
(3, 'A mutation in early onset narcolepsy and generalized absence of hypocretin peptides', 'Peyron C, Faraco J, Nishino S, Mignot E, et al.', 'Nature Medicine', 2000, '10973327', '10.1038/79690', 'PubMed'),
(4, 'Complex HLA-DR and -DQ interactions confer risk of narcolepsy-cataplexy', 'Mignot E, Lin L, Rogers W, Honda Y, et al.', 'American Journal of Human Genetics', 2001, '11245561', '10.1086/318799', 'PubMed'),
(5, 'The transcriptional repressor DEC2 regulates sleep length in humans', 'He Y, Jones CR, Fujiki N, Nishino S, Fu YH, et al.', 'Science', 2009, '19679812', '10.1126/science.1174443', 'PubMed'),
(6, 'Functional genetic variation of adenosine deaminase affects duration and intensity of deep sleep', 'Retey JV, Adam M, Khatami R, Landolt HP, et al.', 'PNAS USA', 2005, '16223877', '10.1073/pnas.0505436102', 'PubMed'),
(7, 'Genome-wide association study of restless legs syndrome identifies common variants in MEIS1 and BTBD9', 'Winkelmann J, Schormair B, Lichtner P, et al.', 'Nature Genetics', 2007, '17637780', '10.1038/ng2099', 'PubMed'),
(8, 'Elevation of plasma cytokines in disorders of excessive daytime sleepiness', 'Vgontzas AN, Papanicolaou DA, Bixler EO, et al.', 'JCEM', 1997, '9141544', '10.1210/jcem.82.5.3948', 'PubMed'),
(9, 'The hyperarousal model of insomnia: a review of the concept and its evidence', 'Riemann D, Spiegelhalder K, Feige B, et al.', 'Sleep Medicine Reviews', 2010, '19481481', '10.1016/j.smrv.2009.04.002', 'PubMed'),
(10, 'Tumor necrosis factor-alpha and interleukin-6 in obstructive sleep apnea: a meta-analysis', 'Nadeem R, Molnar J, Madbouly EM, et al.', 'Sleep Medicine Reviews', 2013, '23541571', '10.1016/j.smrv.2013.01.004', 'PubMed'),
(11, 'Association of 5-HTTLPR serotonin transporter polymorphism with chronic primary insomnia', 'Deuschle M, Schredl M, Schilling C, et al.', 'Journal of Psychiatric Research', 2010, '20138304', '10.1016/j.jpsychires.2010.01.005', 'PubMed'),
(12, 'Light suppresses melatonin secretion in humans and shifts circadian phase', 'Lewy AJ, Wehr TA, Goodwin FK, Markey SP', 'Science', 1980, '7434030', '10.1126/science.7434030', 'PubMed');

-- 2. Insert Disorders
INSERT INTO disorders (id, name, description, category, synonyms, icd11_code) VALUES
(1, 'Circadian Rhythm Sleep-Wake Disorder', 'Persistent sleep disruption due to alteration of the endogenous circadian timing system or misalignment with environmental 24-hr cycle.', 'Circadian Rhythm Sleep-Wake Disorder', 'CRSWD, Advanced Sleep Phase Syndrome (ASPS), Delayed Sleep Phase Syndrome (DSPS)', '7A60'),
(2, 'Narcolepsy Type 1', 'Central disorder of hypersomnolence marked by excessive daytime sleepiness, cataplexy, and autoimmune loss of hypocretin/orexin neurons.', 'Sleep-Wake Disorder', 'Narcolepsy with Cataplexy, Hypocretin Deficiency Syndrome', '7A20.0'),
(3, 'Chronic Insomnia Disorder', 'Persistent difficulty with sleep initiation, duration, or quality despite adequate opportunity, marked by nocturnal hyperarousal.', 'Sleep-Wake Disorder', 'Primary Insomnia, Psychophysiological Insomnia', '7A00'),
(4, 'Obstructive Sleep Apnea', 'Repetitive episodes of partial or complete upper airway collapse during sleep, triggering intermittent hypoxemia and inflammatory cytokine cascades.', 'Sleep-Related Breathing Disorder', 'OSA, Obstructive Sleep Apnea-Hypopnea Syndrome', '7A40.0'),
(5, 'Restless Legs Syndrome', 'Sensorimotor neurological movement disorder characterized by an irresistible urge to move legs, worsening during evening inactivity.', 'Movement Disorder', 'RLS, Willis-Ekbom Disease (WED)', '7A80'),
(6, 'Short Sleep Duration Phenotype (Natural Short Sleeper)', 'Inherited physiological trait maintaining normal cognition on <6 hours of daily sleep via altered circadian transcriptional repression.', 'Sleep-Wake Disorder', 'Familial Natural Short Sleep (FNSS)', '7A2Z'),
(7, 'REM Sleep Behavior Disorder', 'Parasomnia characterized by loss of normal muscle atonia during REM sleep, resulting in dream-enactment motor behaviors.', 'Parasomnia', 'RBD, REM Parasomnia', '7A71');

-- 3. Insert Genes
INSERT INTO genes (id, symbol, name, ncbi_id, uniprot_id, chromosome, description) VALUES
(1, 'PER2', 'Period Circadian Regulator 2', 8864, 'O15055', '2q37.3', 'Core circadian transcription feedback loop component; Ser662Gly mutation accelerates CK1 phosphorylation, causing FASPS.'),
(2, 'PER3', 'Period Circadian Regulator 3', 8863, 'P56645', '1p36.23', 'Circadian clock gene with functional 54-bp VNTR polymorphism modulating homeostatic response to sleep loss.'),
(3, 'CLOCK', 'Clock Circadian Regulator', 9575, 'O15516', '4q12', 'Basic helix-loop-helix-PAS transcription factor driving Period and Cryptochrome expression; 3111T/C polymorphism affects diurnal timing.'),
(4, 'CRY1', 'Cryptochrome Circadian Regulator 1', 1407, 'Q16526', '12q24.11', 'Transcriptional repressor; exon-skipping gain-of-function variant lengthens circadian period, causing Delayed Sleep Phase Syndrome.'),
(5, 'HLA-DQB1', 'Major Histocompatibility Complex, Class II, DQ Beta 1', 3119, 'P01920', '6p21.32', 'HLA class II beta chain; HLA-DQB1*06:02 allele is present in >98% of Narcolepsy Type 1 patients, conferring autoimmune susceptibility.'),
(6, 'HCRTR2', 'Hypocretin Receptor 2', 3062, 'O43614', '15q21.2', 'G-protein coupled receptor for orexin neuropeptides; regulates wakefulness and motor control; disruption triggers severe cataplexy.'),
(7, 'SLC6A4', 'Solute Carrier Family 6 Member 4 (5-HTT)', 6532, 'P31645', '17q11.2', 'Presynaptic serotonin transporter; 5-HTTLPR short allele impairs clearance and sustains hyperarousal in chronic primary insomnia.'),
(8, 'ADA', 'Adenosine Deaminase', 100, 'P00568', '20q13.12', 'Catalyzes irreversible deamination of adenosine to inosine; G22A variant affects slow-wave sleep depth and sleep pressure.'),
(9, 'BDNF', 'Brain Derived Neurotrophic Factor', 627, 'P23560', '11p14.1', 'Neurotrophin supporting sleep-dependent synaptic plasticity and homeostatic slow-wave sleep consolidation.'),
(10, 'GABRA9', 'GABA Type A Receptor Subunit Alpha 9', 9746, 'P47972', '4p14', 'Subunit of ligand-gated GABA-A receptor channel mediating sleep-promoting inhibitory tone in the preoptic area.'),
(11, 'TNFRSF1A', 'TNF Receptor Superfamily Member 1A', 7132, 'P19438', '12p13.31', '55 kDa receptor for TNF-alpha; mediates systemic inflammation and somnolence in obstructive sleep apnea.'),
(12, 'IL6', 'Interleukin 6', 3569, 'P05231', '7p15.3', 'Pro-inflammatory cytokine and somnogenic signaling molecule whose serum concentrations rise directly with nocturnal hypoxemia.'),
(13, 'ADRB2', 'Adrenoceptor Beta 2', 154, 'P07550', '5q32', 'Beta-2 adrenergic receptor modulating autonomic arousal and airway smooth muscle tone in sleep apnea.'),
(14, 'MEIS1', 'Meis Homeobox 1', 4211, 'O00470', '2p14', 'Transcription factor strongly replicated across restless legs syndrome GWAS cohorts; alters subcortical iron homeostasis.'),
(15, 'BTBD9', 'BTB Domain Containing 9', 114781, 'Q96Q07', '6p21.2', 'BTB domain protein linked to striatal iron regulation, dopamine transmission, and periodic limb movements in sleep.'),
(16, 'MAP2K5', 'Mitogen-Activated Protein Kinase Kinase 5', 5607, 'Q13163', '15q23', 'Part of MEK5/ERK5 signaling module implicated in sensorimotor neuronal survival and restless legs pathogenesis.'),
(17, 'BHLHE41', 'Basic Helix-Loop-Helix Family Member E41 (DEC2)', 79365, 'Q9C0J9', '12p12.1', 'Transcriptional repressor of CLOCK:BMAL1; P384R mutation confers resistance to sleep deprivation and enables ~6 hours natural short sleep.'),
(18, 'GBA1', 'Glucosylceramidase Beta 1', 2629, 'P04062', '1q22', 'Lysosomal enzyme; pathogenic variants associate with REM sleep behavior disorder and synucleinopathy risk.'),
(19, 'SNCA', 'Synuclein Alpha', 6622, 'P37840', '4q22.1', 'Encodes alpha-synuclein, whose pathological aggregation in pontine REM-atonia circuits underlies dream enactment behaviors.'),
(20, 'OPN4', 'Opsin 4 (Melanopsin)', 94233, 'Q9UHM6', '10q23.2', 'Photopigment of retinal ganglion cells mediating non-image-forming photic entrainment to the suprachiasmatic nucleus.'),
(21, 'ARNTL', 'Aryl Hydrocarbon Receptor Nuclear Translocator Like (BMAL1)', 406, 'O00327', '11p15.3', 'Obligate heterodimer partner for CLOCK; controls rhythmic circadian E-box gene transcription.'),
(22, 'TNF', 'Tumor Necrosis Factor', 7124, 'P01375', '6p21.33', 'Master pro-inflammatory cytokine acting on preoptic hypothalamic receptors to regulate non-REM sleep intensity.');

-- 4. Insert Biomarkers
INSERT INTO biomarkers (id, name, type, sample_type, description, standard_unit, reference_range) VALUES
(1, 'Melatonin', 'Hormone', 'Saliva / Serum', 'Pineal hormone under SCN control; gold standard biological proxy for circadian phase angle.', 'pg/mL', 'Nighttime: 10 - 60 pg/mL; Daytime: < 5 pg/mL'),
(2, 'Orexin-A (Hypocretin-1)', 'Neuropeptide', 'Cerebrospinal Fluid (CSF)', 'Hypothalamic neuropeptide; CSF levels <= 110 pg/mL are diagnostic criteria for Narcolepsy Type 1.', 'pg/mL', 'Normal: > 200 pg/mL; Diagnostic for Type 1: <= 110 pg/mL'),
(3, 'Cortisol', 'Hormone', 'Serum / Saliva', 'Glucocorticoid hormone; elevated midnight nadir reflects neuroendocrine hyperarousal in chronic insomnia.', 'μg/dL', 'Morning: 6 - 23 μg/dL; Midnight: < 1.5 μg/dL'),
(4, 'Polysomnography AHI', 'Physiological Index', 'Overnight Sleep Study', 'Hourly frequency of apneas and hypopneas; >= 15 events/hr confirms moderate-to-severe sleep apnea.', 'events/hr', 'Normal: < 5; Mild: 5-14; Moderate: 15-29; Severe: >= 30'),
(5, 'Interleukin-6 (IL-6)', 'Cytokine', 'Serum / Plasma', 'Pro-inflammatory cytokine elevated in response to nocturnal intermittent hypoxemia in sleep apnea.', 'pg/mL', 'Normal resting: < 5.0 pg/mL'),
(6, 'Tumor Necrosis Factor-alpha (TNF-α)', 'Cytokine', 'Serum', 'Inflammatory mediator correlating with daytime sleepiness and cardiovascular strain in sleep apnea.', 'pg/mL', 'Normal resting: < 8.1 pg/mL'),
(7, 'Adenosine', 'Purine Nucleoside', 'Plasma / Microdialysate', 'Endogenous sleep-promoting factor that accumulates during prolonged wakefulness, generating homeostatic sleep pressure.', 'nmol/L', 'Normal: 10 - 250 nmol/L'),
(8, 'Ferritin', 'Protein', 'Serum', 'Intracellular iron storage protein; serum ferritin < 50-75 ng/mL exacerbates Restless Legs symptoms.', 'ng/mL', 'Therapeutic target in RLS: > 75 ng/mL'),
(9, 'Serotonin (5-HT)', 'Neurotransmitter', 'Plasma / CSF', 'Monoamine neurotransmitter modulating dorsal raphe activity and sleep-wake arousal thresholds.', 'ng/mL', 'Whole Blood: 50 - 200 ng/mL'),
(10, 'Dim Light Melatonin Onset (DLMO)', 'Physiological Index', 'Saliva in dim light', 'Circadian phase marker defined by the clock time when salivary melatonin crosses threshold (~4 pg/mL).', 'Clock Time', 'Habitual DLMO: ~20:30 - 22:00');

-- 5. Insert Gene-Disorder Associations
INSERT INTO gene_disorder (gene_id, disorder_id, evidence, pmid) VALUES
(1, 1, 'Missense mutation (Ser662Gly) in PER2 accelerates phosphorylation by CK1 epsilon, causing FASPS.', '11239163'),
(2, 1, 'VNTR polymorphism in PER3 alters homeostatic response to sleep loss and delayed sleep phase vulnerability.', '11239163'),
(3, 1, 'Polymorphisms in CLOCK 3111T/C associate with delayed sleep timing and evening chronotype predisposition.', '10499924'),
(4, 1, 'Dominant gain-of-function CRY1 exon-skipping mutation slows the molecular clock, prolonging circadian period.', '11239163'),
(5, 2, 'HLA-DQB1*06:02 confers >200-fold relative risk for Narcolepsy Type 1 by presenting autoantigens.', '11245561'),
(6, 2, 'Loss of hypocretin receptor 2 signaling destabilizes monoaminergic tone, manifesting as sudden cataplexy.', '10973327'),
(7, 3, 'Serotonin transporter 5-HTTLPR short allele reduces clearance and elevates nocturnal autonomic hyperarousal.', '20138304'),
(8, 3, 'Adenosine deaminase Asp8Gly (G22A) variant influences slow-wave sleep depth and insomnia fragmentation.', '16223877'),
(9, 3, 'BDNF Val66Met polymorphism disrupts activity-dependent synaptic plasticity and homeostatic sleep recovery.', '19481481'),
(10, 3, 'Altered GABA-A receptor signaling impairs sleep-maintaining inhibitory tone from the preoptic area.', '19481481'),
(11, 4, 'TNFRSF1A genetic variants correlate with heightened inflammatory susceptibility and sleep apnea morbidity.', '23541571'),
(12, 4, 'Interleukin-6 promoter polymorphisms correlate with elevated nocturnal cytokine release and hypoxemia severity.', '9141544'),
(13, 4, 'ADRB2 receptor polymorphisms modulate sympathetic vascular tone and nocturnal airway patency in sleep apnea.', '23541571'),
(14, 5, 'Intronic MEIS1 SNPs confer highest known genetic effect size for restless legs syndrome via neural development.', '17637780'),
(15, 5, 'BTBD9 risk alleles impair central iron homeostasis, altering dopaminergic sensorimotor modulation.', '17637780'),
(16, 5, 'MAP2K5 locus variants associate with periodic limb movement index and restless legs syndrome susceptibility.', '17637780'),
(17, 6, 'Point mutation in BHLHE41 (DEC2 P384R) leads to a natural short sleep phenotype requiring ~6 hours of sleep.', '19679812'),
(18, 7, 'GBA1 mutations represent a strong predisposing factor for idiopathic REM sleep behavior disorder.', '17637780'),
(19, 7, 'Alpha-synuclein locus variation links to brainstem degeneration in dream enactment behaviors.', '17637780'),
(20, 1, 'Melanopsin OPN4 variants impair retinal photic signal transmission to the SCN, perturbing circadian synchronization.', '7434030');

-- 6. Insert Gene-Biomarker Associations
INSERT INTO gene_biomarker (gene_id, biomarker_id, relationship, evidence, pmid) VALUES
(1, 1, 'Circadian rhythm phase driver', 'PER2 feedback loops govern pineal melatonin synthesis and phase timing.', '11239163'),
(1, 10, 'DLMO phase determinant', 'PER2 mutations cause an advance in dim light melatonin onset by several hours.', '11239163'),
(5, 2, 'Autoimmune neuropeptide depletion', 'HLA-DQB1*06:02 presentation of autoantigens drives destruction of orexin neurons, causing undetectable CSF orexin-A.', '11245561'),
(6, 2, 'Ligand-receptor signaling pair', 'HCRTR2 binds orexin-A with high affinity to stimulate wakefulness-promoting histaminergic nuclei.', '10973327'),
(7, 3, 'Neuroendocrine stress axis regulation', 'Altered serotonin transporter expression increases HPA axis reactivity, sustaining elevated evening cortisol.', '20138304'),
(7, 9, 'Synaptic reuptake transporter', 'SLC6A4 directly mediates high-affinity clearance of extracellular serotonin across pre-synaptic membranes.', '20138304'),
(8, 7, 'Enzymatic degradation substrate', 'Adenosine deaminase catalyzes degradation of sleep-inducing adenosine into inosine in basal forebrain.', '16223877'),
(11, 6, 'Receptor-ligand cytokine interaction', 'TNFRSF1A mediates downstream inflammatory signaling initiated by circulating TNF-alpha.', '23541571'),
(12, 5, 'Direct cytokine transcription', 'IL6 gene transcription directly controls circulating interleukin-6 protein levels in plasma.', '9141544'),
(14, 8, 'Iron metabolism regulation', 'MEIS1 transcriptional pathways interact with transferrin and ferritin expression in neuromelanin cells.', '17637780'),
(17, 7, 'Homeostatic sleep drive modulator', 'BHLHE41 (DEC2) alters transcriptional responsiveness to adenosine accumulation and homeostatic recovery.', '19679812'),
(20, 1, 'Photic suppression circuit', 'Melanopsin (OPN4) ipRGC signals trigger SCN inhibition of superior cervical ganglion, suppressing nocturnal melatonin.', '7434030');

-- 7. Insert Disorder-Biomarker Associations
INSERT INTO disorder_biomarker (disorder_id, biomarker_id, evidence, pmid) VALUES
(1, 1, 'Abnormal circadian phase angle of melatonin secretion defines phase advance or phase delay.', '10499924'),
(1, 10, 'DLMO serves as the primary objective clinical laboratory marker for quantifying circadian phase shift.', '7434030'),
(2, 2, 'CSF Orexin-A <= 110 pg/mL is an established diagnostic criterion for Narcolepsy Type 1 in ICSD-3.', '10973327'),
(3, 3, 'Elevated evening salivary and 24-hr urinary cortisol reflects chronic neuroendocrine hyperarousal.', '19481481'),
(4, 4, 'AHI >= 15 events/hr (or >= 5 with symptoms) establishes the clinical diagnostic threshold for OSA.', '23541571'),
(4, 5, 'Circulating IL-6 correlates linearly with apnea severity and nocturnal hypoxemia duration.', '9141544'),
(4, 6, 'TNF-alpha levels correlate with sleepiness complaints and nocturnal desaturations in sleep apnea patients.', '23541571'),
(5, 8, 'Low serum ferritin (<50-75 ng/mL) directly predicts Restless Legs symptom exacerbation.', '17637780'),
(6, 7, 'Short sleep phenotype individuals demonstrate altered homeostatic adenosine dissipation kinetics.', '16223877'),
(7, 9, 'Serotonergic and monoaminergic alterations in brainstem nuclei contribute to REM atonia breakdown.', '17637780');
