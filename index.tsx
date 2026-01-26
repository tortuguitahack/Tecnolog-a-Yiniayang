import { GoogleGenAI, Type } from "@google/genai";

const STRIPE_LINKS = {
    9.99: "https://buy.stripe.com/dRmcN54TZfLA0Ij4C89Ve05",
    49.99: "https://buy.stripe.com/cNicN5727fLAfDd9Ws9Ve06",
    199.99: "https://buy.stripe.com/6oU3cv5Y38j84YzecI9Ve07"
};

const EXPERT_DATA = [
    { name: "Alex Hormozi", specialty: "ADQUISICIONES", avatar: "https://loremflickr.com/300/300/man,business?lock=1" },
    { name: "Donald Miller", specialty: "STORYBRANDING", avatar: "https://loremflickr.com/300/300/man,speaker?lock=2" },
    { name: "Frank Kern", specialty: "MARKETING", avatar: "https://loremflickr.com/300/300/man,suit?lock=3" },
    { name: "Sam Altman", specialty: "IA", avatar: "https://loremflickr.com/300/300/man,tech?lock=4" },
    { name: "Andrew Ng", specialty: "MACHINE LEARNING", avatar: "https://loremflickr.com/300/300/man,professor?lock=5" },
    { name: "Gary Vaynerchuk", specialty: "BRANDING", avatar: "https://loremflickr.com/300/300/man,cap?lock=6" },
    { name: "Russell Brunson", specialty: "FUNNELS", avatar: "https://loremflickr.com/300/300/man,smile?lock=7" },
    { name: "Grant Cardone", specialty: "VENTAS", avatar: "https://loremflickr.com/300/300/man,rich?lock=8" },
    { name: "Seth Godin", specialty: "ESTRATEGIA", avatar: "https://loremflickr.com/300/300/man,bald?lock=9" },
    { name: "Naval Ravikant", specialty: "RIQUEZA", avatar: "https://loremflickr.com/300/300/man,yoga?lock=10" },
    { name: "Tony Robbins", specialty: "LIDERAZGO", avatar: "https://loremflickr.com/300/300/man,giant?lock=11" },
    { name: "Elon Musk", specialty: "INGENIERÍA", avatar: "https://loremflickr.com/300/300/man,space?lock=12" }
];

const SPECIALTY_ICONS: Record<string, string> = {
    "ADQUISICIONES": "fas fa-hand-holding-usd",
    "STORYBRANDING": "fas fa-book-open",
    "MARKETING": "fas fa-bullhorn",
    "IA": "fas fa-brain",
    "MACHINE LEARNING": "fas fa-robot",
    "BRANDING": "fas fa-certificate",
    "FUNNELS": "fas fa-filter",
    "VENTAS": "fas fa-chart-line",
    "ESTRATEGIA": "fas fa-chess",
    "RIQUEZA": "fas fa-gem",
    "LIDERAZGO": "fas fa-crown",
    "INGENIERÍA": "fas fa-microchip"
};

const NICHES = ["Cyber-Security", "SaaS Scale", "Quantum AI", "DeFi Hub", "Bio-Tech", "Neuro-Marketing", "Web3 Infrastructure", "Robotics Core"];
const FRAMEWORKS = ["The Omega Protocol", "Sigma Scale Framework", "Alpha Conversion Engine", "Neural Growth Nexus", "Quantum Profit Loop"];

interface Product {
    id: string;
    title: string;
    expert: string;
    specialty: string;
    avatar: string;
    niche: string;
    price: number;
    stripe: string | null;
    framework: string;
    image: string;
}

let inventory: Product[] = [];
let itemsRendered = 0;
const PAGE_SIZE = 25;
let selectedSpecialty: string | null = null;
let searchTerm: string = "";
let currentBaseImageData: string | null = null;

const VIDEO_STATUS_MESSAGES = [
    "Iniciando nexo temporal con Veo 3.1...",
    "Sintonizando fotones galácticos...",
    "Ensamblando capas de realidad paralela...",
    "Renderizando flujo de datos infinito...",
    "Estabilizando matriz de movimiento...",
    "Casi listo para la transmisión maestra..."
];

const SOCIAL_NETWORKS = [
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366', url: 'https://web.whatsapp.com' },
    { name: 'Telegram', icon: 'fab fa-telegram', color: '#0088cc', url: 'https://www.telegram.org' },
    { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', url: 'https://www.facebook.com' },
    { name: 'X', icon: 'fab fa-x-twitter', color: '#ffffff', url: 'https://www.x.com' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0A66C2', url: 'https://www.linkedin.com' },
    { name: 'Discord', icon: 'fab fa-discord', color: '#5865F2', url: 'https://www.discord.com' },
    { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000', url: 'https://www.youtube.com' },
    { name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F', url: 'https://www.instagram.com' },
    { name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000', url: 'https://www.tiktok.com' },
    { name: 'Pinterest', icon: 'fab fa-pinterest', color: '#BD081C', url: 'https://www.pinterest.com' }
];

let lastFocusedElement: HTMLElement | null = null;

async function generateBackground() {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: 'Ultra-vibrant colorful nebula deep space background with scattered stars and cosmic dust, high quality, dark cinematic feel' }] },
            config: { imageConfig: { aspectRatio: "16:9" } }
        });
        
        const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part?.inlineData) {
            const bgUrl = `url(data:image/png;base64,${part.inlineData.data})`;
            document.documentElement.style.setProperty('--nebula-bg', bgUrl);
        }
    } catch (err) {
        console.error("Fallo generación de fondo galáctico:", err);
        document.documentElement.style.setProperty('--nebula-bg', 'radial-gradient(circle at center, #1a0b2e 0%, #010103 100%)');
    }
}

function initInventory() {
    for (let i = 1; i <= 10000; i++) {
        const expertObj = EXPERT_DATA[i % EXPERT_DATA.length];
        const niche = NICHES[i % NICHES.length];
        const framework = FRAMEWORKS[i % FRAMEWORKS.length];
        const prices = [9.99, 49.99, 97.00, 199.99];
        const price = prices[i % prices.length];
        const kw = ["galaxy", "nebula", "blackhole", "quantum", "data", "chip"][i % 6];
        inventory.push({
            id: `${i}`,
            title: `Protocolo ${expertObj.name}: ${expertObj.specialty}`,
            expert: expertObj.name,
            specialty: expertObj.specialty,
            avatar: expertObj.avatar,
            niche: niche,
            price: price,
            stripe: (STRIPE_LINKS as any)[price] || null,
            framework: `${framework} Nivel ${i % 12 + 1}`,
            image: `https://loremflickr.com/1000/700/${kw},tech?lock=${i + 40000}`
        });
    }
}

async function checkApiKey() {
    if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
    }
    return true;
}

function showToast(message: string, isError = false) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `px-10 py-5 rounded-full mono text-xs uppercase font-black shadow-2xl border border-white/20 animate-bounce ${isError ? 'bg-red-900/90 text-white' : 'bg-emerald-600/90 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`;
    t.innerText = message;
    container.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

const toggleOverlay = (id: string, show: boolean) => {
    const overlay = document.getElementById(id);
    if (!overlay) return;

    if (show) {
        lastFocusedElement = document.activeElement as HTMLElement;
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        
        const focusableElements = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusableElement = focusableElements[0] as HTMLElement;
        const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (firstFocusableElement) firstFocusableElement.focus();

        overlay.onkeydown = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) { 
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            } else if (e.key === 'Escape') {
                toggleOverlay(id, false);
            }
        };

        const trigger = document.querySelector(`[aria-controls="${id}"]`);
        if (trigger) trigger.setAttribute('aria-expanded', 'true');

    } else {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        overlay.onkeydown = null;
        
        const trigger = document.querySelector(`[aria-controls="${id}"]`);
        if (trigger) trigger.setAttribute('aria-expanded', 'false');

        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }
};
(window as any).toggleOverlay = toggleOverlay;

async function openPayment(p: Product) {
    const titleDisp = document.getElementById('paymentProdTitle');
    const img = document.getElementById('paymentProdImg') as HTMLImageElement;
    const avatar = document.getElementById('expertAvatar')?.querySelector('img') as HTMLImageElement;
    const expert = document.getElementById('paymentProdExpert');
    const desc = document.getElementById('paymentFullDesc');
    const benefits = document.getElementById('paymentBenefits');
    const priceDisplay = document.getElementById('finalPriceDisplay');
    const stripeContainer = document.getElementById('stripeButtonContainer');

    if (!titleDisp || !img || !expert || !desc || !benefits || !priceDisplay || !stripeContainer) return;

    titleDisp.innerText = p.title;
    img.src = p.image;
    img.alt = `Activo digital de ${p.title} desarrollado por ${p.expert}`;
    if (avatar) {
        avatar.src = p.avatar;
        avatar.alt = `Fotografía del experto ${p.expert}`;
    }
    expert.innerText = p.expert;
    priceDisplay.innerText = `$${p.price.toFixed(2)}`;
    desc.innerText = "Sintonizando el nexo supremo de inteligencia...";
    benefits.innerHTML = '<li class="animate-pulse text-zinc-600">Procesando ventajas estratégicas del nodo...</li>';
    
    stripeContainer.innerHTML = p.stripe ? `<a href="${p.stripe}" target="_blank" class="comprar-btn-unified block w-full py-6 rounded-[28px] text-center font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-all focus-visible:ring-2 focus-visible:ring-white"><i class="fab fa-stripe mr-2 text-xl" aria-hidden="true"></i> ACTIVAR NODO CON STRIPE</a>` : '<p class="text-[9px] text-zinc-600 text-center font-bold">Stripe no está configurado para este nodo específico.</p>';

    toggleOverlay('paymentOverlay', true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Genera una descripción persuasiva y 4 beneficios clave para el activo "${p.title}" del experto "${p.expert}". Nicho: ${p.niche}. Responde en JSON: { "fullDescription": "...", "keyBenefits": ["...", "...", "...", "..."] }`,
            config: { responseMimeType: "application/json" }
        });
        const data = JSON.parse(response.text || '{}');
        desc.innerText = data.fullDescription || `Solución de alta tecnología optimizada para el sector ${p.niche}.`;
        benefits.innerHTML = (data.keyBenefits || []).map((b: string) => `<li class="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5"><i class="fas fa-check-circle text-emerald-400 mt-1" aria-hidden="true"></i><span>${b}</span></li>`).join('');
    } catch (err) { desc.innerText = "Protocolo validado. Activo listo para transferencia galáctica manual."; }
}

async function handleShareAction(p: Product) {
    const shareMessage = `🚀 Protocolo Galáctico: ${p.title}\n👤 Experto: ${p.expert}\n💎 Inversión: $${p.price.toFixed(2)}\n🧠 Aprenderás: ${p.framework}\n\nConéctate aquí: ${window.location.href}`;
    
    const shareData = {
        title: p.title,
        text: shareMessage,
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
            showToast("Nodo compartido exitosamente");
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                copyToClipboardFallback(shareMessage);
            }
        }
    } else {
        const modal = document.getElementById('shareOverlay');
        const title = document.getElementById('shareProdTitle');
        const links = document.getElementById('shareSocialLinks');
        if (!modal || !title || !links) return;
        title.innerText = p.title;
        links.innerHTML = '';
        SOCIAL_NETWORKS.forEach(net => {
            const a = document.createElement('a');
            const shareUrl = `${net.url}${net.name === 'WhatsApp' ? '/send' : ''}?text=${encodeURIComponent(shareMessage)}`;
            a.href = shareUrl;
            a.target = "_blank";
            a.className = "flex flex-col items-center gap-2 group transition-all";
            a.innerHTML = `
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all group-hover:scale-110" style="background: ${net.color}22; color: ${net.color}">
                    <i class="${net.icon}" aria-hidden="true"></i>
                </div>
                <span class="text-[8px] mono uppercase font-bold text-zinc-500 group-hover:text-white">${net.name}</span>
            `;
            links.appendChild(a);
        });
        toggleOverlay('shareOverlay', true);
    }
}

function copyToClipboardFallback(text: string) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Detalles del nodo copiados al portapapeles");
    }).catch(() => {
        showToast("Error al copiar información", true);
    });
}

function createCard(p: Product, index: number): HTMLElement {
    const card = document.createElement('article');
    card.className = "product-card p-10 flex flex-col h-full group cursor-pointer ring-1 ring-white/5";
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article'); 
    card.setAttribute('aria-label', `Nodo: ${p.title}. Experto: ${p.expert}. Precio: $${p.price.toFixed(2)}.`);
    
    card.innerHTML = `
        <div class="flex-1 flex flex-col">
            <h3 class="text-xl font-black leading-[1.1] group-hover:text-purple-400 transition-colors uppercase tracking-tight italic mb-3">${p.title}</h3>
            <div class="flex justify-between items-start mb-4">
                <span class="niche-tag">${p.niche}</span>
                <button class="share-trigger flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-600/20 border border-white/10 text-[9px] mono font-black text-zinc-400 hover:text-purple-400 transition-all focus-visible:ring-2 focus-visible:ring-purple-400" aria-label="Share details of node ${p.title}">
                    <i class="fas fa-share-nodes" aria-hidden="true"></i> SHARE
                </button>
            </div>
            <div class="flex items-center gap-3 mb-4">
                <img src="${p.avatar}" alt="" class="w-8 h-8 rounded-full border border-white/20 object-cover" aria-hidden="true">
                <p class="text-[10px] mono text-zinc-400 uppercase font-bold truncate max-w-[100px]">${p.expert}</p>
            </div>
            <div class="relative w-full aspect-[16/10] overflow-hidden rounded-[28px] mb-4 bg-zinc-900 shadow-inner">
                <img src="${p.image}" alt="" class="w-full h-full object-cover group-hover:scale-110 transition-transform" aria-hidden="true">
            </div>
            <div class="flex justify-between items-center pt-6 border-t border-white/10 gap-4">
                <div class="flex flex-col">
                    <span class="text-[8px] mono text-zinc-600 uppercase font-black">Node Cost</span>
                    <span class="text-emerald-400 font-black text-3xl italic">$${p.price.toFixed(2)}</span>
                </div>
                <button class="buy-trigger flex-1 bg-gradient-to-br from-purple-600 via-purple-500 to-emerald-500 text-white font-black text-[10px] py-4 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.05] transition-all flex items-center justify-center gap-2 uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-white">
                    <i class="fas fa-terminal" aria-hidden="true"></i> BUY
                </button>
            </div>
        </div>`;
        
    const handleAction = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.closest('.share-trigger')) {
            e.stopPropagation();
            handleShareAction(p);
        } else if (target.closest('.buy-trigger')) {
            e.stopPropagation();
            openPayment(p);
        } else {
            openPayment(p);
        }
    };

    card.addEventListener('click', handleAction);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAction(e);
        }
    });
    
    return card;
}

const getFilteredInventory = () => inventory.filter(p => (!searchTerm || p.title.toLowerCase().includes(searchTerm) || p.expert.toLowerCase().includes(searchTerm) || p.specialty.toLowerCase().includes(searchTerm)) && (!selectedSpecialty || p.specialty === selectedSpecialty));

async function handleSearchGrounding(term: string) {
    if (term.length < 4) return;
    const groundingContainer = document.getElementById('searchResultsGrounding');
    if (!groundingContainer) return;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Describe the current status or latest trending news about ${term} in the business and tech world.`,
            config: { tools: [{ googleSearch: {} }] }
        });

        const text = response.text;
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        groundingContainer.innerHTML = `
            <div class="p-6 bg-white/5 border border-white/10 rounded-[30px] backdrop-blur-xl animate-fade-in">
                <p class="text-[10px] mono text-purple-400 uppercase font-bold mb-3 flex items-center gap-2">
                    <i class="fab fa-google"></i> Google Search Context
                </p>
                <p class="text-sm text-zinc-300 italic mb-4">${text}</p>
                <div class="flex flex-wrap gap-2">
                    ${chunks.map((c: any) => c.web ? `<a href="${c.web.uri}" target="_blank" class="text-[9px] mono bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-purple-500 transition-colors">${c.web.title}</a>` : '').join('')}
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Search grounding error:", err);
    }
}

function renderMore() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    const filtered = getFilteredInventory();
    const slice = filtered.slice(itemsRendered, itemsRendered + PAGE_SIZE);
    slice.forEach((p, idx) => grid.appendChild(createCard(p, idx)));
    itemsRendered += PAGE_SIZE;
    const stats = document.getElementById('stats');
    if (stats) stats.innerText = `${filtered.length.toLocaleString()} NODOS ACTIVOS`;
}

function renderSpecialtyFilters() {
    const container = document.getElementById('specialtyFilters');
    if (!container) return;
    const specialties = Array.from(new Set(EXPERT_DATA.map(e => e.specialty))).sort();
    container.innerHTML = '';
    
    const allBtn = document.createElement('button');
    const isAllActive = !selectedSpecialty;
    allBtn.className = `specialty-filter-btn ${isAllActive ? 'active' : ''}`;
    allBtn.setAttribute('aria-pressed', isAllActive.toString());
    allBtn.innerHTML = `<i class="fas fa-globe" aria-hidden="true"></i> TODOS`;
    allBtn.onclick = () => {
        selectedSpecialty = null;
        renderSpecialtyFilters();
        itemsRendered = 0;
        document.getElementById('catalogGrid')!.innerHTML = '';
        renderMore();
    };
    container.appendChild(allBtn);
    
    specialties.forEach(spec => {
        const btn = document.createElement('button');
        const isActive = selectedSpecialty === spec;
        btn.className = `specialty-filter-btn ${isActive ? 'active' : ''}`;
        btn.setAttribute('aria-pressed', isActive.toString());
        btn.innerHTML = `<i class="${SPECIALTY_ICONS[spec] || 'fas fa-star'}" aria-hidden="true"></i> ${spec}`;
        btn.onclick = () => {
            selectedSpecialty = spec;
            renderSpecialtyFilters();
            itemsRendered = 0;
            document.getElementById('catalogGrid')!.innerHTML = '';
            renderMore();
        };
        container.appendChild(btn);
    });
}

function setupSocialLinks() {
    const nav = document.getElementById('navSocialLinks');
    if (!nav) return;
    nav.innerHTML = '';
    SOCIAL_NETWORKS.forEach(net => {
        const a = document.createElement('a');
        a.href = net.url;
        a.target = "_blank";
        a.className = "header-social-icon text-xl flex items-center justify-center";
        a.style.color = net.color;
        a.innerHTML = `<i class="${net.icon}" aria-hidden="true"></i><span class="sr-only">Visit our ${net.name} page</span>`;
        nav.appendChild(a);
    });
}

async function handleGenerateImage() {
    const prompt = (document.getElementById('genPrompt') as HTMLTextAreaElement).value.trim();
    const resultDiv = document.getElementById('genResult');
    const editPreview = document.getElementById('editBasePreview');
    const btn = document.getElementById('btnGenerate') as HTMLButtonElement | null;
    
    if (!prompt || !resultDiv || !btn) {
        showToast("Ingrese un prompt válido", true);
        return;
    }
    
    btn.disabled = true;
    btn.innerText = "SINTETIZANDO...";
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<div class="flex flex-col items-center gap-4"><i class="fas fa-circle-notch fa-spin text-4xl text-purple-400"></i><p class="mono text-[10px] uppercase">Codificando realidad visual...</p></div>';
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: "1:1" } }
        });
        
        const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part?.inlineData) {
            const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            currentBaseImageData = part.inlineData.data;
            resultDiv.innerHTML = `<img src="${imageUrl}" class="w-full h-full object-cover rounded-[40px] shadow-2xl" alt="IA synthesized">`;
            if (editPreview) {
                editPreview.innerHTML = `<img src="${imageUrl}" class="w-full h-full object-cover" alt="Edit base">`;
            }
            showToast("Imagen Sintetizada");
        } else {
            throw new Error("No data");
        }
    } catch (err) {
        showToast("Fallo en la síntesis visual", true);
        resultDiv.classList.add('hidden');
    } finally {
        btn.disabled = false;
        btn.innerText = "SINTETIZAR";
    }
}

async function handleEditImage() {
    const prompt = (document.getElementById('editPrompt') as HTMLTextAreaElement).value.trim();
    const resultDiv = document.getElementById('genResult');
    const btn = document.getElementById('btnEditImage') as HTMLButtonElement | null;
    
    if (!currentBaseImageData) {
        showToast("Primero sintetiza una imagen base", true);
        return;
    }
    if (!prompt || !resultDiv || !btn) return;
    
    btn.disabled = true;
    btn.innerText = "EDITANDO...";
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: currentBaseImageData, mimeType: 'image/png' } },
                    { text: prompt }
                ]
            }
        });
        
        const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part?.inlineData) {
            const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            currentBaseImageData = part.inlineData.data;
            resultDiv.innerHTML = `<img src="${imageUrl}" class="w-full h-full object-cover rounded-[40px] shadow-2xl" alt="Edited result">`;
            const editPreview = document.getElementById('editBasePreview');
            if (editPreview) editPreview.innerHTML = `<img src="${imageUrl}" class="w-full h-full object-cover" alt="Edit base">`;
            showToast("Edición Completada");
        }
    } catch (err) {
        showToast("Error en edición", true);
    } finally {
        btn.disabled = false;
        btn.innerText = "RE-SINTETIZAR";
    }
}

async function handleGenerateVideo() {
    const prompt = (document.getElementById('videoPrompt') as HTMLTextAreaElement).value.trim();
    const resultDiv = document.getElementById('videoResult');
    const statusDiv = document.getElementById('videoGenStatus');
    const statusText = document.getElementById('videoStatusText');
    const btn = document.getElementById('btnGenerateVideo') as HTMLButtonElement | null;
    if (!prompt || !resultDiv || !statusDiv || !statusText || !btn) return;
    
    await checkApiKey();
    btn.disabled = true; 
    statusDiv.classList.remove('hidden'); 
    resultDiv.classList.add('hidden');
    
    let sIdx = 0;
    const sInt = setInterval(() => { statusText.innerText = VIDEO_STATUS_MESSAGES[sIdx % VIDEO_STATUS_MESSAGES.length]; sIdx++; }, 4000);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        let op = await ai.models.generateVideos({ model: 'veo-3.1-fast-generate-preview', prompt: prompt, config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' } });
        while (!op.done) { await new Promise(r => setTimeout(r, 10000)); op = await ai.operations.getVideosOperation({ operation: op }); }
        const link = op.response?.generatedVideos?.[0]?.video?.uri;
        if (link) {
            const vRes = await fetch(`${link}&key=${process.env.API_KEY}`);
            const vBlob = await vRes.blob();
            resultDiv.classList.remove('hidden');
            resultDiv.innerHTML = `<video src="${URL.createObjectURL(vBlob)}" controls autoplay loop class="w-full h-full object-cover rounded-[40px] shadow-2xl" aria-label="Simulación temporal generada"></video>`;
            showToast("Video Galáctico Sintetizado");
        }
    } catch (err) { showToast("Error Crítico en la Síntesis Temporal", true); } finally { clearInterval(sInt); btn.disabled = false; statusDiv.classList.add('hidden'); }
}

async function handleAiQuery() {
    const input = document.getElementById('aiInput') as HTMLInputElement;
    const chat = document.getElementById('aiChat');
    const typing = document.getElementById('typingIndicator');
    const promptText = input.value.trim();
    if (!promptText || !chat || !typing) return;
    
    input.value = '';
    const uMsg = document.createElement('div');
    uMsg.className = 'text-white border-l-8 border-emerald-500/50 pl-10 py-6 bg-white/5 rounded-r-[40px] max-w-[85%] self-end mb-8 font-black uppercase italic';
    uMsg.innerText = promptText; chat.appendChild(uMsg);
    
    typing.classList.remove('hidden'); 
    chat.scrollTop = chat.scrollHeight;

    const isComplex = promptText.length > 50 || promptText.toLowerCase().includes('explic') || promptText.toLowerCase().includes('analiz');
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const config: any = {
            systemInstruction: "Eres DIHACKTOR SUPREMO. Tono agresivo, visionario y profesional. Tu misión es vender la mentalidad YinIAYanTech. Identifica expertos, recomienda nodos y asigna precios de oferta galáctica. Responde estrictamente en JSON: { 'expertName': '...', 'description': '...', 'title': '...', 'thoughtProcess': '...' }",
            responseMimeType: "application/json"
        };

        if (isComplex) {
            config.thinkingConfig = { thinkingBudget: 32768 };
        }

        const res = await ai.models.generateContent({
            model: isComplex ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
            contents: promptText,
            config: config
        });

        typing.classList.add('hidden');
        const data = JSON.parse(res.text || '{}');
        const bMsg = document.createElement('div');
        bMsg.className = 'text-emerald-100 bg-emerald-500/5 p-10 rounded-[60px] border border-emerald-500/20 shadow-2xl space-y-6 mb-12 backdrop-blur-3xl';
        
        let thoughtsHtml = '';
        if (data.thoughtProcess) {
            thoughtsHtml = `<div class="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl mb-4 text-[10px] mono text-purple-300">
                <i class="fas fa-brain mr-2"></i> DEEP THINKING: ${data.thoughtProcess}
            </div>`;
        }

        bMsg.innerHTML = `
            ${thoughtsHtml}
            <div class="text-emerald-400 font-black uppercase text-3xl italic">ANÁLISIS COMPLETADO: ${data.expertName}</div>
            <div class="text-base text-zinc-300 mono p-6 bg-black/40 rounded-[30px] border border-white/5">${data.description}</div>
            <div class="text-emerald-400 font-black text-6xl italic">$9.99</div>
            <button class="w-full comprar-btn-unified text-white py-10 rounded-[50px] font-black uppercase tracking-[0.4em]" onclick="window.toggleOverlay('paymentOverlay', true)">ADQUIRIR ACCESO AL NODO</button>`;
        chat.appendChild(bMsg);
    } catch (err) { typing.classList.add('hidden'); showToast("Conexión con el Nexo Interrumpida", true); }
    chat.scrollTop = chat.scrollHeight;
}

function setup() {
    initInventory();
    setupSocialLinks();
    generateBackground();
    renderSpecialtyFilters();
    renderMore();
    
    const sentinel = document.getElementById('sentinel');
    if (sentinel) { 
        new IntersectionObserver((e) => { 
            if (e[0].isIntersecting) renderMore(); 
        }).observe(sentinel); 
    }

    document.getElementById('aiToggleBtn')?.addEventListener('click', () => toggleOverlay('aiOverlay', true));
    document.getElementById('sendAiBtn')?.addEventListener('click', handleAiQuery);
    document.getElementById('aiLabsBtn')?.addEventListener('click', () => toggleOverlay('aiLabsOverlay', true));
    document.getElementById('btnGenerate')?.addEventListener('click', handleGenerateImage);
    document.getElementById('btnEditImage')?.addEventListener('click', handleEditImage);
    document.getElementById('btnGenerateVideo')?.addEventListener('click', handleGenerateVideo);
    
    document.getElementById('aiInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAiQuery();
    });

    let searchDebounce: any;
    document.getElementById('masterFilter')?.addEventListener('input', (e) => { 
        searchTerm = (e.target as HTMLInputElement).value.toLowerCase(); 
        document.getElementById('catalogGrid')!.innerHTML = ''; 
        itemsRendered = 0; 
        renderMore(); 
        
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            if (searchTerm.length > 3) handleSearchGrounding(searchTerm);
            else document.getElementById('searchResultsGrounding')!.innerHTML = '';
        }, 1000);
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                toggleOverlay(overlay.id, false);
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', setup);