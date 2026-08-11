export interface MenuItem {
    name: string;
    price: string;
    description: string;
    image: string;
    tag: string;
}

export const coffeeMenu: MenuItem[] = [
    {
        name: "Pour Over",
        price: "Rp 35.000",
        description: "Single origin Ethiopia Yirgacheffe, floral & cerah.",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400",
        tag: "Light Roast"
    },
    {
        name: "Flat White",
        price: "Rp 30.000",
        description: "Microfoam lembut berpadu dengan double ristretto shot.",
        image: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?auto=format&fit=crop&q=80&w=400",
        tag: "Signature"
    },
    {
        name: "Cold Brew",
        price: "Rp 25.000",
        description: "Diseduh perlahan selama 24 jam, mulus dan bercita rasa cokelat.",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",
        tag: "Refreshing"
    },
    {
        name: "Almond Croissant",
        price: "Rp 25.000",
        description: "Dipanggang dua kali, isi frangipane, dengan taburan almond renyah.",
        image: "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&q=80&w=400",
        tag: "Pastry"
    },
    {
        name: "Lemon Cake",
        price: "Rp 28.000",
        description: "Lembut, padat, dengan lapisan jeruk nipis yang menyegarkan.",
        image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=400",
        tag: "Cake"
    },
    {
        name: "Matcha Latte",
        price: "Rp 32.000",
        description: "Matcha Uji grade seremonial, diaduk perlahan dengan susu.",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400",
        tag: "Terbaik"
    },
    {
        name: "Espresso",
        price: "Rp 20.000",
        description: "Ekstraksi murni dengan crema tebal dan rasa yang kuat.",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400",
        tag: "Classic"
    },
    {
        name: "Cappuccino",
        price: "Rp 28.000",
        description: "Keseimbangan sempurna antara espresso, susu, dan busa.",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400",
        tag: "Favorite"
    },
    {
        name: "Fudge Brownies",
        price: "Rp 22.000",
        description: "Cokelat premium yang padat, lembut, dan meleleh di mulut.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
        tag: "Dessert"
    }
];

/**
 * Initializes an infinite seamless looping marquee for the menu items.
 * @param containerId The ID of the container element
 * @param speed The duration of one loop in seconds (e.g. 30)
 */
export function initInfiniteMenu(containerId: string, speed: number = 30) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';
    
    // Add specific marquee classes to the container
    container.classList.add('marquee-container');

    // Generate HTML for one set of menu cards
    const generateCardsHtml = () => {
        return coffeeMenu.map(item => `
            <div class="menu-card flex flex-col w-[60vw] md:w-80 bg-surface-container rounded-xl overflow-hidden ambient-shadow flex-shrink-0 group-hover:shadow-lg transition-shadow duration-300 pointer-events-auto">
                <div class="h-40 md:h-48 overflow-hidden relative">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110" loading="lazy" />
                    <div class="absolute top-2 right-2 bg-surface/90 px-3 py-1 rounded-full text-label-md font-bold text-primary backdrop-blur-sm">${item.price}</div>
                </div>
                <div class="p-4 md:p-6 flex flex-col flex-1">
                    <h3 class="text-headline-md font-display-lg text-primary mb-2">${item.name}</h3>
                    <p class="text-body-md text-on-surface-variant mb-4">${item.description}</p>
                    <span class="inline-block px-2 py-1 bg-surface rounded text-[10px] uppercase tracking-widest text-secondary w-fit mt-auto">${item.tag}</span>
                </div>
            </div>
        `).join('');
    };

    const cardsHtml = generateCardsHtml();

    // Create the track
    const track = document.createElement('div');
    track.className = 'marquee-track';
    track.style.setProperty('--marquee-duration', `${speed}s`);

    // Create two identical groups for the seamless loop
    // Duplikasi 2x (atau lebih jika list sangat sedikit)
    const group1 = document.createElement('div');
    group1.className = 'marquee-group';
    group1.innerHTML = cardsHtml;

    const group2 = document.createElement('div');
    group2.className = 'marquee-group';
    group2.innerHTML = cardsHtml;

    track.appendChild(group1);
    track.appendChild(group2);
    container.appendChild(track);

    // --- Interaksi Drag / Swipe ---
    track.style.cursor = 'grab';

    let isDragging = false;
    let startX = 0;
    let hasDragged = false;

    const handleDragStart = (e: MouseEvent | TouchEvent) => {
        isDragging = true;
        hasDragged = false;
        track.style.cursor = 'grabbing';
        
        // Pause animasi melalui inline style
        track.style.animationPlayState = 'paused';
        
        if (e.type === 'touchstart') {
            startX = (e as TouchEvent).touches[0].clientX;
        } else {
            startX = (e as MouseEvent).clientX;
        }
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        
        const currentX = e.type === 'touchmove' 
            ? (e as TouchEvent).touches[0].clientX 
            : (e as MouseEvent).clientX;
            
        const deltaX = currentX - startX;
        
        if (Math.abs(deltaX) > 2) {
            hasDragged = true;
        }
        
        startX = currentX;

        // Ambil animasi CSS dari Web Animations API
        const animations = track.getAnimations();
        const marqueeAnimation = animations.find(a => (a as any).animationName === 'marquee-scroll');
        
        if (marqueeAnimation) {
            // Karena animasi translateX bergerak dari 0 ke -50% (sepanjang group1.offsetWidth)
            // Maka 1 siklus animasi (speed * 1000 ms) setara dengan jarak group1.offsetWidth
            const durationMs = speed * 1000;
            const distancePerCycle = group1.offsetWidth;
            
            // Konversi delta piksel ke delta waktu (ms).
            // Drag ke kiri (deltaX negatif) -> animasi maju -> tambah waktu.
            const timeDelta = -(deltaX / distancePerCycle) * durationMs;
            
            // Ubah currentTime secara dinamis
            const currentTime = (marqueeAnimation.currentTime as number) || 0;
            marqueeAnimation.currentTime = currentTime + timeDelta;
        }
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
        
        // Hapus inline style agar kembali mengikuti CSS (misal di-pause karena hover)
        track.style.animationPlayState = '';
    };

    // Cegah event click (termasuk tombol Add to Cart) jika user baru saja melakukan drag
    track.addEventListener('click', (e) => {
        if (hasDragged) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true); // Gunakan capture phase agar memotong event sebelum sampai ke button

    track.addEventListener('mousedown', handleDragStart);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);

    track.addEventListener('touchstart', handleDragStart, { passive: true });
    window.addEventListener('touchmove', handleDragMove, { passive: true });
    window.addEventListener('touchend', handleDragEnd);
}
