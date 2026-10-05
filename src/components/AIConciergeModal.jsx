import React, { useState, useRef, useEffect } from 'react';
import { CONCIERGE_PROMPTS, CONCIERGE_KNOWLEDGE } from '../data/conciergeData';
import { MENU_ITEMS } from '../data/menuData';
import { RESTAURANT_TABLES } from '../data/floorPlanData';
import {
  X,
  Sparkles,
  Send,
  MessageCircle,
  Calendar,
  Plus,
  Check,
  ChevronRight,
  Eye,
  Flame,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  MapPin,
  Phone,
  ShieldCheck,
  UserCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function AIConciergeModal({
  isOpen,
  onClose,
  onSelectDish,
  onAddToCart,
  onOpenReservation
}) {
  // Dishes for rich culinary cards
  const biryaniDish = MENU_ITEMS.find((d) => d.id === 'awadhi-biryani') || MENU_ITEMS[0];
  const butterChickenDish = MENU_ITEMS.find((d) => d.id === 'butter-chicken') || MENU_ITEMS[1];
  const paneerDish = MENU_ITEMS.find((d) => d.id === 'truffle-paneer') || MENU_ITEMS[2];
  const dalDish = MENU_ITEMS.find((d) => d.id === 'dal-makhani') || MENU_ITEMS[3];
  const kulfiDish = MENU_ITEMS.find((d) => d.id === 'saffron-kulfi') || MENU_ITEMS[4];
  const cocktailDish = MENU_ITEMS.find((d) => d.id === 'royal-nizam-cocktail') || MENU_ITEMS[5];

  // Tables for booking recommendations
  const windowTable = RESTAURANT_TABLES.find((t) => t.id === 'T-01') || RESTAURANT_TABLES[0];
  const familyTable = RESTAURANT_TABLES.find((t) => t.id === 'T-04') || RESTAURANT_TABLES[3];
  const chefFlameTable = RESTAURANT_TABLES.find((t) => t.id === 'C-01') || RESTAURANT_TABLES[6];
  const saffronSalonTable = RESTAURANT_TABLES.find((t) => t.id === 'S-01') || RESTAURANT_TABLES[9];

  // 4 Dining Personas (Persona Quiz / Mood Selector)
  const DINING_PERSONAS = [
    {
      id: 'date-night',
      title: 'Romantic Date Night',
      subtitle: 'Courtyard Fountain & Live Sitar',
      icon: '🌹',
      prompt: '🌹 Plan an unforgettable Romantic Date Night with intimate seating & pairings',
      dish: paneerDish,
      table: windowTable,
      accent: '#f28d54'
    },
    {
      id: 'family-feast',
      title: 'Royal Family Feast',
      subtitle: 'Grand Banquet for 4–6 Guests',
      icon: '👑',
      prompt: '👑 Curate a celebratory Royal Family Feast for 4-6 guests with signature curries and breads',
      dish: biryaniDish,
      table: familyTable,
      accent: '#c59b27'
    },
    {
      id: 'business-dining',
      title: 'Business Entertaining',
      subtitle: 'Private Saffron Salon & Butler',
      icon: '💼',
      prompt: '💼 Bespoke executive dining with Grand Cru wine pairings in confidential Saffron Salon',
      dish: cocktailDish,
      table: saffronSalonTable,
      accent: '#dfb958'
    },
    {
      id: 'spicy-connoisseur',
      title: 'Spicy Connoisseur',
      subtitle: 'Chef Flame Counter & Potli Embers',
      icon: '🔥',
      prompt: '🔥 Guide me to your most fiery, aromatic Awadhi potli heat and live tandoor charcoal dishes',
      dish: biryaniDish,
      table: chefFlameTable,
      accent: '#e07a43'
    }
  ];

  // Conversation history
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'concierge',
      text: 'Namaste and welcome to Tisha Restro. I am your royal dining concierge & Maître d’. How may I orchestrate your culinary experience this evening? Choose a dining mood above, or ask me about our heritage recipes, spice heat, and live table availability.',
      timestamp: 'Just now',
      followUps: [
        '👑 Curate My Evening Menu',
        '🔥 Show me something vibrant and spicy',
        '🌿 Vegetarian Royalty options',
        '📅 Best available table for tonight'
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedDishIds, setAddedDishIds] = useState({});
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [lastRecommendedTable, setLastRecommendedTable] = useState(windowTable);
  const [lastRecommendedDish, setLastRecommendedDish] = useState(biryaniDish);

  // Audio / Speech State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [voiceNotice, setVoiceNotice] = useState(null);

  // VIP Maître d' Handoff Card State
  const [showVipDispatch, setShowVipDispatch] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen, isTyping, showVipDispatch]);

  // Clean up speech synthesis when closing
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMsgId(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setShowVipDispatch(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Add Dish to Cart
  const handleAddDishToOrder = (dish, e) => {
    e?.stopPropagation();
    if (onAddToCart) {
      onAddToCart(dish);
    }
    setAddedDishIds((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedDishIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 2500);
  };

  // Text-to-Speech Narration for Maître d' Messages
  const handleToggleSpeak = (msgId, textToSpeak) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceNotice('Audio speech synthesis is not supported on this device.');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown and special symbols for clean audio output
    const clean = textToSpeak
      .replace(/[✦👑🔥🌿🍸📅🍷🫓🍨🍲🌹💼]/g, '')
      .replace(/[*_#]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.pitch = 0.95;
    utterance.rate = 0.92; // refined aristocratic tempo

    // Attempt to select an English Indian or UK voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.includes('en-IN') ||
        v.name.includes('India') ||
        v.lang.includes('en-GB') ||
        v.name.includes('Natural')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Dish Name Pronunciation
  const handlePronounceDish = (dishName, e) => {
    e?.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(dishName);
    utterance.pitch = 1.0;
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Microphone Dictation)
  const handleToggleDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Microphone dictation requires Google Chrome, Edge, or Safari.');
      setTimeout(() => setVoiceNotice(null), 3500);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Listening... Speak your royal dining request now.');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
          setVoiceNotice(`Heard: "${transcript}"`);
          setTimeout(() => {
            setVoiceNotice(null);
            handleSendPrompt(transcript);
          }, 800);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setVoiceNotice(`Microphone error: ${event.error || 'Check browser permissions'}`);
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Could not access microphone.');
      setTimeout(() => setVoiceNotice(null), 3000);
    }
  };

  // Core Prompt Dispatcher
  const handleSendPrompt = (promptText, personaObj = null) => {
    if (personaObj) {
      setSelectedPersona(personaObj);
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: 'Just now'
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let recommendedDish = null;
      let recommendedTable = null;
      let multiCourseExperience = null;
      let followUps = [];

      const lower = promptText.toLowerCase();

      // Check Persona Matches First
      if (lower.includes('date night') || lower.includes('romantic')) {
        setSelectedPersona(DINING_PERSONAS[0]);
        replyText =
          'For an enchanting Date Night, I have prepared an intimate culinary passage. Begin with our Truffle Malai Paneer Tikka kissed by charcoal embers and gold leaf, accompanied by our botanical saffron elixir. Table 01 in The Golden Hour Hall awaits you beside the jali screen and lotus courtyard.';
        recommendedDish = paneerDish;
        recommendedTable = windowTable;
        setLastRecommendedDish(paneerDish);
        setLastRecommendedTable(windowTable);
        followUps = [
          '🍷 Recommend Champagne pairing',
          '🍨 Saffron Spun Gold Kulfi dessert',
          '📅 Lock in Table 01 for Date Night',
          '👑 Curate Full 4-Course Progression'
        ];
      } else if (lower.includes('family feast') || lower.includes('celebrat') || lower.includes('banquet')) {
        setSelectedPersona(DINING_PERSONAS[1]);
        replyText =
          'Namaste to the entire royal family! Celebrations at Tisha Restro center upon communal abundance. I have curated our four-hour Awadhi Dum Gosht Biryani along with 36-Hour Maa Ki Dal and hand-tossed roomali rotis. Table 04 provides a generous velvet booth seating up to 6 guests with panoramic dining room acoustics.';
        recommendedDish = biryaniDish;
        recommendedTable = familyTable;
        setLastRecommendedDish(biryaniDish);
        setLastRecommendedTable(familyTable);
        followUps = [
          '🍗 Smoked Butter Chicken',
          '🍲 36-Hour Maa Ki Dal',
          '🫓 Roomali & Garlic Naan Baskets',
          '📅 Reserve Table 04 for 6 Guests'
        ];
      } else if (lower.includes('business') || lower.includes('executive') || lower.includes('client')) {
        setSelectedPersona(DINING_PERSONAS[2]);
        replyText =
          'For executive entertaining and confidential discourse, our Private Saffron Salon East offers secluded silk-paneled luxury, acoustic discretion, and dedicated butler attendance. Pair with single-origin botanical elixirs and sommelier Grand Cru selections.';
        recommendedDish = cocktailDish;
        recommendedTable = saffronSalonTable;
        setLastRecommendedDish(cocktailDish);
        setLastRecommendedTable(saffronSalonTable);
        followUps = [
          '🍷 Grand Cru Burgundy pairing',
          '📜 Personalized tasting menu printouts',
          '📅 Book Private Saffron Salon East',
          '👑 Curate Chef Tasting Menu'
        ];
      } else if (lower.includes('spicy') || lower.includes('tandoori') || lower.includes('heat') || lower.includes('flame') || lower.includes('fiery')) {
        setSelectedPersona(DINING_PERSONAS[3]);
        replyText =
          'If you relish authentic royal heat with layered aromatic depth, Chef Kabir recommends our Awadhi Dum Gosht Biryani with crushed Malabar green cardamom and Awadhi Potli masala. For front-row drama, Chef Counter 01 places you directly before the clay tandoor embers and copper handi flames.';
        recommendedDish = biryaniDish;
        recommendedTable = chefFlameTable;
        setLastRecommendedDish(biryaniDish);
        setLastRecommendedTable(chefFlameTable);
        followUps = [
          '🔥 Can Chef elevate spice to Level 3?',
          '🧊 Cooling mint raita & mango lassi',
          '📅 Lock in Chef Flame Counter 01',
          '🍗 Show charred seekh kebabs'
        ];
      } else if (lower.includes('curate') || lower.includes('menu generator') || lower.includes('3-course') || lower.includes('progression') || lower.includes('evening')) {
        replyText =
          'Allow me to orchestrate a transcendent royal progression for you: four movements traveling from fragrant clay tandoor embers to 36-hour simmered copper depth, culminating in tableside spun gold.';
        multiCourseExperience = [paneerDish, biryaniDish, kulfiDish, cocktailDish];
        followUps = [
          '🌿 Make this 100% Vegetarian',
          '🍷 What wine pairing accompanies this?',
          '📅 Reserve a table for this experience',
          '🔥 Can we increase the spice level?'
        ];
      } else if (lower.includes('comfort') || lower.includes('rich') || lower.includes('butter chicken') || lower.includes('makhani')) {
        replyText =
          'For profound warmth, our Purani Dilli Smoked Butter Chicken is without equal. Corn-fed chicken is charred over hickory coals, then bathed in slow-roasted vine tomato velvet finished with daily-churned cultured white butter and 24k gold leaf.';
        recommendedDish = butterChickenDish;
        setLastRecommendedDish(butterChickenDish);
        followUps = [
          '🫓 Which bread pairs best?',
          '🌿 Show the 36-hour Maa Ki Dal',
          '🍸 Pair with an artisanal cocktail',
          '📅 Reserve Table for 2'
        ];
      } else if (lower.includes('veg') || lower.includes('vegetarian') || lower.includes('paneer') || lower.includes('jain')) {
        replyText =
          'Our vegetarian haute repertoire is treated with imperial court reverence. The Truffle Malai Paneer Tikka marries artisanal cottage cheese with Perigord black truffle reduction and crushed green cardamom. We also prepare revered Jain variations upon tableside request.';
        recommendedDish = paneerDish;
        setLastRecommendedDish(paneerDish);
        followUps = [
          '🍲 Show the 36-Hour Maa Ki Dal',
          '👑 Curate My Evening Menu',
          '🍨 Saffron Pistachio Kulfi dessert',
          '📅 Reserve an intimate table'
        ];
      } else if (lower.includes('dessert') || lower.includes('sweet') || lower.includes('kulfi')) {
        replyText =
          'Our signature grand finale is the Saffron Pistachio Kulfi & Spun Gold Lattice. Churned with reduced cow milk, Iranian pistachios, and Pampore saffron, topped with an intricate sugar cage cracked tableside.';
        recommendedDish = kulfiDish;
        setLastRecommendedDish(kulfiDish);
        followUps = [
          '🍸 What dessert elixir pairs with it?',
          '🔥 Show main course recommendations',
          '📅 Book an evening table'
        ];
      } else if (lower.includes('cocktail') || lower.includes('drink') || lower.includes('nizam') || lower.includes('bar')) {
        replyText =
          'Enter our botanical sanctuary with "The Royal Nizam" — single-malt whisky cold-infused with single-origin saffron, served under a ceremonial cloche of aromatic clove and star anise smoke.';
        recommendedDish = cocktailDish;
        setLastRecommendedDish(cocktailDish);
        followUps = [
          '🍲 Recommend small plates to pair',
          '👑 Curate My Evening Menu',
          '📅 Book a seat at Botanical Lounge'
        ];
      } else if (lower.includes('wine') || lower.includes('pair')) {
        replyText =
          'Our head sommelier curates biodynamic and Grand Cru pairings. For rich curries and dum biryani, we recommend a 2018 Domaine de la Romanée-Conti Burgundy or a crisp, mineral-forward Chablis Premier Cru to cut the cultured ghee.';
        followUps = [
          '👑 Show Chef Kabir’s Signature Dish',
          '🍸 View artisanal cocktail elixirs',
          '📅 Reserve a Table with Sommelier'
        ];
      } else if (lower.includes('table') || lower.includes('book') || lower.includes('reserve') || lower.includes('seat') || lower.includes('available') || lower.includes('tonight')) {
        replyText =
          'I have surveyed our live dining room floor plan. For this evening, Table 01 in The Golden Hour Dining Hall is prime and available. It is tucked along the eastern hand-carved jali screen with an intimate courtyard reflection pool view.';
        recommendedTable = windowTable;
        setLastRecommendedTable(windowTable);
        followUps = [
          '🔥 Any seats at the Chef’s Fire Counter?',
          '👑 Private Saffron Salon Suite?',
          '🗺️ View Full Interactive Floor Plan'
        ];
      } else if (lower.includes('chef counter') || lower.includes('front row')) {
        replyText =
          'For front-row culinary drama, Chef Counter 01 places you directly before Chef Kabir’s copper handis and live tandoori charcoal embers.';
        recommendedTable = chefFlameTable;
        setLastRecommendedTable(chefFlameTable);
        followUps = [
          '👑 Curate My Evening Menu',
          '🍷 What wine pairing accompanies this?',
          '📅 Lock in Chef Counter 01'
        ];
      } else if (lower.includes('salon') || lower.includes('private') || lower.includes('confidential')) {
        replyText =
          'For secluded aristocracy, Saffron Salon East offers private silk-draped dining, dedicated butler service, and whisper-quiet acoustics.';
        recommendedTable = saffronSalonTable;
        setLastRecommendedTable(saffronSalonTable);
        followUps = [
          '👑 Curate My Evening Menu',
          '📅 Reserve Saffron Salon Suite',
          '🍲 View royal banquet dishes'
        ];
      } else if (lower.includes('hour') || lower.includes('time') || lower.includes('location') || lower.includes('valet')) {
        replyText = `We welcome diners daily: Lunch from 12:00 PM to 3:30 PM, and Dinner from 6:30 PM to 11:30 PM. We are located at ${CONCIERGE_KNOWLEDGE.restaurant.location}. Complimentary white-glove valet service awaits your arrival at the portico.`;
        followUps = [
          '📅 Book a table for dinner',
          '🍲 Recommend signature dishes',
          '👑 Curate My Evening Menu'
        ];
      } else {
        replyText =
          'Every creation at Tisha Restro is crafted with reverence to ancestral royal courts. Would you like a personalized 4-course menu recommendation, or shall I check table availability for this evening?';
        followUps = [
          '👑 Curate My Evening Menu',
          '🔥 Show me something vibrant and spicy',
          '🌿 Vegetarian Haute options',
          '📅 Best table available tonight'
        ];
      }

      const newConciergeMsg = {
        id: `concierge-${Date.now()}`,
        sender: 'concierge',
        text: replyText,
        timestamp: 'Just now',
        dish: recommendedDish,
        table: recommendedTable,
        multiCourse: multiCourseExperience,
        followUps
      };

      setMessages((prev) => [...prev, newConciergeMsg]);
      setIsTyping(false);

      // Auto-speech narration if Voice Mode is active
      if (isVoiceMode) {
        setTimeout(() => {
          handleToggleSpeak(newConciergeMsg.id, replyText);
        }, 200);
      }
    }, 700);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const txt = inputValue;
    setInputValue('');
    handleSendPrompt(txt);
  };

  // Launch WhatsApp with Dynamic Automated Royal Briefing
  const handleLaunchWhatsAppBriefing = () => {
    const personaTitle = selectedPersona ? selectedPersona.title : 'Bespoke Royal Dining';
    const tableName = lastRecommendedTable
      ? `${lastRecommendedTable.tableNumber} (${lastRecommendedTable.zone})`
      : 'Table 01 (Courtyard Alcove)';
    const dishName = lastRecommendedDish ? lastRecommendedDish.name : 'Awadhi Dum Gosht Biryani';

    const text = encodeURIComponent(
      `Namaste Maître d' Kabir Sharma (Tisha Restro).\n` +
      `I am transferring from the AI Concierge for direct VIP hospitality:\n` +
      `✦ Occasion / Mood: ${personaTitle}\n` +
      `✦ Preferred Seating: ${tableName}\n` +
      `✦ Culinary Highlight: ${dishName}\n` +
      `Kindly confirm availability for this evening and prepare our arrival.`
    );
    window.open(`https://wa.me/917008665245?text=${text}`, '_blank');
  };

  return (
    <div className="modal-backdrop">
      <div className="relative w-full max-w-xl h-[88vh] max-h-[720px] rounded-xl modal-container-card flex flex-col overflow-hidden my-4">
        {/* ============================================================ */}
        {/* 1. HEADER WITH VOICE TOGGLE, WHATSAPP & TITLE */}
        {/* ============================================================ */}
        <div className="px-3 py-2 border-b border-[var(--border-subtle)] bg-[rgba(20,16,13,0.96)] flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-[var(--brass-500)] flex items-center justify-center bg-[rgba(197,155,39,0.15)] shadow-[0_0_10px_rgba(197,155,39,0.3)] shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[var(--brass-300)] animate-pulse" />
            </div>
            <div>
              <h3 className="font-display text-sm text-[var(--ivory-50)] flex items-center gap-1.5">
                <span>Tisha AI Concierge</span>
                <span className="text-[0.55rem] px-1.5 py-px rounded-full bg-[rgba(197,155,39,0.2)] text-[var(--brass-300)] font-mono uppercase tracking-wider">
                  Maître d'
                </span>
              </h3>
              <p className="text-[0.6rem] text-[var(--ivory-muted)] font-editorial italic truncate max-w-[200px] sm:max-w-none leading-tight">
                Awadhi culinary guidance & live table lock-in
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                isVoiceMode
                  ? 'bg-[var(--brass-500)] text-black shadow-[0_0_8px_rgba(197,155,39,0.4)]'
                  : 'bg-[rgba(255,255,255,0.05)] border border-[var(--border-subtle)] text-[var(--ivory-300)] hover:text-white'
              }`}
              title="Toggle voice"
            >
              {isVoiceMode ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setShowVipDispatch(true)}
              className="px-2 py-1 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-all cursor-pointer flex items-center gap-1 text-[0.62rem]"
              title="Human concierge"
            >
              <MessageCircle className="w-3 h-3" />
              <span className="hidden sm:inline font-mono">Maître d'</span>
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full border border-[var(--border-subtle)] text-[var(--ivory-300)] hover:text-white hover:border-[var(--brass-500)] transition-all cursor-pointer"
              aria-label="Close concierge"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. DINING PERSONA QUIZ & MOOD SELECTOR CARDS (Feature 1) */}
        {/* ============================================================ */}
        <div className="px-3 py-1.5 bg-[rgba(14,11,9,0.92)] border-b border-[var(--border-subtle)] z-10 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[0.55rem] font-mono tracking-widest uppercase text-[var(--brass-400)] flex items-center gap-1">
              <Compass className="w-2.5 h-2.5 text-[var(--brass-400)]" />
              <span>Dining Mood</span>
            </span>
            {selectedPersona && (
              <span className="text-[0.55rem] font-mono text-[var(--brass-300)]">
                {selectedPersona.icon} {selectedPersona.title}
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {DINING_PERSONAS.map((persona) => {
              const isSelected = selectedPersona?.id === persona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleSendPrompt(persona.prompt, persona)}
                  className={isSelected ? 'concierge-mood-card active' : 'concierge-mood-card'}
                  style={{
                    backgroundColor: isSelected ? 'rgba(197, 155, 39, 0.22)' : '#181310',
                    borderColor: isSelected ? '#dfb958' : 'rgba(197, 155, 39, 0.25)',
                    padding: '0.35rem 0.4rem'
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{persona.icon}</span>
                    <span
                      className="font-display leading-none truncate"
                      style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.62rem' }}
                    >
                      {persona.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice Dictation Notification Banner */}
        {voiceNotice && (
          <div className="px-4 py-1.5 bg-[rgba(197,155,39,0.15)] border-b border-[var(--brass-500)] text-[0.7rem] text-[var(--brass-300)] font-mono flex items-center justify-between animate-fade-in shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--brass-400)] animate-ping" />
              <span>{voiceNotice}</span>
            </span>
            <button
              onClick={() => setVoiceNotice(null)}
              className="text-xs hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. VIP MAÎTRE D' DISPATCH SHEET (Feature 4) */}
        {/* ============================================================ */}
        {showVipDispatch && (
          <div className="p-4 sm:p-5 bg-[rgba(16,12,10,0.98)] border-b border-[var(--brass-500)] shadow-2xl z-30 animate-fade-in shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-[var(--brass-400)] overflow-hidden shrink-0 shadow-md">
                  <img
                    src="/images/chef_kabir.jpg"
                    alt="Maître d' Kabir Sharma"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm text-[var(--ivory-50)] font-medium">
                      Kabir Sharma
                    </h4>
                    <span className="text-[0.58rem] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>On Duty Now</span>
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-[var(--brass-300)] font-editorial italic">
                    Senior Maître d' & Gastronomic Director • Concierge Desk Response &lt; 2 Mins
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowVipDispatch(false)}
                className="p-1 rounded text-[var(--ivory-muted)] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Automated Royal Briefing Summary */}
            <div className="mt-3 p-2.5 rounded bg-[rgba(8,6,5,0.7)] border border-[rgba(197,155,39,0.2)] text-[0.68rem] text-[var(--ivory-200)] space-y-1">
              <span className="text-[0.6rem] font-mono tracking-widest uppercase text-[var(--brass-400)] block">
                ✦ Automated Royal Briefing Prepared
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[0.65rem] font-mono">
                <div>
                  <span className="text-[var(--ivory-muted)]">Occasion Mood:</span>{' '}
                  <span className="text-white">{selectedPersona ? selectedPersona.title : 'Bespoke Experience'}</span>
                </div>
                <div>
                  <span className="text-[var(--ivory-muted)]">Target Seating:</span>{' '}
                  <span className="text-[var(--brass-300)]">
                    {lastRecommendedTable ? `${lastRecommendedTable.tableNumber} (${lastRecommendedTable.id})` : 'Table 01'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[var(--ivory-muted)]">Inquired Recipe:</span>{' '}
                  <span className="text-white">{lastRecommendedDish ? lastRecommendedDish.name : 'Awadhi Dum Gosht Biryani'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleLaunchWhatsAppBriefing}
                className="flex-1 py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Launch VIP WhatsApp Handoff</span>
              </button>

              <a
                href="tel:+917008665245"
                className="py-2 px-3 rounded-lg bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.15)] border border-[var(--border-subtle)] text-white text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[var(--brass-400)]" />
                <span className="hidden sm:inline">Direct Line</span>
              </a>

              <button
                type="button"
                onClick={() => setShowVipDispatch(false)}
                className="py-2 px-3 rounded-lg border border-[var(--border-subtle)] text-[var(--ivory-muted)] hover:text-white text-xs cursor-pointer"
              >
                Stay in AI Chat
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. CHAT HISTORY STREAM WITH RICH CARDS */}
        {/* ============================================================ */}
        <div className="chat-scroll-stream space-y-2.5" id="concierge-chat-stream">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`rounded-xl shadow-md ${
                  m.sender === 'user'
                    ? 'bg-[linear-gradient(135deg,#c59b27,#a17c18)] text-black font-medium'
                    : 'border border-[var(--border-subtle)] text-[var(--ivory-100)]'
                }`}
                style={{
                  maxWidth: '90%',
                  padding: '0.6rem 0.75rem',
                  backgroundColor: m.sender === 'user' ? undefined : 'rgba(22, 17, 14, 0.95)'
                }}
              >
                {/* Text and Voice Audio Button */}
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="whitespace-pre-line flex-1 m-0"
                    style={{
                      fontSize: '0.78rem',
                      lineHeight: '1.35',
                      color: m.sender === 'user' ? '#000000' : '#f5f0e6'
                    }}
                  >
                    {m.text}
                  </p>
                  {m.sender === 'concierge' && (
                    <button
                      type="button"
                      onClick={() => handleToggleSpeak(m.id, m.text)}
                      className={`p-1 rounded-full transition-all shrink-0 cursor-pointer ${
                        speakingMsgId === m.id
                          ? 'bg-[var(--brass-500)] text-black animate-pulse'
                          : 'bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(197,155,39,0.2)] text-[var(--brass-400)]'
                      }`}
                      title={speakingMsgId === m.id ? 'Stop' : 'Listen'}
                    >
                      {speakingMsgId === m.id ? (
                        <VolumeX className="w-3 h-3" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* ---------------------------------------------------- */}
                {/* 4A. RICH INTERACTIVE CULINARY CARD (Feature 2) */}
                {/* ---------------------------------------------------- */}
                {m.dish && (
                  <div className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.08)]">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.45rem 0.55rem',
                        backgroundColor: '#120d0a',
                        border: '1px solid rgba(197, 155, 39, 0.35)',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Fixed Compact Dish Thumbnail */}
                      <div
                        style={{
                          width: '54px',
                          height: '54px',
                          minWidth: '54px',
                          minHeight: '54px',
                          maxWidth: '54px',
                          maxHeight: '54px',
                          flexShrink: 0,
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: '1px solid rgba(197, 155, 39, 0.25)',
                          position: 'relative'
                        }}
                      >
                        <img
                          src={m.dish.image}
                          alt={m.dish.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      </div>

                      {/* Dish Info — compact */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-1">
                          <h4
                            className="font-display truncate font-semibold"
                            style={{ fontSize: '0.78rem', color: '#ffffff', margin: 0 }}
                          >
                            {m.dish.name}
                          </h4>
                          <span
                            className="font-mono shrink-0 font-semibold"
                            style={{ fontSize: '0.72rem', color: '#dfb958' }}
                          >
                            {m.dish.currency}{m.dish.price}
                          </span>
                        </div>
                        <p
                          className="font-editorial italic truncate"
                          style={{
                            fontSize: '0.68rem',
                            color: '#a8a29e',
                            margin: '1px 0 4px 0',
                            lineHeight: 1.2
                          }}
                        >
                          {m.dish.shortDesc}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleAddDishToOrder(m.dish, e)}
                            className="btn-brass-primary !py-0.5 !px-2 flex items-center gap-0.5 cursor-pointer shrink-0"
                            style={{ fontSize: '0.62rem', height: '22px' }}
                          >
                            {addedDishIds[m.dish.id] ? (
                              <>
                                <Check className="w-2.5 h-2.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-2.5 h-2.5" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onSelectDish) onSelectDish(m.dish);
                            }}
                            className="px-2 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--ivory-200)] hover:text-white hover:border-[var(--brass-400)] transition-all flex items-center gap-0.5 cursor-pointer shrink-0"
                            style={{ fontSize: '0.62rem', height: '22px' }}
                          >
                            <Eye className="w-2.5 h-2.5 text-[var(--brass-400)]" />
                            <span>Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handlePronounceDish(m.dish.name, e)}
                            className="p-1 rounded text-[var(--ivory-muted)] hover:text-[var(--brass-300)] cursor-pointer"
                            title="Pronounce"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* 4B. SMART INLINE TABLE SUGGESTION CARD (Feature 3) */}
                {/* ---------------------------------------------------- */}
                {m.table && (
                  <div className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.08)]">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.45rem 0.55rem',
                        backgroundColor: '#120d0a',
                        border: '1px solid rgba(197, 155, 39, 0.35)',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: '54px',
                          height: '54px',
                          minWidth: '54px',
                          minHeight: '54px',
                          maxWidth: '54px',
                          maxHeight: '54px',
                          flexShrink: 0,
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: '1px solid rgba(197, 155, 39, 0.25)',
                          position: 'relative'
                        }}
                      >
                        <img
                          src={m.table.image}
                          alt={m.table.tableNumber}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                        <span
                          className="absolute bottom-0.5 left-1 w-2 h-2 rounded-full bg-[#34d399] shadow-[0_0_4px_rgba(16,185,129,0.7)]"
                        />
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-1">
                          <h4
                            className="font-display truncate font-semibold"
                            style={{ fontSize: '0.78rem', color: '#ffffff', margin: 0 }}
                          >
                            {m.table.tableNumber}
                          </h4>
                          <span
                            className="font-mono shrink-0 font-semibold"
                            style={{ fontSize: '0.68rem', color: '#dfb958' }}
                          >
                            {m.table.seats} Guests
                          </span>
                        </div>
                        <p
                          className="font-editorial italic truncate"
                          style={{
                            fontSize: '0.68rem',
                            color: '#dfb958',
                            margin: '1px 0 4px 0',
                            lineHeight: 1.2
                          }}
                        >
                          {m.table.view} • {m.table.atmosphere}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenReservation(m.table);
                            }}
                            className="btn-brass-primary !py-0.5 !px-2.5 flex items-center gap-0.5 cursor-pointer shrink-0"
                            style={{ fontSize: '0.62rem', height: '22px' }}
                          >
                            <Calendar className="w-2.5 h-2.5" />
                            <span>Book</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenReservation(m.table);
                            }}
                            className="px-2 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--ivory-200)] hover:text-white hover:border-[var(--brass-400)] transition-all flex items-center gap-0.5 cursor-pointer shrink-0"
                            style={{ fontSize: '0.62rem', height: '22px' }}
                          >
                            <MapPin className="w-2.5 h-2.5 text-[var(--brass-400)]" />
                            <span>Map</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* 4C. MULTI-COURSE ROYAL PROGRESSION */}
                {/* ---------------------------------------------------- */}
                {m.multiCourse && (
                  <div className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.08)] space-y-1.5">
                    <span
                      className="font-mono tracking-widest uppercase block"
                      style={{ fontSize: '0.62rem', color: '#dfb958' }}
                    >
                      ✦ Royal 4-Course Progression
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {m.multiCourse.map((courseDish, idx) => (
                        <div
                          key={courseDish.id}
                          className="px-2 py-1 rounded border border-[var(--border-subtle)] flex items-center justify-between gap-1"
                          style={{ backgroundColor: '#140f0c' }}
                        >
                          <div className="min-w-0">
                            <span className="font-mono block" style={{ fontSize: '0.55rem', color: '#c59b27' }}>
                              0{idx + 1}
                            </span>
                            <span
                              className="font-display block truncate"
                              style={{ fontSize: '0.68rem', color: '#f5f0e6' }}
                            >
                              {courseDish.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleAddDishToOrder(courseDish, e)}
                            className="p-1 rounded bg-[rgba(197,155,39,0.15)] hover:bg-[var(--brass-500)] text-[var(--brass-300)] hover:text-black transition-all cursor-pointer shrink-0"
                            title={`Add ${courseDish.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          m.multiCourse.forEach((cd) => onAddToCart?.(cd));
                          onClose();
                        }}
                        className="btn-brass-primary !py-0.5 !px-2.5 flex items-center gap-0.5"
                        style={{ fontSize: '0.62rem', height: '22px' }}
                      >
                        <span>Add All to Order</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenReservation(windowTable);
                        }}
                        className="underline font-mono cursor-pointer"
                        style={{ fontSize: '0.65rem', color: '#dfb958' }}
                      >
                        Reserve Table
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Contextual Follow-Up Pills */}
              {m.followUps && m.followUps.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mt-1.5 max-w-[95%]">
                  {m.followUps.map((chipText, chipIdx) => (
                    <button
                      key={chipIdx}
                      type="button"
                      onClick={() => handleSendPrompt(chipText)}
                      style={{
                        backgroundColor: '#1e1713',
                        borderColor: 'rgba(197, 155, 39, 0.35)',
                        color: '#fdf8e6'
                      }}
                      className="px-2 py-1 rounded-full border hover:border-[var(--brass-400)] hover:bg-[rgba(197,155,39,0.2)] text-[0.6rem] font-medium transition-all cursor-pointer shrink-0"
                    >
                      {chipText}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[0.52rem] text-[var(--ivory-muted)] mt-1 px-0.5 font-mono">
                {m.timestamp}
              </span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(26,21,18,0.9)] border border-[var(--brass-500)] text-xs text-[var(--brass-300)] font-editorial italic max-w-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[var(--brass-400)] animate-ping" />
              <span>Maître d’ is consulting royal recipes & table map...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ============================================================ */}
        {/* 5. BOTTOM INPUT BAR WITH VOICE DICTATION (Feature 5) */}
        {/* ============================================================ */}
        <div className="px-3 py-2 border-t border-[var(--border-subtle)] bg-[rgba(20,16,13,0.98)] z-20 shrink-0">
          <form onSubmit={handleFormSubmit} className="flex items-center gap-1.5">
            {/* Microphone Dictation Button */}
            <button
              type="button"
              onClick={handleToggleDictation}
              className={`p-2 rounded-md border transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  : 'bg-[rgba(10,8,7,0.85)] border-[var(--border-subtle)] text-[var(--brass-400)] hover:text-white hover:border-[var(--brass-400)]'
              }`}
              title={isListening ? 'Stop listening' : 'Voice dictation'}
              aria-label="Microphone Voice Dictation"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Ask about recipes, pairings, or tables...'}
              className="flex-1 bg-[#140f0c] border border-[rgba(197,155,39,0.3)] focus:border-[var(--brass-400)] rounded-md px-3 py-2 text-[0.72rem] text-white placeholder-[var(--ivory-muted)] focus:outline-none transition-colors"
            />

            <button
              type="submit"
              className="btn-brass-primary !p-2 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Handoff Action Bar */}
          <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenReservation(lastRecommendedTable || windowTable);
              }}
              style={{
                backgroundColor: 'rgba(197, 155, 39, 0.15)',
                borderColor: 'rgba(197, 155, 39, 0.45)',
                color: '#dfb958'
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-mono text-[0.72rem] hover:bg-[rgba(197,155,39,0.28)] hover:text-white transition-all cursor-pointer font-semibold shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Interactive Table Map</span>
            </button>

            <button
              type="button"
              onClick={() => setShowVipDispatch(true)}
              style={{
                backgroundColor: 'rgba(37, 211, 102, 0.15)',
                borderColor: 'rgba(37, 211, 102, 0.45)',
                color: '#25D366'
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-mono text-[0.72rem] hover:bg-[rgba(37,211,102,0.25)] transition-all cursor-pointer font-semibold shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Transfer to Human Maître d’</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
