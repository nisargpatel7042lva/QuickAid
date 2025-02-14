import React, { useState, useEffect } from 'react';
import { Heart, Mic, Phone, Type, Volume2, Package, ChevronDown, HeartPulse as Pulse } from 'lucide-react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function App() {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showFirstAidKit, setShowFirstAidKit] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

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
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleMicClick = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsListening(!isListening);
  };

  const handleEmergencyCall = () => {
    window.location.href = 'tel:108';
  };

  const getInstructions = (input: string) => {
    const lowercaseInput = input.toLowerCase();
    if (lowercaseInput.includes('chok')) return emergencyInstructions.choking;
    if (lowercaseInput.includes('bleed')) return emergencyInstructions.bleeding;
    if (lowercaseInput.includes('burn')) return emergencyInstructions.burns;
    if (lowercaseInput.includes('fracture')) return emergencyInstructions.fracture;
    if (lowercaseInput.includes('heart') || lowercaseInput.includes('chest pain')) return emergencyInstructions.heartAttack;
    if (lowercaseInput.includes('snake')) return emergencyInstructions.snakeBite;
    if (lowercaseInput.includes('heat') || lowercaseInput.includes('stroke')) return emergencyInstructions.heatstroke;
    if (lowercaseInput.includes('seizure')) return emergencyInstructions.seizure;
    if (lowercaseInput.includes('drown')) return emergencyInstructions.drowning;
    if (lowercaseInput.includes('poison')) return emergencyInstructions.poisoning;
    if (lowercaseInput.includes('electric')) return emergencyInstructions.electricShock;
    if (lowercaseInput.includes('allerg')) return emergencyInstructions.allergicReaction;
    if (lowercaseInput.includes('nose') && lowercaseInput.includes('bleed')) return emergencyInstructions.nosebleed;
    if (lowercaseInput.includes('sprain')) return emergencyInstructions.sprain;
    if (lowercaseInput.includes('eye')) return emergencyInstructions.eyeInjury;
    if (lowercaseInput.includes('diabet')) return emergencyInstructions.diabeticEmergency;
    if (lowercaseInput.includes('concuss')) return emergencyInstructions.concussion;
    if (lowercaseInput.includes('asthma')) return emergencyInstructions.asthmaAttack;
    if (lowercaseInput.includes('tooth')) return emergencyInstructions.toothache;
    if (lowercaseInput.includes('hypothermia')) return emergencyInstructions.hypothermia;
    if (lowercaseInput.includes('panic')) return emergencyInstructions.panic;
    return ["Please describe the emergency situation clearly (e.g., 'choking', 'bleeding', 'burn', 'fracture', 'heart attack', 'snake bite', 'drowning', 'poisoning', 'electric shock', 'allergic reaction', etc.)"];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-800">QuickAid</h1>
            </div>
            <button
              onClick={() => handleEmergencyCall()}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>Emergency Call (108)</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={handleMicClick}
                className={`p-4 rounded-full ${
                  isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                } hover:bg-red-600 hover:text-white transition-colors`}
              >
                <Mic className="h-6 w-6" />
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe the emergency situation..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <Type className="h-6 w-6 text-gray-400" />
            </div>

            <div className="space-y-4">
              {getInstructions(inputText).map((instruction, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-gray-700">{instruction}</p>
                  <Volume2 className="h-5 w-5 text-gray-400 cursor-pointer hover:text-red-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <button
              onClick={() => setShowFirstAidKit(!showFirstAidKit)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-red-500" />
                <span className="font-semibold text-gray-700">First Aid Kit Guide</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform ${showFirstAidKit ? 'rotate-180' : ''}`} />
            </button>
            
            {showFirstAidKit && (
              <div className="mt-4 space-y-4">
                {Object.entries(firstAidKit).map(([item, info]) => (
                  <div key={item} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">{item}</h3>
                    <p className="text-gray-600 mb-2">{info.description}</p>
                    <p className="text-gray-700 text-sm"><strong>How to use:</strong> {info.usage}</p>
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