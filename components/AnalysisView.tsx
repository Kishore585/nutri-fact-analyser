
import React, { useState } from 'react';
import { ScanResult, SafetyStatus, IngredientAnalysis, ConsumptionGuidance } from '../types';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, RefreshCw, Info, FileText, Share2, UtensilsCrossed, ShieldAlert as ModIcon, Scale, Youtube, ExternalLink } from 'lucide-react';

interface AnalysisViewProps {
  result: ScanResult;
  onReset: () => void;
  onViewReport: () => void;
  userProfileName: string;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset, onViewReport, userProfileName }) => {

  const getVerdictStyles = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.SAFE:
        return {
          gradient: 'from-emerald-400 to-teal-500',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          icon: <CheckCircle className="w-14 h-14 text-white" />,
          label: 'Health Grade: A'
        };
      case SafetyStatus.CAUTION:
        return {
          gradient: 'from-amber-400 to-orange-500',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: <AlertTriangle className="w-14 h-14 text-white" />,
          label: 'Moderate Risk'
        };
      case SafetyStatus.UNSAFE:
        return {
          gradient: 'from-rose-500 to-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: <XCircle className="w-14 h-14 text-white" />,
          label: 'Danger Zone'
        };
      default:
        return {
          gradient: 'from-slate-400 to-slate-500',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-700',
          icon: <Info className="w-14 h-14 text-white" />,
          label: 'Inconclusive'
        };
    }
  };

  const styles = getVerdictStyles(result.verdict);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-16 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Verdict Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-dark-surface p-10 rounded-3xl text-center flex flex-col items-center border border-outline-variant dark:border-dark-border shadow-elevation-2 dark:shadow-dark-elevation-2 transition-colors">
            <div className="relative mb-8">
              <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${styles.gradient} shadow-elevation-3 flex items-center justify-center`}>
                {styles.icon}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-on-surface dark:text-dark-text mb-1 tracking-tight">{styles.label}</h2>
            <p className="text-on-surface-variant dark:text-dark-text-secondary font-medium uppercase tracking-widest text-[10px] mb-8">{userProfileName} PROFILE</p>

            <div className="flex gap-3 w-full">
              <button onClick={onReset} className="flex-1 bg-surface-container dark:bg-dark-surface-container p-3 rounded-xl hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high transition-all text-on-surface-variant dark:text-dark-text-secondary flex justify-center active:scale-[0.98]">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="flex-1 bg-surface-container dark:bg-dark-surface-container p-3 rounded-xl hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high transition-all text-on-surface-variant dark:text-dark-text-secondary flex justify-center active:scale-[0.98]">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-outline-variant dark:border-dark-border shadow-elevation-1 dark:shadow-dark-elevation-1 transition-colors">
            <h4 className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-widest mb-4">Observations</h4>
            <div className="space-y-2">
              {result.nutritionalHighlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-surface-container dark:bg-dark-surface-container p-3 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-dark-primary flex-shrink-0"></div>
                  <span className="text-xs font-medium text-on-surface dark:text-dark-text">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summary, Consumption Guidance & Ingredients */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-dark-surface p-10 rounded-3xl border border-outline-variant dark:border-dark-border shadow-elevation-2 dark:shadow-dark-elevation-2 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-on-surface dark:text-dark-text tracking-tight">Analysis Brief</h3>
              <button onClick={onViewReport} className="bg-primary-light dark:bg-dark-primary-light text-primary dark:text-dark-primary px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-primary-container dark:hover:bg-dark-primary-container transition-all">
                Full Report
              </button>
            </div>
            <p className="text-on-surface-variant dark:text-dark-text-secondary text-lg leading-relaxed italic border-l-2 border-primary dark:border-dark-primary pl-6 py-1">
              "{result.summary}"
            </p>
          </div>

          {/* Consumption Guidance Section */}
          {result.consumptionGuidance && (
            <ConsumptionGuidanceCard guidance={result.consumptionGuidance} />
          )}

          <div className="bg-white dark:bg-dark-surface rounded-3xl overflow-hidden border border-outline-variant dark:border-dark-border shadow-elevation-2 dark:shadow-dark-elevation-2 transition-colors">
            <div className="p-6 border-b border-outline-variant dark:border-dark-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-on-surface dark:text-dark-text tracking-tight">Ingredient Composition</h3>
              <span className="bg-on-surface dark:bg-dark-text text-white dark:text-dark-bg text-[10px] font-semibold px-3 py-1 rounded-full">
                {result.ingredients.length} items
              </span>
            </div>
            <div className="divide-y divide-outline-variant dark:divide-dark-border">
              {result.ingredients.map((ing, index) => (
                <IngredientRow key={index} ingredient={ing} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ======================== Consumption Guidance Card ======================== */

const ConsumptionGuidanceCard: React.FC<{ guidance: ConsumptionGuidance }> = ({ guidance }) => {
  const getGuidanceIcon = () => {
    switch (guidance.type) {
      case 'recipe': return <UtensilsCrossed className="w-5 h-5" />;
      case 'moderation': return <ModIcon className="w-5 h-5" />;
      case 'portion': return <Scale className="w-5 h-5" />;
    }
  };

  const getGuidanceAccent = () => {
    switch (guidance.type) {
      case 'recipe': return {
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800/50',
        badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
      };
      case 'moderation': return {
        iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800/50',
        badge: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
      };
      case 'portion': return {
        iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800/50',
        badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      };
    }
  };

  const accent = getGuidanceAccent();

  return (
    <div className={`bg-white dark:bg-dark-surface rounded-3xl overflow-hidden border ${accent.border} shadow-elevation-2 dark:shadow-dark-elevation-2 transition-colors`}>
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${accent.iconBg}`}>
          {getGuidanceIcon()}
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-on-surface dark:text-dark-text tracking-tight">{guidance.title}</h3>
          </div>
          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${accent.badge}`}>
            {guidance.type === 'recipe' ? '🍳 Recipes' : guidance.type === 'moderation' ? '⚠️ Moderation' : '📊 Daily Intake'}
          </span>
        </div>
      </div>

      {/* Advice */}
      <div className="px-6 pb-4">
        <p className="text-on-surface-variant dark:text-dark-text-secondary text-sm leading-relaxed">
          {guidance.advice}
        </p>
      </div>

      {/* Recipe Cards */}
      {guidance.type === 'recipe' && guidance.recipes && guidance.recipes.length > 0 && (
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {guidance.recipes.map((recipe, idx) => (
              <div key={idx} className="bg-surface-container dark:bg-dark-surface-container rounded-2xl p-4 border border-outline-variant/50 dark:border-dark-border/50 hover:shadow-elevation-1 dark:hover:shadow-dark-elevation-1 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold text-on-surface dark:text-dark-text mb-1">{recipe.name}</h4>
                    <p className="text-xs text-on-surface-variant dark:text-dark-text-secondary leading-relaxed">{recipe.description}</p>
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.youtubeSearchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-semibold uppercase tracking-wider hover:bg-red-100 dark:hover:bg-red-900/40 transition-all group"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Watch</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Amount for Portion type */}
      {guidance.type === 'portion' && guidance.dailyAmount && (
        <div className="px-6 pb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-5 text-center">
            <p className="text-[10px] font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-2">Recommended Daily Amount</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{guidance.dailyAmount}</p>
          </div>
        </div>
      )}

      {/* Moderation Warning */}
      {guidance.type === 'moderation' && (
        <div className="px-6 pb-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-800/40 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
              ⚡
            </div>
            <p className="text-amber-800 dark:text-amber-300 text-sm font-medium leading-relaxed">
              This is a processed food item. Consume in minimal quantities and consider healthier alternatives for your health goals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ======================== Ingredient Row ======================== */

const IngredientRow: React.FC<{ ingredient: IngredientAnalysis }> = ({ ingredient }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadge = (s: SafetyStatus) => {
    switch (s) {
      case SafetyStatus.SAFE: return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
      case SafetyStatus.CAUTION: return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
      case SafetyStatus.UNSAFE: return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
      default: return 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className={`transition-all duration-200 ${expanded ? 'bg-surface-container dark:bg-dark-surface-container' : 'hover:bg-surface/80 dark:hover:bg-dark-surface-dim'}`}>
      <div onClick={() => setExpanded(!expanded)} className="flex items-center justify-between p-6 cursor-pointer">
        <div className="flex flex-col">
          <span className="text-base font-semibold text-on-surface dark:text-dark-text">{ingredient.commonName}</span>
          <span className="text-[10px] text-on-surface-variant dark:text-dark-text-secondary font-mono mt-0.5">{ingredient.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-semibold border uppercase tracking-tight ${getStatusBadge(ingredient.status)}`}>
            {ingredient.status}
          </span>
          <div className={`w-8 h-8 rounded-full bg-surface-container dark:bg-dark-surface-container flex items-center justify-center transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4 text-on-surface-variant dark:text-dark-text-secondary" />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 animate-fade-in">
          <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-outline-variant dark:border-dark-border">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-widest mb-2 block">About</label>
                <p className="text-on-surface dark:text-dark-text text-sm leading-relaxed">{ingredient.description}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-widest mb-2 block">Rationale</label>
                <p className={`font-medium text-sm leading-relaxed ${ingredient.status === SafetyStatus.SAFE ? 'text-emerald-700 dark:text-emerald-400' : ingredient.status === SafetyStatus.UNSAFE ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {ingredient.reason}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
