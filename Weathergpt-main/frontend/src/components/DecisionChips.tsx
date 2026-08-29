import React from 'react';
import { Umbrella, Clock, Shirt, Compass, Tractor, Anchor, Plane } from 'lucide-react';

interface DecisionChipsProps {
  onSelectQuery: (queryText: string) => void;
  profession?: string;
  lang?: string;
}

export const DecisionChips: React.FC<DecisionChipsProps> = ({
  onSelectQuery,
  profession = 'general',
  lang = 'en',
}) => {
  // Context-specific 2–4 human decision chips
  const getChips = () => {
    if (profession === 'farmer') {
      return [
        {
          label: 'Spraying Window',
          icon: Tractor,
          query: lang === 'ta' ? 'இன்று உகந்த மருந்து தெளிக்கும் நேரம் எது?' : lang === 'hi' ? 'आज कीटनाशक छिड़काव का सबसे सही समय क्या है?' : 'What is the optimal crop spraying window today?'
        },
        {
          label: 'Rain Risk Today',
          icon: Umbrella,
          query: lang === 'ta' ? 'இன்று வயல்வெளிக்கு மழை அச்சுறுத்தல் உள்ளதா?' : lang === 'hi' ? 'क्या आज फसल के लिए बारिश का जोखिम है?' : 'Is there a rain risk for field harvesting today?'
        },
        {
          label: 'Irrigation Advice',
          icon: Compass,
          query: lang === 'ta' ? 'இன்று பயிர்களுக்கு நீர்ப்பாசனம் செய்யலாமா?' : lang === 'hi' ? 'क्या आज खेत में सिंचाई की आवश्यकता है?' : 'Should I irrigate my field today?'
        }
      ];
    }

    if (profession === 'fisherman') {
      return [
        {
          label: 'Marine Sea State',
          icon: Anchor,
          query: lang === 'ta' ? 'இன்று கடலில் அலை மற்றும் காற்றின் நிலை என்ன?' : lang === 'hi' ? 'आज समुद्र में हवा और लहरों की स्थिति कैसी है?' : 'What are the coastal sea state and wave conditions today?'
        },
        {
          label: 'Safe Voyage Window',
          icon: Clock,
          query: lang === 'ta' ? 'மீன்பிடிக்க செல்ல சிறந்த நேரம் எது?' : lang === 'hi' ? 'मछली पकड़ने के लिए सबसे अनुकूल समय क्या है?' : 'What is the safest window for coastal fishing today?'
        }
      ];
    }

    if (profession === 'aviation') {
      return [
        {
          label: 'VFR Flying Outlook',
          icon: Plane,
          query: 'Are current weather conditions permissible for standard VFR flight operations?'
        },
        {
          label: 'Visibility & Turbulence',
          icon: Compass,
          query: 'What is the boundary layer wind shear and runway visibility?'
        }
      ];
    }

    // Default: General Public
    return [
      {
        label: 'Need an umbrella?',
        icon: Umbrella,
        query: lang === 'ta' ? 'இன்று எனக்கு குடை தேவையா?' : lang === 'hi' ? 'क्या आज मुझे छाता ले जाने की आवश्यकता है?' : 'Do I need an umbrella today?'
      },
      {
        label: 'Best time to go out',
        icon: Clock,
        query: lang === 'ta' ? 'இன்று வெளியே செல்ல சிறந்த நேரம் எது?' : lang === 'hi' ? 'आज बाहर जाने का सबसे अच्छा समय क्या है?' : 'What is the best time to go out today?'
      },
      {
        label: 'What should I wear?',
        icon: Shirt,
        query: lang === 'ta' ? 'இன்றைய வானிலைக்கு என்ன ஆடை அணியலாம்?' : lang === 'hi' ? 'आज के मौसम के अनुसार क्या पहनना चाहिए?' : 'What clothing is recommended for today\'s weather?'
      }
    ];
  };

  const chips = getChips();

  return (
    <div className="w-full">
      <div className="flex items-center space-x-1.5 overflow-x-auto py-1 no-scrollbar">
        {chips.map((chip, index) => {
          const Icon = chip.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectQuery(chip.query)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-850/70 border border-slate-200/70 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 hover:border-sky-300 dark:hover:border-sky-500/40 transition-all shadow-xs shrink-0"
            >
              <Icon className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="whitespace-nowrap">{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
