// JavaScript extracted from generator-urari.html

        // --- DOM Elements ---
        const tabsContainer = document.getElementById('tabsContainer');
        const tabContentContainer = document.getElementById('tab-content-container');
        const giftIdeasResultsContainer = document.getElementById('gift-ideas-results-container');
        const loadingIndicator = document.getElementById('loading-indicator');
        const errorMessageContainer = document.getElementById('error-message-container');
        const favoritesButtonContainer = document.getElementById('favorites-button-container');
        const favoritesModal = document.getElementById('favorites-modal');
        const favoritesModalOverlay = document.getElementById('favorites-modal-overlay');
        const closeFavoritesModalButton = document.getElementById('close-favorites-modal');
        const favoritesListContainer = document.getElementById('favorites-list-container');
        function isCaptchaVerified() {
            return typeof grecaptcha === 'undefined' || grecaptcha.getResponse().length > 0;
        }
        
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        const API_MODEL = "gemini-2.0-flash";
        const API_ENDPOINT = "/api/generate";
        const FAVORITES_KEY = 'generatorUrariFavorites';
        let favorites = JSON.parse(sessionStorage.getItem(FAVORITES_KEY)) || JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
        sessionStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

        const occasions = [
            { 
                id: 'la-multi-ani', title: 'La Mulți Ani 🎂', promptName: "La Mulți Ani", 
                fields: [
                    { id: 'name', label: 'Numele sărbătoritului/ei (opțional):', type: 'text', placeholder: 'Ex: Ana, Bunicul Ion' },
                    { id: 'relationship', label: 'Relația:', type: 'text', placeholder: 'Ex: prietenă dragă, tată' },
                    { id: 'hobbies', label: 'Hobby-uri/Pasiuni (opțional):', type: 'text', placeholder: 'Ex: cititul, călătoriile' },
                    { id: 'quality', label: 'O calitate/detaliu special (opțional):', type: 'text', placeholder: 'Ex: mereu zâmbitoare' }
                ],
                tones: [
                    { value: 'personal', text: 'Personal (apropiat)', selected: true },
                    { value: 'prietenos', text: 'Prietenos' },
                    { value: 'serios', text: 'Serios (formal)' },
                    { value: 'sarcastic', text: 'Sarcastic (jucăuș)' },
                    { value: 'poetic', text: 'Poetic' }
                ],
                showGiftButton: true
            },
            { 
                id: 'craciun', title: 'Crăciun 🎄', promptName: "Crăciun",
                fields: [
                    { id: 'name', label: 'Nume destinatar (opțional):', type: 'text', placeholder: 'Ex: Familia Popescu, Dragi prieteni' },
                    { id: 'relationship', label: 'Relația (opțional):', type: 'text', placeholder: 'Ex: prieteni, familie, colegi' }
                ],
                tones: [
                    { value: 'personal', text: 'Personal', selected: true },
                    { value: 'generic-whatsapp', text: 'Generic (WhatsApp)' },
                    { value: 'facebook', text: 'Facebook' }
                ],
                options: [
                    { id: 'includeReligiousNote', label: 'Include urare religioasă subtilă', type: 'checkbox' }
                ],
                showGiftButton: false
            },
            { 
                id: 'an-nou', title: 'An Nou 🎆', promptName: "An Nou",
                fields: [
                    { id: 'name', label: 'Nume destinatar (opțional):', type: 'text', placeholder: 'Ex: Tuturor, Dragă Ana' },
                    { id: 'relationship', label: 'Relația (opțional):', type: 'text', placeholder: 'Ex: prieteni, familie' }
                ],
                tones: [
                    { value: 'personal', text: 'Personal', selected: true },
                    { value: 'generic-whatsapp', text: 'Generic (WhatsApp)' },
                    { value: 'facebook', text: 'Facebook' }
                ],
                showGiftButton: false
            },
            {
                id: 'paste', title: 'Paște 🕊️', promptName: "Paște",
                fields: [
                    { id: 'name', label: 'Nume destinatar (opțional):', type: 'text', placeholder: 'Ex: Familia Ionescu' },
                    { id: 'relationship', label: 'Relația (opțional):', type: 'text', placeholder: 'Ex: nași, prieteni apropiați' }
                ],
                tones: [ { value: 'personal', text: 'Personal', selected: true }, { value: 'generic-whatsapp', text: 'Generic (WhatsApp)' } ],
                options: [ { id: 'includeTraditions', label: 'Include tradiții românești', type: 'checkbox' } ],
                showGiftButton: false
            },
            {
                id: '8-martie', title: '8 Martie 🌸', promptName: "8 Martie", specificGender: "female",
                fields: [
                    { id: 'name', label: 'Numele doamnei/domnișoarei:', type: 'text', placeholder: 'Ex: Mama, Ana, Doamna Profesoară', required: true },
                    { id: 'relationship', label: 'Relația:', type: 'text', placeholder: 'Ex: mamă, iubită, colegă', required: true },
                    { id: 'hobbies', label: 'Hobby-uri (opțional):', type: 'text', placeholder: 'Ex: florile, cărțile' }
                ],
                tones: [ { value: 'personal', text: 'Personal', selected: true }, { value: 'glumet', text: 'Glumeț' }, { value: 'facebook', text: 'Facebook' } ],
                options: [ { id: 'forChild', label: 'Urare pentru copil (ex: fetiță)', type: 'checkbox' } ],
                showGiftButton: true
            },
            {
                id: 'zi-de-sfant', title: 'Zi de Sfânt 🙏', promptName: "Zi de Sfânt",
                fields: [
                    { id: 'firstName', label: 'Prenumele sărbătoritului/ei:', type: 'text', placeholder: 'Ex: Andrei, Maria', required: true },
                    { id: 'saintName', label: 'Numele Sfântului (opțional):', type: 'text', placeholder: 'Ex: Sf. Andrei, Sf. Maria' },
                    { id: 'relationship', label: 'Relația:', type: 'text', placeholder: 'Ex: prieten, fin, bunică', required: true }
                ],
                tones: [ { value: 'personal', text: 'Personal', selected: true }, { value: 'poetic', text: 'Poetic' }, { value: 'respectuos', text: 'Respectuos' } ],
                showGiftButton: false
            },
             {
                id: 'nunta', title: 'Nuntă 💍', promptName: "Nuntă",
                fields: [
                    { id: 'coupleNames', label: 'Numele mirilor (opțional):', type: 'text', placeholder: 'Ex: Ana și Dan' },
                    { id: 'relationship', label: 'Relația cu mirii:', type: 'text', placeholder: 'Ex: prieteni, rude, colegi', required: true }
                ],
                tones: [ { value: 'emotional', text: 'Emoțional', selected: true }, { value: 'glumet', text: 'Glumeț' }, { value: 'formal', text: 'Formal' } ],
                options: [ { id: 'modernCouple', label: 'Pentru un cuplu modern', type: 'checkbox' } ],
                showGiftButton: false
            },
            {
                id: 'botez', title: 'Botez 👶', promptName: "Botez", specificGender: "child",
                fields: [
                    { id: 'childName', label: 'Numele copilului (opțional):', type: 'text', placeholder: 'Ex: David, Sofia' },
                    { id: 'parentsRelationship', label: 'Relația cu părinții:', type: 'text', placeholder: 'Ex: prieteni, fini', required: true }
                ],
                tones: [ { value: 'calduros', text: 'Călduros', selected: true }, { value: 'jucaus', text: 'Jucăuș' }, { value: 'religios-subtil', text: 'Religios subtil' } ],
                options: [ 
                    { id: 'addressedTo', label: 'Cui e adresată urarea?', type: 'radio', name:'addressedTo', options: [
                        {value: 'copilului', text: 'Copilului', checked: true}, {value: 'parintilor', text: 'Părinților'}
                    ]}
                ],
                showGiftButton: false
            },
             {
                id: 'pensionare', title: 'Pensionare 🎁', promptName: "Pensionare",
                fields: [
                    { id: 'name', label: 'Numele persoanei:', type: 'text', placeholder: 'Ex: Domnul Ionescu', required: true },
                    { id: 'relationship', label: 'Relația:', type: 'text', placeholder: 'Ex: coleg, mentor, vecin', required: true },
                    { id: 'quality', label: 'O calitate/realizare:', type: 'text', placeholder: 'Ex: dedicarea, anii de muncă', required: true }
                ],
                tones: [ { value: 'emotional', text: 'Emoțional', selected: true }, { value: 'glumet', text: 'Glumeț' }, { value: 'formal', text: 'Formal' } ],
                options: [ { id: 'newBeginnings', label: 'Include mesaj de început de nou drum', type: 'checkbox' } ],
                showGiftButton: false
            },
            {
                id: 'valentines-day', title: "Valentine's Day 💘", promptName: "Valentine's Day",
                fields: [
                    { id: 'name', label: 'Numele iubitei/iubitului (opțional):', type: 'text', placeholder: 'Ex: Iubirea mea, Alex' },
                    { id: 'relationship', label: 'Tipul relației:', type: 'text', placeholder: 'Ex: partener/ă, soț/soție', required: true }
                ],
                tones: [ { value: 'romantic', text: 'Romantic', selected: true }, { value: 'glumet', text: 'Glumeț' }, { value: 'poetic', text: 'Poetic' } ],
                options: [
                     { id: 'romanticStyle', label: 'Stil romantic:', type: 'radio', name:'romanticStyle', options: [
                        {value: 'wordPlay', text: 'Include joc de cuvinte romantic', checked: true}, {value: 'noSweetTalk', text: 'Fără dulcegării excesive'}
                    ]}
                ],
                showGiftButton: true
            },
            {
                id: 'condoleante', title: 'Condoleanțe 🕯️', promptName: "Condoleanțe", specificTone: "sobru",
                fields: [
                    { id: 'deceasedName', label: 'Numele persoanei decedate (opțional):', type: 'text', placeholder: 'Ex: Bunicul Vasile' },
                    { id: 'relationshipToDeceasedOrFamily', label: 'Relația cu persoana decedată / familia:', type: 'text', placeholder: 'Ex: prieten al familiei, rudă', required: true }
                ],
                tones: [ { value: 'sobru', text: 'Sobru și respectuos', selected: true }, { value: 'emotional-cald', text: 'Emoțional și cald' } ],
                options: [ { id: 'moralSupportEnding', label: 'Include încheiere cu sprijin moral', type: 'checkbox' } ],
                showGiftButton: false
            },
            {
                id: 'raspuns-urari', title: 'Răspuns Urări 💬', promptName: "Răspuns la Urări", isReplyGenerator: true,
                fields: [
                    { id: 'receivedWish', label: 'Urarea primită:', type: 'textarea', placeholder: 'Introduceți aici textul urării pe care ați primit-o...' },
                    { id: 'senderRelationship', label: 'Relația cu expeditorul (opțional):', type: 'text', placeholder: 'Ex: prieten bun, colegă' }
                ],
                showGiftButton: false 
            }
        ];

        let activeTabId = occasions[0].id;

        // --- Favorites and modal utility functions ---
        function updateFavoritesButtonVisibility() {
            if (favorites.length > 0) {
                if (!document.getElementById('view-favorites-button')) {
                    const button = document.createElement('button');
                    button.id = 'view-favorites-button';
                    button.classList.add('btn-primary', 'btn-purple', 'w-full', 'sm:w-auto', 'mx-auto');
                    button.innerHTML = `❤️ Vezi Favorite (${favorites.length})`;
                    button.onclick = openFavoritesModal;
                    favoritesButtonContainer.innerHTML = '';
                    favoritesButtonContainer.appendChild(button);
                } else {
                     document.getElementById('view-favorites-button').innerHTML = `❤️ Vezi Favorite (${favorites.length})`;
                }
            } else {
                favoritesButtonContainer.innerHTML = '';
            }
        }

        function openFavoritesModal() {
            renderFavoritesList();
            favoritesModal.classList.remove('hidden');
            favoritesModal.classList.add('flex');
            setTimeout(() => {
                const modalContent = document.getElementById('favorites-modal-content');
                if (modalContent) { 
                    modalContent.style.transform = 'scale(1)';
                    modalContent.style.opacity = '1';
                }
                const overlay = document.getElementById('favorites-modal-overlay');
                if (overlay) { 
                    overlay.style.opacity = '0.6'; 
                }
            }, 10); 
        }

        function closeFavoritesModal() {
            const modalContent = document.getElementById('favorites-modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(0.95)';
                modalContent.style.opacity = '0';
            }
            const overlay = document.getElementById('favorites-modal-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
            setTimeout(() => {
                 if(favoritesModal) {
                    favoritesModal.classList.add('hidden');
                    favoritesModal.classList.remove('flex');
                 }
            }, 300); 
        }

        function renderFavoritesList() {
            favoritesListContainer.innerHTML = '';
            if (favorites.length === 0) {
                favoritesListContainer.innerHTML = '<p class="text-[var(--color-text-secondary)] text-center py-4">Nu ai nicio urare salvată ca favorită încă.</p>';
                return;
            }
            const sortedFavorites = [...favorites].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

            sortedFavorites.forEach((favWish, index) => {
                const wishCard = createWishCardDOM(favWish.text, `fav-${index}`, favWish.id, true, false);
                
                const removeButton = document.createElement('button');
                removeButton.classList.add('btn-secondary', 'mt-3', 'ml-auto', 'block', '!bg-red-100', '!text-red-700', '!border-red-300', 'hover:!bg-red-200');
                removeButton.innerHTML = 'Șterge';
                removeButton.onclick = () => {
                    removeFavorite(favWish.id);
                    renderFavoritesList(); 
                };
                
                const paragraph = wishCard.querySelector('.wish-text');
                if (paragraph) {
                     paragraph.insertAdjacentElement('afterend', removeButton);
                } else {
                    wishCard.appendChild(removeButton);
                }
                favoritesListContainer.appendChild(wishCard);
                setTimeout(() => wishCard.classList.add('visible'), 10 + index * 120);
            });
        }

        function toggleFavorite(wishText, wishId, heartButton) {
            const existingIndex = favorites.findIndex(fav => fav.id === wishId);
            if (existingIndex > -1) {
                favorites.splice(existingIndex, 1);
                heartButton.classList.remove('is-favorite');
                heartButton.innerHTML = getFavoriteIconSVG(false);
            } else {
                favorites.push({ id: wishId, text: wishText, dateAdded: new Date().toISOString() });
                heartButton.classList.add('is-favorite');
                heartButton.innerHTML = getFavoriteIconSVG(true);
            }
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            sessionStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            updateFavoritesButtonVisibility();
        }
        
        function removeFavorite(wishId) {
            favorites = favorites.filter(fav => fav.id !== wishId);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            sessionStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            updateFavoritesButtonVisibility();
        }

        function getFavoriteIconSVG(isFavorite) {
            if (isFavorite) {
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            }
            return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`;
        }
        
        async function callGeminiAPI(promptText, buttonElement, originalButtonText) {
            let isGlobalLoading = false;
            const allTabGenerateButtons = document.querySelectorAll('.generate-wish-for-tab-button');

            if (buttonElement) { 
                buttonElement.disabled = true;
                buttonElement.innerHTML = `<div class="small-loading-spinner"></div> Procesare...`;
            } else { 
                isGlobalLoading = true;
                loadingIndicator.classList.remove('hidden');
                allTabGenerateButtons.forEach(btn => btn.disabled = true);
                const giftBtnGlobal = document.getElementById('generate-gifts-button-global');
                if(giftBtnGlobal) giftBtnGlobal.disabled = true;
            }
            errorMessageContainer.classList.add('hidden');

            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: promptText })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: { message: "Răspuns invalid de la server." } }));
                    throw new Error(`Serviciul de generare a întâmpinat o problemă: ${errorData.error?.message || response.statusText} (Cod: ${response.status})`);
                }
                const result = await response.json();
                if (result.text) {
                    let text = result.text;
                    text = text.replace(/\([\s\S]*?\)/g, '').replace(/\[[\s\S]*?\]/g, '');
                    return text.trim();
                } else {
                    throw new Error("Am primit un răspuns neașteptat de la serviciu.");
                }
            } catch (error) {
                console.error('Eroare la apelul API Gemini:', error);
                displayError(error.message);
                return null;
            } finally {
                if (buttonElement) {
                    buttonElement.disabled = false;
                    buttonElement.innerHTML = originalButtonText;
                }
                if (isGlobalLoading) {
                    loadingIndicator.classList.add('hidden');
                    allTabGenerateButtons.forEach(btn => btn.disabled = false);
                    const giftBtnGlobal = document.getElementById('generate-gifts-button-global');
                    if(giftBtnGlobal) giftBtnGlobal.disabled = false;
                }
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.reset();
                }
            }
        }
        
        function createWishCardDOM(wishText, baseId, uniqueWishId, isFavoriteCard = false, includeActions = true, cardOccasionId = activeTabId) {
            const cleanedWish = wishText.replace(/^(\d+\.?\s*|-\s*|\*\s*)/, '').trim();
            const wishElement = document.createElement('div');
            wishElement.classList.add('wish-card');
            wishElement.id = baseId;

            const paragraph = document.createElement('p');
            paragraph.classList.add('wish-text');
            paragraph.textContent = cleanedWish;
            
            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.classList.add('btn-icon-wrapper');
            
            const copyButtonContainer = document.createElement('div'); 
            copyButtonContainer.classList.add('btn-copy-container');

            const copyButton = document.createElement('button');
            copyButton.classList.add('btn-copy');
            copyButton.title = "Copiază textul";
            copyButton.setAttribute('aria-label', copyButton.title);
            copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>`;
            copyButton.onclick = (event) => copyWishText(cleanedWish, event.currentTarget);
            
            const copiedFeedback = document.createElement('span');
            copiedFeedback.classList.add('copied-feedback');
            copiedFeedback.textContent = 'Copiat!';
            
            copyButtonContainer.appendChild(copyButton);
            copyButtonContainer.appendChild(copiedFeedback); 
            buttonsWrapper.appendChild(copyButtonContainer);


            if (!isFavoriteCard && includeActions) { 
                const heartButton = document.createElement('button');
                heartButton.classList.add('btn-favorite');
                const isCurrentlyFavorite = favorites.some(fav => fav.id === uniqueWishId);
                if (isCurrentlyFavorite) heartButton.classList.add('is-favorite');
                heartButton.innerHTML = getFavoriteIconSVG(isCurrentlyFavorite);
                heartButton.title = isCurrentlyFavorite ? "Șterge de la favorite" : "Adaugă la favorite";
                heartButton.setAttribute('aria-label', heartButton.title);
                heartButton.onclick = () => {
                    toggleFavorite(cleanedWish, uniqueWishId, heartButton);
                    const newTitle = favorites.some(fav => fav.id === uniqueWishId) ? "Șterge de la favorite" : "Adaugă la favorite";
                    heartButton.title = newTitle;
                    heartButton.setAttribute('aria-label', newTitle);
                };
                buttonsWrapper.insertBefore(heartButton, copyButtonContainer); 
            }
            
            wishElement.appendChild(paragraph);
            wishElement.appendChild(buttonsWrapper);

            if (!isFavoriteCard && includeActions) {
                const actionsContainer = document.createElement('div');
                actionsContainer.classList.add('mt-6', 'flex', 'flex-wrap', 'gap-2');

                const continueButton = document.createElement('button');
                continueButton.classList.add('btn-secondary');
                continueButton.innerHTML = '✨ Continuă Urarea';
                continueButton.onclick = () => handleContinueWish(cleanedWish, baseId, continueButton, cardOccasionId);
                actionsContainer.appendChild(continueButton);
                
                wishElement.appendChild(actionsContainer);
            }
            return wishElement;
        }
                
        async function copyWishText(textToCopy, buttonElement) {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }
                const feedbackElement = buttonElement.closest('.btn-copy-container').querySelector('.copied-feedback');
                if (feedbackElement) {
                    feedbackElement.classList.add('show');
                    setTimeout(() => feedbackElement.classList.remove('show'), 1500);
                }
            } catch (err) {
                displayError('Nu s-a putut copia textul.');
            }
        }
        
        async function handleContinueWish(originalWishText, wishElementId, button, occasionId) {
            const currentOccasion = occasions.find(o => o.id === occasionId);
            let name = "";
            // Determine the correct name field based on the occasion
            if (occasionId === 'zi-de-sfant') {
                const firstNameInput = document.getElementById(`firstName-${occasionId}`);
                if (firstNameInput) name = firstNameInput.value.trim();
            } else if (occasionId === 'nunta') {
                 const coupleNamesInput = document.getElementById(`coupleNames-${occasionId}`);
                 if (coupleNamesInput) name = coupleNamesInput.value.trim() || "miri";
            } else if (occasionId === 'botez') {
                 const childNameInput = document.getElementById(`childName-${occasionId}`);
                 if (childNameInput) name = childNameInput.value.trim() || "micuțul/micuța";
            } else {
                const nameInputForTab = document.getElementById(`name-${occasionId}`);
                if (nameInputForTab) name = nameInputForTab.value.trim();
            }

            const nameInstruction = name ? ` Luând în considerare că urarea este pentru ${name},` : "";
            
            const prompt = `Continuă următoarea urare de "${currentOccasion.promptName}", adăugând mai multe detalii, emoție sau o concluzie frumoasă.${nameInstruction} Păstrează tonul și stilul original. Urare originală: "${originalWishText}" Asigură-te că și continuarea este potrivită pentru un public larg, inclusiv copii. Continuarea NU trebuie să conțină niciun fel de comentarii, explicații meta-textuale sau text în paranteze care nu face parte direct din urarea propriu-zisă.`;
            const originalButtonText = button.innerHTML;
            const continuedText = await callGeminiAPI(prompt, button, originalButtonText);

            if (continuedText) {
                const wishElement = document.getElementById(wishElementId);
                if (wishElement) {
                    let continuedParagraph = wishElement.querySelector('.continued-wish-text');
                    if (!continuedParagraph) {
                        continuedParagraph = document.createElement('p');
                        continuedParagraph.classList.add('continued-wish-text');
                        const actionsContainer = wishElement.querySelector('.flex.flex-wrap.gap-2');
                        if (actionsContainer) {
                            actionsContainer.insertAdjacentElement('afterend', continuedParagraph);
                        } else {
                            wishElement.querySelector('.wish-text').insertAdjacentElement('afterend', continuedParagraph);
                        }
                    }
                    continuedParagraph.textContent = continuedText.trim();
                    button.innerHTML = "Extins ✨";
                    button.disabled = true;
                }
            }
        }
        
        function displayError(message) {
            errorMessageContainer.innerHTML = '';
            const titleEl = document.createElement('p');
            titleEl.classList.add('font-semibold');
            titleEl.textContent = 'Oops! A apărut o problemă:';
            const msgEl = document.createElement('p');
            msgEl.classList.add('mt-1');
            msgEl.textContent = message;
            errorMessageContainer.appendChild(titleEl);
            errorMessageContainer.appendChild(msgEl);
            errorMessageContainer.classList.remove('hidden');
            errorMessageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // --- Tab Specific Functions ---
        function createTabs() {
            tabsContainer.innerHTML = ''; 
            tabContentContainer.innerHTML = ''; 

            occasions.forEach((occasion, index) => {
                const button = document.createElement('button');
                button.classList.add('tab-button');
                button.textContent = occasion.title;
                button.dataset.tabId = occasion.id;
                if (index === 0) {
                    button.classList.add('active');
                }
                button.addEventListener('click', () => switchTab(occasion.id));
                tabsContainer.appendChild(button);

                const contentPane = document.createElement('div');
                contentPane.id = occasion.id;
                contentPane.classList.add('tab-content');
                if (index === 0) {
                    contentPane.classList.add('active');
                }
                
                let formHTML = '<div class="space-y-6 md:space-y-8">';
                occasion.fields.forEach(field => {
                    formHTML += `<div><label for="${field.id}-${occasion.id}" class="block label-style">${field.label}</label>`;
                    formHTML += `<div class="flex items-center gap-2">`;
                    if (field.type === 'textarea') {
                        formHTML += `<textarea id="${field.id}-${occasion.id}" class="textarea-style flex-grow" placeholder="${field.placeholder || ''}"></textarea>`;
                    } else {
                        formHTML += `<input type="${field.type}" id="${field.id}-${occasion.id}" class="input-style flex-grow" placeholder="${field.placeholder || ''}">`;
                    }
                    formHTML += `<button type="button" class="clear-field-btn" aria-label="Șterge">&times;</button></div></div>`;
                });

                if (occasion.tones) {
                    formHTML += `<div><label for="tone-${occasion.id}" class="block label-style">Alege stilul urării/mesajului:</label><select id="tone-${occasion.id}" class="select-style">`;
                    occasion.tones.forEach(tone => {
                        formHTML += `<option value="${tone.value}" ${tone.selected ? 'selected' : ''}>${tone.text}</option>`;
                    });
                    formHTML += `</select></div>`;
                }

                if (occasion.options) {
                    occasion.options.forEach(option => {
                        formHTML += `<div class="mt-4">`;
                        if (option.type === 'checkbox') {
                            formHTML += `<label class="checkbox-label"><input type="checkbox" id="${option.id}-${occasion.id}" class="mr-2"> ${option.label}</label>`;
                        } else if (option.type === 'radio') {
                            formHTML += `<span class="radio-group-label">${option.label}</span><div class="flex flex-wrap gap-x-4 gap-y-2">`;
                            option.options.forEach(radioOpt => {
                                formHTML += `<label class="radio-label"><input type="radio" name="${option.name}-${occasion.id}" value="${radioOpt.value}" ${radioOpt.checked ? 'checked' : ''}> ${radioOpt.text}</label>`;
                            });
                            formHTML += `</div>`;
                        }
                        formHTML += `</div>`;
                    });
                }
                
                formHTML += `<div class="pt-2"><button type="button" class="btn-secondary w-full clear-all-fields">Șterge tot</button></div><div class="main-action-buttons grid grid-cols-1 gap-4 pt-6"> 
                                <button class="btn-primary w-full generate-wish-for-tab-button" data-occasion-id="${occasion.id}">
                                    Generează ${occasion.isReplyGenerator ? 'Răspunsuri' : occasion.promptName}
                                </button>
                             </div>`;
                
                if (occasion.showGiftButton) {
                    formHTML += `<div class="pt-4">
                                    <button class="btn-primary btn-gift w-full generate-gifts-for-tab-button" data-occasion-id="${occasion.id}">
                                        <span class="mr-1.5">🎁</span> Generează Idei de Cadouri
                                    </button>
                                 </div>`;
                }

                formHTML += `</div><div id="wishes-results-container-${occasion.id}" class="mt-12 md:mt-16"></div>`;
                contentPane.innerHTML = formHTML;
                tabContentContainer.appendChild(contentPane);
                restoreTabState(occasion.id);
            });
            
            document.querySelectorAll('.generate-wish-for-tab-button').forEach(button => {
                button.addEventListener('click', handleGenerateWishForTab);
            });
             document.querySelectorAll('.generate-gifts-for-tab-button').forEach(button => {
                button.addEventListener('click', handleGenerateGiftsForTab);
            });
        }

        function switchTab(tabId) {
            activeTabId = tabId;
            document.querySelectorAll('.tab-button').forEach(button => {
                button.classList.toggle('active', button.dataset.tabId === tabId);
            });
            document.querySelectorAll('.tab-content').forEach(pane => {
                pane.classList.toggle('active', pane.id === tabId);
            });
            const activeButton = document.querySelector(`.tab-button[data-tab-id="${tabId}"]`);
            if (activeButton && tabsContainer.scrollWidth > tabsContainer.clientWidth) {
                activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
            giftIdeasResultsContainer.innerHTML = ''; // Clear global gift ideas if shown outside tab
        }

        async function handleGenerateWishForTab(event) {
            const occasionId = event.target.dataset.occasionId;
            const currentOccasion = occasions.find(o => o.id === occasionId);
            const resultsContainer = document.getElementById(`wishes-results-container-${occasionId}`);
            resultsContainer.innerHTML = '';
            if (!isCaptchaVerified()) {
                displayError('Te rugăm să confirmi că nu ești robot bifând caseta de verificare.');
                return;
            }

            let promptDetails = {};
            let mainName = ""; // Used for constructing nameString

            currentOccasion.fields.forEach(field => {
                const inputElement = document.getElementById(`${field.id}-${occasionId}`);
                if (inputElement) {
                    promptDetails[field.id] = inputElement.value.trim();
                    // Consolidate main name detection
                    if (['name', 'firstName', 'coupleNames', 'childName', 'deceasedName'].includes(field.id)) {
                        if (promptDetails[field.id]) mainName = promptDetails[field.id];
                    }
                }
            });
            
            // Specific name handling for certain occasions
            if (currentOccasion.id === 'nunta' && !mainName) mainName = "miri";
            if (currentOccasion.id === 'botez' && !mainName) mainName = "micuțul/micuța";


            const toneSelectElement = document.getElementById(`tone-${occasionId}`);
            const selectedTone = toneSelectElement ? toneSelectElement.value : (currentOccasion.specificTone || "prietenos");
            
            let optionsString = "";
            if (currentOccasion.options) {
                currentOccasion.options.forEach(opt => {
                    if (opt.type === 'checkbox') {
                        const checkbox = document.getElementById(`${opt.id}-${occasionId}`);
                        if (checkbox && checkbox.checked) {
                            optionsString += ` Se dorește și: ${opt.label}.`;
                        }
                    } else if (opt.type === 'radio') {
                        const radioChecked = document.querySelector(`input[name="${opt.name}-${occasionId}"]:checked`);
                        if (radioChecked) {
                            const selectedRadioOption = opt.options.find(r => r.value === radioChecked.value);
                            if (selectedRadioOption) optionsString += ` Stilul ales: ${selectedRadioOption.text}.`;
                        }
                    }
                });
            }
            
            let nameString = mainName ? `pentru ${mainName}` : (currentOccasion.specificGender === "female" ? "pentru ea" : (currentOccasion.specificGender === "child" ? "pentru prunc" : "pentru cineva"));
            if (currentOccasion.id === 'nunta') nameString = mainName ? `pentru mirii ${mainName}` : `pentru miri`;
            if (currentOccasion.id === 'botez') nameString = mainName ? `pentru ${mainName} și părinții săi` : `pentru noul-născut și părinții săi`;
            if (currentOccasion.id === 'condoleante') nameString = mainName ? `pentru familia lui/ei ${mainName}` : `pentru familia îndoliată`;


            let detailsForPrompt = [];
            if(promptDetails.relationship) detailsForPrompt.push(`relația fiind ${promptDetails.relationship}`);
            if(promptDetails.hobbies && currentOccasion.fields.find(f=>f.id === 'hobbies')) detailsForPrompt.push(`cu hobby-uri precum ${promptDetails.hobbies}`); // Check if field exists for this occasion
            if(promptDetails.quality && currentOccasion.fields.find(f=>f.id === 'quality')) detailsForPrompt.push(`o calitate specială fiind ${promptDetails.quality}`);
            if(promptDetails.saintName && currentOccasion.id === 'zi-de-sfant') detailsForPrompt.push(`care poartă numele Sfântului/Sfintei ${promptDetails.saintName}`);
            if(promptDetails.parentsRelationship && currentOccasion.id === 'botez') detailsForPrompt.push(`părinții fiind ${promptDetails.parentsRelationship}`);
            if(promptDetails.relationshipToDeceasedOrFamily && currentOccasion.id === 'condoleante') detailsForPrompt.push(`relația cu persoana decedată/familia fiind ${promptDetails.relationshipToDeceasedOrFamily}`);


            let detailsString = detailsForPrompt.length > 0 ? nameString + " (" + detailsForPrompt.join(", ") + ")" : nameString;
            if (optionsString) detailsString += ` ${optionsString}`;

            let toneInstruction = "";
            const foundTone = currentOccasion.tones?.find(t => t.value === selectedTone);
            toneInstruction = foundTone ? `într-un stil ${foundTone.text.toLowerCase().replace(/\s*\(.*?\)\s*/g, '')}.` : `într-un stil prietenos.`; // Remove text in parenthesis from tone for prompt
            if (currentOccasion.specificTone) toneInstruction = `într-un stil ${currentOccasion.specificTone}.`;

            let basePrompt = `Generează 2-3 sugestii de mesaje ${toneInstruction} ${detailsString} Cu ocazia "${currentOccasion.promptName}".`;
            if (currentOccasion.isReplyGenerator) {
                 if (!promptDetails.receivedWish) {
                    displayError("Te rugăm să introduci textul urării primite pentru a genera un răspuns.");
                    return;
                }
                basePrompt = `Am primit următoarea urare: "${promptDetails.receivedWish}". ${promptDetails.senderRelationship ? `Expeditorul este ${promptDetails.senderRelationship}.` : "Expeditorul este o cunoștință."} Generează 2-3 sugestii scurte și politicoase de răspunsuri de mulțumire în limba română. Răspunsurile să fie calde, apreciative și potrivite pentru context.`;
            }
            
            const prompt = `${basePrompt} Mesajele să fie creative, cu specific românesc autentic (dacă este cazul ocaziei), evitând clișeele. Fiecare mesaj să fie distinct, având aproximativ 2-3 fraze și să sune natural. Adaptează mesajele pentru a reflecta detaliile oferite. Mesajele generate NU trebuie să conțină niciun fel de comentarii, explicații meta-textuale sau text în paranteze care nu face parte direct din mesajul propriu-zis.`;
            
            const originalButtonText = event.target.textContent;
            const generatedText = await callGeminiAPI(prompt, null, originalButtonText);

            if (generatedText) {
                const wishesArray = generatedText.split(/\n\s*(?:\d+\.?\s*|-\s*|\*\s*)\s*|\n\n+/).map(w => w.trim()).filter(wish => wish && wish.length > 10);
                if (wishesArray.length > 0) {
                    displayWishes(wishesArray, resultsContainer, `Sugestii pentru ${currentOccasion.promptName}:`);
                } else if (generatedText.trim().length > 10) {
                    displayWishes([generatedText.trim()], resultsContainer, `Sugestii pentru ${currentOccasion.promptName}:`);
                } else {
                    displayError(`Nu am putut extrage mesajele pentru ${currentOccasion.promptName}. Încearcă din nou.`);
                }
            }
        }
        
        async function handleGenerateGiftsForTab(event) {
            const occasionId = event.target.dataset.occasionId;
            const currentOccasion = occasions.find(o => o.id === occasionId);
            giftIdeasResultsContainer.innerHTML = '';
            if (!isCaptchaVerified()) {
                displayError('Te rugăm să confirmi că nu ești robot bifând caseta de verificare.');
                return;
            }

            let promptDetails = {};
             currentOccasion.fields.forEach(field => {
                const inputElement = document.getElementById(`${field.id}-${occasionId}`);
                if (inputElement) promptDetails[field.id] = inputElement.value.trim();
            });
            const name = promptDetails.name || promptDetails.firstName || promptDetails.coupleNames || promptDetails.childName || "";

            if (!promptDetails.hobbies && !promptDetails.quality && !promptDetails.relationship && !name) {
                displayError("Pentru sugestii de cadouri, completează detalii precum hobby-uri, calități sau relația în tabul curent.");
                return;
            }

            let details = [];
            if (name) details.push(`pentru ${name}`);
            if (promptDetails.relationship) details.push(name ? `care este ${promptDetails.relationship}` : `pentru ${promptDetails.relationship}`);
            if (promptDetails.hobbies) details.push(`căruia/căreia îi plac ${promptDetails.hobbies}`);
            if (promptDetails.quality) details.push(`și care este o persoană ${promptDetails.quality}`);
            
            const giftPrompt = `Generează 5-7 idei de cadouri creative și potrivite ${details.join(", ")} pentru ocazia "${currentOccasion.promptName}". Sugestiile să fie variate și sigure. Prima linie să fie o introducere prietenoasă. Apoi, listă fără asteriscuri. Fără comentarii meta.`;
            
            const originalButtonText = event.target.innerHTML;
            const generatedTextWithIntro = await callGeminiAPI(giftPrompt, null, originalButtonText);

             if (generatedTextWithIntro) {
                const lines = generatedTextWithIntro.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                let introText = "";
                let giftIdeasArray = [];

                if (lines.length > 0) {
                    introText = lines[0]; 
                    giftIdeasArray = lines.slice(1).map(idea => idea.replace(/^(\d+\.?\s*|-\s*|\*\s*)/, '').trim()).filter(idea => idea && idea.length > 5);
                }
                
                if (giftIdeasArray.length > 0) {
                    displayGiftIdeas(giftIdeasArray, introText);
                } else if (lines.length > 0 && lines.slice(1).join("").trim().length > 5) { 
                     displayGiftIdeas([lines.slice(1).join("\n").replace(/^(\d+\.?\s*|-\s*|\*\s*)/, '').trim()], introText);
                } else {
                    displayError("Nu am putut genera idei de cadouri momentan.");
                }
            }
        }

        function sanitizeHTML(str) {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        }

        function safeParseHTML(htmlString) {
            const template = document.createElement('template');
            template.innerHTML = htmlString;
            template.content.querySelectorAll('script').forEach(el => el.remove());
            template.content.querySelectorAll('*').forEach(el => {
                [...el.attributes].forEach(attr => {
                    if(attr.name.toLowerCase().startsWith('on')) el.removeAttribute(attr.name);
                });
            });
            return template.content.cloneNode(true);
        }

        function displayWishes(wishesArray, containerElement, title = "Sugestii de Urări:") {
            containerElement.innerHTML = `<h2 class="section-title text-center !text-xl !mb-6">${sanitizeHTML(title)}</h2>`;
            wishesArray.forEach((wish, index) => {
                const uniqueWishId = `wish-text-${activeTabId}-${Date.now()}-${index}`;
                const domWishId = `wish-dom-${activeTabId}-${index}`;
                const wishElement = createWishCardDOM(wish, domWishId, uniqueWishId);
                containerElement.appendChild(wishElement);
                setTimeout(() => wishElement.classList.add('visible'), 10 + index * 120);
            });
            sessionStorage.setItem(`gu-results-${activeTabId}`, containerElement.innerHTML);
        }

        function displayGiftIdeas(ideasArray, introText = "") {
            giftIdeasResultsContainer.innerHTML = '<h2 class="section-title text-center">🎁 Idei de Cadouri Inspirate:</h2>'; 
            
            if (introText) {
                const introElement = document.createElement('p');
                introElement.classList.add('ai-intro-text');
                introElement.textContent = introText;
                giftIdeasResultsContainer.appendChild(introElement);
            }

            const listElement = document.createElement('ul');
            listElement.classList.add('gift-ideas-list');

            ideasArray.forEach(ideaText => {
                const cleanedIdea = ideaText.replace(/\*/g, '').trim();
                if(cleanedIdea.length === 0) return;
                const listItem = document.createElement('li');
                listItem.textContent = cleanedIdea;
                listElement.appendChild(listItem);
            });
            giftIdeasResultsContainer.appendChild(listElement);
             giftIdeasResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            sessionStorage.setItem(`gu-gifts-${activeTabId}`, giftIdeasResultsContainer.innerHTML);
        }

        function restoreTabState(tabId) {
            const pane = document.getElementById(tabId);
            if(!pane) return;
            pane.querySelectorAll('input, textarea, select').forEach(el => {
                const key = `gu-${tabId}-${el.id}`;
                const stored = sessionStorage.getItem(key);
                if(stored !== null) {
                    if(el.type === 'checkbox') el.checked = stored === 'true';
                    else el.value = stored;
                }
                const handler = () => {
                    if(el.type === 'checkbox') sessionStorage.setItem(key, el.checked);
                    else sessionStorage.setItem(key, el.value);
                };
                el.addEventListener('input', handler);
                el.addEventListener('change', handler);
            });
            const res = sessionStorage.getItem(`gu-results-${tabId}`);
            if(res) {
                const cont = document.getElementById(`wishes-results-container-${tabId}`);
                if(cont) {
                    cont.innerHTML = '';
                    cont.appendChild(safeParseHTML(res));
                }
            }
            const gifts = sessionStorage.getItem(`gu-gifts-${tabId}`);
            if(gifts) {
                giftIdeasResultsContainer.innerHTML = '';
                giftIdeasResultsContainer.appendChild(safeParseHTML(gifts));
            }
            pane.querySelectorAll('.clear-field-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const input = btn.parentElement.querySelector('input, textarea');
                    if(input){ input.value=''; input.dispatchEvent(new Event('input')); }
                });
            });
            const clearAll = pane.querySelector('.clear-all-fields');
            if(clearAll) clearAll.addEventListener('click', () => {
                pane.querySelectorAll('input, textarea').forEach(el => {
                    el.value='';
                    el.dispatchEvent(new Event('input'));
                });
            });
        }
        // --- Initialize Tabs ---
        createTabs();
        if (occasions.length > 0) {
            switchTab(occasions[0].id);
            restoreTabState(occasions[0].id);
        }
        updateFavoritesButtonVisibility();

