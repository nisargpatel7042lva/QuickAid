import { useState, useEffect, useRef } from 'react';
import { Heart, Mic, Phone, Type, Volume2, Package, ChevronDown, Youtube, PlayCircle, AlertCircle } from 'lucide-react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Fuse from 'fuse.js';

function App() {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showFirstAidKit, setShowFirstAidKit] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const inputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<Fuse<string>>();

  const emergencyVideos = {
    choking: "https://www.youtube.com/watch?v=PA9hpOnvtCk",
    bleeding: "https://www.youtube.com/watch?v=NxO5LvgqZe0",
    burns: "https://www.youtube.com/watch?v=EaJmzB8YgS0",
    fracture: "https://www.youtube.com/watch?v=PnZgZK3T4Bk",
    heartAttack: "https://www.youtube.com/watch?v=gDwt7dD3awc",
    snakeBite: "https://www.youtube.com/watch?v=O4KkwuL9JJw",
    heatstroke: "https://www.youtube.com/watch?v=vON9sC6Fgb0",
    seizure: "https://www.youtube.com/watch?v=ZPls_oCE-QE",
    drowning: "https://www.youtube.com/watch?v=GJxiIPXlOlE",
    poisoning: "https://www.youtube.com/watch?v=KHU9bNS7q6c",
    electricShock: "https://www.youtube.com/watch?v=hLJJvmX0YZ0",
    allergicReaction: "https://www.youtube.com/watch?v=v7J9bfqhRBk",
    nosebleed: "https://www.youtube.com/watch?v=MmQWR_qIXhc",
    sprain: "https://www.youtube.com/watch?v=gNn6Xm5iK0Q",
    eyeInjury: "https://www.youtube.com/watch?v=AdRHG-Z_hXw",
    diabeticEmergency: "https://www.youtube.com/watch?v=TL8A4HtREWo",
    concussion: "https://www.youtube.com/watch?v=RH3YxAYJBk4",
    asthmaAttack: "https://www.youtube.com/watch?v=JE7ZtRTEP64",
    toothache: "https://www.youtube.com/watch?v=8YwXJR-9KRs",
    hypothermia: "https://www.youtube.com/watch?v=Kk7LBe3_dLU",
    panic: "https://www.youtube.com/watch?v=8LdVw7JxqPE"
  };

  const emergencyInstructions = {
    choking: [
      "Stand behind the person and lean them forward slightly",
      "Give 5 sharp blows between their shoulder blades",
      "Check if the obstruction has cleared",
      "If not, perform abdominal thrusts (Heimlich maneuver)",
      "Call emergency services if the person becomes unconscious"
    ],
    panicAttack: [
      "Encourage slow, deep breathing",
      "Reassure the person and stay calm",
      "Help them focus on their surroundings",
      "Avoid crowded or stressful environments",
      "Seek medical assistance if symptoms persist"
    ],
    foodPoisoning: [
      "Encourage the person to stay hydrated",
      "Avoid solid foods until nausea subsides",
      "Watch for signs of dehydration",
      "Seek medical help if symptoms worsen or persist",
      "Avoid self-medicating without consulting a doctor"
    ],
    dehydration: [
      "Encourage small sips of water",
      "Move the person to a cool, shaded area",
      "Avoid caffeinated or alcoholic drinks",
      "Offer electrolyte-rich fluids if available",
      "Seek medical help if severe dehydration symptoms occur"
    ],
    sunburn: [
      "Move to a cool indoor area",
      "Apply aloe vera or moisturizer",
      "Drink plenty of water",
      "Avoid further sun exposure",
      "Seek medical help for severe burns with blisters"
    ],
    carbonMonoxidePoisoning: [
      "Move the person to fresh air immediately",
      "Call emergency services",
      "Loosen tight clothing and keep them comfortable",
      "Avoid lighting flames or smoking near them",
      "Seek medical attention even if they seem fine"
    ],
    stroke: [
      "Call emergency services immediately",
      "Check for facial drooping, arm weakness, and speech difficulty",
      "Help the person lie down with head elevated",
      "Do not give food or drink",
      "Monitor their condition until help arrives"
    ],
    bleeding: [
      "Clean your hands and put on gloves if available",
      "Apply direct pressure to the wound using sterile gauze or clean cloth",
      "Elevate the injured area above the heart if possible",
      "Apply a clean bandage firmly but not too tight",
      "Seek immediate medical attention for severe bleeding"
    ],
    burns: [
      "Cool the burn under cool (not cold) running water for at least 10 minutes",
      "Remove any jewelry or tight items before swelling occurs",
      "Cover with a sterile gauze bandage or clean cloth",
      "Don't break blisters or apply creams",
      "Seek medical attention for severe or chemical burns"
    ],
    fracture: [
      "Keep the injured person still and calm",
      "Immobilize the injured area without forcing it into position",
      "Apply ice packs wrapped in cloth to reduce swelling",
      "Support the injury with soft padding",
      "Seek immediate medical attention"
    ],
    heartAttack: [
      "Call emergency services immediately (108)",
      "Help the person sit or lie down",
      "Loosen any tight clothing",
      "Give aspirin if available and no known allergies",
      "Begin CPR if the person becomes unconscious"
    ],
    snakeBite: [
      "Keep the person calm and still to slow venom spread",
      "Remove any constricting items near the bite",
      "Clean the wound with soap and water",
      "Keep the affected area below heart level",
      "Note snake's appearance if safe, and seek immediate medical help"
    ],
    heatstroke: [
      "Move person to a cool, shaded area immediately",
      "Remove excess clothing and cool skin with water",
      "Place ice packs at neck, armpits, and groin",
      "Give cool fluids if person is conscious",
      "Call emergency services as this is life-threatening"
    ],
    seizure: [
      "Clear the area of harmful objects",
      "Ease the person to the floor if they're not already lying down",
      "Turn them onto their side",
      "Never put anything in their mouth",
      "Time the seizure and call 108 if it lasts more than 5 minutes"
    ],
    drowning: [
      "Call emergency services immediately",
      "Remove person from water if safe to do so",
      "Check for breathing and begin CPR if necessary",
      "Keep the person warm",
      "Turn head to side to allow water drainage if unconscious"
    ],
    poisoning: [
      "Call poison control center or emergency services",
      "Do not induce vomiting unless instructed",
      "Collect the poison container or sample if available",
      "Check breathing and consciousness",
      "Follow emergency operator's instructions"
    ],
    electricShock: [
      "Turn off power source if possible",
      "Do not touch person until power is off",
      "Check breathing and pulse",
      "Begin CPR if necessary",
      "Treat any burns and call emergency services"
    ],
    allergicReaction: [
      "Call emergency services for severe reactions",
      "Use EpiPen if available and prescribed",
      "Help person stay calm and lie down",
      "Loosen tight clothing",
      "Monitor breathing and consciousness"
    ],
    nosebleed: [
      "Sit upright and lean slightly forward",
      "Pinch the soft part of the nose firmly",
      "Breathe through mouth while holding nose",
      "Continue pressure for 10-15 minutes",
      "Apply cold compress to nose and cheeks"
    ],
    sprain: [
      "Follow RICE: Rest, Ice, Compression, Elevation",
      "Apply ice pack wrapped in cloth for 15-20 minutes",
      "Use elastic bandage for compression",
      "Keep injured area elevated",
      "Seek medical attention if severe pain persists"
    ],
    eyeInjury: [
      "Do not rub or touch the eye",
      "Flush with clean water for chemical exposure",
      "Cover both eyes to prevent movement",
      "Seek immediate medical attention",
      "Keep person calm and still"
    ],
    diabeticEmergency: [
      "Check if person is conscious",
      "If conscious and blood sugar is low, give sugar",
      "If unconscious, call emergency services",
      "Place in recovery position if unconscious",
      "Monitor breathing and pulse"
    ],
    concussion: [
      "Keep person awake and lying still",
      "Check for signs of confusion or memory loss",
      "Monitor for vomiting or seizures",
      "Apply cold pack to swelling",
      "Seek immediate medical attention"
    ],
    asthmaAttack: [
      "Help person sit upright",
      "Assist with prescribed inhaler if available",
      "Keep person calm and encourage slow breathing",
      "Loosen tight clothing",
      "Call emergency services if symptoms worsen"
    ],
    toothache: [
      "Rinse mouth with warm water",
      "Use dental floss to remove trapped food",
      "Apply cold compress to reduce swelling",
      "Take over-the-counter pain reliever",
      "Seek dental care if pain persists"
    ],
    hypothermia: [
      "Move person to warm, dry area",
      "Remove wet clothing",
      "Warm core body gradually",
      "Give warm beverages if conscious",
      "Call emergency services for severe cases"
    ],
    panic: [
      "Help person find a quiet place",
      "Encourage slow, deep breathing",
      "Stay calm and reassuring",
      "Ground them by describing surroundings",
      "Seek medical help if symptoms persist"
    ],
    heartPalpitations: [
      "Encourage the person to sit down and relax",
      "Help them take slow, deep breaths",
      "Avoid caffeine or stimulants",
      "If pain or dizziness occurs, call emergency services"
    ],
    fainting: [
      "Lay the person down and elevate their legs",
      "Loosen tight clothing",
      "Check for breathing and consciousness",
      "If unconscious for more than a minute, call emergency services"
    ],
    appendicitis: [
      "Look for severe pain in the lower right abdomen",
      "Avoid giving the person food or drink",
      "Seek immediate medical attention"
    ],
    insectBiteAllergy: [
      "Move away from the insect source",
      "Apply a cold pack to reduce swelling",
      "Use an EpiPen if the person has a severe allergic reaction",
      "Call emergency services if breathing difficulty occurs"
    ]
  };

  const firstAidKit = {
    "Adhesive Bandages": {
      description: "For covering small cuts and scrapes",
      usage: "Clean wound, dry area, apply bandage ensuring adhesive doesn't touch wound"
    },
    "Sterile Gauze": {
      description: "Absorbent pad for larger wounds",
      usage: "Apply directly to wounds to absorb blood and protect from infection"
    },
    "Medical Tape": {
      description: "Secures bandages and gauze in place",
      usage: "Use to hold dressing materials in place without restricting movement"
    },
    "Scissors": {
      description: "For cutting tape, gauze, or clothing in emergencies",
      usage: "Use clean scissors to cut bandages or remove clothing from injured areas"
    },
    "Antiseptic Wipes": {
      description: "Cleans wounds and prevents infection",
      usage: "Clean around wounds before applying dressings"
    },
    "Elastic Bandage": {
      description: "Provides compression and support",
      usage: "Wrap sprains or strains, not too tight to maintain circulation"
    },
    "Triangular Bandage": {
      description: "Multi-purpose bandage for slings and wraps",
      usage: "Can be used as arm sling or to secure splints"
    },
    "Disposable Gloves": {
      description: "Protects from blood and bodily fluids",
      usage: "Wear when treating any open wounds or injuries"
    },
    "CPR Mask": {
      description: "Barrier device for rescue breathing",
      usage: "Place over victim's mouth/nose during CPR to prevent direct contact"
    },
    "Instant Cold Pack": {
      description: "Chemical pack that gets cold when activated",
      usage: "Squeeze to activate, wrap in cloth before applying to injury"
    },
    "Emergency Blanket": {
      description: "Metallic blanket for temperature regulation",
      usage: "Wrap around person for warmth or cooling in emergencies"
    },
    "Saline Solution": {
      description: "Sterile salt water for cleaning wounds",
      usage: "Flush wounds or eyes to remove debris"
    }
  };

  useEffect(() => {
    const searchOptions = {
      includeScore: true,
      threshold: 0.4,
      keys: ['name']
    };

    const searchItems = Object.keys(emergencyInstructions).map(key => ({
      name: key.toLowerCase().replace(/([A-Z])/g, ' $1').trim()
    }));

    fuseRef.current = new Fuse(searchItems, searchOptions);
  }, []);

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
      SpeechRecognition.stopListening();
      setIsListening(false);
    }
  }, [transcript]);

  useEffect(() => {
    if (inputText.length > 0 && fuseRef.current) {
      const results = fuseRef.current.search(inputText.toLowerCase());
      
      const filteredSuggestions = results.map(result => 
        Object.keys(emergencyInstructions).find(key => 
          key.toLowerCase().replace(/([A-Z])/g, ' $1').trim() === result.item.name
        )
      ).filter((key): key is string => key !== undefined);

      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputText]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
    }
    setIsListening(!isListening);
  };

  const handleEmergencyCall = () => {
    window.location.href = 'tel:108';
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getInstructions = (input: string) => {
    if (!input) return { instructions: [], videoUrl: null };

    const normalizedInput = input.toLowerCase();

    if (fuseRef.current) {
      const results = fuseRef.current.search(normalizedInput);
      if (results.length > 0) {
        const matchedKey = Object.keys(emergencyInstructions).find(key => 
          key.toLowerCase().replace(/([A-Z])/g, ' $1').trim() === results[0].item.name
        );

        if (matchedKey) {
          return {
            instructions: emergencyInstructions[matchedKey],
            videoUrl: emergencyVideos[matchedKey]
          };
        }
      }
    }

    return { 
      instructions: ["Please describe the emergency situation clearly (e.g., 'choking', 'bleeding', 'burn', etc.)"],
      videoUrl: null 
    };
  };

  const { instructions, videoUrl } = getInstructions(inputText);

  const formatSuggestionText = (text: string) => {
    return text.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-50">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-red-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-2 rounded-lg shadow-md">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">QuickAid</h1>
            </div>
            <button
              onClick={handleEmergencyCall}
              className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-md"
            >
              <Phone className="h-5 w-5" />
              <span className="font-semibold">Emergency (108)</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What's the Emergency?</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleMicClick}
                className={`p-4 rounded-xl ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600'
                } hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 shadow-md`}
              >
                <Mic className="h-6 w-6" />
              </button>
              <div className="flex-1 relative" ref={inputRef}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe the emergency situation..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm text-lg"
                />
                <Type className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                
                {showSuggestions && (
                  <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-6 py-3 text-left hover:bg-red-50 transition-colors text-gray-700 flex items-center space-x-2"
                      >
                        <Type className="h-4 w-4 text-red-500" />
                        <span>{formatSuggestionText(suggestion)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {inputText && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Emergency Instructions</h2>
                {videoUrl && (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-md"
                  >
                    <PlayCircle className="h-5 w-5" />
                    <span>Watch Tutorial</span>
                  </a>
                )}
              </div>
              <div className="space-y-4">
                {instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-6 bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 text-lg leading-relaxed">{instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <button
              onClick={() => setShowFirstAidKit(!showFirstAidKit)}
              className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-50 to-white rounded-xl hover:from-red-100 transition-all shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-red-500 p-2 rounded-lg shadow-sm">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">First Aid Kit Guide</span>
              </div>
              <ChevronDown className={`h-6 w-6 text-gray-500 transform transition-transform ${showFirstAidKit ? 'rotate-180' : ''}`} />
            </button>
            
            {showFirstAidKit && (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {Object.entries(firstAidKit).map(([item, info]) => (
                  <div key={item} className="p-6 bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span>{item}</span>
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <p className="font-medium">{info.description}</p>
                      <p className="text-sm border-t border-red-100 pt-2">
                        <strong className="text-red-500">Usage:</strong> {info.usage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;