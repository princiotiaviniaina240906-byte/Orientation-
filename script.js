// ============================================
// BASE DE DONNÉES DES FORMATIONS (Université de l'Itasy)
// ============================================
const filieres = [
    // ISALSH
    { nom: "Communication écotourisme", ecole: "Institut Supérieur des Arts, des Lettres et des Sciences Humaines", bac: ["toutes"] },
    { nom: "Communication territoriale", ecole: "Institut Supérieur des Arts, des Lettres et des Sciences Humaines", bac: ["toutes"] },
    // ISST
    { nom: "Sciences et techniques de l'eau", ecole: "Institut Supérieur des Sciences et Technologies", bac: ["D","C","OSE","Technique agricole"] },
    { nom: "Gestion et valorisation des ressources naturelles", ecole: "Institut Supérieur des Sciences et Technologies", bac: ["D","C","OSE","A2","Technique"] },
    { nom: "Gestion de l'environnement", ecole: "Institut Supérieur des Sciences et Technologies", bac: ["D","C","OSE","A2","Technique"] },
    // PARAMÉDICAL
    { nom: "Sage femme", ecole: "Institut Supérieur Paramédical de Soavinandriana Itasy", bac: ["D","C","S","A1"] },
    { nom: "Infirmier généraliste", ecole: "Institut Supérieur Paramédical de Soavinandriana Itasy", bac: ["D","C","S","A1"] },
    // ESDEG
    { nom: "Economie", ecole: "École Supérieure d'Économie, de Droit et de Gestion", bac: ["toutes"] },
    { nom: "Droit", ecole: "École Supérieure d'Économie, de Droit et de Gestion", bac: ["toutes"] },
    { nom: "Gestion", ecole: "École Supérieure d'Économie, de Droit et de Gestion", bac: ["toutes"] },
    // ÉCOLE D'INGÉNIERIE
    { nom: "Agro-écologie", ecole: "École Supérieure d'Ingénierie de l'Itasy", bac: ["D","C","S","Technique agricole"] },
    { nom: "Bâtiments et travaux publics", ecole: "École Supérieure d'Ingénierie de l'Itasy", bac: ["D","C","S","Technique"] },
    { nom: "Élevage", ecole: "École Supérieure d'Ingénierie de l'Itasy", bac: ["D","C","S","Technique"] },
    { nom: "Énergie renouvelable", ecole: "École Supérieure d'Ingénierie de l'Itasy", bac: ["D","C","S","Technique"] },
    { nom: "Informatique", ecole: "École Supérieure d'Ingénierie de l'Itasy", bac: ["D","C","S","Technique"] },
    { nom: "Mécanisation agricole", ecole: "École Supérieure d'Ingénierie de l'Itasy", bac: ["D","C","S","Technique agricole","industriel"] },
    { nom: "Mines et environnement", ecole: "École Supérieure d'Ingénierie de l'Itasy", bac: ["D","C","S","Technique"] },
    { nom: "Sciences et techniques des matériaux", ecole: "École Supérieure d'Ingénierie de l'Itasy", bac: ["D","C","S","Technique"] },
    { nom: "Télécommunications", ecole: "École Supérieure d'Ingénierie de l'Itasy", bac: ["D","C","S","Technique"] },
    { nom: "Transformation agroalimentaire", ecole: "École Supérieure d'Ingénierie de l'Itasy", bac: ["D","C","S","Technique agricole","industriel"] }
];

// ============================================
// PROFIL UTILISATEUR (état global)
// ============================================
let userProfile = {
    bacType: null,          // "general" ou "technique"
    serie: null,           // ex: "L", "S", "G1", "TI", etc.
    mention: null,
    notes: [],             // stockage éventuel
    centresInteret: [],
    personnalite: [],
    projet: [],
    competences: [],
    budget: []
};

// ============================================
// INITIALISATION : Cacher toutes les sections détail au chargement
// ============================================
document.querySelectorAll('.section-detail').forEach(s => s.style.display = 'none');

// ============================================
// GESTION DES CARTES : afficher/masquer la section correspondante
// ============================================
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function(e) {
        e.stopPropagation();
        const sectionId = 'section-' + this.dataset.section;
        const targetSection = document.getElementById(sectionId);
        
        // Fermer toutes les autres sections
        document.querySelectorAll('.section-detail').forEach(s => {
            if (s.id !== sectionId) s.style.display = 'none';
        });
        
        // Toggle (ouvrir/fermer)
        targetSection.style.display = targetSection.style.display === 'block' ? 'none' : 'block';
        
        // Scroll doux jusqu'à la section ouverte
        if (targetSection.style.display === 'block') {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
});

// ============================================
// BOUTONS DE FERMETURE (×) dans chaque section
// ============================================
document.querySelectorAll('.btn-close-section').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const section = this.closest('.section-detail');
        section.style.display = 'none';
    });
});

// ============================================
// GESTION DES BOUTONS D'OPTION (sélection unique dans un groupe)
// + Mise à jour du profil
// ============================================
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-option');
    if (!btn) return;
    
    const parentGroup = btn.parentNode;
    if (parentGroup.classList.contains('btn-group')) {
        // Désactiver tous les autres boutons du même groupe
        parentGroup.querySelectorAll('.btn-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Récupérer la valeur (data-value ou texte)
        const value = btn.dataset.value || btn.innerText.trim();
        const section = btn.closest('.section-detail');
        if (section) {
            updateProfile(section.id, value, btn);
        }
    }
});

// ============================================
// MISE À JOUR DU PROFIL SELON LA SECTION
// ============================================
function updateProfile(sectionId, value, btnElement) {
    switch (sectionId) {
        case 'section-releve':
            // Type de Bac
            if (value === 'general' || value === 'technique') {
                userProfile.bacType = value;
                userProfile.serie = null; // réinitialiser la série
            }
            // Séries
            else if (['L','S','OSE','A1','A2','C','G1','G2','TI'].includes(value)) {
                userProfile.serie = value;
            }
            // Mention
            else if (['Passable','AssezBien','Bien','TresBien'].includes(value)) {
                userProfile.mention = value;
            }
            break;
        case 'section-interets':
            // On peut stocker les choix, exemple simplifié
            break;
        // Ajouter d'autres sections selon besoin...
    }
}

// ============================================
// AFFICHAGE CONDITIONNEL (BAC GÉNÉRAL / TECHNIQUE)
// ============================================
document.querySelector('#bac-type')?.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-option');
    if (!btn) return;
    const val = btn.dataset.value;
    
    const showGeneral = document.getElementById('serie-general');
    const showTechnique = document.getElementById('serie-technique');
    const showMatiereTech = document.getElementById('matieres-techniques');
    
    if (val === 'general') {
        showGeneral.style.display = 'block';
        showTechnique.style.display = 'none';
        showMatiereTech.style.display = 'none';
        // Réinitialiser les sélections techniques si nécessaire
    } else if (val === 'technique') {
        showGeneral.style.display = 'none';
        showTechnique.style.display = 'block';
        showMatiereTech.style.display = 'block';
    }
});

// ============================================
// CALCUL AUTOMATIQUE DES NOTES PONDÉRÉES
// ============================================
function calculateWeighted() {
    document.querySelectorAll('.table-notes tbody tr').forEach(row => {
        const coeffInput = row.querySelector('.coeff');
        const noteInput = row.querySelector('.note');
        const weightedCell = row.querySelector('.weighted');
        
        const coeff = parseFloat(coeffInput?.value) || 0;
        const note = parseFloat(noteInput?.value) || 0;
        const weighted = coeff * note;
        if (weightedCell) weightedCell.textContent = weighted.toFixed(1);
    });
}

// Écouter les changements dans tous les champs coeff/note
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('coeff') || e.target.classList.contains('note')) {
        calculateWeighted();
    }
});

// Initialiser le calcul au chargement
window.addEventListener('DOMContentLoaded', calculateWeighted);

// ============================================
// BOUTON "PASSER À L'ORIENTATION" : GÉNÉRER LES RECOMMANDATIONS
// ============================================
document.getElementById('btn-orientation').addEventListener('click', function() {
    // Vérifier que la série est sélectionnée
    if (!userProfile.serie) {
        alert('❌ Veuillez d\'abord sélectionner votre série de bac dans "Relevé de notes".');
        // Ouvrir automatiquement la section Relevé de notes
        const releveSection = document.getElementById('section-releve');
        if (releveSection.style.display !== 'block') {
            document.querySelector('.card[data-section="releve"]')?.click();
        }
        return;
    }
    
    generateRecommendations();
    document.getElementById('recommendations').style.display = 'block';
    // Scroller vers les recommandations
    document.getElementById('recommendations').scrollIntoView({ behavior: 'smooth' });
});

// ============================================
// GÉNÉRATION DES RECOMMANDATIONS
// ============================================
function generateRecommendations() {
    const serie = userProfile.serie;
    
    // 1. Filtrer les filières accessibles selon la série
    let accessibles = filieres.filter(f => {
        if (f.bac.includes('toutes')) return true;
        // Vérifier si la série de l'utilisateur correspond à au moins une des séries requises
        return f.bac.some(b => {
            // Cas spéciaux : Technique, G1, G2, etc.
            if (b === 'Technique' && ['G1','G2','TI'].includes(serie)) return true;
            if (b === 'Technique agricole' && ['G1','G2'].includes(serie)) return true; // simplification
            if (b === 'industriel' && serie === 'TI') return true;
            return b === serie;
        });
    });
    
    // Si aucune filière, message par défaut
    if (accessibles.length === 0) {
        accessibles = [{ nom: "Aucune filière correspondante – vérifiez votre série", ecole: "" }];
    }
    
    // Top 3 filières (prendre les 3 premières, ou toutes)
    const topFilieres = accessibles.slice(0, 3);
    document.getElementById('top-filieres').innerHTML = topFilieres.map(f => 
        `<li><strong>${f.nom}</strong>${f.ecole ? '<br><small>' + f.ecole + '</small>' : ''}</li>`
    ).join('');
    
    // 2. Top 2 écoles (regroupement)
    const ecolesCount = {};
    accessibles.forEach(f => {
        if (f.ecole) ecolesCount[f.ecole] = (ecolesCount[f.ecole] || 0) + 1;
    });
    const sortedEcoles = Object.entries(ecolesCount)
        .sort((a,b) => b[1] - a[1])
        .slice(0, 2);
    document.getElementById('top-ecoles').innerHTML = sortedEcoles.length ? 
        sortedEcoles.map(e => `<li><strong>${e[0]}</strong> (${e[1]} filière${e[1]>1?'s':''})</li>`).join('') :
        '<li>Aucune école disponible</li>';
    
    // 3. Cours de remise à niveau (notes < 10)
    let cours = [];
    document.querySelectorAll('#section-releve .table-notes tbody tr').forEach(row => {
        const matiere = row.cells[0]?.innerText;
        const noteInput = row.querySelector('.note');
        const note = parseFloat(noteInput?.value) || 20; // si pas de note, considéré comme 20
        if (note < 10) {
            cours.push(`${matière} (note: ${note.toFixed(1)}/20)`);
        }
    });
    if (cours.length === 0) {
        cours = ['✅ Aucune remise à niveau nécessaire – excellent niveau !'];
    }
    document.getElementById('remise-niveau').innerHTML = cours.map(c => `<li>${c}</li>`).join('');
}

// ============================================
// RAFRAÎCHIR LE CALCUL SI DES NOTES SONT MODIFIÉES ULTÉRIEUREMENT
// ============================================
calculateWeighted();