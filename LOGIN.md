<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Kinetic Ledger | Enterprise Inventory Auth</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Shared Style & Theme Integration -->
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "inverse-primary": "#bdc7dc",
                    "on-primary-fixed-variant": "#3d4759",
                    "primary": "#182232",
                    "on-surface": "#0d1c2e",
                    "surface-tint": "#555f71",
                    "on-tertiary-container": "#01b57e",
                    "primary-fixed-dim": "#bdc7dc",
                    "outline-variant": "#c5c6cd",
                    "secondary-fixed": "#d2e4ff",
                    "error-container": "#ffdad6",
                    "on-primary-container": "#96a0b5",
                    "surface-dim": "#ccdbf4",
                    "inverse-surface": "#223144",
                    "on-primary-fixed": "#121c2c",
                    "on-primary": "#ffffff",
                    "surface-variant": "#d4e4fc",
                    "primary-fixed": "#d9e3f9",
                    "surface-container-low": "#eff4ff",
                    "on-surface-variant": "#45474c",
                    "primary-container": "#2d3748",
                    "tertiary-fixed-dim": "#4edea3",
                    "on-secondary-fixed": "#001d37",
                    "tertiary-container": "#003f29",
                    "surface-container-lowest": "#ffffff",
                    "secondary-fixed-dim": "#9fcaff",
                    "on-secondary-fixed-variant": "#00497e",
                    "tertiary": "#002718",
                    "on-tertiary-fixed-variant": "#005236",
                    "surface-container-highest": "#d4e4fc",
                    "secondary": "#0061a5",
                    "on-error-container": "#93000a",
                    "error": "#ba1a1a",
                    "tertiary-fixed": "#6ffbbe",
                    "on-background": "#0d1c2e",
                    "surface-container-high": "#dce9ff",
                    "inverse-on-surface": "#eaf1ff",
                    "surface-bright": "#f8f9ff",
                    "on-tertiary-fixed": "#002113",
                    "background": "#f8f9ff",
                    "surface": "#f8f9ff",
                    "on-secondary": "#ffffff",
                    "outline": "#75777d",
                    "secondary-container": "#66affe",
                    "surface-container": "#e5eeff",
                    "on-tertiary": "#ffffff",
                    "on-secondary-container": "#004172",
                    "on-error": "#ffffff"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "spacing": {
                    "stack-sm": "8px",
                    "gutter": "12px",
                    "stack-md": "16px",
                    "container-padding": "16px",
                    "unit": "4px",
                    "stack-lg": "24px"
            },
            "fontFamily": {
                    "body-sm": ["Inter"],
                    "label-caps": ["Inter"],
                    "headline-lg": ["Inter"],
                    "headline-md": ["Inter"],
                    "data-mono": ["JetBrains Mono"],
                    "body-md": ["Inter"],
                    "headline-lg-mobile": ["Inter"]
            },
            "fontSize": {
                    "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600"}],
                    "headline-lg": ["30px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                    "data-mono": ["13px", {"lineHeight": "18px", "fontWeight": "500"}],
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "700"}]
            }
          },
        },
      }
    </script>
<style>
        body { font-family: 'Inter', sans-serif; background-color: #F7FAFC; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .auth-card {
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
        }
        .transition-cubic {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-overlay {
            background: rgba(24, 34, 50, 0.7);
            backdrop-filter: blur(8px);
        }
    </style>
</head>
<body class="min-h-screen overflow-x-hidden">
<main class="flex min-h-screen relative"><div class="absolute inset-0 z-0 opacity-20" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuALQwM-Ju53Upabr9Hqm_nH3KXV9z4-VvxOMZcije2g_6m28fJIb7nGBQSh62ECSbumLMv167INyNHHDnvsRH-gqWqxZuuQgAn4FSi1gpb3_wThw_dxKzHWVfSpEiREvD9k7dZSGxx3QMzm2dxZU4x4kC9Z6NRSyIr0KPOwYVMlotKQct48hq4fQn5FtgKmQv__T2177Cl5_UYTDZWHadmb27orevSgIjHK8RQlO0-EtzHCfD_3bNrfuwSJB-2TXAJQmw42I3Zs9cM'); background-size: cover; background-position: center;"></div><div class="relative z-10 w-full min-h-screen flex items-center justify-center p-container-padding"><div class="w-full max-w-md"><div class="flex flex-col items-center gap-2 mb-stack-lg"><span class="material-symbols-outlined text-primary text-4xl" style="font-variation-settings: 'FILL' 1;">inventory_2</span><h1 class="font-headline-lg text-headline-lg text-primary">Kinetic Ledger</h1></div><div class="bg-white border border-outline-variant rounded-xl p-stack-lg auth-card transition-cubic"><div class="flex border-b border-outline-variant mb-stack-lg"><button class="flex-1 py-3 font-label-caps text-label-caps border-b-2 border-primary text-primary transition-all" id="signInTab" onclick="switchTab('signin')">SIGN IN</button><button class="flex-1 py-3 font-label-caps text-label-caps border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-all" id="signUpTab" onclick="switchTab('signup')">CREATE ACCOUNT</button></div><div class="mb-stack-md" id="authHeader"><h2 class="font-headline-md text-headline-md text-on-surface">Welcome back</h2><p class="font-body-sm text-body-sm text-on-surface-variant">Access your warehouse dashboard</p></div><form class="space-y-stack-md" onsubmit="return false;"><div class="space-y-unit"><label class="font-label-caps text-label-caps text-on-surface-variant">EMAIL ADDRESS</label><input class="w-full h-11 px-4 border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all font-body-md text-body-md" placeholder="manager@warehouse.com" type="email"/></div><div class="space-y-unit"><div class="flex justify-between items-center"><label class="font-label-caps text-label-caps text-on-surface-variant">PASSWORD</label><a class="text-secondary font-label-caps text-label-caps hover:underline" href="#" id="forgotPassword">FORGOT PASSWORD?</a></div><input class="w-full h-11 px-4 border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all font-body-md text-body-md" placeholder="••••••••" type="password"/></div><div class="space-y-unit hidden opacity-0 transition-all duration-300" id="confirmPasswordGroup"><label class="font-label-caps text-label-caps text-on-surface-variant">CONFIRM PASSWORD</label><input class="w-full h-11 px-4 border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all font-body-md text-body-md" placeholder="••••••••" type="password"/></div><div class="flex items-center gap-2 py-unit"><input class="w-4 h-4 rounded text-secondary border-outline-variant focus:ring-secondary" id="remember" type="checkbox"/><label class="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" for="remember">Remember this device for 30 days</label></div><button class="w-full h-11 bg-primary text-white font-label-caps text-label-caps rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm" id="mainCta">SIGN IN <span class="material-symbols-outlined text-[20px]">arrow_forward</span></button></form><div class="relative flex py-stack-lg items-center"><div class="flex-grow border-t border-outline-variant"></div><span class="flex-shrink mx-4 font-label-caps text-label-caps text-on-primary-container">OR CONTINUING WITH SSO</span><div class="flex-grow border-t border-outline-variant"></div></div><div class="grid grid-cols-2 gap-stack-sm"><button class="flex items-center justify-center gap-2 h-11 border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low transition-all"><svg class="w-5 h-5" viewbox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg> Google</button><button class="flex items-center justify-center gap-2 h-11 border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low transition-all"><svg class="w-5 h-5" viewbox="0 0 24 24"><path d="M11.4 12V1.5H1.5V11.4h9.9zm0 10.5V12.6H1.5V22.5h9.9zm1.1-10.5h9.9V1.5h-9.9V12zm0 10.5h9.9V12.6h-9.9v9.9z" fill="#0078D4"></path></svg> Microsoft</button></div><p class="mt-stack-lg text-center font-body-sm text-body-sm text-on-surface-variant">Secure connection via AES-256 encryption.<br/><a class="text-secondary hover:underline" href="#">Privacy Policy</a> • <a class="text-secondary hover:underline" href="#">Terms of Service</a></p></div></div></div></main>
<script>
        function switchTab(mode) {
            const signInTab = document.getElementById('signInTab');
            const signUpTab = document.getElementById('signUpTab');
            const mainCta = document.getElementById('mainCta');
            const authHeader = document.getElementById('authHeader');
            const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
            const forgotPassword = document.getElementById('forgotPassword');

            if (mode === 'signup') {
                // UI Changes for Sign Up
                signInTab.classList.replace('border-primary', 'border-transparent');
                signInTab.classList.replace('text-primary', 'text-on-surface-variant');
                signUpTab.classList.replace('border-transparent', 'border-primary');
                signUpTab.classList.replace('text-on-surface-variant', 'text-primary');
                
                mainCta.innerHTML = `GET STARTED <span class="material-symbols-outlined text-[20px]">rocket_launch</span>`;
                authHeader.querySelector('h2').innerText = "Create Account";
                authHeader.querySelector('p').innerText = "Start managing your mobile inventory";
                
                forgotPassword.classList.add('hidden');
                confirmPasswordGroup.classList.remove('hidden');
                setTimeout(() => confirmPasswordGroup.classList.remove('opacity-0'), 10);
            } else {
                // UI Changes for Sign In
                signUpTab.classList.replace('border-primary', 'border-transparent');
                signUpTab.classList.replace('text-primary', 'text-on-surface-variant');
                signInTab.classList.replace('border-transparent', 'border-primary');
                signInTab.classList.replace('text-on-surface-variant', 'text-primary');
                
                mainCta.innerHTML = `SIGN IN <span class="material-symbols-outlined text-[20px]">arrow_forward</span>`;
                authHeader.querySelector('h2').innerText = "Welcome back";
                authHeader.querySelector('p').innerText = "Access your warehouse dashboard";
                
                forgotPassword.classList.remove('hidden');
                confirmPasswordGroup.classList.add('opacity-0');
                setTimeout(() => confirmPasswordGroup.classList.add('hidden'), 300);
            }
        }
    </script>
</body></html>


Now I want us to start with the frontend, but do not code anything, above is the code for the login page, I would want you to convert it into React jsx code for me
Below will be the landing page for the website, change the name of the site to Technova-Store and use the colour pallette as said in the frontend architecture md and make sure you changethat to React jsx as well
Bear in mind to change the Kinetic Ledger to Technova-Store


<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Kinetic Ledger | Precision Inventory Control</title>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Google Fonts: Inter & JetBrains Mono -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "background": "#f8f9ff",
                        "on-background": "#0d1c2e",
                        "surface-container-low": "#eff4ff",
                        "on-surface-variant": "#45474c",
                        "on-primary-fixed-variant": "#3d4759",
                        "surface-container-highest": "#d4e4fc",
                        "on-tertiary-container": "#01b57e",
                        "on-primary-container": "#96a0b5",
                        "primary-fixed": "#d9e3f9",
                        "inverse-primary": "#bdc7dc",
                        "surface-dim": "#ccdbf4",
                        "on-tertiary-fixed-variant": "#005236",
                        "secondary-fixed-dim": "#9fcaff",
                        "inverse-on-surface": "#eaf1ff",
                        "on-primary": "#ffffff",
                        "on-error-container": "#93000a",
                        "secondary-fixed": "#d2e4ff",
                        "inverse-surface": "#223144",
                        "on-tertiary-fixed": "#002113",
                        "surface-variant": "#d4e4fc",
                        "surface": "#f8f9ff",
                        "primary": "#182232",
                        "error-container": "#ffdad6",
                        "on-secondary": "#ffffff",
                        "primary-fixed-dim": "#bdc7dc",
                        "on-secondary-fixed-variant": "#00497e",
                        "outline": "#75777d",
                        "tertiary-fixed": "#6ffbbe",
                        "tertiary-container": "#003f29",
                        "error": "#ba1a1a",
                        "tertiary-fixed-dim": "#4edea3",
                        "surface-container-lowest": "#ffffff",
                        "on-tertiary": "#ffffff",
                        "surface-bright": "#f8f9ff",
                        "on-primary-fixed": "#121c2c",
                        "tertiary": "#002718",
                        "secondary-container": "#66affe",
                        "on-error": "#ffffff",
                        "primary-container": "#2d3748",
                        "outline-variant": "#c5c6cd",
                        "on-surface": "#0d1c2e",
                        "surface-container-high": "#dce9ff",
                        "on-secondary-fixed": "#001d37",
                        "secondary": "#0061a5",
                        "on-secondary-container": "#004172",
                        "surface-container": "#e5eeff",
                        "surface-tint": "#555f71"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "stack-lg": "24px",
                        "gutter": "12px",
                        "container-padding": "16px",
                        "unit": "4px",
                        "stack-sm": "8px",
                        "stack-md": "16px"
                    },
                    "fontFamily": {
                        "body-sm": ["Inter"],
                        "headline-lg": ["Inter"],
                        "data-mono": ["JetBrains Mono"],
                        "body-md": ["Inter"],
                        "label-caps": ["Inter"],
                        "headline-md": ["Inter"],
                        "headline-lg-mobile": ["Inter"]
                    },
                    "fontSize": {
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "headline-lg": ["30px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "data-mono": ["13px", {"lineHeight": "18px", "fontWeight": "500"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600"}],
                        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                        "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "700"}]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            vertical-align: middle;
        }
        .bento-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .bento-card:hover {
            transform: translateY(-2px);
        }
        .scan-line {
            position: absolute;
            width: 100%;
            height: 2px;
            background: #0061a5;
            top: 0;
            animation: scanning 3s infinite linear;
            box-shadow: 0 0 8px #0061a5;
        }
        @keyframes scanning {
            0% { top: 0; }
            100% { top: 100%; }
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
<!-- TopNavBar -->
<header class="sticky top-0 w-full z-50 bg-background border-b border-outline-variant">
<nav class="flex justify-between items-center px-container-padding h-16 max-w-7xl mx-auto">
<div class="flex items-center gap-gutter">
<span class="font-headline-md text-headline-md text-primary">Kinetic Ledger</span>
</div>
<div class="hidden md:flex gap-stack-lg items-center">
<a class="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">Features</a>
<a class="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">Solutions</a>
<a class="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md" href="#">Pricing</a>
</div>
<div class="flex items-center gap-stack-md">
<button class="hidden sm:block text-on-surface-variant font-body-md text-body-md px-4 py-2 hover:bg-surface-container transition-all">Login</button>
<button class="bg-primary text-on-primary font-body-md text-body-md px-6 py-2 rounded-lg hover:opacity-80 transition-all">Get Started</button>
</div>
</nav>
</header>
<main>
<!-- Hero Section -->
<section class="relative overflow-hidden pt-20 pb-32">
<div class="max-w-7xl mx-auto px-container-padding grid md:grid-cols-2 gap-stack-lg items-center">
<div class="z-10">
<div class="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-secondary rounded-full mb-6">
<span class="material-symbols-outlined text-[18px]">verified</span>
<span class="font-label-caps text-label-caps uppercase">Enterprise V2.0 Now Live</span>
</div>
<h1 class="font-headline-lg text-[48px] leading-[56px] md:text-[64px] md:leading-[72px] text-primary mb-6 tracking-tight">
                        Precision Inventory Control for <span class="text-secondary">Mobile Hardware</span>
</h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-xl mb-10 leading-relaxed">
                        Secure, scalable, and built for precision logistics. Manage your entire supply chain with real-time analytics, blockchain-backed custody, and automated auditing.
                    </p>
<div class="flex flex-wrap gap-4">
<button class="bg-primary text-on-primary px-8 py-4 rounded-lg font-headline-md text-headline-md hover:bg-primary-container transition-all flex items-center gap-2">
                            Get Started
                            <span class="material-symbols-outlined">arrow_forward</span>
</button>
<button class="border border-secondary text-secondary px-8 py-4 rounded-lg font-headline-md text-headline-md hover:bg-secondary-container transition-all flex items-center gap-2">
<span class="material-symbols-outlined">play_circle</span>
                            Watch Demo
                        </button>
</div>
</div>
<div class="relative mt-12 md:mt-0">
<div class="aspect-square bg-surface-container-highest rounded-xl overflow-hidden border border-outline-variant relative">
<img class="w-full h-full object-cover" data-alt="A professional, high-angle shot of a sleek, modern logistics center at night. The scene features glowing blue server racks and rows of high-end mobile hardware neatly organized on industrial shelves. The lighting is crisp and cool, emphasizing precision and technological sophistication. The overall atmosphere is secure, digital, and hyper-efficient, mirroring a corporate industrial aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbarHQeb3zEt2XD-JkMF_DfcF-GufTLXqUVRh5XDPa3cs6sZ8ZVZ9-dYiVw1uHmGqmzhoVg9T_XaYH-8cN8IpEL70d8d996IQPPkj51b1MqrB2wIF8NUrQ4xVYpc5Shc68UHlTcq10dEF1hTfWIvkzcQ94gnex4tUiGZ1Z-l5nhb81AnDXqToAbxOJI_K6flQcXReMcABjzGOB6LXJWEpEZFU5hUePawmvqukyfUl2BQSmcEpZNMB66ocKHzSbo66nd_SS-SDoqx0"/>
<div class="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
<div class="scan-line"></div>
<!-- Floating Data Card -->
<div class="absolute bottom-6 left-6 right-6 bg-surface p-4 rounded-lg border border-outline-variant shadow-lg flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-on-tertiary-container/10 flex items-center justify-center text-on-tertiary-container">
<span class="material-symbols-outlined">check_circle</span>
</div>
<div>
<p class="font-label-caps text-label-caps text-on-surface-variant">ASSET STATUS</p>
<p class="font-data-mono text-data-mono text-primary">KL-9042-PX SECURED</p>
</div>
</div>
<div class="text-right">
<p class="font-label-caps text-label-caps text-on-surface-variant">LOCATOR</p>
<p class="font-data-mono text-data-mono text-secondary">WH-NORTH-04</p>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Features Bento Grid -->
<section class="py-24 bg-surface-container-lowest">
<div class="max-w-7xl mx-auto px-container-padding">
<div class="text-center mb-16">
<h2 class="font-headline-lg text-headline-lg text-primary mb-4">Master Your Supply Chain</h2>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                        Engineered for the demands of high-value asset management, our core features provide visibility where others see blind spots.
                    </p>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-gutter">
<!-- Large Feature Card -->
<div class="md:col-span-2 md:row-span-2 bento-card bg-surface border border-outline-variant p-8 rounded-xl flex flex-col justify-between overflow-hidden relative">
<div class="z-10">
<span class="material-symbols-outlined text-secondary text-[40px] mb-6">sensors</span>
<h3 class="font-headline-md text-headline-md text-primary mb-4">Real-time Tracking</h3>
<p class="font-body-md text-body-md text-on-surface-variant mb-6">
                                Track every asset across global transit points with sub-meter accuracy. Our IoT integration provides instant telemetry on location, temperature, and handling.
                            </p>
</div>
<div class="mt-auto z-10">
<img class="rounded-lg border border-outline-variant w-full h-48 object-cover" data-alt="A clean, minimalist data visualization map of a global supply chain. Lines connect glowing blue nodes across a dark slate world map. The UI elements around the map are precise and data-dense, showing small charts and asset tags. The aesthetic is corporate and high-tech, using tech blue and deep slate colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbhiHLms6ehypxC7pEUqe6GuZ2VhKsdR4q1_mwuEtPeDJv8wD3vmSQ6lzlxMFxzgPacXkKC0IwyJw7UCznB66-SrrEEEcW1EN9YeOoFzdh624ZDNn5tfYZiLQDVSOdMsQ92at0n_gVqz_8yTXKwuOI54sNox5SF_pcLzDA_XgtwmkxvHU7QvkBcBa3rvkt869RxCF2eCXiiyomORvn3vc-EhlT1WhAcIXq8eXOp9yxylz8J2owfFOHoL6XTQfn40_HYB8pTDFMiOI"/>
</div>
<div class="absolute top-0 right-0 p-4 font-data-mono text-[10px] text-outline opacity-30 select-none">
                            LAT: 34.0522° N <br/> LNG: 118.2437° W
                        </div>
</div>
<!-- Medium Card 1 -->
<div class="md:col-span-2 bento-card bg-surface-container-low border border-outline-variant p-8 rounded-xl flex items-center gap-6">
<div class="flex-shrink-0 w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-on-primary">
<span class="material-symbols-outlined text-[32px]">sync_alt</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-primary mb-2">Automated Replenishment</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                                Smart threshold monitoring triggers procurement orders automatically, ensuring zero downtime for your field technicians.
                            </p>
</div>
</div>
<!-- Small Card 1 -->
<div class="bento-card bg-surface border border-outline-variant p-6 rounded-xl">
<span class="material-symbols-outlined text-secondary mb-4">shield_with_heart</span>
<h3 class="font-headline-md text-[18px] text-primary mb-2">Secure Chain of Custody</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                            Every transfer is cryptographically signed and logged for absolute accountability.
                        </p>
</div>
<!-- Small Card 2 -->
<div class="bento-card bg-surface border border-outline-variant p-6 rounded-xl">
<span class="material-symbols-outlined text-secondary mb-4">domain</span>
<h3 class="font-headline-md text-[18px] text-primary mb-2">Multi-Warehouse Support</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                            Unify disparate locations into a single, cohesive logical inventory system.
                        </p>
</div>
</div>
</div>
</section>
<!-- Why Kinetic Ledger -->
<section class="py-24 bg-primary text-on-primary overflow-hidden">
<div class="max-w-7xl mx-auto px-container-padding relative">
<!-- Background Decorative Element -->
<div class="absolute -right-20 -top-20 opacity-10">
<span class="material-symbols-outlined text-[400px]" style="font-variation-settings: 'wght' 100">security</span>
</div>
<div class="grid md:grid-cols-2 gap-16 items-center">
<div>
<h2 class="font-headline-lg text-[36px] leading-[44px] mb-8">Why Enterprise Leaders Choose Kinetic Ledger</h2>
<div class="space-y-8">
<div class="flex gap-4">
<div class="flex-shrink-0 w-12 h-12 bg-on-primary/10 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-secondary-fixed">enhanced_encryption</span>
</div>
<div>
<h4 class="font-headline-md text-headline-md mb-2">Military-Grade Security</h4>
<p class="font-body-md text-body-md text-on-primary-container">
                                        All data is protected with AES-256 at-rest and TLS 1.3 in-transit. We implement zero-trust architecture to ensure only authorized personnel access sensitive asset logs.
                                    </p>
</div>
</div>
<div class="flex gap-4">
<div class="flex-shrink-0 w-12 h-12 bg-on-primary/10 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-secondary-fixed">cloud_done</span>
</div>
<div>
<h4 class="font-headline-md text-headline-md mb-2">Global Reliability</h4>
<p class="font-body-md text-body-md text-on-primary-container">
                                        Distributed across 24 regional data centers with 99.99% uptime SLAs. Your inventory data is always synchronized and available, even in low-connectivity field environments.
                                    </p>
</div>
</div>
<div class="flex gap-4">
<div class="flex-shrink-0 w-12 h-12 bg-on-primary/10 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-secondary-fixed">query_stats</span>
</div>
<div>
<h4 class="font-headline-md text-headline-md mb-2">Predictive Intelligence</h4>
<p class="font-body-md text-body-md text-on-primary-container">
                                        Leverage AI to forecast hardware failure rates and maintenance cycles, reducing unexpected operational costs by up to 30%.
                                    </p>
</div>
</div>
</div>
</div>
<div class="grid grid-cols-2 gap-4">
<div class="space-y-4 pt-12">
<div class="bg-primary-container p-6 rounded-xl border border-outline/20">
<p class="font-headline-lg text-secondary-fixed mb-1">256-bit</p>
<p class="font-label-caps text-label-caps text-on-primary-container uppercase">Encryption Standard</p>
</div>
<div class="bg-primary-container p-6 rounded-xl border border-outline/20">
<p class="font-headline-lg text-secondary-fixed mb-1">99.99%</p>
<p class="font-label-caps text-label-caps text-on-primary-container uppercase">System Uptime</p>
</div>
</div>
<div class="space-y-4">
<div class="bg-primary-container p-6 rounded-xl border border-outline/20">
<p class="font-headline-lg text-secondary-fixed mb-1">&lt; 50ms</p>
<p class="font-label-caps text-label-caps text-on-primary-container uppercase">Global Latency</p>
</div>
<div class="bg-primary-container p-6 rounded-xl border border-outline/20">
<p class="font-headline-lg text-secondary-fixed mb-1">1M+</p>
<p class="font-label-caps text-label-caps text-on-primary-container uppercase">Assets Managed</p>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- CTA Section -->
<section class="py-24 bg-background">
<div class="max-w-5xl mx-auto px-container-padding text-center">
<div class="bg-surface-container rounded-3xl p-12 border border-outline-variant relative overflow-hidden">
<div class="z-10 relative">
<h2 class="font-headline-lg text-[32px] mb-6 text-primary">Ready to scale your logistics operations?</h2>
<p class="font-body-md text-body-md text-on-surface-variant mb-10 max-w-2xl mx-auto">
                            Join over 500 enterprise companies that trust Kinetic Ledger for their critical hardware inventory and supply chain management.
                        </p>
<div class="flex flex-col sm:flex-row gap-4 justify-center">
<button class="bg-primary text-on-primary px-10 py-4 rounded-lg font-headline-md text-headline-md hover:opacity-90 transition-all">Start Free Trial</button>
<button class="bg-surface-container-highest text-primary px-10 py-4 rounded-lg font-headline-md text-headline-md hover:bg-surface-dim transition-all">Schedule Consultation</button>
</div>
</div>
<!-- Decorative shapes -->
<div class="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
<div class="absolute -top-12 -right-12 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="w-full py-stack-lg bg-surface-container-low border-t border-outline-variant">
<div class="flex flex-col md:flex-row justify-between items-center px-container-padding max-w-7xl mx-auto gap-stack-md">
<div class="flex flex-col items-center md:items-start gap-2">
<span class="font-headline-md text-headline-md text-primary">Kinetic Ledger</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">© 2024 Kinetic Ledger. All rights reserved.</p>
</div>
<div class="flex flex-wrap justify-center gap-6">
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all duration-200" href="#">Privacy Policy</a>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all duration-200" href="#">Terms of Service</a>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all duration-200" href="#">Contact Support</a>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all duration-200" href="#">API Documentation</a>
</div>
<div class="flex gap-4">
<a class="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all" href="#">
<svg class="w-5 h-5 fill-current" viewbox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
</a>
<a class="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all" href="#">
<svg class="w-5 h-5 fill-current" viewbox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg>
</a>
</div>
</div>
</footer>
<script>
        // Simple scroll reveal interaction
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-4');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.bento-card').forEach(el => {
            el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
            observer.observe(el);
        });
    </script>
</body></html>