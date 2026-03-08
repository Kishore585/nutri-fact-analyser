
import React, { useState } from 'react';
import { ScanResult, SafetyStatus, IngredientAnalysis, ConsumptionGuidance } from '../types';
import { RefreshCw, Share2, ChevronDown, BookOpen, Youtube, ExternalLink } from 'lucide-react';

interface AnalysisViewProps {
  result: ScanResult;
  onReset: () => void;
  onViewReport: () => void;
  userProfileName: string;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset, onViewReport, userProfileName }) => {

  const getVerdictConfig = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.SAFE:
        return { letter: 'A', color: '#6B8F71', trackColor: '#E8F0E9', label: 'Health Grade: A' };
      case SafetyStatus.CAUTION:
        return { letter: 'B', color: '#D4A843', trackColor: '#FFF4E0', label: 'Moderate Risk' };
      case SafetyStatus.UNSAFE:
        return { letter: 'C', color: '#C75050', trackColor: '#FFE8E8', label: 'High Risk' };
      default:
        return { letter: '?', color: '#8B8B8B', trackColor: '#F0F0F0', label: 'Inconclusive' };
    }
  };

  const getIndicatorColor = (idx: number, total: number) => {
    const colors = ['#6B8F71', '#6B8F71', '#D4A843', '#6B8F71', '#D4A843', '#C75050', '#8B8B8B'];
    return colors[idx % colors.length];
  };

  const verdict = getVerdictConfig(result.verdict);

  // SVG ring gauge values
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const progress = result.verdict === SafetyStatus.SAFE ? 0.92 :
    result.verdict === SafetyStatus.CAUTION ? 0.65 :
      result.verdict === SafetyStatus.UNSAFE ? 0.35 : 0.5;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-16 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ═══════════ Left Column: Verdict & Key Indicators ═══════════ */}
        <div className="lg:col-span-4 space-y-8">

          {/* Verdict Gauge Card */}
          <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl text-center flex flex-col items-center border border-outline-variant/40 dark:border-dark-border shadow-sm dark:shadow-dark-elevation-1 transition-colors">

            {/* Circular Gauge */}
            <div className="relative w-44 h-44 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Track */}
                <circle
                  cx="80" cy="80" r={radius}
                  fill="none"
                  stroke={verdict.trackColor}
                  strokeWidth="10"
                  className="dark:opacity-30"
                />
                {/* Progress */}
                <circle
                  cx="80" cy="80" r={radius}
                  fill="none"
                  stroke={verdict.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Center Letter */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-5xl tracking-tight"
                  style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 700, color: verdict.color }}
                >
                  {verdict.letter}
                </span>
              </div>
            </div>

            <p className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-[0.25em] mb-1">
              Current Assessment
            </p>
            <h2
              className="text-lg text-on-surface dark:text-dark-text mb-6"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}
            >
              {userProfileName} Profile
            </h2>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full max-w-[200px]">
              <button
                onClick={onReset}
                className="flex-1 py-3 border border-outline-variant dark:border-dark-border rounded-xl hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all text-on-surface-variant dark:text-dark-text-secondary flex justify-center active:scale-[0.97]"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                className="flex-1 py-3 border border-outline-variant dark:border-dark-border rounded-xl hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all text-on-surface-variant dark:text-dark-text-secondary flex justify-center active:scale-[0.97]"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key Indicators */}
          <div className="px-2">
            <h4 className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-[0.25em] mb-5">
              Key Indicators
            </h4>
            <div className="space-y-4">
              {result.nutritionalHighlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getIndicatorColor(idx, result.nutritionalHighlights.length) }}
                  />
                  <span className="text-sm text-on-surface dark:text-dark-text leading-snug">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════ Right Column: Analysis Brief + Consumption + Ingredients ═══════════ */}
        <div className="lg:col-span-8 space-y-10">

          {/* Analysis Brief */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-3xl text-on-surface dark:text-dark-text"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}
              >
                Analysis Brief
              </h3>
              <button
                onClick={onViewReport}
                className="px-5 py-2.5 border border-on-surface dark:border-dark-text rounded-lg text-on-surface dark:text-dark-text text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-on-surface hover:text-white dark:hover:bg-dark-text dark:hover:text-dark-bg transition-all"
              >
                Full Report
              </button>
            </div>

            <div className="border-l-2 border-on-surface-variant/30 dark:border-dark-border pl-6 py-2">
              <p
                className="text-on-surface-variant dark:text-dark-text-secondary text-lg leading-relaxed"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontStyle: 'italic' }}
              >
                "{result.summary}"
              </p>
            </div>
          </div>

          {/* Consumption Guidance */}
          {result.consumptionGuidance && (
            <ConsumptionGuidanceCard guidance={result.consumptionGuidance} />
          )}

          {/* Ingredient Composition */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-2xl text-on-surface dark:text-dark-text"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}
              >
                Ingredient Composition
              </h3>
              <span className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-wider">
                {result.ingredients.length} items
              </span>
            </div>
            <div className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-outline-variant/40 dark:border-dark-border shadow-sm dark:shadow-dark-elevation-1 transition-colors">
              <div className="divide-y divide-outline-variant/50 dark:divide-dark-border">
                {result.ingredients.map((ing, index) => (
                  <IngredientRow key={index} ingredient={ing} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ════════════════════════ Consumption Guidance ════════════════════════ */

const ConsumptionGuidanceCard: React.FC<{ guidance: ConsumptionGuidance }> = ({ guidance }) => {

  const getBadgeConfig = () => {
    switch (guidance.type) {
      case 'recipe': return { label: '🍳 Recipes', bg: 'bg-[#6B8F71]/10 dark:bg-emerald-900/20', text: 'text-[#6B8F71] dark:text-emerald-400' };
      case 'moderation': return { label: '⚠️ Moderation', bg: 'bg-amber-100/60 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400' };
      case 'portion': return { label: '📊 Daily Intake', bg: 'bg-blue-100/60 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400' };
    }
  };

  const badge = getBadgeConfig();

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 bg-surface-container dark:bg-dark-surface-container rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <BookOpen className="w-4 h-4 text-on-surface-variant dark:text-dark-text-secondary" />
        </div>
        <div>
          <h3
            className="text-xl text-on-surface dark:text-dark-text mb-1"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}
          >
            {guidance.title}
          </h3>
          <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Advice */}
      <p className="text-on-surface-variant dark:text-dark-text-secondary text-sm leading-relaxed mb-6 ml-12">
        {guidance.advice}
      </p>

      {/* Recipe Cards */}
      {guidance.type === 'recipe' && guidance.recipes && guidance.recipes.length > 0 && (
        <div className="space-y-4 ml-12">
          {guidance.recipes.map((recipe, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-dark-surface rounded-xl p-5 border border-outline-variant/40 dark:border-dark-border shadow-sm dark:shadow-dark-elevation-1 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <h4
                    className="text-base text-on-surface dark:text-dark-text mb-2"
                    style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}
                  >
                    {recipe.name}
                  </h4>
                  <p className="text-sm text-on-surface-variant dark:text-dark-text-secondary leading-relaxed">
                    {recipe.description}
                  </p>
                </div>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.youtubeSearchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border border-outline-variant dark:border-dark-border rounded-lg text-on-surface dark:text-dark-text text-[11px] font-semibold uppercase tracking-wider hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all group"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  Watch
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily Amount */}
      {guidance.type === 'portion' && guidance.dailyAmount && (
        <div className="ml-12 bg-blue-50/60 dark:bg-blue-900/15 border border-blue-200/60 dark:border-blue-800/40 rounded-xl p-6 text-center">
          <p className="text-[10px] font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">Recommended Daily Amount</p>
          <p
            className="text-2xl text-blue-700 dark:text-blue-300"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}
          >
            {guidance.dailyAmount}
          </p>
        </div>
      )}

      {/* Moderation Warning */}
      {guidance.type === 'moderation' && (
        <div className="ml-12 bg-amber-50/60 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-5 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
            This is a processed food item. Consume in minimal quantities and consider healthier alternatives for your health goals.
          </p>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════ Ingredient Row ════════════════════════ */

const IngredientRow: React.FC<{ ingredient: IngredientAnalysis }> = ({ ingredient }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (s: SafetyStatus) => {
    switch (s) {
      case SafetyStatus.SAFE: return { dot: '#6B8F71', text: 'text-[#6B8F71] dark:text-emerald-400', bg: 'bg-[#6B8F71]/8 dark:bg-emerald-900/20' };
      case SafetyStatus.CAUTION: return { dot: '#D4A843', text: 'text-[#D4A843] dark:text-amber-400', bg: 'bg-[#D4A843]/8 dark:bg-amber-900/20' };
      case SafetyStatus.UNSAFE: return { dot: '#C75050', text: 'text-[#C75050] dark:text-rose-400', bg: 'bg-[#C75050]/8 dark:bg-rose-900/20' };
      default: return { dot: '#8B8B8B', text: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800/20' };
    }
  };

  const statusColor = getStatusColor(ingredient.status);

  return (
    <div className={`transition-all duration-200 ${expanded ? 'bg-surface-container/50 dark:bg-dark-surface-container/50' : ''}`}>
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-surface-container/30 dark:hover:bg-dark-surface-dim/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor.dot }} />
          <div>
            <span className="text-sm font-medium text-on-surface dark:text-dark-text">{ingredient.commonName}</span>
            <span className="text-[10px] text-on-surface-variant dark:text-dark-text-secondary font-mono ml-2">{ingredient.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-tight ${statusColor.text} ${statusColor.bg}`}>
            {ingredient.status}
          </span>
          <ChevronDown className={`w-4 h-4 text-on-surface-variant/40 dark:text-dark-text-secondary/40 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-5 animate-fade-in">
          <div className="ml-5 pl-6 border-l border-outline-variant/40 dark:border-dark-border space-y-3">
            <div>
              <p className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-wider mb-1">About</p>
              <p className="text-sm text-on-surface dark:text-dark-text leading-relaxed">{ingredient.description}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-wider mb-1">Rationale</p>
              <p className={`text-sm leading-relaxed font-medium ${statusColor.text}`}>
                {ingredient.reason}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
