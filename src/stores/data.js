import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', () => {

    const data = ref([
        { 
            "key": "Id", 
            "text": "PDB ID for the entry - currently 4-character alphanumeric, planned to be extended in the future to eight characters prefixed by ‘pdb’"
        },
        {
            "key": "Audit Author",
            "text": "The 'Audit Author' represents the individual responsible for auditing the PDB entry. This person ensures the accuracy, validity, and reliability of the information provided in the entry. The audit process is crucial for maintaining the quality and integrity of data within the Protein Data Bank."
        },
        {
            "key": "Pdb Code",
            "text": "The 'PDB Code' is a unique identifier assigned to each entry in the Protein Data Bank. This alphanumeric code facilitates easy retrieval and reference of structural information. It serves as a fundamental key for researchers, enabling them to access specific structures of interest efficiently."
        },
        {
            "key": "Is Replaced",
            "text": "'Is Replaced' is a binary indicator that reveals whether the PDB entry has undergone replacement. A positive value indicates that the entry has been replaced at some point, possibly due to updates, corrections, or revisions. Understanding replacement status is essential for tracking the evolution of structural data."
        },
        {
            "key": "Pdb Code Changed",
            "text": "'PDB Code Changed' indicates whether there have been alterations to the PDB code associated with the entry. Changes to the code may occur for various reasons, such as corrections or updates to enhance accuracy. Monitoring code changes is crucial for data management and tracking modifications over time."
        },
        {
            "key": "Citation",
            "text": "'Citation' provides reference information for the PDB entry. It includes details about the publication or source from which the structural data originated. Citations play a vital role in acknowledging the contributions of researchers and providing a scholarly context for the structural information stored in the Protein Data Bank."
        },
        {
            "key": "Diffrn",
            "text": "'Diffrn' encompasses information related to diffraction experiments conducted during the structural determination process. Diffraction data provides insights into the spatial arrangement of atoms within a crystal, contributing to the overall understanding of the three-dimensional structure of biological macromolecules."
        },
        {
            "key": "Diffrn Radiation",
            "text": "'Diffrn Radiation' specifies the type of radiation used in diffraction experiments. Different types of radiation, such as X-rays or neutrons, interact uniquely with crystal structures, generating diffraction patterns that aid in elucidating the molecular arrangement. Understanding the radiation type is crucial for interpreting experimental results accurately."
        },
        {
            "key": "Exptl",
            "text": "'Exptl' represents general experimental information associated with the PDB entry. This variable provides insights into the overall experimental methodology employed, including details about the techniques and conditions used to determine the structure. Understanding the experimental context is essential for assessing data reliability."
        },
        {
            "key": "Exptl Crystal",
            "text": "'Exptl Crystal' focuses specifically on experimental details related to the crystal used in structural determination. This variable provides information about the crystalline state of the biomolecule under investigation, offering insights into the conditions that influence crystal growth and quality in the experiment."
        },
        {
            "key": "Pdbx Audit Revision Details",
            "text": "'PDBx Audit Revision Details' encapsulates specific details of audit revisions in the PDBx (PDB Exchange) format. The PDBx format is widely used for data exchange, and this variable provides a comprehensive breakdown of the changes made during the auditing process, ensuring transparency and traceability of revisions."
        },
        {
            "key": "Pdbx Audit Revision Group",
            "text": "'PDBx Audit Revision Group' provides information about the group or category associated with the audit revision in the PDBx format. Grouping audit revisions helps organize and categorize changes made to the structural data, facilitating a systematic understanding of modifications introduced during the auditing process."
        },
        {
            "key": "Pdbx Audit Revision History",
            "text": "'PDBx Audit Revision History' offers a chronological overview of the audit revisions made to the PDB entry in the PDBx format. This variable tracks the evolution of the entry, detailing when specific changes were introduced. The revision history is crucial for understanding the timeline of modifications and ensuring data accuracy."
        },
        {
            "key": "Refine",
            "text": "The 'Refine' variable in PDB data refers to the refinement process during structural determination. It involves iterative adjustments to the model's parameters to improve accuracy and fit with experimental data. Refinement includes optimization of atomic positions, thermal vibrations, and other parameters to achieve a model that best represents the experimental observations."
        },
        {
            "key": "Refine Hist",
            "text": "The 'Refine Hist' variable provides a detailed history of the refinement process in PDB data. It chronicles the sequential steps taken during refinement, showcasing how the model evolved over time. This historical information is valuable for understanding the iterative improvements made to the structural model and the decisions taken at each refinement stage."
        },
        {
            "key": "Refine Ls Restr",
            "text": "Refine Ls Restr pertains to least-squares restraints applied during the refinement process in PDB data. These restraints help balance the trade-off between fitting the model to the experimental data and avoiding overfitting. They play a crucial role in maintaining the structural integrity of the model by preventing unrealistic deviations from the observed data."
        },
        {
            "key": "Software",
            "text": "The 'Software' key in PDB data denotes the computational tools and software used in the structural determination process. It includes programs for data collection, structure determination, and refinement. Knowing the software is essential for understanding the methodology employed, reproducibility, and potential implications for the accuracy and reliability of the structural model."
        },
        {
            "key": "Cell Angle Alpha",
            "text": "The 'Cell Angle Alpha' in PDB data represents one of the angles defining the unit cell in crystallography. It specifies the angle between the unit cell's b and c axes. Understanding the cell angles is crucial for determining the overall geometry and symmetry of the crystal lattice, providing insights into the three-dimensional arrangement of biological macromolecules."
        },
        {
            "key": "Cell Angle Beta",
            "text": "The 'Cell Angle Beta' in PDB data is another angle defining the unit cell in crystallography. It denotes the angle between the unit cell's a and c axes. Together with the alpha and gamma angles, beta contributes to characterizing the triclinic, monoclinic, orthorhombic, tetragonal, and rhombohedral crystal systems."
        },
        {
            "key": "Cell Angle Gamma",
            "text": "The 'Cell Angle Gamma' in PDB data is the angle between the unit cell's a and b axes in crystallography. Along with alpha and beta, gamma defines the orientation and shape of the unit cell. These angles play a fundamental role in describing the lattice parameters and symmetry of the crystal structure."
        },
        {
            "key": "Cell Length A",
            "text": "The 'Cell Length A' in PDB data represents the length of the unit cell's a-axis in crystallography. It is a fundamental parameter defining the size and shape of the crystal lattice. The A, B, and C cell lengths, along with alpha, beta, and gamma angles, collectively describe the unit cell's dimensions and symmetry."
        },
        {
            "key": "Cell Length B",
            "text": "The 'Cell Length B' in PDB data denotes the length of the unit cell's b-axis in crystallography. Along with cell lengths A and C, it contributes to defining the dimensions and symmetry of the crystal lattice. These parameters are essential for understanding the three-dimensional arrangement of biological macromolecules."
        },
        {
            "key": "Cell Length C",
            "text": "The 'Cell Length C' in PDB data represents the length of the unit cell's c-axis in crystallography. Together with cell lengths A and B, it defines the size and shape of the crystal lattice. The A, B, and C cell lengths, along with alpha, beta, and gamma angles, collectively characterize the unit cell's dimensions and symmetry."
        },
        {
            "key": "Cell Zpdb",
            "text": "The 'Cell Zpdb' in PDB data refers to the Z value of the unit cell, providing information about the crystal lattice's orientation and symmetry. Understanding the Z value is crucial for interpreting the arrangement of biological macromolecules in three-dimensional space within the crystal lattice."
        },
        {
            "key": "Pdbdatstatus Pdb Format Compatible",
            "text": "The 'Pdbdatstatus Pdb Format Compatible' key indicates whether a PDB entry is compatible with the PDB format. This binary indicator ensures adherence to established data standards, promoting consistency and interoperability in the representation of structural data in the Protein Data Bank."
        },
        {
            "key": "Recvd Initial Deposition Date",
            "text": "The 'Recvd Initial Deposition Date' in PDB data marks the initial date when a molecular structure was first deposited in the Protein Data Bank. This timestamp is crucial for tracking the entry's historical presence in the database and serves as a reference point for subsequent revisions and updates."
        },
        {
            "key": "Pdbdatstatus Status Code",
            "text": "The 'Pdbdatstatus Status Code' provides a status code associated with PDB data, conveying information about the current state or condition of the entry. This code serves as a quick reference to understand the entry's status, such as whether it is under review, released, or in a different state."
        },
        {
            "key": "Rcsaccinfo Deposit Date",
            "text": "The 'Rcsaccinfo Deposit Date' in PDB data indicates the date when the deposition process for a molecular structure was completed. This date marks the official addition of the entry to the Protein Data Bank, providing a timeline reference for the accessibility and release of the structural data."
        },
        {
            "key": "Pdbdatstatus Status Code",
            "text": "The Pdbdatstatus Status Code provides information about the status of the PDB data entry. It indicates whether the entry is active, on hold, or has other specific status codes, contributing to the overall management and understanding of the data's current state within the Protein Data Bank."
        },
        {
            "key": "Rcsaccinfo Deposit Date",
            "text": "Rcsaccinfo Deposit Date represents the date when the structural data for a biological molecule was initially deposited in the Protein Data Bank. This information is crucial for tracking the timeline of data submission and serves as a reference point for the entry's historical context."
        },
        {
            "key": "Has Released Experimental Data",
            "text": "The Has Released Experimental Data variable is a binary indicator that reveals whether the experimental data associated with a PDB entry has been released. This information is significant for researchers and the scientific community, providing insights into the availability of crucial experimental details for further analysis and validation."
        },
        {
            "key": "Rcsaccinfo Initial Release Date",
            "text": "Rcsaccinfo Initial Release Date signifies the date when a PDB entry, along with its associated structural and experimental data, was first made publicly accessible. This date marks the initial release of valuable scientific information, allowing researchers to track the availability of structural insights for specific biological entities."
        },
        {
            "key": "Rcsaccinfo Major Revision",
            "text": "Rcsaccinfo Major Revision provides details about major revisions made to the accession information associated with a PDB entry. Major revisions typically involve significant changes or updates to the metadata, and this information aids in understanding the evolution and improvement of the entry's documentation and contextual details."
        },
        {
            "key": "Rcsaccinfo Minor Revision",
            "text": "Rcsaccinfo Minor Revision offers insights into minor revisions made to the accession information of a PDB entry. Minor revisions usually involve smaller updates or corrections that enhance the accuracy and completeness of the metadata associated with the entry, contributing to the overall data quality."
        },
        {
            "key": "Rcsaccinfo Revision Date",
            "text": "Rcsaccinfo Revision Date indicates the specific date when the last revision to the accession information of a PDB entry occurred. This timestamp is crucial for researchers tracking changes over time, providing a reference point for the most recent updates to the entry's metadata, status, or associated details."
        },
        {
            "key": "Rcsaccinfo Status Code",
            "text": "Rcsaccinfo Status Code conveys the current status of the accession information for a PDB entry. The status code provides information about whether the entry is active, on hold, or has other specific status indicators, aiding in the categorization and management of entries within the Protein Data Bank."
        },
        {
            "key": "Rcsentinfo Assembly Count",
            "text": "Rcsentinfo Assembly Count represents the total count of assemblies within a PDB entry. Assemblies describe the different structural arrangements or complexes formed by biological macromolecules. This count is essential for understanding the complexity and diversity of the molecular entities present in the entry, facilitating comprehensive structural analysis."
        },
        {
            "key": "Rcsentinfo Branched Entity Count",
            "text": "Rcsentinfo Branched Entity Count indicates the number of branched entities within a PDB entry. Branched entities are distinct components within the structure, and this count provides insights into the structural intricacies and relationships between different molecular entities, aiding researchers in characterizing complex biological systems."
        },
        {
            "key": "Rcsentinfo Cis Peptide Count",
            "text": "Rcsentinfo Cis Peptide Count specifies the total count of cis peptides within a PDB entry. Cis peptides represent a specific conformation of peptide bonds, and this count offers information about the prevalence of these structural features. It is valuable for understanding the molecular characteristics and stability of the biological macromolecules in the entry."
        },
        {
            "key": "Rcsentinfo Deposited Atom Count",
            "text": "Rcsentinfo Deposited Atom Count provides the total count of atoms deposited within a PDB entry. This count is fundamental for assessing the size and complexity of the molecular structure, offering insights into the granularity of the structural information available for a specific biological macromolecule or complex."
        },
        {
            "key": "Deposited Hydrogen Atom Count",
            "text": "Deposited Hydrogen Atom Count specifies the total count of deposited hydrogen atoms within a PDB entry. Hydrogen atoms play a crucial role in the determination of the molecular structure, particularly in elucidating hydrogen bonding and overall molecular geometry. This count aids researchers in understanding the hydrogen-bonding network and the overall structural stability of the entry."
        },
        {
            "key": "Rcsentinfo Deposited Model Count",
            "text": "Rcsentinfo Deposited Model Count indicates the total count of models deposited within a PDB entry. Each model represents a distinct conformation or representation of the molecular structure. This count is essential for assessing the diversity of structural models available for a specific biological entity, facilitating a comprehensive analysis of structural flexibility and dynamics."
        },
        {
            "key": "Deposited Modeled Polymer Monomer Count",
            "text": "The Deposited Modeled Polymer Monomer Count represents the number of polymer monomers in the deposited structure that have been explicitly modeled. This count provides insights into the completeness of the modeled polymer chain within the PDB entry."
        },
        {
            "key": "Deposited Nonpolymer Entity Instance Count",
            "text": "The Deposited Nonpolymer Entity Instance Count indicates the number of instances of nonpolymeric entities that have been deposited. Nonpolymeric entities may include ligands, cofactors, or other small molecules associated with the structure."
        },
        {
            "key": "Deposited Polymer Entity Instance Count",
            "text": "The Deposited Polymer Entity Instance Count denotes the number of instances of polymer entities that have been deposited. Polymer entities typically represent macromolecules such as proteins or nucleic acids, and this count provides information about their occurrences in the structure."
        },
        {
            "key": "Deposited Polymer Monomer Count",
            "text": "The Deposited Polymer Monomer Count signifies the total number of polymer monomers deposited in the structure. It encompasses all monomeric units within polymer entities, offering a comprehensive measure of the size and complexity of the macromolecular components in the entry."
        },
        {
            "key": "Deposited Solvent Atom Count",
            "text": "The Deposited Solvent Atom Count represents the total number of solvent atoms deposited in the structure. Solvent atoms include water molecules and other small molecules that are part of the crystalline environment and play a role in the crystal lattice structure."
        },
        {
            "key": "Deposited Unmodeled Polymer Monomer Count",
            "text": "The Deposited Unmodeled Polymer Monomer Count indicates the number of polymer monomers in the deposited structure that have not been explicitly modeled. This count reflects regions where the structure may be incomplete or unresolved, providing insights into the modeling confidence."
        },
        {
            "key": "Rcsentinfo Disulfide Bond Count",
            "text": "Rcsentinfo Disulfide Bond Count refers to the count of disulfide bonds present in the structure. Disulfide bonds play a crucial role in stabilizing the three-dimensional structure of proteins, and this count provides information about the presence and connectivity of these covalent bonds."
        },
        {
            "key": "Rcsentinfo Entity Count",
            "text": "Rcsentinfo Entity Count signifies the total count of entities in the structure. Entities may include biological macromolecules, nonpolymeric ligands, solvent molecules, and other components. This count offers an overall measure of the diversity and complexity of the structural content."
        },
        {
            "key": "Rcsentinfo Experimental Method",
            "text": "Rcsentinfo Experimental Method describes the experimental technique employed for structure determination. It could include methods such as X-ray crystallography, NMR spectroscopy, or cryo-electron microscopy. This information is crucial for understanding the reliability and accuracy of the structural data."
        },
        {
            "key": "Rcsentinfo Experimental Method Count",
            "text": "Rcsentinfo Experimental Method Count provides the count of different experimental methods used in the structure determination process. Multiple methods may be employed to ensure data accuracy and reliability, and this count reflects the diversity of techniques applied."
        },
        {
            "key": "Inter Mol Covalent Bond Count",
            "text": "Inter Mol Covalent Bond Count indicates the count of covalent bonds formed between molecules in the structure. These bonds play a significant role in molecular interactions, and this count provides insights into the covalent connectivity between different molecular entities."
        },
        {
            "key": "Inter Mol Metallic Bond Count",
            "text": "Inter Mol Metallic Bond Count represents the count of metallic bonds formed between molecules in the structure. Metallic bonds involve the sharing of electrons between metal atoms, and this count provides information about the presence and extent of metallic bonding interactions in the entry."
        },
        {
            "key": "Rcsentinfo Molecular Weight",
            "text": "Rcsentinfo Molecular Weight denotes the molecular weight of the entire structure. It represents the sum of the molecular weights of all entities present, including polymers, nonpolymeric ligands, and solvent molecules. This provides a quantitative measure of the mass of the entire structural assembly."
        },
        {
            "key": "Na Polymer Entity Types",
            "text": "Na Polymer Entity Types enumerates the different types of polymer entities present in the structure. It specifies the nature and diversity of macromolecules, such as proteins or nucleic acids, contributing to a detailed characterization of the biological components in the entry."
        },
        {
            "key": "Rcsentinfo Nonpolymer Bound Components",
            "text": "Rcsentinfo Nonpolymer Bound Components describes nonpolymeric entities that are bound within the structure. These entities could include ligands, cofactors, or other small molecules interacting with macromolecules. This information is crucial for understanding molecular interactions and functional associations."
        },
        {
            "key": "Rcsentinfo Nonpolymer Entity Count",
            "text": "Rcsentinfo Nonpolymer Entity Count provides the total count of nonpolymeric entities in the structure. It encompasses ligands, cofactors, and other small molecules, contributing to a comprehensive assessment of the nonmacromolecular components in the entry."
        },
        {
            "key": "Nonpolymer Molecular Weight Maximum",
            "text": "Nonpolymer Molecular Weight Maximum represents the maximum molecular weight among nonpolymeric entities in the structure. This provides insights into the size and complexity of the largest nonmacromolecular components, contributing to a detailed characterization of molecular diversity."
        },
        {
            "key": "Nonpolymer Molecular Weight Minimum",
            "text": "Nonpolymer Molecular Weight Minimum represents the minimum molecular weight among nonpolymeric entities in the structure. This offers insights into the size and complexity of the smallest nonmacromolecular components, contributing to a comprehensive understanding of molecular diversity."
        },
        {
            "key": "Rcsentinfo Polymer Composition",
            "text": "Rcsentinfo Polymer Composition describes the composition of polymer entities in the structure. It specifies the types and quantities of monomers that constitute the polymers, providing detailed information about the building blocks of macromolecular components."
        },
        {
            "key": "Rcsentinfo Polymer Entity Count",
            "text": "Rcsentinfo Polymer Entity Count indicates the total count of polymer entities in the structure. Polymer entities typically include proteins or nucleic acids, and this count provides a measure of the overall abundance and diversity of macromolecular components."
        },
        {
            "key": "Polymer Entity Count Dna",
            "text": "The count of DNA polymer entities within the PDB entry, representing the number of distinct DNA chains or molecules."
        },
        {
            "key": "Polymer Entity Count Rna",
            "text": "The count of RNA polymer entities within the PDB entry, indicating the number of distinct RNA chains or molecules."
        },
        {
            "key": "Polymer Entity Count Nucleic Acid",
            "text": "The total count of nucleic acid polymer entities, encompassing both DNA and RNA, in the PDB entry."
        },
        {
            "key": "Polymer Entity Count Nucleic Acid Hybrid",
            "text": "The count of hybrid nucleic acid polymer entities, representing entities containing a combination of DNA and RNA."
        },
        {
            "key": "Polymer Entity Count Protein",
            "text": "The count of protein polymer entities within the PDB entry, denoting the number of distinct protein chains or molecules."
        },
        {
            "key": "Polymer Entity Taxonomy Count",
            "text": "The count of distinct polymer entities based on taxonomy, providing information on the diversity of biological sources."
        },
        {
            "key": "Polymer Molecular Weight Maximum",
            "text": "The maximum molecular weight among polymer entities within the PDB entry, indicating the largest molecular weight."
        },
        {
            "key": "Polymer Molecular Weight Minimum",
            "text": "The minimum molecular weight among polymer entities within the PDB entry, indicating the smallest molecular weight."
        },
        {
            "key": "Polymer Monomer Count Maximum",
            "text": "The maximum count of monomers within a polymer entity, representing the highest number of building blocks in a polymer chain."
        },
        {
            "key": "Polymer Monomer Count Minimum",
            "text": "The minimum count of monomers within a polymer entity, representing the lowest number of building blocks in a polymer chain."
        },
        {
            "key": "Rcsentinfo Resolution Combined",
            "text": "The combined resolution value for the PDB entry, providing information on the clarity and quality of the experimental data."
        },
        {
            "key": "Selected Polymer Entity Types",
            "text": "Specifies the types of polymer entities selected for inclusion in the PDB entry, offering insights into the focus of the structural analysis."
        },
        {
            "key": "Rcsentinfo Software Programs Combined",
            "text": "The combined information about software programs used in the structural analysis and determination of the PDB entry."
        },
        {
            "key": "Rcsentinfo Solvent Entity Count",
            "text": "The count of solvent entities within the PDB entry, providing details about the presence of solvent molecules in the structure."
        },
        {
            "key": "Rcsentinfo Structure Determination Methodology",
            "text": "Describes the methodology employed for structure determination, outlining the techniques and approaches used in the analysis."
        },
        {
            "key": "Structure Determination Methodology Priority",
            "text": "Assigns a priority to the structure determination methodology, indicating its significance in the overall analysis."
        },
        {
            "key": "Diffrn Resolution High Provenance Source",
            "text": "Provenance source for the high-resolution data in diffraction experiments, providing information on the source of the experimental data."
        },
        {
            "key": "Diffrn Resolution High Value",
            "text": "The actual high-resolution value obtained from diffraction experiments, indicating the level of detail captured in the structural analysis."
        },
        {
            "key": "Rcsb Primary Citation Country",
            "text": "Specifies the country associated with the primary citation, providing information about the origin of the research."
        },
        {
            "key": "Rcspricitation Journal Abbrev",
            "text": "The abbreviated form of the journal name associated with the primary citation, facilitating easy reference to the publication."
        },
        {
            "key": "Rcspricitation Journal Volume",
            "text": "The volume number of the journal associated with the primary citation, providing details about the specific issue."
        },
        {
            "key": "Rcspricitation Page First",
            "text": "The starting page number of the primary citation in the RCSB PDB, indicating where the citation begins in the publication."
        },
        {
            "key": "Rcspricitation Page Last",
            "text": "The ending page number of the primary citation in the RCSB PDB, indicating where the citation concludes in the publication."
        },
        {
            "key": "Rcspricitation Rcsb Authors",
            "text": "Authors of the primary citation in the RCSB PDB, providing information about the contributors to the associated research."
        },
        {
            "key": "Rcspricitation Rcsb Journal Abbrev",
            "text": "The abbreviated name of the journal in which the primary citation associated with the entry is published, according to the RCSB PDB."
        },
        {
            "key": "Rcsb Primary Citation Title",
            "text": "Title of the primary citation associated with the entry in the RCSB PDB, offering a concise description of the research."
        },
        {
            "key": "Rcsb Primary Citation Year",
            "text": "The publication year of the primary citation in the RCSB PDB, indicating when the associated research was published."
        },
        {
            "key": "Struct Pdbx Descriptor",
            "text": "Descriptor associated with the structure in the PDBx format, providing additional information about the structural features."
        },
        {
            "key": "Struct Title",
            "text": "Title or name associated with the structure, offering a brief description of the biological or chemical entity."
        },
        {
            "key": "Struct Keywords Pdbx Keywords",
            "text": "Keywords associated with the structure in the PDBx format, providing descriptors for the structural features or biological entities."
        },
        {
            "key": "Struct Keywords Text",
            "text": "Textual keywords associated with the structure, offering additional information about the structural content or biological significance."
        },
        {
            "key": "Symmetry Int Tables Number",
            "text": "The number associated with the international tables of symmetry for the crystallographic space group of the structure."
        },
        {
            "key": "Symspagroup Name Hm",
            "text": "The Hermann-Mauguin symbol representing the space group of the crystal structure, providing information about the symmetry."
        },
        {
            "key": "Diffrn Detector",
            "text": "The type or name of the detector used in the diffraction experiment, indicating the technology employed to capture diffraction data."
        },
        {
            "key": "Pdbx Audit Revision Category",
            "text": "Category or type of revision made during the audit process in the PDBx format, providing insights into the nature of the revision."
        },
        {
            "key": "Pdbx Audit Revision Item",
            "text": "Specific item or detail that underwent revision during the audit process in the PDBx format, offering granular information about the changes made."
        },
        {
            "key": "Refine Analyze",
            "text": "Information about the analytical methods or procedures employed during the refinement process, contributing to the quality of the structural model."
        },
        {
            "key": "Reflns",
            "text": "Data related to reflections in the crystallographic study, offering insights into the diffraction pattern and overall data quality."
        },
        {
            "key": "Rcsb Binding Affinity",
            "text": "Details about the binding affinity associated with the entry in the RCSB PDB, providing information about the strength of molecular interactions."
        },
        {
            "key": "Pdbdatstatus Process Site",
            "text": "Information about the processing site or facility where the PDB data associated with the entry were curated, ensuring data integrity."
        },
        {
            "key": "Branched Molecular Weight Maximum",
            "text": "The maximum molecular weight of branched entities within the entry, contributing to the understanding of structural complexity."
        },
        {
            "key": "Branched Molecular Weight Minimum",
            "text": "The minimum molecular weight of branched entities within the entry, offering insights into the diversity of molecular structures."
        },
        {
            "key": "Rcspricitation Rcsb Orcididentifiers",
            "text": "ORCID identifiers associated with the authors of the primary citation in the RCSB PDB, providing unique identification for contributors."
        },
        {
            "key": "Diffrn Source",
            "text": "Details about the source or origin of the diffraction data, offering insights into the experimental setup and conditions."
        },
        {
            "key": "Exptl Crystal Grow",
            "text": "Details about the growth conditions of the crystal used in the experimental process, providing information on crystal growth methods and conditions."
        },
        {
            "key": "Reflns Shell",
            "text": "Information about reflection shells in the diffraction data, outlining details on the arrangement and characteristics of reflections within specific shells."
        },
        {
            "key": "Pdbdatstatus Deposit Site",
            "text": "Indicates the site where the deposition of the PDB entry occurred, offering insights into the geographical location or institution responsible for the deposit."
        },
        {
            "key": "Diffrn Radiation Wavelength Maximum",
            "text": "Maximum wavelength of the radiation used in the diffraction experiment, providing details on the upper limit of the electromagnetic spectrum utilized."
        },
        {
            "key": "Diffrn Radiation Wavelength Minimum",
            "text": "Minimum wavelength of the radiation used in the diffraction experiment, offering details on the lower limit of the electromagnetic spectrum utilized."
        },
        {
            "key": "Symmetry Cell Setting",
            "text": "Describes the cell setting symmetry, providing information about the arrangement and characteristics of the crystal lattice."
        },
        {
            "key": "Pdbx Database Related",
            "text": "Details related to the PDBx database, indicating information or features associated with the PDBx data exchange format or database structure."
        },
        {
            "key": "Pdbdatstatus Status Code Sf",
            "text": "Status code related to structure factors (Sf), conveying information about the quality or reliability of the experimental structure factor data."
        },
        {
            "key": "Pdbx Initial Refinement Model",
            "text": "Information about the initial refinement model used in the structural determination process, offering insights into the starting point of model refinement."
        },
        {
            "key": "Pdbx Database Status Sgentry",
            "text": "Database status code related to space group entry (Sgentry), indicating the status or condition of the entry within the database with respect to space group information."
        },
        {
            "key": "Pdbx Reflns Twin",
            "text": "Details about twinning in the reflection data, providing information on any twinning effects observed during the diffraction experiment."
        },
        {
            "key": "Pdbx Audit Support",
            "text": "Information related to audit support in the PDBx format, offering details on the support or documentation provided during the auditing process."
        },
        {
            "key": "Struct Pdbx Caspflag",
            "text": "Indicates whether the structure is flagged as part of the CASP (Critical Assessment of Structure Prediction) experiment, providing insights into its evaluation status."
        },
        {
            "key": "Pdbx Database Pdbobs Spr",
            "text": "Details related to observations in the PDB database (PDBobs), offering insights into observed features or conditions recorded in the database."
        },
        {
            "key": "Pdbx Sgproject",
            "text": "Information about the space group project in the PDBx format, providing details on the specific project or context associated with space group information."
        },
        {
            "key": "Em3d Fitting",
            "text": "Details about fitting procedures in electron microscopy 3D reconstructions, offering insights into the alignment and fitting of structural models to experimental data."
        },
        {
            "key": "Em3d Reconstruction",
            "text": "Information about 3D reconstruction techniques in electron microscopy, detailing the process of generating three-dimensional models from 2D projection images."
        },
        {
            "key": "Em Ctf Correction",
            "text": "Describes correction methods applied to correct for Contrast Transfer Function (CTF) effects in electron microscopy images, ensuring accuracy in the final reconstruction."
        },
        {
            "key": "Em Entity Assembly",
            "text": "Details about the assembly of entities in electron microscopy experiments, offering insights into the organization and arrangement of biological entities within the sample."
        },
        {
            "key": "Em Image Recording",
            "text": "Information about the recording process of electron microscopy images, providing details on the parameters and conditions during image acquisition."
        },
        {
            "key": "Em Imaging",
            "text": "Describes the imaging techniques used in electron microscopy experiments, offering insights into the methodology employed for visualizing biological structures."
        },
        {
            "key": "Em Particle Selection",
            "text": "Details about the selection process of particles in electron microscopy experiments, providing information on criteria used for including or excluding particles in the analysis."
        },
        {
            "key": "Em Software",
            "text": "Specifies the software used in electron microscopy data analysis, offering insights into the computational tools employed for image processing and reconstruction."
        },
        {
            "key": "Em Specimen",
            "text": "Provides information about the specimen used in electron microscopy experiments, describing the characteristics and preparation of the sample for imaging."
        },
        {
            "key": "Em Vitrification",
            "text": "Details about the vitrification process in electron microscopy, describing the technique of rapidly freezing biological samples for imaging without the formation of ice crystals."
        },
        {
            "key": "Rcsb External References",
            "text": "External references associated with the entry in the RCSB PDB (Research Collaboratory for Structural Bioinformatics Protein Data Bank), providing links or citations to additional resources."
        },
        {
            "key": "Em Experiment Aggregation State",
            "text": "Describes the aggregation state of entities in electron microscopy experiments, offering insights into how biological structures are organized and interact within the experimental conditions."
        },
        {
            "key": "Em Experiment Reconstruction Method",
            "text": "Specifies the method used for the reconstruction of electron microscopy experiment data, providing details on the computational techniques applied to generate three-dimensional models."
        },
        {
            "key": "Em Single Particle Entity",
            "text": "Information about single-particle entities in electron microscopy, detailing the characteristics and properties of individual particles within the sample."
        },
        {
            "key": "Pdbx Molecule Features",
            "text": "Features of molecules described in the PDBx format, offering additional information or annotations related to the structural and functional characteristics of molecular entities."
        },
        {
            "key": "Pdbx Nmr Exptl",
            "text": "Details about the experimental setup in nuclear magnetic resonance (NMR) experiments, providing information on the conditions and parameters used during data acquisition."
        },
        {
            "key": "Pdbnmrexptl Sample Conditions",
            "text": "Conditions of the sample in nuclear magnetic resonance (NMR) experiments, offering insights into the environment and preparation of the sample for analysis."
        },
        {
            "key": "Pdbx Nmr Refine",
            "text": "Information about the refinement process in nuclear magnetic resonance (NMR) experiments, detailing the methods and procedures applied to improve the accuracy of structural models."
        },
        {
            "key": "Pdbx Nmr Sample Details",
            "text": "Detailed information about the sample used in nuclear magnetic resonance (NMR) experiments, including characteristics and preparation details."
        },
        {
            "key": "Pdbx Nmr Software",
            "text": "Software used in NMR experiments, particularly in the context of Protein Data Bank entries. It represents the specific program or suite of programs employed for NMR data analysis and interpretation."
        },
        {
            "key": "Pdbx Nmr Spectrometer",
            "text": "Describes the NMR spectrometer utilized for data collection in the context of a Protein Data Bank entry. This includes details about the instrument or instruments employed in acquiring NMR data for the molecular structure."
        },
        {
            "key": "Pdbdatstatus Status Code Mr",
            "text": "Status code specifically associated with entries containing MR (Magnetic Resonance) data. This code provides information on the current status or condition of the entry with respect to MR-related data in the Protein Data Bank."
        },
        {
            "key": "Pdbnmrensemble Conformer Selection Criteria",
            "text": "Criteria used for the selection of conformers in an ensemble in the context of NMR data. This variable provides insights into the criteria applied to choose representative conformers when multiple conformations are present."
        },
        {
            "key": "Conformers Calculated Total Number",
            "text": "Total number of calculated conformers in an ensemble. In the context of NMR data, this variable indicates the overall count of different conformations determined through calculations or experiments for the molecular structure."
        },
        {
            "key": "Conformers Submitted Total Number",
            "text": "Total number of conformers submitted for an ensemble. In the realm of NMR data, this represents the overall count of conformations that have been submitted or provided as part of an ensemble in the Protein Data Bank."
        },
        {
            "key": "Pdbnmrrepresentative Selection Criteria",
            "text": "Criteria employed for the selection of a representative conformer in an NMR ensemble. This variable provides details on the factors or conditions considered when choosing a single conformer to represent the ensemble in the Protein Data Bank."
        },
        {
            "key": "Struct Pdbx Model Details",
            "text": "Details related to the structural model in the PDBx format. This variable encompasses information specific to the representation and characteristics of the structural model used in the Protein Data Bank entry."
        },
        {
            "key": "Cell Volume",
            "text": "Volume of the unit cell in crystallography. This key provides information about the three-dimensional space occupied by the repeating unit in the crystal lattice, a crucial parameter for understanding the overall structure."
        },
        {
            "key": "Symspagroup Name Hall",
            "text": "Name of the space group in Hall notation. Space groups describe the symmetry elements and lattice arrangement in crystallographic structures. The Hall notation provides a unique and concise representation of these symmetry details."
        },
        {
            "key": "Em3d Fitting List",
            "text": "List of entities or components subjected to 3D fitting in electron microscopy (EM) experiments. This variable provides details about the molecular entities involved in the fitting process, contributing to the understanding of structural arrangements."
        },
        {
            "key": "Em Helical Entity",
            "text": "Information about helical entities in electron microscopy structures. This variable describes features related to helical symmetry in the biological entities under investigation, offering insights into the overall structural organization."
        },
        {
            "key": "Pdbdatstatus Status Code Cs",
            "text": "Status code associated with entries containing crystallography-related data. This code provides information on the current status or condition of the entry concerning crystallography in the Protein Data Bank."
        },
        {
            "key": "Strpdbmodel Type Details",
            "text": "Details about the type of structural model used in the Protein Data Bank entry. This variable provides information on the specific model type employed in representing the molecular structure."
        },
        {
            "key": "Pdbx Nmr Details Text",
            "text": "Textual details related to NMR experiments and data in the PDBx format. This key includes information in text form that complements and enhances the understanding of NMR-related details in the Protein Data Bank entry."
        },
        {
            "key": "Pdbnmrensemble Representative Conformer",
            "text": "The conformer selected as the representative in an NMR ensemble. This variable specifies the particular conformer chosen to represent the ensemble, offering a single, indicative structure for the entry."
        },
        {
            "key": "Maximum Lower Distance Constraint Violation",
            "text": "The maximum violation of lower distance constraints in the structure. This variable provides information about the extent to which the molecular structure deviates from specified lower distance constraints, contributing to the assessment of structural quality."
        },
        {
            "key": "Maximum Upper Distance Constraint Violation",
            "text": "The maximum violation of upper distance constraints in the structure. This variable quantifies the extent of deviation from specified upper distance constraints in the molecular structure, aiding in the evaluation of structural accuracy."
        },
        {
            "key": "Em3d Crystal Entity",
            "text": "Details about crystal entities in electron microscopy 3D reconstructions. This key encompasses information related to the crystallographic aspects of entities subjected to 3D reconstruction in electron microscopy experiments."
        },
        {
            "key": "Em Diffraction",
            "text": "Information related to diffraction experiments in electron microscopy. This variable provides insights into the diffraction-related aspects of electron microscopy experiments, contributing to the understanding of structural features in the data."
        },
        {
            "key": "Em Diffraction Shell",
            "text": "Details about diffraction shells in electron microscopy data. This variable describes specific layers or shells within the diffraction pattern, offering information about the distribution of scattering information in the data."
        },
        {
            "key": "Em Diffraction Stats",
            "text": "Statistics associated with diffraction data in electron microscopy. This key includes numerical measures and characteristics related to the diffraction pattern, providing quantitative insights into the quality and reliability of the data."
        },
        {
            "key": "Em Embedding",
            "text": "Details about embedding procedures in electron microscopy. This variable encompasses information about the methods and procedures employed for embedding biological entities in a matrix, a crucial step in sample preparation for electron microscopy."
        },
        {
            "key": "Pdbrelexp Data Set",
            "text": "The dataset associated with RELION experiments in cryo-electron microscopy. This variable provides information about the specific dataset used in RELION experiments, contributing to the reproducibility and understanding of the experimental results."
        },
        {
            "key": "Pdbsercrystallography Sample Delivery",
            "text": "Information about sample delivery methods in serial crystallography experiments. This key includes details about the techniques and procedures used to deliver samples for serial crystallography, a method employed in studying crystalline structures."
        },
        {
            "key": "Average Torsion Angle Constraint Violation",
            "text": "The average violation of torsion angle constraints in the molecular structure. This variable provides an average measure of the deviation from specified torsion angle constraints, aiding in the assessment of structural integrity."
        },
        {
            "key": "Maximum Torsion Angle Constraint Violation",
            "text": "The maximum violation of torsion angle constraints in the molecular structure. This variable quantifies the highest level of deviation from specified torsion angle constraints, providing insights into localized structural distortions."
        },
        {
            "key": "Ndb Struct Conf Na Feature Combined",
            "text": "Combined structural conformation information for nucleic acid features in the Nucleic Acid Database (NDB). This key includes details about the structural conformations of nucleic acid features, contributing to the comprehensive understanding of nucleic acid structures."
        },
        {
            "key": "Pdbsercrystallography Sample Delivery Injection",
            "text": "Details about sample delivery injection methods in serial crystallography experiments. This variable includes information about the specific techniques and procedures used for injecting samples in serial crystallography experiments."
        },
        {
            "key": "Sample Delivery Fixed Target",
            "text": "Indicates whether the sample delivery in crystallography experiments involves a fixed target. This variable provides information about whether the sample delivery is performed on a fixed target, influencing experimental conditions and data interpretation."
        },
        {
            "key": "Pdbsercrystallography Data Reduction",
            "text": "Details about data reduction procedures in serial crystallography experiments. This key encompasses information about the methods and processes employed for reducing and analyzing data obtained in serial crystallography experiments."
        },
        {
            "key": "Pdbx Serial Crystallography Measurement",
            "text": "Specifics of measurements in serial crystallography experiments, represented in the PDBx format. This variable includes information about the measurements conducted in the context of serial crystallography, contributing to the detailed characterization of experimental conditions."
        },
        {
            "key": "Em Staining",
            "text": "Details about staining procedures in electron microscopy experiments. This variable includes information about the methods and techniques employed for staining biological specimens in electron microscopy, influencing contrast and visibility in the images."
        },
        {
            "key": "Pdbdatstatus Methods Development Category",
            "text": "Indicates the category of methods development associated with the Pdbdatstatus. This field provides insights into the development stage or nature of the methods used for PDB data status assessment and management."
        },
        {
            "key": "Em2d Crystal Entity",
            "text": "Specifies the crystal entity related to Electron Microscopy 2D (EM2D) experiments. This key is crucial for understanding the structural information derived from 2D electron microscopy studies and its association with crystallographic entities."
        },
        {
            "key": "Torsion Angle Constraint Violation Method",
            "text": "Details the method employed for handling torsion angle constraints in the structural determination process. Torsion angle constraints are essential in maintaining the stereochemical quality of the modeled structures, and this key provides insights into the applied methodology."
        },
        {
            "key": "Audit Author Name",
            "text": "Specifies the name of the author responsible for auditing the PDB entry. The audit author plays a crucial role in ensuring the accuracy, reliability, and completeness of the information provided in the entry."
        },
        {
            "key": "Audit Author Pdbx Ordinal",
            "text": "Assigns an ordinal value to the audit author, providing a unique identifier for auditing purposes. This key helps in organizing and tracking the sequence of audit authors involved in the verification process."
        },
        {
            "key": "Citation Country",
            "text": "Indicates the country associated with the citation of the PDB entry. This information provides context regarding the geographical origin of the research or publication associated with the structural data."
        },
        {
            "key": "Citation Journal Abbrev",
            "text": "Specifies the abbreviated form of the journal in which the PDB entry is cited. Journal abbreviations are commonly used to reference scientific publications efficiently."
        },
        {
            "key": "Citation Journal Volume",
            "text": "Provides the volume number of the journal in which the PDB entry is cited. Volume information is essential for locating the specific issue of the journal containing the referenced article."
        },
        {
            "key": "Citation Page First",
            "text": "Specifies the page number where the cited article begins in the journal. This information aids in retrieving the full citation details for the referenced publication."
        },
        {
            "key": "Citation Page Last",
            "text": "Specifies the last page number of the cited article in the journal. Together with the 'Page First' information, it defines the page range for the referenced publication."
        },
        {
            "key": "Citation Rcsb Authors",
            "text": "Provides the names of the authors as recorded by the Research Collaboratory for Structural Bioinformatics (RCSB) in the citation. This key aids in acknowledging and attributing the contributors to the structural data."
        },
        {
            "key": "Citation Rcsb Is Primary",
            "text": "Indicates whether the cited article is considered primary by the RCSB. Primary articles are often fundamental to the understanding of the PDB entry and its structural context."
        },
        {
            "key": "Citation Rcsb Journal Abbrev",
            "text": "Specifies the abbreviated form of the journal as recognized by the RCSB. This key provides a consistent and standardized reference for the journal associated with the PDB entry."
        },
        {
            "key": "Citation Title",
            "text": "Contains the title of the cited article. The title is a critical component of the citation information, offering a concise summary of the content and focus of the referenced publication."
        },
        {
            "key": "Citation Year",
            "text": "Indicates the publication year of the cited article. This key is crucial for establishing the chronological context of the referenced work within the scientific literature."
        },
        {
            "key": "Diffrn Ambient Temp",
            "text": "Specifies the ambient temperature conditions during the diffraction experiment. Temperature is a critical factor influencing the behavior of biological macromolecules and their crystalline structures."
        },
        {
            "key": "Difpdbserial Crystal Experiment",
            "text": "Provides information related to the crystal experiment associated with the diffraction data. This key aids in linking the diffraction experiment details to the specific crystallographic aspects of the structural determination."
        },
        {
            "key": "Diffrn Ambient Temp Details",
            "text": "Offers additional details about the ambient temperature conditions during the diffraction experiment. This key may provide insights into specific temperature control methodologies employed in the experiment."
        },
        {
            "key": "Difradpdbx Scattering Type",
            "text": "Specifies the type of scattering used in the diffraction experiment. Different types of scattering (e.g., X-ray, neutron) provide unique information about the atomic structure of the biological macromolecules."
        },
        {
            "key": "Monochromatic Or Laue Ml",
            "text": "Indicates whether the diffraction experiment utilized monochromatic or Laue diffraction. This key provides information about the experimental setup and the type of diffraction employed."
        },
        {
            "key": "Diffrn Radiation Monochromator",
            "text": "Describes the monochromator used for the monochromatic diffraction experiment. The monochromator is a crucial component in controlling the wavelength of the incident radiation during diffraction studies."
        },
        {
            "key": "Difradpdbx Diffrn Protocol",
            "text": "Specifies the diffraction protocol used in the experiment, providing details about the procedural aspects of the diffraction data collection process."
        },
        {
            "key": "Exptl Method",
            "text": "Specifies the experimental method employed in the structural determination process. This key provides insights into the overall approach used to elucidate the three-dimensional structure of the biological macromolecule."
        },
        {
            "key": "Exptl Crystals Number",
            "text": "Indicates the number of crystals used in the experimental process. Multiple crystals may be employed to enhance data quality and provide a more comprehensive understanding of the macromolecular structure."
        },
        {
            "key": "Exptl Details",
            "text": "Provides additional details about the experimental methodology. This key may include specific techniques, protocols, or conditions used during the structural determination process."
        },
        {
            "key": "Exptl Crystal Density Matthews",
            "text": "Specifies the crystal density calculated using the Matthews coefficient. The Matthews coefficient is a measure of the solvent content in the crystal and is essential for interpreting crystallographic data."
        },
        {
            "key": "Expcrydensity Percent Sol",
            "text": "Indicates the percentage of solvent content in the crystal. Solvent content is a critical factor in crystallography and affects the quality and resolution of the obtained structural data."
        },
        {
            "key": "Exptl Crystal Description",
            "text": "Offers a description of the crystal used in the experiment. This key provides qualitative information about the crystal, such as its size, quality, and any distinctive features observed during the experiment."
        },
        {
            "key": "Exptl Crystal Pdbx Mosaicity",
            "text": "Specifies the mosaicity of the crystal in the PDBx format. Mosaicity is a measure of the spread of crystal misorientations and is crucial for assessing the crystal quality in X-ray crystallography."
        },
        {
            "key": "Exptl Crystal Density Meas",
            "text": "Specifies the measured crystal density, providing quantitative information about the distribution of electron density in the crystal lattice. This key contributes to the overall assessment of structural quality."
        },
        {
            "key": "Expcrypdbx Mosaicity Esd",
            "text": "Indicates the estimated standard deviation (ESD) of the mosaicity in the PDBx format. The ESD provides a measure of uncertainty associated with the reported mosaicity value."
        },
        {
            "key": "Details Data Content Type",
            "text": "Specifies the data content type in detailed information. This key may indicate the nature of the information provided, such as experimental details, refinement data, or other specific content types."
        },
        {
            "key": "Pdbaudrevision Details Ordinal",
            "text": "Assigns an ordinal value to the details of the audit revision, providing a unique identifier for organizing and tracking the sequence of revisions made during the audit process."
        },
        {
            "key": "Pdbaudrevision Details Provider",
            "text": "Specifies the provider of the details for the audit revision. This key identifies the entity or individual responsible for supplying the specific details associated with the audit revision."
        },
        {
            "key": "Pdbaudrevision Details Revision Ordinal",
            "text": "Assigns an ordinal value to the revision details within the audit revision. This key aids in organizing and tracking the sequence of revisions made to the audit details."
        },
        {
            "key": "Pdbaudrevision Details Type",
            "text": "Specifies the type or category of details associated with the audit revision. This key provides insights into the nature of the information being revised during the audit process."
        },
        {
            "key": "Group Data Content Type",
            "text": "Specifies the data content type at the group level. This key may indicate the nature of the information provided for a specific group, allowing for organized and categorized data representation."
        },
        {
            "key": "Pdbaudrevision Group Group",
            "text": "The group associated with the PDB audit revision. It categorizes the revision details into specific groups."
        },
        {
            "key": "Pdbaudrevision Group Ordinal",
            "text": "The ordinal number assigned to the audit revision group, providing its sequential position in the overall revision structure."
        },
        {
            "key": "Pdbaudrevision Group Revision Ordinal",
            "text": "The ordinal number assigned to the audit revision within its specific group, indicating its position in the group's revision sequence."
        },
        {
            "key": "History Data Content Type",
            "text": "Specifies the content type of historical data associated with the audit revision, offering insights into the nature of the stored information."
        },
        {
            "key": "Pdbaudrevision History Major Revision",
            "text": "Indicates the major revision number associated with the audit revision in its historical context, signifying significant changes."
        },
        {
            "key": "Pdbaudrevision History Minor Revision",
            "text": "Specifies the minor revision number associated with the audit revision in its historical context, indicating smaller-scale changes or updates."
        },
        {
            "key": "Pdbaudrevision History Ordinal",
            "text": "The ordinal number assigned to the historical data within the audit revision, providing its sequential position in the revision history."
        },
        {
            "key": "Pdbaudrevision History Revision Date",
            "text": "Indicates the date of the revision within the historical context, offering a chronological reference point for the revision's occurrence."
        },
        {
            "key": "Refine Details",
            "text": "Provides detailed information about the refinement process, encompassing various parameters and methodologies used in structural refinement."
        },
        {
            "key": "Refine Ls Rfactor Rfree",
            "text": "Specifies the R-factor (free) in the least-squares refinement, representing the agreement between observed and calculated data for the free set of reflections."
        },
        {
            "key": "Refine Ls Rfactor Rwork",
            "text": "Specifies the R-factor (work) in the least-squares refinement, representing the agreement between observed and calculated data for the working set of reflections."
        },
        {
            "key": "Refine Ls Rfactor Obs",
            "text": "Specifies the observed R-factor in the least-squares refinement, providing information about the agreement between observed and calculated data."
        },
        {
            "key": "Refine Ls Dres High",
            "text": "Specifies the high-resolution limit used in the least-squares refinement process, influencing the precision of the refined structural model."
        },
        {
            "key": "Refine Ls Dres Low",
            "text": "Specifies the low-resolution limit used in the least-squares refinement process, influencing the precision of the refined structural model."
        },
        {
            "key": "Reflsnumber Reflns Obs",
            "text": "Specifies the number of observed reflections in the refinement process, providing insights into the quantity of experimental data utilized."
        },
        {
            "key": "Refpdbls Sigma F",
            "text": "Indicates the standard deviation of the structure factor amplitudes in the refinement process, offering information about the precision of the experimental data."
        },
        {
            "key": "Reflspercent Reflns Rfree",
            "text": "Specifies the percentage of reflections used for the calculation of the R-free value in the refinement process, offering insights into the validation strategy."
        },
        {
            "key": "Reflspercent Reflns Obs",
            "text": "Specifies the percentage of observed reflections utilized in the refinement process, providing information about the completeness of the experimental data."
        },
        {
            "key": "Refine Biso Mean",
            "text": "Represents the mean isotropic B-factor value in the refinement process, providing insights into the average thermal motion of atoms in the structure."
        },
        {
            "key": "Reflsnumber Reflns Rfree",
            "text": "Specifies the number of reflections used for the calculation of the R-free value in the refinement process, contributing to the assessment of model quality."
        },
        {
            "key": "Refpdbrfree Selection Details",
            "text": "Provides detailed information about the selection process for reflections used in the calculation of R-free, contributing to the transparency of the refinement procedure."
        },
        {
            "key": "Refpdbls Cross Valid Method",
            "text": "Indicates the method used for cross-validation in the refinement process, providing information about the approach to validating the refined structural model."
        },
        {
            "key": "Refpdbmethod To Determine Struct",
            "text": "Specifies the method used to determine the overall structure in the refinement process, offering insights into the chosen structural determination approach."
        },
        {
            "key": "Refine Aniso B11",
            "text": "Specifies the anisotropic B-factor parameter (B11) in the refinement process, providing information about the directional variation of thermal motion for atoms."
        },
        {
            "key": "Refine Aniso B12",
            "text": "Specifies the anisotropic B-factor parameter (B12) in the refinement process, providing information about the directional variation of thermal motion for atoms."
        },
        {
            "key": "Refine Aniso B13",
            "text": "Specifies the anisotropic B-factor parameter (B13) in the refinement process, providing information about the directional variation of thermal motion for atoms."
        },
        {
            "key": "Refine Aniso B22",
            "text": "Specifies the anisotropic B-factor parameter (B22) in the refinement process, providing information about the directional variation of thermal motion for atoms."
        },
        {
            "key": "Refine Aniso B23",
            "text": "Specifies the anisotropic B-factor parameter (B23) in the refinement process, providing information about the directional variation of thermal motion for atoms."
        },
        {
            "key": "Refine Aniso B33",
            "text": "Specifies the anisotropic B-factor parameter (B33) in the refinement process, providing information about the directional variation of thermal motion for atoms."
        },
        {
            "key": "Reflsrfactor Rfree Error",
            "text": "Specifies the error associated with the R-free value in the refinement process, providing insights into the uncertainty of the model quality assessment."
        },
        {
            "key": "Refine Ls Rfactor All",
            "text": "Specifies the overall R-factor in the least-squares refinement, representing the agreement between observed and calculated data for all reflections."
        },
        {
            "key": "Reflsnumber Reflns All",
            "text": "Specifies the total number of reflections used in the refinement process, providing insights into the overall quantity of experimental data utilized."
        },
        {
            "key": "Cutoff High Abs F",
            "text": "Defines the high absolute F (structure factor amplitude) cutoff in the refinement process, influencing the inclusion or exclusion of reflections based on amplitude."
        },
        {
            "key": "Cutoff Low Abs F",
            "text": "Defines the low absolute F (structure factor amplitude) cutoff in the refinement process, influencing the inclusion or exclusion of reflections based on amplitude."
        },
        {
            "key": "Refpdbisotropic Thermal Model",
            "text": "Indicates the isotropic thermal model used in the refinement process for characterizing the thermal motion of atoms."
        },
        {
            "key": "Refine Solvent Model Details",
            "text": "Provides detailed information about the solvent model employed in the refinement process, offering insights into the treatment of solvent molecules."
        },
        {
            "key": "Refsolmodel Param Bsol",
            "text": "Specifies the B-factor parameter associated with solvent atoms in the refinement process, influencing the thermal motion characterization of solvent molecules."
        },
        {
            "key": "Refsolmodel Param Ksol",
            "text": "Specifies the scaling factor parameter associated with solvent atoms in the refinement process, influencing their contribution to the overall model."
        },
        {
            "key": "Refpdbls Sigma I",
            "text": "Indicates the standard deviation of the structure factor intensities in the refinement process, offering information about the precision of the experimental data."
        },
        {
            "key": "Refpdbstereochemistry Target Values",
            "text": "Specifies the target values for stereochemical parameters in the refinement process, providing information about the desired geometric characteristics of the refined model."
        },
        {
            "key": "Refine Pdbx Starting Model",
            "text": "Specifies the starting model used in the refinement process, offering insights into the initial structural representation before refinement iterations."
        },
        {
            "key": "Refcorcoeff Fo To Fc",
            "text": "Specifies the correlation coefficient between observed and calculated structure factor amplitudes (Fo to Fc) in the refinement process."
        },
        {
            "key": "Fo To Fc Free",
            "text": "Specifies the subset of reflections used in the calculation of the correlation coefficient between observed and calculated structure factor amplitudes (Fo to Fc), representing the free set."
        },
        {
            "key": "Refine Overall Sub",
            "text": "Specifies the overall subset used in the refinement process, influencing the selection of reflections for the calculation of various refinement parameters."
        },
        {
            "key": "Refine Overall Suml",
            "text": "Specifies the overall sum of reflections used in the refinement process, providing insights into the total quantity of reflections considered for refinement calculations."
        },
        {
            "key": "Refine Pdbx Overall Esurfree",
            "text": "Specifies the overall ESU R-free value in the PDBx format, offering insights into the estimated standard uncertainties of the refined model."
        },
        {
            "key": "Refpdbsolvent Ion Probe Radii",
            "text": "Specifies the probe radii used for modeling ions in the solvent during the refinement process, influencing the inclusion of ion-related features in the model."
        },
        {
            "key": "Refpdbsolvent Shrinkage Radii",
            "text": "Specifies the shrinkage radii used in modeling solvent molecules during the refinement process, influencing their effective size in the refined model."
        },
        {
            "key": "Refpdbsolvent Vdw Probe Radii",
            "text": "Specifies the van der Waals probe radii used for modeling solvent molecules during the refinement process, influencing their inclusion in the refined model."
        },
        {
            "key": "Reflsnumber Reflns Rwork",
            "text": "Specifies the number of reflections used for the calculation of the R-work value in the refinement process, contributing to the assessment of model quality."
        },
        {
            "key": "Refpdboverall Phase Error",
            "text": "Specifies the phase error associated with the overall refinement process, providing insights into the accuracy of the refined model's phase information."
        },
        {
            "key": "Refine Biso Max",
            "text": "Specifies the maximum isotropic B-factor value in the refinement process, offering insights into the highest thermal motion observed for atoms in the structure."
        },
        {
            "key": "Refine Biso Min",
            "text": "Specifies the minimum isotropic B-factor value in the refinement process, offering insights into the lowest thermal motion observed for atoms in the structure."
        },
        {"key": "Refine Pdbx Overall Esur", "text": "Overall restrained S value with respect to the expected S value."},
        {"key": "Refine Occupancy Max", "text": "Maximum occupancy refinement value."},
        {"key": "Refine Occupancy Min", "text": "Minimum occupancy refinement value."},
        {"key": "Refine Pdbx Tlsresidual Adpflag", "text": "Anisotropic displacement parameter (ADP) refinement flag for TLS residual."},
        {"key": "Refine Overall Surcruickshank Dpi", "text": "Overall electron density fit to the atomic model using SurCruickshank difference density."},
        {"key": "Refpdboverall Surblow Dpi", "text": "Overall electron density fit to the atomic model using SurBlow difference density."},
        {"key": "Refpdboverall Surfree Blow Dpi", "text": "Overall free electron density fit to the atomic model using SurFreeBlow difference density."},
        {"key": "Refpdboverall Surfree Cruickshank Dpi", "text": "Overall free electron density fit to the atomic model using SurFreeCruickshank difference density."},
        {"key": "Refine Overall Fomwork Rset", "text": "Overall figure of merit (FOM) working set value."},
        {"key": "Cutoff High Rms Abs F", "text": "High cutoff value for root-mean-square absolute structure factor amplitude."},
        {"key": "Refine Ls Wrfactor Rfree", "text": "Weighted R-factor for the free set of reflections during least-squares refinement."},
        {"key": "Refine Ls Wrfactor Rwork", "text": "Weighted R-factor for the working set of reflections during least-squares refinement."},
        {"key": "Refine Overall Surfree", "text": "Overall free electron density fit to the atomic model."},
        {"key": "Refpdbaverage Fsc Free", "text": "Free set fraction of the average Fourier shell correlation (FSC)."},
        {"key": "Refpdbaverage Fsc Work", "text": "Working set fraction of the average Fourier shell correlation (FSC)."},
        {"key": "Refine Ls Number Parameters", "text": "Number of refined parameters during least-squares refinement."},
        {"key": "Refine Ls Number Restraints", "text": "Number of restraints applied during least-squares refinement."},
        {"key": "Refhisd Res High", "text": "High resolution limit for histograms of the input data."},
        {"key": "Refhisd Res Low", "text": "Low resolution limit for histograms of the input data."},
        {"key": "Refhisnumber Atoms Solvent", "text": "Number of atoms in the solvent region."},
        {"key": "Refhisnumber Atoms Total", "text": "Total number of atoms."},
        {"key": "Refhispdbx Number Atoms Ligand", "text": "Number of atoms in the ligand region according to PDBx."},
        {"key": "Number Atoms Nucleic Acid", "text": "Total number of atoms in the nucleic acid region."},
        {"key": "Refhispdbx Number Atoms Protein", "text": "Number of atoms in the protein region according to PDBx."},
        {"key": "Refhispdbx Biso Mean Ligand", "text": "Mean isotropic temperature factor (B-factor) for atoms in the ligand region according to PDBx."},
        {"key": "Refhispdbx Number Residues Total", "text": "Total number of residues according to PDBx."},
        {"key": "Refhispdbx Biso Mean Solvent", "text": "Mean isotropic temperature factor (B-factor) for atoms in the solvent region according to PDBx."},
        {"key": "Software Classification", "text": "Classification of the software used in the structural determination process."},
        {"key": "Software Name", "text": "Name of the software used in the structural determination process."},
        {"key": "Software Pdbx Ordinal", "text": "Ordinal number associated with the software in PDBx."},
        {"key": "Software Version", "text": "Version of the software used in the structural determination process."},
        {"key": "Difdetpdbx Collection Date", "text": "Collection date of diffraction data according to PDBx."},
        {"key": "Diffrn Detector Detector", "text": "Type of detector used in the diffraction experiment."},
        {"key": "Diffrn Detector Type", "text": "Type of detector used in the diffraction experiment."},
        {"key": "Diffrn Detector Details", "text": "Details about the detector used in the diffraction experiment."},
        {"key": "Diffrn Detector Pdbx Frequency", "text": "Frequency of the detector used in the diffraction experiment according to PDBx."},
        {"key": "Pdbaudrevision Category Category", "text": "Category associated with the audit revision in PDB audit revision."},
        {"key": "Category Data Content Type", "text": "Data content type associated with the category."},
        {"key": "Pdbaudrevision Category Ordinal", "text": "Ordinal number associated with the category in PDB audit revision."},
        {"key": "Pdbaudrevision Category Revision Ordinal", "text": "Revision ordinal number associated with the category in PDB audit revision."},
        {"key": "Item Data Content Type", "text": "Data content type associated with the item."},
        {"key": "Pdbaudrevision Item Item", "text": "Item associated with the audit revision in PDB audit revision."},
        {"key": "Pdbaudrevision Item Ordinal", "text": "Ordinal number associated with the item in PDB audit revision."},
        {"key": "Pdbaudrevision Item Revision Ordinal", "text": "Revision ordinal number associated with the item in PDB audit revision."},
        {"key": "Refanaluzzati Coordinate Error Obs", "text": "Coordinate error in the observed data during analysis."},
        {"key": "Refanaluzzati Coordinate Error Free", "text": "Coordinate error in the free data during analysis."},
        {"key": "Refanaluzzati Dres Low Obs", "text": "Low resolution limit for the observed data during analysis."},
        {"key": "Refanaluzzati Sigma Afree", "text": "Sigma value for the free set of reflections during analysis."},
        {"key": "Refanaluzzati Sigma Aobs", "text": "Sigma value for the observed set of reflections during analysis."},
        {"key": "Luzzati Dres High Obs", "text": "High resolution limit for the observed data during Luzzati coordinate error analysis."},
        {"key": "Refananumber Disordered Residues", "text": "Number of disordered residues during analysis."},
        {"key": "Refanaoccupancy Sum Hydrogen", "text": "Sum of hydrogen occupancies during analysis."},
        {"key": "Refanaoccupancy Sum Non Hydrogen", "text": "Sum of non-hydrogen occupancies during analysis."},
        {"key": "Reflns D Resolution High", "text": "High resolution limit for reflections."},
        {"key": "Reflns D Resolution Low", "text": "Low resolution limit for reflections."},
        {"key": "Reflns Number Obs", "text": "Number of observed reflections."},
        {"key": "Refobscriterion Sigma I", "text": "Sigma I value for the observed set of reflections."},
        {"key": "Reflns Pdbx Rmerge Iobs", "text": "Rmerge value for the observed set of reflections according to PDBx."},
        {"key": "Reflns Pdbx Ordinal", "text": "Ordinal number associated with reflections in PDBx."},
        {"key": "Reflns Pdbx Redundancy", "text": "Redundancy of reflections according to PDBx."},
        {"key": "Reflns Percent Possible Obs", "text": "Percentage of possible observed reflections."},
        {"key": "Reflns Number All", "text": "Total number of reflections, including observed and possible reflections."},
        {"key": "Refobscriterion Sigma F", "text": "Sigma F value for the observed set of reflections."},
        {"key": "Refpdbnet Iover Sigma I", "text": "I/sigma(I) value for the observed set of reflections in the PDB network."},
        {"key": "Reflns Biso Wilson Estimate", "text": "Wilson B-factor estimate for isotropic temperature factors."},
        {"key": "Reflns Pdbx Cchalf", "text": "CCHALF value for the observed set of reflections according to PDBx."},
        {"key": "Reflns Pdbx Rpim Iall", "text": "RPIM value for all reflections according to PDBx."},
        {"key": "Reflns Pdbx Rsym Value", "text": "RSYM value for the observed set of reflections according to PDBx."},
        {"key": "Reflns Pdbx Rrim Iall", "text": "RRIM value for all reflections according to PDBx."},
        {"key": "Refpdbnumber Measured All", "text": "Total number of measured reflections, including all types."},
        {"key": "Reflns Pdbx Scaling Rejects", "text": "Number of rejected reflections during scaling according to PDBx."},
        {"key": "Reflns Pdbx Chi Squared", "text": "Chi-squared value for the observed set of reflections according to PDBx."},
        {"key": "Iover Av Sigma I", "text": "Average I/sigma(I) value."},
        {"key": "Reflns Limit Hmax", "text": "Maximum limit for H during reflections."},
        {"key": "Reflns Limit Hmin", "text": "Minimum limit for H during reflections."},
        {"key": "Reflns Limit Kmax", "text": "Maximum limit for K during reflections."},
        {"key": "Reflns Limit Kmin", "text": "Minimum limit for K during reflections."},
        {"key": "Reflns Limit Lmax", "text": "Maximum limit for L during reflections."},
        {"key": "Reflns Limit Lmin", "text": "Minimum limit for L during reflections."},
        {"key": "Reflns Observed Criterion Fmax", "text": "Maximum observed criterion F value."},
        {"key": "Reflns Observed Criterion Fmin", "text": "Minimum observed criterion F value."},
        {
            "key": "Reflns Pdbx Rsplit",
            "text": "Reflns Pdbx Rsplit represents the R-split value for reflections in the PDBx format. It is a metric used in crystallography to assess the reliability of the refined structural model. The R-split value indicates the consistency between two sets of data, providing insights into the quality of the crystallographic data during refinement."
        },
        {
            "key": "Reflns Rmerge Fobs",
            "text": "Reflns Rmerge Fobs is a parameter that quantifies the agreement between observed and calculated structure factor amplitudes in crystallography. This metric, often expressed as a percentage, assesses the quality of diffraction data. A lower Rmerge Fobs value indicates better agreement, reflecting higher data precision and reliability in the structural analysis."
        },
        {
            "key": "Rcsb Binding Affinity Type",
            "text": "Rcsb Binding Affinity Type describes the type or nature of binding affinity associated with a molecular interaction. It provides information about the specific interaction between molecules, such as whether it is an agonist, antagonist, or other types of binding. Understanding binding affinity types is crucial in drug discovery and molecular biology, guiding researchers in characterizing the nature of biomolecular interactions."
        },
        {
            "key": "Rcsb Binding Affinity Value",
            "text": "Rcsb Binding Affinity Value denotes the numerical measure representing the strength of binding affinity between molecules. This quantitative value provides insights into the intensity of molecular interactions, particularly in the context of ligand-receptor binding. Higher affinity values indicate stronger interactions, impacting the efficacy of drugs or the stability of biomolecular complexes."
        },
        {
            "key": "Rcsb Binding Affinity Unit",
            "text": "Rcsb Binding Affinity Unit specifies the unit of measurement associated with the binding affinity value. Common units include nanomolar (nM) or micromolar (μM), representing the concentration at which half-maximal binding occurs. Understanding the unit is crucial for interpreting the quantitative aspects of molecular interactions, aiding researchers in assessing the biological relevance of binding affinities."
        },
        {
            "key": "Rcsbinaffinity Provenance Code",
            "text": "Rcsbinaffinity Provenance Code indicates the code or source of provenance information related to binding affinity data. Provenance codes help trace the origin and reliability of data, ensuring transparency and reproducibility in scientific research. Researchers can use this information to validate and contextualize binding affinity values, enhancing the reliability of molecular interaction data."
        },
        {
            "key": "Rcsb Binding Affinity Link",
            "text": "Rcsb Binding Affinity Link provides a link or reference to additional information related to binding affinity. This link connects researchers to relevant databases, literature, or resources that offer detailed insights into the molecular interactions and associated binding affinity data. It facilitates comprehensive exploration and validation of binding affinity information."
        },
        {
            "key": "Rcsb Binding Affinity Symbol",
            "text": "Rcsb Binding Affinity Symbol represents a symbol or notation associated with binding affinity data. This symbolic representation conveys specific characteristics or features of the binding interaction, aiding researchers in quickly interpreting and categorizing molecular interactions. Symbols may denote affinity strength, binding kinetics, or other relevant attributes, contributing to efficient data communication in the field of molecular biology."
        },
        {
            "key": "Diffrn Source Pdbx Wavelength",
            "text": "Diffrn Source Pdbx Wavelength specifies the wavelength of the radiation source used in diffraction experiments, expressed in angstroms. This information is critical for understanding the characteristics of the X-ray or neutron radiation employed, influencing the diffraction pattern and data quality. Accurate knowledge of the wavelength is essential for precise structural determination in crystallography."
        },
        {
            "key": "Diffrn Source Source",
            "text": "Diffrn Source Source describes the source of radiation utilized in diffraction experiments. Common sources include synchrotrons, X-ray tubes, or neutron generators. The type of radiation source significantly impacts the quality and resolution of diffraction data, influencing the accuracy of structural models obtained through crystallography."
        },
        {
            "key": "Diffrn Source Type",
            "text": "Diffrn Source Type specifies the type or nature of the radiation source employed in diffraction experiments. Different sources, such as synchrotrons or laboratory-based X-ray tubes, have distinct characteristics that influence the diffraction pattern and data quality. Understanding the source type is crucial for researchers in optimizing experimental conditions for structural determination."
        },
        {
            "key": "Difsoupdbx Synchrotron Beamline",
            "text": "Difsoupdbx Synchrotron Beamline refers to the specific beamline used at a synchrotron facility in diffractometry experiments. Synchrotron beamlines are instrumental in producing intense and focused X-ray beams for crystallography. Knowledge of the beamline facilitates reproducibility and traceability in experiments, ensuring consistency in data collection and analysis."
        },
        {
            "key": "Difsoupdbx Synchrotron Site",
            "text": "Difsoupdbx Synchrotron Site designates the synchrotron facility where diffractometry experiments were conducted. Synchrotron sites are specialized research centers equipped with advanced X-ray sources for crystallographic studies. Identifying the synchrotron site is crucial for understanding experimental conditions and ensuring data quality and reliability."
        },
        {
            "key": "Difsoupdbx Wavelength List",
            "text": "Difsoupdbx Wavelength List provides a list of wavelengths used in diffractometry experiments, offering a comprehensive overview of the radiation spectra employed. This information aids researchers in optimizing experimental conditions and assessing the influence of different wavelengths on data quality. Wavelength diversity contributes to the versatility of crystallographic studies."
        },
        {
            "key": "Exptl Crystal Grow Method",
            "text": "Exptl Crystal Grow Method describes the methodology employed for growing crystals in experimental crystallography. Crystal growth methods significantly impact the quality and size of crystals, affecting the success of X-ray or neutron diffraction experiments. Researchers utilize various techniques to optimize crystal growth for accurate structural determination."
        },
        {
            "key": "Expcrygrow P H",
            "text": "Expcrygrow P H provides information about the pH conditions during the experimental crystal growth process. pH influences the solubility and stability of macromolecules, affecting crystal growth and quality. Accurate control of pH is crucial for reproducibility and reliability in experimental crystallography, ensuring the success of structural studies."
        },
        {
            "key": "Expcrygrow Pdbx Details",
            "text": "Expcrygrow Pdbx Details offers additional details related to the experimental crystal growth process in the PDBx format. These details may include specific protocols, conditions, or parameters employed during crystal growth. The PDBx format ensures standardized representation and exchange of experimental information, facilitating collaboration and data sharing."
        },
        {
            "key": "Exptl Crystal Grow Temp",
            "text": "Exptl Crystal Grow Temp denotes the temperature conditions during experimental crystal growth in crystallography. Temperature plays a critical role in the kinetics of crystal growth, impacting crystal size and quality. Accurate control of temperature is essential for reproducibility and success in structural determination experiments."
        },
        {
            "key": "Expcrygrow Temp Details",
            "text": "Expcrygrow Temp Details provides specific details related to temperature conditions during experimental crystal growth. These details may include temperature ranges, variations, or specific protocols followed. Precise control and documentation of temperature parameters ensure consistency and reliability in experimental crystallography studies."
        },
        {
            "key": "Expcrygrow Pdbx Phrange",
            "text": "Expcrygrow Pdbx Phrange specifies the pH range during experimental crystal growth in the PDBx format. pH influences the chemical environment of macromolecules, impacting their crystallization. The PDBx format ensures standardized representation of pH-related information, facilitating interoperability and comprehensive understanding of experimental conditions."
        },
        {
            "key": "Refshed Res High",
            "text": "Refshed Res High represents the high-resolution limit in the refinement of crystallographic structures. This parameter indicates the highest resolution shell used in the refinement process. A lower high-resolution limit often results in more conservative refinement, providing reliable structural information in regions of higher data quality."
        },
        {
            "key": "Refshed Res Low",
            "text": "Refshed Res Low signifies the low-resolution limit in the refinement of crystallographic structures. This parameter indicates the lowest resolution shell used in the refinement process. A higher low-resolution limit allows inclusion of lower-quality data, providing a comprehensive representation of the entire diffraction pattern during refinement."
        },
        {
            "key": "Reflns Shell Pdbx Ordinal",
            "text": "Ordinal number assigned to a shell of reflections in the PDBx format. Provides the position or order of the shell in the data."
        },
        {
            "key": "Reflns Shell Rmerge Iobs",
            "text": "Rmerge for the observed intensities in a shell. Rmerge is a statistical indicator of data quality, representing the degree of agreement between multiple measurements."
        },
        {
            "key": "Refshenumber Unique All",
            "text": "Number of unique reflections in a shell considering all measurements. Provides information on the diversity of reflections in the dataset."
        },
        {
            "key": "Refshepercent Possible All",
            "text": "Percentage of possible reflections in a shell considering all measurements. Indicates the completeness of the data in the shell."
        },
        {
            "key": "Reflns Shell Pdbx Redundancy",
            "text": "Redundancy of reflections in a shell in the PDBx format. Reflects the number of times each unique reflection is measured in the shell."
        },
        {
            "key": "Refshemean Iover Sig Iobs",
            "text": "Mean value of the Iover Sig Iobs ratio for reflections in a shell. Provides information on the quality of the observed intensities."
        },
        {
            "key": "Refshenumber Unique Obs",
            "text": "Number of unique observed reflections in a shell. Represents the count of distinct reflections that have been observed in the dataset."
        },
        {
            "key": "Reflns Shell Pdbx Cchalf",
            "text": "Cchalf value for reflections in a shell in the PDBx format. Cchalf is a measure of the correlation between random half-datasets."
        },
        {
            "key": "Refshepdbx Rpim Iall",
            "text": "Rpim value for all reflections in a shell in the PDBx format. Rpim is a precision indicator for the intensity data."
        },
        {
            "key": "Refshepdbx Rsym Value",
            "text": "Rsym value for reflections in a shell in the PDBx format. Rsym measures the systematic errors in the intensity data."
        },
        {
            "key": "Refshepdbx Rrim Iall",
            "text": "Rrim value for all reflections in a shell in the PDBx format. Rrim is a measure of the reliability of the intensity data."
        },
        {
            "key": "Refshenumber Measured All",
            "text": "Number of measured reflections in a shell considering all measurements. Represents the count of reflections that have been experimentally measured."
        },
        {
            "key": "Refshepercent Possible Obs",
            "text": "Percentage of possible reflections in a shell considering only observed measurements. Indicates the completeness of the observed data in the shell."
        },
        {
            "key": "Refshepdbx Chi Squared",
            "text": "Chi-squared value for reflections in a shell in the PDBx format. Chi-squared assesses the agreement between observed and calculated structure factors."
        },
        {
            "key": "Refshenumber Measured Obs",
            "text": "Number of measured reflections in a shell considering only observed measurements. Represents the count of observed reflections in the dataset."
        },
        {
            "key": "Reflns Shell Pdbx Rsplit",
            "text": "Rsplit value for reflections in a shell in the PDBx format. Rsplit assesses the consistency of measurements by comparing subsets of the data."
        },
        {
            "key": "Reflns Shell Number Possible",
            "text": "Number of possible reflections in a shell. Represents the total count of reflections that could be measured in the dataset."
        },
        {
            "key": "Net Iover Sigma Iobs",
            "text": "Net Iover Sigma Iobs ratio. Provides information on the signal-to-noise ratio in the intensity data."
        },
        {
            "key": "Pdbdatrelated Content Type",
            "text": "Content type related to PDB data. Specifies the nature or category of the content associated with the PDB entry."
        },
        {
            "key": "Pdbdatrelated Db Name",
            "text": "Database name related to PDB data. Indicates the name of the database associated with the PDB entry."
        },
        {
            "key": "Pdbx Database Related Details",
            "text": "Details related to the PDBx database. Provides additional information or specifics about the association with the PDBx database."
        },
        {
            "key": "Pdbinirefinement Model Accession Code",
            "text": "Accession code for the model obtained during initial refinement. Offers a unique identifier for the refined model."
        },
        {
            "key": "Pdbinirefinement Model Source Name",
            "text": "Name of the source providing the initial refined model. Specifies the origin or contributor of the initial refined structural model."
        },
        {
            "key": "Pdbinirefinement Model Type",
            "text": "Type of the initial refined model. Indicates the nature or category of the structural model obtained during the initial refinement process."
        },
        {
            "key": "Pdbinirefinement Model Details",
            "text": "Details related to the initial refined model. Provides additional information or specifics about the characteristics of the initial refined structural model."
        },
        {
            "key": "Pdbx Reflns Twin Fraction",
            "text": "Fraction of twinned reflections in the PDBx format. Represents the proportion of reflections affected by twinning in the dataset."
        },
        {
            "key": "Pdbx Reflns Twin Operator",
            "text": "Twin operator details in the PDBx format. Specifies the mathematical operator or transformation associated with twinning in the crystal lattice."
        },
        {
            "key": "Pdbx Reflns Twin Type",
            "text": "Type of twinning specified in the PDBx format. Indicates the specific category or nature of twinning observed in the crystal structure."
        },
        {
            "key": "Pdbx Audit Support Country",
            "text": "Country information related to audit support in the PDBx format. Specifies the country associated with the audit support process."
        },
        {
            "key": "Pdbaudsupport Funding Organization",
            "text": "Funding organization providing support for the audit. Specifies the organization or entity offering financial support for the audit process."
        },
        {
            "key": "Pdbaudsupport Grant Number",
            "text": "Grant number associated with the funding organization. Provides a unique identifier for the grant supporting the audit process."
        },
        {
            "key": "Pdbx Audit Support Ordinal",
            "text": "Ordinal number assigned to audit support in the PDBx format. Provides the order or position of the audit support in the dataset."
        },
        {
            "key": "Pdbdatpdbobs Spr Date",
            "text": "SPR (Structure Publication Release) date for PDB observations. Marks the date of release for structural observations in the Protein Data Bank."
        },
        {
            "key": "Pdbsgpfull Name Of Center",
            "text": "Full name of the center submitting data to the PDBSGP (Protein Data Bank Singapore) database. Specifies the name of the contributing center."
        },
        {
            "key": "Pdbsgpinitial Of Center",
            "text": "Initials or acronym of the center submitting data to the PDBSGP database. Provides a shortened representation of the contributing center's name."
        },
        {
            "key": "Pdbx Sgproject Project Name",
            "text": "Project name associated with the PDBx space group information. Specifies the name or title of the project related to space group data."
        },
        {
            "key": "Em3d Fitting Ref Protocol",
            "text": "Fitting reference protocol for EM3D (Electron Microscopy 3D) data. Describes the methodology or protocol used for fitting reference structures in electron microscopy 3D reconstructions."
        },
        {
            "key": "Em3d Fitting Details",
            "text": "Details related to the fitting of reference structures in EM3D data. Provides additional information or specifics about the process of fitting references in electron microscopy 3D reconstructions."
        },
        {
            "key": "Em3d Fitting Ref Space",
            "text": "Space used for reference in 3D fitting during electron microscopy. The reference space is crucial for aligning and fitting experimental data to a known structure, aiding in the reconstruction of 3D models."
        },
        {
            "key": "Em3d Fitting Target Criteria",
            "text": "Criteria used for target selection during 3D fitting in electron microscopy. This involves determining the specific features or characteristics that the fitting algorithm aims to optimize, influencing the quality and accuracy of the final 3D reconstruction."
        },
        {
            "key": "Em3d Fitting Overall Bvalue",
            "text": "Overall B-value used in 3D fitting during electron microscopy. B-value, or temperature factor, is a measure of the thermal motion of atoms. It influences the flexibility of the fitted model, impacting the refinement process and the final 3D structure."
        },
        {
            "key": "Em3d Reconstruction Num Particles",
            "text": "Number of particles involved in 3D reconstruction during electron microscopy. The quantity of particles contributes to the overall data quality and influences the robustness of the reconstructed 3D model."
        },
        {
            "key": "Em3d Reconstruction Resolution",
            "text": "Resolution achieved in 3D reconstruction during electron microscopy. Resolution represents the level of detail captured in the reconstructed 3D model, with higher values indicating finer details and improved structural accuracy."
        },
        {
            "key": "Em3d Reconstruction Resolution Method",
            "text": "Method employed for determining resolution in 3D reconstruction during electron microscopy. The resolution method outlines the approach used to assess the quality and precision of the reconstructed 3D structure."
        },
        {
            "key": "Em3d Reconstruction Symmetry Type",
            "text": "Type of symmetry applied in 3D reconstruction during electron microscopy. Symmetry operations play a critical role in aligning and merging particle data, enhancing the reliability and efficiency of the reconstruction process."
        },
        {
            "key": "Em3d Reconstruction Algorithm",
            "text": "Algorithm utilized for 3D reconstruction during electron microscopy. The reconstruction algorithm dictates the mathematical and computational methods employed to transform 2D images into a detailed 3D model."
        },
        {
            "key": "Em3recnum Class Averages",
            "text": "Number of class averages generated in electron microscopy 3D reconstruction. Class averages represent grouped particles with similar characteristics, aiding in the refinement of the final 3D structure."
        },
        {
            "key": "Em3recactual Pixel Size",
            "text": "Actual pixel size used in electron microscopy 3D reconstruction. Pixel size is a critical parameter influencing the spatial resolution of the reconstructed 3D model."
        },
        {
            "key": "Em3d Reconstruction Details",
            "text": "Additional details regarding the process and parameters used in electron microscopy 3D reconstruction. This encompasses a comprehensive description of the methodologies employed and any specific conditions applied during reconstruction."
        },
        {
            "key": "Em3d Reconstruction Method",
            "text": "Methodology employed for electron microscopy 3D reconstruction. This describes the step-by-step approach and techniques used to transform 2D projections into a detailed 3D structural model."
        },
        {
            "key": "Em3recnominal Pixel Size",
            "text": "Nominal pixel size used in electron microscopy 3D reconstruction. Nominal pixel size represents the expected size of a pixel, providing insights into the spatial sampling of the acquired images."
        },
        {
            "key": "Em3d Reconstruction Refinement Type",
            "text": "Type of refinement applied during electron microscopy 3D reconstruction. Refinement processes aim to enhance the accuracy and reliability of the reconstructed 3D structure through iterative adjustments."
        },
        {
            "key": "Em3d Reconstruction Magnification Calibration",
            "text": "Calibration details related to magnification during electron microscopy 3D reconstruction. Magnification calibration ensures accurate scaling and alignment, influencing the precision of the final 3D model."
        },
        {
            "key": "Em Ctf Correction Type",
            "text": "Type of contrast transfer function (CTF) correction applied in electron microscopy. CTF correction compensates for distortions introduced during image acquisition, improving the fidelity of the reconstructed 3D structure."
        },
        {
            "key": "Em Ctf Correction Details",
            "text": "Detailed information about the contrast transfer function (CTF) correction applied in electron microscopy. This includes specific parameters and methodologies employed to address image distortions during reconstruction."
        },
        {
            "key": "Em Entity Assembly Name",
            "text": "Name of the assembly in electron microscopy entity structure. Assemblies represent organized collections of biological entities, providing insights into the composition and organization of the specimen."
        },
        {
            "key": "Em Entity Assembly Source",
            "text": "Source information related to the assembly in electron microscopy entity structure. This includes details about the origin or derivation of the assembled entities, contributing to the understanding of the experimental setup."
        },
        {
            "key": "Em Entity Assembly Type",
            "text": "Type of assembly in electron microscopy entity structure. The assembly type defines the hierarchical arrangement and relationship between individual entities, offering insights into the structural organization of the specimen."
        },
        {
            "key": "Em Entity Assembly Details",
            "text": "Additional details about the assembly in electron microscopy entity structure. This provides comprehensive information about the structural organization, composition, and any specific conditions applied to the assembly."
        },
        {
            "key": "Em Entity Assembly Synonym",
            "text": "Synonymous terms or identifiers associated with the assembly in electron microscopy entity structure. Synonyms contribute to the clarity and interoperability of the structural data."
        },
        {
            "key": "Emimarecording Average Exposure Time",
            "text": "Average exposure time during electron microscopy image recording. Exposure time is a crucial parameter influencing the quality and signal-to-noise ratio of recorded images."
        },
        {
            "key": "Avg Electron Dose Per Image",
            "text": "Average electron dose applied per image during electron microscopy. Electron dose per image impacts the level of radiation damage and influences the overall data quality."
        },
        {
            "key": "Film Or Detector Model",
            "text": "Model of the film or detector used in electron microscopy image recording. The choice of detector model directly affects the sensitivity and resolution of the acquired images."
        },
        {
            "key": "Emimarecording Detector Mode",
            "text": "Mode of operation for the detector during electron microscopy image recording. Detector mode influences the acquisition parameters and the quality of recorded images."
        },
        {
            "key": "Emimarecording Num Grids Imaged",
            "text": "Number of grids imaged during electron microscopy recording. Grids represent sample supports, and the count provides insights into the scale and scope of the imaging experiment."
        },
        {
            "key": "Emimarecording Num Real Images",
            "text": "Number of real images recorded during electron microscopy. Real images contribute to the dataset used in 3D reconstruction, impacting the overall quality of the reconstructed structure."
        },
        {
            "key": "Em Image Recording Details",
            "text": "Detailed information about the process and parameters used in electron microscopy image recording. This includes a comprehensive description of the experimental setup and conditions applied during image acquisition."
        },
        {
            "key": "Emimarecording Num Diffraction Images",
            "text": "Number of diffraction images recorded during electron microscopy. Diffraction images provide additional information about the sample's crystalline structure and are crucial for certain analyses."
        },
        {
            "key": "Em Imaging Accelerating Voltage",
            "text": "Accelerating voltage used during electron microscopy imaging. Accelerating voltage influences the energy of the incident electrons, impacting the penetration depth and contrast in the acquired images."
        },
        {
            "key": "Em Imaging Electron Source",
            "text": "Source of electrons used for imaging in electron microscopy. The choice of electron source affects the energy and characteristics of the incident electron beam, influencing imaging outcomes."
        },
        {
            "key": "Em Imaging Illumination Mode",
            "text": "Illumination mode used during electron microscopy imaging. Illumination mode defines the manner in which the sample is illuminated, impacting the contrast and visibility of features in the acquired images."
        },
        {
            "key": "Em Imaging Microscope Model",
            "text": "Model of the microscope used for electron microscopy imaging. The microscope model dictates the imaging capabilities and specifications, influencing the overall quality of acquired images."
        },
        {
            "key": "Em Imaging Mode",
            "text": "Mode of operation for electron microscopy imaging. Imaging mode outlines the specific approach or technique employed during image acquisition, influencing the type of information captured."
        },
        {
            "key": "Emimanominal Defocus Max",
            "text": "Maximum nominal defocus applied during electron microscopy imaging. Nominal defocus influences the clarity and contrast of features in the acquired images, with the maximum value defining the range used."
        },
        {
            "key": "Emimanominal Defocus Min",
            "text": "Minimum nominal defocus applied during electron microscopy imaging. Nominal defocus impacts the clarity and contrast of features in the acquired images, with the minimum value defining the range used."
        },
        {
            "key": "Em Imaging Calibrated Magnification",
            "text": "Calibrated magnification used in electron microscopy imaging. Calibrated magnification ensures accurate scaling and representation of features in the acquired images, influencing the precision of subsequent analyses."
        },
        {
            "key": "Em Imaging Cryogen",
            "text": "Cryogenic conditions applied during electron microscopy imaging. Cryogen usage helps mitigate sample damage and preserves biological structures, impacting the quality of acquired images."
        },
        {
            "key": "Em Imaging Nominal Cs",
            "text": "Nominal spherical aberration (Cs) applied during electron microscopy imaging. Spherical aberration correction influences the clarity and resolution of features in the acquired images."
        },
        {
            "key": "Emimaspecimen Holder Model",
            "text": "Model of the specimen holder used during electron microscopy imaging. The choice of holder model influences sample stability and positioning, impacting the quality of acquired images."
        },
        {
            "key": "Em Imaging Alignment Procedure",
            "text": "Procedure employed for specimen alignment during electron microscopy imaging. Alignment procedures ensure accurate positioning of the sample, influencing the quality and clarity of acquired images."
        },
        {
            "key": "Emimac2 Aperture Diameter",
            "text": "Diameter of the aperture used in electron microscopy imaging with IMAC2. Aperture diameter affects the depth of focus and resolution of features in the acquired images."
        },
        {
            "key": "Em Imaging Nominal Magnification",
            "text": "Nominal magnification applied during electron microscopy imaging. Nominal magnification defines the scale at which features are represented in the acquired images, influencing subsequent analyses."
        },
        {
            "key": "Emimacalibrated Defocus Max",
            "text": "Maximum calibrated defocus applied during electron microscopy imaging with IMAC2. Calibrated defocus impacts the clarity and contrast of features in the acquired images, with the maximum value defining the range used."
        },
        {
            "key": "Emimacalibrated Defocus Min",
            "text": "Minimum calibrated defocus applied during electron microscopy imaging with IMAC2. Calibrated defocus impacts the clarity and contrast of features in the acquired images, with the minimum value defining the range used."
        },
        {
            "key": "Em Imaging Date",
            "text": "Date on which electron microscopy imaging was conducted. The imaging date provides temporal context and may be relevant for tracking experimental conditions or comparing multiple datasets."
        },
        {
            "key": "Em Imaging Detector Distance",
            "text": "The distance between the imaging detector and the specimen during electron microscopy imaging."
        },
        {
            "key": "Emimaspecimen Holder Type",
            "text": "The type of specimen holder used during imaging in cryo-electron microscopy."
        },
        {
            "key": "Em Imaging Temperature",
            "text": "The temperature at which imaging is performed during electron microscopy experiments."
        },
        {
            "key": "Em Imaging Details",
            "text": "Specific details related to the imaging process in electron microscopy, providing insights into the methodology."
        },
        {
            "key": "Emimarecording Temperature Maximum",
            "text": "The maximum temperature recorded during the imaging or recording process in electron microscopy."
        },
        {
            "key": "Emimarecording Temperature Minimum",
            "text": "The minimum temperature recorded during the imaging or recording process in electron microscopy."
        },
        {
            "key": "Em Imaging Residual Tilt",
            "text": "Residual tilt in the specimen during electron microscopy imaging, indicating potential alignment issues."
        },
        {
            "key": "Emimatilt Angle Max",
            "text": "The maximum tilt angle applied to the specimen during imaging in cryo-electron microscopy."
        },
        {
            "key": "Emimatilt Angle Min",
            "text": "The minimum tilt angle applied to the specimen during imaging in cryo-electron microscopy."
        },
        {
            "key": "Em Imaging Astigmatism",
            "text": "Indicates the level of astigmatism present in the imaging process, affecting the clarity of the obtained images."
        },
        {
            "key": "Emimaelectron Beam Tilt Params",
            "text": "Parameters related to the tilt of the electron beam during imaging in electron microscopy."
        },
        {
            "key": "Emparselection Num Particles Selected",
            "text": "The number of particles selected during the particle selection process in electron microscopy image analysis."
        },
        {
            "key": "Em Particle Selection Details",
            "text": "Specific details related to the selection of particles during image processing in cryo-electron microscopy."
        },
        {
            "key": "Em Software Category",
            "text": "The category to which the software used in electron microscopy belongs, such as image processing or data analysis."
        },
        {
            "key": "Em Software Name",
            "text": "The name of the software employed for image processing or data analysis in electron microscopy experiments."
        },
        {
            "key": "Em Specimen Embedding Applied",
            "text": "Indicates whether embedding techniques were applied to the specimen in electron microscopy sample preparation."
        },
        {
            "key": "Em Specimen Shadowing Applied",
            "text": "Indicates whether shadowing techniques were applied to the specimen in electron microscopy sample preparation."
        },
        {
            "key": "Em Specimen Staining Applied",
            "text": "Indicates whether staining techniques were applied to the specimen in electron microscopy sample preparation."
        },
        {
            "key": "Em Specimen Vitrification Applied",
            "text": "Indicates whether vitrification techniques were applied to the specimen in electron microscopy sample preparation."
        },
        {
            "key": "Em Specimen Concentration",
            "text": "Concentration of the specimen used in electron microscopy, providing insights into the sample preparation."
        },
        {
            "key": "Em Specimen Details",
            "text": "Specific details related to the specimen used in electron microscopy, including preparation and characteristics."
        },
        {
            "key": "Em Vitrification Cryogen Name",
            "text": "The name of the cryogenic substance used for vitrification in electron microscopy sample preparation."
        },
        {
            "key": "Em Vitrification Chamber Temperature",
            "text": "The temperature of the vitrification chamber during the process of specimen vitrification in electron microscopy."
        },
        {
            "key": "Em Vitrification Humidity",
            "text": "Humidity conditions during the vitrification process in electron microscopy, impacting sample preservation."
        },
        {
            "key": "Em Vitrification Instrument",
            "text": "The instrument or device used for specimen vitrification in electron microscopy sample preparation."
        },
        {
            "key": "Em Vitrification Details",
            "text": "Specific details related to the vitrification process in electron microscopy sample preparation."
        },
        {
            "key": "Em Vitrification Method",
            "text": "The method or technique employed for specimen vitrification in electron microscopy."
        },
        {
            "key": "Em Vitrification Temp",
            "text": "The temperature conditions during specimen vitrification in electron microscopy sample preparation."
        },
        {
            "key": "Rcsb External References Type",
            "text": "The type of external references associated with the PDB entry, providing additional sources of information."
        },
        {
            "key": "Rcsb External References Link",
            "text": "The link or URL associated with external references for the PDB entry, facilitating access to supplementary information."
        },
        {
            "key": "Emsinparticle Entity Point Symmetry",
            "text": "The point symmetry of entities in single-particle cryo-electron microscopy, indicating structural characteristics."
        },
        {
            "key": "Pdbx Molecule Features Details",
            "text": "Details related to molecule features in the PDBx format, providing information about specific structural attributes."
        },
        {
            "key": "Pdbx Molecule Features Name",
            "text": "The name associated with molecule features in the PDBx format, providing identification."
        },
        {
            "key": "Pdbx Molecule Features Type",
            "text": "The type or category of molecule features in the PDBx format, indicating structural characteristics."
        },
        {
            "key": "Pdbmolfeatures Class",
            "text": "The class or category associated with PDB molecule features, providing insights into structural attributes."
        },
        {
            "key": "Pdbx Nmr Exptl Type",
            "text": "The type of experimental method employed in NMR (Nuclear Magnetic Resonance) studies, providing insights into data acquisition."
        },
        {
            "key": "Pdbnmrexptl Sample State",
            "text": "The state of the sample during NMR experiments, such as solution or solid state."
        },
        {
            "key": "Sample Conditions Ionic Strength",
            "text": "The ionic strength of the sample conditions in NMR experiments, influencing solution properties."
        },
        {
            "key": "Sample Conditions P H",
            "text": "The pH level of the sample conditions in NMR experiments, impacting chemical properties."
        },
        {
            "key": "Pdbnmrexptl Sample Conditions Pressure",
            "text": "The pressure conditions of the sample in NMR experiments, providing insights into environmental factors."
        },
        {
            "key": "Pdbnmrexptl Sample Conditions Temperature",
            "text": "The temperature conditions of the sample in NMR experiments, influencing data acquisition."
        },
        {
            "key": "Sample Conditions Temperature Units",
            "text": "Units associated with the temperature conditions of the sample in NMR experiments, specifying the measurement scale."
        },
        {
            "key": "Sample Conditions Ionic Strength Units",
            "text": "Units associated with the ionic strength of the sample conditions in NMR experiments, specifying the measurement scale."
        },
        {
            "key": "Pdbnmrexptl Sample Conditions Label",
            "text": "Label or identifier associated with the sample conditions in NMR experiments, facilitating data organization."
        },
        {
            "key": "Sample Conditions P Hunits",
            "text": "Units associated with the pH level of the sample conditions in NMR experiments, specifying the measurement scale."
        },
        {
            "key": "Sample Conditions Pressure Units",
            "text": "Units associated with the pressure conditions of the sample in NMR experiments, specifying the measurement scale."
        },
        {
            "key": "Pdbnmrexptl Sample Conditions Details",
            "text": "Specific details related to the sample conditions in NMR experiments, providing additional insights into the experimental setup."
        },
        {
            "key": "Sample Conditions Ionic Strength Err",
            "text": "Error or uncertainty associated with the ionic strength of the sample conditions in NMR experiments, indicating measurement reliability."
        },
        {
            "key": "Sample Conditions P Herr",
            "text": "Error or uncertainty associated with the pH level of the sample conditions in NMR experiments, indicating measurement reliability."
        },
        {
            "key": "Sample Conditions Temperature Err",
            "text": "Error or uncertainty associated with the temperature conditions of the sample in NMR experiments, indicating measurement reliability."
        },
        {
            "key": "Sample Conditions Pressure Err",
            "text": "Error or uncertainty associated with the pressure conditions of the sample in NMR experiments, indicating measurement reliability."
        },
        {
            "key": "Pdbx Nmr Refine Method",
            "text": "The method or technique employed for refining NMR data, contributing to the accuracy of structural information."
        },
        {
            "key": "Pdbnmrrefine Software Ordinal",
            "text": "Ordinal number associated with the software used in NMR refinement, indicating the sequence or order of application."
        },
        {
            "key": "Pdbx Nmr Refine Details",
            "text": "Specific details related to the refinement process in NMR studies, providing insights into the methodology applied."
        },
        {
            "key": "Pdbnmrsample Details Contents",
            "text": "Contents or components associated with the details of the NMR sample, offering insights into the composition."
        },
        {
            "key": "Pdbnmrsample Details Details",
            "text": "Additional details related to the characteristics or properties of the NMR sample, providing comprehensive information."
        },
        {
            "key": "Pdbnmrsample Details Label",
            "text": "Label or identifier associated with specific details of the NMR sample, facilitating data organization."
        },
        {
            "key": "Pdbnmrsample Details Solvent System",
            "text": "The solvent system employed in NMR sample preparation, influencing sample properties and interactions."
        },
        {
            "key": "Pdbnmrsample Details Type",
            "text": "The type or category associated with specific details of the NMR sample, indicating relevant characteristics."
        },
        {
            "key": "Pdbx Nmr Software Authors",
            "text": "Authors or contributors associated with the software used in NMR studies, acknowledging intellectual contributions."
        },
        {
            "key": "Pdbx Nmr Software Classification",
            "text": "The classification or category of the software used in NMR studies, indicating its functional role."
        },
        {
            "key": "Pdbx Nmr Software Name",
            "text": "The name of the software employed in NMR studies, facilitating recognition and reference."
        },
        {
            "key": "Pdbx Nmr Software Ordinal",
            "text": "Ordinal number associated with the software used in NMR studies, indicating the sequence or order of application."
        },
        {
            "key": "Pdbx Nmr Software Version",
            "text": "The version or release number of the software used in NMR studies, specifying the software's iteration."
        },
        {
            "key": "Pdbnmrspectrometer Field Strength",
            "text": "The magnetic field strength of the NMR spectrometer used in studies, influencing data acquisition and resolution."
        },
        {
            "key": "Pdbx Nmr Spectrometer Manufacturer",
            "text": "The manufacturer of the NMR spectrometer used in studies, providing information about the instrument's source."
        },
        {
            "key": "Pdbx Nmr Spectrometer Model",
            "text": "The model or version of the NMR spectrometer used in studies, specifying the instrument's configuration."
        },
        {
            "key": "Pdbx Nmr Spectrometer Type",
            "text": "Specifies the type of NMR spectrometer used in the experimental setup. NMR spectrometers are crucial in studying the nuclear magnetic resonance of biomolecules, providing insights into their structure and dynamics."
        },
        {
            "key": "Pdbx Nmr Spectrometer Details",
            "text": "Provides detailed information about the NMR spectrometer used in the experiment. This includes specifications such as the manufacturer, model, and additional technical details that characterize the specific instrument employed in the study."
        },
        {
            "key": "Pdb Chain Residue Range",
            "text": "Defines the range of residues within a PDB chain. This information is essential for understanding the sequence of amino acids or nucleotides that constitute the chain and is crucial for structural and functional analyses of biomolecules."
        },
        {
            "key": "Em3d Fitting List Details",
            "text": "Offers detailed information about the fitting list used in 3D electron microscopy (EM) analysis. The fitting list typically contains parameters that describe the fit between the experimental data and the theoretical model, providing insights into the accuracy of the reconstruction."
        },
        {
            "key": "Angular Rotation Per Subunit",
            "text": "Specifies the angular rotation per subunit in a macromolecular complex. This parameter is crucial in understanding the orientation and arrangement of subunits within the complex, contributing to the overall characterization of the molecular assembly."
        },
        {
            "key": "Axial Rise Per Subunit",
            "text": "Defines the axial rise per subunit in a macromolecular complex. This parameter provides information about the vertical distance between successive subunits, contributing to the overall understanding of the three-dimensional architecture of the complex."
        },
        {
            "key": "Emhelentity Axial Symmetry",
            "text": "Describes the axial symmetry of a helical entity in electron microscopy. Axial symmetry refers to the rotational symmetry around the helical axis, providing insights into the repeating structural motifs within the helix."
        },
        {
            "key": "Em3cryentity Angle Alpha",
            "text": "Specifies the angle alpha in 3D crystallography entities. This angle is one of the unit cell parameters, defining the orientation of the crystal lattice. It is crucial for understanding the geometric arrangement of the crystallographic unit cell."
        },
        {
            "key": "Em3cryentity Angle Beta",
            "text": "Defines the angle beta in 3D crystallography entities. This unit cell parameter contributes to the characterization of the crystal lattice, providing information about the geometric relationships between lattice vectors."
        },
        {
            "key": "Em3cryentity Angle Gamma",
            "text": "Describes the angle gamma in 3D crystallography entities. This unit cell parameter is vital for defining the orientation of the crystal lattice and contributes to the overall understanding of the three-dimensional arrangement of atoms in the crystal."
        },
        {
            "key": "Em3cryentity Length A",
            "text": "Specifies the length of the unit cell edge 'A' in 3D crystallography entities. This parameter is essential for defining the dimensions of the crystal lattice and is a fundamental aspect of crystallographic unit cell characterization."
        },
        {
            "key": "Em3cryentity Length B",
            "text": "Defines the length of the unit cell edge 'B' in 3D crystallography entities. This parameter contributes to the overall characterization of the crystal lattice and provides information about the geometric properties of the unit cell."
        },
        {
            "key": "Em3cryentity Length C",
            "text": "Describes the length of the unit cell edge 'C' in 3D crystallography entities. This parameter is crucial for defining the dimensions of the crystal lattice and contributes to the understanding of the overall geometry of the crystallographic unit cell."
        },
        {
            "key": "Em3cryentity Space Group Name",
            "text": "Specifies the name of the space group in 3D crystallography entities. The space group defines the symmetry operations that, when applied to the crystal lattice, result in an indistinguishable arrangement. It is a key aspect of crystallographic symmetry."
        },
        {
            "key": "Em3cryentity Space Group Num",
            "text": "Assigns a numerical identifier to the space group in 3D crystallography entities. The space group number is a standardized representation of the symmetry operations governing the crystal lattice, facilitating consistent data interpretation."
        },
        {
            "key": "Em Diffraction Camera Length",
            "text": "Indicates the length of the camera used in electron diffraction experiments. This parameter is crucial for understanding the experimental setup and contributes to the accurate interpretation of diffraction patterns obtained during the study."
        },
        {
            "key": "Emdiftilt Angle List",
            "text": "Provides details about the tilt angle list used in electron microscopy (EM) experiments. The tilt angle list contains information about the angles at which specimen images are acquired, contributing to the reconstruction of a three-dimensional structure."
        },
        {
            "key": "Emdifshell Fourier Space Coverage",
            "text": "Describes the Fourier space coverage of a diffraction shell in electron microscopy. Fourier space coverage is essential for understanding the distribution of diffraction data in reciprocal space, contributing to the accuracy of structure determination."
        },
        {
            "key": "Emdifshell High Resolution",
            "text": "Specifies the high-resolution limit of a diffraction shell in electron microscopy. This parameter provides information about the finest details that can be resolved in the reconstructed structure, contributing to the overall quality of the result."
        },
        {
            "key": "Emdifshell Low Resolution",
            "text": "Defines the low-resolution limit of a diffraction shell in electron microscopy. This parameter contributes to the understanding of the overall range of spatial frequencies captured during the experiment, influencing the reconstruction process."
        },
        {
            "key": "Em Diffraction Shell Multiplicity",
            "text": "Indicates the multiplicity of a diffraction shell in electron microscopy. Multiplicity refers to the number of times a particular resolution range is sampled, influencing the statistical reliability of the diffraction data."
        },
        {
            "key": "Emdifshell Num Structure Factors",
            "text": "Specifies the number of structure factors within a diffraction shell in electron microscopy. This parameter is crucial for understanding the amount of information available for structure determination within a specific resolution range."
        },
        {
            "key": "Emdifshell Phase Residual",
            "text": "Describes the phase residual associated with a diffraction shell in electron microscopy. Phase residual reflects the discrepancy between the observed and calculated phases, providing insights into the accuracy of the reconstructed electron density."
        },
        {
            "key": "Emdifstats Fourier Space Coverage",
            "text": "Defines the Fourier space coverage in electron microscopy diffraction statistics. Fourier space coverage is essential for understanding the distribution of diffraction data, influencing the accuracy and completeness of the reconstructed structure."
        },
        {
            "key": "Emdifstats High Resolution",
            "text": "Specifies the high-resolution limit in electron microscopy diffraction statistics. This parameter provides information about the finest details resolved in the reconstructed structure, contributing to the overall quality of the result."
        },
        {
            "key": "Emdifstats Num Intensities Measured",
            "text": "Indicates the number of measured intensities in electron microscopy diffraction statistics. This parameter is crucial for assessing the amount of experimental data available for structure determination and validation."
        },
        {
            "key": "Emdifstats Num Structure Factors",
            "text": "Specifies the number of structure factors in electron microscopy diffraction statistics. This parameter provides insights into the amount of information available for calculating the electron density map and determining the structure."
        },
        {
            "key": "Emdifstats Overall Phase Error",
            "text": "Describes the overall phase error in electron microscopy diffraction statistics. Phase error is a measure of the accuracy of the calculated phases, influencing the reliability of the electron density map and subsequently the reconstructed structure."
        },
        {
            "key": "Emdifstats Overall Phase Residual",
            "text": "Indicates the overall phase residual in electron microscopy diffraction statistics. Phase residual reflects the discrepancy between observed and calculated phases, providing insights into the accuracy of the reconstructed electron density and the quality of the structure."
        },
        {
            "key": "Phase Error Rejection Criteria",
            "text": "Specifies the criteria used for rejecting data based on phase error in electron microscopy diffraction experiments. This parameter influences the quality control process during structure determination, ensuring reliable results."
        },
        {
            "key": "Emdifstats R Merge",
            "text": "Describes the R merge value in electron microscopy diffraction statistics. R merge is a statistical indicator reflecting the agreement between multiple measurements of the same reflection, providing insights into data consistency and quality."
        },
        {
            "key": "Emdifstats R Sym",
            "text": "Specifies the R symmetry value in electron microscopy diffraction statistics. R symmetry is a measure of the agreement between intensities from multiple measurements of the same reflection, contributing to data quality assessment."
        },
        {
            "key": "Em Diffraction Stats Details",
            "text": "Provides detailed statistics related to electron diffraction in electron microscopy. This includes a comprehensive overview of various parameters, such as resolution limits, overall phase error, and statistical indicators, contributing to the assessment of data quality and structure determination."
        },
        {
            "key": "Em Embedding Material",
            "text": "Specifies the material used for embedding specimens in electron microscopy experiments. Embedding materials provide support and stability to biological specimens, facilitating thin sectioning for imaging and analysis."
        },
        {
            "key": "Em Embedding Details",
            "text": "Offers detailed information about the embedding process in electron microscopy. This includes the procedures, materials, and conditions involved in embedding biological specimens for thin sectioning and subsequent imaging."
        },
        {
            "key": "Data Set Data Reference",
            "text": "References the data source or origin for a specific dataset. This information is crucial for data traceability, enabling researchers to acknowledge and validate the source of the dataset used in their analyses."
        },
        {
            "key": "Data Set Data Set Type",
            "text": "Specifies the type or category of a dataset. Different types of datasets may include raw experimental data, processed results, or metadata. This parameter aids in classifying and organizing datasets for analysis and interpretation."
        },
        {
            "key": "Data Set Metadata Reference",
            "text": "References the metadata source associated with a dataset. Metadata provides contextual information about the dataset, including details about experimental conditions, sample preparation, and data collection parameters."
        },
        {
            "key": "Pdbrelexp Data Set Details",
            "text": "Provides detailed information about a dataset in the context of PDB-related experiments. This includes specifications about the dataset, such as its origin, type, and relevant metadata, contributing to the comprehensive documentation of experimental data."
        },
        {
            "key": "Pdbsercrystallography Sample Delivery Method",
            "text": "Specifies the method used for sample delivery in crystallography experiments. Sample delivery methods are critical for presenting the biological material to X-ray beams, ensuring optimal diffraction data collection and subsequent structure determination."
        },
        {
            "key": "Pdbsercrystallography Sample Delivery Description",
            "text": "Offers a detailed description of the sample delivery process in crystallography experiments. This includes information about the techniques, instruments, and conditions used to deliver biological samples for X-ray diffraction studies."
        },
        {
            "key": "Sample Delivery Injection Description",
            "text": "Provides a description of the injection-based sample delivery method. This includes details about the procedures, equipment, and conditions involved in injecting biological samples for crystallography experiments, ensuring controlled and precise delivery."
        },
        {
            "key": "Sample Delivery Injection Injector Diameter",
            "text": "Specifies the diameter of the injector used in sample delivery via injection. Injector diameter is a critical parameter influencing the precision and efficiency of sample injection in crystallography experiments."
        },
        {
            "key": "Sample Delivery Injection Injector Temperature",
            "text": "The temperature of the injector used in sample delivery during the injection process. Maintaining precise injector temperature is crucial for controlled sample delivery in crystallography experiments."
        },
        {
            "key": "Sample Delivery Injection Carrier Solvent",
            "text": "The solvent used as a carrier during the sample delivery injection process. The carrier solvent plays a significant role in ensuring the proper delivery and dispersion of the sample in crystallography experiments."
        },
        {
            "key": "Sample Delivery Injection Flow Rate",
            "text": "The rate at which the sample is delivered during the injection process. The flow rate is a critical parameter influencing the controlled and uniform delivery of the sample in crystallography experiments."
        },
        {
            "key": "Sample Delivery Injection Injector Nozzle",
            "text": "Description of the injector nozzle used in the sample delivery injection process. The injector nozzle design has implications for the precision and efficiency of sample delivery in crystallography experiments."
        },
        {
            "key": "Sample Delivery Injection Power By",
            "text": "The power source used to drive the sample delivery injection system. Understanding the power source is essential for ensuring the reliable and consistent operation of the injector in crystallography experiments."
        },
        {
            "key": "Sample Delivery Injection Jet Diameter",
            "text": "The diameter of the jet produced during the sample delivery injection process. Jet diameter is a critical parameter influencing the dispersion and coverage of the sample in crystallography experiments."
        },
        {
            "key": "Sample Delivery Fixed Target Description",
            "text": "Detailed description of the fixed target used in sample delivery. The fixed target is a stationary platform designed to hold the sample during crystallography experiments, and its description provides insights into its design and functionality."
        },
        {
            "key": "Sample Delivery Fixed Target Sample Holding",
            "text": "Information about how the fixed target securely holds the sample during crystallography experiments. Sample holding mechanisms are crucial for maintaining stability and ensuring accurate data collection."
        },
        {
            "key": "Sample Delivery Fixed Target Support Base",
            "text": "Description of the support base for the fixed target in sample delivery. The support base provides the foundation for the fixed target, influencing its stability and alignment during crystallography experiments."
        },
        {
            "key": "Sample Delivery Fixed Target Motion Control",
            "text": "Details about the motion control system for the fixed target in sample delivery. Motion control mechanisms allow precise manipulation of the fixed target, contributing to accurate data acquisition in crystallography experiments."
        },
        {
            "key": "Sample Delivery Fixed Target Sample Dehydration Prevention",
            "text": "Strategies employed to prevent sample dehydration during crystallography experiments. Maintaining sample hydration is crucial for preserving the native state of biological samples and ensuring the accuracy of structural information."
        },
        {
            "key": "Sample Delivery Fixed Target Sample Solvent",
            "text": "The solvent used to maintain sample hydration in the fixed target during crystallography experiments. The choice of sample solvent has implications for the stability and integrity of the biological sample."
        },
        {
            "key": "Data Reduction Crystal Hits",
            "text": "The number of crystal hits recorded during data reduction. Crystal hits are instances where X-ray beams interact with crystals, generating diffraction patterns that are used to determine the crystal's structure."
        },
        {
            "key": "Data Reduction Frames Indexed",
            "text": "The number of frames successfully indexed during data reduction. Indexing frames is a crucial step in crystallography data analysis, leading to the determination of the crystal lattice parameters."
        },
        {
            "key": "Data Reduction Frames Total",
            "text": "The total number of frames collected during data reduction. The total frames represent the entirety of collected data, providing a comprehensive dataset for crystallography analysis."
        },
        {
            "key": "Data Reduction Lattices Indexed",
            "text": "The number of crystal lattices successfully indexed during data reduction. Lattice indexing is a fundamental step in crystallography, essential for determining the arrangement of atoms within the crystal structure."
        },
        {
            "key": "Data Reduction Xfel Pulse Events",
            "text": "The number of X-ray Free-Electron Laser (XFEL) pulse events recorded during data reduction. XFEL pulse events play a crucial role in generating high-intensity X-ray beams for crystallography experiments."
        },
        {
            "key": "Data Reduction Frames Failed Index",
            "text": "The number of frames that failed to index during data reduction. Understanding failed indexing events helps identify challenges or anomalies in the crystallography data collection process."
        },
        {
            "key": "Data Reduction Xfel Run Numbers",
            "text": "The unique run numbers associated with X-ray Free-Electron Laser (XFEL) experiments during data reduction. Run numbers provide a systematic way to organize and reference XFEL experiments in crystallography."
        },
        {
            "key": "Measurement Collection Time Total",
            "text": "The total time duration for data collection during the measurement process. Collection time is a critical parameter affecting the overall efficiency and quality of crystallography experiments."
        },
        {
            "key": "Measurement Focal Spot Size",
            "text": "The size of the focal spot during the measurement process. Focal spot size is a crucial parameter influencing the resolution and precision of X-ray beams in crystallography experiments."
        },
        {
            "key": "Pdbsercrystallography Measurement Pulse Duration",
            "text": "The duration of the X-ray pulse during crystallography measurements. Pulse duration is a key factor influencing the quality of diffraction patterns and the accuracy of structural information."
        },
        {
            "key": "Measurement Pulse Photon Energy",
            "text": "The energy of individual photons within the X-ray pulse during crystallography measurements. Photon energy is a critical parameter affecting the penetration and interaction of X-rays with the crystal sample."
        },
        {
            "key": "Pdbsercrystallography Measurement Source Distance",
            "text": "The distance between the X-ray source and the crystal during crystallography measurements. Source distance is a crucial parameter influencing the intensity and angle of X-ray beams in diffraction experiments."
        },
        {
            "key": "Measurement Xfel Pulse Repetition Rate",
            "text": "The repetition rate of X-ray Free-Electron Laser (XFEL) pulses during crystallography measurements. Repetition rate is a key factor influencing the frequency and timing of X-ray pulses in data collection."
        },
        {
            "key": "Pdbsercrystallography Measurement Pulse Energy",
            "text": "The energy associated with each X-ray pulse during crystallography measurements. Pulse energy is a critical parameter influencing the intensity and quality of X-ray diffraction patterns."
        },
        {
            "key": "Measurement Photons Per Pulse",
            "text": "The number of photons delivered per X-ray pulse during crystallography measurements. This parameter is crucial for understanding the intensity and dosage of X-rays applied to the crystal sample."
        },
        {
            "key": "Pdbsercrystallography Measurement Collimation",
            "text": "The collimation setup used during crystallography measurements. Collimation refers to the control and focusing of X-ray beams, impacting the precision and quality of diffraction experiments."
        },
        {
            "key": "Em Staining Material",
            "text": "The material used for staining in electron microscopy (EM). Staining is employed to enhance the contrast and visibility of biological specimens in EM, aiding in the detailed observation of cellular structures."
        },
        {
            "key": "Em Staining Type",
            "text": "The type of staining technique applied in electron microscopy (EM). Staining types vary and are chosen based on the specific requirements for visualizing different cellular components in EM studies."
        },
        {
            "key": "Em2cryentity Angle Gamma",
            "text": "The gamma angle associated with the rotation of the cryo-electron microscopy (EM) entity. Cryo-EM is a technique for imaging biological samples at cryogenic temperatures, and the gamma angle contributes to the three-dimensional reconstruction process."
        },
        {
            "key": "Group",
            "text": "The 'Group' key categorizes proteins into specific groups, providing a structural classification that aids in organizing and understanding the relationships between various protein structures. It helps researchers and scientists to group proteins based on common characteristics or functionalities."
        },
        {
            "key": "Subgroup",
            "text": "The 'Subgroup' key refines the categorization of proteins by providing additional specificity within a group. It allows for a more detailed classification, enabling researchers to distinguish and study subgroups of proteins with shared characteristics or functions within a larger structural category."
        },
        {
            "key": "Pdb Code",
            "text": "The 'Pdb Code' is a unique alphanumeric identifier assigned to each protein entry in the Protein Data Bank (PDB). This code serves as a universal reference, allowing researchers to access and retrieve detailed structural information about a specific protein of interest, facilitating cross-referencing and data retrieval in bioinformatics studies."
        },
        {
            "key": "Is Master Protein",
            "text": "The 'Is Master Protein' key is a binary indicator that identifies whether a particular protein entry is considered the master or primary representation within a group or subgroup. This designation is useful in structural biology studies to highlight a central or reference protein within a defined structural classification, aiding researchers in navigating complex datasets."
        },
        {
            "key": "Name",
            "text": "The 'Name' key provides the common or scientific name associated with a protein entry. This information is crucial for researchers to easily identify and reference specific proteins in scientific literature, databases, and experimental contexts. The name serves as a human-readable label for the protein, enhancing communication and comprehension across the scientific community."
        },
        {
            "key": "Species",
            "text": "The 'Species' key denotes the biological species from which the protein originates. It provides information about the organism, facilitating the understanding of the protein's natural context and evolutionary relationships. This data is essential for researchers studying protein function, evolution, and the impact of genetic variations on protein structure and function."
        },
        {
            "key": "Taxonomic Domain",
            "text": "The 'Taxonomic Domain' key classifies proteins based on their taxonomic domain, categorizing them into major biological divisions such as Archaea, Bacteria, or Eukaryota. This classification aids researchers in understanding the evolutionary relationships and structural variations across different domains of life, providing insights into the diversity of protein structures in various organisms."
        },
        {
            "key": "Expressed In Species",
            "text": "The 'Expressed In Species' key indicates the organism in which the protein is naturally expressed. This information is crucial for understanding the biological context and physiological role of the protein. Researchers use this data to investigate the relationship between protein structure and function in specific organisms, contributing to our knowledge of cellular processes and molecular interactions."
        },
        {
            "key": "Resolution",
            "text": "The 'Resolution' key represents the resolution at which the protein structure was determined using experimental techniques such as X-ray crystallography or cryo-electron microscopy. A higher resolution provides finer details of the protein's atomic structure. This information is vital for assessing the quality and reliability of the structural data, guiding researchers in the interpretation of molecular interactions and functional implications."
        },
        {
            "key": "Description",
            "text": "The 'Description' key offers a comprehensive textual summary describing the key features, functions, and characteristics of the protein. This narrative provides context and insights into the biological significance of the protein, aiding researchers in understanding its role in cellular processes, disease mechanisms, or other relevant contexts. The description serves as a valuable resource for scientists seeking to interpret the protein's structural and functional attributes."
        },
        {
            "key": "Bibliography",
            "text": "The 'Bibliography' key references the primary literature sources that document the experimental methods, findings, and details associated with the protein structure. It serves as a critical citation to acknowledge the original work and publications, allowing researchers to trace the scientific history and context of the protein's structural determination. This bibliographic information is essential for ensuring proper credit and acknowledgment within the scientific community."
        },
        {
            "key": "Secondary Bibliographies",
            "text": "The 'Secondary Bibliographies' key includes additional references beyond the primary bibliography. These secondary sources may provide supplementary information, alternative perspectives, or additional experimental validations related to the protein structure. Researchers use this information to gather a comprehensive understanding of the protein, considering multiple viewpoints and sources of evidence in their analyses and interpretations."
        },
        {
            "key": "Related Pdb Entries",
            "text": "The 'Related PDB Entries' key lists other Protein Data Bank (PDB) entries that are related or associated with the current protein. This information enables researchers to explore connections between different protein structures, identify homologous proteins, or investigate variations in related protein families. It contributes to a more holistic view of the structural landscape and evolutionary relationships within the PDB."
        },
        {
            "key": "Member Proteins",
            "text": "The 'Member Proteins' key enumerates the individual proteins that are members of a specific group or subgroup. It provides a list of related proteins, fostering an understanding of protein families, complexes, or structural clusters. Researchers utilize this information to explore similarities and differences among member proteins, contributing to insights into functional relationships and structural diversity within the defined protein grouping."
        },
        {
            "key": "Pdb code",
            "text": "PDB ID for the entry - currently 4-character alphanumeric, planned to be extended in the future to eight characters prefixed by ‘pdb’"
        }
    ])
    
    const MLData = ref([])

    const IMPUTEData = ref([])

    const NormalizedData = ref([])

    const DMData = ref({ 
        "TSNE": [],
        "UMAP": [],
        "PCA": []
     })

    const CLusteringData = ref([])

    function generateRandomDataPoints(numPoints) {
        const dataPoints = [];
        for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 10; // Adjust the range as needed
        const y = Math.random() * 10;
        const z = Math.random() * 10;
        dataPoints.push([x, y, z]);
        }
        MLData.value = dataPoints
    }

    function saveIMPUTEDData(data) {
        IMPUTEData.value = data
    }

    function saveNormalizationData(data) {
        NormalizedData.value = data
    }

    function saveDMData(key, data) {
        DMData.value.key = data
    }

    function saveClusteringData(data) {
        CLusteringData.value = data
    }

    return { 
        data, MLData, 
        DMData, IMPUTEData, 
        CLusteringData, generateRandomDataPoints, 
        saveIMPUTEDData, saveDMData, saveClusteringData,
        saveNormalizationData, NormalizedData
    }
})